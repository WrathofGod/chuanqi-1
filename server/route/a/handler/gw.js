/**
 * Created by Sara on 2015/5/28.
 */

var wrapResult = require('uw-utils').wrapResultFunc(__filename);
var propUtils = require('uw-utils').propUtils;
var consts = require("uw-data").consts;
var dsNameConsts = require("uw-data").dsNameConsts;
var iface = require("uw-data").iface;
var uwClient = require("uw-db").uwClient;
var ds = require("uw-ds").ds;
var c_prop = require("uw-data").c_prop;
var gameRecordBiz = require("uw-game-record").gameRecordBiz;
var gameRecordSerial = require("uw-serial").gameRecordSerial;
var guildWarBiz = require("uw-guild-war").guildWarBiz;

var proto = module.exports;

/**
 * 获取个人数据
 * @iface getInfo
 * @args
 * @param args
 * @param session
 * @param next
 * @returns ds.MyGuildWarData
 */
proto.a = function (args, session, next) {
    var userId = session.get(consts.session.userId);

    guildWarBiz.getInfo(uwClient, userId, function(err,data){
        if(err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data,dsNameConsts.MyGuildWarData));
    });

};


/**
 * 获取行会列表
 * @iface getGuildList
 * @args {guildId:"公会id"}
 * @param args
 * @param session
 * @param next
 * @returns ds.GuildServer
 */
proto.a1 = function (args, session, next) {
    var userId = session.get(consts.session.userId);
/*    var guildList = [];
    for(var i = 0;i<50;i++){
        var d = new ds.GuildServer();
        d.serverName = "服务器"+i;//服务器名
        d.serverId = i;//服务器id
        d.guildId = i;//行会id
        d.guildName = "超级无敌行会";//行会名
        d.guildLvl = 0 | Math.random() * 30;//行会等级
        d.doorLives = 0 | Math.random() * 5;//守卫存活数
        d.points = 0 | Math.random() * 500;//宝箱数量
        d.progress = 0 | Math.random() * 100;//进度，百分比
        guildList.push(d);
    }
    next(null,wrapResult(null,guildList,dsNameConsts.GuildServer));
    */
    guildWarBiz.getGuildList(uwClient,userId,function(err,data){
        if(err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data,dsNameConsts.GuildServer));
    });

};

/**
 * 获取战斗攻击数据
 * @iface getWarAttackData
 * @args {serverId:"服务器id",guildId:"公会id"}
 * @param args
 * @param session
 * @param next
 * @returns ds.GuildWarData
 */
proto.b = function (args, session, next) {
    var userId = session.get(consts.session.userId);
/*
    var gw = new ds.GuildWarData();
    gw.doorList = [];//公会门信息
    gw.guildId = 1;//行会id
    gw.guildName = "超级无敌行会";//行会名

    for(var i = 0;i<=3;i++){
        var d = new ds.GuildWarDoor();
        d.door = i;//门口，东南西北 0,1,2,3
        d.hp = 0 | Math.random() * 50+30;//生命值
        d.userId = i;//守门人id
        d.userName = "你猜";//守门人名字
        d.userIcon = 1;//守门人头像
        d.isBreak = 0 | Math.random() * 2;//是否击破
        gw.doorList.push(d);
    }
    next(null,wrapResult(null,gw,dsNameConsts.GuildWarData));
    */
    var argsKeys = iface.a_guildWar_getWarAttackData_args ;
    var serverId = args[argsKeys.serverId];
    var guildId = args[argsKeys.guildId];

    guildWarBiz.getWarAttackData(uwClient,userId, serverId, guildId, function(err,data){
        if(err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data,dsNameConsts.GuildWarData));
    });

};

/**
 * 获取战斗防守数据
 * @iface getWarDefenceData
 * @args {guildId:"公会id"}
 * @param args
 * @param session
 * @param next
 * @returns ds.GuildWarData
 */
proto.c = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    /*
    var gw = new ds.GuildWarData();
    gw.doorList = [];//公会门信息
    gw.guildId = 1;//行会id
    gw.guildName = "超级无敌行会";//行会名

    for(var i = 0;i<=3;i++){
        var d = new ds.GuildWarDoor();
        d.door = i;//门口，东南西北 0,1,2,3
        d.hp = 0 | Math.random() * 50+30;//生命值
        d.userId = i;//守门人id
        d.userName = "你猜";//守门人名字
        d.userIcon = 1;//守门人头像
        d.isBreak = 0 | Math.random() * 2;//是否击破
        gw.doorList.push(d);
    }
    next(null,wrapResult(null,gw,dsNameConsts.GuildWarData));
    */
    guildWarBiz.getWarDefenceData(uwClient,userId,function(err,data){
        if(err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data,dsNameConsts.GuildWarData));
    });
};


