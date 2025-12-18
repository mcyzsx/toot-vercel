# misskey-embed-vercel
Misskey用户时间线嵌入项目

根据memos.top 项目修改而来，现在支持Misskey实例的时间线嵌入
## 环境变量
```
MISSKEY_INSTANCE=https://nya.one #Misskey实例URL
MISSKEY_USERID=a5vwhj6ok3v21cud #Misskey用户ID
TITLE=Misskey Embed #网站标题
DESCRIPTION=Misskey时间线嵌入展示 #网站描述
MAX_HEIGHT=700 #嵌入时间线的最大高度
```

## 使用说明
1. 设置环境变量，指定Misskey实例和用户ID
2. 部署到Vercel或其他Node.js平台
3. 访问网站即可看到嵌入的Misskey时间线

## 特性
- 支持亮色/暗色主题切换
- 响应式设计，适配移动设备
- 样式自适应，与整体设计风格保持一致
- 支持主题切换时自动调整iframe样式
- 高度自适应原始样式设计，保持最小300px高度
- 悬停效果与原始时间线样式一致
