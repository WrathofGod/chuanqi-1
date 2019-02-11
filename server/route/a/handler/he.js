/**
 * Created by Sara on 2015/5/28.
 */

var wrapResult = require('uw-utils').wrapResultFunc(__filename);
var propUtils = require('uw-utils').propUtils;
var consts = require("uw-data").consts;
var dsNameConsts = require("uw-data").dsNameConsts;
var iface = require("uw-data").iface;
var heroBiz = require("uw-hero").heroBiz;
var uwClient = require("uw-db").uwClient;
var ds = require("uw-ds").ds;
var c_prop = require("uw-data").c_prop;
var c_gem = require("uw-data").c_gem;
var gameRecordBiz = require("uw-game-record").gameRecordBiz;
var gameRecordSerial = require("uw-serial").gameRecordSerial;
var chatBiz = require("uw-chat").chatBiz;
var taskBiz = require("uw-task").taskBiz;

var proto = module.exports;

/**
 * 召唤英雄
 * @iface callHero
 * @args {tempId:"英雄模板id",sex:"性别"}
 * @param args
 * @param session
 * @param next
 * @returns ds.ExUserData
 */
proto.a = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_hero_callHero_args ;
    var tempId = args[argsKeys.tempId];
    var sex = args[argsKeys.sex];
    //接口调用
    heroBiz.callHero(uwClient,userId ,tempId ,sex,function(err,data){
        if(err) return next(null,wrapResult(err));
        //var exUserData = new ds.ExUserData();
        //exUserData.userData = data[0];
        //exUserData.heroData = data[1];
        //第一个%s：玩家名
        //第二个%s：角色个数
        var userName =  data[1];
        var heroNum =  data[2];
        //var costDiamond = data[4];

        //if(costDiamond>0 && costDiamond != 99999999){
        //    gameRecordSerial.add(userId,function(cb1){
        //        gameRecordBiz.setCostDiamondRecord(uwClient,userId,c_prop.diamondCostTypeKey.callHero,costDiamond,cb1);
        //    });
        //}
        chatBiz.addSysData(19,[userName,heroNum]);
        chatBiz.addSysData(77,[userName,heroNum]);
        chatBiz.addSysData(78,[userName,heroNum]);
        next(null,wrapResult(null,data[0],dsNameConsts.HeroEntity));

        taskBiz.setTaskValue(uwClient,userId,c_prop.cTaskTypeKey.clearHero,1,function() {});
    })
};

/**
 * 技能升级
 * @iface upSkill
 * @args {tempId:"英雄模板id",index:"技能下标"}
 * @param args
 * @param session
 * @param next
 * @returns ds.ExUserData
 */
proto.b = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_hero_upSkill_args ;
    var tempId = args[argsKeys.tempId];
    var index = args[argsKeys.index];
    //接口调用
    heroBiz.upSkill(uwClient,userId ,tempId,index ,function(err,data){
        if(err) return next(null,wrapResult(err));
        var costGold = data[2];
        gameRecordSerial.add(userId,function(cb1) {
            gameRecordBiz.setCostGoldRecord(uwClient, userId, c_prop.goldCostTypeKey.upSkill, costGold, cb1);
        });
        var skillLvl = data[1].skillLvlArr[index];
        var exUserData = new ds.ExUserData();
        exUserData.userData = data[0];
        exUserData.heroData = data[1];
        next(null,wrapResult(null,exUserData,dsNameConsts.ExUserData));

        taskBiz.setTaskValue(uwClient,userId,c_prop.cTaskTypeKey.skillLvl,skillLvl,function(){});
    });
};

/**
 * 清除技能CD
 * @iface clearSkillCd
 * @args
 * @param args
 * @param session
 * @param next
 */
proto.c = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    //接口调用
    heroBiz.clearSkillCd(uwClient,userId ,function(err,data){
        if(err) return next(null,wrapResult(err));
        var userData = data[0];
        var costDiamond = data[1];
        if(costDiamond>0){
            gameRecordSerial.add(userId,function(cb1){
                gameRecordBiz.setCostDiamondRecord(uwClient,userId,c_prop.diamondCostTypeKey.clearSkillCd,costDiamond,cb1);
            });
        }
        next(null,wrapResult(null,userData,dsNameConsts.UserEntity));
    })
};

