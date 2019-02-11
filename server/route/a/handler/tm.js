var wrapResult = require('uw-utils').wrapResultFunc(__filename);
var propUtils = require('uw-utils').propUtils;
var consts = require("uw-data").consts;
var c_prop = require("uw-data").c_prop;
var dsNameConsts = require("uw-data").dsNameConsts;
var iface = require("uw-data").iface;
var userDao = require("uw-user").userDao;
var equipBiz = require("uw-equip").equipBiz;
var ds = require("uw-ds").ds;
var uwClient = require("uw-db").uwClient;
var heroBiz = require("uw-hero").heroBiz;
var gameRecordSerial = require("uw-serial").gameRecordSerial;
var gameRecordBiz = require("uw-game-record").gameRecordBiz;
var heroTalismanBiz = require("uw-hero").heroTalismanBiz;
var proto = module.exports;


/**
 * 使用法宝道具
 * @iface useTrumpItem
 * @args    {itemId:"法宝id"}
 * @param args
 * @param session
 * @param next
 * @returns ds.ExUserData
 */
proto.a = function(args,session,next){
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_talisman_useTrumpItem_args;
    var itemId = args[argsKeys.itemId];
    //使用法宝道具
    heroTalismanBiz.useTrumpItem(uwClient,userId,itemId,function(err,data){
        if(err) next(null,wrapResult(err));
        var exData = new ds.ExUserData();
        exData.heroData = data[0]||[];
        exData.delBagItems = data[1];
        exData.userData = data[2];
        next(null,wrapResult(null,exData,dsNameConsts.ExUserData));
    })
};


/**
 * 穿戴装备
 * @iface wearTrump
 * @args    {tempId:"英雄id",trumpId:"法宝id"}
 * @param args
 * @param session
 * @param next
 * @returns ds.ExUserData
 */
proto.b = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_talisman_wearTrump_args;
    var tempId = args[argsKeys.tempId];
    var trumpId = args[argsKeys.trumpId];
    //穿戴装备
    heroTalismanBiz.changeTrump(uwClient,userId,tempId,trumpId,function(err,data){
        if (err) return next(null,wrapResult(err));
        var exData = new ds.ExUserData();
        exData.heroData = data[0];
        exData.delBagItems = data[1];
        next(null,wrapResult(null,exData,dsNameConsts.ExUserData));
    })
};

/**
 * 法宝升级
 * @iface upTrumpLvl
 * @args    {tempId:"英雄id",trumpId:"法宝id"}
 * @param args
 * @param session
 * @param next
 * @returns ds.ExUserData
 */
proto.c = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_talisman_upTrumpLvl_args;
    var tempId = args[argsKeys.tempId];
    var trumpId = args[argsKeys.trumpId];
    //法宝升级
    heroTalismanBiz.upTrumpLvl(uwClient,userId,tempId,trumpId,function(err,data){
        if (err) return next(null,wrapResult(err));
        var exData = new ds.ExUserData();
        exData.heroData = data[0];
        exData.delBagItems = data[1];
        next(null,wrapResult(null,exData,dsNameConsts.ExUserData));
    })
};

/**
 * 法宝升星
 * @iface upTrumpStar
 * @args    {tempId:"英雄id",trumpId:"法宝id"}
 * @param args
 * @param session
 * @param next
 * @returns ds.ExUserData
 */
proto.d = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_talisman_upTrumpStar_args;
    var tempId = args[argsKeys.tempId];
    var trumpId = args[argsKeys.trumpId];
    //法宝升星
    heroTalismanBiz.upTrumpStar(uwClient,userId,tempId,trumpId,function(err,data){
        if (err) return next(null,wrapResult(err));
        var exData = new ds.ExUserData();
        exData.heroData = data[0];
        exData.delBagItems = data[1];
        exData.isGetSkill = data[2];
        exData.userData = data[3];
        exData.isFull = data[4];
        next(null,wrapResult(null,exData,dsNameConsts.ExUserData));
    })
};

/**
 * 重铸法宝
 * @iface recastTrump
 * @args    {tempId:"英雄id",trumpId:"法宝id"}
 * @param args
 * @param session
 * @param next
 * @returns ds.ExUserData
 */
