const viewport = document.getElementById("map");
const mapImage = document.getElementById("map-image");
const measurementLayer = document.getElementById("measurement-layer");

const measureButton = document.getElementById("measure-button");
const clearButton = document.getElementById("clear-button");
const mapTools = document.getElementById("map-tools");

const METERS_PER_SVG_UNIT = 1;
window.METERS_PER_SVG_UNIT = METERS_PER_SVG_UNIT;

let scale = 1;
let x = 0;
let y = 0;

let fitScale = 1;
let minScale = 1;
let maxScale = 1;

let imageWidth = 0;
let imageHeight = 0;

let dragging = false;
let dragStartX = 0;
let dragStartY = 0;
let startX = 0;
let startY = 0;

const activePointers = new Map();

let pinchMode = false;
let pinchStartDistance = 0;
let pinchStartScale = 1;
let pinchMapPoint = null;

let renderRequested = false;

let wheelTargetScale = 1;
let wheelZoomFrame = null;
let wheelAnchorX = 0;
let wheelAnchorY = 0;

let measurementMode = false;
let measurementPoints = [];


/* =========================================================
   RENDER
   ========================================================= */

function requestRender() {
    if (renderRequested) return;

    renderRequested = true;
    requestAnimationFrame(render);
}

function render() {
    renderRequested = false;

    mapImage.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;

    renderMeasurement();

    if (window.renderRouteOverlay) {
        window.renderRouteOverlay();
    }
}


/* =========================================================
   INITIAL MAP FIT
   ========================================================= */

function fitMap() {
    imageWidth = mapImage.naturalWidth;
    imageHeight = mapImage.naturalHeight;

    if (!imageWidth || !imageHeight) {
        console.error("Could not determine map.svg dimensions.");
        return;
    }

    const viewportWidth = viewport.clientWidth;
    const viewportHeight = viewport.clientHeight;
    const padding = 0.94;

    fitScale = Math.min(
        viewportWidth / imageWidth,
        viewportHeight / imageHeight
    ) * padding;

    scale = fitScale;
    wheelTargetScale = scale;

    minScale = fitScale * 0.75;
    maxScale = fitScale * 20;

    centerMap();
    requestRender();
}

function centerMap() {
    const displayedWidth = imageWidth * scale;
    const displayedHeight = imageHeight * scale;

    x = (viewport.clientWidth - displayedWidth) / 2;
    y = (viewport.clientHeight - displayedHeight) / 2;
}


/* =========================================================
   ZOOM
   ========================================================= */

viewport.addEventListener("wheel", event => {
    event.preventDefault();

    if (!imageWidth) return;

    const rect = viewport.getBoundingClientRect();

    wheelAnchorX = event.clientX - rect.left;
    wheelAnchorY = event.clientY - rect.top;

    let delta = event.deltaY;

    if (event.deltaMode === 1) delta *= 16;
    if (event.deltaMode === 2) delta *= viewport.clientHeight;

    delta = clamp(delta, -100, 100);

    const zoomFactor = Math.exp(-delta * 0.0009);
    wheelTargetScale = clamp(wheelTargetScale * zoomFactor, minScale, maxScale);

    if (!wheelZoomFrame) {
        wheelZoomFrame = requestAnimationFrame(animateWheelZoom);
    }
}, { passive: false });


function animateWheelZoom() {
    const difference = wheelTargetScale - scale;

    if (Math.abs(difference) < 0.00001) {
        zoomAt(wheelTargetScale, wheelAnchorX, wheelAnchorY);
        wheelZoomFrame = null;
        return;
    }

    const nextScale = scale + difference * 0.25;

    zoomAt(nextScale, wheelAnchorX, wheelAnchorY);
    wheelZoomFrame = requestAnimationFrame(animateWheelZoom);
}


function zoomAt(newScale, screenX, screenY) {
    const mapX = (screenX - x) / scale;
    const mapY = (screenY - y) / scale;

    scale = clamp(newScale, minScale, maxScale);

    x = screenX - mapX * scale;
    y = screenY - mapY * scale;

    requestRender();
}


function stopWheelZoom() {
    if (wheelZoomFrame) {
        cancelAnimationFrame(wheelZoomFrame);
        wheelZoomFrame = null;
    }

    wheelTargetScale = scale;
}


/* =========================================================
   PAN + TOUCH PINCH ZOOM
   ========================================================= */

