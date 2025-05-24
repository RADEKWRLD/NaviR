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

// 初始化搜索功能
function initSearch() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const searchEngine = document.getElementById('search-engine');

    // 动态添加搜索引擎选项
    for (const [key, engine] of Object.entries(searchEngines)) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = engine.name;
        searchEngine.appendChild(option);
    }

    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            const engine = searchEngine.value;
            const searchUrl = searchEngines[engine].url + encodeURIComponent(searchTerm);
            window.location.href = searchUrl;
        }
    });
}

// 搜索引擎下拉菜单逻辑
const engineBtn = document.getElementById('engine-btn');
const engineMenu = document.getElementById('engine-menu');
let currentEngine = 'Google';

engineBtn.addEventListener('click', function(e) {
    e.preventDefault();
    engineMenu.classList.toggle('show');
});

// 点击菜单项切换引擎
engineMenu.addEventListener('click', function(e) {
    if (e.target.tagName === 'LI') {
        currentEngine = e.target.getAttribute('data-value');
        engineBtn.textContent = currentEngine + ' ▼';
        engineMenu.classList.remove('show');
        // 这里可以同步设置你实际用到的搜索引擎变量
    }
});

// 点击外部关闭菜单
document.addEventListener('click', function(e) {
    if (!engineBtn.contains(e.target) && !engineMenu.contains(e.target)) {
        engineMenu.classList.remove('show');
    }
});

function init() {
    updateTime();
    setInterval(updateTime, 1000);
    // 搜索框事件监听
    initSearch();
}
init();



