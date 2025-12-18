// 初始化配置
const memo = {
    domId: '#memos',
    nextPage: null, // 存储下一页的URL
};

// 合并用户配置
if (typeof memos !== "undefined") {
    for (let key in memos) {
        if (memos[key]) {
            memo[key] = memos[key];
        }
    }
}

// 选择 DOM 元素
const memoDom = document.querySelector(memo.domId);
if (!memoDom) {
    console.error(`Element with ID '${memo.domId}' not found.`);
}
// 添加加载更多按钮的容器
memoDom.insertAdjacentHTML('afterend', '<button class="load-btn button-load" id="load-more">努力加载中……</button>');
const loadMoreBtn = document.getElementById('load-more');

// 辅助函数：解码HTML实体
function decodeHTMLEntities(text) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
}

// 相对时间计算
function getRelativeTime(date) {
    const rtf = new Intl.RelativeTimeFormat(memos.language || 'zh-CN', { numeric: "auto", style: 'short' });
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) {
        return rtf.format(-years, 'year');
    } else if (months > 0) {
        return rtf.format(-months, 'month');
    } else if (days > 0) {
        return rtf.format(-days, 'day');
    } else if (hours > 0) {
        return rtf.format(-hours, 'hour');
    } else if (minutes > 0) {
        return rtf.format(-minutes, 'minute');
    } else {
        return rtf.format(-seconds, 'second');
    }
}

// 插入 HTML
function updateHTMl(data) {
    let memoResult = "", resultAll = "";
    
    // 正则表达式匹配模式
    const patterns = {
        // 解析 Bilibili
        bilibili: {
            reg: /https?:\/\/(?:www\.)?bilibili\.com\/video\/(?:av(\d+)|BV([a-zA-Z0-9]+))[\/?]?/i,
            transform: (match, av, bv) => {
                const vid = bv || `av${av}`;
                return `<div class='video-wrapper'><iframe src='//www.bilibili.com/blackboard/html5mobileplayer.html?bvid=${vid}&as_wide=1&high_quality=1&danmaku=0' scrolling='no' border='0' frameborder='no' framespacing='0' allowfullscreen='true' style='position:absolute;height:100%;width:100%;'></iframe></div>`;
            }
        },
        // 解析网易云音乐
        netease: {
            reg: /https?:\/\/music\.163\.com\/(?:#\/)?(?:song|playlist|album)\?id=(\d+)/i,
            transform: (match, id) => `<meting-js auto='https://music.163.com/#/song?id=${id}'></meting-js>`
        },
        // 解析 QQ 音乐
        qqmusic: {
            reg: /https?:\/\/y\.qq\.com\/(?:[^?]+)\/([^?.]+)(?:\.html)?/i,
            transform: (match, id) => `<meting-js auto='https://y.qq.com/n/yqq/song${id}.html'></meting-js>`
        },
        // 解析腾讯视频
        qqvideo: {
            reg: /https?:\/\/v\.qq\.com\/(?:[^?]+)\/([a-z0-9]+)(?:\.html)?/i,
            transform: (match, id) => `<div class='video-wrapper'><iframe src='//v.qq.com/iframe/player.html?vid=${id}' allowFullScreen='true' frameborder='no'></iframe></div>`
        },
        // 解析 Spotify
        spotify: {
            reg: /https?:\/\/open\.spotify\.com\/(track|album)\/([a-zA-Z0-9]+)/i,
            transform: (match, type, id) => `<div class='spotify-wrapper'><iframe style='border-radius:12px' src='https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0' width='100%' frameBorder='0' allowfullscreen='' allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture' loading='lazy'></iframe></div>`
        },
        // 解析优酷视频
        youku: {
            reg: /https?:\/\/v\.youku\.com\/.*\/id_([a-zA-Z0-9=]+)(?:\.html)?/i,
            transform: (match, id) => `<div class='video-wrapper'><iframe src='https://player.youku.com/embed/${id}' frameborder=0 'allowfullscreen'></iframe></div>`
        },
        // 解析 YouTube
        youtube: {
            reg: /https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/i,
            transform: (match, id) => `<div class='video-wrapper'><iframe src='https://www.youtube.com/embed/${id}' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen title='YouTube Video'></iframe></div>`
        }
    };

    data.forEach((item, i) => {
        // 解码content
        let decodedContent = decodeHTMLEntities(item.content);
        
        const applicationInfo = item.application?.name 
            ? `From「<a href="${item.url}" target="_blank">${item.application.name}</a>」`
            : `From「<a href="${item.url}" target="_blank">Mastodon</a>」`; // 默认显示

        // 移除HTML标签，保留链接内容
        let plainContent = decodedContent.replace(/<[^>]+>/g, (match) => {
            if (match.startsWith('<a href="') && match.includes('</a>')) {
                const hrefMatch = match.match(/href="([^"]+)"/);
                return hrefMatch ? hrefMatch[1] : '';
            }
            return '';
        });

        // 应用所有转换模式
        let processedContent = plainContent;
        for (const [key, pattern] of Object.entries(patterns)) {
            processedContent = processedContent.replace(pattern.reg, pattern.transform);
        }

        // 处理媒体附件
        if (item.media_attachments && item.media_attachments.length > 0) {
            let imgUrl = '';
            item.media_attachments.forEach(attachment => {
                if (attachment.type === 'image') {
                    imgUrl += `<div class="resimg"><img loading="lazy" src="${attachment.preview_url}"/></div>`;
                }
            });
            if (imgUrl) {
                processedContent += `<div class="resource-wrapper"><div class="images-wrapper">${imgUrl}</div></div>`;
            }
        }

        const relativeTime = getRelativeTime(new Date(item.created_at));
        memoResult += ` 
        <li class="timeline" id="${item.id}">
        <div class="memos__content" style="--avatar-url: url('${item.account.avatar}')"> 
            <div class="memos__text">
                <div class="memos__userinfo"><div> 
            ${item.account.display_name} 
            </div>
            <div>
                <svg viewBox="0 0 24 24" aria-label="认证账号" class="memos__verify">
                <g>
                   <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z">
                   </path>
                </g>
                </svg>
            </div>
            <div>
                <div class="memos__id">@<a href=${item.account.url} target=_blank>${item.account.acct}</a></div>
            </div>
        </div>
        <p>${processedContent}</p>
        <div class="memos__meta">
        <small class="memos__date">${relativeTime} • ${applicationInfo}</small>
        </div> 
        </li>`;
    });

    const memoBefore = '<ul class="">';
    const memoAfter = '</ul>';
    resultAll = memoBefore + memoResult + memoAfter;
    memoDom.insertAdjacentHTML('beforeend', resultAll);

    // 初始化图片灯箱
    window.ViewImage && ViewImage.init('.container img');
}

