/**
 * Created by sc on 2017/12/11.
 * 后台主入口文件app.js
 */

const express = require("express");  //使用express框架
const app = express();          //创建express入口函数
const session = require('express-session');  //导入session
const bodyParser = require('body-parser');   //该中间件用于post请求的接收
const router = require('./controller/router.js');//导入路由模块

/*中间件的使用-start*/
//设置express的session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

// for parsing application/json
app.use(bodyParser.json());

//跨域请求配置
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");//允许的域，设置为任意
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With"); //设置允许的header类型
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  //设置允许跨域的方法
    res.header("X-Powered-By",' 3.2.1');
    next();
});

//处理注册信息的接口
app.post('/register',router.register);

//用于查找的接口
app.post('/find',router.findData);

//接下不满足上述所有接口的请求，并返回错误提示
app.use(router.errorHandler);

/*中间件的使用-end*/
app.listen(3000);