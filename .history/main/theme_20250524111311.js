// Theme management
export class ThemeManager {
    constructor() {
        this.settingsBtn = document.getElementById('settings-btn');
        this.settingsModal = document.getElementById('settings-modal');
        this.closeModalBtns = document.querySelectorAll('.close-modal');
        this.themeOptions = document.querySelectorAll('.theme-option');
        this.defaultTheme = 'pink'; // 默认主题
        this.languageManager = null; // 将在初始化时设置
        this.mainElement = document.getElementById('main');
        
        // 预先设置 modal 的 transform-origin
        this.settingsModal.style.transformOrigin = 'center center';
        
        this.init();
    }

    setLanguageManager(languageManager) {
        this.languageManager = languageManager;
    }

    init() {
        // Load saved theme or use default
        const savedTheme = localStorage.getItem('theme') || this.defaultTheme;
        this.applyTheme(savedTheme);
        this.updateActiveTheme(savedTheme);

        // Add event listeners
        this.settingsBtn.addEventListener('click', () => this.openSettings());
        this.closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => this.closeSettings());
        });
        this.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) {
                this.closeSettings();
            }
        });

        // Theme selection
        this.themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                this.applyTheme(theme);
                this.updateActiveTheme(theme);
                this.saveTheme(theme);
            });
        });

        // Close settings with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.settingsModal.classList.contains('show')) {
                this.closeSettings();
            }
        });
    }

    openSettings() {
        // 使用 will-change 提示浏览器即将进行动画
        this.settingsModal.style.willChange = 'opacity, transform';
        this.mainElement.style.willChange = 'filter, transform';
        
        // 使用 requestAnimationFrame 确保在下一帧执行动画
        requestAnimationFrame(() => {
            this.settingsModal.classList.add('show');
            this.mainElement.classList.add('blurred');
            
            // 动画完成后移除 will-change
            setTimeout(() => {
                this.settingsModal.style.willChange = '';
                this.mainElement.style.willChange = '';
            }, 300);
            
            // 打开设置时更新翻译
            if (this.languageManager) {
                this.languageManager.updatePageTranslations();
            }
        });
    }

    closeSettings() {
        // 使用 will-change 提示浏览器即将进行动画
        this.settingsModal.style.willChange = 'opacity, transform';
        this.mainElement.style.willChange = 'filter, transform';
        
        requestAnimationFrame(() => {
            this.settingsModal.classList.remove('show');
            this.mainElement.classList.remove('blurred');
            
            // 动画完成后移除 will-change
            setTimeout(() => {
                this.settingsModal.style.willChange = '';
                this.mainElement.style.willChange = '';
            }, 300);
        });
    }

    applyTheme(theme) {
        // 使用 will-change 提示浏览器即将改变背景
        document.body.style.willChange = 'background-image, background-color';
        
        // 设置过渡效果
        document.body.style.transition = 'background 0.3s ease, background-color 0.3s ease';
        
        // 应用主题
        document.documentElement.setAttribute('data-theme', theme);
        document.body.className = `theme-${theme}`;
        
        // 300ms 后移除过渡效果和 will-change
        setTimeout(() => {
            document.body.style.transition = '';
            document.body.style.willChange = '';
        }, 300);
    }

    updateActiveTheme(theme) {
        this.themeOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.theme === theme);
            
            // Add visual feedback with hardware acceleration
            if (option.dataset.theme === theme) {
                option.style.willChange = 'transform';
                option.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    option.style.transform = '';
                    option.style.willChange = '';
                }, 200);
            }
        });

        // 更新主题名称的翻译
        if (this.languageManager) {
            this.languageManager.updatePageTranslations();
        }
    }

    saveTheme(theme) {
        try {
            localStorage.setItem('theme', theme);
        } catch (error) {
            console.warn('Failed to save theme to localStorage:', error);
        }
    }

    // 获取当前主题
    getCurrentTheme() {
        return localStorage.getItem('theme') || this.defaultTheme;
    }
} 