/**
 * 装备符文块
 * @iface wearRune
 * @args {tempId:"英雄模板id",index:"技能下标"}
 * @param args
 * @param session
 * @param next
 * @returns ds.ExUserData
 */
proto.d = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_hero_wearRune_args ;
    var tempId = args[argsKeys.tempId];
    var index = args[argsKeys.index];
    //接口调用
    heroBiz.wearRune(uwClient,userId ,tempId,index ,function(err,data){
        if(err) return next(null,wrapResult(err));
        var exUserData = new ds.ExUserData();
        exUserData.heroData = data[0];
        exUserData.delBagItems = data[1];
        next(null,wrapResult(null,exUserData,dsNameConsts.ExUserData));
    })
};

/**
 * 升级境界
 * @iface upRealm
 * @args {tempId:"英雄模板id"}
 * @param args
 * @param session
 * @param next
 */
proto.e = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_hero_upRealm_args ;
    var tempId = args[argsKeys.tempId];
    //接口调用
    heroBiz.upRealm(uwClient,userId ,tempId ,function(err,data){
        if(err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data,dsNameConsts.HeroEntity));
    })
};

/**
 * 强化
 * @iface strength
 * @args {tempId:"英雄模板id",index:"对应装备位置下标"}
 * @param args
 * @param session
 * @param next
 */
proto.f = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_hero_strength_args ;
    var tempId = args[argsKeys.tempId];
    var index = args[argsKeys.index];
    //接口调用
    heroBiz.strength(uwClient,userId ,tempId,index ,function(err,data){
        if(err) return next(null,wrapResult(err));
        var costGold = data[3];
        gameRecordSerial.add(userId,function(cb1) {
            gameRecordBiz.setCostGoldRecord(uwClient, userId, c_prop.goldCostTypeKey.strength, costGold, cb1);
        });
        var strengthLvl = data[1].intensifyArr[index];
        var exUserData = new ds.ExUserData();
        exUserData.userData = data[0];
        exUserData.heroData = data[1];
        exUserData.delBagItems = data[2];
        next(null,wrapResult(null,exUserData,dsNameConsts.ExUserData));
        taskBiz.setTaskValue(uwClient,userId,c_prop.cTaskTypeKey.equipStrength,strengthLvl,function(){});
    });
};

/**
 * 强化精炼
 * @iface equipRefine
 * @args {tempId:"英雄模板id",index:"装备下标"}
 * @param args
 * @param session
 * @param next
 */
proto.f1 = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_hero_equipRefine_args ;
    var tempId = args[argsKeys.tempId];
    var index = args[argsKeys.index];
    //接口调用
    heroBiz.equipRefine(uwClient,userId ,tempId,index,function(err,data){
        if(err) return next(null,wrapResult(err));
        var exUserData = new ds.ExUserData();
        exUserData.userData = data[0];
        exUserData.heroData = data[1];
        exUserData.delBagItems = data[2];
        exUserData.strengthArr = data[3];
        next(null,wrapResult(null,exUserData,dsNameConsts.ExUserData));
    });
};



/**
 * 升星
 * @iface upStar
 * @args {tempId:"英雄模板id",index:"对应装备位置下标"}
 * @param args
 * @param session
 * @param next
 */
proto.g = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_hero_upStar_args ;
    var tempId = args[argsKeys.tempId];
    var index = args[argsKeys.index];
    //接口调用
    heroBiz.upStar(uwClient,userId ,tempId,index ,function(err,data){
        if(err) return next(null,wrapResult(err));
        var costGold = data[3];
        gameRecordSerial.add(userId,function(cb1) {
            gameRecordBiz.setCostGoldRecord(uwClient, userId, c_prop.goldCostTypeKey.upStar, costGold, cb1);
        });
        var starLvl = data[1].starArr[index];
        var exUserData = new ds.ExUserData();
        exUserData.userData = data[0];
        exUserData.heroData = data[1];
        exUserData.delBagItems = data[2];
        next(null,wrapResult(null,exUserData,dsNameConsts.ExUserData));
        taskBiz.setTaskValue(uwClient,userId,c_prop.cTaskTypeKey.equipUpStar,starLvl,function(){});
    });
};

/**
 * 升星突破
 * @iface starTop
 * @args {tempId:"英雄模板id",index:"对应装备位置下标"}
 * @param args
 * @param session
 * @param next
 */
