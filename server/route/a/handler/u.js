/**
 * Created by Administrator on 2015/5/23.
 */

var wrapResult = require('uw-utils').wrapResultFunc(__filename);
var propUtils = require('uw-utils').propUtils;
var consts = require("uw-data").consts;
var c_prop = require("uw-data").c_prop;
var dsNameConsts = require("uw-data").dsNameConsts;
var iface = require("uw-data").iface;
var userDao = require("uw-user").userDao;
var userBiz = require("uw-user").userBiz;
var eventBiz = require("uw-event").eventBiz;
var ds = require("uw-ds").ds;
var arenaRecordBiz = require("uw-arena-record").arenaRecordBiz;
var mainClient = require("uw-db").mainClient;
var uwClient = require("uw-db").uwClient;
var gameRecordBiz = require("uw-game-record").gameRecordBiz;
var gameRecordSerial = require("uw-serial").gameRecordSerial;
var chatBiz = require("uw-chat").chatBiz;
var g_chat = require("uw-global").g_chat;

var proto = module.exports;

/**
 * 获取用户信息
 * @iface getInfo
 * @args
 * @param args
 * @param session
 * @param next
 */
proto.a = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    //接口调用
    userBiz.getInfo(uwClient,userId,function(err,data){
        if(err) return next(null,wrapResult(err));
        next(null,wrapResult(null,propUtils.delProp(data,["record"]),dsNameConsts.UserEntity));
    });
};

/**
 * 改名
 * @iface changeName
 * @args {name:"名字",heroTempId:"模板id "}
 * @param args
 * @param session
 * @param next
 * @returns ds.ExUserData
 */
proto.b = function (args, session, next) {
    var argsKeys = iface.a_user_changeName_args;
    var userId = session.get(consts.session.userId);
    var name = args[argsKeys.name];
    var heroTempId = args[argsKeys.heroTempId]||1;
    //接口调用
    userBiz.changeName(uwClient,name,heroTempId,userId,function(err,data){
        if (err) return next(null,wrapResult(err));
        var exData = new ds.ExUserData();
        exData.userData = data[0];
        exData.heroData = data[1];
        next(null,wrapResult(null,exData,dsNameConsts.ExUserData));
    });
};

/**
 * 升级
 * @iface upLvl
 * @args
 * @param args
 * @param session
 * @param next
 * @returns ds.ExUserData
 */
proto.c = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    //接口调用
    userBiz.upLvl(uwClient,userId,function(err,data){
        if (err) return next(null,wrapResult(err));
        var userData = data[0];
        var costGold = data[1];
        var costDiamond = data[2];
        if(costGold>0){
            gameRecordSerial.add(userId,function(cb1){
                gameRecordBiz.setCostGoldRecord(uwClient,userId,c_prop.goldCostTypeKey.upLvl,costGold,cb1);
            });
        }
        if(costDiamond>0){
            gameRecordSerial.add(userId,function(cb1){
                gameRecordBiz.setCostDiamondRecord(uwClient,userId,c_prop.diamondCostTypeKey.upLvl,costDiamond,cb1);
            });
        }
        eventBiz.randomEvent(uwClient,userId,userData.lvl,c_prop.randomCfg1Key.updateFinish,function(err,eventData){
            if (err) return next(null,wrapResult(err));
            var exData = new ds.ExUserData();
            exData.userData = propUtils.delProp(userData,["record"]);
            exData.eventData = eventData;
            next(null,wrapResult(null,exData,dsNameConsts.ExUserData));
        });
    })
};

/**
 * 同步信息
 * @iface syncData
 * @args {sendData:"战斗数据是数组[最新聊天id]"}
 * @param args
 * @param session
 * @param next
 * @returns ds.AsyncData
 */
proto.f = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_user_syncData_args;
    var sendData = args[argsKeys.sendData];

    //接口调用
    userBiz.syncData(uwClient,sendData,userId,function(err,data){
        if (err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data,dsNameConsts.AsyncData));
    });
};

/**
 * 同步信息2
 * @iface syncData2
 * @args
 * @isWorker 1
 * @param args
 * @param session
 * @param next
 * @returns ds.AsyncData2
 */
proto.f1 = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    //接口调用
    userBiz.syncData2(uwClient,userId,function(err,data){
        if (err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data,dsNameConsts.AsyncData2));
    });
};

/**
 * 打开背包宝箱
 * @iface getBagChest
 * @args {chestId:"宝箱id",count:"宝箱数量"}
 * @isWorker 1
 * @param args
 * @param session
 * @param next
 */
