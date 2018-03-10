var express = require('express');
var app = express();
var user = require('./router/users.js')
var goods = require('./router/goods.js')
var bodyParser = require("body-parser")
var cookieParser = require('cookie-parser');
var path = require('path');

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'data')));

//全局拦截器，非指定接口需要登录后才能请求
app.use(function (req, res, next) {
  if (req.cookies.userId) {
    next()
  } else {
    if (req.originalUrl == '/api/user/login' || req.originalUrl == '/api/user/logout' || req.path == '/api/goodslist/page' || req.path == '/api/goodslist' || req.path == '/api/goodslist/detail' || req.path == '/api/user/addUsers' || req.path == '/api/user/checkPwdQuestion' || req.path == '/api/user/newPwd' || req.path == '/api/user/inspectPwdAnswer') {
      next()
    } else {
      res.json({
        status: '10001',
        msg: '当前未登录！',
        result: ''
      })
    }
  }
})

app.use('/api/goodslist', goods)

app.use('/api/user', user)

app.listen(3000, function () {
  console.log('服务器启动成功,监听端口3000')
})