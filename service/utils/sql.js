const mysql = require('mysql');
const { sql } = require('../config/config')
const onlineLogger = require('./log').useLog('online')
// 查询
const sqlTodo = function(sqlSentence, success, fail) {
  // 实例连接数据库
  const connection = mysql.createConnection(sql)
  connection.connect();
  connection.query(sqlSentence, function (error, results, fields) {
    if (error) {
      typeof fail === 'function' && fail(error)
    } else {
      typeof success === 'function' && success(results, fields)
    }
    connection.end();
  });
}
const queryTodo = function(sqlSentence) {
  return new Promise(function(resolve, reject) {
    // 实例连接数据库
    const connection = mysql.createConnection(sql)
    connection.connect();
    connection.query(sqlSentence, function (error, results, fields) {
      if (error) {
        reject(error)
      } else {
        resolve(results, fields)
      }
      connection.end();
    })
  })
}
// 在线、离线状态修改
const onlineStatusUpdate = function(status, username) {
  const updateStatusSql = `UPDATE m_users SET login_status=${status} WHERE o_username='${username}'`
  queryTodo(updateStatusSql).then((results, fields) => {
    onlineLogger.trace(`登录状态修改为${status === 1 ? '在线' : '离线'}-SQL ====== ${updateStatusSql}`)
  }).catch(error => {
    onlineLogger.error(`登录状态修改失败error ====== ${error.message}`)
  })
}

module.exports = {
  sqlTodo,
  onlineStatusUpdate,
  queryTodo
}