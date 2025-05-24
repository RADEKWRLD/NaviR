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
        this.isMobile = window.matchMedia('(max-width: 768px)').matches;
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
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

        // 监听屏幕尺寸变化
        window.matchMedia('(max-width: 768px)').addEventListener('change', (e) => {
            this.isMobile = e.matches;
        });

        // 监听减少动画偏好
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            this.prefersReducedMotion = e.matches;
        });
    }

    openSettings() {
        if (this.prefersReducedMotion) {
            this.settingsModal.classList.add('show');
            document.getElementById('main').classList.add('blurred');
            if (this.languageManager) {
                this.languageManager.updatePageTranslations();
            }
            return;
        }

        this.isAnimating = true;
        const duration = this.isMobile ? 200 : 300;
        
        requestAnimationFrame(() => {
            this.settingsModal.classList.add('show');
            document.getElementById('main').classList.add('blurred');
            
            if (this.languageManager) {
                this.languageManager.updatePageTranslations();
            }
            
            setTimeout(() => {
                this.isAnimating = false;
            }, duration);
        });
    }

    closeSettings() {
        if (this.prefersReducedMotion) {
            this.settingsModal.classList.remove('show');
            document.getElementById('main').classList.remove('blurred');
            return;
        }

        this.isAnimating = true;
        const duration = this.isMobile ? 200 : 300;
        
        requestAnimationFrame(() => {
            this.settingsModal.classList.remove('show');
            document.getElementById('main').classList.remove('blurred');
            
            setTimeout(() => {
                this.isAnimating = false;
            }, duration);
        });
    }

    applyTheme(theme, animate = true) {
        if (this.prefersReducedMotion || !animate) {
            document.documentElement.setAttribute('data-theme', theme);
            document.body.className = `theme-${theme}`;
            return;
        }

        this.isAnimating = true;
        const duration = this.isMobile ? 200 : 300;
        
        requestAnimationFrame(() => {
            document.body.style.transition = `background ${duration}ms cubic-bezier(0.4, 0, 0.2, 1), background-color ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
            document.documentElement.setAttribute('data-theme', theme);
            document.body.className = `theme-${theme}`;
            
            setTimeout(() => {
                document.body.style.transition = '';
                this.isAnimating = false;
            }, duration);
        });
    }

    updateActiveTheme(theme) {
        this.themeOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.theme === theme);
            
            if (option.dataset.theme === theme && !this.prefersReducedMotion) {
                option.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    option.style.transform = '';
                }, this.isMobile ? 150 : 200);
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