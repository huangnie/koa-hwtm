var staticServer = require('koa-static');
var koa = require('koa');
var path = require('path');

var app = koa();

// 静态资源文件夹
// 网页
app.use(staticServer(path.join(__dirname, 'public')));
// 用户文件
app.use(staticServer(path.join(__dirname, 'storage')));

// 启动 TCP 服务
//~ require('./app/tcp.js');

// 启动 HTTP 服务
var app = require('./app/http.js')(app, path, { open:   '<%',  close:  '%>', cache:  false, });

// 启动 WEBSOCKET 服务
// 这 3 行代码一定要在最后一个 app.use 后面使用
var server = require('http').Server(app.callback());
var io = require('socket.io')(server);
require('./app/ws.js')(io);

server.listen(80);
console.log("server linsten on 127.0.0.1:80");