proto.e = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_talisman_recastTrump_args;
    var tempId = args[argsKeys.tempId];
    var trumpId = args[argsKeys.trumpId];
    //重铸法宝
    heroTalismanBiz.recastTrump(uwClient,userId,tempId,trumpId,function(err,data){
        if (err) return next(null,wrapResult(err));
        var exData = new ds.ExUserData();
        exData.heroData = data[0];
        exData.userData = data[1];
        exData.isGetSkill = data[2];
        next(null,wrapResult(null,exData,dsNameConsts.ExUserData));
    })
};

/**
 * 法宝合成
 * @iface compoundTrump
 * @args    {tempId:"英雄id",trumpId:"法宝id"}
 * @param args
 * @param session
 * @param next
 * @returns ds.ExUserData
 */
proto.f = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_talisman_compoundTrump_args;
    var tempId = args[argsKeys.tempId];
    var trumpId = args[argsKeys.trumpId];
    //接口调用
    heroTalismanBiz.compoundTrump(uwClient,userId,tempId,trumpId,function(err,data){
        if (err) return next(null,wrapResult(err));
        var exData = new ds.ExUserData();
        exData.heroData = data[0];
        exData.bagItems = data[1];
        next(null,wrapResult(null,exData,dsNameConsts.ExUserData));
    })
};
/**
 * 法宝洗炼
 * @iface baptizeTrump
 * @args    {tempId:"英雄id",trumpId:"法宝id",isCheck:"是否开启保险"}
 * @param args
 * @param session
 * @param next
 * @returns ds.ExUserData
 */
proto.g = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_talisman_baptizeTrump_args;
    var tempId = args[argsKeys.tempId];
    var trumpId = args[argsKeys.trumpId];
    var isCheck = args[argsKeys.isCheck];
    //法宝洗炼
    heroTalismanBiz.baptizeTrump(uwClient, userId, tempId, trumpId, isCheck,function (err, data) {
        if (err) return next(null, wrapResult(err));
        var costDiamond = data[3];
        if(costDiamond>0){
            gameRecordSerial.add(userId,function(cb1){
                gameRecordBiz.setCostDiamondRecord(uwClient,userId,c_prop.diamondCostTypeKey.baptizeTrump,costDiamond,cb1);
            });
        }
        var exData = new ds.ExUserData();
        exData.heroData = data[0];
        exData.delBagItems = data[1];
        exData.baptizeValue = data[2];
        next(null, wrapResult(null, exData, dsNameConsts.ExUserData));
    })
};

/**
 * 确认洗炼
 * @iface confirmBaptizeTrump
 * @args    {tempId:"英雄id",trumpId:"法宝id"}
 * @param args
 * @param session
 * @param next
 * @returns ds.ExUserData
 */
proto.h = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_talisman_confirmBaptizeTrump_args;
    var tempId = args[argsKeys.tempId];
    var trumpId = args[argsKeys.trumpId];
    //法宝确认洗炼
    heroTalismanBiz.confirmBaptizeTrump(uwClient, userId, tempId, trumpId, function (err, data) {
        if (err) return next(null, wrapResult(err));
        var exData = new ds.ExUserData();
        exData.heroData = data[0];
        next(null, wrapResult(null, exData, dsNameConsts.ExUserData));
    })
};

/**
 * 取消洗炼
 * @iface cancelBaptizeTrump
 * @args    {tempId:"英雄id",trumpId:"法宝id"}
 * @param args
 * @param session
 * @param next
 * @returns ds.ExUserData
 */
proto.i = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_talisman_cancelBaptizeTrump_args;
    var tempId = args[argsKeys.tempId];
    var trumpId = args[argsKeys.trumpId];
    //法宝确认洗炼
    heroTalismanBiz.cancelBaptizeTrump(uwClient, userId, tempId, trumpId, function (err, data) {
        if (err) return next(null, wrapResult(err));
        var exData = new ds.ExUserData();
        exData.heroData = data[0];
        next(null, wrapResult(null, exData, dsNameConsts.ExUserData));
    })
};