proto.g = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_user_getBagChest_args;
    var chestId = args[argsKeys.chestId];
    var count = args[argsKeys.count];
    //接口调用
    userBiz.getBagChest(uwClient,userId,chestId,count,function(err,data){
        if (err) return next(null,wrapResult(err));
        var getDiamond = data[6];
        if(getDiamond>0){
            gameRecordSerial.add(userId,function(cb1){
                gameRecordBiz.setDiamondRecord1(uwClient,userId,c_prop.diamondGetTypeKey.openChest,getDiamond,cb1);
            });
        }
        var exUserData = new ds.ExUserData();
        exUserData.userData = data[0];
        exUserData.isMail = data[1];
        exUserData.bagItems = data[2];
        exUserData.delBagItems = data[3];
        exUserData.equipBagItems = data[4];
        exUserData.expc = data[5];
        exUserData.rebirthExp = data[7];
        exUserData.genuineQi = data[8];
        exUserData.wingExp = data[9];
        next(null,wrapResult(null,exUserData,dsNameConsts.ExUserData));
    });
};

/**
 * 购买金币
 * @iface buyGold
 * @args
 * @isWorker 1
 * @param args
 * @param session
 * @param next
 * @returns ds.ExUserData
 */
proto.d = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    userBiz.buyGold(uwClient,userId,function(err,data){
        if(err) return next(null, wrapResult(err));
        //任务接口调用
        //taskMgr.handle(iface.a_user_buyGold, session);
        var costDiamond = data[2];
        if(costDiamond>0){
            gameRecordSerial.add(userId,function(cb1){
                gameRecordBiz.setCostDiamondRecord1(uwClient,userId,c_prop.diamondCostTypeKey.buyGold,costDiamond,cb1);
            });
        }
        var exUserData = new ds.ExUserData();
        exUserData.userData = data[0];
        exUserData.buyGoldResultArr = data[1];
        next(null, wrapResult(null,exUserData,dsNameConsts.ExUserData));
    });
};

/**
 * 购买凌云石
 * @iface buyLingyun
 * @args
 * @isWorker 1
 * @param args
 * @param session
 * @param next
 * @returns ds.ExUserData
 */
proto.d1 = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    userBiz.buyLingyun(uwClient,userId,function(err,data){
        if(err) return next(null, wrapResult(err));
        //任务接口调用
        //taskMgr.handle(iface.a_user_buyGold, session);
        var costDiamond = data[1];
        if(costDiamond>0){
            gameRecordSerial.add(userId,function(cb1){
                gameRecordBiz.setCostDiamondRecord1(uwClient,userId,c_prop.diamondCostTypeKey.buyLingyun,costDiamond,cb1);
            });
        }
        var exUserData = new ds.ExUserData();
        exUserData.userData = data[0];
        exUserData.bagItems = data[2];
        next(null, wrapResult(null,exUserData,dsNameConsts.ExUserData));
    });
};

/**
 * 红点提示
 * @iface getRedPoint
 * @args
 * @param args
 * @param session
 * @param next
 */
proto.h = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    //接口调用
    userBiz.getRedPoint(uwClient,userId,function(err,data){
        if (err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data));
    })
};

/**
 * 更新引导
 * @iface updateGuide
 * @args  {guideId:"引导id"}
 * @isWorker 1
 * @param args
 * @param session
 * @param next
 */
proto.i = function (args, session, next) {
    var argsKeys = iface.a_user_updateGuide_args;
    var userId = session.get(consts.session.userId);
    var guideId = args[argsKeys.guideId];
    //接口调用
    userBiz.updateGuide(uwClient,userId,guideId,function(err,data){
        if (err) return next(null,wrapResult(err));
        next(null,wrapResult(null,propUtils.delProp(data,["record"]),dsNameConsts.UserEntity));
    });
};

/**
 * 获取掠夺小弟记录
 * @iface getWinRecord
 * @args
 * @param args
 * @param session
 * @param next
 * @returns [ds.HeroChangeRecord]
 */
proto.j = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    //接口调用
    arenaRecordBiz.getWinRecord(uwClient,userId,function(err,data){
        if (err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data,dsNameConsts.HeroChangeRecord));
    });
};

/**
 * 获取被抢小弟记录
 * @iface getLoseRecord
 * @args
 * @param args
 * @param session
 * @param next
 * @returns [ds.HeroChangeRecord]
 */
proto.k = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    //接口调用
    arenaRecordBiz.getLoseRecord(uwClient,userId,function(err,data){
        if (err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data,dsNameConsts.HeroChangeRecord));
    });
};

/**
 * 购买金币
 * @iface buyToUpLvl
 * @args
 * @isWorker 1
 * @param args
 * @param session
 * @param next
 */
