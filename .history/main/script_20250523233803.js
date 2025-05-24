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
    // 搜索框事件监听
    // initSearch(); // 已删除，避免报错
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
    gsap.to(main, { filter: 'blur(8px)', duration: 0.3, ease: 'power2.out' });
}

function hideContextMenu() {
    isMenuVisible = false;
    // 动画隐藏菜单
    gsap.to(contextMenu, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
            gsap.set(contextMenu, { display: 'none' });
        }
    });
    gsap.to(main, { filter: 'blur(0px)', duration: 0.3, ease: 'power2.in' });
}

// 阻止菜单内的点击事件冒泡
contextMenu.addEventListener('click', (e) => {
    e.stopPropagation();
});

// 使用事件委托在文档级别处理点击
document.addEventListener('click', function(e) {
    // 如果菜单可见且点击的不是菜单本身
    if (isMenuVisible && !contextMenu.contains(e.target)) {
        hideContextMenu();
    }
}, true); // 使用捕获阶段确保在其他点击事件之前处理

// 按 ESC 关闭菜单
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuVisible) {
        hideContextMenu();
    }
});



