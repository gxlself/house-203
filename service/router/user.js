var express = require('express');
var expressWs = require('express-ws');
var router = express.Router();
var { queryTodo } = require('../utils/sql') ;
var { currentTime } = require('../utils/utils')
var userLogger = require('../utils/log').useLog('user');
var chatLogger = require('../utils/log').useLog('chat');
expressWs(router);

let userConnects = new Map()

router

  .ws('/user', function(ws, req) {
    let conUser = req.query.authorization.split(',')[1]
    userLogger.trace(` ${conUser}建立连接 ====== just is connect`)
    // 解除10个监听的警告
    ws.setMaxListeners(0)
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
              sendUserInfo(userConnects.get(requestUsername), getMsg)
              break;
            case 'groupChat':
              sendChatInfo(requestUsername, getMsg)
              break;
            default: 
              console.log('-----default----')
              break;
          }
        })
    })
  })
  .post('/user/chatlist', function(req, res) {
    const option = req.body
    const queryCacheChatSql = `SELECT * FROM m_cache_chat WHERE group_id=${option.groupId} ORDER BY TIMESTAMP DESC LIMIT ${(option.page - 1) * option.size}, ${option.page * option.size};`
    const queryCountSql = `SELECT COUNT(*) AS COUNT FROM m_cache_chat WHERE group_id=${option.groupId};`
    chatLogger.trace(`查询聊天记录(${option.chatType}-groupId is ${option.groupId ? option.groupId : ''})-SQL ====== ${queryCacheChatSql}`)
    chatLogger.trace(`查询聊天记录数量-SQL ====== ${queryCountSql}`)
    Promise.all([queryTodo(queryCacheChatSql), queryTodo(queryCountSql)])
      .then(values => {
        let chatList = values[0].map(chat => {
          let newChatObj = {
            type: chat.chat_type,
            groupId: chat.group_id,
            from: chat.from_user,
            content: {
              type: chat.chat_content_type,
              default: chat.chat_content.toString()
            },
            timerstamp: chat.timerstamp
          }
          return newChatObj
        })
        res.send({
          code: 0,
          data: {
            chats: chatList.reverse(),
            count: values[1][0].COUNT
          },
          msg: '查询成功'
        })
      })
      .catch(error => {
        res.send({ code: -1, data: null, msg: error.message})
      })
  })
  .ws('/game', function(ws, req) {
    let conUser = req.query.authorization.split(',')[1]
    let gameConnects = new Map()
    ws.on('message', function(a, b, c) {
      console.log('a ', a)
      console.log('b ', b)
      console.log('c ', c)
      gameConnects.set(conUser, ws)
      let count = 0
      for (let [user, gamer] in gameConnects) {
        let inter = setInterval(() => {
          if (count > 15) {
            clearInterval(inter)
          }
          count++
          gamer.send(`{"code": 1, "data": "123456"}`)
        }, 1000);
      }
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
function sendChatInfo(requestUsername, getMsg) {
  let timerstamp = currentTime()
  const userChatSql = `INSERT INTO m_cache_chat (from_user, to_user, chat_type, chat_content, chat_content_type, group_id, timestamp) VALUES('${requestUsername}', '', '${getMsg.type}', '${getMsg.content.default}', '${getMsg.content.type}', ${getMsg.groupId}, '${timerstamp}')`
  chatLogger.trace(`${requestUsername}发送消息成功SQL ====== ${userChatSql}`)
  queryTodo(userChatSql)
    .catch(err => {
      chatLogger.error(`${requestUsername}发送消息失败 ====== ${err.message}`)
    })
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
      timerstamp: timerstamp
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
  let timerstamp = currentTime()
  queryTodo(queryGroupUserSql).then(res => {
    let userOption = {
      code: 0,
      data: {
        type: getMsg.type,
        users: res,
        timerstamp: timerstamp
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
    } else {
      // 开始存入离线聊天信息队列
      // saveNoOnlineInfo()
    }
  }
}

module.exports = router;