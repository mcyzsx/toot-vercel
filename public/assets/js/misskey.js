// Misskey 嵌入功能
document.addEventListener('DOMContentLoaded', function() {
    initMisskeyEmbed();
});

function initMisskeyEmbed() {
    // 等待配置加载
    if (typeof window.misskeyConfig === 'undefined') {
        // 如果配置未加载，使用默认配置
        window.misskeyConfig = {
            instanceUrl: 'https://nya.one',
            userTimelineId: 'a5vwhj6ok3v21cud',
            embedId: 'v1_agelvooxt8',
            maxHeight: 700,
            defaultHeight: 300,
            mobileHeight: 400,
            autoLoad: true,
            containerTitle: 'Misskey 时间线',
            containerDescription: '来自 Misskey 社交平台的最新动态'
        };
    }
    
    const config = window.misskeyConfig;
    
    // 创建Misskey嵌入容器
    const misskeyContainer = document.createElement('div');
    misskeyContainer.className = 'misskey-embed-container';
    misskeyContainer.innerHTML = `
        <h3>${config.containerTitle}</h3>
        <p>${config.containerDescription}</p>
        <div id="misskey-embed-wrapper" class="misskey-loading">
            <span>加载中...</span>
        </div>
    `;
    
    // 将Misskey嵌入添加到memos容器后面
    const memosContainer = document.getElementById('memos');
    if (memosContainer && memosContainer.nextSibling) {
        memosContainer.parentNode.insertBefore(misskeyContainer, memosContainer.nextSibling);
    } else if (memosContainer) {
        memosContainer.parentNode.appendChild(misskeyContainer);
    }
    
    // 如果设置为自动加载，则加载Misskey嵌入脚本
    if (config.autoLoad) {
        loadMisskeyEmbedScript();
    }
}

function loadMisskeyEmbedScript() {
    const script = document.createElement('script');
    script.defer = true;
    script.src = 'https://nya.one/embed.js';
    
    script.onload = function() {
        // 脚本加载完成后，创建iframe
        createMisskeyIframe();
    };
    
    script.onerror = function() {
        // 脚本加载失败
        const embedWrapper = document.getElementById('misskey-embed-wrapper');
        if (embedWrapper) {
            embedWrapper.className = 'misskey-error';
            embedWrapper.innerHTML = '<span>加载Misskey内容失败，请稍后再试</span>';
        }
    };
    
    document.head.appendChild(script);
}

function createMisskeyIframe() {
    const embedWrapper = document.getElementById('misskey-embed-wrapper');
    if (!embedWrapper || !window.misskeyConfig) return;
    
    const config = window.misskeyConfig;
    
    // 检测是否为移动设备
    const isMobile = window.innerWidth <= 600;
    const height = isMobile ? config.mobileHeight : config.defaultHeight;
    
    // 创建iframe元素
    const iframe = document.createElement('iframe');
    iframe.className = 'misskey-embed';
    iframe.src = `${config.instanceUrl}/embed/user-timeline/${config.userTimelineId}?maxHeight=${config.maxHeight}`;
    iframe.setAttribute('data-misskey-embed-id', config.embedId);
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.style.maxWidth = '500px';
    iframe.style.height = `${height}px`;
    iframe.style.colorScheme = 'light dark';
    
    // 替换加载状态为iframe
    embedWrapper.className = '';
    embedWrapper.innerHTML = '';
    embedWrapper.appendChild(iframe);
    
    // 监听iframe加载事件
    iframe.onload = function() {
        // iframe加载成功
        console.log('Misskey embed loaded successfully');
    };
    
    iframe.onerror = function() {
        // iframe加载失败
        embedWrapper.className = 'misskey-error';
        embedWrapper.innerHTML = '<span>加载Misskey内容失败，请稍后再试</span>';
    };
}

// 提供一个全局函数，以便在其他地方可以重新加载Misskey嵌入
window.reloadMisskeyEmbed = function() {
    const embedWrapper = document.getElementById('misskey-embed-wrapper');
    if (embedWrapper) {
        embedWrapper.className = 'misskey-loading';
        embedWrapper.innerHTML = '<span>加载中...</span>';
        createMisskeyIframe();
    }
};