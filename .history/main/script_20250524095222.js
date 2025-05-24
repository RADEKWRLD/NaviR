import { ThemeManager } from './theme.js';

// Initialize theme manager
const themeManager = new ThemeManager();

// Update clock
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.querySelector('#clock span').textContent = `${hours}:${minutes}`;
}

// Update clock every second
setInterval(updateClock, 1000);
updateClock(); // Initial update

// Search functionality
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const engineBtn = document.getElementById('engine-btn');
const engineMenu = document.getElementById('engine-menu');

// Search engines configuration
const searchEngines = {
    'Google': 'https://www.google.com/search?q=',
    'Bing': 'https://www.bing.com/search?q=',
    '百度': 'https://www.baidu.com/s?wd=',
    'BingCN': 'https://cn.bing.com/search?q=',
    'GitHub': 'https://github.com/search?q=',
    '知乎': 'https://www.zhihu.com/search?q='
};

// Handle search form submission
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        const engine = engineBtn.textContent;
        const baseUrl = searchEngines[engine];
        window.location.href = baseUrl + encodeURIComponent(query);
    }
});

// Toggle search engine menu
engineBtn.addEventListener('click', () => {
    engineMenu.classList.toggle('show');
});

// Close engine menu when clicking outside
document.addEventListener('click', (e) => {
    if (!engineBtn.contains(e.target)) {
        engineMenu.classList.remove('show');
    }
});

// Handle engine selection
engineMenu.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (li) {
        engineBtn.textContent = li.dataset.value;
        engineMenu.classList.remove('show');
    }
});

// Handle shortcuts
const contextMenu = document.getElementById('context-menu');
const main = document.getElementById('main');

// Toggle context menu
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    contextMenu.classList.add('active');
    main.classList.add('blurred');
});

// Close context menu when clicking outside
document.addEventListener('click', (e) => {
    if (!contextMenu.contains(e.target) && !e.target.matches('#settings-btn')) {
        contextMenu.classList.remove('active');
        main.classList.remove('blurred');
    }
});

// Handle shortcut clicks
document.querySelectorAll('.shortcut-item[data-url]').forEach(item => {
    item.addEventListener('click', () => {
        const url = item.dataset.url;
        if (url) {
            window.location.href = url;
        }
    });
});

// 检测是否为移动设备
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// 初始化快捷方式
function initShortcuts() {
    const grid = document.getElementById('shortcuts-grid');
    if (!grid) return;

    // 如果是移动设备，添加触摸事件处理
    if (isMobileDevice()) {
        initMobileShortcuts(grid);
    }
}

// 移动设备的快捷方式处理
function initMobileShortcuts(grid) {
    let draggedItem = null;
    let initialX, initialY;

    // 触摸开始
    grid.addEventListener('touchstart', (e) => {
        if (e.target.closest('.shortcut-item')) {
            draggedItem = e.target.closest('.shortcut-item');
            const touch = e.touches[0];
            initialX = touch.clientX - draggedItem.offsetLeft;
            initialY = touch.clientY - draggedItem.offsetTop;
            draggedItem.classList.add('dragging');
        }
    });

    // 触摸移动
    grid.addEventListener('touchmove', (e) => {
        if (draggedItem) {
            e.preventDefault();
            const touch = e.touches[0];
            draggedItem.style.position = 'absolute';
            draggedItem.style.left = `${touch.clientX - initialX}px`;
            draggedItem.style.top = `${touch.clientY - initialY}px`;
        }
    });

    // 触摸结束
    grid.addEventListener('touchend', () => {
        if (draggedItem) {
            draggedItem.classList.remove('dragging');
            draggedItem.style.position = '';
            draggedItem.style.left = '';
            draggedItem.style.top = '';
            draggedItem = null;
        }
    });
}

// 初始化
function init() {
    updateClock();
    setInterval(updateClock, 1000);
    initShortcuts();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);



