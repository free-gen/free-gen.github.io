// ServiceWorker
// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/sw.js')
//     .then(() => console.log('SW registered'))
//     .catch(err => console.warn('SW failed:', err));
// }

// Набор SVG Иконок
const ICONS = {
    SUN: `<svg viewBox="0 -960 960 960">
        <path d="M440-760v-160h80v160h-80Zm266 110-55-55 112-115 56 57-113 113Zm54 210v-80h160v80H760ZM440-40v-160h80v160h-80ZM254-652 140-763l57-56 113 113-56 54Zm508 512L651-255l54-54 114 110-57 59ZM40-440v-80h160v80H40Zm157 300-56-57 112-112 29 27 29 28-114 114Zm113-170q-70-70-70-170t70-170q70-70 170-70t170 70q70 70 70 170t-70 170q-70 70-170 70t-170-70Z"/>
    </svg>`,
    
    MOON: `<svg viewBox="0 -960 960 960">
        <path d="M560-80q-82 0-155-31.5t-127.5-86Q223-252 191.5-325T160-480.5q0-82.5 31.5-155t86-127Q332-817 405-848.5T560-880q54 0 105 14t95 40q-91 53-145.5 143.5T560-480q0 112 54.5 202.5T760-134q-44 26-95 40T560-80Z"/>
    </svg>`,
    
    WIFI: `<svg viewBox="0 -960 960 960">
        <path d="M409-149q-29-29-29-71t29-71q29-29 71-29t71 29q29 29 29 71t-29 71q-29 29-71 29t-71-29ZM254-346l-84-86q59-59 138.5-93.5T480-560q92 0 171.5 35T790-430l-84 84q-44-44-102-69t-124-25q-66 0-124 25t-102 69ZM84-516 0-600q92-94 215-147t265-53q142 0 265 53t215 147l-84 84q-77-77-178.5-120.5T480-680q-116 0-217.5 43.5T84-516Z"/>
    </svg>`,

    LED: `<svg viewBox="0 -960 960 960">
        <path d="M400-240q-33 0-56.5-23.5T320-320v-50q-57-39-88.5-100T200-600q0-117 81.5-198.5T480-880q117 0 198.5 81.5T760-600q0 69-31.5 129.5T640-370v50q0 33-23.5 56.5T560-240H400Zm0 160q-17 0-28.5-11.5T360-120v-40h240v40q0 17-11.5 28.5T560-80H400Z"/>
    </svg>`,
    
    SC: `<svg viewBox="0 -960 960 960">
        <path d="M424-80q-51 0-77.5-30.5T320-180q0-26 11.5-50.5T367-271q22-14 35.5-36t18.5-47l-12-6q-6-3-11-7l-92 33q-17 6-33 10t-33 4q-63 0-111.5-55T80-536q0-51 30.5-77.5T179-640q26 0 51 11.5t41 35.5q14 22 36 35.5t47 18.5l6-12q3-6 7-11l-33-92q-6-17-10-33t-4-32q0-64 55-112.5T536-880q51 0 77.5 30.5T640-781q0 26-11.5 51T593-689q-22 14-35.5 36T539-606l12 6q6 3 11 7l92-34q17-6 32.5-9.5T719-640q81 0 121 67t40 149q0 51-32 77.5T777-320q-25 0-48.5-11.5T689-367q-14-22-36-35.5T606-421l-6 12q-3 6-7 11l33 92q6 16 10 30.5t4 30.5q1 65-54 115T424-80Zm56-340q25 0 42.5-17.5T540-480q0-25-17.5-42.5T480-540q-25 0-42.5 17.5T420-480q0 25 17.5 42.5T480-420Z"/>
    </svg>`,
    
    PS5: `<svg viewBox="0 -960 960 960">
        <path d="M880-424q0 51-32 77.5T777-320q-6 0-12-.5t-12-2.5L459-618q8-42 31-78t59-60q6-4 8.5-10.5T560-781q0-8-6.5-13.5T536-800q-38 0-86 16t-50 65q0 16 5 31t13 30l-94-94q13-54 66.5-91T536-880q51 0 77.5 30.5T640-781q0 26-11.5 51T593-689q-22 14-35.5 36T539-606l12 6q6 3 11 7l92-34q17-6 32.5-9.5T719-640q81 0 121 67t40 149ZM819-28 637-211q-13 54-66.5 92.5T424-80q-51 0-77.5-30.5T320-180q0-26 11.5-50.5T367-271q22-14 35.5-36t18.5-47l-12-6q-6-3-11-7l-92 33q-17 6-33 10t-33 4q-63 0-111.5-55T80-536q0-51 30.5-77.5T179-640q8 0 16.5 1t16.5 3L27-820l57-57L876-85l-57 57Zm-42-372q9 0 16-5t7-19q0-38-16-86.5T719-560q-9 0-17 1.5t-15 4.5l-75 28q2 6 3.5 12.5T618-501q42 8 78 30.5t60 59.5q3 5 9 8t12 3Zm-537 0q10 0 18.5-2.5T273-407l75-27q-2-6-3.5-12.5T342-459q-42-8-76.5-29.5T212-538q-9-14-17-18t-16-4q-9 0-14 6t-5 18q0 54 20.5 95t59.5 41Zm184 240q62 0 100-24.5t36-63.5q0-10-4-26t-14-32l-37-37q-11 42-34 78t-60 61q-5 3-8 10t-3 14q2 9 7.5 14.5T424-160Zm194-341Zm-276 42Zm163 116Zm-46-275Z"/>
    </svg>`,

    VAPPLY: `<svg viewBox="0 -960 960 960">
        <path d="M320-200v-560l440 280-440 280"/>
    </svg>`,

    VSAVE: `<svg viewBox="0 -960 960 960">
        <path d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160ZM565-275q35-35 35-85t-35-85q-35-35-85-35t-85 35q-35 35-35 85t35 85q35 35 85 35t85-35ZM240-560h360v-160H240v160Z"/>
    </svg>`,

    CLOSE: `<svg viewBox="0 -960 960 960">
        <path d="m336-280-56-56 144-144-144-143 56-56 144 144 143-144 56 56-144 143 144 144-56 56-143-144-144 144Z"/>
    </svg>`
};

// Калибровочные коэффициенты ws2812 (исправление цветопередачи светодиодов)
// const G_CORRECTION = 0.64;
// const B_CORRECTION = 0.92;
// const R_CORRECTION = 1.0;

// Проброс иконок в HTML
document.getElementById('wifiBtn').innerHTML = ICONS.WIFI;
document.getElementById('rgb_btn').innerHTML = ICONS.LED;
document.querySelectorAll('.v-apply').forEach(btn => {
    btn.innerHTML = ICONS.VAPPLY;
});
document.querySelectorAll('.v-save').forEach(btn => {
    btn.innerHTML = ICONS.VSAVE;
});
document.getElementById('t_btn').innerHTML = ICONS.SUN;
document.getElementById('sc_btn').innerHTML = ICONS.PS5;

let is = 0,
    th = [],
    fh = [],
    first = 1,
    ang = 0,
    curSpeed = 0,
    targetSpeed = 0,
    lu = Date.now(),
    activeDot = null,
    sliderTimer = null,
    skTimer = null,
    smTimer = null,
    lastFetchId = 0,
    sliderFetchId = 0,
    skFetchId = 0,
    smFetchId = 0,
    updating = false,
    sliderPending = false,
    skPending = false,
    smPending = false,
    curvePending = false;