proto.m = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    //接口调用
    userBiz.buyToUpLvl(uwClient,userId,function(err,data){
        if (err) return next(null,wrapResult(err));
        var userData = data[0];
        var costDiamond = data[1];
        if(costDiamond>0){
            gameRecordSerial.add(userId,function(cb1){
                gameRecordBiz.setCostDiamondRecord1(uwClient,userId,c_prop.diamondCostTypeKey.buyGold,costDiamond,cb1);
            });
        }
        next(null,wrapResult(null,propUtils.delProp(userData,["record"]),dsNameConsts.UserEntity));
    });
};

/**
 * 保存桌面成功
 * @iface saveDeskSuccess
 * @args {type:"c_prop.userRecordTypeKey"}
 * @isWorker 1
 * @param args
 * @param session
 * @param next
 */
proto.o = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_user_saveDeskSuccess_args;
    var type = args[argsKeys.type];
    //接口调用
    userBiz.saveDeskSuccess(uwClient,userId,type,function(err,data){
        if (err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data,dsNameConsts.UserEntity));
    });
};

/**
 * 设置布阵
 * @iface setHeroEmbattle
 * @args {heroEmbattle:"布阵信息"}
 * @param args
 * @param session
 * @param next
 */
proto.p = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_user_setHeroEmbattle_args;
    var heroEmbattle = args[argsKeys.heroEmbattle];
    //接口调用
    userDao.update(uwClient,{heroEmbattle:heroEmbattle},{id:userId},function(err,data){
        if (err) return next(null,wrapResult(err));
        next(null,wrapResult(null,null));
    });
};

/**
 * 购买背包格子
 * @iface buyBagGrid
 * @args
 * @isWorker 1
 * @param args
 * @param session
 * @param next
 */
proto.q = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    //接口调用
    userBiz.buyBagGrid(uwClient,userId,function(err,data){
        if (err) return next(null,wrapResult(err));
        var userData = data[0];
        var costDiamond = data[1];
        if(costDiamond>0){
            gameRecordSerial.add(userId,function(cb1){
                gameRecordBiz.setCostDiamondRecord1(uwClient,userId,c_prop.diamondCostTypeKey.buyBagGrid,costDiamond,cb1);
            });
        }
        next(null,wrapResult(null,userData,dsNameConsts.UserEntity));
    });
};

/**
 * 更新战斗力
 * @iface updateCombat
 * @args
 * @param args
 * @param session
 * @param next
 */
proto.q1 = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    //接口调用
    userBiz.updateCombat(uwClient,userId,function(err,data){
        next(null,wrapResult(null,null));
    });
};

/**
 * 设置自动战斗
 * @iface setAutoFight
 * @args {isAuto:"是否自动"}
 * @isWorker 1
 * @param args
 * @param session
 * @param next
 */
proto.q2 = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_user_setAutoFight_args;
    var isAuto = args[argsKeys.isAuto];
    //接口调用
    userBiz.setAutoFight(uwClient,userId,isAuto,function(err,data){
        next(null,wrapResult(null,null));
    });
};

/**
 * 设置报错次数
 * @iface setTimeError
 * @args {errorNum:"异常次数"}
 * @isWorker 1
 * @param args
 * @param session
 * @param next
 */
proto.q3 = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_user_setTimeError_args;
    var errorNum = args[argsKeys.errorNum];
    //接口调用
    userBiz.setTimeError(uwClient,userId,errorNum,function(err,data){
        next(null,wrapResult(null,null));
    });
};

/**
 * 设置杀戮排名挑战
 * @iface setTodayRankWin
 * @args {eid:"对手userId"}
 * @isWorker 1
 * @param args
 * @param session
 * @param next
 */
proto.q4 = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_user_setTodayRankWin_args;
    var eid = args[argsKeys.eid];
    //接口调用
    userBiz.setTodayRankWin(uwClient,userId,eid,function(err,data){
        next(null,wrapResult(null,null));
    });
};

/**
 * 获取战印榜
 * @iface getWarPrintedList
 * @args
 * @param args
 * @param session
 * @param next
 */
proto.q5 = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    //接口调用
    userBiz.getWarPrintedList(uwClient,userId,function(err,data){
        if (err) return next(null,wrapResult(err));
        var exWarPrintedData = new ds.ExWarPrintedData();
        exWarPrintedData.medalData = data[0];
        exWarPrintedData.isUpdata = data[1];
        exWarPrintedData.delBagItems = data[2];
        next(null,wrapResult(null,exWarPrintedData,dsNameConsts.ExWarPrintedData));
    });
};

/**
 * 战印强化
 * @iface warPrintedStrength
 * @args {warPrintedId:"战印id"}
 * @param args
 * @param session
 * @param next
 */
