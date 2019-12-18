var express = require('express');
var expressWs = require('express-ws');
var router = express.Router();
var { queryTodo } = require('../utils/sql') ;
var userLogger = require('../utils/log').useLog('user');
expressWs(router);

let userConnects = new Map()

router
  .ws('/user', function (ws, req){
    let conUser = req.query.authorization.split(',')[1]
    userLogger.trace(` ${conUser}建立连接 ====== just is connect`)
    // 解除10个监听的警告
    ws.setMaxListeners(0)
    // console.log('getMaxListeners is ', ws.getMaxListeners())
    // console.log('ws.listenerCount is ', ws.listenerCount())
    // console.log('ws.listeners is ', ws.listeners())
    ws.on('message', function (msg) {
      let requestUsername = conUser
      let getMsg = JSON.parse(msg)
      // 给连接的人发送消息
      checkConnectState(requestUsername)
        .then(connect => {
          if (!connect) {
            userConnects.set(requestUsername, ws)
            ws.on('close', function(msg) {
              userConnects.set(requestUsername, null)
            })
          } else {
            ws.off()
            ws.removeAllListeners()
            ws = null;
            // 给不在连接状态的人进行消息队列保存 以便上线后进行信息推送
          }
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
  })
// 判断当前连接对象是否还连接状态
function checkConnectState(username) {
  return new Promise((resolve, reject) => {
    try{
      let curConnect =  userConnects.get(username);
      if (curConnect) {
        resolve( curConnect.readyState === curConnect.CLOSED || curConnect.readyState === curConnect.CLOSING )
      } else {
        resolve(false)
      }
    } catch(e) {
      reject(e)
    }
  })
}
// 发送聊天信息
function sendChatInfo(ws, requestUsername, getMsg) {
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
  boardcast(chatOption, getMsg.groupId)
  chatOption = null;
}
// 发送用户信息
function sendUserInfo(ws, getMsg) {
  const queryGroupUserSql = `SELECT username, avator FROM m_group WHERE group_id = ${getMsg.groupId}`
  userLogger.trace(`群用户信息-SQL ====== ${queryGroupUserSql}`)
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
// 信息分发
function boardcast(option, groupId) {
  for (let [user, connect] of userConnects) {
    if (connect && connect.readyState === 1) {
      connect.send(JSON.stringify(option))
    } 
  }
}

module.exports = router;