const mX = (t) => t * 2,
    uX = (x) => Math.round(x / 2),
    mY = (s) => 100 - s,
    uY = (y) => Math.round(100 - y);

const aura = document.getElementById("aura");

const vidToVoltage = [
    0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
    0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.35, 1.344, 1.338, 1.331, 1.325, 1.319, 1.313, 1.306, 1.3, 1.294,
    1.288, 1.281, 1.275, 1.269, 1.263, 1.256, 1.25, 1.244, 1.238, 1.231, 1.225, 1.219, 1.213, 1.206, 1.2, 1.194, 1.188,
    1.181, 1.175, 1.169, 1.163, 1.156, 1.15, 1.144, 1.138, 1.131, 1.125, 1.119, 1.113, 1.106, 1.1, 1.094, 1.088, 1.081,
    1.075, 1.069, 1.063, 1.056, 1.05, 1.044, 1.038, 1.031, 1.025, 1.019, 1.013, 1.006, 1.0, 0.994, 0.988, 0.981, 0.975,
    0.969, 0.963, 0.956, 0.95, 0.944, 0.938, 0.931, 0.925, 0.919, 0.913, 0.906, 0.9, 0.894, 0.888, 0.881, 0.875, 0.869,
    0.863, 0.856, 0.85, 0.844, 0.838, 0.831, 0.825, 0.819, 0.813, 0.806, 0.8, 0.794, 0.788, 0.781, 0.775, 0.769, 0.763,
    0.756, 0.75, 0.744, 0.738, 0.731, 0.725, 0.719, 0.713, 0.706, 0.7, 0.694, 0.688, 0.681, 0.675, 0.669, 0.663, 0.656,
    0.65, 0.644, 0.638, 0.631, 0.625, 0.619, 0.613, 0.606, 0.6, 0.594, 0.588, 0.581, 0.575, 0.569, 0.563, 0.556, 0.55,
    0.544, 0.538, 0.531, 0.525, 0.519, 0.513, 0.506, 0.5, 0.494, 0.488, 0.481, 0.475, 0.469, 0.463, 0.456, 0.45, 0.444,
    0.438, 0.431, 0.425, 0.419, 0.413, 0.406, 0.4, 0.394, 0.388, 0.381, 0.375, 0.369, 0.363, 0.356, 0.35, 0.344, 0.338,
    0.331, 0.325, 0.319, 0.313, 0.306, 0.3, 0.294, 0.288, 0.281, 0.275, 0.269, 0.263, 0.256, 0.25, 0.244, 0.238, 0.231,
    0.225, 0.219, 0.213, 0.206, 0.2, 0.194, 0.188, 0.181, 0.175, 0.169, 0.163, 0.156, 0.15, 0.144, 0.138, 0.131, 0.125,
    0.119, 0.113, 0.106, 0.1, 0.094, 0.088, 0.081, 0.075, 0.069, 0.063, 0.056, 0.05, 0.044, 0.038, 0.031, 0.025, 0.019,
    0.013, 0.006, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
];

const tgBuyLink = "https://t.me/+HshEu_6JjWMwMmRi";
const maxBuyLink = "https://max.ru/join/52OpcJ0yx4NatD67RIg6gproyTJl6HqDJgJpHq0BQEo";
const tgSupportLink = "https://t.me/+8J0dPE1eJHQ2Yjhi";
const maxSupportLink = "https://max.ru/join/7HyV7B_JbUdIGobmfYnE85xCczu0Cr9onffP_uBw4u8";

let choiceType = "";

function previewRGB(temp, color) {
    console.log("previewRGB called, temp=" + temp + ", color=" + color);
    // color приходит в формате "#RRGGBB", убираем решётку
    fetch("/set_rgb_preview?color=" + color.substring(1));
}

function showChoiceModal(type) {
    choiceType = type;
    let modal = document.getElementById("choiceModal");
    let title = document.getElementById("choiceTitle");
    if (type === "buy") {
        title.innerText = "Select a social network for purchase";
        document.getElementById("choiceTelegram").onclick = () => {
            window.open(tgBuyLink, "_blank");
            closeChoiceModal();
        };
        document.getElementById("choiceMax").onclick = () => {
            window.open(maxBuyLink, "_blank");
            closeChoiceModal();
        };
    } else if (type === "support") {
        title.innerText = "Select a social network for support";
        document.getElementById("choiceTelegram").onclick = () => {
            window.open(tgSupportLink, "_blank");
            closeChoiceModal();
        };
        document.getElementById("choiceMax").onclick = () => {
            window.open(maxSupportLink, "_blank");
            closeChoiceModal();
        };
    }
    modal.style.display = "flex";
}

function closeChoiceModal() {
    document.getElementById("choiceModal").style.display = "none";
}

function resetWiFi() {
    if (confirm("Reset Wi-Fi to AP Mode?")) {
        fetch("/reset_wifi").then(() => alert("Resetting... Connect to PS5_Smart_Cooler AP"));
    }
}

let lastFrameTime = performance.now();

function render(now) {
    let dt = (now - lastFrameTime) / 16.66;
    if (isNaN(dt) || dt > 10) dt = 1;
    lastFrameTime = now;
    if (targetSpeed > 0) {
        curSpeed += (targetSpeed - curSpeed) * 0.05 * dt;
        ang += curSpeed * 0.15 * dt;
        aura.style.transform = "rotate(" + ang + "deg)";
        aura.style.opacity = "1";
    } else {
        curSpeed *= Math.pow(0.95, dt);
        ang += curSpeed * 0.15 * dt;
        aura.style.transform = "rotate(" + ang + "deg)";
        if (curSpeed < 0.1) aura.style.opacity = "0";
    }
    requestAnimationFrame(render);
}

requestAnimationFrame(render);

setInterval(() => {
    if (Date.now() - lu > 10000) document.getElementById("gui").classList.add("ui-off");
    else document.getElementById("gui").classList.remove("ui-off");
}, 1000);

function toggleTheme() {
    let l = document.body.classList.toggle("light");
    document.getElementById("t_btn").innerHTML = l ? ICONS.MOON : ICONS.SUN;
    fetch("/set?theme=" + (l ? 1 : 0));
}

function showWifi() {
    document.getElementById("modal").style.display = "flex";
}

function hideWifi() {
    document.getElementById("modal").style.display = "none";
}

function saveW() {
    let s = document.getElementById("ss").value,
        p1 = document.getElementById("pp1").value,
        p2 = document.getElementById("pp2").value,
        h = document.getElementById("hn").value.trim().toLowerCase(),
        m = document.getElementById("wm").checked ? 1 : 0,
        apSsid = document.getElementById("ap_ssid").value,
        apPass = document.getElementById("ap_pass").value;
    let v = /^[a-z0-9-]+$/i;
    if (h.length > 0 && !v.test(h)) {
        alert("Invalid name!");
        return;
    }
    if (s.length < 1) {
        alert("SSID!");
        return;
    }
    if (p1.length > 0 && p1.length < 8) {
        alert("Pass 8 chars");
        return;
    }
    if (p1 !== p2) {
        alert("Mismatch");
        return;
    }
    if (apPass.length > 0 && apPass.length < 8) {
        alert("AP Password must be at least 8 characters");
        return;
    }
    if (confirm("Reboot?")) {
        fetch(
            "/wifiset?ssid=" +
                encodeURIComponent(s) +
                "&pass=" +
                encodeURIComponent(p1) +
                "&host=" +
                encodeURIComponent(h) +
                "&mode=" +
                m +
                "&ap_ssid=" +
                encodeURIComponent(apSsid) +
                "&ap_pass=" +
                encodeURIComponent(apPass)
        ).then(() => alert("Saved!"));
    }
}

