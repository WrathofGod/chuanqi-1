/**
 * Created by Administrator on 2015/5/29.
 */
var sessionManager = require('uw-route').sessionManager;
var wrapResult = require('uw-utils').wrapResultFunc(__filename);
var iface = require("uw-data").iface;
var cryptCfg = require("uw-config").crypt;
var proto = module.exports;

/**
 * 链接
 * @iface connect
 * @args
 * @param args
 * @param session
 * @param next
 */
proto.a = function (args, session, next) {
    var session = sessionManager.createSession();
    next(null,wrapResult(null,[session.id,cryptCfg.cryptKey]));
};

/**
 * 断开链接
 * @iface disconnect
 * @args {sessionId:" sessionId"}
 * @param args
 * @param session
 * @param next
 */
proto.b = function (args, session, next) {
    var argsKeys = iface.c_net_disconnect_args;
    var sessionId = args[argsKeys.sessionId];
    sessionManager.destroySession(sessionId);
    next(null,wrapResult(null,null));
};

/**
 * 获取服务器当前时间
 * @iface getServerDate
 * @args
 * @param args
 * @param session
 * @param next
 */
proto.c = function(args, session, next){
    next(null, wrapResult(null, Date.now()));
};