proto.g1 = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_hero_starTop_args ;
    var tempId = args[argsKeys.tempId];
    var index = args[argsKeys.index];
    //接口调用
    heroBiz.starTop(uwClient,userId ,tempId,index ,function(err,data){
        if(err) return next(null,wrapResult(err));
        var exUserData = new ds.ExUserData();
        exUserData.userData = data[0];
        exUserData.heroData = data[1];
        exUserData.delBagItems = data[2];
        exUserData.strengthArr = data[3];
        next(null,wrapResult(null,exUserData,dsNameConsts.ExUserData));
    });
};

/**
 * 宝石升级
 * @iface upGem
 * @args {tempId:"英雄模板id",index:"对应装备位置下标"}
 * @param args
 * @param session
 * @param next
 */
proto.h = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_hero_upGem_args ;
    var tempId = args[argsKeys.tempId];
    var index = args[argsKeys.index];
    //接口调用
    heroBiz.upGem(uwClient,userId ,tempId,index ,function(err,data){
        if(err) return next(null,wrapResult(err));
        var gemId = data[0].gemArr[index];
        var gemLvl = c_gem[gemId].gemLvl;

        var exUserData = new ds.ExUserData();
        exUserData.heroData = data[0];
        exUserData.delBagItems = data[1];
        next(null,wrapResult(null,exUserData,dsNameConsts.ExUserData));
        _setUpGemTask(data[0],userId,gemLvl);
    });
};

var _setUpGemTask = function(data,userId,gemLvl){
    var gemArr = data.gemArr;
    var isTrue = 0;
    for(var i = c_prop.heroEquipIndexKey.weapon; i <= c_prop.heroEquipIndexKey.necklace; i++){
        if(i == c_prop.heroEquipIndexKey.paralysisRing || i == c_prop.heroEquipIndexKey.reviveRing || i == c_prop.heroEquipIndexKey.protectRing || i == c_prop.heroEquipIndexKey.harmRing) continue;
        if(!gemArr[i] || c_gem[gemArr[i]].gemLvl < gemLvl){
            isTrue = 1;
            break;
        }
    }
    if(isTrue == 0){
        taskBiz.setTaskValue(uwClient,userId,c_prop.cTaskTypeKey.heroGem,gemLvl,function(){});
    }
    taskBiz.setTaskValue(uwClient,userId,c_prop.cTaskTypeKey.gemUp,gemLvl,function(){});
};

/**
 * 翅膀培养
 * @iface wingFos
 * @args {tempId:"英雄模板id",fosType:"培养类型"}
 * @param args
 * @param session
 * @param next
 */
proto.z = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_hero_wingFos_args ;
    var tempId = args[argsKeys.tempId];
    var fosType = args[argsKeys.fosType];
    //接口调用
    heroBiz.wingFos(uwClient,userId ,tempId,fosType ,function(err,data){
        if(err) return next(null,wrapResult(err));
        var costGold = data[5];
        var costDiamond = data[6];
        gameRecordSerial.add(userId,function(cb1) {
            gameRecordBiz.setCostGoldRecord(uwClient, userId, c_prop.goldCostTypeKey.wingFos, costGold, cb1);
        });
        if(costDiamond>0){
            gameRecordSerial.add(userId,function(cb1){
                gameRecordBiz.setCostDiamondRecord(uwClient,userId,c_prop.diamondCostTypeKey.wingFos,costDiamond,cb1);
            });
        }
        var exUserData = new ds.ExUserData();
        exUserData.userData = data[0];
        exUserData.heroData = data[1];
        exUserData.delBagItems = data[2];
        exUserData.wingExp = data[3];
        exUserData.isWingCrit = data[4];
        next(null,wrapResult(null,exUserData,dsNameConsts.ExUserData));

        taskBiz.setTaskValue(uwClient,userId,c_prop.cTaskTypeKey.wingTrain,1,function(){});
    });
};


/**
 * 翅膀强化
 * @iface wingStrength
 * @args {tempId:"英雄模板id",part:"部位",isReplace:"是否元宝替代"}
 * @param args
 * @param session
 * @param next
 */
