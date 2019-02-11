/**
 * Created by Sara on 2015/5/28.
 */

var wrapResult = require('uw-utils').wrapResultFunc(__filename);
var propUtils = require('uw-utils').propUtils;
var consts = require("uw-data").consts;
var dsNameConsts = require("uw-data").dsNameConsts;
var iface = require("uw-data").iface;
var guildWarSyncBiz = require("uw-guild-war-sync").guildWarSyncBiz;
var uwClient = require("uw-db").uwClient;
var ds = require("uw-ds").ds;
var c_prop = require("uw-data").c_prop;
var g_guildWar = require("uw-global").g_guildWar;
var proto = module.exports;

/**
 * 添加服务器
 * @iface getSyncServer
 * @args {curServerData:"[serverGroupId,serverId,serverHost,serverPort]"}
 * @param args
 * @param session
 * @param next
 * @returns 0
 */
proto.a = function (args, session, next) {
    var data = {};
    data.__mainWarData = g_guildWar.getMainWarData();
    data.__guildWarObjDic = g_guildWar.getGuildWarObjDic();
    data.__otherServerSyncObj = g_guildWar.getOtherServerSyncObj();
    data.__serverData = g_guildWar.getServerData();
    next(null,wrapResult(null,data));
};