viewport.addEventListener("pointerdown", event => {
    stopWheelZoom();

    const isMouse = event.pointerType === "mouse";
    const isLeftButton = event.button === 0;
    const isRightButton = event.button === 2;
    const pointToolActive = measurementMode || window.routeMode;

    if (event.pointerType === "touch") {
        activePointers.set(event.pointerId, {
            x: event.clientX,
            y: event.clientY
        });

        viewport.setPointerCapture(event.pointerId);

        if (activePointers.size === 2) {
            startPinch();
            return;
        }

        if (activePointers.size === 1) {
            dragging = true;
            viewport.classList.add("dragging");

            dragStartX = event.clientX;
            dragStartY = event.clientY;
            startX = x;
            startY = y;
        }

        return;
    }

    if (pointToolActive) {
        if (isMouse && isLeftButton) return;
        if (isMouse && !isRightButton) return;
    } else {
        if (isMouse && !isLeftButton) return;
    }

    if (isRightButton) event.preventDefault();

    dragging = true;
    viewport.classList.add("dragging");

    dragStartX = event.clientX;
    dragStartY = event.clientY;
    startX = x;
    startY = y;

    viewport.setPointerCapture(event.pointerId);
});


viewport.addEventListener("pointermove", event => {
    if (event.pointerType === "touch" && activePointers.has(event.pointerId)) {
        activePointers.set(event.pointerId, {
            x: event.clientX,
            y: event.clientY
        });

        if (pinchMode && activePointers.size >= 2) {
            updatePinch();
            return;
        }
    }

    if (!dragging) return;

    const dx = event.clientX - dragStartX;
    const dy = event.clientY - dragStartY;

    x = startX + dx;
    y = startY + dy;

    constrainMap();
    requestRender();
});


viewport.addEventListener("pointerup", stopPointer);
viewport.addEventListener("pointercancel", stopPointer);


function stopPointer(event) {
    if (event.pointerType === "touch") {
        activePointers.delete(event.pointerId);

        if (pinchMode && activePointers.size < 2) {
            pinchMode = false;

            if (activePointers.size === 1) {
                const remainingPointer = [...activePointers.values()][0];

                dragging = true;
                dragStartX = remainingPointer.x;
                dragStartY = remainingPointer.y;
                startX = x;
                startY = y;
            } else {
                dragging = false;
                viewport.classList.remove("dragging");
            }
        } else if (activePointers.size === 0) {
            dragging = false;
            viewport.classList.remove("dragging");
        }
    } else {
        dragging = false;
        viewport.classList.remove("dragging");
    }

    if (viewport.hasPointerCapture(event.pointerId)) {
        viewport.releasePointerCapture(event.pointerId);
    }
}


function startPinch() {
    const pointers = [...activePointers.values()];

    const p1 = pointers[0];
    const p2 = pointers[1];

    pinchMode = true;
    dragging = false;

    pinchStartDistance = Math.hypot(
        p2.x - p1.x,
        p2.y - p1.y
    );

    pinchStartScale = scale;

    const rect = viewport.getBoundingClientRect();

    const midpointX = (p1.x + p2.x) / 2 - rect.left;
    const midpointY = (p1.y + p2.y) / 2 - rect.top;

    pinchMapPoint = {
        x: (midpointX - x) / scale,
        y: (midpointY - y) / scale
    };
}


function updatePinch() {
    const pointers = [...activePointers.values()];

    if (pointers.length < 2) return;

    const p1 = pointers[0];
    const p2 = pointers[1];

    const distance = Math.hypot(
        p2.x - p1.x,
        p2.y - p1.y
    );

    if (!pinchStartDistance) return;

    const newScale = clamp(
        pinchStartScale * (distance / pinchStartDistance),
        minScale,
        maxScale
    );

    const rect = viewport.getBoundingClientRect();

    const midpointX = (p1.x + p2.x) / 2 - rect.left;
    const midpointY = (p1.y + p2.y) / 2 - rect.top;

    x = midpointX - pinchMapPoint.x * newScale;
    y = midpointY - pinchMapPoint.y * newScale;
    scale = newScale;

    requestRender();
}

function stopDragging(event) {
    if (!dragging) return;

    dragging = false;
    viewport.classList.remove("dragging");

    if (viewport.hasPointerCapture(event.pointerId)) {
        viewport.releasePointerCapture(event.pointerId);
    }
}


/* =========================================================
   MAP BOUNDS
   ========================================================= */

function constrainMap() {
    const viewportWidth = viewport.clientWidth;
    const viewportHeight = viewport.clientHeight;

    const mapWidth = imageWidth * scale;
    const mapHeight = imageHeight * scale;

    const marginX = viewportWidth * 0.15;
    const marginY = viewportHeight * 0.15;

    if (mapWidth > viewportWidth) {
        x = clamp(x, viewportWidth - mapWidth - marginX, marginX);
    } else {
        x = clamp(x, marginX - mapWidth, viewportWidth - marginX);
    }

    if (mapHeight > viewportHeight) {
        y = clamp(y, viewportHeight - mapHeight - marginY, marginY);
    } else {
        y = clamp(y, marginY - mapHeight, viewportHeight - marginY);
    }
}


