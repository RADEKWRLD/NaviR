import gsap from "gsap";

// 快捷方式数据结构
const defaultShortcuts = [
    {
        name: 'Google',
        url: 'https://www.google.com',
        icon: '<svg width="24" height="24" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M43.6 20.5H42V20H24v8h11.3C34.7 32.1 30.1 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6-6C33.5 5.1 28.1 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.3-4z"/><path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.5 16.1 18.9 13 24 13c2.7 0 5.2.9 7.2 2.4l6-6C33.5 5.1 28.1 3 24 3c-7.7 0-14.2 4.4-17.7 10.7z"/><path fill="#FBBC05" d="M24 43c6.1 0 11.2-2 14.9-5.4l-6.9-5.7C30.1 36 25.5 38 24 38c-5.1 0-9.5-3.1-11.1-7.5l-6.6 5.1C9.8 39.6 16.3 43 24 43z"/><path fill="#EA4335" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-4.3 6-7.3 7.5l6.9 5.7C40.2 39.6 44 32.7 44 24c0-1.3-.1-2.7-.4-3.5z"/></g></svg>'
    },
    {
        name: 'GitHub',
        url: 'https://www.github.com',
        icon: '<svg width="24" height="24" viewBox="0 0 24 24"><path fill="#181717" d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.32 6.84 9.67.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.17-1.1-1.48-1.1-1.48-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.38 9.38 0 0 1 12 6.84c.85.004 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z"/></svg>'
    },
    {
        name: '知乎',
        url: 'https://www.zhihu.com',
        icon: '<svg width="24" height="24" viewBox="0 0 48 48"><rect x="8" y="8" width="32" height="32" rx="6" fill="#0084ff"/><text x="24" y="32" text-anchor="middle" font-size="18" fill="#fff" font-family="Arial">知</text></svg>'
    },
    {
        name: '哔哩哔哩',
        url: 'https://www.bilibili.com',
        icon: '<svg width="24" height="24" viewBox="0 0 24 24"><path fill="#00a1d6" d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.907-.373.335 0 .63.124.907.373L9.653 4.44c.071.071.134.147.187.227h4.267a.836.836 0 0 1 .16-.227l2.853-2.747c.267-.249.573-.373.907-.373.335 0 .64.124.907.373.267.249.373.551.373.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.765.28 1.395.786 1.893.507.499 1.134.757 1.88.773h13.334c.746-.016 1.373-.274 1.88-.773.506-.498.769-1.128.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM10 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173l2.4-1.44v3.84l-2.4-1.44v1.174c-.017.39-.15.71-.4.959-.25.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.248-.383-.568-.4-.959v-4.694c.017-.391.15-.711.4-.96.25-.249.56-.373.933-.373zm8.533 0c.373 0 .684.124.933.373.25.249.383.569.4.96v4.694c-.017.39-.15.71-.4.959-.25.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.248-.383-.568-.4-.959v-1.174l-2.4 1.44v-3.84l2.4 1.44v-1.173c.017-.391.15-.711.4-.96.25-.249.56-.373.933-.373z"/></svg>'
    }
];

// 更新时间
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    document.getElementById('clock').textContent = timeString;
}

// 搜索引擎配置
const searchEngines = {
    google: {
        name: 'Google',
        url: 'https://www.google.com/search?q='
    },
    bing: {
        name: 'Bing',
        url: 'https://www.bing.com/search?q='
    },
    baidu: {
        name: '百度',
        url: 'https://www.baidu.com/s?wd='
    },
    bingcn: {
        name: '必应中国',
        url: 'https://cn.bing.com/search?q='
    },
    github: {
        name: 'GitHub',
        url: 'https://github.com/search?q='
    },
    zhihu: {
        name: '知乎',
        url: 'https://www.zhihu.com/search?q='
    }
};

// 搜索引擎的搜索URL模板
const engineSearchUrls = {
    "Google": "https://www.google.com/search?q=",
    "Bing": "https://www.bing.com/search?q=",
    "百度": "https://www.baidu.com/s?wd=",
    "BingCN": "https://cn.bing.com/search?q=",
    "GitHub": "https://github.com/search?q=",
    "知乎": "https://www.zhihu.com/search?type=content&q="
};

// 当前选中的引擎，默认Google
let currentEngine = "Google";

// Theme selection
const themes = [
    'pink',
    'deep-ocean',
    'forest',
    'sunset',
    'neon',
    'royal',
    'desert',
    'aurora',
    'cherry',
    'emerald',
    'dark-night',
    'pure-white',
    'cyberpunk',
    'pastel',
    'midnight',
    'lavender',
    'ocean',
    'autumn',
    'mint',
    'galaxy'
];

function setRandomTheme() {
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    document.documentElement.setAttribute('data-theme', randomTheme);
}

// Set random theme when page loads
setRandomTheme();

// 搜索引擎下拉菜单逻辑
const engineBtn = document.getElementById('engine-btn');
const engineMenu = document.getElementById('engine-menu');

engineBtn.addEventListener('click', function(e) {
    e.preventDefault();
    engineMenu.classList.toggle('show');
});

// 监听菜单点击，切换引擎
document.querySelectorAll('#engine-menu li').forEach(li => {
    li.addEventListener('click', function() {
        const name = this.getAttribute('data-value');
        currentEngine = name;
        engineBtn.textContent = name;
        engineMenu.classList.remove('show');
    });
});

// 点击外部关闭菜单
document.addEventListener('click', function(e) {
    if (!engineBtn.contains(e.target) && !engineMenu.contains(e.target)) {
        engineMenu.classList.remove('show');
    }
});

