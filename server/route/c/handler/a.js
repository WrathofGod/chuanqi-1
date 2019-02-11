var async = require("async");
var wrapResult = require('uw-utils').wrapResultFunc(__filename);
var c_msgCode = require("uw-data").c_msgCode;
var c_prop = require("uw-data").c_prop;
var uwClient = require("uw-db").uwClient;
var g_common = require('uw-global').g_common;
var pomelo = require("pomelo");

var proto = module.exports;
var iface = require("uw-data").iface;
var consts = require("uw-data").consts;
var project = require("uw-config").project;
var ds = require("uw-ds").ds;
var dsNameConsts = require("uw-data").dsNameConsts;
var getMsg = require("uw-utils").msgFunc(__filename);
var propUtils = require("uw-utils").propUtils;
var dispatchUtils = require("uw-utils").dispatchUtils;
var accountBiz = require("uw-account").accountBiz;
var userBiz = require("uw-user").userBiz;
var taskBiz = require("uw-task").taskBiz;
var sdkBiz = require("uw-sdk").sdkBiz;
var gameRecordBiz = require("uw-game-record").gameRecordBiz;
var gameRecordSerial = require("uw-serial").gameRecordSerial;
var sessionManager = require("uw-route").sessionManager;
var UserData = require('uw-gameobj').UserData;
var bonusBiz = require('uw-bonus-share').bonusBiz;

/**
 * 验证常规登录,成功返回null
 * @iface enterGame
 * @args {accountId:"账号id",loginKey:"登录key",serverIndexId:"登录key"}
 * @param args
 * @param session
 * @param next
 */
proto.a = function (args, session, next) {
    var argsKeys = iface.c_account_enterGame_args;
    var accountId = args[argsKeys.accountId];
    var loginKey = args[argsKeys.loginKey];
    var serverIndexId = args[argsKeys.serverIndexId];
    userBiz.getInitData(uwClient, accountId, loginKey,serverIndexId,function(err,data){
        if(err) return next(null, wrapResult(err));
        var userData = data[1];
        if(!userData){
            session.set(consts.session.accountId,accountId);
            session.set(consts.session.serverIndexId,serverIndexId);
            session.pushAll(function(){
                if(err) return next(null, wrapResult(err));
                return next(null, wrapResult(null));
            });
        }else{
            _handleLogin(session,data,next);
        }
    });
};

/**
 * 创建用户
 * @iface createUser
 * @args {name:"名字",heroTempId:"模板id ",sex:"性别 ",serverIndexId:"登录key",shareKey:"可能的分红模块的分享key"}
 * @param args
 * @param session
 * @param next
 * @returns ds.ExUserData
 */
proto.b = function (args, session, next) {
    var argsKeys = iface.c_account_createUser_args;
    var accountId = session.get(consts.session.accountId);
    var name = args[argsKeys.name];
    var heroTempId = args[argsKeys.heroTempId]||1;
    var sex = args[argsKeys.sex]||0;
    var serverIndexId = args[argsKeys.serverIndexId]||0;
    var shareKey = args[argsKeys.shareKey] || '';

    if (name == null || name == "") return next(null,wrapResult("角色名不能为空！"));
    if(name.indexOf(" ")>=0) return next(null,wrapResult("角色名不能包含空格！"));

    //接口调用
    userBiz.createUser(uwClient,accountId,name,heroTempId,sex,serverIndexId,shareKey,function(err,data){
        if (err) return next(null,wrapResult(err));
        var userData = data[0];
        var heroData = data[1];
        next(null,wrapResult(null,null));
        if (userData && heroData) {
            taskBiz.setTaskValue(uwClient, userData.id, c_prop.cTaskTypeKey.clearHero, 1, function () {
            });
        }
    });
};

/**
 * 获取第三方用户信息
 * @iface getThirdUserInfo
 * @args {}
 * @isWorker 1
 * @param args
 * @param session
 * @param next
 */
proto.hda = function (args, session, next) {
    var accountId = session.get(consts.session.accountId);
    sdkBiz.getSdkData(accountId,function(err,accountData){
        if (err) return next(null,wrapResult(err));
        var sdkData = accountData.sdkData;
        if(sdkData && sdkData.nickname && sdkData.avatar && sdkData.is_real){
            delete(sdkData.id);
            delete(sdkData.channelid);
            delete(sdkData.open_id);
            return next(null, wrapResult(null,sdkData,dsNameConsts.sdkData));
        }
        return next(null, wrapResult(null,null));
    });
};


var _handleLogin = function(session,data,next){

    var accountData = data[0],userData = data[1],handleData = data[2],otherData = data[3];
    var rechargeData = otherData[0], copyProgressList = otherData[1],heroList = otherData[2],pkOut = otherData[3],lottery = otherData[4], task = otherData[5],arena = otherData[6],lootTypeArr = otherData[7], offLineData = handleData[0];

    _initSession(session,accountData,userData,function(){
        var loginData = new ds.LoginData();
        loginData.user = userData;
        loginData.rechargeData = rechargeData;
        loginData.copyProgressList = copyProgressList;
        loginData.heroList = heroList;
        loginData.pkOut = pkOut;
        loginData.lottery = lottery;
        loginData.task = task;
        loginData.offLineData = offLineData;
        loginData.arenaData = arena;
        loginData.lootTypeArr = lootTypeArr;
        //记录登陆次数
        gameRecordSerial.add(userData.id,function(cb1){
            gameRecordBiz.setLoginCount(uwClient,userData.id,cb1);
        });
        _remoteAddUser(session, userData, accountData,  function( err,data){
            if (err) return next(null, wrapResult(err));
            next(null,wrapResult(null,loginData,dsNameConsts.LoginData));
        });
    });

};


/**
 * --------------------------------------------------局部方法-------------------------------------------------------------------
 */

var _initSession = function(session,accountData,userData,cb){
    if(g_common.appIsHttp){
        session.set(consts.session.accountId,accountData.id);
        session.set(consts.session.serverIndexId,userData.serverIndexId);
        session.set(consts.session.isGM, accountData.status == consts.accountStatus.gm ? 1 : 0);
        sessionManager.bindUid(accountData.id,session.id,userData.serverIndexId);
        session.set(consts.session.userId,userData.id);
        cb();
    }else{
        _checkHasLogin(session, accountData.id, function () {
            //session.frontendId
            var areaId = dispatchUtils.getArea().id;
            var ip = session.__session__.__socket__.remoteAddress.ip;
            _initLoginSession(session, accountData.id, userData.id, 0,areaId,ip, function (err, data) {
                if (err) return cb(err);
                cb();
            });
        });
    }
};

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

var _remoteAddUser = function(session,userData,accountData,cb){
    if(g_common.appIsHttp) return cb();
    var ip = session.__session__.__socket__.remoteAddress.ip;
    var uData = new UserData();
    uData.id = userData.id;
    uData.sid = session.frontendId;//
    uData.aid = accountData.id;//账号id
    uData.loginTime = Date.now();
    uData.ip = ip;//ip

    pomelo.app.rpc.a.userRemote.addUser(session, uData, function (err,data) {
        if(err) return cb(err);
        cb();
    });
};


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
