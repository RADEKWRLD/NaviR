// 语言配置
const translations = {
    'zh-CN': {
        'settings.title': '设置',
        'settings.theme': '主题',
        'settings.time': '时间显示',
        'settings.time.24h': '24小时制',
        'settings.time.seconds': '显示秒数',
        'settings.time.blink': '分隔符闪烁',
        'settings.navigation': '导航设置',
        'settings.navigation.reset': '重置快捷方式',
        'settings.language': '语言',
        'search.placeholder': '请输入搜索内容...',
        'search.engines.google': 'Google',
        'search.engines.bing': 'Bing',
        'search.engines.baidu': '百度',
        'search.engines.bingcn': '必应中国',
        'search.engines.github': 'GitHub',
        'search.engines.zhihu': '知乎',
        'shortcut.add': '添加快捷方式',
        'shortcut.add.title': '添加网站捷径',
        'shortcut.add.url': '网址',
        'shortcut.add.name': '标题',
        'shortcut.add.auto': '- 留空即自动获取',
        'shortcut.add.cancel': '取消',
        'shortcut.add.confirm': '添加',
        'shortcut.reset.title': '确认重置',
        'shortcut.reset.message': '确定要重置所有快捷方式吗？这将删除所有自定义的快捷方式。',
        'shortcut.reset.cancel': '取消',
        'shortcut.reset.confirm': '确定重置',
        'shortcut.delete.title': '确认删除',
        'shortcut.delete.message': '确定要删除这个快捷方式吗？',
        'shortcut.delete.cancel': '取消',
        'shortcut.delete.confirm': '确定删除',
        'theme.pink': '粉色',
        'theme.deep-ocean': '深海',
        'theme.forest': '森林',
        'theme.sunset': '日落',
        'theme.neon': '霓虹',
        'theme.royal': '皇家',
        'theme.desert': '沙漠',
        'theme.aurora': '极光',
        'theme.cherry': '樱花',
        'theme.emerald': '翡翠',
        'theme.dark-night': '暗夜',
        'theme.pure-white': '纯白',
        'theme.cyberpunk': '赛博朋克',
        'theme.pastel': '柔和',
        'theme.midnight': '午夜',
        'theme.lavender': '薰衣草',
        'theme.ocean': '海洋',
        'theme.autumn': '秋季',
        'theme.mint': '薄荷',
        'theme.galaxy': '银河'
    },
    'en-US': {
        'settings.title': 'Settings',
        'settings.theme': 'Theme',
        'settings.time': 'Time Display',
        'settings.time.24h': '24-hour Format',
        'settings.time.seconds': 'Show Seconds',
        'settings.time.blink': 'Blink Separator',
        'settings.navigation': 'Navigation Settings',
        'settings.navigation.reset': 'Reset Shortcuts',
        'settings.language': 'Language',
        'search.placeholder': 'Enter search terms...',
        'search.engines.google': 'Google',
        'search.engines.bing': 'Bing',
        'search.engines.baidu': 'Baidu',
        'search.engines.bingcn': 'Bing China',
        'search.engines.github': 'GitHub',
        'search.engines.zhihu': 'Zhihu',
        'shortcut.add': 'Add Shortcut',
        'shortcut.add.title': 'Add Website Shortcut',
        'shortcut.add.url': 'URL',
        'shortcut.add.name': 'Title',
        'shortcut.add.auto': '- Auto-fetch if empty',
        'shortcut.add.cancel': 'Cancel',
        'shortcut.add.confirm': 'Add',
        'shortcut.reset.title': 'Confirm Reset',
        'shortcut.reset.message': 'Are you sure you want to reset all shortcuts? This will delete all custom shortcuts.',
        'shortcut.reset.cancel': 'Cancel',
        'shortcut.reset.confirm': 'Reset',
        'shortcut.delete.title': 'Confirm Delete',
        'shortcut.delete.message': 'Are you sure you want to delete this shortcut?',
        'shortcut.delete.cancel': 'Cancel',
        'shortcut.delete.confirm': 'Delete',
        'theme.pink': 'Pink',
        'theme.deep-ocean': 'Deep Ocean',
        'theme.forest': 'Forest',
        'theme.sunset': 'Sunset',
        'theme.neon': 'Neon',
        'theme.royal': 'Royal',
        'theme.desert': 'Desert',
        'theme.aurora': 'Aurora',
        'theme.cherry': 'Cherry',
        'theme.emerald': 'Emerald',
        'theme.dark-night': 'Dark Night',
        'theme.pure-white': 'Pure White',
        'theme.cyberpunk': 'Cyberpunk',
        'theme.pastel': 'Pastel',
        'theme.midnight': 'Midnight',
        'theme.lavender': 'Lavender',
        'theme.ocean': 'Ocean',
        'theme.autumn': 'Autumn',
        'theme.mint': 'Mint',
        'theme.galaxy': 'Galaxy'
    }
};

export class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('preferred_language') || 'zh-CN';
        this.translations = translations;
        this.updateDebounceTimer = null;
    }

    // 切换语言
    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('preferred_language', lang);
            this.debouncedUpdatePageTranslations();
        }
    }

    // 获取当前语言的翻译
    getTranslation(key) {
        return this.translations[this.currentLang][key] || key;
    }

    // 防抖更新页面翻译
    debouncedUpdatePageTranslations() {
        if (this.updateDebounceTimer) {
            clearTimeout(this.updateDebounceTimer);
        }
        
        this.updateDebounceTimer = setTimeout(() => {
            // 使用 requestAnimationFrame 确保在下一帧更新
            requestAnimationFrame(() => {
                this.updatePageTranslations();
            });
        }, 150); // 150ms 延迟
    }

    // 更新页面上所有需要翻译的元素
    updatePageTranslations() {
        // 创建文档片段以批量更新
        const fragment = document.createDocumentFragment();
        const elements = document.querySelectorAll('[data-i18n]');
        
        // 批量处理所有翻译
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);
            
            if (element.tagName === 'INPUT' && element.getAttribute('placeholder')) {
                // 对于 placeholder，直接更新属性
                element.placeholder = translation;
            } else {
                // 对于其他元素，先在文档片段中创建副本
                const clone = element.cloneNode(false);
                clone.textContent = translation;
                fragment.appendChild(clone);
            }
        });

        // 一次性应用所有更改
        requestAnimationFrame(() => {
            elements.forEach((element, index) => {
                if (!(element.tagName === 'INPUT' && element.getAttribute('placeholder'))) {
                    element.textContent = fragment.children[index].textContent;
                }
            });
        });
    }
} 