function toggleI2C() {
    fetch("/set?i2c_ignore=1").then(() => upd());
}

function sv(v) {
    let l = document.getElementById("lab");
    if (window.u == "m") l.innerText = "MANUAL: " + v + "%";
    if (window.u == "o") l.innerText = "OFFSET: +" + v + "%";
    if (window.u == "tar") l.innerText = "TARGET: " + v + "°C";
    let fetchId = ++sliderFetchId;
    sliderPending = true;
    fetch("/set?" + window.u + "=" + v).then(() => {
        if (fetchId === sliderFetchId) {
            sliderPending = false;
            upd();
        }
    });
}

function sk(v) {
    document.getElementById("k-val-as").innerText = (v / 10).toFixed(1);
    let fetchId = ++skFetchId;
    skPending = true;
    fetch("/set?k=" + v).then(() => {
        if (fetchId === skFetchId) {
            skPending = false;
            upd();
        }
    });
}

function setM(m) {
    fetch("/set?mode=" + m).then(() => upd());
}

function toggleAS() {
    let p = document.getElementById("as-panel"),
        b = document.getElementById("as_btn");
    if (p.style.display == "block") {
        p.style.display = "none";
        b.style.color = "#888";
        b.style.borderColor = "var(--border)";
    } else {
        p.style.display = "block";
        b.style.color = "var(--accent)";
        b.style.borderColor = "var(--accent)";
    }
}

let pinInputUnlocked = false;

function showRiskModal(callback) {
    let modal = document.getElementById("riskModal");
    let acceptBtn = document.getElementById("riskAcceptBtn");
    modal.style.display = "flex";
    let handler = function () {
        acceptBtn.removeEventListener("click", handler);
        closeRiskModal();
        if (callback) callback();
    };
    acceptBtn.addEventListener("click", handler);
}

function closeRiskModal() {
    document.getElementById("riskModal").style.display = "none";
}

function requestPinInputAccess() {
    if (pinInputUnlocked) {
        // Если уже разблокировано – просто фокусируем поле
        document.getElementById('pinInput').focus();
        return;
    }
    // Показываем модалку с рисками
    showRiskModal(() => {
        pinInputUnlocked = true;
        let pinField = document.getElementById('pinInput');
        pinField.removeAttribute('readonly'); // убираем readonly
        // Небольшая задержка для iOS, чтобы клавиатура точно открылась
        setTimeout(() => {
            pinField.focus();
        }, 150);
    });
}

function checkPin() {
    if (!pinInputUnlocked) {
        alert("Please click on PIN field and accept risks first");
        return;
    }
    let pin = document.getElementById("pinInput").value;
    if (!pin || pin.length !== 4) {
        alert("Enter 4-digit PIN");
        return;
    }
    fetch("/check_pin?pin=" + pin).then((response) => {
        if (response.ok) {
            document.getElementById("pinBlock").style.display = "none";
            document.getElementById("voltageControl").style.display = "block";
            document.getElementById("pmbusDirect").style.display = "block";
            loadVoltageOptionsAll();
            document.getElementById("autoLoadSettings").style.display = "block";
        } else alert("Invalid PIN");
    });
}

function loadVoltageOptions() {
    let select = document.getElementById("voutVoltage");
    select.innerHTML = "";
    for (let vid = 0; vid <= 255; vid++) {
        let voltage = vidToVoltage[vid];
        if (voltage >= 0.7 && voltage <= 1.25) {
            let option = document.createElement("option");
            option.value = vid;
            option.text = voltage.toFixed(3) + " V";
            select.appendChild(option);
        }
    }
}

function applyVoltage() {
    let page = document.getElementById("voutPage").value;
    let reg = document.getElementById("voutReg").value;
    let vid = document.getElementById("voutVoltage").value;
    fetch("/set_vout?page=" + page + "&reg=" + reg + "&vid=" + vid).then(() => upd());
}

function writePMBus() {
    let page = document.getElementById("pmbusPage").value;
    let reg = document.getElementById("pmbusReg").value;
    let val = document.getElementById("pmbusValue").value;
    fetch("/pmbus_write?page=" + page + "&reg=" + reg + "&val=" + val)
        .then((response) => response.text())
        .then((data) => (document.getElementById("pmbusResult").innerText = data));
}

function readPMBus() {
    let page = document.getElementById("pmbusPage").value;
    let reg = document.getElementById("pmbusReg").value;
    fetch("/pmbus_read?page=" + page + "&reg=" + reg)
        .then((response) => response.text())
        .then((data) => (document.getElementById("pmbusResult").innerText = data));
}

function toggleAdvancedMonitoring() {
    let panel = document.getElementById("advancedMonitoring");
    let btn = document.getElementById("am_btn");
    fetch("/toggle_am").then(() => {
        if (panel.style.display === "none") {
            panel.style.display = "block";
            btn.style.color = "var(--accent)";
            btn.style.borderColor = "var(--accent)";
        } else {
            panel.style.display = "none";
            btn.style.color = "#888";
            btn.style.borderColor = "var(--border)";
        }
    });
}

function toggleRGBModal() {
    let modal = document.getElementById("rgbModal");
    if (modal.style.display === "flex") {
        // Закрываем окно - выходим из режима предпросмотра
        fetch("/exit_rgb_preview");
        modal.style.display = "none";
    } else {
        modal.style.display = "flex";
        loadRGBSettings();
    }
}

function sv_sm(v) {
    document.getElementById("sm-val-as").innerText = (v / 1000).toFixed(3);
    let fetchId = ++smFetchId;
    smPending = true;
    fetch("/set?smooth=" + v).then(() => {
        if (fetchId === smFetchId) {
            smPending = false;
            upd();
        }
    });
}

function sc(i, t, v) {
    fetch("/set?idx=" + i + "&c" + t + "=" + v);
}

const drawCurve = (d) => {
    if (activeDot !== null || !d.cx) return;
    const g = document.getElementById("c-dots"),
        l = document.getElementById("c-line"),
        n = document.getElementById("c-now"),
        a = document.getElementById("c-area");
    if (!g || !l) return; // если элементов нет — выходим без ошибок
    let p = "",
        f = "0,100 ";
    g.innerHTML = "";
    d.cx.forEach((v, i) => {
        let x = mX(v),
            y = mY(d.cy[i]);
        p += x + "," + y + " ";
        f += x + "," + y + " ";
        let c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        c.setAttribute("cx", x);
        c.setAttribute("cy", y);
        c.setAttribute("r", "4");
        c.setAttribute("fill", "var(--accent)");
        c.style.cursor = "pointer";
        c.style.touchAction = "none";
        const s = (e) => {
            is = 1;
            activeDot = i;
        };
        c.onmousedown = s;
        c.ontouchstart = s;
        g.appendChild(c);
    });
    f += "200,100";
    l.setAttribute("points", p);
    if (a) a.setAttribute("points", f);
    if (n) {
        n.setAttribute("cx", mX(d.t));
        n.setAttribute("cy", mY(d.out));
        n.setAttribute("r", "4");
        n.style.display = "block";
        n.style.pointerEvents = "none";
    }
};

