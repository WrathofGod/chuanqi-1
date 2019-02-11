/**
 * Created by Administrator on 2014/5/26.
 */
var uwTrans = require("uw-db").uwTrans;
var mainClient = require("uw-db").mainClient;
var uwData = require("uw-data");
var c_prop = uwData.c_prop;
var iface = uwData.iface;
var consts = uwData.consts;
var ds = require("uw-ds").ds;
var wrapResult = require('uw-utils').wrapResultFunc(__filename);
var propUtils = require('uw-utils').propUtils;
var activityBiz = require('uw-activity').activityBiz;
var client = require("uw-db").uwClient;
var async = require('async');
var gameRecordBiz = require("uw-game-record").gameRecordBiz;
var gameRecordSerial = require("uw-serial").gameRecordSerial;

var dsNameConsts = uwData.dsNameConsts;

var proto = module.exports;

/**
 * 神秘商店购买礼包
 * @iface buyMysterShop
 * @args {activityId:"活动id",index:"栏目项"}
 * @param args
 * @isWorker 1
 * @param session
 * @param next
 * @returns [ds.ExActivity]
 */
proto.a = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_activity_buyMysterShop_args;
    var activityId = args[argsKeys.activityId];
    var index = args[argsKeys.index];
    activityBiz.buyMysterShop(client,activityId,userId,index,function(err,data){
        if(err) return next(null, wrapResult(err));
        var costDiamond = data[3];
        if(costDiamond>0){
            gameRecordSerial.add(userId,function(cb1){
                gameRecordBiz.setCostDiamondRecord1(client,userId,c_prop.diamondCostTypeKey.activity,costDiamond,cb1);
            });
        }
        var exData = new ds.ExActivityData();
        exData.userData = data[0];
        exData.bagItems = data[1];
        exData.equipBagItems = data[2];
        exData.mysterShopArr = data[4];
        next(null, wrapResult(null,exData,dsNameConsts.ExActivityData));
    });
};

/**
 * 获取活动列表
 * @iface getList
 * @args
 * @isWorker 1
 * @param args
 * @param session
 * @param next
 * @returns [ds.ExActivity]
 */
proto.e = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    activityBiz.getList(client,userId,function(err,activityList){
        if(err) return next(null, wrapResult(err));
        next(null, wrapResult(null,activityList,dsNameConsts.ExActivity));
    });
};

/**
 * 领取精彩活动
 * @iface receive
 * @args {activityId:"活动id",index:"栏目项"}
 * @param args
 * @param session
 * @param next
 * @returns [ds.UserEntity]
 */
proto.f = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_activity_receive_args;
    var activityId = args[argsKeys.activityId];
    var index = args[argsKeys.index];
    activityBiz.receive(client, userId, activityId, index,function(err,data){
        if(err) return next(null, wrapResult(err));
        var costDiamond = data[1];
        var getDiamond = data[2];
        if(costDiamond>0){
            gameRecordSerial.add(userId,function(cb1){
                gameRecordBiz.setCostDiamondRecord1(client,userId,c_prop.diamondCostTypeKey.activity,costDiamond,cb1);
            });
        }
        if(getDiamond>0){
            gameRecordSerial.add(userId,function(cb1){
                gameRecordBiz.setDiamondRecord1(client,userId,c_prop.diamondGetTypeKey.activity,getDiamond,cb1);
            });
        }
        var userData = data[0];
        propUtils.delProp(userData,["record"]);
        var exData = new ds.ExActivityData();
        exData.userData = userData;
        exData.bagItems = data[3];
        exData.equipBagItems = data[4];
        exData.lotteryItemsArr = data[5];
        exData.luckyTalosItemArr = data[6];
        exData.exItem = data[7];
        exData.getGold = data[8];
        next(null, wrapResult(null,exData,dsNameConsts.ExActivityData));
    });
};


/**
 * 获取是否需要操作，即前端所谓的红点，注意：外面的大红点的id为-1
 * @iface getIsNeedOperate
 * @args
 * @isWorker 1
 * @param args
 * @param session
 * @param next
 * @returns {"活动id":"是否需要操作(0|1)",.....}
 */
proto.h = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    activityBiz.getIsNeedOperate(client, userId, function(err,data){
        if(err) return next(null, wrapResult(err));
        next(null, wrapResult(null,data));
    });
};

/**
 * 补签
 * @iface patchSign
 * @args {activityId:"活动id"}
 * @isWorker 1
 * @param args
 * @param session
 * @param next
 * @returns [ds.UserEntity]
 */
proto.i = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_activity_receive_args;
    var activityId = args[argsKeys.activityId];
    activityBiz.patchSign(client,activityId,userId,function(err,data){
        if (err) return next(null,wrapResult(err));
        var ex = new ds.ExUserData();
        ex.userData = data[0];
        ex.gold = data[1];
        ex.bagItems = data[3];
        ex.equipBagItems = data[4];
        var getDiamond = data[2];
        var costDiamond = data[5];
        if(getDiamond>0){
            gameRecordSerial.add(userId,function(cb1){
                gameRecordBiz.setDiamondRecord1(client,userId,c_prop.diamondGetTypeKey.activity,getDiamond,cb1);
            });
        }
        if(costDiamond>0){
            gameRecordSerial.add(userId,function(cb1){
                gameRecordBiz.setCostDiamondRecord1(client,userId,c_prop.diamondCostTypeKey.patchSign,costDiamond,cb1);
            });
        }
        next(null,wrapResult(null,ex,dsNameConsts.ExUserData));
    });
};

/**
 * 上报用户调研数据
 * @iface report
 * @args {activityId:"活动id",report:"上报数据"}
 * @isWorker 1
 * @param args
 * @param session
 * @param next
 * @returns [ds.UserEntity]
 */
proto.j = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_activity_report_args;
    var activityId = args[argsKeys.activityId];
    var report = args[argsKeys.report];
    activityBiz.report(client,activityId,userId,report, function(err,data){
        if (err) return next(null,wrapResult(err));
        next(null, wrapResult(null,data));
    });
};
