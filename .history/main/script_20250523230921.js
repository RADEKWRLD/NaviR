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

// 右键自定义菜单
const customMenu = document.getElementById('custom-context-menu');

document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    customMenu.style.display = 'block';
    customMenu.style.left = e.clientX + 'px';
    customMenu.style.top = e.clientY + 'px';
});

// 点击其他地方关闭菜单
document.addEventListener('click', function(e) {
    if (!customMenu.contains(e.target)) {
        customMenu.style.display = 'none';
    }
});

function init() {
    updateTime();
    setInterval(updateTime, 1000);
    // 搜索框事件监听
    initSearch();
}
init();