const doMove = (e) => {
    if (activeDot === null) return;
    e.cancelable && e.preventDefault();
    let v = e.touches ? e.touches[0] : e,
        r = document.getElementById("c-svg").getBoundingClientRect(),
        x = Math.max(0, Math.min(200, ((v.clientX - r.left) / r.width) * 200)),
        y = Math.max(0, Math.min(100, ((v.clientY - r.top) / r.height) * 100)),
        X = uX(x),
        Y = uY(y),
        d = document.getElementById("c-dots").children;
    if (activeDot > 0) {
        let pX = uX(d[activeDot - 1].getAttribute("cx"));
        if (X <= pX) X = pX + 1;
        let pY = uY(d[activeDot - 1].getAttribute("cy"));
        if (Y < pY) Y = pY;
    }
    if (activeDot < d.length - 1) {
        let nX = uX(d[activeDot + 1].getAttribute("cx"));
        if (X >= nX) X = nX - 1;
        let nY = uY(d[activeDot + 1].getAttribute("cy"));
        if (Y > nY) Y = nY;
    }
    document.getElementById("cx-val").innerText = X + "°";
    document.getElementById("cy-val").innerText = Y + "%";
    d[activeDot].setAttribute("cx", mX(X));
    d[activeDot].setAttribute("cy", mY(Y));
    let p = "";
    Array.from(d).forEach((c) => (p += c.getAttribute("cx") + "," + c.getAttribute("cy") + " "));
    document.getElementById("c-line").setAttribute("points", p);
    document.getElementById("c-area").setAttribute("points", "0,100 " + p + " 200,100");
};

const stopMove = () => {
    if (activeDot !== null) {
        let d = document.getElementById("c-dots").children[activeDot];
        let fetchId = ++lastFetchId;
        updating = true;
        curvePending = true;
        fetch("/set?idx=" + activeDot + "&cx=" + uX(d.getAttribute("cx")) + "&cy=" + uY(d.getAttribute("cy"))).then(
            () => {
                if (fetchId === lastFetchId) {
                    curvePending = false;
                    upd();
                    updating = false;
                }
            }
        );
        activeDot = null;
        is = 0;
    }
};

window.addEventListener("mousemove", doMove);
window.addEventListener("touchmove", doMove, { passive: false });
window.addEventListener("mouseup", stopMove);
window.addEventListener("touchend", stopMove);

function editPts(v) {
    fetch("/set?editpts=" + v).then(() => upd());
}

