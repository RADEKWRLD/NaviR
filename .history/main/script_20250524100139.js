import { ThemeManager } from './theme.js';
import { SettingsManager } from './settings.js';

// Initialize managers
const themeManager = new ThemeManager();
const settingsManager = new SettingsManager();

// Update clock every second
setInterval(() => settingsManager.updateTimeDisplay(), 1000);
settingsManager.updateTimeDisplay(); // Initial update

// Add blinking separator style
const style = document.createElement('style');
style.textContent = `
    .blink-separator {
        animation: blink 1s step-end infinite;
    }
    @keyframes blink {
        50% { opacity: 0.5; }
    }
`;
document.head.appendChild(style);

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
engineBtn.addEventListener('click', (e) => {
    e.stopPropagation();
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

// Handle shortcuts and modals
const contextMenu = document.getElementById('context-menu');
const main = document.getElementById('main');
const addShortcutModal = document.getElementById('add-shortcut-modal');
const addShortcutBtn = document.getElementById('add-shortcut');
const cancelShortcutBtn = document.getElementById('cancel-shortcut');
const saveShortcutBtn = document.getElementById('save-shortcut');
const shortcutUrl = document.getElementById('shortcut-url');
const shortcutTitle = document.getElementById('shortcut-title');

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
    // Focus search input when clicking on main area
    if (main.contains(e.target) && !contextMenu.classList.contains('active')) {
        searchInput.focus();
    }
});

// Add shortcut modal functionality
addShortcutBtn.addEventListener('click', () => {
    addShortcutModal.classList.add('show');
    shortcutUrl.value = '';
    shortcutTitle.value = '';
    shortcutUrl.focus();
});

cancelShortcutBtn.addEventListener('click', () => {
    addShortcutModal.classList.remove('show');
});

// Close modal when clicking outside
addShortcutModal.addEventListener('click', (e) => {
    if (e.target === addShortcutModal) {
        addShortcutModal.classList.remove('show');
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        addShortcutModal.classList.remove('show');
        engineMenu.classList.remove('show');
        if (contextMenu.classList.contains('active')) {
            contextMenu.classList.remove('active');
            main.classList.remove('blurred');
        }
    }
});

saveShortcutBtn.addEventListener('click', () => {
    const url = shortcutUrl.value.trim();
    let title = shortcutTitle.value.trim();
    
    if (!url) {
        alert('请输入网址');
        return;
    }
    
    // Add http:// if no protocol specified
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    
    // If no title provided, use domain name
    if (!title) {
        try {
            const urlObj = new URL(fullUrl);
            title = urlObj.hostname.replace('www.', '');
        } catch (e) {
            title = url;
        }
    }
    
    // Create new shortcut
    const shortcut = createShortcut(fullUrl, title);
    
    // Add to grid before the add button
    const grid = document.getElementById('shortcuts-grid');
    grid.insertBefore(shortcut, addShortcutBtn);
    
    // Close modal
    addShortcutModal.classList.remove('show');
});

function createShortcut(url, title) {
    const shortcut = document.createElement('div');
    shortcut.className = 'shortcut-item';
    shortcut.draggable = true;
    shortcut.dataset.url = url;
    
    shortcut.innerHTML = `
        <div class="shortcut-icon">
            <img src="${url}/favicon.ico" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${title[0]}</text></svg>'">
        </div>
        <span>${title}</span>
        <button class="delete-shortcut">&times;</button>
    `;
    
    // Add click handler
    shortcut.addEventListener('click', (e) => {
        if (!e.target.matches('.delete-shortcut')) {
            window.location.href = url;
        }
    });
    
    // Add delete handler
    const deleteBtn = shortcut.querySelector('.delete-shortcut');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('确定要删除这个快捷方式吗？')) {
            shortcut.remove();
        }
    });
    
    return shortcut;
}

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
    initShortcuts();
    // Focus search input on page load
    searchInput.focus();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);