/* =========================================================
   RESIZE / LOAD
   ========================================================= */

let resizeTimer = null;

window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fitMap, 100);
});

mapImage.addEventListener("load", fitMap);

if (mapImage.complete) {
    fitMap();
}


/* =========================================================
   MEASURE TOOL
   ========================================================= */

function setMeasurementMode(enabled) {
    measurementMode = Boolean(enabled);

    measureButton.classList.toggle("active", measurementMode);
    viewport.classList.toggle("measuring", measurementMode);
}

measureButton.addEventListener("click", event => {
    event.stopPropagation();

    if (!measurementMode && window.setRouteMode) {
        window.setRouteMode(false);
    }

    setMeasurementMode(!measurementMode);
});

viewport.addEventListener("click", event => {
    if (!measurementMode) return;
    if (event.target.closest("#map-tools")) return;

    measurementPoints.push(screenToSVG(event.clientX, event.clientY));
    renderMeasurement();
});

window.addEventListener("keydown", event => {
    if (event.key === "Escape" && measurementMode) {
        setMeasurementMode(false);
    }
});


/* =========================================================
   CLEAR
   ========================================================= */

clearButton.addEventListener("click", event => {
    event.stopPropagation();

    measurementPoints = [];
    renderMeasurement();

    if (window.clearRoute) {
        window.clearRoute();
    }
});


/* =========================================================
   TOOLBAR
   ========================================================= */

mapTools.addEventListener("pointerdown", event => {
    event.stopPropagation();
});

viewport.addEventListener("contextmenu", event => {
    if (measurementMode || window.routeMode) {
        event.preventDefault();
    }
});


/* =========================================================
   COORDINATES
   ========================================================= */

function screenToSVG(clientX, clientY) {
    const rect = viewport.getBoundingClientRect();

    return {
        x: (clientX - rect.left - x) / scale,
        y: (clientY - rect.top - y) / scale
    };
}

function svgToScreen(point) {
    return {
        x: x + point.x * scale,
        y: y + point.y * scale
    };
}


/* =========================================================
   DISTANCE
   ========================================================= */

function getMeasurementDistanceMeters() {
    let totalSVGUnits = 0;

    for (let i = 1; i < measurementPoints.length; i++) {
        const previous = measurementPoints[i - 1];
        const current = measurementPoints[i];

        totalSVGUnits += Math.hypot(
            current.x - previous.x,
            current.y - previous.y
        );
    }

    return totalSVGUnits * METERS_PER_SVG_UNIT;
}

function formatDistance(meters) {
    if (meters < 1000) {
        return `${Math.round(meters)} m`;
    }

    const km = meters / 1000;
    return km < 10 ? `${km.toFixed(2)} km` : `${km.toFixed(1)} km`;
}


/* =========================================================
   MEASUREMENT RENDERER
   ========================================================= */

function renderMeasurement() {
    measurementLayer.innerHTML = "";

    if (measurementPoints.length === 0) return;

    const screenPoints = measurementPoints.map(svgToScreen);

    for (const point of screenPoints) {
        const circle = createSVGElement("circle");

        circle.setAttribute("cx", point.x);
        circle.setAttribute("cy", point.y);
        circle.setAttribute("r", 6);
        circle.setAttribute("class", "measurement-point");

        measurementLayer.appendChild(circle);
    }

    if (screenPoints.length < 2) return;

    const pointsAttribute = screenPoints
        .map(point => `${point.x},${point.y}`)
        .join(" ");

    const outline = createSVGElement("polyline");
    outline.setAttribute("points", pointsAttribute);
    outline.setAttribute("class", "measurement-line-outline");
    measurementLayer.appendChild(outline);

    const line = createSVGElement("polyline");
    line.setAttribute("points", pointsAttribute);
    line.setAttribute("class", "measurement-line");
    measurementLayer.appendChild(line);

    const lastPoint = screenPoints[screenPoints.length - 1];
    const distance = getMeasurementDistanceMeters();

    const label = createSVGElement("text");
    label.setAttribute("x", lastPoint.x + 12);
    label.setAttribute("y", lastPoint.y - 12);
    label.setAttribute("class", "measurement-label");
    label.textContent = formatDistance(distance);

    measurementLayer.appendChild(label);
}


/* =========================================================
   UTILS
   ========================================================= */

function createSVGElement(tag) {
    return document.createElementNS("http://www.w3.org/2000/svg", tag);
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}