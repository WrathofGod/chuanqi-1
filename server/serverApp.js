
/**
 * Created by Administrator on 2015/5/23.
 */
var cluster = require('cluster');
require('./reset.js').resetServer();
require('date-utils');
var appUtils =require("uw-utils").appUtils;
appUtils.before();

var express = require('express');
var sessionManager = require('uw-route').sessionManager;
var route = require('uw-route');
var loginFilter = require('uw-route').loginFilter;
var adminFilter = require('uw-route').adminFilter;
var requestWorkers = require('uw-route').requestWorkers;
var projectConfig = require('uw-config').project;
var g_common = require('uw-global').g_common;
g_common.appIsHttp = true;

var robotUtils = require('uw-utils').robotUtils;



var _startApp = function(){

//初始化session
    sessionManager.init({
        expireTime:  60 * 60, //过期时间（秒） ，设置1小时
        secret: "kshh1d23hsdas",//默认key值
        gcTime: 12 * 60 * 60//回收时间，秒
    });
    /*
     //路由过滤登陆
     route.initFilter("a",loginFilter);
     */

    var app = express();

//设置跨域访问
    app.all('*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
        res.header("Content-Type", "application/json;charset=utf-8");
        next();
    });

//自定义的路由器中间件
    app.use(route.route({isSession:1}));
//过滤登陆 中间件
    app.use(loginFilter({routeList:["a"]}));
    app.use(adminFilter({routeList:["admin"]}));
//请求处理中间件
    app.get('/', route.request());


    app.listen(projectConfig.serverHttpPort);
    console.log("http://127.0.0.1:"+projectConfig.serverHttpPort);
    console.log("start server finish!");

};


if (projectConfig.cpuWorkers>0)
    requestWorkers.init();

if (cluster.isMaster) {
    appUtils.initServer(function(err){
        if(err){
            console.error(err);
            console.error("服务器启动失败！");
            return;
        }
        _startApp();
    });
}


// Uncaught exception handler
process.on('uncaughtException', function (err) {
    //输入语法报错到日志
    var logger = require('uw-log').getLogger("uw-sys-error", __filename);
    logger.error(' Caught exception: ' + err.stack);
    logger.error("\n");
});

