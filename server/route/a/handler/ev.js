/**
 * Created by Administrator on 2015/5/23.
 */

var wrapResult = require('uw-utils').wrapResultFunc(__filename);
var propUtils = require('uw-utils').propUtils;
var consts = require("uw-data").consts;
var c_prop = require("uw-data").c_prop;
var dsNameConsts = require("uw-data").dsNameConsts;
var iface = require("uw-data").iface;
var eventBiz = require("uw-event").eventBiz;
var uwClient = require("uw-db").uwClient;
var gameRecordBiz = require("uw-game-record").gameRecordBiz;
var gameRecordSerial = require("uw-serial").gameRecordSerial;

var proto = module.exports;

/**.
 * 随机事件购买
 * @iface eventBuy
 * @args {eventId:"随机事件id"}
 * @param args
 * @param session
 * @param next
 * @returns ds.UserEntity
 */
proto.a = function(args, session, next){
    var argsKeys = iface.a_event_eventBuy_args;
    var userId = session.get(consts.session.userId);
    var eventId = args[argsKeys.eventId];
    eventBiz.eventBuy(uwClient,userId,eventId, function(err, data){
        if(err) return next(null,wrapResult(err));
        var userData = data[0];
        var costDiamond = data[1];
        if(costDiamond>0){
            gameRecordSerial.add(userId,function(cb1){
                gameRecordBiz.setCostDiamondRecord(uwClient,userId,c_prop.diamondCostTypeKey.randomEvent,costDiamond,cb1);
            });
        }
        next(null, wrapResult(null, userData, dsNameConsts.UserEntity));
    });
};
