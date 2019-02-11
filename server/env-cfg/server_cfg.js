/**
 * Created by Administrator on 2015/10/30.
*/
module.exports = {
    "id":1,//服务器id
    /*    "monitorHttpHost" : "127.0.0.1",//监听端口，必要再开
     "monitorHttpPort" : 11111,//监听端口，必要再开*/
    "serverHttpPort" : 24200,//主登录端口，登陆验证(唯一)(外)
    "mainCnn":{ "host" : "192.168.0.11", "port" : "3306","database":"longmen","user":"root","password":"llRoot"},//主数据库
    "kefuCnn":{ "host" : "192.168.0.11", "port" : "3306","database":"longmen","user":"root","password":"llRoot"},//主数据库
    "loginCnn":{ "host" : "192.168.0.11", "port" : "3306","database":"longmen","user":"root","password":"llRoot"},//主数据库
    "serverCnn":{ "host" : "192.168.0.11", "port" : "3306","database":"longmen","user":"root","password":"llRoot"},  //游戏服数据库
    "log":{"basePath":"./logs/","levels":"DEBUG"},//log日志
    "notify_url":"http://www.lmsypt.com",
    "isQQZoneServer":1,
    "cpuWorkers":2,
    "adminIps":"127.0.0.1,218.80.0.45,121.43.165.61"
}