var async = require("async");
var wrapResult = require('uw-utils').wrapResultFunc(__filename);
var c_msgCode = require("uw-data").c_msgCode;
var c_prop = require("uw-data").c_prop;
var uwClient = require("uw-db").uwClient;

var proto = module.exports;
var iface = require("uw-data").iface;
var consts = require("uw-data").consts;
var project = require("uw-config").project;
var ds = require("uw-ds").ds;
var dsNameConsts = require("uw-data").dsNameConsts;
var getMsg = require("uw-utils").msgFunc(__filename);
var propUtils = require("uw-utils").propUtils;
var accountBiz = require("uw-account").accountBiz;
var gameRecordBiz = require("uw-game-record").gameRecordBiz;
var gameRecordSerial = require("uw-serial").gameRecordSerial;
var sessionManager = require("uw-route").sessionManager;
var dispatchUtils = require('uw-utils').dispatchUtils;
/**
 * 验证常规登录,成功返回null
 * @iface login
 * @args {name:"用户名",pwd:"密码",channelId:"渠道id"}
 * @param args
 * @param session
 * @param next
 */
proto.a = function (args, session, next) {
    var argsKeys = iface.c_account_login_args;
    var name = args[argsKeys.name];
    var password = args[argsKeys.pwd];
    var channelId = args[argsKeys.channelId];
    accountBiz.login(uwClient, name, password, channelId,function(err,data){
        if(err) return next(null, wrapResult(err));
        _handleLogin(session,data,next);
    });
};

/**
 * 验证sdk平台登陆,成功返回null
 * sdkData的数据说明：
 * egret: [token]
 * xiaomi: [uid,sessionId]
 * @iface loginBySdk
 * @args {channelId:"渠道号id",sdkData:"sdk的数据，是一个数组[]",deviceId:"机器码"}
 * @param args
 * @param session
 * @param next
 */
proto.a1 = function (args, session, next) {
    var argsKeys = iface.c_account_loginBySdk_args;
    var sdkData = args[argsKeys.sdkData];
    var deviceId = args[argsKeys.deviceId];
    var channelId = args[argsKeys.channelId];
    accountBiz.loginBySdk(uwClient, channelId, deviceId, sdkData,function(err,data){
        if(err) return next(null, wrapResult(err));
        _handleLogin(session,data,next);
    })
};

/**
 * 注册账号
 * @iface register
 * @args {name:"账号",pwd:"密码", channelId:"渠道号id",deviceId:"机器码"}
 * @param args
 * @param session
 * @param next
 */
proto.c = function (args, session, next) {
    var argsKeys = iface.c_account_register_args;
    var name = args[argsKeys.name];
    var pwd = args[argsKeys.pwd];
    var deviceId = args[argsKeys.deviceId];
    var channelId = args[argsKeys.channelId];
    accountBiz.register(uwClient, name,pwd,channelId, deviceId,function(err,userData){
        if(err) return next(null, wrapResult(err));
        next(null,wrapResult(null,userData,dsNameConsts.UserEntity));
    })
};

var _handleLogin = function(session,data,next){
    var accountData = data[0],userData = data[1],rechargeData = data[2],arenaData = data[3],copyProgressList = data[4],heroList = data[5] ;

    _initSession(session,accountData,userData,function(err,data2){
        if(err) return next(null, wrapResult(err));
        var loginData = new ds.LoginData();
        loginData.account = propUtils.selectProp(accountData,["status","sdkData"]);
        loginData.user = propUtils.delProp(userData,["record"]);
        loginData.rechargeData = rechargeData;
        loginData.arenaData = arenaData;
        loginData.copyProgressList = copyProgressList;
        loginData.heroList = heroList;

        //记录登陆次数
        gameRecordSerial.add(userData.id,function(cb1){
            gameRecordBiz.setLoginCount(uwClient,userData.id,cb1);
        });
        next(null,wrapResult(null,loginData,dsNameConsts.LoginData));
    });

};

var _initSession = function(session,accountData,userData,cb){
    _checkHasLogin(session, accountData.id, function () {
        var areaId = dispatchUtils.getArea().id;
        var ip = session.__session__.__socket__.remoteAddress.ip;
        _initLoginSession(session, accountData.id, userData.id, 0,areaId,ip, function (err, data) {
            if (err) return cb(err);
            cb();
        });
    });
};

/**
 * --------------------------------------------------局部方法-------------------------------------------------------------------
 */


/**
 * 判断是否已经登录，如果已经登录则踢出在线的账号
 * @param session
 * @param uid
 * @param cb
 * @returns {*}
 */
var _checkHasLogin = function (session, uid, cb) {
    var sessionService = pomelo.app.get('sessionService');
    var u = sessionService.getByUid(uid);
    if (!u) return cb();
    sessionService.kick(uid, function (err) {
        cb();
    });
};

/**
 * 初始化session,如果没有创建账号，则在创建账号的时候初始化userId
 * @param session
 * @param accountId
 * @param userId
 * @param serverId
 * @param areaId
 * @param ip
 * @param cb
 */
var _initLoginSession = function (session, accountId, userId, serverId,areaId,ip, cb) {
    session.bind(accountId);
    session.set(consts.session.accountId, accountId);
    session.set(consts.session.serverId, serverId);
    session.set(consts.session.ip, ip);

    session.set(consts.session.areaId, areaId);
    if (userId) {
        session.set(consts.session.userId, userId);
    }
    session.on('closed', _onUserLeave);
    session.pushAll(cb);

};

/*
todo 先不管
var _remoteAddUser = function(session,userId,accountData,areaId,ip,serverId,cb){
    var userData = new UserData();
    userData.id = userId;
    userData.sid = session.frontendId;//
    userData.aid = accountData.id;//账号id
    userData.areaId = areaId;//逻辑服务器id
    userData.loginTime = Date.now();
    userData.channelId = accountData.channelId;//    渠道平台
    userData.channel = accountData.channel;
    userData.sub_channel = accountData.sub_channel;
    userData.plat = accountData.plat;
    userData.deviceId = accountData.deviceId;//    设备唯一号
    userData.ip = ip;//逻辑服务器id
    userData.serverId = serverId;//逻辑服务器id
    pomelo.app.rpc.a.userRemote.addUser(session, userData, function (err,data) {
        if(err) return cb(err);
        cb();
    });
};
*/

/**
 * 断开链接时，会调用下面的代码
 * @param session
 * @param reason
 */
var _onUserLeave = function (session, reason) {
    if (!session || !session.uid) {
        return;
    }
    var userId = session.get(consts.session.userId);
    if (!userId) return;
    pomelo.app.rpc.a.userRemote.removeUser(session, userId, function () {

    });
};
