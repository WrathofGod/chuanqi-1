/**
 * Created by Sara on 2015/5/28.
 */

var wrapResult = require('uw-utils').wrapResultFunc(__filename);
var propUtils = require('uw-utils').propUtils;
var consts = require("uw-data").consts;
var dsNameConsts = require("uw-data").dsNameConsts;
var iface = require("uw-data").iface;
var couponBiz = require("uw-coupon").couponBiz;
var uwClient = require("uw-db").uwClient;
var ds = require("uw-ds").ds;
var c_prop = require("uw-data").c_prop;
var g_copyLoot = require("uw-global").g_copyLoot;
var g_guildWar = require("uw-global").g_guildWar;

var proto = module.exports;

/**
 * 获取掉落缓存
 * @iface getLootCache
 * @args
 * @isWorker 1
 * @param args
 * @param session
 * @param next
 * @returns
 */
proto.a = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var data = g_copyLoot.getLootCache();
    next(null,wrapResult(null,data));
};

/**
 * 获取掉落缓存
 * @iface getGroupWarGroupDic
 * @args
 * @isWorker 1
 * @param args
 * @param session
 * @param next
 * @returns
 */
proto.b = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var data = g_guildWar.getGroupWarGroupDic();
    next(null,wrapResult(null,data));
};
