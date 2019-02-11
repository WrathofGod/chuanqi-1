/**
 * Created by John on 2016/4/7.
 */
var wrapResult = require('uw-utils').wrapResultFunc(__filename);
var propUtils = require('uw-utils').propUtils;
var consts = require("uw-data").consts;
var dsNameConsts = require("uw-data").dsNameConsts;
var iface = require("uw-data").iface;
var coffersBiz = require("uw-coffers").coffersBiz;
var uwClient = require("uw-db").uwClient;
var ds = require("uw-ds").ds;
var c_prop = require("uw-data").c_prop;
var gameRecordBiz = require("uw-game-record").gameRecordBiz;
var gameRecordSerial = require("uw-serial").gameRecordSerial;
var g_coffers = require("uw-global").g_coffers;
var chatBiz = require("uw-chat").chatBiz;
var project = require("uw-config").project;
var proto = module.exports;

/**
 * 发送跨服消息（小喇叭）
 * @iface serversChat
 * @args {nickName:"玩家参数",vip:"",content:"",isGM:"",guildName:"",medalTitle:"",isLittleHorn:""}
 * @param args
 * @param session
 * @param next
 * @returns [nickName]
 */
proto.a = function (args, session, next) {
    var argsKeys = iface.admin_chat_serversChat_args ;
    var nickName = args[argsKeys.nickName];
    var vip = args[argsKeys.vip];
    var content = args[argsKeys.content];
    var isGM = args[argsKeys.isGM];
    var guildName = args[argsKeys.guildName];
    var medalTitle = args[argsKeys.medalTitle];
    var isLittleHorn = args[argsKeys.isLittleHorn];
    chatBiz.addServersChat(nickName, vip, content, isGM, guildName, medalTitle, isLittleHorn);
    next(null,wrapResult(null,project.serverId));
};