require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();
const axios = require('axios');

// 设置环境变量
const Host = process.env.HOST || 'https://jiong.us/';
const UserId = process.env.USERID || '110710864910866001';
const Tittle = process.env.TITTLE || 'Retirement Memos';
const Description = process.env.DESCRIPTION || '愿爱无忧! peace & love !';

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// 动态生成 HTML
app.get('/', (req, res) => {
    const html = `
    <!DOCTYPE html>
    <html lang="en">
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
        <link href="assets/css/misskey.css" rel="stylesheet" type="text/css">
        <title>${Tittle}</title>              
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
            <h1>${Tittle}</h1>
            <blockquote>
                <!--   <p>Je <del>memos</del>, donc je suis - <em>René Descartes fans</em></p> -->
                ${Description}
            </blockquote>
            <div id="memos" class="memos">
                <!-- Memos Container -->
            </div>
        </section><button id="backToTopBtn" title="Go to top">Top</button>
        <footer class="markdown-body footer">
            <p>Copyright @
                <script>
                    document.write(new Date().getFullYear())
                </script>
                 ${Tittle}  All Rights Reserved.
            </p>
        </footer>
        <script type="text/javascript" src="assets/js/view-image.min.js"></script>
        <script type="text/javascript" src="assets/js/APlayer.min.js"></script>
        <script type="text/javascript" src="assets/js/Meting.min.js"></script>
        <script type="text/javascript" src="assets/js/main.js"></script>
        <script type="text/javascript" src="assets/js/custom.js"></script>
        <script type="text/javascript" src="assets/js/misskey-config.js"></script>
        <script type="text/javascript" src="assets/js/misskey.js"></script>
    </body>
    </html>
    `;

    res.send(html);
});

// 代理 /api/memos 路由
app.get('/api/memos', async (req, res) => {
    // 从环境变量读取，添加默认值和错误检查
    const host = (process.env.HOST || 'https://jiong.us/').replace(/\/$/, '');
    const userId = process.env.USERID || '110710864910866001';
    const token = process.env.TOKEN; 

    // 检查必需的变量是否存在
    if (!host || !userId) {
        return res.status(500).json({ error: '服务器配置错误：缺少必要的API参数' });
    }

    // 组装参数
    const limit = req.query.limit || 10;
    const params = [
        'exclude_replies=true',
        'only_public=true'
    ];
    if (req.query.max_id) params.push(`max_id=${req.query.max_id}`);
    if (req.query.since_id) params.push(`since_id=${req.query.since_id}`);

    const url = `${host}/api/v1/accounts/${userId}/statuses?${params.join('&')}`;

    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(url, {
            headers,
            timeout: 10000 // 增加超时时间
        });
        // 透传 Link header（用于前端获取下一页）
        if (response.headers.link) {
            res.set('Link', response.headers.link);
        }
        res.json(response.data);
    } catch (err) {
        console.error('API请求错误:', err.message);
        if (err.code === 'ECONNABORTED') {
            res.status(504).json({ error: '请求第三方API超时' });
        } else if (err.response) {
            // API返回错误响应
            res.status(err.response.status).json({ 
                error: `API返回错误: ${err.response.status}`,
                detail: err.response.data 
            });
        } else {
            res.status(500).json({ 
                error: 'API 代理失败', 
                detail: err.message,
                url: url // 添加请求URL以便调试
            });
        }
    }
});

module.exports = app;
