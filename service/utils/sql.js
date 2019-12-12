const mysql = require('mysql');
const { sql } = require('../config/config')

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

module.exports = {
  sqlTodo
}