function upd() {
    fetch("/data")
        .then((r) => r.json())
        .then((d) => {
            lu = Date.now();
            document.getElementById("gui").classList.remove("ui-off");
            if (first) {
                if (d.th == 1) {
                    document.body.classList.add("light");
                    document.getElementById('t_btn').innerHTML = ICONS.MOON;
                } else {
                    document.getElementById('t_btn').innerHTML = ICONS.SUN;
                }
                first = 0;
            }
            let tv = document.getElementById("v"),
                ib = document.getElementById("ibadge"),
                il = document.getElementById("i2c_line"),
                ibtn = document.getElementById("i2c_btn");
            if (d.mode >= 1) {
                ibtn.style.opacity = "1";
                ibtn.style.pointerEvents = "auto";
            } else {
                ibtn.style.opacity = "0.2";
                ibtn.style.pointerEvents = "none";
            }
            if (d.i2c_ign) {
                ib.className = "i2c-badge i2c-off";
                il.style.display = "block";
            } else {
                il.style.display = "none";
                ib.className = "i2c-badge " + (d.i2c ? "i2c-ok" : "i2c-err");
            }
            let consoleOff = !d.i2c && d.in == 0 && !d.i2c_ign;
            let showDash = consoleOff || d.pd;
            if (showDash) {
                tv.innerText = "--";
                tv.style.color = "var(--accent)";
                tv.style.opacity = "0.2";
            } else if (d.crit && !d.i2c_ign) {
                tv.innerText = "--";
                tv.style.color = "var(--err)";
                tv.style.opacity = "1";
            } else {
                tv.innerText = d.t;
                tv.style.color = "var(--accent)";
                tv.style.opacity = "1";
            }

            // безопасное обновление элементов, которых может не быть
            let cx = document.getElementById("cx-val");
            if (cx) cx.innerText = showDash ? "--" : d.t + "°";
            let cy = document.getElementById("cy-val");
            if (cy) cy.innerText = d.out + "%";

            if (d.on && d.out > 0) {
                targetSpeed = d.out;
            } else {
                targetSpeed = 0;
            }
            let hue = 180;
            if (d.t > 40) hue = Math.max(0, 180 - (d.t - 40) * 4);
            document.documentElement.style.setProperty("--clr", "hsl(" + hue + ", 100%, 50%)");
            document.getElementById("min-v").innerText = d.min;
            document.getElementById("max-v").innerText = d.max;
            document.getElementById("f-in").innerText = d.in + "%";
            document.getElementById("f-out").innerText = d.out + "%";
            let tempDisplay = document.getElementById("rgbTempDisplay");
            if (tempDisplay) tempDisplay.innerText = d.t + "°C";

            if (d.vin !== undefined) document.getElementById("vin").innerHTML = d.vin.toFixed(2) + " V";
            if (d.vout0 !== undefined) document.getElementById("vout0").innerHTML = d.vout0.toFixed(3) + " V";
            if (d.iout0 !== undefined) document.getElementById("iout0").innerHTML = d.iout0.toFixed(2) + " A";
            if (d.pout0 !== undefined) document.getElementById("pout0").innerHTML = d.pout0.toFixed(1) + " W";
            if (d.vout1 !== undefined) document.getElementById("vout1").innerHTML = d.vout1.toFixed(3) + " V";
            if (d.iout1 !== undefined) document.getElementById("iout1").innerHTML = d.iout1.toFixed(2) + " A";
            if (d.pout1 !== undefined) document.getElementById("pout1").innerHTML = d.pout1.toFixed(1) + " W";
            if (d.temp0 !== undefined) document.getElementById("temp0").innerHTML = d.temp0 + "°C";
            if (d.temp1 !== undefined) document.getElementById("temp1").innerHTML = d.temp1 + "°C";
            if (d.apu_exact !== undefined)
                document.getElementById("apuExact").innerHTML = d.apu_exact.toFixed(2) + "°C";

            document.getElementById("ring").className = "temp-ring" + (d.on ? " ring-on" : "");

            // только если элементы существуют:
            let ms = document.getElementById("main-sld");
            if (ms) ms.style.display = d.mode == 3 ? "none" : "block";
            let ce = document.getElementById("curve-edit");
            if (ce) ce.style.display = d.mode == 3 ? "block" : "none";
            let lb = document.getElementById("lab");
            if (lb) lb.style.display = d.mode == 3 ? "none" : "block";

            [0, 1, 2, 3].forEach((i) => {
                let b = document.getElementById("b" + i);
                if (b) b.className = d.mode == i ? "btn active" : "btn";
            });
            if (d.mode == 3 && activeDot === null && !curvePending && document.getElementById("c-dots")) drawCurve(d);
            if (!is && !sliderPending) {
                let s = document.getElementById("sld");
                let l = document.getElementById("lab");
                if (s && l) {
                    if (d.mode == 0) {
                        l.innerText = "MANUAL: " + d.m + "%";
                        s.value = d.m;
                        s.min = 0;
                        s.max = 100;
                        window.u = "m";
                    }
                    if (d.mode == 1) {
                        l.innerText = "OFFSET: +" + d.o + "%";
                        s.value = d.o;
                        s.min = 0;
                        s.max = 50;
                        window.u = "o";
                    }
                    if (d.mode == 2) {
                        l.innerText = "TARGET: " + d.tar + "°C";
                        s.value = d.tar;
                        s.min = 30;
                        s.max = 90;
                        window.u = "tar";
                    }
                    if (d.mode == 3) {
                        l.innerText = "CURVE EDITOR";
                    }
                }
            }
            th = d.ht;
            fh = d.hf;
            let pt = "",
                pf = "",
                step = 1800 / (th.length > 1 ? th.length - 1 : 1);
            th.forEach((v, i) => (pt += i * step + "," + v * 1.3 + " "));
            fh.forEach((v, i) => (pf += i * step + "," + v * 1.3 + " "));
            let ptemp = document.getElementById("p-temp");
            if (ptemp) ptemp.setAttribute("points", pt);
            let pfan = document.getElementById("p-fan");
            if (pfan) pfan.setAttribute("points", pf);
            let ab = document.getElementById("acb");
            if (ab) {
                ab.innerText = "AUTO-CLEAR STATS: " + (d.ac ? "ON" : "OFF");
                ab.style.color = d.ac ? "var(--accent)" : "#888";
                ab.style.borderColor = d.ac ? "var(--accent)" : "var(--border)";
            }
            let scb = document.getElementById("sc_btn");
            if (scb) {
                scb.innerHTML = d.pwa ? ICONS.SC : ICONS.PS5;
                scb.style.color = d.pwa ? "var(--accent)" : "#555";
                scb.style.borderColor = d.pwa ? "var(--accent)" : "var(--border)";
                scb.style.opacity = d.pwa ? "1" : "0.7";
            }

            let kSld = document.getElementById("k-sld-as");
            if (kSld && !is && !skPending) {
                kSld.value = d.k;
                let kVal = document.getElementById("k-val-as");
                if (kVal) kVal.innerText = (d.k / 10).toFixed(1);
            }
            let smSld = document.getElementById("sm-sld-as");
            if (smSld && !is && !smPending) {
                smSld.value = d.sm;
                let smVal = document.getElementById("sm-val-as");
                if (smVal) smVal.innerText = (d.sm / 1000).toFixed(3);
            }

            if (d.fw) document.getElementById("fw-version").innerText = d.fw;
            // ... остальной код без изменений (pwm_v, deviceId, hostname, ip и т.д.)
            if (d.pwm_v !== undefined) {
                let pwmV = document.getElementById("pwmVoltage");
                if (pwmV) pwmV.innerText = d.pwm_v.toFixed(2);
                let ok = d.pwm_v >= 2.5;
                let statusElem = document.getElementById("pwmStatus");
                if (statusElem) {
                    statusElem.innerHTML = ok ? "✅ OK" : "❌ LOW";
                    statusElem.style.color = ok ? "#22aa55" : "#ff4444";
                }
            }
            if (d.deviceId) {
                let el = document.getElementById("deviceIdSpan");
                if (el) el.innerText = d.deviceId;
            }
            if (d.hostname && d.wm == 1) {
                let el = document.getElementById("hostnameSpan");
                if (el) el.innerText = d.hostname;
            } else if (d.wm == 0) {
                let el = document.getElementById("hostnameSpan");
                if (el) el.innerText = "--";
            }
            if (d.ip) {
                let el = document.getElementById("ipSpan");
                if (el) el.innerText = d.ip;
            }
            let hostnameLink = document.getElementById("hostnameLink");
            if (hostnameLink && d.hostname && d.ip && d.wm == 1 && d.ip != "0.0.0.0") {
                hostnameLink.href = "http://" + d.hostname + ".local";
                hostnameLink.style.color = "var(--accent)";
                hostnameLink.style.cursor = "pointer";
                hostnameLink.style.textDecoration = "none";
            } else if (hostnameLink) {
                hostnameLink.href = "#";
                hostnameLink.style.color = "#888";
                hostnameLink.style.cursor = "default";
                hostnameLink.style.textDecoration = "none";
            }
            let ipLink = document.getElementById("ipLink");
            if (ipLink && d.ip && d.ip != "0.0.0.0") {
                ipLink.href = "http://" + d.ip;
            }
            if (d.fw) {
                let el = document.getElementById("fw-version");
                if (el) el.innerText = d.fw;
            }
            console.log("DEVICE INFO:", d.deviceId, d.hostname, d.ip, d.fw);
            // if (d.savedVid0_cmd !== undefined) {
            //     let toHex = (val) => "0x" + val.toString(16).toUpperCase().padStart(2, "0");
            //     let html = `Saved values:<br>APU_VGFX: CMD=${toHex(d.savedVid0_cmd)}, MAX=${toHex(d.savedVid0_max)}, MH=${toHex(d.savedVid0_mh)}, ML=${toHex(d.savedVid0_ml)}<br>APU_VCORE: CMD=${toHex(d.savedVid1_cmd)}, MAX=${toHex(d.savedVid1_max)}, MH=${toHex(d.savedVid1_mh)}, ML=${toHex(d.savedVid1_ml)}`;
            //     let disp = document.getElementById("savedVidDisplay");
            //     if (disp) disp.innerHTML = html;
            // }
            if (d.savedVid0_cmd !== undefined) {
                let toHex = (val) => "0x" + val.toString(16).toUpperCase().padStart(2, "0");
                let toVoltage = (vid) => vidToVoltage[vid] ? vidToVoltage[vid].toFixed(3) + "V" : "N/A";
                
                let html = `
                    <div style="font-weight:bold; margin-bottom:8px;">Saved values:</div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px 20px;">
                        <div>
                            <div style="font-weight:bold; color:var(--accent); margin-bottom:4px;">APU_VGFX</div>
                            <div>CMD ${toVoltage(d.savedVid0_cmd)} (${toHex(d.savedVid0_cmd)})</div>
                            <div>MAX ${toVoltage(d.savedVid0_max)} (${toHex(d.savedVid0_max)})</div>
                            <div>MH  ${toVoltage(d.savedVid0_mh)} (${toHex(d.savedVid0_mh)})</div>
                            <div>ML  ${toVoltage(d.savedVid0_ml)} (${toHex(d.savedVid0_ml)})</div>
                        </div>
                        <div>
                            <div style="font-weight:bold; color:var(--accent); margin-bottom:4px;">APU_VCORE</div>
                            <div>CMD ${toVoltage(d.savedVid1_cmd)} (${toHex(d.savedVid1_cmd)})</div>
                            <div>MAX ${toVoltage(d.savedVid1_max)} (${toHex(d.savedVid1_max)})</div>
                            <div>MH  ${toVoltage(d.savedVid1_mh)} (${toHex(d.savedVid1_mh)})</div>
                            <div>ML  ${toVoltage(d.savedVid1_ml)} (${toHex(d.savedVid1_ml)})</div>
                        </div>
                    </div>
                `;
                
                let disp = document.getElementById("savedVidDisplay");
                if (disp) disp.innerHTML = html;
            }
            if (d.autoLoadVoltage !== undefined) {
                let el = document.getElementById("autoLoadVoltage");
                if (el) el.checked = d.autoLoadVoltage == 1;
            }
            if (d.autoLoadDelay !== undefined) {
                let slider = document.getElementById("autoLoadDelaySlider");
                if (slider) slider.value = d.autoLoadDelay;
                let valEl = document.getElementById("autoLoadDelayVal");
                if (valEl) valEl.innerText = d.autoLoadDelay;
            }
            if (d.useI2cCheck !== undefined) {
                let el = document.getElementById("useI2cCheck");
                if (el) el.checked = d.useI2cCheck == 1;
            }
            if (d.autoLoadMask0_0 !== undefined) {
                let el = document.getElementById("autoMask_0_0");
                if (el) el.checked = d.autoLoadMask0_0 == 1;
            }
            for (let page = 0; page <= 1; page++) {
                for (let reg = 0; reg <= 3; reg++) {
                    let key = "autoLoadMask" + page + "_" + reg;
                    if (d[key] !== undefined) {
                        let el = document.getElementById("autoMask_" + page + "_" + reg);
                        if (el) el.checked = d[key] == 1;
                    }
                }
            }
            if (d.am !== undefined) {
                let panel = document.getElementById("advancedMonitoring");
                let btn = document.getElementById("am_btn");
                if (d.am == 1) {
                    panel.style.display = "block";
                    btn.style.color = "var(--accent)";
                    btn.style.borderColor = "var(--accent)";
                } else {
                    panel.style.display = "none";
                    btn.style.color = "#888";
                    btn.style.borderColor = "var(--border)";
                }
            }
        });
}

