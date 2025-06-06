// 登录功能
import gsap from 'gsap';

// API URL常量
const API_URL = 'http://localhost:5000';

function initLoginFeatures() {
    const loginBtn = document.getElementById('login-btn');
    const loginModal = document.getElementById('login-modal');
    const closeBtn = loginModal.querySelector('.close-modal');
    const loginTabs = loginModal.querySelectorAll('.login-tab');
    const tabContents = loginModal.querySelectorAll('.login-tab-content');
    const logoutBtn = document.querySelector('.logout-btn');
    const modalContent = loginModal.querySelector('.modal-content');
    
    // 初始化时隐藏模态框
    gsap.set(loginModal, { display: 'none', opacity: 0 });
    gsap.set(modalContent, { y: -50, opacity: 0 });
    
    // 登录状态
    let isLoggedIn = false;
    let currentUser = null;
    let authToken = null;
    
    // 登录按钮点击事件
    loginBtn.addEventListener('click', function() {
        if (isLoggedIn) {
            // 如果已登录，不显示登录模态框
            return;
        }
        showLoginModal();
    });
    
    // 退出登录
    logoutBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        logout();
    });
    
    // 关闭按钮点击事件
    closeBtn.addEventListener('click', function() {
        hideLoginModal();
    });
    
    // 点击模态框外部关闭
    loginModal.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            hideLoginModal();
        }
    });
    
    // 显示登录模态框
    function showLoginModal() {
        // 显示模态框并播放动画
        gsap.set(loginModal, { display: 'flex' });
        
        const timeline = gsap.timeline();
        
        timeline
            .to(loginModal, {
                opacity: 1,
                duration: 0.1,
                ease: 'power1.inOut'
            })
            .to(modalContent, {
                y: 0,
                opacity: 1,
                duration: 0.1,
                ease: 'back.inOut(1.7)'
            }, '-=0.1');
            
        clearLoginMessages();
    }
    
    // 隐藏登录模态框
    function hideLoginModal() {
        const timeline = gsap.timeline({
            onComplete: () => {
                gsap.set(loginModal, { display: 'none' });
                gsap.set(modalContent, { y: -50 }); // 重置位置以备下次显示
            }
        });
        
        timeline
            .to(modalContent, {
                y: -30,
                opacity: 0,
                duration: 0.1,
                ease: 'power2.in'
            })
            .to(loginModal, {
                opacity: 0,
                duration: 0.1,
                ease: 'power2.in'
            }, '-=0.1');
            
        clearLoginMessages();
    }

    // 标签切换动画
    function animateTabChange(oldContent, newContent) {
        gsap.timeline()
            .to(oldContent, {
                opacity: 0,
                x: -20,
                duration: 0.3,
                ease: 'power2.inOut'
            })
            .set(oldContent, { display: 'none' })
            .set(newContent, { display: 'block', x: 20 })
            .to(newContent, {
                opacity: 1,
                x: 0,
                duration: 0.3,
                ease: 'power2.inOut'
            });
    }
    
    // 标签切换逻辑
    loginTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const activeTab = loginModal.querySelector('.login-tab.active');
            const activeContent = loginModal.querySelector('.login-tab-content.active');
            
            // 如果点击的是当前活动标签，不做任何操作
            if (this === activeTab) return;
            
            // 移除所有标签的active类
            loginTabs.forEach(t => t.classList.remove('active'));
            
            // 添加当前标签的active类
            this.classList.add('active');
            
            // 显示对应的内容
            const tabId = this.getAttribute('data-tab');
            const newContent = document.getElementById(`${tabId}-tab-content`);
            
            // 移除所有内容的active类
            tabContents.forEach(c => c.classList.remove('active'));
            newContent.classList.add('active');
            
            // 播放切换动画
            animateTabChange(activeContent, newContent);
            
            // 清除之前的消息
            clearLoginMessages();
        });
    });
    
    // 登录提交按钮点击事件
    document.getElementById('login-submit').addEventListener('click', async function() {
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const messageDiv = document.querySelector('#login-tab-content .login-message');
        
        if (!email || !password) {
            showMessage(messageDiv, '请输入邮箱和密码', 'error');
            return;
        }
        
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // 登录成功
                authToken = data.token;
                
                // 获取用户信息
                const userInfo = await getUserInfo(authToken);
                currentUser = { 
                    email, 
                    name: userInfo.username || email.split('@')[0],
                    settings: {
                        theme: userInfo.theme,
                        background_opacity: userInfo.background_opacity,
                        language: userInfo.language,
                        shortcuts: userInfo.shortcuts,
                        custom_themes: userInfo.custom_themes || []
                    }
                };
                
                // 保存到本地存储
                localStorage.setItem('authToken', authToken);
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                // 更新用户名显示
                const loginBtn = document.getElementById('login-btn');
                const userNameDisplay = loginBtn.querySelector('.user-name');
                if (userNameDisplay) {
                    userNameDisplay.textContent = currentUser.name || currentUser.email.split('@')[0];
                    loginBtn.classList.add('logged-in');
                }
                
                showMessage(messageDiv, '登录成功', 'success');
                
                setTimeout(() => {
                    hideLoginModal();
                    updateLoginState(true, currentUser);
                }, 1000);
            } else {
                // 登录失败
                showMessage(messageDiv, data.message || '用户不存在或密码错误', 'error');
            }
        } catch (error) {
            console.error('登录请求失败:', error);
            showMessage(messageDiv, '登录请求失败，请稍后再试', 'error');
        }
    });
    
    // 注册提交按钮点击事件
    document.getElementById('register-submit').addEventListener('click', async function() {
        const username = document.getElementById('register-username').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const messageDiv = document.querySelector('#register-tab-content .login-message');
        
        if (!username || !email || !password) {
            showMessage(messageDiv, '请输入用户名、邮箱和密码', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showMessage(messageDiv, '两次输入的密码不一致', 'error');
            return;
        }
        
        // 密码强度验证
        if (password.length < 8) {
            showMessage(messageDiv, '密码长度至少为8位', 'error');
            return;
        }

        if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(password)) {
            showMessage(messageDiv, '密码必须包含大小写字母和数字', 'error');
            return;
        }
        
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // 注册成功
                showMessage(messageDiv, '注册成功，请登录', 'success');
                
                setTimeout(() => {
                    // 清空输入框
                    document.getElementById('register-username').value = '';
                    document.getElementById('register-email').value = '';
                    document.getElementById('register-password').value = '';
                    document.getElementById('register-confirm-password').value = '';
                    
                    // 切换到登录标签
                    loginTabs[0].click();
                    
                    // 填入刚注册的邮箱
                    document.getElementById('login-email').value = email;
                }, 1500);
            } else {
                // 注册失败
                showMessage(messageDiv, data.message || '注册失败，请稍后再试', 'error');
            }
        } catch (error) {
            console.error('注册请求失败:', error);
            showMessage(messageDiv, '注册请求失败，请稍后再试', 'error');
        }
    });
    
    // 忘记密码提交按钮点击事件
    document.getElementById('forgot-submit').addEventListener('click', async function() {
        const email = document.getElementById('forgot-email').value.trim();
        const password = document.getElementById('forgot-password').value;
        const confirmPassword = document.getElementById('forgot-confirm-password').value;
        const messageDiv = document.querySelector('#forgot-tab-content .login-message');
        
        if (!email) {
            showMessage(messageDiv, '请输入邮箱', 'error');
            return;
        }

        if (!password || !confirmPassword) {
            showMessage(messageDiv, '请输入新密码和确认密码', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showMessage(messageDiv, '两次输入的密码不一致', 'error');
            return;
        }

        // 密码强度验证
        if (password.length < 8) {
            showMessage(messageDiv, '密码长度至少为8位', 'error');
            return;
        }

        if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(password)) {
            showMessage(messageDiv, '密码必须包含大小写字母和数字', 'error');
            return;
        }
        
        try {
            const response = await fetch(`${API_URL}/reset_password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, new_password: password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // 重置成功
                showMessage(messageDiv, '密码重置成功，请使用新密码登录', 'success');
                
                setTimeout(() => {
                    // 清空输入框
                    document.getElementById('forgot-email').value = '';
                    document.getElementById('forgot-password').value = '';
                    document.getElementById('forgot-confirm-password').value = '';
                    
                    // 切换到登录标签
                    loginTabs[0].click();
                    
                    // 填入刚重置密码的邮箱
                    document.getElementById('login-email').value = email;
                }, 1500);
            } else {
                // 重置失败
                showMessage(messageDiv, data.message || '密码重置失败，请稍后再试', 'error');
            }
        } catch (error) {
            console.error('重置密码请求失败:', error);
            showMessage(messageDiv, '重置密码请求失败，请稍后再试', 'error');
        }
    });
    
    // 清除所有登录消息
    function clearLoginMessages() {
        const messages = loginModal.querySelectorAll('.login-message');
        messages.forEach(msg => {
            msg.textContent = '';
            msg.className = 'login-message';
        });
    }
    
    // 显示消息
    function showMessage(element, message, type) {
        element.textContent = message;
        element.className = `login-message ${type}`;
    }
    
    // 更新登录状态
    function updateLoginState(loggedIn, user) {
        isLoggedIn = loggedIn;
        
        if (loggedIn && user) {
            if (user.settings) {
                applyUserSettings(user.settings);
            }
            localStorage.setItem('currentUser', JSON.stringify(user));
        } else {
            // 未登录时，保持当前主题设置
            const currentTheme = localStorage.getItem('theme');
            if (currentTheme) {
                if (window.themeManager) {
                    window.themeManager.setTheme(currentTheme);
                } else {
                    document.body.setAttribute('data-theme', currentTheme);
                }
            }
            localStorage.removeItem('currentUser');
            localStorage.removeItem('authToken');
        }
    }
    
    // 退出登录
    function logout() {
        isLoggedIn = false;
        currentUser = null;
        authToken = null;
        
        // 只在退出登录时更新用户名显示
        const loginBtn = document.getElementById('login-btn');
        const userNameDisplay = loginBtn.querySelector('.user-name');
        if (userNameDisplay) {
            userNameDisplay.textContent = window.languageManager ? 
                window.languageManager.getTranslation('login.status.not_logged_in') : 
                '未登录';
            loginBtn.classList.remove('logged-in');
        }
        
        updateLoginState(false, null);
    }
    
    // 获取用户信息
    async function getUserInfo(token) {
        try {
            const response = await fetch(`${API_URL}/settings`, {
                method: 'GET',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const userData = await response.json();
                
                // 确保快捷方式数据格式正确
                if (userData.shortcuts && typeof userData.shortcuts === 'string') {
                    try {
                        userData.shortcuts = JSON.parse(userData.shortcuts);
                    } catch (e) {
                        console.error('解析快捷方式数据失败:', e);
                        userData.shortcuts = [];
                    }
                } else if (!userData.shortcuts) {
                    userData.shortcuts = [];
                }
                
                return userData;
            } else {
                console.error('获取用户信息失败:', await response.json());
                return {};
            }
        } catch (error) {
            console.error('获取用户信息请求失败:', error);
            return {};
        }
    }
    
    // 应用用户设置
    function applyUserSettings(settings) {
        console.log('应用用户设置：', settings);
        
        // 处理自定义主题数据（如果存在）
        if (settings.custom_themes && Array.isArray(settings.custom_themes)) {
            console.log('处理自定义主题数据：', settings.custom_themes);
            
            // 将后端格式的自定义主题转换为前端格式
            const customThemes = settings.custom_themes.map((colors, index) => ({
                name: `custom_${Date.now()}_${index}`,
                colors: colors
            }));
            
            // 保存到本地存储
            localStorage.setItem('custom_themes', JSON.stringify(customThemes));
            console.log('保存自定义主题到本地存储：', customThemes);
            
            // 如果有themeManager，更新其customThemes属性并重新渲染
            if (window.themeManager) {
                console.log('更新ThemeManager的customThemes属性');
                window.themeManager.customThemes = customThemes;
                // 如果当前主题是自定义主题，需要重新应用
                if (settings.theme && settings.theme.startsWith('custom-')) {
                    const idx = parseInt(settings.theme.split('-')[1]);
                    if (customThemes[idx]) {
                        console.log('重新应用自定义主题：', customThemes[idx]);
                        window.themeManager.applyCustomTheme(customThemes[idx]);
                    }
                }
                window.themeManager.renderThemeGrid();
            }
        }
        
        // 设置主题（只在明确指定主题时才应用）
        if (settings.theme) {
            console.log('应用主题：', settings.theme);
            if (window.themeManager) {
                window.themeManager.currentTheme = settings.theme;
                window.themeManager.renderThemeGrid();
                // 如果不是自定义主题，使用applyTheme
                if (!settings.theme.startsWith('custom-')) {
                    window.themeManager.applyTheme(settings.theme);
                }
                localStorage.setItem('theme', settings.theme);
            } else {
                document.body.setAttribute('data-theme', settings.theme);
                localStorage.setItem('theme', settings.theme);
            }
        }
        
        // 设置背景透明度
        if (settings.background_opacity !== undefined) {
            document.documentElement.style.setProperty('--bg-opacity', settings.background_opacity);
        }
        
        // 设置语言
        if (settings.language) {
            document.documentElement.lang = settings.language;
            if (window.languageManager) {
                window.languageManager.setLanguage(settings.language);
            }
        }
        
        // 应用用户的快捷方式
        if (settings.shortcuts && Array.isArray(settings.shortcuts) && settings.shortcuts.length > 0) {
            localStorage.setItem('naviR_shortcuts', JSON.stringify(settings.shortcuts));
            
            if (typeof renderShortcuts === 'function') {
                renderShortcuts();
            } else if (window.renderShortcuts) {
                window.renderShortcuts();
            }
        }
    }
    
    // 保存用户设置
    async function saveUserSettings(settings) {
        if (!authToken) return;
        
        // 处理快捷方式数据，确保它是字符串格式
        const settingsToSave = {...settings};
        if (settingsToSave.shortcuts && Array.isArray(settingsToSave.shortcuts)) {
            settingsToSave.shortcuts = JSON.stringify(settingsToSave.shortcuts);
        }
        
        // 处理自定义主题数据
        if (settingsToSave.theme && settingsToSave.theme.startsWith('custom-')) {
            const customThemes = JSON.parse(localStorage.getItem('custom_themes') || '[]');
            const backendCustomThemes = customThemes.map(theme => theme.colors);
            settingsToSave.custom_themes = backendCustomThemes;
        }
        
        try {
            const response = await fetch(`${API_URL}/settings`, {
                method: 'PUT',
                headers: {
                    'Authorization': authToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(settingsToSave)
            });
            
            if (response.ok) {
                // 更新本地存储的用户信息
                if (currentUser) {
                    if (settings.shortcuts) {
                        currentUser.settings.shortcuts = Array.isArray(settings.shortcuts) 
                            ? settings.shortcuts 
                            : JSON.parse(settings.shortcuts);
                    }
                    
                    if (settingsToSave.custom_themes) {
                        currentUser.settings.custom_themes = settingsToSave.custom_themes;
                    }
                    
                    currentUser.settings = {
                        ...currentUser.settings,
                        theme: settings.theme || currentUser.settings.theme,
                        background_opacity: settings.background_opacity !== undefined 
                            ? settings.background_opacity 
                            : currentUser.settings.background_opacity,
                        language: settings.language || currentUser.settings.language
                    };
                    
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                }
                
                return true;
            } else {
                console.error('保存设置失败:', await response.json());
                return false;
            }
        } catch (error) {
            console.error('保存设置请求失败:', error);
            return false;
        }
    }
    
    // 检查用户是否已登录（从localStorage）
    function checkLoginStatus() {
        const savedToken = localStorage.getItem('authToken');
        const savedUser = localStorage.getItem('currentUser');
        
        if (savedToken && savedUser) {
            try {
                authToken = savedToken;
                currentUser = JSON.parse(savedUser);
                isLoggedIn = true;
                
                // 页面加载时显示用户名
                const loginBtn = document.getElementById('login-btn');
                const userNameDisplay = loginBtn.querySelector('.user-name');
                if (userNameDisplay) {
                    userNameDisplay.textContent = currentUser.name || currentUser.email.split('@')[0];
                    loginBtn.classList.add('logged-in');
                }
                
                // 应用已保存的用户设置
                if (currentUser.settings) {
                    applyUserSettings(currentUser.settings);
                }
                
                // 异步验证token
                getUserInfo(authToken).then(userInfo => {
                    if (userInfo) {
                        const updatedSettings = {
                            ...currentUser.settings,
                            ...userInfo,
                            custom_themes: userInfo.custom_themes || currentUser.settings.custom_themes || []
                        };
                        
                        currentUser = {
                            ...currentUser,
                            settings: updatedSettings
                        };
                        
                        localStorage.setItem('currentUser', JSON.stringify(currentUser));
                        applyUserSettings(updatedSettings);
                    }
                }).catch(error => {
                    console.error('验证token失败:', error);
                    if (error.status === 401) {
                        logout();
                    }
                });
            } catch (error) {
                console.error('解析用户信息失败:', error);
                logout();
            }
        } else {
            // 未登录状态显示
            const loginBtn = document.getElementById('login-btn');
            const userNameDisplay = loginBtn.querySelector('.user-name');
            if (userNameDisplay) {
                userNameDisplay.textContent = window.languageManager ? 
                    window.languageManager.getTranslation('login.status.not_logged_in') : 
                    '未登录';
                loginBtn.classList.remove('logged-in');
            }
            updateLoginState(false, null);
        }
    }
    
    // 公开API，允许其他模块访问
    window.userAPI = {
        isLoggedIn: () => isLoggedIn,
        getCurrentUser: () => currentUser,
        getToken: () => authToken,
        saveSettings: saveUserSettings,
        logout: logout,
        updateLoginState: (loggedIn, user) => updateLoginState(loggedIn, user)
    };
    
    // 初始化时检查登录状态
    checkLoginStatus();
}

// 在window加载完成后初始化登录功能
window.addEventListener('DOMContentLoaded', function() {
    initLoginFeatures();
});
