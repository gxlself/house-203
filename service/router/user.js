var express = require('express');
var expressWs = require('express-ws');
var router = express.Router();
var md5 = require('md5');
var { sqlTodo } = require('../utils/sql') ;
var jwt = require('jsonwebtoken');
var { sign } = require('../config/config');
var userLogger = require('../utils/log').useLog('user');
var loginoutLogger = require('../utils/log').useLog('loginout');
expressWs(router);

router
  .ws('/', function (ws, req){
    console.log('111111')

    loginLogger.trace(`链接ws ====== /user`)
    ws.on('message', function (msg) {
      ws.send('123');
    })
  })
  /* 登出 */
  .get('/loginout', function(req, res, next) {
    var requestAuthorization = req.headers.authorization.split(',')[0]
    var requestUsername = req.headers.authorization.split(',')[1]
    const delDataSql = `DELETE FROM m_token WHERE token='${requestAuthorization}' && username='${requestUsername}'`
    const updateLoginStatusSql = `UPDATE m_users SET login_status=1 WHERE username='${requestAuthorization}'`
    // 删除token
    sqlTodo(delDataSql, result =>{
      loginoutLogger.trace(`登出-SQL ====== ${delDataSql}`)
      res.send({code: 0, msg: '退出成功', status: 200});
    }, err => {
      loginoutLogger.error(`更改登录状态err ====== ${err.message}`)
      res.send({code: -1, msg: '退出成功', status: 200});
    })
    // 更改登录状态
    sqlTodo(updateLoginStatusSql, result =>{
      loginoutLogger.trace(`更改登录状态-SQL ====== ${updateLoginStatusSql}`)
      res.send({code: 0, msg: '更改登录状态', status: 200});
    }, err => {
      loginoutLogger.error(`更改登录状态err ====== ${err.message}`)
      res.send({code: -1, msg: '更改登录失败', status: 200});
    })
  });

module.exports = router;