// 获取数据并更新页面
async function fetchDataAndUpdate(url = `/api/memos?limit=10`, isLoadMore = false) {
    try {
        loadMoreBtn.textContent = '加载中...';
        loadMoreBtn.disabled = true;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // 获取Link header并解析下一页URL
        const linkHeader = response.headers.get('Link');
        if (linkHeader) {
            const links = linkHeader.split(',');
            const nextLink = links.find(link => link.includes('rel="next"'));
            if (nextLink) {
                const matches = nextLink.match(/<(.+?)>/);
                memo.nextPage = matches ? matches[1] : null;
            } else {
                memo.nextPage = null;
            }
        } else {
            memo.nextPage = null;
        }

        const data = await response.json();

        // 过滤掉转嘟和回复的状态
        const filteredData = data.filter(toot => {
            return !toot.reblog && !toot.in_reply_to_id;
        });

        // 如果是加载更多，不清空现有内容
        if (!isLoadMore) {
            memoDom.innerHTML = '';
        }

        updateHTMl(filteredData);

        // 更新加载更多按钮状态
        loadMoreBtn.disabled = false;
        loadMoreBtn.textContent = '加载更多';
        loadMoreBtn.style.display = memo.nextPage ? 'inline-block' : 'none';

    } catch (error) {
        console.error('Error fetching data:', error);
        loadMoreBtn.textContent = '加载失败，点击重试';
        loadMoreBtn.disabled = false;
    }
}

// 添加加载更多按钮的点击事件
loadMoreBtn.addEventListener('click', () => {
    if (memo.nextPage) {
        fetchDataAndUpdate(memo.nextPage, true);
    }
});

// 初始加载
fetchDataAndUpdate();
