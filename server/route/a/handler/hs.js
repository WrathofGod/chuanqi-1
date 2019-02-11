/**
 * Created by Sara on 2016/1/13.
 */
var wrapResult = require('uw-utils').wrapResultFunc(__filename);
var propUtils = require('uw-utils').propUtils;
var consts = require("uw-data").consts;
var c_prop = require("uw-data").c_prop;
var dsNameConsts = require("uw-data").dsNameConsts;
var iface = require("uw-data").iface;
var ds = require("uw-ds").ds;
var uwClient = require("uw-db").uwClient;
var heartStuntBiz = require("uw-heart-stunt").heartStuntBiz;
var gameRecordBiz = require("uw-game-record").gameRecordBiz;
var gameRecordSerial = require("uw-serial").gameRecordSerial;
var taskBiz = require("uw-task").taskBiz;

var proto = module.exports;

/**
 * 获取心法神功数据
 * @iface getInfo
 * @args
 * @param args
 * @param session
 * @param next
 */
proto.a = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    //接口调用
    heartStuntBiz.getInfo(uwClient,userId,function(err,data){
        if(err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data,dsNameConsts.HeartStuntEntity));
    });
};

/**
 * 选择心法
 * @iface choMenCulMethods
 * @args  {index:"槽位下标",heartStuntId:"选择心法id"}
 * @param args
 * @param session
 * @param next
 */
proto.b = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_heartStunt_choMenCulMethods_args;
    var index = args[argsKeys.index];
    var heartStuntId = args[argsKeys.heartStuntId];
    //接口调用
    heartStuntBiz.choMenCulMethods(uwClient,userId,index,heartStuntId,function(err,data){
        if(err) return next(null,wrapResult(err));
        var exHeartStuntData = new ds.ExHeartStuntData();
        exHeartStuntData.heartStuntData = data[1];
        exHeartStuntData.userData = data[0];
        next(null,wrapResult(null,exHeartStuntData,dsNameConsts.ExHeartStuntData));
    });
};

/**
 * 心法加点
 * @iface stuMenCulMethods
 * @args  {index:"槽位下标"}
 * @param args
 * @param session
 * @param next
 */
proto.c = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_heartStunt_stuMenCulMethods_args;
    var index = args[argsKeys.index];
    //接口调用
    heartStuntBiz.stuMenCulMethods(uwClient,userId,index,function(err,data){
        if(err) return next(null,wrapResult(err));
        var costGold = data[4];
        gameRecordSerial.add(userId,function(cb1) {
            gameRecordBiz.setCostGoldRecord(uwClient, userId, c_prop.goldCostTypeKey.stuMenCulMethods, costGold, cb1);
        });
        var exHeartStuntData = new ds.ExHeartStuntData();
        exHeartStuntData.heartStuntData = data[1];
        exHeartStuntData.userData = data[0];
        exHeartStuntData.isSucceed = data[2];
        exHeartStuntData.genuineQiArr = data[3];
        next(null,wrapResult(null,exHeartStuntData,dsNameConsts.ExHeartStuntData));
        //taskBiz.setTaskValue(uwClient,userId,c_prop.cTaskTypeKey.heartStunt,1,function(){});
    });
};

/**
 *更换心法
 * @iface chaMenCulMethods
 * @args  {index:"槽位下标",heartStuntId:"选择心法id"}
 * @param args
 * @param session
 * @param next
 */
proto.d = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_heartStunt_chaMenCulMethods_args;
    var index = args[argsKeys.index];
    var heartStuntId = args[argsKeys.heartStuntId];
    //接口调用
    heartStuntBiz.chaMenCulMethods(uwClient,userId,index,heartStuntId,function(err,data){
        if(err) return next(null,wrapResult(err));
        var costDiamond = data[2];
        if(costDiamond>0){
            gameRecordSerial.add(userId,function(cb1){
                gameRecordBiz.setCostDiamondRecord(uwClient,userId,c_prop.diamondCostTypeKey.chaMenCulMethods,costDiamond,cb1);
            });
        }
        var exHeartStuntData = new ds.ExHeartStuntData();
        exHeartStuntData.heartStuntData = data[1];
        exHeartStuntData.userData = data[0];
        next(null,wrapResult(null,exHeartStuntData,dsNameConsts.ExHeartStuntData));
    });
};