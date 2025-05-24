// Theme management
export class ThemeManager {
    constructor() {
        this.settingsBtn = document.getElementById('settings-btn');
        this.settingsModal = document.getElementById('settings-modal');
        this.closeModalBtns = document.querySelectorAll('.close-modal');
        this.themeOptions = document.querySelectorAll('.theme-option');
        this.defaultTheme = 'pink'; // 默认主题
        this.languageManager = null; // 将在初始化时设置
        this.isAnimating = false; // 添加动画状态标记
        
        this.init();
    }

    setLanguageManager(languageManager) {
        this.languageManager = languageManager;
    }

    init() {
        // Load saved theme or use default
        const savedTheme = localStorage.getItem('theme') || this.defaultTheme;
        this.applyTheme(savedTheme, false); // 初始化时不需要动画
        this.updateActiveTheme(savedTheme);

        // Add event listeners
        this.settingsBtn.addEventListener('click', () => {
            if (!this.isAnimating) {
                this.openSettings();
            }
        });
        
        this.closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (!this.isAnimating) {
                    this.closeSettings();
                }
            });
        });
        
        this.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.settingsModal && !this.isAnimating) {
                this.closeSettings();
            }
        });

        // Theme selection
        this.themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                if (!this.isAnimating) {
                    const theme = option.dataset.theme;
                    this.applyTheme(theme, true);
                    this.updateActiveTheme(theme);
                    this.saveTheme(theme);
                }
            });
        });

        // Close settings with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.settingsModal.classList.contains('show') && !this.isAnimating) {
                this.closeSettings();
            }
        });
    }

    openSettings() {
        this.isAnimating = true;
        this.settingsModal.classList.add('show');
        document.getElementById('main').classList.add('blurred');
        
        // 打开设置时更新翻译
        if (this.languageManager) {
            this.languageManager.updatePageTranslations();
        }
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 300);
    }

    closeSettings() {
        this.isAnimating = true;
        this.settingsModal.classList.remove('show');
        document.getElementById('main').classList.remove('blurred');
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 300);
    }

    applyTheme(theme, animate = true) {
        if (animate) {
            this.isAnimating = true;
            // 设置过渡效果
            document.body.style.transition = 'background 0.3s ease, background-color 0.3s ease';
        }
        
        // 应用主题
        document.documentElement.setAttribute('data-theme', theme);
        document.body.className = `theme-${theme}`;
        
        if (animate) {
            // 300ms 后移除过渡效果
            setTimeout(() => {
                document.body.style.transition = '';
                this.isAnimating = false;
            }, 300);
        }
    }

    updateActiveTheme(theme) {
        this.themeOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.theme === theme);
            
            // Add visual feedback only for the selected theme
            if (option.dataset.theme === theme) {
                option.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    option.style.transform = '';
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