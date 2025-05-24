// 自定义主题管理
let customThemes = JSON.parse(localStorage.getItem('customThemes') || '[]');

// 更新自定义主题列表显示
function updateCustomThemesList() {
    const customThemesList = document.querySelector('.custom-themes-list');
    customThemesList.innerHTML = '';
    
    customThemes.forEach((theme, index) => {
        const themeElement = document.createElement('div');
        themeElement.className = 'custom-theme-item';
        themeElement.innerHTML = `
            <div class="theme-preview" style="background: linear-gradient(45deg, ${theme.colors.join(', ')})"></div>
            <div class="theme-info">
                <span class="theme-name">${theme.name}</span>
            </div>
            <div class="theme-actions">
                <button class="edit-theme" data-index="${index}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
                        <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
                    </svg>
                </button>
                <button class="delete-theme" data-index="${index}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        `;
        
        // 点击主题预览应用主题
        themeElement.querySelector('.theme-preview').addEventListener('click', () => {
            applyCustomTheme(theme);
        });
        
        // 编辑主题
        themeElement.querySelector('.edit-theme').addEventListener('click', () => {
            openCustomThemeModal(theme, index);
        });
        
        // 删除主题
        themeElement.querySelector('.delete-theme').addEventListener('click', () => {
            openDeleteThemeModal(index);
        });
        
        customThemesList.appendChild(themeElement);
    });
}

// 应用自定义主题
function applyCustomTheme(theme) {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.colors[0]);
    theme.colors.forEach((color, index) => {
        root.style.setProperty(`--gradient-${index + 1}`, color);
    });
    localStorage.setItem('selectedTheme', 'custom');
    localStorage.setItem('currentCustomTheme', JSON.stringify(theme));
}

// 打开自定义主题模态框
function openCustomThemeModal(theme = null, editIndex = -1) {
    const modal = document.getElementById('custom-theme-modal');
    const nameInput = document.getElementById('custom-theme-name');
    const primaryColorPicker = document.getElementById('custom-primary-color');
    const primaryColorText = document.getElementById('custom-primary-color-text');
    
    // 重置或填充表单
    if (theme) {
        nameInput.value = theme.name;
        primaryColorPicker.value = theme.colors[0];
        primaryColorText.value = theme.colors[0];
        theme.colors.forEach((color, index) => {
            const picker = document.getElementById(`custom-gradient-${index + 1}`);
            const text = document.getElementById(`custom-gradient-${index + 1}-text`);
            if (picker && text) {
                picker.value = color;
                text.value = color;
            }
        });
    } else {
        nameInput.value = '';
        primaryColorPicker.value = '#FFFFFF';
        primaryColorText.value = '#FFFFFF';
        for (let i = 1; i <= 5; i++) {
            const picker = document.getElementById(`custom-gradient-${i}`);
            const text = document.getElementById(`custom-gradient-${i}-text`);
            if (picker && text) {
                picker.value = '#FFFFFF';
                text.value = '#FFFFFF';
            }
        }
    }
    
    modal.setAttribute('data-edit-index', editIndex);
    modal.style.display = 'block';
    updateThemePreview();
}

// 更新主题预览
function updateThemePreview() {
    const previewBox = document.querySelector('.theme-preview-box');
    const colors = [];
    for (let i = 1; i <= 5; i++) {
        const picker = document.getElementById(`custom-gradient-${i}`);
        if (picker) {
            colors.push(picker.value);
        }
    }
    previewBox.style.background = `linear-gradient(45deg, ${colors.join(', ')})`;
}

// 保存自定义主题
function saveCustomTheme() {
    const modal = document.getElementById('custom-theme-modal');
    const editIndex = parseInt(modal.getAttribute('data-edit-index'));
    const nameInput = document.getElementById('custom-theme-name');
    const colors = [document.getElementById('custom-primary-color').value];
    
    for (let i = 1; i <= 5; i++) {
        const picker = document.getElementById(`custom-gradient-${i}`);
        if (picker) {
            colors.push(picker.value);
        }
    }
    
    const theme = {
        name: nameInput.value || '未命名主题',
        colors: colors
    };
    
    if (editIndex >= 0) {
        customThemes[editIndex] = theme;
    } else {
        customThemes.push(theme);
    }
    
    localStorage.setItem('customThemes', JSON.stringify(customThemes));
    updateCustomThemesList();
    modal.style.display = 'none';
}

// 打开删除确认模态框
function openDeleteThemeModal(index) {
    const modal = document.getElementById('delete-theme-modal');
    modal.setAttribute('data-delete-index', index);
    modal.style.display = 'block';
}

// 删除自定义主题
function deleteCustomTheme() {
    const modal = document.getElementById('delete-theme-modal');
    const index = parseInt(modal.getAttribute('data-delete-index'));
    customThemes.splice(index, 1);
    localStorage.setItem('customThemes', JSON.stringify(customThemes));
    updateCustomThemesList();
    modal.style.display = 'none';
}

// 事件监听器设置
document.addEventListener('DOMContentLoaded', () => {
    // 初始化自定义主题列表
    updateCustomThemesList();
    
    // 添加自定义主题按钮
    document.getElementById('add-custom-theme').addEventListener('click', () => {
        openCustomThemeModal();
    });
    
    // 颜色选择器和文本输入同步
    document.querySelectorAll('.color-picker').forEach(picker => {
        picker.addEventListener('input', (e) => {
            const textInput = document.getElementById(`${e.target.id}-text`);
            if (textInput) {
                textInput.value = e.target.value;
            }
            updateThemePreview();
        });
    });
    
    document.querySelectorAll('.color-text').forEach(input => {
        input.addEventListener('input', (e) => {
            const picker = document.getElementById(e.target.id.replace('-text', ''));
            if (picker && /^#[0-9A-F]{6}$/i.test(e.target.value)) {
                picker.value = e.target.value;
                updateThemePreview();
            }
        });
    });
    
    // 模态框按钮事件
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', (e) => {
            e.target.closest('.modal').style.display = 'none';
        });
    });
    
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // 保存主题
    document.querySelector('#custom-theme-modal .confirm').addEventListener('click', saveCustomTheme);
    
    // 删除主题
    document.querySelector('#delete-theme-modal .delete').addEventListener('click', deleteCustomTheme);
    
    // 取消按钮
    document.querySelectorAll('.modal .cancel').forEach(button => {
        button.addEventListener('click', (e) => {
            e.target.closest('.modal').style.display = 'none';
        });
    });
}); 