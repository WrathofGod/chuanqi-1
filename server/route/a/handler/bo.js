/**
 * Created by Sara on 2015/5/28.
 */

var wrapResult = require('uw-utils').wrapResultFunc(__filename);
var propUtils = require('uw-utils').propUtils;
var commonUtils = require('uw-utils').commonUtils;
var md5Utils = require('uw-utils').md5Utils;
var consts = require("uw-data").consts;
var dsNameConsts = require("uw-data").dsNameConsts;
var iface = require("uw-data").iface;
var bossBiz = require("uw-boss").bossBiz;
var uwClient = require("uw-db").uwClient;
var ds = require("uw-ds").ds;
var c_prop = require("uw-data").c_prop;
var gameRecordBiz = require("uw-game-record").gameRecordBiz;
var gameRecordSerial = require("uw-serial").gameRecordSerial;
var bossSerial =  require('uw-serial').bossSerial;

var proto = module.exports;

/**
 * 获取行会boss列表
 * @iface getGuildBossList
 * @args
 * @param args
 * @param session
 * @param next
 * @returns ds.BossEntity
 */
proto.a = function (args, session, next) {
    //接口调用
    bossBiz.getGuildBossList(uwClient ,function(err,data){
        if(err) return next(null,wrapResult(err));
        var exBossEntity = new ds.ExBossEntity();
        exBossEntity.bossList = data[0];
        exBossEntity.otherData = data[1];
        next(null,wrapResult(null, exBossEntity, dsNameConsts.ExBossEntity));
    });
};

/**
 * 获取世界boss列表
 * @iface getWorldBossList
 * @args
 * @param args
 * @param session
 * @param next
 * @returns ds.BossEntity
 */
proto.a1 = function (args, session, next) {
    //接口调用
    bossBiz.getWorldBossList(uwClient ,function(err,data){
        if(err) return next(null,wrapResult(err));
        var exBossEntity = new ds.ExBossEntity();
        exBossEntity.bossList = data[0];
        exBossEntity.otherData = data[1];
        exBossEntity.nowDate = Date.now();
        next(null,wrapResult(null, exBossEntity, dsNameConsts.ExBossEntity));
    });
};

/**
 * 开启boss
 * @iface openBoss
 * @args {bossId:"bossId",isLock:"是否上锁"}
 * @param args
 * @param session
 * @param next
 */
proto.b1 = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_boss_openBoss_args;
    var bossId = args[argsKeys.bossId];
    var isLock = args[argsKeys.isLock];
    bossSerial.add("boss"+bossId,function(cb1){
        //接口调用
        bossBiz.openBoss(uwClient,userId ,bossId ,isLock,function(err,data){
            cb1();
            if(err) return next(null,wrapResult(err));
            var bossEntity = data[0];
            var userData = data[1];
            var costDiamond = data[2];
            var delItems = data[3];
            if(costDiamond>0){
                gameRecordSerial.add(userId,function(cb2){
                    gameRecordBiz.setCostDiamondRecord(uwClient,userId,c_prop.diamondCostTypeKey.openBoss,costDiamond,cb2);
                });
            }
            var exBossData = new ds.ExBossData();
            exBossData.userData = userData;
            exBossData.bossEntity = bossEntity;
            exBossData.delBagItems = delItems;
            next(null,wrapResult(null,exBossData,dsNameConsts.ExBossData));
        });
    });

};

/**
 * 进入boss系统
 * @iface enter
 * @args {bossId:"bossId"}
 * @param args
 * @param session
 * @param next
 * @returns ds.BossData
 */
proto.b = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_boss_enter_args;
    var bossId = args[argsKeys.bossId];
    //接口调用
    bossBiz.enter(uwClient,userId ,bossId,function(err,data){
        if(err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data,dsNameConsts.BossData));
    });
};

/**
 * 开始战斗
 * @iface startFight
 * @args {bossId:"bossId"}
 * @param args
 * @param session
 * @param next
 * @returns ds.ExBossData
 */
proto.c = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_boss_startFight_args;
    var bossId = args[argsKeys.bossId];

    //接口调用
    bossBiz.startFight(uwClient,userId ,bossId,function(err,data){
        if(err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data,dsNameConsts.ExBossData));
    });
};

/**
 * 造成伤害
 * @iface hurt
 * @args {bossId:"bossId",hurtDic:"{英雄id：伤害}",isEnd:"是否最后",mData:"加密",hurtArr:"伤害长度，用于验证"}
 * @param args
 * @param session
 * @param next
 * @returns ds.ExTreasureBossData
 */
proto.d = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_boss_hurt_args;
    var hurtDic = args[argsKeys.hurtDic];
    var isEnd = args[argsKeys.isEnd];
    var mData = args[argsKeys.mData];
    var bossId = args[argsKeys.bossId];
    var hurtArr = args[argsKeys.hurtArr];
    //接口调用
    bossBiz.hurt(uwClient,userId ,bossId,hurtDic,isEnd,mData,hurtArr,function(err,data){
        if(err) return next(null,wrapResult(err));
        var exData = new ds.ExTreasureBossData();
        exData.bossData = data[0];
        exData.bagItem  = data[1];
        next(null,wrapResult(null,exData,dsNameConsts.ExTreasureBossData));
    });
};

