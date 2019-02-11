/**
 * Created by Administrator on 14-8-25.
 */

var uwClient = require("uw-db").uwClient;
var uwData = require("uw-data");
var iface = uwData.iface;
var consts = uwData.consts;
var c_recharge = uwData.c_recharge;
var wrapResult = require('uw-utils').wrapResultFunc(__filename);
var propUtils = require('uw-utils').propUtils;
var client = require("uw-db").uwClient;
var async = require("async");
var userUtils = require("uw-utils").userUtils;
var dsNameConsts = uwData.dsNameConsts;
var proto = module.exports;
var rechargeBiz = require("uw-recharge").rechargeBiz;
var rechargeRequestBiz = require("uw-recharge").rechargeRequestBiz;
var rechargeDao = require("uw-recharge").rechargeDao;
var gameRecordBiz = require("uw-game-record").gameRecordBiz;
var gameRecordSerial = require("uw-serial").gameRecordSerial;
var c_prop = require("uw-data").c_prop;
var ds = require("uw-ds").ds;
/**
 * 获取充值记录信息
 * @iface getInfo
 * @args
 * @isWorker 1
 * @param args
 * @param session
 * @param next
 */
proto.a = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    rechargeBiz.getInfo(client, userId, function (err, rechargeData) {
        if (err) return next(null, wrapResult(err));
        next(null, wrapResult(null, rechargeData, dsNameConsts.RechargeData));
    });
};

/**
 * 充值
 * @iface recharge
 * @args {rechargeId:"充值项ID",channelId:"渠道号",receiptData:"苹果验证数据"}
 * @param args
 * @param session
 * @param next
 */
proto.b = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_recharge_recharge_args;
    var rechargeId = args[argsKeys.rechargeId];
    var channelId = args[argsKeys.channelId];
    var receiptData = args[argsKeys.receiptData];
    rechargeBiz.recharge(client, userId, rechargeId,channelId,receiptData, function (err, data) {
        if (err) return next(null, wrapResult(err));
        //记录充值
        if(rechargeId){
            var rechargeData = c_recharge[rechargeId];

            gameRecordSerial.add(userId,function(cb1){
                gameRecordBiz.setRecharge(uwClient,userId,rechargeId,rechargeData.cost,cb1);
            });
        }
        next(null, wrapResult(null,propUtils.delProp(data,["record"]),dsNameConsts.UserEntity));
    });
};

/**
 * 获取今天累计充值
 * @iface getTodayCount
 * @args
 * @isWorker 1
 * @param args
 * @param session
 * @param next
 */
proto.c = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    rechargeDao.getTodayCount(client, userId, function (err, count) {
        if (err) return next(null, wrapResult(err));
        next(null, wrapResult(null,count));
    });
};

/**
 * 获取所有累计充值
 * @iface getAllCount
 * @args
 * @isWorker 1
 * @param args
 * @param session
 * @param next
 */
proto.d = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    rechargeDao.getAllCount(client, userId, function (err, count) {
        if (err) return next(null, wrapResult(err));
        next(null, wrapResult(null,count));
    });
};

/**
 * 请求充值
 * @iface getRequest
 * @args {rechargeId:"充值项ID",goodsId:"渠道物品id"}
 * @isWorker 1
 * @param args
 * @param session
 * @param next
 * @returns [请求id,服务器id,支付数据]
 */
proto.e = function(args, session, next){
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_recharge_getRequest_args;
    var rechargeId = args[argsKeys.rechargeId];
    var goodsId = args[argsKeys.goodsId]||0;
    rechargeRequestBiz.getRequest(client, userId, rechargeId,goodsId,function (err, data) {
        if (err) return next(null, wrapResult(err));
        next(null, wrapResult(null,data));
    });
};

/**
 * 处理支付请求
 * @iface handleRequest
 * @args
 * @param args
 * @param session
 * @param next
 * returns  ["是否处理完","获得钻石","充值项"]
 */
proto.g = function(args, session, next){
    var userId = session.get(consts.session.userId);
    var accountId = session.get(consts.session.accountId);
    rechargeRequestBiz.handleRequest(client, accountId,userId, function (err, data) {
        if (err) return next(null, wrapResult(err));
        //data[userUpdate,addDiamond,isFinish,rechargeId]
        var handleData = new ds.HandleRecharge();
        handleData.userData = data[0];//用户数据
        handleData.addDiamond = data[1];
        handleData.isFinish = data[2];//是否完成
        handleData.rechargeId = data[3];//充值项

        //记录充值
        var rechargeId = handleData.rechargeId;
        if(rechargeId){
            var rechargeData = c_recharge[rechargeId];

            gameRecordSerial.add(userId,function(cb1){
                gameRecordBiz.setRecharge(uwClient,userId,rechargeId,rechargeData.cost,cb1);
            });
        }
        var getDiamond = handleData.addDiamond;
        if(getDiamond>0){
            gameRecordSerial.add(userId,function(cb1){
                gameRecordBiz.setDiamondRecord(uwClient,userId,c_prop.diamondGetTypeKey.recharge,getDiamond,cb1);
            });
        }

        next(null, wrapResult(null, handleData,dsNameConsts.HandleRecharge));
    });
};