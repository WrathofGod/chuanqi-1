/**
 * Created by Sara on 2015/5/28.
 */

var wrapResult = require('uw-utils').wrapResultFunc(__filename);
var propUtils = require('uw-utils').propUtils;
var consts = require("uw-data").consts;
var dsNameConsts = require("uw-data").dsNameConsts;
var iface = require("uw-data").iface;
var userDao = require("uw-user").userDao;
var honorBiz = require("uw-honor").honorBiz;
var uwClient = require("uw-db").uwClient;
var c_prop = require("uw-data").c_prop;
var gameRecordBiz = require("uw-game-record").gameRecordBiz;
var gameRecordSerial = require("uw-serial").gameRecordSerial;

var proto = module.exports;

/**
 * 获取用户成就信息
 * @iface getInfo
 * @args
 * @param args
 * @param session
 * @param next
 */
proto.a = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    //接口调用
    honorBiz.getInfo(uwClient,userId,function(err,honorData){
        if(err) return next(null,wrapResult(err));
        next(null,wrapResult(null,honorData));
    })
};

/**
 * 用户领取成就奖励
 * @iface getAward
 * @args  {honorId:"成就id"}
 * @param args
 * @param session
 * @param next
 */
proto.b = function (args, session, next) {
    var argsKeys = iface.a_honor_getAward_args;
    var userId = session.get(consts.session.userId);
    var honorId = args[argsKeys.honorId];
    //接口调用
    honorBiz.getAward(uwClient,userId,honorId,function(err,data){
        if(err) return next(null,wrapResult(err));
        var userData = data[0];
        var getDiamond = data[1];
        if(getDiamond>0){
            gameRecordSerial.add(userId,function(cb1){
                gameRecordBiz.setDiamondRecord(uwClient,userId,c_prop.diamondGetTypeKey.honor,getDiamond,cb1);
            });
        }
        next(null,wrapResult(null,propUtils.delProp(userData,["record"]),dsNameConsts.UserEntity));
    })
};

/**
 * 结算百分比类效果扣除时照成的收益加成错误修改
 * @iface bugAlter
 * @args
 * @param args
 * @param session
 * @param next
 */
proto.c = function (args, session, next) {
    //接口调用
    honorBiz.bugAlter(uwClient,function(err,data){
        if(err) return next(null,wrapResult(err));
        next(null,wrapResult(null,propUtils.delProp(data,["record"]),dsNameConsts.UserEntity));
    })
};