function updateDeviceInfo() {
    fetch("/data")
        .then((r) => r.json())
        .then((d) => {
            if (d.deviceId) {
                let el = document.getElementById("deviceIdSpan");
                if (el) el.innerText = d.deviceId;
            }
            if (d.hostname && d.wm == 1) {
                let el = document.getElementById("hostnameSpan");
                if (el) el.innerText = d.hostname;
            } else if (d.wm == 0) {
                let el = document.getElementById("hostnameSpan");
                if (el) el.innerText = "--";
            }
            if (d.ip) {
                let el = document.getElementById("ipSpan");
                if (el) el.innerText = d.ip;
            }
            if (d.fw) {
                let el = document.getElementById("fw-version");
                if (el) el.innerText = d.fw;
            }
            let hostnameLink = document.getElementById("hostnameLink");
            if (hostnameLink && d.hostname && d.ip && d.wm == 1 && d.ip != "0.0.0.0") {
                hostnameLink.href = "http://" + d.hostname + ".local";
                hostnameLink.style.color = "var(--accent)";
                hostnameLink.style.cursor = "pointer";
                hostnameLink.style.textDecoration = "none";
            } else if (hostnameLink) {
                hostnameLink.href = "#";
                hostnameLink.style.color = "#888";
                hostnameLink.style.cursor = "default";
                hostnameLink.style.textDecoration = "none";
            }
            let ipLink = document.getElementById("ipLink");
            if (ipLink && d.ip && d.ip != "0.0.0.0") {
                ipLink.href = "http://" + d.ip;
            }
        })
        .catch((e) => console.log("Device info error", e));
}

setInterval(updateDeviceInfo, 2000);
updateDeviceInfo();

function loadVoltageOptionsAll() {
    let page = document.getElementById("voutPage").value;
    let selects = ["voutCmd", "voutMax", "voutMarginHigh", "voutMarginLow"];
    for (let id of selects) {
        let select = document.getElementById(id);
        select.innerHTML = "";
        for (let vid = 0; vid <= 255; vid++) {
            let voltage = vidToVoltage[vid];
            if (voltage >= 0.7 && voltage <= 1.25) {
                let option = document.createElement("option");
                option.value = "0x" + vid.toString(16).toUpperCase().padStart(2, "0");
                option.text = option.value + " (" + voltage.toFixed(3) + " V)";
                select.appendChild(option);
            }
        }
    }
}

function applyVoltageAll() {
    let page = document.getElementById("voutPage").value;
    let regs = [
        { id: "voutCmd", reg: 0x21 },
        { id: "voutMax", reg: 0x24 },
        { id: "voutMarginHigh", reg: 0x25 },
        { id: "voutMarginLow", reg: 0x26 },
    ];
    for (let r of regs) {
        let hexStr = document.getElementById(r.id).value;
        if (hexStr) {
            let vid = parseInt(hexStr, 16);
            fetch("/set_vout?page=" + page + "&reg=" + r.reg + "&vid=" + vid);
        }
    }
    setTimeout(() => upd(), 300);
}

function saveVoltageConfig() {
    let page = document.getElementById("voutPage").value;
    let vout_cmd_hex = document.getElementById("voutCmd").value;
    let vout_max_hex = document.getElementById("voutMax").value;
    let margin_high_hex = document.getElementById("voutMarginHigh").value;
    let margin_low_hex = document.getElementById("voutMarginLow").value;
    let vout_cmd = vout_cmd_hex ? parseInt(vout_cmd_hex, 16) : 0;
    let vout_max = vout_max_hex ? parseInt(vout_max_hex, 16) : 0;
    let margin_high = margin_high_hex ? parseInt(margin_high_hex, 16) : 0;
    let margin_low = margin_low_hex ? parseInt(margin_low_hex, 16) : 0;
    let auto = document.getElementById("autoLoadVoltage").checked ? 1 : 0;
    fetch(
        "/save_voltage_config?page=" +
            page +
            "&vout_cmd=" +
            vout_cmd +
            "&vout_max=" +
            vout_max +
            "&margin_high=" +
            margin_high +
            "&margin_low=" +
            margin_low +
            "&auto=" +
            auto
    ).then(() => upd());
}

function toggleAutoLoad() {
    let auto = document.getElementById("autoLoadVoltage").checked ? 1 : 0;
    fetch("/set_autoload?auto=" + auto).then(() => upd());
}

function applySingleRegister(selectId, regAddr) {
    let page = document.getElementById("voutPage").value;
    let hexStr = document.getElementById(selectId).value;
    if (!hexStr) return;
    let vid = parseInt(hexStr, 16);
    fetch("/set_vout?page=" + page + "&reg=" + regAddr + "&vid=" + vid).then(() => upd());
}

function saveSingleRegister(selectId, regAddr) {
    let page = document.getElementById("voutPage").value;
    let hexStr = document.getElementById(selectId).value;
    if (!hexStr) return;
    let vid = parseInt(hexStr, 16);
    fetch("/save_single_register?page=" + page + "&reg=" + regAddr + "&vid=" + vid).then(() => upd());
}

