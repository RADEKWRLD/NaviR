import { translations } from './i18n.js';

export class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('preferred_language') || 'zh-CN';
        this.translations = translations;
        this.observers = new Set();
    }

    // 添加观察者
    addObserver(observer) {
        this.observers.add(observer);
    }

    // 移除观察者
    removeObserver(observer) {
        this.observers.delete(observer);
    }

    // 通知所有观察者语言变化
    notifyObservers() {
        this.observers.forEach(observer => {
            if (typeof observer.onLanguageChange === 'function') {
                observer.onLanguageChange(this.currentLang);
            }
        });
    }

    // 切换语言
    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('preferred_language', lang);
            this.updatePageTranslations();
            this.notifyObservers();
        }
    }

    // 获取当前语言的翻译
    getTranslation(key) {
        return this.translations[this.currentLang][key] || key;
    }

    // 更新页面上所有需要翻译的元素
    updatePageTranslations() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);
            
            if (element.tagName === 'INPUT' && element.getAttribute('placeholder')) {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });

        // 更新动态内容的翻译
        this.updateDynamicContent();
    }

    // 更新动态内容的翻译
    updateDynamicContent() {
        // 更新快捷方式名称
        const shortcuts = document.querySelectorAll('.shortcut-item span');
        shortcuts.forEach(span => {
            const presetKey = span.getAttribute('data-preset');
            if (presetKey) {
                const translation = this.getTranslation(`preset.${presetKey}`);
                if (translation) {
                    span.textContent = translation;
                }
            }
        });

        // 更新搜索引擎名称
        const engineBtn = document.getElementById('engine-btn');
        if (engineBtn) {
            const currentEngine = engineBtn.textContent;
            const engineKey = `search.engines.${currentEngine.toLowerCase()}`;
            const translation = this.getTranslation(engineKey);
            if (translation) {
                engineBtn.textContent = translation;
            }
        }
    }
} 