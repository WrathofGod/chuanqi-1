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
var equipBiz = require("uw-equip").equipBiz;
var ds = require("uw-ds").ds;
var uwClient = require("uw-db").uwClient;
var gameRecordSerial = require("uw-serial").gameRecordSerial;
var gameRecordBiz = require("uw-game-record").gameRecordBiz;

var proto = module.exports;

/**
 * 装备
 * @iface changeEquip
 * @args    {tempId:"英雄id",index:"装备位置",equipId:"装备id"}
 * @param args
 * @param session
 * @param next
 * @returns ds.ExUserData
 */
proto.a = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_equip_changeEquip_args;
    var tempId = args[argsKeys.tempId];
    var index = args[argsKeys.index];
    var equipId = args[argsKeys.equipId];
    //接口调用
    equipBiz.changeEquip(uwClient,userId,tempId,index,equipId,function(err,data){
        if (err) return next(null,wrapResult(err));
        var exData = new ds.ExUserData();
        exData.heroData = data[0];
        exData.equipBagItems = data[1];
        next(null,wrapResult(null,exData,dsNameConsts.ExUserData));
    })
};

/**
 * 传承装备
 * @iface inheritedEquip
 * @args    {equipId:"装备id",tempId:"英雄id"}
 * @param args
 * @param session
 * @param next
 * @returns ds.ExUserData
 */
proto.b = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_equip_inheritedEquip_args;
    var equipId = args[argsKeys.equipId];
    var tempId = args[argsKeys.tempId];
    //接口调用
    equipBiz.inheritedEquip(uwClient,userId,equipId, tempId,function(err,data){
        if (err) return next(null,wrapResult(err));
        var exData = new ds.ExUserData();
        exData.bagItems = data[0];
        exData.userData = data[1];
        exData.heroData = data[2];
        exData.equipBagItems = data[3];
        next(null,wrapResult(null,exData,dsNameConsts.ExUserData));
    })
};

/**
 * 定制武器
 * @iface customization
 * @args    {certificate:"凭证id",job:"职业",name:"装备名",lvl:"装备等级",abilityIndex:"属性下标数组",equipType:"部位"}
 * @param args
 * @param session
 * @param next
 * @returns ds.ExUserData
 */
proto.c = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_equip_customization_args;
    var certificate = args[argsKeys.certificate];
    var job = args[argsKeys.job];
    var name = args[argsKeys.name];
    var lvl = args[argsKeys.lvl];
    var abilityIndex = args[argsKeys.abilityIndex];
    var equipType = args[argsKeys.equipType];
    //接口调用
    equipBiz.customization(uwClient,userId,certificate,job,name,lvl,abilityIndex,equipType,function(err,data){
        if (err) return next(null,wrapResult(err));
        var exData = new ds.ExUserData();
        exData.delBagItems = data[0];
        exData.equipBagItems = data[1];
        exData.isMail = data[2];
        next(null,wrapResult(null,exData,dsNameConsts.ExUserData));
    })
};

/**
 * 定制武器升级
 * @iface upCustomization
 * @args    {equipId:"装备id"}
 * @param args
 * @param session
 * @param next
 * @returns ds.ExUserData
 */
proto.d = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_equip_upCustomization_args;
    var equipId = args[argsKeys.equipId];
    //接口调用
    equipBiz.upCustomization(uwClient,userId,equipId,function(err,data){
        if (err) return next(null,wrapResult(err));
        var exData = new ds.ExUserData();
        exData.delBagItems = data[0];
        exData.equipBagItems = data[1];
        next(null,wrapResult(null,exData,dsNameConsts.ExUserData));
    })
};

/**
 * 锁定装备
 * @iface updateEquipItemLockStatus
 * @args    {equipId:"装备id",isLocked:"1"}
 * @param args
 * @param session
 * @param next
 * @returns ds.ExUserData
 */
proto.e = function(args, session,next){
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_equip_updateEquipItemLockStatus_args;
    var equipId = args[argsKeys.equipId];
    var isLocked = args[argsKeys.isLocked];
    //接口调用
    equipBiz.updateEquipItemLockStatus(uwClient,userId,equipId,isLocked,function(err,equipBagItem){
        if (err) return next(null,wrapResult(err));
        var exData = new ds.ExUserData();
        exData.equipBagItems = equipBagItem;
        next(null,wrapResult(null,exData,dsNameConsts.ExUserData));
    })
};

/**
 * 出售装备
 * @iface sellEquipItems
 * @args  {equipIdArr:"id,id,id"}
 * @param args
 * @param session
 * @param next
 * @returns ds.ExUserData
 */
proto.f = function(args, session,next){
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_equip_sellEquipItems_args;
    var equipIdArr = args[argsKeys.equipIdArr];

    //接口调用
    equipBiz.sellEquipItems(uwClient,userId,equipIdArr,function(err,data){
        if (err) return next(null,wrapResult(err));
        var getDiamond = data[2];
        var costDiamond = data[4];

        if(getDiamond>0){
            gameRecordSerial.add(userId,function(cb1){
                gameRecordBiz.setDiamondRecord(uwClient,userId,c_prop.diamondGetTypeKey.sellEquipItem,getDiamond,cb1);
            });
        };

        if(costDiamond > 0){
            gameRecordSerial.add(userId, function(cb1){
                gameRecordBiz.setCostDiamondRecord1(client,userId,c_prop.diamondCostTypeKey.sellEquipItem,costDiamond,cb1);
            });
        };

        var exData = new ds.ExUserData();
        exData.userData = data[0];
        exData.bagItems = data[1];
        exData.delEquipBagArr = data[3];
        next(null,wrapResult(null,exData,dsNameConsts.ExUserData));
    })
};