proto.z1 = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_hero_wingStrength_args ;
    var tempId = args[argsKeys.tempId];
    var part = args[argsKeys.part];
    var isReplace = args[argsKeys.isReplace];
    //接口调用
    heroBiz.wingStrength(uwClient,userId ,tempId,part ,isReplace,function(err,data){
        if(err) return next(null,wrapResult(err));
        var costDiamond = data[3];
        if(costDiamond>0){
            gameRecordSerial.add(userId,function(cb1){
                gameRecordBiz.setCostDiamondRecord(uwClient,userId,c_prop.diamondCostTypeKey.wingStrength,costDiamond,cb1);
            });
        }
        var exUserData = new ds.ExUserData();
        exUserData.userData = data[0];
        exUserData.heroData = data[1];
        exUserData.delBagItems = data[2];
        exUserData.strengthArr = data[4];
        next(null,wrapResult(null,exUserData,dsNameConsts.ExUserData));
    });
};

/**
 * 翅膀一键培养
 * @iface wingFos2Top
 * @args {tempId:"英雄模板id",fosType:"培养类型",isUseDiamond:"是否使用元宝"}
 * @param args
 * @param session
 * @param next
 */
proto.z2 = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_hero_wingFos2Top_args ;
    var tempId = args[argsKeys.tempId];
    var fosType = args[argsKeys.fosType];
    var isUseDiamond = args[argsKeys.isUseDiamond];
    //接口调用
    heroBiz.wingFos2Top(uwClient,userId ,tempId,fosType ,isUseDiamond, function(err,data){
        if(err) return next(null,wrapResult(err));
        var costGold = data[5];
        var costDiamond = data[6];
        gameRecordSerial.add(userId,function(cb1) {
            gameRecordBiz.setCostGoldRecord(uwClient, userId, c_prop.goldCostTypeKey.wingFos, costGold, cb1);
        });
        if(costDiamond>0){
            gameRecordSerial.add(userId,function(cb1){
                gameRecordBiz.setCostDiamondRecord(uwClient,userId,c_prop.diamondCostTypeKey.wingFos,costDiamond,cb1);
            });
        }
        var exUserData = new ds.ExUserData();
        exUserData.userData = data[0];
        exUserData.heroData = data[1];
        exUserData.delBagItems = data[2];
        exUserData.wingExp = data[3];
        exUserData.wingCritNum = data[4];
        next(null,wrapResult(null,exUserData,dsNameConsts.ExUserData));

        taskBiz.setTaskValue(uwClient,userId,c_prop.cTaskTypeKey.wingTrain,1,function(){});
    });
};

/**
 * 翅膀升级
 * @iface upWing
 * @args {tempId:"英雄模板id"}
 * @param args
 * @param session
 * @param next
 */
proto.k = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_hero_upWing_args ;
    var tempId = args[argsKeys.tempId];
    //接口调用
    heroBiz.upWing(uwClient,userId ,tempId ,function(err,data){
        if(err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data,dsNameConsts.HeroEntity));
    })
};

/**
 * 翅膀激活
 * @iface wingActivate
 * @args {tempId:"英雄模板id"}
 * @param args
 * @param session
 * @param next
 */
proto.l = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_hero_wingActivate_args ;
    var tempId = args[argsKeys.tempId];
    //接口调用
    heroBiz.wingActivate(uwClient,userId ,tempId ,function(err,data){
        if(err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data,dsNameConsts.HeroEntity));
    })
};

/**
 * 重新计算属性和战力
 * @iface calPropAndCombat
 * @args
 * @param args
 * @param session
 * @param next
 */
proto.m = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    //接口调用
    heroBiz.calPropAndCombat(uwClient,userId ,function(err,data){
        if(err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data,dsNameConsts.HeroEntity));
    })
};

/**
 * 获取主英雄外观数据
 * @iface getMainHeroDisplay
 * @args {userId:"用户id"}
 * @param args
 * @param session
 * @param next
 * @returns [装备显示id,武器显示id,翅膀id,性别]
 */
proto.n = function (args, session, next) {
    var argsKeys = iface.a_hero_getMainHeroDisplay_args ;
    var userId = args[argsKeys.userId];
    //接口调用
    heroBiz.getMainHeroDisplay(uwClient,userId ,function(err,data){
        if(err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data));
    })
};

/**
 * 获取主英雄外观数据
 * @iface getHeroDisplayByTempId
 * @args {userId:"用户id",tempId:"英雄模板id"}
 * @param args
 * @param session
 * @param next
 * @returns [装备显示id,武器显示id,翅膀id,性别]
 */
