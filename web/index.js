const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000; // 端口（默认 3000，可通过环境变量修改）

// 配置静态文件目录（public 下的文件可直接通过 URL 访问）
app.use(express.static(path.join(__dirname, './client')));

// 可选：自定义路由（例如处理不存在的页面）
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, './client/404.html')); // 自定义 404 页面
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});