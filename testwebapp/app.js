// Хук :active для iOS
document.addEventListener('touchstart', function() {}, { passive: true });

// ============================================
// ИКОНКИ
// ============================================

const Icons = {
    // PS5 Logo
    AppLogo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112 24">
        <path fill="currentColor" d="M26.3578 10.3406C28.4939 10.3219 30.2192 8.58794 30.2192 6.45121C30.2192 4.31448 28.4939 2.58049 26.3615 2.56184H0.16805C0.0746889 2.55811 0 2.48353 0 2.38658V0.167806C0 0.0745808 0.0746889 0 0.16805 0H28.8823C32.3702 0.0969546 35.1636 2.94593 35.1636 6.44748C35.1636 9.94904 32.374 12.7943 28.8897 12.895H28.8823H9.01871C6.87139 12.895 5.13114 14.6327 5.13114 16.7769V23.8322C5.13114 23.9254 5.05645 24 4.96309 24H0.171785C0.0784235 24 0.00373463 23.9254 0.00373463 23.8322C0.00373463 23.8247 0.00373463 23.821 0.00373463 23.8135V16.762C0.0186724 13.2119 2.90167 10.3406 6.45687 10.3406C6.4606 10.3406 6.4606 10.3406 6.46434 10.3406H26.3578ZM76.9746 9.00559V0.167806C76.9746 0.0745808 77.0492 0 77.1426 0H111.246C111.339 0 111.417 0.0745808 111.421 0.167806V2.38658C111.417 2.4798 111.343 2.55811 111.246 2.56184H82.27C82.1767 2.56184 82.102 2.63642 82.102 2.72965V8.48726C82.102 8.49099 82.102 8.49472 82.102 8.49845C82.102 9.51647 82.9273 10.3406 83.9468 10.3406H83.9505H105.524C109.143 10.5345 112 13.514 112 17.1572C112 20.8005 109.139 23.7763 105.539 23.9702H105.521H77.1426C77.0492 23.9702 76.9746 23.8956 76.9746 23.8024V21.5948C76.9746 21.5016 77.0492 21.427 77.1426 21.427H102.951C102.989 21.427 103.034 21.427 103.078 21.427C105.439 21.427 107.354 19.5177 107.354 17.1572C107.354 14.7968 105.442 12.8875 103.078 12.8875C103.022 12.8875 102.966 12.8875 102.91 12.8912H102.918H80.8584C78.7111 12.8912 76.9708 11.1535 76.9708 9.00932V9.00559H76.9746ZM48.7645 23.9702C52.3272 23.9702 55.2176 21.0839 55.2176 17.5264V6.44376C55.2176 4.29957 56.9579 2.56184 59.1052 2.56184H71.6343C71.7277 2.55811 71.8023 2.48353 71.8023 2.38658V0.167806C71.8023 0.0745808 71.7277 0 71.6343 0H56.5434C52.9807 0 50.0865 2.88627 50.0865 6.44376V17.5376C50.0865 19.6818 48.3462 21.4232 46.1989 21.4232H33.8491C33.7557 21.4232 33.681 21.4978 33.681 21.5911V23.8098C33.681 23.903 33.7557 23.9776 33.8491 23.9776L48.7645 23.9702Z"/>
    </svg>`,            // Bottom Panel Icons
    MonitoringIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
        <path fill="currentColor" d="m428-451-34-51q-5-8-14-13t-19-5H99q-11-26-15-50t-4-50q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 26-4 50t-15 50H623l-69-102q-6-9-15.5-13.5T518-640q-13 0-22.5 7.5T482-613l-54 162Zm52 345-58-52q-105-94-172-161T145-440h192l69 102q6 9 15.5 13.5T442-320q13 0 22.5-7.5T478-347l54-163 35 52q5 8 14 13t19 5h215q-38 54-105 121T538-158l-58 52Z"/>
    </svg>`,
    FanIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
        <path fill="currentColor" d="M424-80q-51 0-77.5-30.5T320-180q0-26 11.5-50.5T367-271q22-14 35.5-36t18.5-47l-12-6q-6-3-11-7l-92 33q-17 6-33 10t-33 4q-63 0-111.5-55T80-536q0-51 30.5-77.5T179-640q26 0 51 11.5t41 35.5q14 22 36 35.5t47 18.5l6-12q3-6 7-11l-33-92q-6-17-10-33t-4-32q0-64 55-112.5T536-880q51 0 77.5 30.5T640-781q0 26-11.5 51T593-689q-22 14-35.5 36T539-606l12 6q6 3 11 7l92-34q17-6 32.5-9.5T719-640q81 0 121 67t40 149q0 51-32 77.5T777-320q-25 0-48.5-11.5T689-367q-14-22-36-35.5T606-421l-6 12q-3 6-7 11l33 92q6 16 10 30.5t4 30.5q1 65-54 115T424-80Zm56-340q25 0 42.5-17.5T540-480q0-25-17.5-42.5T480-540q-25 0-42.5 17.5T420-480q0 25 17.5 42.5T480-420Z"/>
    </svg>`,
    AdvancedIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path fill="currentColor" d="M17.168 8H13l.806-4.835A1 1 0 0 0 12.819 2H7.667a1 1 0 0 0-.986.835l-1.667 10A1 1 0 0 0 6 14h4v8l8.01-12.459A1 1 0 0 0 17.168 8"/>
    </svg>`,
    LedIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
        <path fill="currentColor" d="M400-240q-33 0-56.5-23.5T320-320v-50q-57-39-88.5-100T200-600q0-117 81.5-198.5T480-880q117 0 198.5 81.5T760-600q0 69-31.5 129.5T640-370v50q0 33-23.5 56.5T560-240H400Zm0 160q-17 0-28.5-11.5T360-120v-40h240v40q0 17-11.5 28.5T560-80H400Z"/>
    </svg>`,
    SettingsIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
        <path fill="currentColor" d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm112-260q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Z"/>
    </svg>`,

    // Arrows Icons
    ChevronDown: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path fill="currentColor" d="M3.515 8.465L12 16.95l8.485-8.485L19.07 7.05L12 14.122L4.929 7.05L3.515 8.465Z"/>
</svg>`
};

// ПРОБРОС ИКОНОК
document.getElementById('ps-logo').innerHTML = Icons.AppLogo;

document.getElementById('icon-monitoring').innerHTML = Icons.MonitoringIcon;
document.getElementById('icon-fan').innerHTML = Icons.FanIcon;
document.getElementById('icon-advanced').innerHTML = Icons.AdvancedIcon;
document.getElementById('icon-led').innerHTML = Icons.LedIcon;
document.getElementById('icon-settings').innerHTML = Icons.SettingsIcon;

// СЕЛЕКТЫ С ИКОНКОЙ
function updateSelectIcons() {
    const color = getComputedStyle(document.documentElement)
        .getPropertyValue('--text-primary')
        .trim();

    const svg = Icons.ChevronDown.replace('currentColor', color);
    const url = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

    document.querySelectorAll('select.control').forEach(select => {
        select.style.backgroundImage = url;
    });
}

// ТЕМА ОФОРМЛЕНИЯ
const themeSelect = document.getElementById('theme-select');

const savedTheme = localStorage.getItem('theme') || 'system';
themeSelect.value = savedTheme;
applyTheme(savedTheme);
updateSelectIcons();

themeSelect.addEventListener('change', () => {
    const theme = themeSelect.value;
    localStorage.setItem('theme', theme);
    applyTheme(theme);
});

window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => {
        if (localStorage.getItem('theme') === 'system') {
            applyTheme('system');
        }
    });

function applyTheme(theme) {
    if (theme === 'system') {
        theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark'
            : 'light';
    }

    document.documentElement.setAttribute('data-theme', theme);
    updateSelectIcons();

    // Динамическое обновление theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        const color = theme === 'dark' ? '#121212' : '#fefefe';
        metaThemeColor.setAttribute('content', color);
    }
}

// ============================================
// НАВИГАЦИЯ ПО ФУТЕРУ
// ============================================

const footerButtons = document.querySelectorAll('.footer-btn');

footerButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        footerButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const pageId = this.dataset.page;
        document.getElementById(pageId).classList.add('active');
    });
});