proto.o = function (args, session, next) {
    var argsKeys = iface.a_hero_getHeroDisplayByTempId_args ;
    var userId = args[argsKeys.userId];
    var tempId = args[argsKeys.tempId];
    if(tempId==0){
        //接口调用
        heroBiz.getMainHeroDisplay(uwClient,userId ,function(err,data){
            if(err) return next(null,wrapResult(err));
            next(null,wrapResult(null,data));
        })
    }else{
        //接口调用
        heroBiz.getHeroDisplayByTempId(uwClient,userId ,tempId,function(err,data){
            if(err) return next(null,wrapResult(err));
            next(null,wrapResult(null,data));
        })
    }

};

/**
 * 重新计算属性和战力
 * @iface getShowHeroData
 * @args  {userId:"用户id"}
 * @param args
 * @param session
 * @param next
 */
proto.o1 = function (args, session, next) {
    var argsKeys = iface.a_hero_getShowHeroData_args ;
    var userId = args[argsKeys.userId];
    //接口调用
    heroBiz.getShowHeroData(uwClient,userId ,function(err,data){
        if(err) return next(null,wrapResult(err));
        var showHeroData = new ds.ShowHeroData();
        showHeroData.heroList = data[0];
        showHeroData.otherDataList = data[1]; //[[衣服显示id,武器显示id,翅膀显示id],..]
        showHeroData.fightData = data[2];
        next(null,wrapResult(null,showHeroData,dsNameConsts.ShowHeroData));
    })
};

/**
 * 装备符文块
 * @iface wearAllRune
 * @args {tempId:"英雄模板id"}
 * @param args
 * @param session
 * @param next
 * @returns ds.ExUserData
 */
proto.p = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_hero_wearAllRune_args ;
    var tempId = args[argsKeys.tempId];
    //接口调用
    heroBiz.wearAllRune(uwClient,userId ,tempId ,function(err,data){
        if(err) return next(null,wrapResult(err));
        var exUserData = new ds.ExUserData();
        exUserData.heroData = data[0];
        exUserData.delBagItems = data[1];
        next(null,wrapResult(null,exUserData,dsNameConsts.ExUserData));
    })
};

/**
 * 开启自动注入
 * @iface autoInfuseSwitch
 * @args {isOpenIn:"是否开启"}
 * @param args
 * @param session
 * @param next
 * @returns ds.ExUserData
 */
proto.q = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_hero_autoInfuseSwitch_args ;
    var isOpenIn = args[argsKeys.isOpenIn];
    //接口调用
    heroBiz.autoInfuseSwitch(uwClient,userId ,isOpenIn ,function(err,data){
        if(err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data,dsNameConsts.UserEntity));
    })
};

/**
 * 额外注入
 * @iface extraInfuse
 * @args {type:"类型"}
 * @param args
 * @param session
 * @param next
 * @returns ds.ExUserData
 */
proto.q1 = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_hero_extraInfuse_args ;
    var type = args[argsKeys.type];
    //接口调用
    heroBiz.extraInfuse(uwClient,userId ,type ,function(err,data){
        if(err) return next(null,wrapResult(err));
        var costDiamond = data[4];
        if(costDiamond>0){
            gameRecordSerial.add(userId,function(cb1){
                gameRecordBiz.setCostDiamondRecord(uwClient,userId,c_prop.diamondCostTypeKey.fourRole,costDiamond,cb1);
            });
        }
        var exDemonLotusData = new ds.ExDemonLotusData();
        exDemonLotusData.userData = data[0];
        exDemonLotusData.expSum = data[3]
        exDemonLotusData.isSucceed = data[2];
        exDemonLotusData.genuineQiArr = data[1];
        next(null,wrapResult(null,exDemonLotusData,dsNameConsts.ExDemonLotusData));
    })
};

/**
 * 保存出战列表
 * @iface saveFightList
 * @args {fightArr:"顺序数组"}
 * @param args
 * @param session
 * @param next
 * @returns
 */
proto.q2 = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_hero_saveFightList_args ;
    var fightArr = args[argsKeys.fightArr];
    //接口调用
    heroBiz.saveFightList(uwClient,userId ,fightArr ,function(err,data){
        if(err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data,dsNameConsts.HeroEntity));
    })
};



