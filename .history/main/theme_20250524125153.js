// Theme management
export class ThemeManager {
    constructor() {
        this.settingsBtn = document.getElementById('settings-btn');
        this.settingsModal = document.getElementById('settings-modal');
        this.closeModalBtns = document.querySelectorAll('.close-modal');
        this.themeGrid = document.querySelector('.theme-grid');
        this.defaultThemes = [
            'pink','deep-ocean','forest','sunset','neon','royal','desert','aurora','cherry','emerald','dark-night','pure-white','cyberpunk','pastel','midnight','lavender','ocean','autumn','mint','galaxy','black-yellow','blue-yellow','orange-red','black-blue','purple-gold','emerald-gold','ruby-silver','jade-purple','crimson-gold','azure-rose'
        ];
        this.defaultTheme = 'pink';
        this.languageManager = null;
        this.currentTheme = localStorage.getItem('theme') || 'pink';
        this.customThemes = JSON.parse(localStorage.getItem('custom_themes') || '[]');
        
        this.init();
    }

    setLanguageManager(languageManager) {
        this.languageManager = languageManager;
    }

    init() {
        // 先应用主题
        if (this.currentTheme.startsWith('custom-')) {
            const idx = parseInt(this.currentTheme.split('-')[1]);
            const themeObj = this.customThemes[idx];
            if (themeObj) {
                this.applyCustomTheme(themeObj);
            } else {
                // 如果找不到自定义主题，回退到默认主题
                this.currentTheme = this.defaultTheme;
                this.applyTheme(this.defaultTheme);
            }
        } else {
            this.applyTheme(this.currentTheme);
        }

        this.renderThemeGrid();

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

        // Close settings with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.settingsModal.classList.contains('show')) {
                this.closeSettings();
            }
        });

        this.setupCustomTheme();
    }

    renderThemeGrid() {
        const grid = this.themeGrid;
        grid.innerHTML = '';
        // 渲染默认主题
        this.defaultThemes.forEach(theme => {
            const btn = document.createElement('button');
            btn.className = 'theme-option';
            btn.setAttribute('data-theme', theme);
            // 主题预览
            const preview = document.createElement('div');
            preview.className = `theme-preview ${theme}`;
            btn.appendChild(preview);
            // 主题名
            const span = document.createElement('span');
            span.setAttribute('data-i18n', `theme.${theme}`);
            span.textContent = this.languageManager ? this.languageManager.getTranslation(`theme.${theme}`) : theme;
            btn.appendChild(span);
            // 高亮
            if (this.currentTheme === theme) btn.classList.add('active');
            // 切换主题
            btn.onclick = () => {
                this.setTheme(theme);
                this.renderThemeGrid();
            };
            grid.appendChild(btn);
        });
        // 渲染自定义主题
        this.customThemes.forEach((themeObj, idx) => {
            const btn = document.createElement('button');
            btn.className = 'theme-option custom-theme';
            btn.setAttribute('data-theme', `custom-${idx}`);
            // 预览
            const preview = document.createElement('div');
            preview.className = 'theme-preview custom-preview';
            preview.style.background = `radial-gradient(closest-side at 50% 50%, ${themeObj.colors[0]}, transparent 100%),radial-gradient(closest-side at 60% 40%, ${themeObj.colors[1]}, transparent 100%),radial-gradient(closest-side at 40% 60%, ${themeObj.colors[2]}, transparent 100%),radial-gradient(closest-side at 30% 70%, ${themeObj.colors[3]}, transparent 100%),radial-gradient(closest-side at 70% 30%, ${themeObj.colors[4]}, transparent 100%)`;
            preview.style.backgroundSize = '200% 200%';
            preview.style.backgroundPosition = '0 0';
            btn.appendChild(preview);
            // 名称
            const span = document.createElement('span');
            span.setAttribute('data-i18n', 'settings.theme.custom');
            span.textContent = this.languageManager ? this.languageManager.getTranslation('settings.theme.custom') : '自定义主题';
            btn.appendChild(span);
            // 删除按钮
            const del = document.createElement('span');
            del.textContent = '×';
            del.title = '删除';
            del.className = 'delete-custom-theme-btn';
            del.style.position = 'absolute';
            del.style.top = '4px';
            del.style.right = '8px';
            del.style.cursor = 'pointer';
            del.style.color = '#f55';
            del.onclick = (e) => {
                e.stopPropagation();
                this.deleteCustomTheme(idx);
            };
            btn.style.position = 'relative';
            btn.appendChild(del);
            // 高亮
            if (this.currentTheme === `custom-${idx}`) btn.classList.add('active');
            // 切换主题
            btn.onclick = (e) => {
                if (e.target === del) return;
                this.applyCustomTheme(themeObj);
                this.currentTheme = `custom-${idx}`;
                localStorage.setItem('theme', `custom-${idx}`);
                localStorage.setItem('current_custom_theme_idx', idx);
                this.renderThemeGrid();
            };
            grid.appendChild(btn);
        });
    }

    deleteCustomTheme(idx) {
        // 如果当前用的是被删的主题，切回默认
        if (this.currentTheme === `custom-${idx}`) {
            this.setTheme(this.defaultTheme);
        }
        this.customThemes.splice(idx, 1);
        localStorage.setItem('custom_themes', JSON.stringify(this.customThemes));
        this.renderThemeGrid();
    }

    setTheme(theme) {
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        if (theme.startsWith('custom-')) {
            const idx = parseInt(theme.split('-')[1]);
            const themeObj = this.customThemes[idx];
            if (themeObj) this.applyCustomTheme(themeObj);
            localStorage.setItem('current_custom_theme_idx', idx);
        } else {
            this.applyTheme(theme);
            localStorage.removeItem('current_custom_theme_idx');
        }
        this.renderThemeGrid();
    }

    setupCustomTheme() {
        // 获取所有颜色输入元素
        const colorInputs = document.querySelectorAll('input[type="color"]');
        const hexInputs = document.querySelectorAll('.color-hex');
        const preview = document.querySelector('.custom-preview');
        const saveButton = document.querySelector('.save-theme-btn');

        // 初始化颜色值
        const defaultColors = [
            '#eb694e', '#f30ba4', '#feea83', '#aa8ef5', '#f8c093'
        ];

        colorInputs.forEach((input, index) => {
            input.value = defaultColors[index];
            const hexInput = document.querySelector(`[data-for="${input.id}"]`);
            if (hexInput) {
                hexInput.value = defaultColors[index].toUpperCase();
            }
        });

        // 更新预览
        this.updateCustomPreview();

        // 颜色输入事件处理
        colorInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const hexInput = document.querySelector(`[data-for="${input.id}"]`);
                if (hexInput) {
                    hexInput.value = e.target.value.toUpperCase();
                }
                this.updateCustomPreview();
            });
        });

        // HEX输入事件处理
        hexInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const colorInput = document.getElementById(input.getAttribute('data-for'));
                if (colorInput && this.isValidHex(e.target.value)) {
                    colorInput.value = e.target.value;
                    this.updateCustomPreview();
                }
            });
        });

        // 保存自定义主题
        saveButton.addEventListener('click', () => {
            const colors = Array.from(colorInputs).map(input => input.value);
            this.saveCustomTheme(colors);
        });
    }

    updateCustomPreview() {
        const preview = document.querySelector('.custom-preview');
        const colors = Array.from(document.querySelectorAll('input[type="color"]')).map(input => input.value);
        
        preview.style.background = `
            radial-gradient(closest-side at 50% 50%, ${colors[0]}, transparent 100%),
            radial-gradient(closest-side at 60% 40%, ${colors[1]}, transparent 100%),
            radial-gradient(closest-side at 40% 60%, ${colors[2]}, transparent 100%),
            radial-gradient(closest-side at 30% 70%, ${colors[3]}, transparent 100%),
            radial-gradient(closest-side at 70% 30%, ${colors[4]}, transparent 100%)
        `;
        preview.style.backgroundSize = '200% 200%';
        preview.style.backgroundPosition = '0 0';
        preview.style.animation = 'gradientMove 10s ease infinite';
    }

    saveCustomTheme(colors) {
        const customTheme = {
            name: 'custom_' + Date.now(),
            colors: colors
        };
        this.customThemes.push(customTheme);
        localStorage.setItem('custom_themes', JSON.stringify(this.customThemes));
        this.applyCustomTheme(customTheme);
        this.setTheme('custom-' + (this.customThemes.length - 1));
        localStorage.setItem('current_custom_theme_idx', this.customThemes.length - 1);
        this.showSaveSuccess();
    }

    applyCustomTheme(theme) {
        document.documentElement.style.setProperty('--gradient-1', theme.colors[0]);
        document.documentElement.style.setProperty('--gradient-2', theme.colors[1]);
        document.documentElement.style.setProperty('--gradient-3', theme.colors[2]);
        document.documentElement.style.setProperty('--gradient-4', theme.colors[3]);
        document.documentElement.style.setProperty('--gradient-5', theme.colors[4]);
    }

    showSaveSuccess() {
        const saveButton = document.querySelector('.save-theme-btn');
        const originalText = saveButton.textContent;
        
        saveButton.textContent = this.languageManager ? 
            this.languageManager.getTranslation('settings.theme.saved') : 
            '已保存';
        
        saveButton.disabled = true;
        
        setTimeout(() => {
            saveButton.textContent = originalText;
            saveButton.disabled = false;
        }, 2000);
    }

    isValidHex(hex) {
        return /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    }

    openSettings() {
        this.settingsModal.classList.add('show');
        document.getElementById('main').classList.add('blurred');
        // 打开设置时更新翻译
        if (this.languageManager) {
            this.languageManager.updatePageTranslations();
        }
    }

    closeSettings() {
        this.settingsModal.classList.remove('show');
        document.getElementById('main').classList.remove('blurred');
    }

    applyTheme(theme) {
        // 设置过渡效果
        document.body.style.transition = 'background 0.3s ease, background-color 0.3s ease';

        // 如果不是自定义主题，移除自定义CSS变量
        if (theme !== 'custom') {
            const root = document.documentElement;
            for (let i = 1; i <= 5; i++) {
                root.style.removeProperty(`--gradient-${i}`);
            }
        }

        // 应用主题
        document.documentElement.setAttribute('data-theme', theme);
        document.body.className = `theme-${theme}`;

        // 300ms 后移除过渡效果
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    // 获取当前主题
    getCurrentTheme() {
        return localStorage.getItem('theme') || this.defaultTheme;
    }
} 