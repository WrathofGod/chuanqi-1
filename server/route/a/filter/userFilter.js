
var pomelo = require('pomelo');
var wrapResult = require('uw-utils').wrapResultFunc(__filename);
var c_msgCode = require("uw-data").c_msgCode;
var consts  = require("uw-data").consts;
module.exports = function() {
	return new Filter();
};

var Filter = function() {
};

/**
 * 过滤器
 */
Filter.prototype.before = function(msg, session, next){
    var accountId = session.get(consts.session.accountId);
    if(!accountId){
        return next(new Error('session.accountId 为空'), wrapResult(c_msgCode.noLogin));
    }
    next();
};