/**
 * 获取己方防守记录
 * @iface getDefenceRecordList
 * @args
 * @param args
 * @param session
 * @param next
 * @returns ds.GuildWarDefenceRecord
 */
proto.d = function (args, session, next) {
    var userId = session.get(consts.session.userId);
/*

    var guildList = [];
    for(var i = 0;i<50;i++){
        var d = new ds.GuildWarDefenceRecord();
        d.isWin = 0 | Math.random() * 2;//是否胜利
        d.time = new Date();//时间
        d.door = 0 | Math.random() * 4;//门
        d.attackServerId = i;//攻击者服务器id
        d.attackServerName = "服务器"+i;//攻击者服务器名
        d.attackUserName = "战狼爷";//攻击者名称
        d.attackGuildName = "战天下";//攻击者行会
        d.defenceUserName = "饭桶妹";//防守者名称
        d.hp = 0 | Math.random() * 100;//损失血量
        guildList.push(d);
    }
    next(null,wrapResult(null,guildList,dsNameConsts.GuildWarDefenceRecord));
*/

    guildWarBiz.getDefenceRecordList(uwClient,userId,function(err,data){
        if(err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data,dsNameConsts.GuildWarDefenceRecord));
    });

};

/**
 * 获取战况记录
 * @iface getAttackRecordList
 * @args
 * @param args
 * @param session
 * @param next
 * @returns ds.GuildWarAttackRecord
 */
proto.e = function (args, session, next) {
    var userId = session.get(consts.session.userId);

/*
    var guildList = [];
    for(var i = 0;i<50;i++){
        var d = new ds.GuildWarAttackRecord();
        d.aServerId = i;//攻击者服务器id
        d.aServerName = "服务器"+i;//攻击者服务器名
        d.aUserName = "战狼爷"+i;//攻击者名称
        d.aGuildName = "战天下";//攻击者行会
        d.dServerId = i;//防守者服务器id
        d.dServerName = "服务器"+i;//防守者服务器名
        d.dUserName = "饭桶妹"+i;//防守者名称
        d.dGuildName = "饭天下";//防守者行会
        guildList.push(d);
    }
    next(null,wrapResult(null,guildList,dsNameConsts.GuildWarAttackRecord));
*/

    guildWarBiz.getAttackRecordList(uwClient,userId,function(err,data){
        if(err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data,dsNameConsts.GuildWarAttackRecord));
    });
};

/**
 * 获取所有排名
 * @iface getGuildWarAllRank
 * @args
 * @param args
 * @param session
 * @param next
 * @returns ds.GuildWarAllRank
 */
proto.f = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    guildWarBiz.getGuildWarAllRank(uwClient,userId,function(err,data){
        if(err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data,dsNameConsts.GuildWarAllRank));
    });
};

/**
 * 获取上次排行
 * @iface getLastRankList
 * @args {groupId:"组别id"}
 * @param args
 * @param session
 * @param next
 * @returns ds.GuildWarAllRank
 */
proto.f1 = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_guildWar_getLastRankList_args ;
    var groupId = args[argsKeys.groupId];

    guildWarBiz.getLastRankList(uwClient,groupId,function(err,data){
        if(err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data,dsNameConsts.GuildWarAllRank));
    });
};


/**
 * 获取报名信息
 * @iface getSignUpData
 * @args {guildId:"行会id"}
 * @param args
 * @param session
 * @param next
 * @returns ds.SignData
 */
proto.g = function(args, session, next){
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_guildWar_getSignUpData_args ;
    var guildId = args[argsKeys.guildId];
    //userId,guildId
    guildWarBiz.getSignUpData(uwClient,userId,guildId,function(err,data){
        if(err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data,dsNameConsts.SignData));
    });
};

/**
 * 获取报名信息
 * @iface signUp
 * @args {groupId:"组别id"}
 * @param args
 * @param session
 * @param next
 * @returns groupId
 */
proto.g1 = function(args, session, next){
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_guildWar_signUp_args ;
    var groupId = args[argsKeys.groupId];
    //userId,guildId
    guildWarBiz.signUp(uwClient,userId,groupId,function(err,data){
        if(err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data));
    });
};

/**
 * 战斗开始
 * @iface fightStartDoor
 * @args {serverId:"服务器id",guildId:"guildId",door:"door"}
 * @param args
 * @param session
 * @param next
 * @returns ds.GuildFightData
 */
proto.h = function(args, session, next){
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_guildWar_fightStartDoor_args ;
    var serverId = args[argsKeys.serverId];
    var guildId = args[argsKeys.guildId];
    var door = args[argsKeys.door];
    //userId,guildId
    guildWarBiz.fightStartDoor(uwClient, userId, serverId, guildId, door,function(err,data){
        if(err) return next(null,wrapResult(err));
        next(null,wrapResult(null, data, dsNameConsts.GuildFightData));
    });
};

