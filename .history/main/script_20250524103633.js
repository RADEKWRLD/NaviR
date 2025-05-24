import gsap from "gsap";
import { SettingsManager } from './settings.js';
import { ThemeManager } from './theme.js';

let settingsManager;
let themeManager;

//更新时间
function updateTime() {
    if (!settingsManager) return;
    settingsManager.updateTimeDisplay();
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
    addHistory(keyword);
});

// 检测是否为移动设备
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
}

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
    if (!isMobileDevice()) {
        showContextMenu();
    }
});

function showContextMenu() {
    isMenuVisible = true;
    // 显示菜单
    gsap.set(contextMenu, { display: 'block' });
    gsap.to(contextMenu, { opacity: 1, duration: 0.3, ease: 'power1.out' });
    
    // 使用 transform-origin 和 scale 的组合
    main.style.transformOrigin = 'center center';
    main.style.overflow = 'hidden';
    gsap.to(main, { 
        filter: 'blur(1px)', 
        scale: 1.15,
        duration: 0.05, 
        ease: 'power2.in'
    });
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
    
    gsap.to(main, { 
        filter: 'blur(0px)', 
        scale: 1,
        duration: 0.05, 
        ease: 'power1.in',
        onComplete: () => {
            main.style.overflow = '';
            main.style.transformOrigin = '';
        }
    });
}

