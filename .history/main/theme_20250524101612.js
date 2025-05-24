// Theme management
export class ThemeManager {
    constructor() {
        this.settingsBtn = document.getElementById('settings-btn');
        this.settingsModal = document.getElementById('settings-modal');
        this.closeModalBtns = document.querySelectorAll('.close-modal');
        this.themeOptions = document.querySelectorAll('.theme-option');
        this.defaultTheme = 'pink'; // 默认主题
        
        this.init();
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
                
                // Add animation effect
                document.body.style.transition = 'background-color 0.3s ease';
                setTimeout(() => {
                    document.body.style.transition = '';
                }, 300);
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
        this.settingsModal.classList.add('show');
        document.getElementById('main').classList.add('blurred');
    }

    closeSettings() {
        this.settingsModal.classList.remove('show');
        document.getElementById('main').classList.remove('blurred');
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update body class for theme-specific styles
        document.body.className = `theme-${theme}`;
        
        // Apply smooth transition
        requestAnimationFrame(() => {
            document.body.style.transition = 'background 0.3s ease';
            setTimeout(() => {
                document.body.style.transition = '';
            }, 300);
        });
    }

    updateActiveTheme(theme) {
        this.themeOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.theme === theme);
            
            // Add visual feedback
            if (option.dataset.theme === theme) {
                option.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    option.style.transform = '';
                }, 200);
            }
        });
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