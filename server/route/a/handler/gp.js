/**
 * Created by Sara on 2015/5/28.
 */

var wrapResult = require('uw-utils').wrapResultFunc(__filename);
var propUtils = require('uw-utils').propUtils;
var consts = require("uw-data").consts;
var dsNameConsts = require("uw-data").dsNameConsts;
var iface = require("uw-data").iface;
var guildPersonalBiz = require("uw-guild").guildPersonalBiz;
var uwClient = require("uw-db").uwClient;
var ds = require("uw-ds").ds;
var c_prop = require("uw-data").c_prop;
var gameRecordBiz = require("uw-game-record").gameRecordBiz;
var gameRecordSerial = require("uw-serial").gameRecordSerial;

var proto = module.exports;

/**
 * 贡献
 * @iface pickAct
 * @args {actId:"贡献id"}
 * @param args
 * @param session
 * @param next
 * @returns ds.ExGuildData
 */
proto.a = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_guildPerson_pickAct_args ;
    var actId = args[argsKeys.actId];
    //接口调用
    guildPersonalBiz.pickAct(uwClient,userId ,actId ,function(err,data){
        if(err) return next(null,wrapResult(err));
        var ex = new ds.ExGuildData();
        ex.userData = data[0];//
        ex.guildData = data[1];//
        ex.guildPersonalData = data[2];
        var costDiamond = data[3];
        var costGold = data[4];

        if(costDiamond>0){
            gameRecordSerial.add(userId,function(cb1){
                gameRecordBiz.setCostDiamondRecord(uwClient,userId,c_prop.diamondCostTypeKey.guildAct,costDiamond,cb1);
            });
        }

        if(costGold>0){
            gameRecordSerial.add(userId,function(cb1){
                gameRecordBiz.setCostGoldRecord(uwClient,userId,c_prop.goldCostTypeKey.guildAct,costGold,cb1);
            });
        }

        next(null,wrapResult(null,ex,dsNameConsts.ExGuildData));
    })
};


/**
 * 获取成员列表
 * @iface getMemberList
 * @args
 * @isWorker 1
 * @param args
 * @param session
 * @param next
 * @returns ds.GuildMember
 */
proto.b = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    //接口调用
    guildPersonalBiz.getMemberList(uwClient,userId ,function(err,data){
        if(err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data,dsNameConsts.GuildMember));
    })
};


/**
 * 操作会员
 * @iface opMember
 * @args {targetUserId:"对方userId",op:"操作类型"}
 * @param args
 * @param session
 * @param next
 * @returns ds.ExGuildData
 */
proto.c = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_guildPerson_opMember_args ;
    var targetUserId = args[argsKeys.targetUserId];
    var op = args[argsKeys.op];
    //接口调用
    guildPersonalBiz.opMember(uwClient,userId ,targetUserId ,op,function(err,data){
        if(err) return next(null,wrapResult(err));
        var ex = new ds.ExGuildData();
        ex.guildData = data[0];//
        ex.guildPersonalData = data[1];
        next(null,wrapResult(null,ex,dsNameConsts.ExGuildData));
    })
};
