/**
 * Created by Administrator on 2016/7/6.
 */
var wrapResult = require('uw-utils').wrapResultFunc(__filename);
var propUtils = require('uw-utils').propUtils;
var consts = require("uw-data").consts;
var c_prop = require("uw-data").c_prop;
var dsNameConsts = require("uw-data").dsNameConsts;
var iface = require("uw-data").iface;
var ds = require("uw-ds").ds;
var uwClient = require("uw-db").uwClient;
var proto = module.exports;

var expeditionBiz = require("uw-expedition").expeditionBiz;


/**
 * ��ȡ������Ϣ
 * @iface getInfo
 * @args
 * @param args
 * @param session
 * @param next
 */
proto.a = function(args,session,next) {
    var userId = session.get(consts.session.userId);
    expeditionBiz.getInfo(uwClient, userId, function (err, data) {
        if (err) return next(null, wrapResult(err));
        var expeditionData = new ds.ExpeditionData();
        expeditionData.expData = data[0]
        expeditionData.expHeroData = data[1];
        next(null,wrapResult(null,expeditionData,dsNameConsts.ExpeditionData));
    });
}

/**
 * ��ԪӤ
 * @iface wearSoul
 * @args {tempId:"ģ��id",soulId:"ԪӤid"}
 * @param args
 * @param session
 * @param next
 * @returns ds.ExpeditionData
 */
proto.b = function(args,session,next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_expedition_wearSoul_args;
    var tempId = args[argsKeys.tempId];
    var soulId = args[argsKeys.soulId];
    expeditionBiz.wearSoul(uwClient, userId, tempId, soulId,function (err, data) {
        if (err) return next(null, wrapResult(err));
        var expeditionData = new ds.ExpeditionData();
        expeditionData.expData = data[0];
        expeditionData.expHeroData = data[1];
        next(null,wrapResult(null,expeditionData,dsNameConsts.ExpeditionData));
    });
}

/**
 * ս����ʼ
 * @iface startBattle
 * @args {stageId:"�ؿ�id"}
 * @param args
 * @param session
 * @param next
 * @returns ds.ExpeditionData
 */
proto.c = function(args,session,next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_expedition_startBattle_args;
    var stageId = args[argsKeys.stageId];
    expeditionBiz.startBattle(uwClient, userId, stageId,function (err, data) {
        if (err) return next(null, wrapResult(err));
        var expeditionData = new ds.ExpeditionData();
        expeditionData.expData = data[0];
        expeditionData.expHeroData = data[1];
        next(null,wrapResult(null,expeditionData,dsNameConsts.ExpeditionData));
    });
}

/**
 * ս������
 * @iface endBattle
 * @args {isWin:"�Ƿ�ʤ��",herosHp:"ʣ��Ѫ��"}
 * @param args
 * @param session
 * @param next
 * @returns ds.ExpeditionData
 */
proto.d = function(args,session,next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_expedition_endBattle_args;
    var isWin = args[argsKeys.isWin];
    var herosHp = args[argsKeys.herosHp];
    expeditionBiz.endBattle(uwClient, userId, stageId,function (err, data) {
        if (err) return next(null, wrapResult(err));
        var expeditionData = new ds.ExpeditionData();
        expeditionData.expData = data[0];
        expeditionData.expHeroData = data[1];
        expeditionData.finishData = data[2];
        expeditionData.finishLvl = data[3];
        next(null,wrapResult(null,expeditionData,dsNameConsts.ExpeditionData));
    });
}


///**
// * ս������
// * @iface buyBlackItem
// * @args {itemId:"��Ʒ��id"}
// * @param args
// * @param session
// * @param next
// * @returns ds.ExpeditionData
// */
//
//proto.e = function(args,session,next) {
//    var userId = session.get(consts.session.userId);
//    var argsKeys = iface.a_expedition_buyBlackItem_args;
//    var itemId = args[argsKeys.itemId];
//    expeditionBiz.buyBlackItem(uwClient, userId, itemId,function (err, data) {
//        if (err) return next(null, wrapResult(err));
//    });
//}