/**
 * 战斗结束
 * @iface fightEndDoor
 * @args {serverId:"服务器id",guildId:"guildId",door:"door",isWin:"isWin"}
 * @param args
 * @param session
 * @param next
 * @returns groupId
 */
proto.h1 = function(args, session, next){
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_guildWar_fightEndDoor_args ;
    var serverId = args[argsKeys.serverId];
    var guildId = args[argsKeys.guildId];
    var door = args[argsKeys.door];
    var isWin = args[argsKeys.isWin];
    //userId,guildId
    guildWarBiz.fightEndDoor(uwClient,userId,serverId, guildId, door,isWin ,function(err,data){
        if(err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data, dsNameConsts.FightResult));
    });
};

/**
 * 上阵
 * @iface upDoor
 * @args {door:"door"}
 * @param args
 * @param session
 * @param next
 * @returns groupId
 */
proto.i = function(args, session, next){
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_guildWar_upDoor_args ;
    var door = args[argsKeys.door];
    //userId,guildId
    guildWarBiz.upDoor(uwClient,userId,door,function(err,data){
        if(err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data));
    });
};

/**
 * 下阵
 * @iface downDoor
 * @args {door:"door"}
 * @param args
 * @param session
 * @param next
 * @returns groupId
 */
proto.i1 = function(args, session, next){
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_guildWar_downDoor_args ;
    var door = args[argsKeys.door];
    //userId,guildId
    guildWarBiz.downDoor(uwClient,userId, door,function(err,data){
        if(err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data));
    });
};

/**
 * 进入行会战
 * @iface enter
 * @args
 * @param args
 * @param session
 * @param next
 * @returns groupId
 */
proto.j = function(args, session, next){
    var userId = session.get(consts.session.userId);
    //userId,guildId
    guildWarBiz.enter(uwClient,userId,function(err,data){
        if(err) return next(null,wrapResult(err));
        next(null,wrapResult(null,data));
    });
};

/**
 * 清除cd
 * @iface clearCd
 * @args
 * @param args
 * @param session
 * @param next
 * @returns dsNameConsts.ExMyGuildWarData
 */
proto.j1 = function(args, session, next){
    var userId = session.get(consts.session.userId);
    //userId,guildId
    guildWarBiz.clearCd(uwClient,userId,function(err,data){
        if(err) return next(null,wrapResult(err));
        var userData = data[0];
        var costDiamond = data[1];
        var myGuildWarData = data[2];
        if(costDiamond>0){
            gameRecordSerial.add(userId,function(cb1){
                gameRecordBiz.setCostDiamondRecord(uwClient,userId,c_prop.diamondCostTypeKey.clearGuildWarCd,costDiamond,cb1);
            });
        }
        var exMyGuildWarData = new ds.ExMyGuildWarData();
        exMyGuildWarData.userData = userData;//用户信息
        exMyGuildWarData.myGuildWarData = myGuildWarData;//我的行会信息
        next(null,wrapResult(null,exMyGuildWarData,dsNameConsts.ExMyGuildWarData));
    });
};

/**
 * 鼓舞
 * @iface inspire
 * @args
 * @param args
 * @param session
 * @param next
 * @returns dsNameConsts.ExMyGuildWarData
 */
proto.j2 = function(args, session, next){
    var userId = session.get(consts.session.userId);
    //userId,guildId
    guildWarBiz.inspire(uwClient,userId,function(err,data){
        if(err) return next(null,wrapResult(err));
        var userData = data[0];
        var costDiamond = data[1];
        var myGuildWarData = data[2];
        if(costDiamond>0){
            gameRecordSerial.add(userId,function(cb1){
                gameRecordBiz.setCostDiamondRecord(uwClient,userId,c_prop.diamondCostTypeKey.inspireGuildWar,costDiamond,cb1);
            });
        }
        var exMyGuildWarData = new ds.ExMyGuildWarData();
        exMyGuildWarData.userData = userData;//用户信息
        exMyGuildWarData.myGuildWarData = myGuildWarData;//我的行会信息

        next(null,wrapResult(null,exMyGuildWarData,dsNameConsts.ExMyGuildWarData));
    });
};

/**
 * 同步数据
 * @iface syncData
 * @args {sceneType:"场景",attackData:"[服务器id ，行会id]"}
 * @param args
 * @param session
 * @param next
 * @returns dsNameConsts.GuildWarSyncData
 */
proto.k = function(args, session, next){
    var userId = session.get(consts.session.userId);
    var argsKeys = iface.a_guildWar_syncData_args ;
    var sceneType = args[argsKeys.sceneType];
    var attackData = args[argsKeys.attackData];

    //userId,guildId
    guildWarBiz.syncData(uwClient,userId,sceneType,attackData,function(err,data){
        if(err) return next(null,wrapResult(err));

        next(null,wrapResult(null,data,dsNameConsts.GuildWarSyncData));
    });
};

