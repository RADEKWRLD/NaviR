// 主题管理器
const API_URL = 'http://localhost:5000';  // 添加 API_URL 定义

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
        
        // 从本地存储中获取主题
        this.currentTheme = localStorage.getItem('theme') || this.defaultTheme;
        
        // 初始化自定义主题数组
        this.customThemes = [];
        
        // 获取当前用户信息
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (currentUser && currentUser.settings && Array.isArray(currentUser.settings.custom_themes)) {
            // 从用户设置中加载自定义主题（过滤掉null值）
            const validThemes = currentUser.settings.custom_themes.filter(colors => colors !== null);
            
            // 创建主题对象
            this.customThemes = validThemes.map((colors, index) => ({
                name: `custom_${Date.now()}_${index}`,
                colors: colors
            }));
            
            // 更新用户设置中的自定义主题（移除null值）
            currentUser.settings.custom_themes = validThemes;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            console.log('从用户设置加载自定义主题：', this.customThemes);
        } else {
            // 从本地存储中加载自定义主题
            try {
                const storedThemes = JSON.parse(localStorage.getItem('custom_themes') || '[]');
                // 过滤并转换主题
                this.customThemes = storedThemes
                    .filter(theme => theme !== null && (Array.isArray(theme) || (theme && Array.isArray(theme.colors))))
                    .map((theme, index) => {
                        if (Array.isArray(theme)) {
                            return {
                                name: `custom_${Date.now()}_${index}`,
                                colors: theme
                            };
                        }
                        return theme;
                    });
                
                console.log('从本地存储加载自定义主题：', this.customThemes);
            } catch (error) {
                console.error('加载自定义主题失败：', error);
                this.customThemes = [];
            }
        }
        
        // 保存清理后的自定义主题到本地存储
        localStorage.setItem('custom_themes', JSON.stringify(this.customThemes));
        
        // 如果当前主题是自定义主题，确保它存在
        if (this.currentTheme.startsWith('custom-')) {
            const idx = parseInt(this.currentTheme.split('-')[1]);
            if (!this.customThemes[idx] || !this.customThemes[idx].colors) {
                // 如果自定义主题不存在或无效，切换到默认主题
                this.currentTheme = this.defaultTheme;
                localStorage.setItem('theme', this.defaultTheme);
            }
        }
        
        this.init();
    }

    setLanguageManager(languageManager) {
        this.languageManager = languageManager;
    }

    init() {
        console.log('初始化主题管理器，当前主题：', this.currentTheme, '自定义主题数量：', this.customThemes.length);
        console.log('自定义主题列表：', this.customThemes);
        
        // 先应用主题
        if (this.currentTheme.startsWith('custom-')) {
            const idx = parseInt(this.currentTheme.split('-')[1]);
            console.log('当前是自定义主题，索引：', idx);
            const themeObj = this.customThemes[idx];
            if (themeObj && themeObj.colors) {
                console.log('应用自定义主题：', themeObj);
                this.applyCustomTheme(themeObj);
            } else {
                // 如果找不到自定义主题或主题无效，回退到默认主题
                console.log('找不到自定义主题或主题无效，回退到默认主题');
                this.currentTheme = this.defaultTheme;
                localStorage.setItem('theme', this.defaultTheme);
                this.applyTheme(this.defaultTheme);
            }
        } else {
            console.log('应用默认主题：', this.currentTheme);
            this.applyTheme(this.currentTheme);
        }

        // 渲染主题网格
        this.renderThemeGrid();
        console.log('主题网格渲染完成');

        // 添加事件监听器
        this.settingsBtn.addEventListener('click', () => this.openSettings());
        this.closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => this.closeSettings());
        });
        this.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) {
                this.closeSettings();
            }
        });

        // 关闭设置时使用Escape键
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.settingsModal.classList.contains('show')) {
                this.closeSettings();
            }
        });

        // 初始化自定义主题设置
        this.setupCustomTheme();
    }

    renderThemeGrid() {
        console.log('渲染主题网格，当前主题：', this.currentTheme);
        console.log('自定义主题数据：', this.customThemes);
        
        const grid = this.themeGrid;
        if (!grid) {
            console.error('找不到主题网格元素');
            return;
        }
        
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
            // 高亮当前主题
            if (this.currentTheme === theme) {
                btn.classList.add('active');
            }
            // 切换主题
            btn.onclick = () => {
                this.setTheme(theme);
            };
            grid.appendChild(btn);
        });
        
        // 渲染自定义主题
        console.log('开始渲染自定义主题');
        
        // 渲染有效的自定义主题
        this.customThemes.forEach((themeObj, idx) => {
            // 验证主题对象
            if (!themeObj || !themeObj.colors || !Array.isArray(themeObj.colors) || themeObj.colors.length !== 5) {
                console.log(`跳过无效的主题 ${idx}`);
                return;
            }
            
            console.log(`渲染自定义主题 ${idx}:`, themeObj);
            
            const btn = document.createElement('button');
            btn.className = 'theme-option custom-theme';
            btn.setAttribute('data-theme', `custom-${idx}`);
            
            // 预览
            const preview = document.createElement('div');
            preview.className = 'theme-preview custom-preview';
            
            // 获取主题颜色
            let colors = themeObj.colors;
            
            // 如果是当前主题，从CSS变量中获取实际颜色
            if (this.currentTheme === `custom-${idx}`) {
                colors = [];
                for (let i = 1; i <= 5; i++) {
                    const color = getComputedStyle(document.documentElement)
                        .getPropertyValue(`--gradient-${i}`)
                        .trim();
                    colors.push(color || themeObj.colors[i-1]);
                }
            }
            
            console.log(`自定义主题 ${idx} 的颜色:`, colors);
            
            // 设置渐变背景
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
            btn.appendChild(preview);
            
            // 名称
            const span = document.createElement('span');
            span.setAttribute('data-i18n', 'settings.theme.custom');
            span.textContent = this.languageManager ? 
                this.languageManager.getTranslation('settings.theme.custom') : 
                '自定义主题';
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
            
            // 高亮当前主题
            if (this.currentTheme === `custom-${idx}`) {
                btn.classList.add('active');
                console.log(`自定义主题 ${idx} 被高亮显示`);
            }
            
            // 切换主题
            btn.onclick = (e) => {
                if (e.target === del) return;
                console.log(`点击自定义主题 ${idx}`);
                this.applyCustomTheme(themeObj);
                this.setTheme(`custom-${idx}`);
            };
            
            grid.appendChild(btn);
        });
        
        console.log('主题网格渲染完成');
    }

    deleteCustomTheme(idx) {
        console.log('删除自定义主题，索引：', idx);
        
        // 如果当前用的是被删的主题，切回默认主题
        if (this.currentTheme === `custom-${idx}`) {
            // 先切换到默认主题
            this.currentTheme = this.defaultTheme;
            localStorage.setItem('theme', this.defaultTheme);
            this.applyTheme(this.defaultTheme);
        }
        
        // 获取当前用户信息
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        // 更新本地主题列表 - 先处理本地删除，确保索引有效
        if (idx >= 0 && idx < this.customThemes.length) {
            // 删除主题并清理null值
            this.customThemes.splice(idx, 1);
            this.customThemes = this.customThemes.filter(theme => theme !== null);
            
            // 立即更新本地存储
            localStorage.setItem('custom_themes', JSON.stringify(this.customThemes));
        }
        
        if (currentUser && currentUser.settings) {
            // 保存当前的用户名和登录状态
            const userName = currentUser.name || (currentUser.email ? currentUser.email.split('@')[0] : null);
            
            // 确保custom_themes是一个数组
            if (!Array.isArray(currentUser.settings.custom_themes)) {
                currentUser.settings.custom_themes = [];
            }
            
            // 检查索引是否有效
            if (idx >= 0 && idx < currentUser.settings.custom_themes.length) {
                // 删除主题并清理数组中的null值
                currentUser.settings.custom_themes.splice(idx, 1);
                currentUser.settings.custom_themes = currentUser.settings.custom_themes.filter(theme => theme !== null);
                
                // 确保用户名没有变化
                if (userName) {
                    currentUser.name = userName;
                }
                
                // 更新本地存储中的用户信息
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                // 确保UI上的用户名显示正确
                const loginBtn = document.getElementById('login-btn');
                if (loginBtn) {
                    const userNameDisplay = loginBtn.querySelector('.user-name');
                    if (userNameDisplay && userName) {
                        userNameDisplay.textContent = userName;
                        loginBtn.classList.add('logged-in');
                    }
                }
                
                // 同步到后端
                const authToken = localStorage.getItem('authToken');
                if (authToken) {
                    // 按照API要求准备请求数据
                    const settingsData = {
                        theme: this.defaultTheme,
                        delete_custom_theme: true,
                        delete_index: idx
                    };
                    
                    // 发送到后端
                    fetch(`${API_URL}/settings`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': authToken
                        },
                        body: JSON.stringify(settingsData)
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('删除主题失败');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('主题删除成功，后端返回：', data);
                        
                        // 更新本地主题列表
                        if (data.current_settings && Array.isArray(data.current_settings.custom_themes)) {
                            // 过滤掉null值并创建新的主题对象
                            this.customThemes = data.current_settings.custom_themes
                                .filter(colors => colors !== null)
                                .map((colors, index) => ({
                                    name: `custom_${Date.now()}_${index}`,
                                    colors: colors
                                }));
                            
                            // 更新本地存储
                            localStorage.setItem('custom_themes', JSON.stringify(this.customThemes));
                            
                            // 更新用户设置中的自定义主题（确保没有null值）
                            currentUser.settings.custom_themes = data.current_settings.custom_themes.filter(theme => theme !== null);
                            localStorage.setItem('currentUser', JSON.stringify(currentUser));
                        }
                        
                        // 重新渲染主题网格
                        this.renderThemeGrid();
                    })
                    .catch(error => {
                        console.error('删除主题时出错:', error);
                    });
                }
            } else {
                console.error('无效的主题索引:', idx);
            }
        }
        
        // 重新渲染主题网格
        this.renderThemeGrid();
        
        console.log('自定义主题删除完成，当前主题列表：', this.customThemes);
    }

    async setTheme(theme) {
        console.log('设置主题：', theme);
        
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        
        // 同时更新 currentUser 中的主题设置（如果已登录）
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.settings) {
            // 保存当前的用户名和登录状态
            const userName = currentUser.name || (currentUser.email ? currentUser.email.split('@')[0] : null);
            
            const updatedUser = {
                ...currentUser,
                settings: {
                    ...currentUser.settings,
                    theme: theme
                }
            };
            
            // 确保用户名没有变化
            if (userName) {
                updatedUser.name = userName;
            }
            
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            
            // 确保UI上的用户名显示正确
            const loginBtn = document.getElementById('login-btn');
            if (loginBtn) {
                const userNameDisplay = loginBtn.querySelector('.user-name');
                if (userNameDisplay && userName) {
                    userNameDisplay.textContent = userName;
                    loginBtn.classList.add('logged-in');
                }
            }
        }

        try {
            // 同步主题到后端（仅当已登录时）
            const authToken = localStorage.getItem('authToken');
            if (authToken) {
                // 准备要发送的数据
                const settingsData = {
                    theme: theme
                };
                
                // 如果是自定义主题，添加相关数据
                if (theme.startsWith('custom-')) {
                    const idx = parseInt(theme.split('-')[1]);
                    const themeObj = this.customThemes[idx];
                    if (themeObj && themeObj.colors) {
                        settingsData.custom_themes = this.customThemes.map(theme => 
                            theme ? theme.colors : null
                        );
                    }
                }
                
                const response = await fetch(`${API_URL}/settings`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': authToken
                    },
                    body: JSON.stringify(settingsData)
                });

                if (!response.ok) {
                    console.error('同步主题到后端失败');
                } else {
                    console.log('主题同步成功');
                }
            }
        } catch (error) {
            console.error('同步主题时出错:', error);
        }

        // 应用主题
        if (theme.startsWith('custom-')) {
            const idx = parseInt(theme.split('-')[1]);
            const themeObj = this.customThemes[idx];
            if (themeObj && themeObj.colors) {
                this.applyCustomTheme(themeObj);
            } else {
                // 如果自定义主题不存在或无效，回退到默认主题
                console.warn('自定义主题无效，回退到默认主题');
                this.currentTheme = this.defaultTheme;
                localStorage.setItem('theme', this.defaultTheme);
                this.applyTheme(this.defaultTheme);
            }
        } else {
            this.applyTheme(theme);
        }
        
        // 重新渲染主题网格以更新显示
        this.renderThemeGrid();
        
        console.log('主题设置完成');
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
        console.log('保存自定义主题：', colors);
        
        // 创建新的主题对象
        const newTheme = {
            name: `custom_${Date.now()}`,
            colors: colors
        };
        
        // 添加到自定义主题列表
        this.customThemes.push(newTheme);
        
        // 保存到本地存储
        localStorage.setItem('custom_themes', JSON.stringify(this.customThemes));
        
        // 获取当前用户信息
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.settings) {
            // 更新用户设置中的自定义主题 - 只保存颜色数组
            if (!Array.isArray(currentUser.settings.custom_themes)) {
                currentUser.settings.custom_themes = [];
            }
            
            // 将新主题添加到用户设置 - 确保只存储颜色数组
            currentUser.settings.custom_themes = this.customThemes.map(theme => theme.colors);
            
            // 保存更新后的用户信息
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // 如果用户已登录，同步到后端
            const authToken = localStorage.getItem('authToken');
            if (authToken) {
                fetch(`${API_URL}/settings`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': authToken
                    },
                    body: JSON.stringify({
                        custom_themes: currentUser.settings.custom_themes // 直接发送颜色数组的数组
                    })
                }).catch(error => console.error('同步自定义主题到后端失败:', error));
            }
        }
        
        // 应用新主题
        this.applyCustomTheme(newTheme);
        this.setTheme(`custom-${this.customThemes.length - 1}`);
        
        // 重新渲染主题网格
        this.renderThemeGrid();
        
        // 显示保存成功提示
        this.showSaveSuccess();
    }

    applyCustomTheme(theme) {
        document.documentElement.style.setProperty('--gradient-1', theme.colors[0]);
        document.documentElement.style.setProperty('--gradient-2', theme.colors[1]);
        document.documentElement.style.setProperty('--gradient-3', theme.colors[2]);
        document.documentElement.style.setProperty('--gradient-4', theme.colors[3]);
        document.documentElement.style.setProperty('--gradient-5', theme.colors[4]);

        // 更新自定义主题预览
        const preview = document.querySelector('.custom-preview.big');
        if (preview) {
            preview.style.background = `
                radial-gradient(closest-side at 50% 50%, ${theme.colors[0]}, transparent 100%),
                radial-gradient(closest-side at 60% 40%, ${theme.colors[1]}, transparent 100%),
                radial-gradient(closest-side at 40% 60%, ${theme.colors[2]}, transparent 100%),
                radial-gradient(closest-side at 30% 70%, ${theme.colors[3]}, transparent 100%),
                radial-gradient(closest-side at 70% 30%, ${theme.colors[4]}, transparent 100%)
            `;
            preview.style.backgroundSize = '200% 200%';
            preview.style.backgroundPosition = '0 0';
            preview.style.animation = 'gradientMove 10s ease infinite';
        }
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