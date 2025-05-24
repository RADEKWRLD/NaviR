# NaviR - 现代化的导航页面

NaviR 是一个精心设计的现代化导航页面，提供丰富的个性化功能和优雅的用户界面。它不仅仅是一个简单的导航页面，更是一个可以完全个性化定制的起始页面解决方案。

## ✨ 主要特点
![image](https://github.com/user-attachments/assets/78d839c6-5b6f-4dc8-9e8d-91d39a2129f2)


### 🎨 丰富的主题选择
![image](https://github.com/user-attachments/assets/1b23e484-48d3-4e0b-9b2c-72f7254f074b)

- 30+ 精心设计的预设主题，包括：
  - 经典主题：粉色、深海、森林、日落等
  - 现代主题：霓虹、赛博朋克、银河等
  - 优雅主题：翡翠、樱花、薰衣草等
  - 商务主题：黑金、蓝金、紫金等

  -- --
### 强大的自定义主题功能
![image](https://github.com/user-attachments/assets/75bd5e6d-923a-4511-a1d7-052982f07b6b)

  - 支持自定义5种渐变色，创造独特的视觉效果
  - 实时预览主题效果，所见即所得
  - 一键保存自定义主题，随时切换

  -- --

### ⚙️ 个性化设置
![image](https://github.com/user-attachments/assets/b3745fc6-e418-4b59-9eaa-f48add4bc97b)

- 时间显示选项
  - 支持12/24小时制切换
  - 可选择显示/隐藏秒数
  - 支持多种时间格式
  - 可自定义时间显示位置
- 界面布局定制
  - 灵活的网格布局系统
  - 可调整导航项目的大小和间距
  - 支持拖拽排序
  - 自适应列数
- 多语言支持
  - 内置中文和英文
  - 易扩展的语言包系统
  - 支持自动检测系统语言
- 响应式设计
  - 完美适配桌面、平板和手机
  - 针对不同设备优化的交互体验
  - 自动适应屏幕方向变化

### 🎯 导航功能
- 智能分类系统
  - 支持自定义分类
  - 可设置分类图标
  - 分类折叠/展开
- 网站管理
  - 支持自定义网站
  - 可添加网站描述
- 搜索功能
  - 支持多搜索引擎切换

### 🌈 视觉效果
- 流畅的动画效果
  - 使用 GSAP 实现的高性能动画
  - 页面切换过渡效果
  - 悬浮动画效果
  - 加载动画
- 现代化设计
  - 毛玻璃效果
  - 渐变背景
  - 动态光效
  - 自适应暗色/亮色模式

### 🚀 技术特点
- 使用 Vite 构建
  - 快速的热更新开发体验
  - 高效的构建性能
  - 优化的生产构建
- 集成 GSAP 动画库
  - 流畅的动画效果
  - 高性能的动画渲染
  - 丰富的动画控制接口
- 支持 Cloudflare Workers 部署
  - 全球 CDN 加速
  - 零配置部署
  - 自动 HTTPS
- 现代化的开发工具链
  - TypeScript 支持
  - ESLint 代码规范
  - 自动化构建和部署

## 🛠️ 开发技术
- Vite - 下一代前端构建工具
- GSAP - 专业级别的 Web 动画库
- Cloudflare Workers - 边缘计算服务
- 现代 CSS 技术
  - CSS Grid 布局
  - CSS 自定义属性
  - CSS 渐变
  - CSS 动画
  - Flexbox 布局

## 🚀 快速开始

### 环境要求
- Node.js 16.0.0 或更高版本
- npm 7.0.0 或更高版本
- 现代浏览器（支持 ES6+）

### 本地开发
```bash
# 克隆项目
git clone https://github.com/yourusername/NaviR.git
cd NaviR

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 启动带主机地址的开发服务器（可局域网访问）
npm run host
```

### 部署
```bash
# 安装 wrangler CLI
npm install -g wrangler

# 登录到 Cloudflare
wrangler login

# 构建并部署到 Cloudflare Workers
npm run deploy
```

## 🔧 配置说明

### 主题配置
主题配置文件位于 `src/themes` 目录下，你可以通过修改配置文件来添加新的预设主题：

```javascript
{
  name: "主题名称",
  colors: [
    "#颜色1",
    "#颜色2",
    "#颜色3",
    "#颜色4",
    "#颜色5"
  ],
  direction: "145deg" // 渐变方向
}
```

### 语言包配置
语言包文件位于 `src/locales` 目录下，你可以通过添加新的语言文件来支持更多语言。

## 🤝 贡献指南
我们欢迎任何形式的贡献，包括但不限于：
- 提交问题和建议
- 改进文档
- 提交代码改进
- 添加新功能
- 修复 bug

## 📝 许可证
本项目采用 MIT 许可证，详见 [LICENSE](LICENSE) 文件。

## 🙏 致谢
感谢所有为这个项目做出贡献的开发者们！
