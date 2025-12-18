# Misskey 嵌入功能

本项目已集成 Misskey 嵌入功能，可以在您的网站上显示 Misskey 用户时间线。

## 功能特点

- 自动适应明暗主题
- 响应式设计，支持移动设备
- 可配置的 Misskey 实例和用户时间线
- 加载状态和错误处理

## 自定义配置

您可以通过修改 `public/assets/js/misskey-config.js` 文件来自定义 Misskey 嵌入：

```javascript
const misskeyConfig = {
    // Misskey实例URL
    instanceUrl: 'https://nya.one',
    
    // 用户时间线ID
    userTimelineId: 'a5vwhj6ok3v21cud',
    
    // 嵌入ID
    embedId: 'v1_agelvooxt8',
    
    // 最大高度
    maxHeight: 700,
    
    // 默认高度
    defaultHeight: 300,
    
    // 移动设备高度
    mobileHeight: 400,
    
    // 是否在页面加载时自动加载
    autoLoad: true,
    
    // 容器标题
    containerTitle: 'Misskey 时间线',
    
    // 容器描述
    containerDescription: '来自 Misskey 社交平台的最新动态'
};
```

## 如何获取 Misskey 用户时间线 ID

1. 访问您的 Misskey 实例
2. 进入用户个人资料页面
3. 在个人资料页面中找到"嵌入"或"分享"选项
4. 复制嵌入代码中的用户时间线 ID

例如，在以下嵌入代码中：
```html
<iframe src="https://nya.one/embed/user-timeline/a5vwhj6ok3v21cud?maxHeight=700" ... ></iframe>
```

`a5vwhj6ok3v21cud` 就是用户时间线 ID。

## 样式自定义

您可以通过修改 `public/assets/css/misskey.css` 文件来自定义 Misskey 嵌入的样式，以更好地匹配您网站的设计。

## 注意事项

- 确保您有权嵌入该用户的时间线
- 某些 Misskey 实例可能不允许嵌入功能
- 如果嵌入失败，请检查控制台错误信息

## 故障排除

如果 Misskey 嵌入无法正常工作：

1. 检查网络连接是否正常
2. 确认 Misskey 实例 URL 和用户时间线 ID 是否正确
3. 查看浏览器控制台是否有错误信息
4. 尝试使用 `window.reloadMisskeyEmbed()` 函数重新加载嵌入内容