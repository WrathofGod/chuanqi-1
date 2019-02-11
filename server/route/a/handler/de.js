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
var demonLotusBiz = require("uw-demon-lotus").demonLotusBiz;
var gameRecordBiz = require("uw-game-record").gameRecordBiz;
var gameRecordSerial = require("uw-serial").gameRecordSerial;
var taskBiz = require("uw-task").taskBiz;

var proto = module.exports;

/**
 * 获取聚灵妖莲数据
 * @iface getInfo
 * @args
 * @param args
 * @param session
 * @param next
 */
proto.a = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    //接口调用
    demonLotusBiz.getInfo(uwClient,userId,function(err,data){
        if(err) return next(null,wrapResult(err));
        var exDemonLotusData = new ds.ExDemonLotusData();
        exDemonLotusData.isWeek = data[0];
        exDemonLotusData.isMonth = data[1];
        exDemonLotusData.demonLotusData = data[2];
        exDemonLotusData.genuineQiArr = data[3];
        next(null,wrapResult(null,exDemonLotusData,dsNameConsts.ExDemonLotusData));
    });
};

/**
 * 升级聚灵妖莲
 * @iface upLotus
 * @args
 * @param args
 * @param session
 * @param next
 */
proto.b = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    //接口调用
    demonLotusBiz.upLotus(uwClient,userId,function(err,data){
        if(err) return next(null,wrapResult(err));
        var exDemonLotusData = new ds.ExDemonLotusData();
        exDemonLotusData.demonLotusData = data[0];
        exDemonLotusData.delBagItems = data[1];
        next(null,wrapResult(null,exDemonLotusData,dsNameConsts.ExDemonLotusData));
    });
};

/**
 * 领取收益
 * @iface getRevenue
 * @args
 * @param args
 * @param session
 * @param next
 */
proto.c = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    //接口调用
    demonLotusBiz.getRevenue(uwClient,userId,function(err,data){
        if(err) return next(null,wrapResult(err));
        var exDemonLotusData = new ds.ExDemonLotusData();
        exDemonLotusData.userData = data[0];
        exDemonLotusData.demonLotusData = data[1];
        exDemonLotusData.expSum = data[2];
        next(null,wrapResult(null,exDemonLotusData,dsNameConsts.ExDemonLotusData));
    });
};

/**
 * 开光
 * @iface opening
 * @args
 * @param args
 * @param session
 * @param next
 * @return ds.Opening
 */
proto.d = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    //接口调用
    demonLotusBiz.opening(uwClient,userId,function(err,data){
        if(err) return next(null,wrapResult(err));
        var costDiamond = data[0];
        if(costDiamond>0){
            gameRecordSerial.add(userId,function(cb1){
                gameRecordBiz.setCostDiamondRecord1(uwClient,userId,c_prop.diamondCostTypeKey.activity,costDiamond,cb1);
            });
        }
        var exData = new ds.Opening();
        exData.userData = data[1];
        exData.diffExp = data[2];
        next(null, wrapResult(null,exData,dsNameConsts.Opening));
    });
};

/**
 * 妖莲进阶
 * @iface lotusAdvance
 * @args
 * @param args
 * @param session
 * @param next
 */
proto.e = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    //接口调用
    demonLotusBiz.lotusAdvance(uwClient,userId,function(err,data){
        if(err) return next(null,wrapResult(err));
        var exDemonLotusData = new ds.ExDemonLotusData();
        exDemonLotusData.demonLotusData = data[0];
        exDemonLotusData.delBagItems = data[1];
        exDemonLotusData.isSucceed = data[2];
        next(null,wrapResult(null,exDemonLotusData,dsNameConsts.ExDemonLotusData));
    });
};

/**
 * 妖莲进阶
 * @iface treasureTrain
 * @args
 * @param args
 * @param session
 * @param next
 */
proto.f = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    //接口调用
    demonLotusBiz.treasureTrain(uwClient,userId,function(err,data){
        if(err) return next(null,wrapResult(err));
        var exDemonLotusData = new ds.ExDemonLotusData();
        exDemonLotusData.demonLotusData = data[0];
        exDemonLotusData.userData = data[1];
        exDemonLotusData.delBagItems = data[2];
        exDemonLotusData.isSucceed = data[3];
        exDemonLotusData.genuineQiArr = data[4];
        next(null,wrapResult(null,exDemonLotusData,dsNameConsts.ExDemonLotusData));
    });
};