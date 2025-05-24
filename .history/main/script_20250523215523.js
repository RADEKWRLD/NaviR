function init() {
    updateTime();
    setInterval(updateTime, 1000);
    // 搜索框事件监听
    initSearch();
}
init();

//更新时间
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    document.getElementById('clock').textContent = timeString;
}

// 初始化搜索功能
function initSearch() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const searchEngine = document.getElementById('search-engine');

    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            const engine = searchEngine.value;
            const searchUrl = engine === 'google' 
                ? `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`
                : `https://www.bing.com/search?q=${encodeURIComponent(searchTerm)}`;
            window.open(searchUrl, '_blank');
        }
    });
}




