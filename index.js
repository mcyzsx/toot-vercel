require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();

// 设置环境变量 - 适配Misskey
const MisskeyInstance = process.env.MISSKEY_INSTANCE || 'https://nya.one';
const MisskeyUserId = process.env.MISSKEY_USERID || 'a5vwhj6ok3v21cud';
const Title = process.env.TITLE || 'Misskey Embed';
const Description = process.env.DESCRIPTION || 'Misskey时间线嵌入展示';
const MaxHeight = process.env.MAX_HEIGHT || '700';

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// 动态生成 HTML
app.get('/', (req, res) => {
    const html = `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="referrer" content="no-referrer">
        <link rel="icon" href="/assets/img/logo.webp" type="image/*" />
        <link href="assets/css/style.css" rel="stylesheet" type="text/css">
        <link href="assets/css/APlayer.min.css" rel="stylesheet" type="text/css">
        <link href="assets/css/highlight.github.min.css" rel="stylesheet" type="text/css">
        <link href="assets/css/custom.css" rel="stylesheet" type="text/css">
        <link href="assets/css/misskey-embed.css" rel="stylesheet" type="text/css">
        <title>${Title}</title>              
        <link rel="stylesheet" href="https://cdn.0tz.top/lxgw-wenkai-screen-webfont/style.css" /> 
        <style>body{font-family:"LXGW WenKai Screen",sans-serif;}</style>
    </head>
    <body>
        <header>
            <div class="menu">
                <div class="title">首页</div>
                <div class="pages">
                </div>
            </div>
            <div class='theme-toggle'>🌓</div>
        </header>
        <section id="main" class="container">
            <h1>${Title}</h1>
            <blockquote>
                ${Description}
            </blockquote>
            <div class="misskey-embed-container">
                <iframe 
                    src="${MisskeyInstance}/embed/user-timeline/${MisskeyUserId}?maxHeight=${MaxHeight}" 
                    data-misskey-embed-id="v1_${Date.now()}" 
                    loading="lazy" 
                    referrerpolicy="strict-origin-when-cross-origin" 
                    style="border: none; width: 100%; max-width: 500px; height: 300px; color-scheme: light dark;"
                    class="misskey-iframe">
                </iframe>
            </div>
        </section>
        <button id="backToTopBtn" title="Go to top">Top</button>
        <footer class="markdown-body footer">
            <p>Copyright @
                <script>
                    document.write(new Date().getFullYear())
                </script>
                 ${Title}  All Rights Reserved.
            </p>
        </footer>
        <script type="text/javascript" src="assets/js/view-image.min.js"></script>
        <script type="text/javascript" src="assets/js/APlayer.min.js"></script>
        <script type="text/javascript" src="assets/js/Meting.min.js"></script>
        <script type="text/javascript" src="assets/js/custom.js"></script>
        <script defer src="${MisskeyInstance}/embed.js"></script>
        <script type="text/javascript" src="assets/js/misskey-adapt.js"></script>
    </body>
    </html>
    `;

    res.send(html);
});

// 不再需要API代理，因为我们使用Misskey的嵌入模式

module.exports = app;
