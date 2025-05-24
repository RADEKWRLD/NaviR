import { translations } from './i18n.js';

// Settings management
export class SettingsManager {
    constructor() {
        // Time settings
        this.time24h = document.getElementById('time-24h');
        this.showSeconds = document.getElementById('show-seconds');
        this.blinkSeparator = document.getElementById('blink-separator');
        
        // Language settings
        this.languageInputs = document.querySelectorAll('input[name="language"]');
        
        // Default settings
        this.defaults = {
            time24h: true,
            showSeconds: false,
            blinkSeparator: true,
            language: 'zh-CN'
        };
        
        this.init();
    }

    init() {
        // Load saved settings or use defaults
        this.loadSettings();
        
        // Add event listeners
        this.addEventListeners();

        // Apply current language
        const currentLang = this.getSetting('language');
        this.updateLanguage(currentLang);
    }

    loadSettings() {
        // Time settings
        this.time24h.checked = this.getSetting('time24h');
        this.showSeconds.checked = this.getSetting('showSeconds');
        this.blinkSeparator.checked = this.getSetting('blinkSeparator');
        
        // Language settings
        const currentLang = this.getSetting('language');
        this.languageInputs.forEach(input => {
            input.checked = input.value === currentLang;
        });
    }

    addEventListeners() {
        // Time settings
        this.time24h.addEventListener('change', () => {
            this.saveSetting('time24h', this.time24h.checked);
            this.updateTimeDisplay();
        });

        this.showSeconds.addEventListener('change', () => {
            this.saveSetting('showSeconds', this.showSeconds.checked);
            this.updateTimeDisplay();
        });

        this.blinkSeparator.addEventListener('change', () => {
            this.saveSetting('blinkSeparator', this.blinkSeparator.checked);
            this.updateTimeDisplay();
        });

        // Language settings
        this.languageInputs.forEach(input => {
            input.addEventListener('change', () => {
                if (input.checked) {
                    this.saveSetting('language', input.value);
                    this.updateLanguage(input.value);
                }
            });
        });
    }

    getSetting(key) {
        try {
            const value = localStorage.getItem(`setting_${key}`);
            return value === null ? this.defaults[key] : JSON.parse(value);
        } catch (error) {
            console.warn(`Failed to load setting: ${key}`, error);
            return this.defaults[key];
        }
    }

    saveSetting(key, value) {
        try {
            localStorage.setItem(`setting_${key}`, JSON.stringify(value));
        } catch (error) {
            console.warn(`Failed to save setting: ${key}`, error);
        }
    }

    updateTimeDisplay() {
        // 更新时钟显示
        const clockSpan = document.querySelector('#clock span');
        if (!clockSpan) return;

        const now = new Date();
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        // 处理12/24小时制
        if (!this.getSetting('time24h')) {
            hours = hours % 12 || 12;
        }
        hours = String(hours).padStart(2, '0');

        // 构建时间字符串，使用 span 包裹分隔符
        let timeString = `${hours}<span class="separator">:</span>${minutes}`;
        if (this.getSetting('showSeconds')) {
            timeString += `<span class="separator">:</span>${seconds}`;
        }

        // 更新显示
        clockSpan.innerHTML = timeString;

        // 处理分隔符闪烁
        if (this.getSetting('blinkSeparator')) {
            clockSpan.classList.add('blink-separator');
        } else {
            clockSpan.classList.remove('blink-separator');
        }
    }

    updateLanguage(lang) {
        // 保存语言设置
        this.saveSetting('language', lang);
        
        // 获取所有带有 data-i18n 属性的元素
        const elements = document.querySelectorAll('[data-i18n]');
        
        // 更新每个元素的文本
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = translations[lang][key];
            
            if (translation) {
                // 对于 placeholder 属性的特殊处理
                if (element.hasAttribute('placeholder')) {
                    element.setAttribute('placeholder', translation);
                } else {
                    element.textContent = translation;
                }
            }
        });
    }
} 