// 监听表单提交
document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault(); // 阻止表单默认提交
    const keyword = document.getElementById('search-input').value.trim();
    if (!keyword) return;
    const url = engineSearchUrls[currentEngine] + encodeURIComponent(keyword);
    window.location.href = url; // 新标签页打开
});

// 本地存储相关函数
function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error('Error saving to localStorage:', e);
    }
}

function getFromLocalStorage(key, defaultValue) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
        console.error('Error reading from localStorage:', e);
        return defaultValue;
    }
}

// 初始化快捷方式
function initializeShortcuts() {
    const shortcuts = getFromLocalStorage('shortcuts', defaultShortcuts);
    const shortcutsGrid = document.querySelector('.shortcuts-grid');
    shortcutsGrid.innerHTML = '';
    
    shortcuts.forEach(shortcut => {
        const shortcutElement = createShortcutElement(shortcut);
        shortcutsGrid.appendChild(shortcutElement);
    });
}

// 创建快捷方式元素
function createShortcutElement(shortcut) {
    const element = document.createElement('a');
    element.href = shortcut.url;
    element.className = 'shortcut-item';
    element.innerHTML = `
        <div class="shortcut-icon">
            ${shortcut.icon}
        </div>
        <span>${shortcut.name}</span>
    `;
    return element;
}

// 添加新的快捷方式
function addNewShortcut(name, url, icon) {
    const shortcuts = getFromLocalStorage('shortcuts', defaultShortcuts);
    shortcuts.push({ name, url, icon });
    saveToLocalStorage('shortcuts', shortcuts);
    initializeShortcuts();
}

// 删除快捷方式
function removeShortcut(name) {
    const shortcuts = getFromLocalStorage('shortcuts', defaultShortcuts);
    const filteredShortcuts = shortcuts.filter(s => s.name !== name);
    saveToLocalStorage('shortcuts', filteredShortcuts);
    initializeShortcuts();
}

// 拖动相关
function initializeDraggable() {
    const contextMenu = document.getElementById('context-menu');
    const menuContent = document.querySelector('.context-menu-content');
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = getFromLocalStorage('menuX', 0);
    let yOffset = getFromLocalStorage('menuY', 0);

    // 设置初始位置
    setTranslate(xOffset, yOffset, contextMenu);

    menuContent.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        if (e.target === menuContent) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            isDragging = true;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            xOffset = currentX;
            yOffset = currentY;
            setTranslate(currentX, currentY, contextMenu);
        }
    }

    function dragEnd() {
        if (isDragging) {
            isDragging = false;
            saveToLocalStorage('menuX', xOffset);
            saveToLocalStorage('menuY', yOffset);
        }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }
}

// 添加快捷方式按钮
function addShortcutButton() {
    const shortcutsGrid = document.querySelector('.shortcuts-grid');
    const addButton = document.createElement('div');
    addButton.className = 'shortcut-item add-shortcut';
    addButton.innerHTML = `
        <div class="shortcut-icon">
            <svg width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
        </div>
        <span>添加</span>
    `;
    addButton.addEventListener('click', showAddShortcutDialog);
    shortcutsGrid.appendChild(addButton);
}

// 显示添加快捷方式对话框
function showAddShortcutDialog() {
    const dialog = document.createElement('div');
    dialog.className = 'shortcut-dialog';
    dialog.innerHTML = `
        <div class="dialog-content">
            <h3>添加快捷方式</h3>
            <input type="text" id="shortcut-name" placeholder="名称">
            <input type="url" id="shortcut-url" placeholder="URL">
            <div class="dialog-buttons">
                <button id="cancel-shortcut">取消</button>
                <button id="add-shortcut">添加</button>
            </div>
        </div>
    `;
    document.body.appendChild(dialog);

    document.getElementById('cancel-shortcut').onclick = () => {
        document.body.removeChild(dialog);
    };

    document.getElementById('add-shortcut').onclick = () => {
        const name = document.getElementById('shortcut-name').value;
        const url = document.getElementById('shortcut-url').value;
        if (name && url) {
            const icon = '<svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>';
            addNewShortcut(name, url, icon);
            document.body.removeChild(dialog);
        }
    };
}

// 初始化
function init() {
    updateTime();
    setInterval(updateTime, 1000);
    setRandomTheme();
    initializeShortcuts();
    initializeDraggable();
    addShortcutButton();
}

init();

// Context Menu
const contextMenu = document.getElementById('context-menu');
const main = document.getElementById('main');
let isMenuVisible = false;

// 初始化时隐藏菜单
gsap.set(contextMenu, { opacity: 0, display: 'none' });
gsap.set(main, { filter: 'blur(0px)' });

// 阻止默认的右键菜单
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showContextMenu();
});

function showContextMenu() {
    isMenuVisible = true;
    gsap.set(contextMenu, { display: 'block' });
    gsap.to(contextMenu, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    gsap.to(main, { filter: 'blur(8px)', duration: 0.3, ease: 'power2.out' });
}

function hideContextMenu() {
    if (!isDragging) {
        isMenuVisible = false;
        gsap.to(contextMenu, {
            opacity: 0,
            duration: 0.05,
            ease: 'power2.out',
            onComplete: () => {
                gsap.set(contextMenu, { display: 'none' });
            }
        });
        gsap.to(main, { filter: 'blur(0px)', duration: 0.05, ease: 'power2.out' });
    }
}

// 点击事件处理
document.addEventListener('click', function(e) {
    if (!contextMenu.contains(e.target)) {
        hideContextMenu();
    }
});

// 按 ESC 关闭菜单
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuVisible) {
        hideContextMenu();
    }
});



