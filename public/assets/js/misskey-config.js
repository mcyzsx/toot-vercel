// Misskey嵌入配置
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
    '来自 Misskey 社交平台的最新动态'
};

// 设置全局配置
window.misskeyConfig = misskeyConfig;