const routeButton = document.getElementById("route-button");
const routeLayer = document.getElementById("route-layer");

const ROAD_GRID_STEP = 10;
const MIN_ROAD_WIDTH = 18;
const MAX_SNAP_DISTANCE = 300;

let roadMask = null;
let roadWidth = 0;
let roadHeight = 0;

let roadViewBox = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
};

let routeStart = null;
let routeEnd = null;
let routePath = [];
let routeDistanceMeters = 0;

let roadNetworkReady = false;
let routeSearchRunning = false;
let routeSearchVersion = 0;

window.routeMode = false;
window.renderRouteOverlay = renderRouteOverlay;
window.setRouteMode = setRouteMode;
window.clearRoute = clearRoute;


/* =========================================================
   INITIALIZATION
   ========================================================= */

setRouteButtonStatus("Loading", true);

buildRoadNetwork()
    .then(() => {
        roadNetworkReady = true;
        setRouteButtonStatus("Route", false);
        console.log("Road network ready.");
    })
    .catch(error => {
        console.error("Road network error:", error);
        setRouteButtonStatus("Error", true);
        routeButton.title = "Could not load road network";
    });


async function buildRoadNetwork() {
    const response = await fetch("./map.svg");

    if (!response.ok) {
        throw new Error(`map.svg: HTTP ${response.status}`);
    }

    const svgText = await response.text();
    const documentSVG = new DOMParser().parseFromString(svgText, "image/svg+xml");

    if (documentSVG.querySelector("parsererror")) {
        throw new Error("Could not parse map.svg");
    }

    const root = documentSVG.documentElement;
    const viewBoxAttribute = root.getAttribute("viewBox");

    if (!viewBoxAttribute) {
        throw new Error("map.svg has no viewBox");
    }

    const viewBoxValues = viewBoxAttribute.trim().split(/\s+/).map(Number);

    if (viewBoxValues.length !== 4 || viewBoxValues.some(value => !Number.isFinite(value))) {
        throw new Error("map.svg has an invalid viewBox");
    }

    roadViewBox = {
        x: viewBoxValues[0],
        y: viewBoxValues[1],
        width: viewBoxValues[2],
        height: viewBoxValues[3]
    };

    roadWidth = Math.ceil(roadViewBox.width / ROAD_GRID_STEP);
    roadHeight = Math.ceil(roadViewBox.height / ROAD_GRID_STEP);

    const canvas = document.createElement("canvas");
    canvas.width = roadWidth;
    canvas.height = roadHeight;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    if (!ctx) {
        throw new Error("Could not create road network canvas");
    }

    ctx.setTransform(
        1 / ROAD_GRID_STEP,
        0,
        0,
        1 / ROAD_GRID_STEP,
        -roadViewBox.x / ROAD_GRID_STEP,
        -roadViewBox.y / ROAD_GRID_STEP
    );

    ctx.strokeStyle = "#fff";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const paths = [...documentSVG.querySelectorAll("path")];

    for (const path of paths) {
        if (!isWhiteRoad(path)) continue;

        const d = path.getAttribute("d");
        if (!d) continue;

        const sourceWidth = parseFloat(path.getAttribute("stroke-width")) || 1;
        ctx.lineWidth = Math.max(sourceWidth, MIN_ROAD_WIDTH);

        try {
            ctx.stroke(new Path2D(d));
        } catch (error) {
            console.warn("Skipped invalid SVG path.", error);
        }
    }

    const pixels = ctx.getImageData(0, 0, roadWidth, roadHeight).data;
    roadMask = new Uint8Array(roadWidth * roadHeight);

    for (let i = 0; i < roadMask.length; i++) {
        roadMask[i] = pixels[i * 4 + 3] > 20 ? 1 : 0;
    }

    keepLargestRoadComponent();

    canvas.width = 1;
    canvas.height = 1;
}


function isWhiteRoad(path) {
    const stroke = (path.getAttribute("stroke") || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "");

    return (
        stroke === "white" ||
        stroke === "#fff" ||
        stroke === "#ffffff" ||
        stroke === "rgb(255,255,255)"
    );
}


/* =========================================================
   ROAD COMPONENT
   ========================================================= */

