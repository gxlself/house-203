var express = require('express');
var expressWs = require('express-ws');
var router = express.Router();
var { sqlTodo, onlineStatusUpdate } = require('../utils/sql') ;
var { NOT_ONLINR_STATUS } = require('../config/config');
var userLogger = require('../utils/log').useLog('user');
var loginoutLogger = require('../utils/log').useLog('loginout');
expressWs(router);

router
  .ws('/user', function (ws, req){
    console.log('/user is ws connected', ws)
    userLogger.trace(`链接ws ====== /user`)
    ws.on('message', function (msg) {
      console.log(msg)
      ws.send('{test: true}');
    })
  })
  /* 登出 */
  .post('/loginout', function(req, res, next) {
    let requestAuthorization = req.headers.authorization.split(',')[0]
    let requestUsername = req.headers.authorization.split(',')[1]
    const delDataSql = `DELETE FROM m_token WHERE token='${requestAuthorization}' && username='${requestUsername}'`
    // 修改在线状态
    onlineStatusUpdate(NOT_ONLINR_STATUS, requestUsername)
    // 删除token
    sqlTodo(delDataSql, result =>{
      loginoutLogger.trace(`登出-SQL ====== ${delDataSql}`)
      res.send({code: 0, msg: '退出成功', status: 200});
    }, err => {
      loginoutLogger.error(`更改登录状态err ====== ${err.message}`)
      res.send({code: -1, msg: '退出成功', status: 200});
    })
  })

module.exports = router;