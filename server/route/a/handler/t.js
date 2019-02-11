/**
 * Created by Sara on 2015/10/6.
 */
var wrapResult = require('uw-utils').wrapResultFunc(__filename);
var propUtils = require('uw-utils').propUtils;
var consts = require("uw-data").consts;
var c_prop = require("uw-data").c_prop;
var dsNameConsts = require("uw-data").dsNameConsts;
var iface = require("uw-data").iface;
var taskBiz = require("uw-task").taskBiz;
var ds = require("uw-ds").ds;
var uwClient = require("uw-db").uwClient;
var gameRecordBiz = require("uw-game-record").gameRecordBiz;
var gameRecordSerial = require("uw-serial").gameRecordSerial;
var g_data = require("uw-global").g_data;

var proto = module.exports;

/**
 * 初始化数据
 * @iface getInfo
 * @args
 * @param args
 * @param session
 * @param next
 */
proto.a = function (args, session, next) {
    var userId = session.get(consts.session.userId);
    //接口调用
    taskBiz.getInfo(uwClient,userId,function(err,data){
        if (err) return next(null,wrapResult(err));
        var exData = new ds.ExTask();
        exData.taskData = data;
        exData.updateId = g_data.getTaskUpdateId();
        next(null,wrapResult(null,exData,dsNameConsts.ExTask));
    });
};

/**
 * 任务奖励领取
 * @iface taskAward
 * @args {taskId:"任务id"}
 * @isWorker 1
 * @param args
 * @param session
 * @param next
 */
proto.b = function (args, session, next) {
    var argsKeys = iface.a_task_taskAward_args;
    var userId = session.get(consts.session.userId);
    var taskId = args[argsKeys.taskId];
    //接口调用
    taskBiz.taskAward(uwClient,userId,taskId,function(err,data){
        if (err) return next(null,wrapResult(err));
        var getDiamond = data[6];
        if(getDiamond>0){
            gameRecordSerial.add(userId,function(cb1){
                gameRecordBiz.setDiamondRecord1(uwClient,userId,c_prop.diamondGetTypeKey.task,getDiamond,cb1);
            });
        }
        var exData = new ds.ExUserData();
        exData.userData = data[0];
        exData.taskData = data[1];
        exData.items = data[2];
        exData.vitality = data[3];
        exData.bagItems = data[4];
        exData.equipBagItems = data[5];
        next(null,wrapResult(null,exData,dsNameConsts.ExUserData));
    });
};

/**
 * 领取活跃度宝箱
 * @iface getVitalityChest
 * @args {index:"宝箱下标"}
 * @isWorker 1
 * @param args
 * @param session
 * @param next
 */
proto.c = function (args, session, next) {
    var argsKeys = iface.a_task_getVitalityChest_args;
    var userId = session.get(consts.session.userId);
    var index = args[argsKeys.index];
    //接口调用
    taskBiz.getVitalityChest(uwClient,userId,index,function(err,data){
        if (err) return next(null,wrapResult(err));
        var getDiamond = data[5];
        if(getDiamond>0){
            gameRecordSerial.add(userId,function(cb1){
                gameRecordBiz.setDiamondRecord1(uwClient,userId,c_prop.diamondGetTypeKey.task,getDiamond,cb1);
            });
        }
        var exData = new ds.ExUserData();
        exData.userData = data[0];
        exData.taskData = data[1];
        exData.items = data[2];
        exData.bagItems = data[3];
        exData.equipBagItems = data[4];
        next(null,wrapResult(null,exData,dsNameConsts.ExUserData));
    });
};