/**
 * 退出战斗
 * @iface exitFight
 * @args {bossId:"bossId"}
 * @param args
 * @param session
 * @param next
 * @returns ds.ExUserData
 */
proto.e = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_boss_exitFight_args;
    var bossId = args[argsKeys.bossId];
    //接口调用
    bossBiz.exitFight(uwClient,userId , bossId ,function(err,data){
        if(err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data,dsNameConsts.BossData));
    });
};

/**
 * 清除退出cd
 * @iface clearFightCd
 * @args
 * @param args
 * @param session
 * @param next
 * @returns ds.UserEntity
 */
proto.e1 = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    //接口调用
    bossBiz.clearFightCd(uwClient,userId ,function(err,data){
        if(err) return next(null,wrapResult(err));
        var userData = data[0];
        var costDiamond = data[1];
        if(costDiamond>0){
            gameRecordSerial.add(userId,function(cb1){
                gameRecordBiz.setCostDiamondRecord(uwClient,userId,c_prop.diamondCostTypeKey.clearBossCd,costDiamond,cb1);
            });
        }
        next(null,wrapResult(null,userData,dsNameConsts.UserEntity));
    });
};

/**
 * 鼓舞
 * @iface inspire
 * @args {bossId:"bossId"}
 * @param args
 * @param session
 * @param next
 * @returns ds.ExBossData
 */
proto.f = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_boss_inspire_args;
    var bossId = args[argsKeys.bossId];

    //接口调用
    bossBiz.inspire(uwClient,userId ,bossId, function(err,data){
        if(err) return next(null,wrapResult(err));
        var userData = data[0];
        var bossData = data[1];
        var costDiamond = data[2];
        if(costDiamond>0){
            gameRecordSerial.add(userId,function(cb1){
                gameRecordBiz.setCostDiamondRecord(uwClient,userId,c_prop.diamondCostTypeKey.inspire,costDiamond,cb1);
            });
        }
        var exBossData = new ds.ExBossData();
        exBossData.userData = userData;
        exBossData.bossData = bossData;
        next(null,wrapResult(null,exBossData,dsNameConsts.ExBossData));
    });
};

/**
 * 获取鼓舞记录列表
 * @iface getInspireRecordArr
 * @args {bossId:"bossId"}
 * @param args
 * @param session
 * @param next
 * @returns [名字,....]
 */
proto.g = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_boss_getInspireRecordArr_args;
    var bossId = args[argsKeys.bossId];

    //接口调用
    bossBiz.getInspireRecordArr(uwClient,userId ,bossId ,function(err,data){
        if(err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data));
    });
};

/**
 * 同步鼓舞
 * @iface syncInspire
 * @args {bossId:"bossId"}
 * @param args
 * @param session
 * @param next
 * @returns ds.BossData
 */
proto.h = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_boss_syncInspire_args;
    var bossId = args[argsKeys.bossId];
    //接口调用
    bossBiz.syncInspire(uwClient,userId ,bossId, function(err,data){
        if(err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data,dsNameConsts.BossData));
    });
};

/**
 * 获取前20伤害排名
 * @iface getHurtRankList
 * @args {bossId:"bossId"}
 * @param args
 * @param session
 * @param next
 */
proto.i = function (args, session, next) {
    var argsKeys = iface.a_boss_getHurtRankList_args;
    var bossId = args[argsKeys.bossId];
    //接口调用
    var rankList = bossBiz.getHurtRankList(bossId);
    next(null,wrapResult(null,rankList,dsNameConsts.BossHurtRank));
};

/**
 * 获取第一名
 * @iface getFirstHurtRank
 * @args {bossId:"bossId"}
 * @param args
 * @param session
 * @param next
 */
proto.i1 = function (args, session, next) {
    var argsKeys = iface.a_boss_getFirstHurtRank_args;
    var bossId = args[argsKeys.bossId];
    //接口调用
    var rankData = bossBiz.getFirstHurtRank(bossId);
    next(null,wrapResult(null,rankData,dsNameConsts.BossHurtRank));
};

/**
 * 获取boss战斗结果
 * @iface getBossResult
 * @args {bossId:"bossId",originBossId:"originBossId"}
 * @param args
 * @param session
 * @param next
 */
proto.j = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_boss_getBossResult_args;
    var bossId = args[argsKeys.bossId];
    var originBossId = args[argsKeys.originBossId];
    //接口调用
    bossBiz.getBossResult(uwClient ,userId,bossId ,originBossId, function(err,data){
        if(err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data,dsNameConsts.BossResult));
    });
};

/**
 * 获取boss结果
 * @iface getResultData
 * @args {originBossId:"originBossId"}
 * @param args
 * @param session
 * @param next
 */
proto.j1 = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_boss_getResultData_args;
    var originBossId = args[argsKeys.originBossId];
    //接口调用
    bossBiz.getResultData(uwClient ,userId,originBossId , function(err,data){
        if(err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data,dsNameConsts.BossResultData));
    });
};
