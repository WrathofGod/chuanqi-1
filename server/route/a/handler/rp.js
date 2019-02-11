/**
 * Created by Sara on 2016/1/5.
 */
var wrapResult = require('uw-utils').wrapResultFunc(__filename);
var propUtils = require('uw-utils').propUtils;
var consts = require("uw-data").consts;
var c_prop = require("uw-data").c_prop;
var dsNameConsts = require("uw-data").dsNameConsts;
var iface = require("uw-data").iface;
var ds = require("uw-ds").ds;
var uwClient = require("uw-db").uwClient;
var redEnvelopePersonalBiz = require("uw-red-envelope").redEnvelopePersonalBiz;
var gameRecordBiz = require("uw-game-record").gameRecordBiz;
var gameRecordSerial = require("uw-serial").gameRecordSerial;
var taskBiz = require("uw-task").taskBiz;

var proto = module.exports;

/**
 * 获取个人红包数据
 * @iface getInfo
 * @args
 * @param args
 * @param session
 * @param next
 */
proto.a = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    //接口调用
    redEnvelopePersonalBiz.getInfo(uwClient,userId,function(err,data){
        if(err) return next(null,wrapResult(err));
        var exRedEnvelopeData = new ds.ExRedEnvelopeData();
        exRedEnvelopeData.redEnvelopePersonalData = data[0];
        exRedEnvelopeData.guildPersonalData = data[1];
        next(null,wrapResult(null,exRedEnvelopeData,dsNameConsts.ExRedEnvelopeData));
    });
};
