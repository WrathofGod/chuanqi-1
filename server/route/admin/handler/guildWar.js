/**
 * Created by Sara on 2015/5/28.
 */

var wrapResult = require('uw-utils').wrapResultFunc(__filename);
var propUtils = require('uw-utils').propUtils;
var consts = require("uw-data").consts;
var dsNameConsts = require("uw-data").dsNameConsts;
var iface = require("uw-data").iface;
var guildWarBiz = require("uw-guild-war").guildWarBiz;
var uwClient = require("uw-db").uwClient;
var ds = require("uw-ds").ds;
var c_prop = require("uw-data").c_prop;
var g_coffers = require("uw-global").g_coffers;
var proto = module.exports;

/**
 * 攻击城门
 * @iface lootDefense
 * @args {attackData:"[攻击玩家id,攻击玩家名，服务器id,服务器名称,是否直接击破]",isWin:"是否胜利",defenceData:"[行会id,攻击哪个门,防守者名字]"}
 * @param args
 * @param session
 * @param next
 * @returns [状态，个人资源，国库资源]
 */
proto.a = function (args, session, next) {
    var argsKeys = iface.admin_guildWar_lootDefense_args ;
    var attackData = args[argsKeys.attackData];
    var isWin = args[argsKeys.isWin];
    var defenceData = args[argsKeys.defenceData];
    guildWarBiz.lootDefense(uwClient, attackData[0], attackData[1], attackData[2], attackData[3],attackData[4],attackData[5], isWin,  defenceData[0], defenceData[1], defenceData[2],function(err,data){
        if(err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data));
    });
};

/**
 * 增加被攻打消息
 * @iface pushBeFightRecord
 * @args {guildId:"被打行会id", data:"[门，服务器名,行会名,玩家名]"}
 * @param args
 * @param session
 * @param next
 * @returns 0
 */
proto.b = function (args, session, next) {
    var argsKeys = iface.admin_guildWar_pushBeFightRecord_args ;
    var guildId = args[argsKeys.guildId];
    var data = args[argsKeys.data];

    guildWarBiz.pushBeFightRecord(uwClient, guildId,data,function(err,data){
        if(err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data));
    });
};

/**
 * 获取当前服务器行会信息
 * @iface getCurServerGuildWarObj
 * @args
 * @param args
 * @param session
 * @param next
 * @returns 0
 */
proto.c = function (args, session, next) {
    guildWarBiz.getCurServerGuildWarObj(uwClient,function(err,data){
        if(err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data));
    });
};

/**
 * 插入100条用户，用于压测
 * @iface enter100User
 * @args
 * @param args
 * @param session
 * @param next
 * @returns 0
 */
proto.d = function (args, session, next) {
    guildWarBiz.enter100User(uwClient,function(err,data){
        if(err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data));
    });
};
