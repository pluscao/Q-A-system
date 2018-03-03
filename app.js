/**
 * Created by sc on 2017/12/11.
 * 后台主入口文件app.js
 */

const express = require("express");  //使用express框架
const app = express();          //创建express入口函数
const session = require('express-session');  //导入session


const bodyParser = require('body-parser');   //该中间件用于post请求的接收
const router = require('./controller/router.js');//导入路由模块
const backMessage = require('./module/backMessage.js'); //返回码

/*中间件的使用-start*/

// 设置express的session
app.set('trust proxy', 1);// trust first proxy
app.use(session({
    secret: 'keyboard cat',
    cookie: ('name', 'value', { path: '/', httpOnly: true,secure: false, maxAge:  60000 }),

    //重新保存：强制会话保存，即使是未修改的。默认为true但是得写上

    resave: true,

    //强制“未初始化”的会话保存到存储。
    saveUninitialized: true,
}));

// for parsing application/json
app.use(bodyParser.json());

//重置错误码信息
app.all('*',(req,res,next) => {
    backMessage.back('0','success','no result');
    next();
});


//跨域请求配置
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");//允许的域，设置为任意
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With"); //设置允许的header类型
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  //设置允许跨域的方法
    res.header("X-Powered-By",' 3.2.1');
    next();
});
/* 中间件的使用-end */


//系统运行测试
app.get('/root/ping',router.ping);

//处理注册信息的接口
app.post('/register',router.register);

//处理登录信息的接口
app.post('/logIn',router.signIn);

//处理登出信息的接口
app.get('/logout',router.logOut);

//请求session内容
app.post('/query/session',router.querySession);

//添加提问信息的接口
app.post('/add/question',router.addQuestion);

//删除提问
app.post('/delete/question',router.deleteQuestion);

//回答接口
app.post('/add/answer',router.addAnswer);

//删除回答
app.post('/delete/answer',router.deleteAnswer);

//用户个人信息设置
app.post("/setting/user",router.setUserMessage);

//用于查找的接口
app.post('/find',router.findData);

//接下不满足上述所有接口的请求，并返回错误提示
app.use(router.errorHandler);

/*中间件的使用-end*/
app.listen(3001);
