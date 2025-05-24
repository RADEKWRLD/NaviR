import gsap from "gsap";
//更新时间
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

function init() {
    updateTime();
    setInterval(updateTime, 1000);
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
    // 显示菜单
    gsap.set(contextMenu, { display: 'block' });
    gsap.to(contextMenu, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    gsap.to(main, { filter: 'blur(3px)', duration: 0.3, ease: 'power2.out' });
}

function hideContextMenu() {
    isMenuVisible = false;
    // 动画隐藏菜单
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

// 点击事件处理
document.addEventListener('click', function(e) {
        hideContextMenu();
    
});

// 按 ESC 关闭菜单
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuVisible) {
        hideContextMenu();
    }
});

// 快捷方式管理
const SHORTCUTS_STORAGE_KEY = 'naviR_shortcuts';
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

// 从本地存储加载快捷方式
function loadShortcuts() {
    const savedShortcuts = localStorage.getItem(SHORTCUTS_STORAGE_KEY);
    return savedShortcuts ? JSON.parse(savedShortcuts) : defaultShortcuts;
}

// 保存快捷方式到本地存储
function saveShortcuts(shortcuts) {
    localStorage.setItem(SHORTCUTS_STORAGE_KEY, JSON.stringify(shortcuts));
}

// 创建快捷方式元素
function createShortcutElement(shortcut) {
    const div = document.createElement('div');
    div.className = 'shortcut-item';
    div.draggable = true;
    div.dataset.url = shortcut.url;
    div.innerHTML = `
        <div class="shortcut-icon">
            ${shortcut.icon}
        </div>
        <span>${shortcut.name}</span>
        <button class="delete-shortcut" title="删除快捷方式">×</button>
    `;
    
    // 点击快捷方式跳转
    div.addEventListener('click', (e) => {
        if (!e.target.classList.contains('delete-shortcut')) {
            window.location.href = shortcut.url;
        }
    });

    // 删除快捷方式
    const deleteBtn = div.querySelector('.delete-shortcut');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('确定要删除这个快捷方式吗？')) {
            div.remove();
            const shortcuts = loadShortcuts().filter(s => s.url !== shortcut.url);
            saveShortcuts(shortcuts);
        }
    });

    return div;
}

// 渲染快捷方式
function renderShortcuts() {
    const shortcuts = loadShortcuts();
    const container = document.getElementById('shortcuts-grid');
    const addButton = container.querySelector('#add-shortcut');
    
    // 清除现有的快捷方式
    Array.from(container.children).forEach(child => {
        if (!child.classList.contains('add-shortcut')) {
            child.remove();
        }
    });
    
    // 添加快捷方式
    shortcuts.forEach(shortcut => {
        container.insertBefore(createShortcutElement(shortcut), addButton);
    });
}

// 处理拖拽
function handleDragAndDrop() {
    const container = document.getElementById('shortcuts-grid');
    let draggedItem = null;

    container.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('shortcut-item') && !e.target.classList.contains('add-shortcut')) {
            draggedItem = e.target;
            e.target.style.opacity = '0.5';
        }
    });

    container.addEventListener('dragend', (e) => {
        if (e.target.classList.contains('shortcut-item')) {
            e.target.style.opacity = '1';
        }
    });

    container.addEventListener('dragover', (e) => {
        e.preventDefault();
        const targetItem = e.target.closest('.shortcut-item');
        if (targetItem && !targetItem.classList.contains('add-shortcut') && targetItem !== draggedItem) {
            const boundingRect = targetItem.getBoundingClientRect();
            const mouseX = e.clientX;
            const itemCenterX = boundingRect.left + boundingRect.width / 2;
            
            if (mouseX < itemCenterX) {
                container.insertBefore(draggedItem, targetItem);
            } else {
                container.insertBefore(draggedItem, targetItem.nextSibling);
            }
            
            // 保存新的顺序
            const shortcuts = Array.from(container.children)
                .filter(item => item.classList.contains('shortcut-item') && !item.classList.contains('add-shortcut'))
                .map(item => {
                    const name = item.querySelector('span').textContent;
                    const url = item.dataset.url;
                    const icon = item.querySelector('.shortcut-icon').innerHTML;
                    return { name, url, icon };
                });
            saveShortcuts(shortcuts);
        }
    });
}

// 添加新快捷方式
function handleAddShortcut() {
    const addButton = document.getElementById('add-shortcut');
    const modal = document.getElementById('add-shortcut-modal');
    const closeBtn = modal.querySelector('.close-modal');
    const cancelBtn = document.getElementById('cancel-shortcut');
    const saveBtn = document.getElementById('save-shortcut');
    const urlInput = document.getElementById('shortcut-url');
    const titleInput = document.getElementById('shortcut-title');

    // 显示模态框
    function showModal() {
        modal.classList.add('show');
        urlInput.value = '';
        titleInput.value = '';
        urlInput.focus();
    }

    // 隐藏模态框
    function hideModal() {
        modal.classList.remove('show');
    }

    // 添加快捷方式
    function addShortcut() {
        const url = urlInput.value.trim();
        const title = titleInput.value.trim();

        if (!url) {
            alert('请输入网址');
            return;
        }

        const defaultIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
        
        const shortcuts = loadShortcuts();
        shortcuts.push({
            name: title || new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace('www.', ''),
            url: url.startsWith('http') ? url : `https://${url}`,
            icon: defaultIcon
        });
        
        saveShortcuts(shortcuts);
        renderShortcuts();
        hideModal();
    }

    // 事件监听
    addButton.addEventListener('click', showModal);
    closeBtn.addEventListener('click', hideModal);
    cancelBtn.addEventListener('click', hideModal);
    
    saveBtn.addEventListener('click', addShortcut);

    // 按 ESC 关闭模态框
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            hideModal();
        }
    });

    // 点击模态框外部关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });

    // 回车提交
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && modal.classList.contains('show')) {
            addShortcut();
        }
    });
}

// 初始化快捷方式功能
function initShortcuts() {
    renderShortcuts();
    handleDragAndDrop();
    handleAddShortcut();
}

function init() {
    updateTime();
    setInterval(updateTime, 1000);
    initShortcuts();
}

init();