if (document.getElementById("voutPage")) loadVoltageOptionsAll();

function setAutoLoadDelay(sec) {
    document.getElementById("autoLoadDelayVal").innerText = sec;
    fetch("/set_autoload_delay?delay=" + sec);
}

function setI2cCheck(checked) {
    fetch("/set_i2c_check?enabled=" + (checked ? 1 : 0));
}

function setAutoLoadMask(page, reg, checked) {
    fetch("/set_autoload_mask?page=" + page + "&reg=" + reg + "&enabled=" + (checked ? 1 : 0));
}

function changeNumLeds(delta) {
    let display = document.getElementById("rgbNumLedsDisplay");
    let current = parseInt(display.innerText) || 1;
    let newVal = Math.min(20, Math.max(1, current + delta));
    display.innerText = newVal;
    saveRGB();
}

function enforceTempOrder(input) {
    // Находим контейнер точки (родительский div с border)
    let pointDiv = input.closest('div[style*="border"]');
    if (!pointDiv) return;
    let container = pointDiv.parentNode;
    let points = container.children;
    let idx = Array.from(points).indexOf(pointDiv);
    if (idx === -1) return;
    
    // Собираем все температурные слайдеры (первые input'ы в каждой точке)
    let tempInputs = [];
    for (let p of points) {
        let inputs = p.querySelectorAll('input[type="range"]');
        if (inputs.length > 0) tempInputs.push(inputs[0]); // первый — температура
    }
    if (idx >= tempInputs.length) return;
    
    let currentVal = parseInt(input.value);
    let prev = idx > 0 ? parseInt(tempInputs[idx - 1].value) : -1;
    let next = idx < tempInputs.length - 1 ? parseInt(tempInputs[idx + 1].value) : 101;
    if (prev > currentVal) input.value = prev;
    if (next < input.value) input.value = next;
    
    // Обновляем отображение (span справа от ползунка)
    let span = input.nextElementSibling;
    if (span && span.tagName === 'SPAN') span.innerText = input.value + "°";
}

function closeRGBModal() {
    fetch("/exit_rgb_preview"); // выключаем предпросмотр на сервере
    saveRGB(); // сохраняем текущие точки
    document.getElementById("rgbModal").style.display = "none";
}

function loadRGBSettings() {
    fetch("/get_rgb")
        .then((r) => r.json())
        .then((data) => {
            document.getElementById("rgbEnable").checked = data.enable == 1;
            document.getElementById("rgbNumLedsDisplay").innerText = data.numLeds;
            document.getElementById("rgbBrightness").value = data.brightness;
            document.getElementById("rgbBrightnessVal").innerText = data.brightness;
            document.getElementById("rgbMode").value = data.mode;
            document.getElementById("rgbSmoothness").value = data.smoothness;
            document.getElementById("rgbSmoothnessVal").innerText = data.smoothness;
            document.getElementById("rgbTempSmooth").value = data.tempSmooth || 50;
            document.getElementById("rgbTempSmoothVal").innerText = data.tempSmooth || 50;
            // Кнопка теста
            let testBtn = document.getElementById("rgbTestBtn");
            if (data.test_mode == 1) {
                testBtn.innerText = "ON";
                testBtn.style.borderColor = "#22aa55";
            } else {
                testBtn.innerText = "OFF";
                testBtn.style.borderColor = "var(--border)";
            }
            let container = document.getElementById("rgbMapContainer");
            container.innerHTML = "";
            for (let i = 0; i < data.points; i++) {
                addRGBPointUI(i, data.map[i].temp, parseInt(data.map[i].color, 16));
            }
        });
}

function addRGBPoint() {
    let container = document.getElementById("rgbMapContainer");
    let count = container.children.length;
    if (count >= 20) {
        alert("Max 20 points");
        return;
    }
    let lastTemp = 0;
    if (count > 0) {
        let lastInput = container.children[count - 1].getElementsByTagName("input")[0];
        lastTemp = parseInt(lastInput.value) || 0;
    }
    addRGBPointUI(count, lastTemp, 0xffffff);
    saveRGB();
}

function toggleRGBTest() {
    fetch("/toggle_rgb_test")
        .then((response) => response.text())
        .then((state) => {
            let btn = document.getElementById("rgbTestBtn");
            if (state === "ON") {
                btn.innerText = "ON";
                btn.style.borderColor = "#22aa55";
            } else {
                btn.innerText = "OFF";
                btn.style.borderColor = "var(--border)";
            }
            upd();
        });
}

