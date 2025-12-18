// Misskey嵌入适配脚本
document.addEventListener('DOMContentLoaded', function() {
    const iframe = document.querySelector('.misskey-iframe');
    const container = document.querySelector('.misskey-embed-container');
    
    // 如果找不到iframe，不执行任何操作
    if (!iframe) return;
    
    // 显示加载状态
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'misskey-embed-loading';
    loadingIndicator.textContent = '加载中...';
    container.insertBefore(loadingIndicator, iframe);
    
    // 设置初始最小高度，匹配原始设计
    iframe.style.minHeight = '300px';
    
    // iframe加载完成后移除加载指示器
    iframe.addEventListener('load', function() {
        if (loadingIndicator.parentNode) {
            loadingIndicator.parentNode.removeChild(loadingIndicator);
        }
        
        // 加载完成后尝试调整高度
        setTimeout(adjustIframeHeight, 500);
    });
    
    // 监听主题变化，通知iframe
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        const originalClickHandler = themeToggle.onclick;
        themeToggle.onclick = function(e) {
            // 调用原始处理程序（如果存在）
            if (originalClickHandler) {
                originalClickHandler.call(this, e);
            }
            
            // 通知iframe主题变化
            setTimeout(() => {
                const isDark = document.body.classList.contains('dark-theme');
                if (iframe.contentWindow) {
                    iframe.contentWindow.postMessage({
                        type: 'theme-change',
                        isDark: isDark
                    }, '*');
                }
            }, 100);
        };
    }
    
    // 调整iframe高度以适应内容，但保持最小高度
    function adjustIframeHeight() {
        // 根据屏幕宽度设置适当的高度
        const screenWidth = window.innerWidth;
        let baseHeight = 300; // 默认最小高度
        
        if (screenWidth <= 480) {
            baseHeight = 450;
        } else if (screenWidth <= 684) {
            baseHeight = 400;
        } else if (screenWidth <= 900) {
            baseHeight = 350;
        }
        
        try {
            // 尝试获取实际内容高度
            if (iframe.contentDocument && iframe.contentDocument.body) {
                const contentHeight = iframe.contentDocument.body.scrollHeight;
                // 使用内容高度，但至少是基本高度，最大不超过700px
                const finalHeight = Math.max(baseHeight, Math.min(contentHeight, 700));
                iframe.style.height = finalHeight + 'px';
            } else {
                // 无法访问内容时，使用基于屏幕宽度的高度
                iframe.style.height = baseHeight + 'px';
            }
        } catch (e) {
            // 由于跨域限制，使用基于屏幕宽度的高度
            console.log('无法访问iframe内容，使用响应式高度');
            iframe.style.height = baseHeight + 'px';
        }
    }
    
    // 初始调整
    setTimeout(adjustIframeHeight, 1000);
    
    // 响应窗口大小变化
    window.addEventListener('resize', function() {
        adjustIframeHeight();
    });
    
    // 监听来自iframe的消息（用于高度调整）
    window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'resize-iframe' && event.data.height) {
            const screenWidth = window.innerWidth;
            let baseHeight = 300;
            
            if (screenWidth <= 480) {
                baseHeight = 450;
            } else if (screenWidth <= 684) {
                baseHeight = 400;
            } else if (screenWidth <= 900) {
                baseHeight = 350;
            }
            
            // 确保高度至少是基本高度，最大不超过700px
            const finalHeight = Math.max(baseHeight, Math.min(event.data.height, 700));
            iframe.style.height = finalHeight + 'px';
        }
    });
});