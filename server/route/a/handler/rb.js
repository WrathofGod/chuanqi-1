/**
 * Created by Administrator on 2016/1/20.
 */
var reBirthBiz = require("uw-rebirth").reBirthBiz;
var uwData = require("uw-data");
var consts = uwData.consts;
var client = require("uw-db").uwClient;
var dsNameConsts = uwData.dsNameConsts;
var wrapResult = require('uw-utils').wrapResultFunc(__filename);
var iface = require("uw-data").iface;
var ds = require("uw-ds").ds;
var c_prop = uwData.c_prop;
var gameRecordBiz = require("uw-game-record").gameRecordBiz;
var gameRecordSerial = require("uw-serial").gameRecordSerial;
var rebirthBiz = require("uw-rebirth").rebirthBiz;
var proto = module.exports;


/**
 * 转生
 * @iface rebirth
 * @args
 * @param args
 * @param session
 * @param next
 * @return ds.Rebirth
 */
proto.a = function(args, session, next){
    var userId = session.get(consts.session.userId);
    rebirthBiz.rebirth(client,userId,function(err,data){
        if(err) return next(null, wrapResult(err));
        var exData = new ds.Rebirth();
        exData.userData = data[0];
        exData.heroList = data[1];
        next(null, wrapResult(null,exData,dsNameConsts.Rebirth));
    });
}
/**
 * 购买转生丹
 * @iface buyRebirth
 * @args {index:"转生丹index",num:"转生丹数量"}
 * @param args
 * @param session
 * @param next
 * @return ds.ExUserData
 */

proto.b = function(args, session, next){
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_rebirth_buyRebirth_args;
    var index = args[argsKeys.index];
    var num = args[argsKeys.num];
    rebirthBiz.buyRebirth(index, num, client, userId, function(err, data){
        if(err) return next(null, wrapResult(err));
        var costDiamond = data[3];
        if(costDiamond>0){
            gameRecordSerial.add(userId,function(cb1){
                gameRecordBiz.setCostDiamondRecord1(client,userId,c_prop.diamondCostTypeKey.activity,costDiamond,cb1);
            });
        }
        var exData = new ds.ExUserData();
        exData.userData = data[0];
        exData.bagItems = data[1];
        exData.equipBagItems = data[2];
        next(null, wrapResult(null,exData,dsNameConsts.ExUserData));
    })
}