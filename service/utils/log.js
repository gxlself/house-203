let log4js = require('log4js');

/**
 * 日志配置
 */
exports.configure = function() {
  log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
    categories: { default: { appenders: ['cheese'], level: 'trace' } }
  });    
}

/**
 * 用于express中间件，调用该方法前必须确保已经configure过
 * @returns {Function|*}
 */
exports.useLog = function(name) {
  return log4js.getLogger(name);
} 