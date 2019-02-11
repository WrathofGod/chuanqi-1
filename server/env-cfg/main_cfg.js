/**
 * Created by Administrator on 2015/10/30.
 */

module.exports = {
    "id":1,
    "mainHttpPort" : 5005,//主登录端口，登陆验证(唯一)(外)
    "mainCnn":{ "host" : "192.168.0.11", "port" : "3306","database":"longmen","user":"root","password":"llRoot"},//主数据库
    "loginCnn":{ "host" : "192.168.0.11", "port" : "3306","database":"longmen","user":"root","password":"llRoot"},//主数据库
    "log":{"basePath":"./logs/main/","levels":"DEBUG"}//配置log日志
}