function addRGBPointUI(index, temp, color) {
    let container = document.getElementById("rgbMapContainer");
    let div = document.createElement("div");
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.gap = "8px";
    div.style.marginBottom = "16px";
    div.style.padding = "12px";
    div.style.border = "1px solid var(--border)";
    div.style.borderRadius = "8px";
    div.style.background = "var(--card)";

    // ===== ЛЕВАЯ КОЛОНКА =====
    let leftCol = document.createElement("div");
    leftCol.style.display = "flex";
    leftCol.style.flexDirection = "column";
    leftCol.style.gap = "16px";
    leftCol.style.flex = "1";

    // ----- ПЕРВАЯ СТРОКА -----
    let row1 = document.createElement("div");
    row1.style.display = "flex";
    row1.style.alignItems = "center";
    row1.style.gap = "8px";

    let numSpan = document.createElement("span");
    numSpan.style.width = "20px";
    numSpan.style.fontSize = "14px";
    numSpan.style.fontWeight = "bold";
    numSpan.style.color = "var(--text)";
    numSpan.style.textAlign = "center";
    numSpan.innerText = index + 1;
    row1.appendChild(numSpan);

    let tempInput = document.createElement("input");
    tempInput.type = "range";
    tempInput.min = 0;
    tempInput.max = 100;
    tempInput.value = temp;
    tempInput.step = 1;
    tempInput.style.flex = "1";
    tempInput.style.minWidth = "50px";
    if (index > 0) {
        let prevDiv = container.children[index - 1];
        let prevTempInput = prevDiv.querySelector('input[type="range"]');
        if (prevTempInput) {
            tempInput.min = prevTempInput.value;
            if (parseInt(tempInput.value) < parseInt(tempInput.min)) {
                tempInput.value = tempInput.min;
            }
        }
    }
    row1.appendChild(tempInput);

    let tempSpan = document.createElement("span");
    tempSpan.style.width = "40px";
    tempSpan.style.fontSize = "12px";
    tempSpan.style.textAlign = "center";
    tempSpan.innerText = tempInput.value + "°";
    row1.appendChild(tempSpan);

    leftCol.appendChild(row1);

    // ----- ВТОРАЯ СТРОКА -----
    let row2 = document.createElement("div");
    row2.style.display = "flex";
    row2.style.alignItems = "center";
    row2.style.gap = "8px";

    let colorPreview = document.createElement("div");
    colorPreview.style.width = "20px";
    colorPreview.style.height = "20px";
    colorPreview.style.borderRadius = "2px";
    colorPreview.style.border = "1px solid var(--border)";
    colorPreview.style.flexShrink = "0";
    let r0 = (color >> 16) & 0xff,
        g0 = (color >> 8) & 0xff,
        b0 = color & 0xff;
    colorPreview.style.backgroundColor = `rgb(${r0},${g0},${b0})`;
    row2.appendChild(colorPreview);

    let hueSlider = document.createElement("input");
    hueSlider.type = "range";
    hueSlider.min = 0;
    hueSlider.max = 360;
    hueSlider.step = 1;
    hueSlider.style.flex = "1";
    hueSlider.style.minWidth = "70px";
    hueSlider.style.height = "6px";
    hueSlider.style.borderRadius = "3px";
    hueSlider.style.background = "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)";
    hueSlider.style.outline = "none";
    hueSlider.style.appearance = "none";
    row2.appendChild(hueSlider);

    let hueVal = document.createElement("span");
    hueVal.style.width = "40px";
    hueVal.style.fontSize = "12px";
    hueVal.style.textAlign = "center";
    row2.appendChild(hueVal);

    leftCol.appendChild(row2);
    div.appendChild(leftCol);

    // ===== ПРАВАЯ КОЛОНКА =====
    let rightCol = document.createElement("div");
    rightCol.style.display = "flex";
    rightCol.style.alignItems = "center";
    rightCol.style.justifyContent = "center";
    rightCol.style.flexShrink = "0";
    rightCol.style.width = "8px";
    rightCol.style.marginRight = "8px";

    let removeBtn = document.createElement("button");
    removeBtn.innerHTML = ICONS.CLOSE;
    let svg = removeBtn.querySelector('svg');
    if (svg) {
        svg.style.width = "32px";
        svg.style.height = "32px";
        svg.style.fill = "#ff4444";
        svg.style.display = "block";
    }
    removeBtn.style.background = "none";
    removeBtn.style.border = "none";
    removeBtn.style.cursor = "pointer";
    removeBtn.style.padding = "0";
    rightCol.appendChild(removeBtn);
    div.appendChild(rightCol);

    // ===== ФУНКЦИЯ ОБНОВЛЕНИЯ ЦВЕТА =====
    function updateFromHue(h, silent) {
        let hue = parseInt(h);
        let c = 1.0,
            x = c * (1 - Math.abs(((hue / 60) % 2) - 1)),
            m = 0.5 - c / 2;
        let r, g, b;
        if (hue < 60) {
            r = c;
            g = x;
            b = 0;
        } else if (hue < 120) {
            r = x;
            g = c;
            b = 0;
        } else if (hue < 180) {
            r = 0;
            g = c;
            b = x;
        } else if (hue < 240) {
            r = 0;
            g = x;
            b = c;
        } else if (hue < 300) {
            r = x;
            g = 0;
            b = c;
        } else {
            r = c;
            g = 0;
            b = x;
        }
        let rr = Math.round((r + m) * 255),
            gg = Math.round((g + m) * 255),
            bb = Math.round((b + m) * 255);
        let hex = ((1 << 24) + (rr << 16) + (gg << 8) + bb).toString(16).slice(1);
        hueVal.innerText = hue;
        colorPreview.style.backgroundColor = `rgb(${rr},${gg},${bb})`;
        if (!silent) {
            previewRGB(tempInput.value, "#" + hex);
        }
    }

    // ===== НАЧАЛЬНЫЙ ОТТЕНОК =====
    let r_ = r0 / 255,
        g_ = g0 / 255,
        b_ = b0 / 255;
    let max = Math.max(r_, g_, b_),
        min = Math.min(r_, g_, b_);
    let h = 0;
    if (max === min) h = 0;
    else if (max === r_) h = 60 * (((g_ - b_) / (max - min)) % 6);
    else if (max === g_) h = 60 * ((b_ - r_) / (max - min) + 2);
    else if (max === b_) h = 60 * ((r_ - g_) / (max - min) + 4);
    if (h < 0) h += 360;
    hueSlider.value = Math.round(h);
    updateFromHue(hueSlider.value, true);

    // ===== ОБРАБОТЧИКИ =====
    hueSlider.addEventListener("input", function() {
        updateFromHue(this.value);
    });
    hueSlider.addEventListener("change", function() {
        updateFromHue(this.value);
        saveRGB();
    });
    tempInput.addEventListener("input", function() {
        tempSpan.innerText = this.value + "°";
        enforceTempOrder(this);
        updateFromHue(hueSlider.value);
    });
    tempInput.addEventListener("change", function() {
        saveRGB();
    });

    removeBtn.addEventListener("click", function() {
        div.remove();
        let children = container.children;
        for (let i = 0; i < children.length; i++) {
            let row1 = children[i].querySelector('div');
            if (row1) {
                let span = row1.querySelector('span:first-child');
                if (span) span.innerText = i + 1;
            }
            if (i > 0) {
                let prevTempInput = children[i - 1].querySelectorAll('input[type="range"]')[0];
                let curTempInput = children[i].querySelectorAll('input[type="range"]')[0];
                if (prevTempInput && curTempInput) {
                    curTempInput.min = prevTempInput.value;
                    if (parseInt(curTempInput.value) < parseInt(curTempInput.min)) {
                        curTempInput.value = curTempInput.min;
                    }
                }
            }
        }
        saveRGB();
    });

    container.appendChild(div);
}

function saveRGB() {
    let enable = document.getElementById("rgbEnable").checked ? 1 : 0;
    let numLeds = document.getElementById("rgbNumLedsDisplay").innerText;
    let brightness = document.getElementById("rgbBrightness").value;
    let mode = document.getElementById("rgbMode").value;
    let smoothness = document.getElementById("rgbSmoothness").value;
    let container = document.getElementById("rgbMapContainer");
    let points = container.children.length;
    let url =
        "/set_rgb?enable=" +
        enable +
        "&numLeds=" +
        numLeds +
        "&brightness=" +
        brightness +
        "&mode=" +
        mode +
        "&smoothness=" +
        smoothness +
        "&points=" +
        points;

    for (let i = 0; i < points; i++) {
        let div = container.children[i];
        let inputs = div.getElementsByTagName("input");
        let temp = inputs[0].value; // температура
        let hue = inputs[1].value; // Hue
        // Переводим Hue в RGB
        let h = parseInt(hue);
        let c = 1.0;
        let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        let m = 0.5 - c / 2;
        let r, g, b;
        if (h < 60) {
            r = c;
            g = x;
            b = 0;
        } else if (h < 120) {
            r = x;
            g = c;
            b = 0;
        } else if (h < 180) {
            r = 0;
            g = c;
            b = x;
        } else if (h < 240) {
            r = 0;
            g = x;
            b = c;
        } else if (h < 300) {
            r = x;
            g = 0;
            b = c;
        } else {
            r = c;
            g = 0;
            b = x;
        }
        let rr = Math.round((r + m) * 255);
        let gg = Math.round((g + m) * 255);
        let bb = Math.round((b + m) * 255);
        let hex = ((1 << 24) + (rr << 16) + (gg << 8) + bb).toString(16).slice(1);
        url += "&map" + i + "_temp=" + temp + "&map" + i + "_color=" + hex;
    }

    let tempSmooth = document.getElementById("rgbTempSmooth").value;
    url += "&tempSmooth=" + tempSmooth;
    fetch(url);
}

function testRGB() {
    fetch("/test_rgb?color=FFFFFF");
}

setInterval(upd, 1000);
upd();