var exports = module.exports;
var consts  = require("uw-data").consts;

var cmdJs = require('cmdjs');
var fs = cmdJs.fs2;
var path = cmdJs.path2;
var strUtils = cmdJs.strUtils;

var envCfgDir =  path.join(__dirname, "env-cfg/");
var tmpProjDir =  path.join(__dirname, "template/");
var outDir = path.join(__dirname, "");

exports.resetMain = function() {
    var cfg = require(path.join(envCfgDir,"main_cfg.js"));
    _resetProject(cfg);
    _resetLog(cfg);
    _resetDb(cfg);
};

exports.resetGuildWar = function() {
    var cfg = require( path.join(envCfgDir,"guild_war_cfg.js"));
    _resetProject(cfg);
    _resetLog(cfg);
    _resetDb(cfg);
};

exports.resetServer = function() {
    var cfg = require( path.join(envCfgDir,"server_cfg.js"));
    //_resetMaster(cfg);
    //_resetServer(cfg);
    _resetLog(cfg);
    _resetDb(cfg);
    _resetProject(cfg);
};

exports.resetView = function() {
    var cfg = require( path.join(envCfgDir,"view_cfg.js"));
    _resetProject(cfg);
    _resetLog(cfg);
    _resetDb(cfg);
};

exports.resetMonitor = function() {
    var cfg = require( path.join(envCfgDir,"monitor_cfg.js"));
    _resetProject(cfg);
    _resetLog(cfg);
};


var _resetDb = function(cfg){
    var serverCnn = cfg.serverCnn||{};
    var mainCnn = cfg.mainCnn||{};
    var kefuCnn = cfg.kefuCnn||{};
    var loginCnn = cfg.loginCnn||{};
    var placeDbObj = {
        uwCnn_host:serverCnn.host||"",
        uwCnn_port:serverCnn.port||"",
        uwCnn_user:serverCnn.user||"",
        uwCnn_password:serverCnn.password||"",
        uwCnn_database:serverCnn.database||"",
        mainCnn_host:mainCnn.host||"",
        mainCnn_port:mainCnn.port||"",
        mainCnn_user:mainCnn.user||"",
        mainCnn_password:mainCnn.password||"",
        mainCnn_database:mainCnn.database||"",
        kefuCnn_host:kefuCnn.host||"",
        kefuCnn_port:kefuCnn.port||"",
        kefuCnn_user:kefuCnn.user||"",
        kefuCnn_password:kefuCnn.password||"",
        kefuCnn_database:kefuCnn.database||"",
        loginCnn_host:loginCnn.host||"",
        loginCnn_port:loginCnn.port||"",
        loginCnn_user:loginCnn.user||"",
        loginCnn_password:loginCnn.password||"",
        loginCnn_database:loginCnn.database||""
    };
    var handlerMap = {
        '.template1' : function(srcPath, dstPath){
            handleTemplate(tmpProjDir, outDir, srcPath, placeDbObj)
        }
    };
    fs.copySync(tmpProjDir, outDir, handlerMap);
};

var _resetLog = function(cfg){
    var placeLogObj = {
        basePath:cfg.log.basePath,
        levels:cfg.log.levels
    };

    var handlerMap = {
        '.template2' : function(srcPath, dstPath){
            handleTemplate(tmpProjDir, outDir, srcPath, placeLogObj)
        }
    };
    fs.copySync(tmpProjDir, outDir, handlerMap);
};

var _resetProject = function(cfg){
    var placeProjectObj = {
        mainHttpPort:cfg.mainHttpPort||"",
        serverHttpPort:cfg.serverHttpPort||"",
        guildWarHttpPort:cfg.guildWarHttpPort||"",
        viewHttpPort:cfg.viewHttpPort||"",
        monitorHttpPort:cfg.monitorHttpPort||"",
        notify_url:cfg.notify_url||"",
        serverId:cfg.id||"",
        bonusShareUrl:cfg.bonusShareUrl||"",
        gameId:cfg.gameId||100220,
        cpuWorkers:cfg.cpuWorkers||0
    };
    var handlerMap = {
        '.template5' : function(srcPath, dstPath){
            handleTemplate(tmpProjDir, outDir, srcPath, placeProjectObj)
        }
    };
    fs.copySync(tmpProjDir, outDir, handlerMap);
};

var _resetMaster = function(cfg){
    var placeProjectObj = {
        id:cfg.id||"",
        host:cfg.master.host||"",
        port:cfg.master.port||""
    };
    var handlerMap = {
        '.template4' : function(srcPath, dstPath){
            handleTemplate(tmpProjDir, outDir, srcPath, placeProjectObj)
        }
    };
    fs.copySync(tmpProjDir, outDir, handlerMap);
};

var _resetServer = function(cfg){
    var placeProjectObj = {
        id:cfg.id||"",
        c_host:cfg.connector.host||"",
        c_port:cfg.connector.port||"",
        c_clientPort:cfg.connector.clientPort||"",
        c_cpu:cfg.connector.cpu==null? "":cfg.connector.cpu,
        a_host:cfg.area.host||"",
        a_port:cfg.area.port||"",
        a_cpu:cfg.area.cpu==null? "":cfg.area.cpu
    };
    var handlerMap = {
        '.template6' : function(srcPath, dstPath){
            handleTemplate(tmpProjDir, outDir, srcPath, placeProjectObj)
        }
    };
    fs.copySync(tmpProjDir, outDir, handlerMap);
};

function handleTemplate(srcRoot, dstRoot, srcPath, phInfo){
    var extname = path.extname(srcPath);
    var relativePath = path.relative(srcRoot, srcPath);
    var basename = path.basename(relativePath, extname);
    relativePath = path.join(path.dirname(relativePath), basename);
    var dstPath = path.join(dstRoot, relativePath);
    var dirname = path.dirname(dstPath);
    fs.mkdirSync2(dirname);//创建目录
    var content = fs.readFileSync(srcPath).toString();
    content = strUtils.formatPlaceholder(content, phInfo);

    fs.writeFileSync(dstPath, content);//copy if it`s a file
}

function mergeObj(src, dst){
    var src = src || {};
    for (var key in dst) {
        if(key.indexOf('_desc') > 0 && key.indexOf('_desc') == key.length - '_desc'.length) continue;
        var srcObj = src[key];
        var dstObj = dst[key];
        if(dstObj instanceof Array){
            src[key] = dstObj;
        }else if(typeof dstObj == 'object'){
            src[key] = mergeObj(srcObj, dstObj);
        }else {
            src[key] = dstObj;
        }
    }
    return src;
}
function getEnv(){
    var env = require('./env-cfg.js');
    try{
        var my_env = require('./my-env-cfg.js');
        return mergeObj(env, my_env);
    }catch(e){
        return env;
    }
}
function getConfig(){
    var env = getEnv();
    var cfg = env.config[env.name];
    var result = {};
    for(var key in env){
        if(key == 'config') continue;
        if(key.indexOf('_desc') > 0 && key.indexOf('_desc') == key.length - '_desc'.length) continue;
        result[key] = env[key];
    }
    return mergeObj(result, cfg);
}
