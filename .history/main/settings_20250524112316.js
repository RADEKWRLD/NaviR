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
                }
            });
        });
    }

    getSetting(key) {
        try {
            const value = localStorage.getItem(`setting_${key}`);
            return value !== null ? JSON.parse(value) : this.defaults[key];
        } catch (error) {
            console.error('Failed to get setting:', error);
            return this.defaults[key];
        }
    }

    saveSetting(key, value) {
        try {
            localStorage.setItem(`setting_${key}`, JSON.stringify(value));
        } catch (error) {
            console.error('Failed to save setting:', error);
        }
    }

    updateTimeDisplay() {
        // 实现时间显示更新逻辑
        const clockElement = document.getElementById('clock');
        if (clockElement) {
            clockElement.classList.toggle('show-seconds', this.showSeconds.checked);
            clockElement.classList.toggle('blink-separator', this.blinkSeparator.checked);
        }
    }
} 