proto.q6 = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_user_warPrintedStrength_args;
    var warPrintedId = args[argsKeys.warPrintedId];
    //接口调用
    userBiz.warPrintedStrength(uwClient,userId,warPrintedId,function(err,data){
        if (err) return next(null,wrapResult(err));
        var exWarPrintedData = new ds.ExWarPrintedData();
        exWarPrintedData.medalData = data[0];
        exWarPrintedData.delBagItems = data[1];
        next(null,wrapResult(null,exWarPrintedData,dsNameConsts.ExWarPrintedData));
    });
};

/**
 * 修改战印榜
 * @iface setMedalTitle
 * @args {warPrintedId:"战印id"}
 * @param args
 * @param session
 * @param next
 */
proto.q7 = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_user_setMedalTitle_args;
    var warPrintedId = args[argsKeys.warPrintedId];
    //接口调用
    userBiz.setMedalTitle(uwClient,userId,warPrintedId,function(err,data){
        if (err) return next(null,wrapResult(err));
        var exWarPrintedData = new ds.ExWarPrintedData();
        exWarPrintedData.medalTitle = data[0];
        next(null,wrapResult(null,exWarPrintedData,dsNameConsts.ExWarPrintedData));
    });
};

/**
 * 获取真气数据
 * @iface getGenuineQi
 * @args
 * @param args
 * @param session
 * @param next
 */
proto.q8 = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    //接口调用
    userBiz.getGenuineQi(uwClient,userId,function(err,data){
        if (err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data,dsNameConsts.UserEntity));
    });
};

/**
 * 激活战印
 * @iface activeMedal
 * @args {warPrintedId:"战印id"}
 * @param args
 * @param session
 * @param next
 */
proto.q9 = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_user_activeMedal_args;
    var warPrintedId = args[argsKeys.warPrintedId];
    //接口调用
    userBiz.activeMedal(uwClient,userId,warPrintedId,function(err,data){
        if (err) return next(null,wrapResult(err));
        var exWarPrintedData = new ds.ExWarPrintedData();
        exWarPrintedData.medalData = data[0];
        exWarPrintedData.delBagItems = data[1];
        next(null,wrapResult(null,exWarPrintedData,dsNameConsts.ExWarPrintedData));
    });
};

/**
 * 获取绑定手机url
 *@iface getBindPhoneUrl
 * @args
 * @param args
 * @param session
 * @param next
 * @return string url
 */
proto.r = function(args, session, next) {
    var accountId = session.get(consts.session.accountId);
    userBiz.getBindPhoneUrl(mainClient, accountId, function(err, data){
       if (err) return next(null, wrapResult(err));
        var url = data.bindurl || "";
        next(null,wrapResult(null,url));
    });
};


/**
 * 领取玩吧礼包
 *@iface getWanbagift
 * @args {os:"ios", giftId:"901"}
 * @param args
 * @param session
 * @param next
 */
proto.s = function(args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_user_getWanbagift_args;
    var os = args[argsKeys.os];
    var giftId = args[argsKeys.giftId];
    //接口调用
    userBiz.getWanbaGift(uwClient,userId,os,giftId,function(err,data){
        if (err) return next(null,wrapResult(err));
        var ex = new ds.WanbaGift;
        ex.code = data[0];
        ex.message = data[1];
        ex.userData = data[2];
        ex.bagItems = data[5];
        ex.equipBagItems = data[6];
        /*
        var getDiamond = data[4];
        if(getDiamond>0){
            gameRecordSerial.add(userId,function(cb1){
                gameRecordBiz.setDiamondRecord1(uwClient,userId,c_prop.diamondGetTypeKey.mail,getDiamond,cb1);
            });
        }*/
        next(null,wrapResult(null,ex, dsNameConsts.WanbaGift));
    });
};

/**
 * 更新设置数据
 *@iface updateSetting
 * @args {catNoVipChat:"true", autoBuyLittleHorn:"true"}
 * @param args
 * @param session
 * @param next
 */
proto.t = function(args, session, next){
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_user_updateSetting_args;
    var catNoVipChat = args[argsKeys.catNoVipChat];
    var autoBuyLittleHorn = args[argsKeys.autoBuyLittleHorn];
    userBiz.updateSetting(uwClient, userId, catNoVipChat, autoBuyLittleHorn, function(err, userData){
        if(err) return next(null, wrapResult(err));
       next(null, wrapResult(null, userData, dsNameConsts.userData));
    });
};

/**
 * 更新背包某样物品
 *@iface updateItems4Bag
 * @args {itemId:"itemId"}
 * @param args
 * @param session
 * @param next
 */
proto.u = function(args, session, next){
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_user_updateItems4Bag_args;
    var itemId = args[argsKeys.itemId];
    userBiz.updateItems4Bag(uwClient, userId, itemId, function(err, data){
       if(err) return  next(null, wrapResult(err));
        next(null,wrapResult(null,data));
    });
};