function keepLargestRoadComponent() {
    const total = roadMask.length;
    const labels = new Int32Array(total);
    const queue = new Int32Array(total);

    let componentId = 0;
    let largestComponent = 0;
    let largestSize = 0;

    const directions = [
        [-1, -1], [0, -1], [1, -1],
        [-1,  0],          [1,  0],
        [-1,  1], [0,  1], [1,  1]
    ];

    for (let i = 0; i < total; i++) {
        if (!roadMask[i] || labels[i]) continue;

        componentId++;

        let head = 0;
        let tail = 0;
        let size = 0;

        queue[tail++] = i;
        labels[i] = componentId;

        while (head < tail) {
            const current = queue[head++];
            size++;

            const cx = current % roadWidth;
            const cy = Math.floor(current / roadWidth);

            for (const [dx, dy] of directions) {
                const nx = cx + dx;
                const ny = cy + dy;

                if (nx < 0 || ny < 0 || nx >= roadWidth || ny >= roadHeight) continue;

                const next = ny * roadWidth + nx;

                if (!roadMask[next] || labels[next]) continue;

                labels[next] = componentId;
                queue[tail++] = next;
            }
        }

        if (size > largestSize) {
            largestSize = size;
            largestComponent = componentId;
        }
    }

    for (let i = 0; i < total; i++) {
        if (roadMask[i] && labels[i] !== largestComponent) {
            roadMask[i] = 0;
        }
    }

    console.log(`Main road network: ${largestSize} cells.`);
}


/* =========================================================
   ROUTE MODE
   ========================================================= */

function setRouteMode(enabled) {
    window.routeMode = Boolean(enabled);

    routeButton.classList.toggle("active", window.routeMode);
    viewport.classList.toggle("routing", window.routeMode);

    if (window.routeMode && typeof setMeasurementMode === "function") {
        setMeasurementMode(false);
    }
}

routeButton.addEventListener("click", event => {
    event.stopPropagation();

    if (!roadNetworkReady || routeSearchRunning) return;

    setRouteMode(!window.routeMode);
});

window.addEventListener("keydown", event => {
    if (event.key === "Escape" && window.routeMode) {
        setRouteMode(false);
    }
});


/* =========================================================
   CLEAR
   ========================================================= */

function clearRoute() {
    routeSearchVersion++;

    routeStart = null;
    routeEnd = null;
    routePath = [];
    routeDistanceMeters = 0;
    routeSearchRunning = false;

    renderRouteOverlay();

    if (roadNetworkReady) {
        setRouteButtonStatus("Route", false);
    }
}


/* =========================================================
   SELECT A / B
   ========================================================= */

viewport.addEventListener("click", event => {
    if (!window.routeMode || !roadNetworkReady || routeSearchRunning) return;
    if (event.target.closest("#map-tools")) return;

    const clickedPoint = screenToSVG(event.clientX, event.clientY);
    const snappedPoint = findNearestRoad(clickedPoint);

    if (!snappedPoint) {
        showTemporaryMessage("No road nearby");
        return;
    }

    if (!routeStart || routeEnd) {
        routeStart = snappedPoint;
        routeEnd = null;
        routePath = [];
        routeDistanceMeters = 0;

        renderRouteOverlay();
        return;
    }

    routeEnd = snappedPoint;
    routeSearchRunning = true;

    const currentSearchVersion = ++routeSearchVersion;

    setRouteButtonStatus("Searching", true);
    renderRouteOverlay();

    setTimeout(() => {
        if (currentSearchVersion !== routeSearchVersion) return;

        const result = findShortestRoute(routeStart, routeEnd);

        if (!result) {
            routeEnd = null;
            routePath = [];
            routeDistanceMeters = 0;

            showTemporaryMessage("Route not found");
        } else {
            routePath = simplifyRoute(result.points);

            routeDistanceMeters =
                result.distance *
                ROAD_GRID_STEP *
                (window.METERS_PER_SVG_UNIT || 1);
        }

        routeSearchRunning = false;
        setRouteButtonStatus("Route", false);

        renderRouteOverlay();
    }, 20);
});


/* =========================================================
   SNAP TO ROAD
   ========================================================= */

