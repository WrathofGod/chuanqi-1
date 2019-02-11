/**
 * Created by Sara on 2016/3/28.
 */

var wrapResult = require('uw-utils').wrapResultFunc(__filename);
var consts = require("uw-data").consts;
var dsNameConsts = require("uw-data").dsNameConsts;
var iface = require("uw-data").iface;
var protocolContentBiz = require("uw-protocol-content").protocolContentBiz;
var mainClient = require("uw-db").mainClient;

var proto = module.exports;

/**
 * 获取协议内容
 * @iface getInfo
 * @args
 * @param args
 * @param session
 * @param next
 * @returns ds.ProtocolContentEntity
 */
proto.a = function (args, session, next) {
    //接口调用
    protocolContentBiz.getInfo(mainClient,function(err,data){
        if(err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data,dsNameConsts.ProtocolContentEntity));
    })
};

