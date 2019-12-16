var express = require('express');
var expressWs = require('express-ws');
var router = express.Router();
var { sqlTodo, onlineStatusUpdate, queryTodo } = require('../utils/sql') ;
var { NOT_ONLINR_STATUS } = require('../config/config');
var userLogger = require('../utils/log').useLog('user');
var loginoutLogger = require('../utils/log').useLog('loginout');
expressWs(router);

let userConnects = new Map()

router
  .ws('/user', function (ws, req){
    let conUser = req.query.authorization.split(',')[1]
    userLogger.trace(` ${conUser}建立连接 ====== just is connect`)
    ws.on('message', function (msg) {
      let requestUsername = conUser
      let getMsg = JSON.parse(msg)
      userConnects.set(requestUsername, ws)
      ws.on('close', function(msg) {
        userConnects.set(requestUsername, null)
      })
      switch(getMsg.type) {
        case 'getUserInfo':
          sendUserInfo(ws, getMsg)
          break;
        case 'groupChat':
          sendChatInfo(ws, requestUsername, getMsg)
          break;
        default: 
          console.log('-----default----')
          break;
      }
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
  
const sendChatInfo = function(ws, requestUsername, getMsg) {
  let chatOption = {
    code: 0,
    data: {
      type: getMsg.type,
      groupId: getMsg.groupId,
      from: getMsg.user,
      user: requestUsername,
      content: {
        type: getMsg.content.type,
        default: getMsg.content.default
      },
      timerstamp: new Date().getTime()
    },
    msg: "发送消息成功"
  }
  // ws.send(JSON.stringify(chatOption));
  boardcast(chatOption)
  chatOption = null;
}
const sendUserInfo = function(ws, getMsg) {
  const queryGroupUserSql = `SELECT username, avator FROM m_group WHERE group_id = ${getMsg.groupId}`
  queryTodo(queryGroupUserSql).then(res => {
    let userOption = {
      code: 0,
      data: {
        type: getMsg.type,
        users: res,
        timerstamp: new Date().getTime()
      },
      msg: "发送消息成功"
    }
    ws.send(JSON.stringify(userOption));
    userOption = null;
  })
}

const boardcast = function(option) {
  for (let [user, connect] of userConnects) {
    if (connect && connect.readyState === 1) {
      connect.send(JSON.stringify(option))
    } 
  }
}

module.exports = router;