function findNearestRoad(point) {
    const center = svgToGrid(point);
    const maxRadius = Math.ceil(MAX_SNAP_DISTANCE / ROAD_GRID_STEP);

    let best = null;
    let bestDistance = Infinity;

    for (let radius = 0; radius <= maxRadius; radius++) {
        const minX = center.x - radius;
        const maxX = center.x + radius;
        const minY = center.y - radius;
        const maxY = center.y + radius;

        for (let gx = minX; gx <= maxX; gx++) {
            checkCandidate(gx, minY);
            if (radius > 0) checkCandidate(gx, maxY);
        }

        for (let gy = minY + 1; gy < maxY; gy++) {
            checkCandidate(minX, gy);
            if (radius > 0) checkCandidate(maxX, gy);
        }

        if (best) return best;
    }

    return null;


    function checkCandidate(gx, gy) {
        if (gx < 0 || gy < 0 || gx >= roadWidth || gy >= roadHeight) return;

        const index = gy * roadWidth + gx;
        if (!roadMask[index]) return;

        const dx = gx - center.x;
        const dy = gy - center.y;
        const distance = dx * dx + dy * dy;

        if (distance < bestDistance) {
            bestDistance = distance;
            best = gridToSVG(gx, gy);
        }
    }
}


function svgToGrid(point) {
    return {
        x: clampRoute(
            Math.floor((point.x - roadViewBox.x) / ROAD_GRID_STEP),
            0,
            roadWidth - 1
        ),
        y: clampRoute(
            Math.floor((point.y - roadViewBox.y) / ROAD_GRID_STEP),
            0,
            roadHeight - 1
        )
    };
}


function gridToSVG(gx, gy) {
    return {
        x: roadViewBox.x + (gx + 0.5) * ROAD_GRID_STEP,
        y: roadViewBox.y + (gy + 0.5) * ROAD_GRID_STEP
    };
}


/* =========================================================
   A*
   ========================================================= */

function findShortestRoute(startPoint, endPoint) {
    const startGrid = svgToGrid(startPoint);
    const endGrid = svgToGrid(endPoint);

    const startIndex = startGrid.y * roadWidth + startGrid.x;
    const endIndex = endGrid.y * roadWidth + endGrid.x;

    if (!roadMask[startIndex] || !roadMask[endIndex]) return null;

    const total = roadWidth * roadHeight;

    const gScore = new Float32Array(total);
    const parent = new Int32Array(total);
    const closed = new Uint8Array(total);

    gScore.fill(Infinity);
    parent.fill(-1);

    const heap = new MinHeap();

    gScore[startIndex] = 0;
    heap.push(startIndex, heuristic(startGrid.x, startGrid.y, endGrid.x, endGrid.y));

    const directions = [
        [-1, 0, 1],
        [1, 0, 1],
        [0, -1, 1],
        [0, 1, 1],
        [-1, -1, Math.SQRT2],
        [1, -1, Math.SQRT2],
        [-1, 1, Math.SQRT2],
        [1, 1, Math.SQRT2]
    ];

    while (heap.size > 0) {
        const current = heap.pop();
        const currentIndex = current.index;

        if (closed[currentIndex]) continue;

        if (currentIndex === endIndex) {
            return reconstructRoute(parent, gScore[endIndex], endIndex);
        }

        closed[currentIndex] = 1;

        const cx = currentIndex % roadWidth;
        const cy = Math.floor(currentIndex / roadWidth);

        for (const [dx, dy, moveCost] of directions) {
            const nx = cx + dx;
            const ny = cy + dy;

            if (nx < 0 || ny < 0 || nx >= roadWidth || ny >= roadHeight) continue;

            const nextIndex = ny * roadWidth + nx;

            if (!roadMask[nextIndex] || closed[nextIndex]) continue;

            const candidateScore = gScore[currentIndex] + moveCost;

            if (candidateScore >= gScore[nextIndex]) continue;

            parent[nextIndex] = currentIndex;
            gScore[nextIndex] = candidateScore;

            const priority = candidateScore + heuristic(nx, ny, endGrid.x, endGrid.y);
            heap.push(nextIndex, priority);
        }
    }

    return null;
}


function heuristic(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
}


function reconstructRoute(parent, distance, endIndex) {
    const indices = [];
    let current = endIndex;

    while (current !== -1) {
        indices.push(current);
        current = parent[current];
    }

    indices.reverse();

    const points = indices.map(index => {
        const gx = index % roadWidth;
        const gy = Math.floor(index / roadWidth);

        return gridToSVG(gx, gy);
    });

    return { points, distance };
}


/* =========================================================
   ROUTE SIMPLIFICATION
   ========================================================= */

function simplifyRoute(points) {
    if (points.length <= 2) return points;

    const result = [points[0]];

    let lastDX = null;
    let lastDY = null;

    for (let i = 1; i < points.length; i++) {
        const dx = Math.sign(points[i].x - points[i - 1].x);
        const dy = Math.sign(points[i].y - points[i - 1].y);

        if (lastDX !== null && (dx !== lastDX || dy !== lastDY)) {
            result.push(points[i - 1]);
        }

        lastDX = dx;
        lastDY = dy;
    }

    result.push(points[points.length - 1]);

    return result;
}


