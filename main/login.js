// 登录功能
import gsap from 'gsap';

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
            // 模拟API请求
            await simulateApiRequest(800);
            
            // 检查用户是否存在 (模拟)
            if (email === 'test@example.com' && password === 'password') {
                // 登录成功
                currentUser = { email, name: '测试用户' };
                showMessage(messageDiv, '登录成功', 'success');
                
                setTimeout(() => {
                    hideLoginModal();
                    updateLoginState(true, currentUser);
                }, 1000);
            } else {
                // 登录失败
                showMessage(messageDiv, '用户不存在或密码错误', 'error');
            }
        } catch (error) {
            console.error('登录请求失败:', error);
            showMessage(messageDiv, '登录请求失败，请稍后再试', 'error');
        }
    });
    
    // 注册提交按钮点击事件
    document.getElementById('register-submit').addEventListener('click', async function() {
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const messageDiv = document.querySelector('#register-tab-content .login-message');
        
        if (!email || !password) {
            showMessage(messageDiv, '请输入邮箱和密码', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showMessage(messageDiv, '两次输入的密码不一致', 'error');
            return;
        }
        
        try {
            // 模拟API请求
            await simulateApiRequest(800);
            
            // 模拟注册成功
            showMessage(messageDiv, '注册成功，请登录', 'success');
            
            setTimeout(() => {
                // 清空输入框
                document.getElementById('register-email').value = '';
                document.getElementById('register-password').value = '';
                document.getElementById('register-confirm-password').value = '';
                
                // 切换到登录标签
                loginTabs[0].click();
                
                // 填入刚注册的邮箱
                document.getElementById('login-email').value = email;
            }, 1500);
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
            // 模拟API请求
            await simulateApiRequest(800);
            
            // 模拟重置密码成功
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
            // 用户已登录，更新按钮显示
            const userNameDiv = document.querySelector('.user-dropdown .user-name');
            userNameDiv.textContent = user.name;
            
        } else {
            const userNameDiv = document.querySelector('.user-dropdown .user-name');
            userNameDiv.textContent = '未登录';
        }
    }
    
    // 退出登录
    function logout() {
        isLoggedIn = false;
        currentUser = null;
        updateLoginState(false, null);
    }
    
    // 模拟API请求延迟
    function simulateApiRequest(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // 检查用户是否已登录（从localStorage或cookie）
    function checkLoginStatus() {
        // 这里应该从localStorage或cookie中获取登录状态
        // 这里仅作为示例，实际实现需要根据后端接口调整
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                currentUser = user;
                updateLoginState(true, user);
            } catch (error) {
                console.error('解析用户信息失败:', error);
                localStorage.removeItem('currentUser');
                updateLoginState(false, null);
            }
        } else {
            updateLoginState(false, null);
        }
    }
    
    // 初始化时检查登录状态
    checkLoginStatus();
}

// 在window加载完成后初始化登录功能
window.addEventListener('DOMContentLoaded', function() {
    initLoginFeatures();
});
