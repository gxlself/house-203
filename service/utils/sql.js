const mysql = require('mysql');
const { sql } = require('../config/config')
const onlineLogger = require('./log').useLog('online')
// 查询
const sqlTodo = function(select, success, fail) {
  // 实例连接数据库
  const connection = mysql.createConnection(sql)
  connection.connect();
  connection.query(select, function (error, results, fields) {
    if (error) {
      typeof fail === 'function' && fail(error)
    } else {
      typeof success === 'function' && success(results, fields)
    }
    connection.end();
  });
}
// 在线、离线状态修改
const onlineStatusUpdate = function(status, username) {
  const updateStatusSql = `UPDATE m_users SET login_status=${status} WHERE o_username=${username}`
  sqlTodo(updateStatusSql, results => {
    onlineLogger.trace(`登录状态修改SQL ====== ${updateStatusSql}`)
    onlineLogger.trace(`登录状态修改 ====== ${status === 1 ? '在线' : '离线'}`)
  }, error => {
    onlineLogger.error(`登录状态修改失败error ====== ${error.message}`)
  })
}
module.exports = {
  sqlTodo,
  onlineStatusUpdate
}