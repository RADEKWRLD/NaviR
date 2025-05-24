// Theme management
export class ThemeManager {
    constructor() {
        this.settingsBtn = document.getElementById('settings-btn');
        this.settingsModal = document.getElementById('settings-modal');
        this.closeModalBtns = document.querySelectorAll('.close-modal');
        this.themeOptions = document.querySelectorAll('.theme-option');
        
        this.init();
    }

    init() {
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.applyTheme(savedTheme);
            this.updateActiveTheme(savedTheme);
        }

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
                localStorage.setItem('theme', theme);
            });
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
        document.body.setAttribute('data-theme', theme);
    }

    updateActiveTheme(theme) {
        this.themeOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.theme === theme);
        });
    }
} 