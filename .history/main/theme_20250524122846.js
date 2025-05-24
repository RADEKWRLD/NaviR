// Theme management
export class ThemeManager {
    constructor() {
        this.settingsBtn = document.getElementById('settings-btn');
        this.settingsModal = document.getElementById('settings-modal');
        this.closeModalBtns = document.querySelectorAll('.close-modal');
        this.themeOptions = document.querySelectorAll('.theme-option');
        this.defaultTheme = 'pink'; // 默认主题
        this.languageManager = null; // 将在初始化时设置
        this.currentTheme = localStorage.getItem('theme') || 'pink';
        this.customThemes = JSON.parse(localStorage.getItem('custom_themes') || '[]');
        
        this.init();
    }

    setLanguageManager(languageManager) {
        this.languageManager = languageManager;
    }

    init() {
        // Load saved theme or use default
        this.applyTheme(this.currentTheme);
        this.updateActiveTheme(this.currentTheme);

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
                this.setTheme(theme);
            });
        });

        // Close settings with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.settingsModal.classList.contains('show')) {
                this.closeSettings();
            }
        });

        this.setupThemeButtons();
        this.setupCustomTheme();
    }

    setupThemeButtons() {
        const themeButtons = document.querySelectorAll('.theme-option');
        themeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const theme = button.getAttribute('data-theme');
                this.setTheme(theme);
                
                // 移除所有按钮的active类
                themeButtons.forEach(btn => btn.classList.remove('active'));
                // 给当前按钮添加active类
                button.classList.add('active');
            });
        });
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

        // 渲染自定义主题列表
        this.renderCustomThemeList();
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
        this.setTheme('custom');
        localStorage.setItem('current_custom_theme_idx', this.customThemes.length - 1);
        this.showSaveSuccess();
        this.renderCustomThemeList();
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
        
        // 应用主题
        document.documentElement.setAttribute('data-theme', theme);
        document.body.className = `theme-${theme}`;
        
        // 300ms 后移除过渡效果
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
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

        // 更新主题名称的翻译
        if (this.languageManager) {
            this.languageManager.updatePageTranslations();
        }
    }

    setTheme(theme) {
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        this.applyTheme(theme);
        this.updateActiveTheme(theme);
    }

    // 获取当前主题
    getCurrentTheme() {
        return localStorage.getItem('theme') || this.defaultTheme;
    }

    // 渲染自定义主题列表
    renderCustomThemeList() {
        const listContainer = document.querySelector('.custom-theme-list');
        listContainer.innerHTML = '';
        if (!this.customThemes.length) {
            listContainer.innerHTML = '<div style="color:#aaa;text-align:center;padding:8px 0;">暂无自定义主题</div>';
            return;
        }
        this.customThemes.forEach((theme, idx) => {
            const item = document.createElement('div');
            item.className = 'custom-theme-item';
            item.style.display = 'flex';
            item.style.alignItems = 'center';
            item.style.gap = '12px';
            item.style.margin = '8px 0';

            // 预览
            const preview = document.createElement('div');
            preview.className = 'custom-theme-preview';
            preview.style.width = '60px';
            preview.style.height = '32px';
            preview.style.borderRadius = '8px';
            preview.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            preview.style.background = `radial-gradient(closest-side at 50% 50%, ${theme.colors[0]}, transparent 100%),radial-gradient(closest-side at 60% 40%, ${theme.colors[1]}, transparent 100%),radial-gradient(closest-side at 40% 60%, ${theme.colors[2]}, transparent 100%),radial-gradient(closest-side at 30% 70%, ${theme.colors[3]}, transparent 100%),radial-gradient(closest-side at 70% 30%, ${theme.colors[4]}, transparent 100%)`;
            preview.style.backgroundSize = '200% 200%';
            preview.style.backgroundPosition = '0 0';

            // 应用按钮
            const applyBtn = document.createElement('button');
            applyBtn.textContent = '应用';
            applyBtn.className = 'apply-custom-theme-btn';
            applyBtn.style.marginLeft = '8px';
            applyBtn.onclick = () => {
                this.applyCustomTheme(theme);
                this.setTheme('custom'); // 标记为自定义主题
                // 记录当前自定义主题索引
                localStorage.setItem('current_custom_theme_idx', idx);
            };

            // 删除按钮
            const delBtn = document.createElement('button');
            delBtn.textContent = '删除';
            delBtn.className = 'delete-custom-theme-btn';
            delBtn.style.marginLeft = '4px';
            delBtn.onclick = () => {
                this.customThemes.splice(idx, 1);
                localStorage.setItem('custom_themes', JSON.stringify(this.customThemes));
                // 如果当前删除的是正在用的自定义主题，则恢复默认主题
                if (localStorage.getItem('current_custom_theme_idx') == idx) {
                    this.setTheme(this.defaultTheme);
                    localStorage.removeItem('current_custom_theme_idx');
                }
                this.renderCustomThemeList();
            };

            item.appendChild(preview);
            item.appendChild(applyBtn);
            item.appendChild(delBtn);
            listContainer.appendChild(item);
        });
    }
} 