// 点击事件处理
document.addEventListener('click', function(e) {
    if (isMobileDevice()) {
        // 在移动端，点击主区域时切换菜单显示/隐藏
            if (isMenuVisible) {
                hideContextMenu();
            } else {
                showContextMenu();
            }
    } else {
        // 在桌面端，点击主区域时隐藏菜单
            hideContextMenu();
        
    }
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
        name: '谷歌翻译',
        url: 'https://translate.google.com',
        icon: '<svg width="24" height="24" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M43.6 20.5H42V20H24v8h11.3C34.7 32.1 30.1 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6-6C33.5 5.1 28.1 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.3-4z"/><path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.5 16.1 18.9 13 24 13c2.7 0 5.2.9 7.2 2.4l6-6C33.5 5.1 28.1 3 24 3c-7.7 0-14.2 4.4-17.7 10.7z"/><path fill="#FBBC05" d="M24 43c6.1 0 11.2-2 14.9-5.4l-6.9-5.7C30.1 36 25.5 38 24 38c-5.1 0-9.5-3.1-11.1-7.5l-6.6 5.1C9.8 39.6 16.3 43 24 43z"/><path fill="#EA4335" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-4.3 6-7.3 7.5l6.9 5.7C40.2 39.6 44 32.7 44 24c0-1.3-.1-2.7-.4-3.5z"/></g></svg>'
    },
    {
        name: 'ChatGPT',
        url: 'https://chat.openai.com',
        icon: '<svg width="24" height="24" viewBox="0 0 40 40" fill="none"><g><path fill="#10A37F" d="M20 3.5c-9.11 0-16.5 7.39-16.5 16.5S10.89 36.5 20 36.5 36.5 29.11 36.5 20 29.11 3.5 20 3.5zm0 30c-7.45 0-13.5-6.05-13.5-13.5S12.55 6.5 20 6.5 33.5 12.55 33.5 20 27.45 33.5 20 33.5z"/><path fill="#10A37F" d="M28.5 20c0-4.69-3.81-8.5-8.5-8.5s-8.5 3.81-8.5 8.5 3.81 8.5 8.5 8.5 8.5-3.81 8.5-8.5zm-8.5 6.5c-3.59 0-6.5-2.91-6.5-6.5s2.91-6.5 6.5-6.5 6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5z"/></g></svg>'
    },
    {
        name: 'DeepSeek',
        url: 'https://chat.deepseek.com',
        icon: `<svg height="1em" style="flex:none;line-height:1" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg"><title>DeepSeek</title><path d="M23.748 4.482c-.254-.124-.364.113-.512.234-.051.039-.094.09-.137.136-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.156-.708-.311-.955-.65-.172-.241-.219-.51-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434 1.202-.422 1.84.027 1.436.633 2.58 1.838 3.393.137.093.172.187.129.323-.082.28-.18.552-.266.833-.055.179-.137.217-.329.14a5.526 5.526 0 01-1.736-1.18c-.857-.828-1.631-1.742-2.597-2.458a11.365 11.365 0 00-.689-.471c-.985-.957.13-1.743.388-1.836.27-.098.093-.432-.779-.428-.872.004-1.67.295-2.687.684a3.055 3.055 0 01-.465.137 9.597 9.597 0 00-2.883-.102c-1.885.21-3.39 1.102-4.497 2.623C.082 8.606-.231 10.684.152 12.85c.403 2.284 1.569 4.175 3.36 5.653 1.858 1.533 3.997 2.284 6.438 2.14 1.482-.085 3.133-.284 4.994-1.86.47.234.962.327 1.78.397.63.059 1.236-.03 1.705-.128.735-.156.684-.837.419-.961-2.155-1.004-1.682-.595-2.113-.926 1.096-1.296 2.746-2.642 3.392-7.003.05-.347.007-.565 0-.845-.004-.17.035-.237.23-.256a4.173 4.173 0 001.545-.475c1.396-.763 1.96-2.015 2.093-3.517.02-.23-.004-.467-.247-.588zM11.581 18c-2.089-1.642-3.102-2.183-3.52-2.16-.392.024-.321.471-.235.763.09.288.207.486.371.739.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.167-1.361-.802-2.5-1.86-3.301-3.307-.774-1.393-1.224-2.887-1.298-4.482-.02-.386.093-.522.477-.592a4.696 4.696 0 011.529-.039c2.132.312 3.946 1.265 5.468 2.774.868.86 1.525 1.887 2.202 2.891.72 1.066 1.494 2.082 2.48 2.914.348.292.625.514.891.677-.802.09-2.14.11-3.054-.614zm1-6.44a.306.306 0 01.415-.287.302.302 0 01.2.288.306.306 0 01-.31.307.303.303 0 01-.304-.308zm3.11 1.596c-.2.081-.399.151-.59.16a1.245 1.245 0 01-.798-.254c-.274-.23-.47-.358-.552-.758a1.73 1.73 0 01.016-.588c.07-.327-.008-.537-.239-.727-.187-.156-.426-.199-.688-.199a.559.559 0 01-.254-.078c-.11-.054-.2-.19-.114-.358.028-.054.16-.186.192-.21.356-.202.767-.136 1.146.016.352.144.618.408 1.001.782.391.451.462.576.685.914.176.265.336.537.445.848.067.195-.019.354-.25.452z" fill=\"#4D6BFE\"></path></svg>`
    },
    {
        name: 'Kimi',
        url: 'https://kimi.moonshot.cn',
        icon: `<svg fill="currentColor" fill-rule="evenodd" height="1em" style="flex:none;line-height:1" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg"><title>Kimi</title><path d="M19.738 5.776c.163-.209.306-.4.457-.585.07-.087.064-.153-.004-.244-.655-.861-.717-1.817-.34-2.787.283-.73.909-1.072 1.674-1.145.477-.045.945.004 1.379.236.57.305.902.77 1.01 1.412.086.512.07 1.012-.075 1.508-.257.878-.888 1.333-1.753 1.448-.718.096-1.446.108-2.17.157-.056.004-.113 0-.178 0z" fill="#027AFF"></path><path d="M17.962 1.844h-4.326l-3.425 7.81H5.369V1.878H1.5V22h3.87v-8.477h6.824a3.025 3.025 0 002.743-1.75V22h3.87v-8.477a3.87 3.87 0 00-3.588-3.86v-.01h-2.125a3.94 3.94 0 002.323-2.12l2.545-5.689z"></path></svg>`
    },
    {
        name: '网易云音乐',
        url: 'https://music.163.com',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path fill="none" d="M0 0h24v24H0z"/><path d="M10.421 11.375c-.294 1.028.012 2.064.784 2.653 1.061.81 2.565.3 2.874-.995.08-.337.103-.722.027-1.056-.23-1.001-.52-1.988-.792-2.996-1.33.154-2.543 1.172-2.893 2.394zm5.548-.287c.273 1.012.285 2.017-.127 3-1.128 2.69-4.721 3.14-6.573.826-1.302-1.627-1.28-3.961.06-5.734.78-1.032 1.804-1.707 3.048-2.054l.379-.104c-.084-.415-.188-.816-.243-1.224-.176-1.317.512-2.503 1.744-3.04 1.226-.535 2.708-.216 3.53.76.406.479.395 1.08-.025 1.464-.412.377-.996.346-1.435-.09-.247-.246-.51-.44-.877-.436-.525.006-.987.418-.945.937.037.468.173.93.3 1.386.022.078.216.135.338.153 1.334.197 2.504.731 3.472 1.676 2.558 2.493 2.861 6.531.672 9.44-1.529 2.032-3.61 3.168-6.127 3.409-4.621.44-8.664-2.53-9.7-7.058C2.515 10.255 4.84 5.831 8.795 4.25c.586-.234 1.143-.031 1.371.498.232.537-.019 1.086-.61 1.35-2.368 1.06-3.817 2.855-4.215 5.424-.533 3.433 1.656 6.776 5 7.72 2.723.77 5.658-.166 7.308-2.33 1.586-2.08 1.4-5.099-.427-6.873a3.979 3.979 0 0 0-1.823-1.013c.198.716.389 1.388.57 2.062z"/></g></svg>`
    },
    {
        name: 'Gmail',
        url: 'https://mail.google.com',
        icon: '<svg width="24" height="24" viewBox="0 0 48 48"><g><rect x="6" y="10" width="36" height="28" rx="4" fill="#fff" stroke="#EA4335" stroke-width="2"/><path d="M6 14l18 14L42 14" stroke="#EA4335" stroke-width="2" fill="none"/></g></svg>'
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
        showDeleteConfirmModal(div);
    });

    return div;
}

// 显示删除确认模态框
function showDeleteConfirmModal(shortcutElement) {
    const deleteModal = document.getElementById('delete-confirm-modal');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    const closeModalBtn = deleteModal.querySelector('.close-modal');

    // 显示模态框
    function showModal() {
        deleteModal.classList.add('show');
    }

    // 隐藏模态框
    function hideModal() {
        deleteModal.classList.remove('show');
        // 移除临时事件监听器
        confirmDeleteBtn.removeEventListener('click', handleConfirm);
        cancelDeleteBtn.removeEventListener('click', hideModal);
        closeModalBtn.removeEventListener('click', hideModal);
        deleteModal.removeEventListener('click', handleOutsideClick);
        document.removeEventListener('keydown', handleEscape);
    }

    // 确认删除
    function handleConfirm() {
        const shortcuts = loadShortcuts().filter(s => s.url !== shortcutElement.dataset.url);
        saveShortcuts(shortcuts);
        shortcutElement.remove();
        hideModal();
    }

    // 点击模态框外部
    function handleOutsideClick(e) {
        if (e.target === deleteModal) {
            hideModal();
        }
    }

    // 按 ESC 键
    function handleEscape(e) {
        if (e.key === 'Escape' && deleteModal.classList.contains('show')) {
            hideModal();
        }
    }

    // 添加事件监听器
    confirmDeleteBtn.addEventListener('click', handleConfirm);
    cancelDeleteBtn.addEventListener('click', hideModal);
    closeModalBtn.addEventListener('click', hideModal);
    deleteModal.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    showModal();
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
    let touchStartY = 0;
    let touchStartX = 0;
    let initialY = 0;
    let initialX = 0;

    // 处理触摸开始事件
    function handleTouchStart(e) {
        if (e.target.classList.contains('shortcut-item') && !e.target.classList.contains('add-shortcut')) {
            draggedItem = e.target;
            draggedItem.style.opacity = '0.5';
            draggedItem.style.position = 'relative';
            draggedItem.style.zIndex = '1000';
            
            const touch = e.touches[0];
            touchStartY = touch.clientY;
            touchStartX = touch.clientX;
            
            const rect = draggedItem.getBoundingClientRect();
            initialY = rect.top;
            initialX = rect.left;
            
            // 添加触摸移动和结束事件监听器
            document.addEventListener('touchmove', handleTouchMove);
            document.addEventListener('touchend', handleTouchEnd);
        }
    }

    // 处理触摸移动事件
    function handleTouchMove(e) {
        if (!draggedItem) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        const deltaY = touch.clientY - touchStartY;
        const deltaX = touch.clientX - touchStartX;
        
        // 更新元素位置
        draggedItem.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        
        // 获取当前触摸点下的元素
        const elementAtTouch = document.elementFromPoint(touch.clientX, touch.clientY);
        const targetItem = elementAtTouch?.closest('.shortcut-item');
        
        if (targetItem && !targetItem.classList.contains('add-shortcut') && targetItem !== draggedItem) {
            const boundingRect = targetItem.getBoundingClientRect();
            const touchX = touch.clientX;
            const itemCenterX = boundingRect.left + boundingRect.width / 2;
            
            if (touchX < itemCenterX) {
                container.insertBefore(draggedItem, targetItem);
            } else {
                container.insertBefore(draggedItem, targetItem.nextSibling);
            }
        }
    }

    // 处理触摸结束事件
    function handleTouchEnd() {
        if (!draggedItem) return;
        
        // 重置元素样式
        draggedItem.style.opacity = '1';
        draggedItem.style.transform = '';
        draggedItem.style.position = '';
        draggedItem.style.zIndex = '';
        
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
        
        // 移除事件监听器
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
        
        draggedItem = null;
    }

    // 桌面端拖放事件
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

    // 移动端触摸事件
    container.addEventListener('touchstart', handleTouchStart);
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
    handleResetShortcuts();
}

// 重置快捷方式
function handleResetShortcuts() {
    const resetBtn = document.getElementById('reset-shortcuts');
    const resetModal = document.getElementById('reset-confirm-modal');
    const confirmResetBtn = document.getElementById('confirm-reset');
    const cancelResetBtn = document.getElementById('cancel-reset');
    const closeModalBtn = resetModal.querySelector('.close-modal');

    // 显示模态框
    function showModal() {
        resetModal.classList.add('show');
    }

    // 隐藏模态框
    function hideModal() {
        resetModal.classList.remove('show');
    }

    // 执行重置
    function performReset() {
        saveShortcuts(defaultShortcuts);
        renderShortcuts();
        hideModal();
    }

    // 事件监听
    resetBtn.addEventListener('click', showModal);
    confirmResetBtn.addEventListener('click', performReset);
    cancelResetBtn.addEventListener('click', hideModal);
    closeModalBtn.addEventListener('click', hideModal);

    // 点击模态框外部关闭
    resetModal.addEventListener('click', (e) => {
        if (e.target === resetModal) {
            hideModal();
        }
    });

    // 按 ESC 关闭模态框
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && resetModal.classList.contains('show')) {
            hideModal();
        }
    });
}

function init() {
    settingsManager = new SettingsManager();
    themeManager = new ThemeManager();
    updateTime();
    setInterval(updateTime, 1000);
    initShortcuts();
}

init();



