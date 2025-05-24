// ... existing code ...

// 预设配色方案
const presetColorSchemes = {
    'emerald-gold': {
        primary: '#ffd700',
        gradients: [
            'rgba(0, 128, 128, 1)',
            'rgba(32, 178, 170, 1)',
            'rgba(64, 224, 208, 1)',
            'rgba(255, 215, 0, 1)',
            'rgba(255, 223, 0, 1)'
        ]
    },
    'ocean-sunset': {
        primary: '#1E90FF',
        gradients: [
            '#006994',
            '#1E90FF',
            '#00BFFF',
            '#FFD700',
            '#FFA500'
        ]
    },
    'forest-dawn': {
        primary: '#228B22',
        gradients: [
            '#228B22',
            '#32CD32',
            '#90EE90',
            '#FFD700',
            '#F0E68C'
        ]
    },
    'desert-oasis': {
        primary: '#DAA520',
        gradients: [
            '#DAA520',
            '#F4A460',
            '#20B2AA',
            '#40E0D0',
            '#FFD700'
        ]
    }
};

// 初始化预设配色选择功能
function initPresetColorSelection() {
    const presetItems = document.querySelectorAll('.preset-color-item');
    const customColorsSection = document.querySelector('.custom-colors-section');
    const presetColorsSection = document.querySelector('.preset-colors-section');

    presetItems.forEach(item => {
        item.addEventListener('click', () => {
            const preset = item.dataset.preset;
            
            // 移除其他项的选中状态
            presetItems.forEach(i => i.classList.remove('selected'));
            
            if (preset) {
                // 选择预设配色
                item.classList.add('selected');
                applyPresetColors(preset);
                customColorsSection.style.display = 'none';
                presetColorsSection.style.display = 'block';
            } else {
                // 选择自定义配色
                item.classList.add('selected');
                customColorsSection.style.display = 'block';
                presetColorsSection.style.display = 'none';
            }
        });
    });
}

// 应用预设配色
function applyPresetColors(preset) {
    const scheme = presetColorSchemes[preset];
    if (!scheme) return;

    // 设置主色调
    document.getElementById('custom-primary-color').value = scheme.primary;
    document.getElementById('custom-primary-color-text').value = scheme.primary;

    // 设置渐变色
    scheme.gradients.forEach((color, index) => {
        const picker = document.getElementById(`custom-gradient-${index + 1}`);
        const text = document.getElementById(`custom-gradient-${index + 1}-text`);
        if (picker && text) {
            picker.value = color;
            text.value = color;
        }
    });

    // 更新预览
    updateThemePreview();
}

// 在文档加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initPresetColorSelection();
    // ... existing initialization code ...
});

// ... existing code ...