/* =========================================================
   ROUTE RENDERER
   ========================================================= */

function renderRouteOverlay() {
    routeLayer.innerHTML = "";

    if (routePath.length > 1) {
        const screenPoints = routePath.map(svgToScreen);
        const points = screenPoints.map(point => `${point.x},${point.y}`).join(" ");

        const outline = createRouteSVGElement("polyline");
        outline.setAttribute("points", points);
        outline.setAttribute("class", "route-line-outline");
        routeLayer.appendChild(outline);

        const line = createRouteSVGElement("polyline");
        line.setAttribute("points", points);
        line.setAttribute("class", "route-line");
        routeLayer.appendChild(line);
    }

    if (routeStart) {
        drawRouteMarker(routeStart, "A", false);
    }

    if (routeEnd) {
        drawRouteMarker(routeEnd, "B", true);

        if (routePath.length > 1) {
            drawDistanceLabel(routeEnd);
        }
    }
}


function drawRouteMarker(point, text, isEnd) {
    const screen = svgToScreen(point);

    const circle = createRouteSVGElement("circle");
    circle.setAttribute("cx", screen.x);
    circle.setAttribute("cy", screen.y);
    circle.setAttribute("r", 8);
    circle.setAttribute("class", isEnd ? "route-point route-point-end" : "route-point");
    routeLayer.appendChild(circle);

    const label = createRouteSVGElement("text");
    label.setAttribute("x", screen.x + 13);
    label.setAttribute("y", screen.y - 11);
    label.setAttribute("class", "route-marker-label");
    label.textContent = text;
    routeLayer.appendChild(label);
}


function drawDistanceLabel(point) {
    const screen = svgToScreen(point);

    const label = createRouteSVGElement("text");
    label.setAttribute("x", screen.x + 13);
    label.setAttribute("y", screen.y + 26);
    label.setAttribute("class", "route-distance-label");
    label.textContent = formatRouteDistance(routeDistanceMeters);
    routeLayer.appendChild(label);
}


function formatRouteDistance(meters) {
    if (meters < 1000) return `${Math.round(meters)} m`;

    const km = meters / 1000;
    return km < 10 ? `${km.toFixed(2)} km` : `${km.toFixed(1)} km`;
}


/* =========================================================
   MIN HEAP
   ========================================================= */

class MinHeap {
    constructor() {
        this.items = [];
    }

    get size() {
        return this.items.length;
    }

    push(index, priority) {
        this.items.push({ index, priority });
        this.bubbleUp(this.items.length - 1);
    }

    pop() {
        const first = this.items[0];
        const last = this.items.pop();

        if (this.items.length > 0) {
            this.items[0] = last;
            this.bubbleDown(0);
        }

        return first;
    }

    bubbleUp(index) {
        while (index > 0) {
            const parent = Math.floor((index - 1) / 2);

            if (this.items[parent].priority <= this.items[index].priority) break;

            [this.items[parent], this.items[index]] = [this.items[index], this.items[parent]];
            index = parent;
        }
    }

    bubbleDown(index) {
        const length = this.items.length;

        while (true) {
            let smallest = index;

            const left = index * 2 + 1;
            const right = index * 2 + 2;

            if (left < length && this.items[left].priority < this.items[smallest].priority) {
                smallest = left;
            }

            if (right < length && this.items[right].priority < this.items[smallest].priority) {
                smallest = right;
            }

            if (smallest === index) break;

            [this.items[smallest], this.items[index]] = [this.items[index], this.items[smallest]];
            index = smallest;
        }
    }
}


/* =========================================================
   UI HELPERS
   ========================================================= */

function setRouteButtonStatus(text, disabled) {
    routeButton.textContent = text;
    routeButton.disabled = disabled;
}


function showTemporaryMessage(message) {
    routeButton.textContent = message;

    setTimeout(() => {
        if (!routeSearchRunning) {
            routeButton.textContent = roadNetworkReady ? "Route" : "Loading";
        }
    }, 1200);
}


/* =========================================================
   HELPERS
   ========================================================= */

function createRouteSVGElement(tag) {
    return document.createElementNS("http://www.w3.org/2000/svg", tag);
}


function clampRoute(value, min, max) {
    return Math.min(Math.max(value, min), max);
}