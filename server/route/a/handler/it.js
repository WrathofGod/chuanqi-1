/**
 * Created by John on 2016/4/12.
 */
var wrapResult = require('uw-utils').wrapResultFunc(__filename);
var propUtils = require('uw-utils').propUtils;
var consts = require("uw-data").consts;
var c_prop = require("uw-data").c_prop;
var dsNameConsts = require("uw-data").dsNameConsts;
var iface = require("uw-data").iface;
var userDao = require("uw-user").userDao;
var itemBiz = require("uw-item").itemBiz;
var ds = require("uw-ds").ds;
var uwClient = require("uw-db").uwClient;
var gameRecordSerial = require("uw-serial").gameRecordSerial;
var gameRecordBiz = require("uw-game-record").gameRecordBiz;

var proto = module.exports;

/**
 * 出售物品
 * @iface sellItems
 * @args    {itemId:"id",itemNum:"num"}
 * @param args
 * @param session
 * @param next
 * @returns ds.ExUserData
 */
proto.a = function(args, session,next){
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_item_sellItems_args;
    var itemId = args[argsKeys.itemId];
    var itemNum = args[argsKeys.itemNum];
    //接口调用
    itemBiz.sellItems(uwClient,userId,itemId, itemNum,function(err,data){
        if (err) return next(null,wrapResult(err));
        var getDiamond = data[2];
        if(getDiamond>0){
            gameRecordSerial.add(userId,function(cb1){
                gameRecordBiz.setDiamondRecord(uwClient,userId,c_prop.diamondGetTypeKey.sellItem,getDiamond,cb1);
            });
        }
        var exData = new ds.ExUserData();
        exData.userData = data[0];
        exData.bagItems = data[1];
        exData.delBagItems = data[3];
        next(null,wrapResult(null,exData,dsNameConsts.ExUserData));
    })
};