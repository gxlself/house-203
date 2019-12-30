var express = require('express');
var expressWs = require('express-ws');
var router = express.Router();
var md5 = require('md5');
var { queryTodo } = require('../utils/sql') 
var { createToken, verify } = require('../utils/jwt')
var loginLogger = require('../utils/log').useLog('login')
var registerLogger = require('../utils/log').useLog('register')

expressWs(router);

router
  // 登陆路由
  .post('/login', function(req, res) {
    const username = md5(req.body.username)
    const password = md5(req.body.password)
    const queryLoginSql = `select username,password,o_username from m_users where username='${username}' and password='${password}';`
    loginLogger.trace(`系统登录SQL ====== ${queryLoginSql}`)
    // 系统登录
    queryTodo(queryLoginSql)
      .then(results => {
        if (results.length === 0) {
          res.send({code: 1, msg: '账号与密码不匹配', status: 200});
        } else {
          const currentUser = results[0]
          checkTokenInvalid(currentUser.o_username, res)
        }
      })
      .catch(err => {
        loginLogger.error(`登录出错-err.message ====== ${err.message}`)
        res.send({code: 2, msg: '数据库查询错误', status: 200});
      })
  })
  // 注册路由
  .post('/register', function(req, res) {
    const o_username = req.body.username
    const o_password = req.body.password
    const username = md5(o_username)
    const password = md5(o_password)
    const queryRegisterSql = `select username from m_users where username='${username}';`
    registerLogger.trace(`用户注册进行唯一校验 ====== ${queryRegisterSql}`)
    queryTodo(queryRegisterSql)
      .then(results => {
        if (results.length === 0) { // 可以注册
          // 生成token 并进行存取
          const newToken = createToken({username: o_username})
          const t = newToken.split('.')
          saveUserInfo(username, password, o_username, o_password, 1, res,  t[2], newToken)
        } else {
          res.send({code: 1, msg: '该账号已被占用', status: 200});
        }
      })
      .catch(err => {
        registerLogger.error(`用户注册出错-err ====== ${err.message}`)
        res.send({code: 2, msg: '数据库查询错误', status: 200});
      })
  })

  
// 校验token值 有效期直接返回 否则重新生成
function checkTokenInvalid(username, res) {
  const queryToken = `SELECT * FROM m_token WHERE username='${username}'`
  loginLogger.trace(`登录查找token-SQL ====== ${queryToken}`)
  queryTodo(queryToken)
    .then(results => {
      if (results.length === 0) {
        saveToToken (username, res)
      } else {
        let token = results[0].token
        let a_token = results[0].a_token
        verify(a_token)
          .then(ver => {
            if (ver.username === username) {
              res.send({ code: 0, msg: 'ok', status: 200, data: { token, username } });
            } else {
              saveToToken (username, res, false)
            }
          })
          .catch(err => {
            // token出错后 再次更新
            saveToToken (username, res, false)
          })
      }
    })
    .catch(err => {
      res.send({ code: -1, msg: err.message, status: 200, data: null });
    })
}
// 注册的用户进行存储
function saveUserInfo(md5User, md5Pass, username, password, loginStatus = 1, res, token, newAllToken) {

  const saveUserInfoSql = `INSERT INTO m_users VALUES('${md5User}', '${md5Pass}', '${username}', '${password}', ${loginStatus})`
  registerLogger.trace(`用户注册-SQL ====== ${saveUserInfoSql}`)
  queryTodo(saveUserInfoSql)
    .then(results => {
      registerLogger.trace(`用户注册成功 ====== ${username}`)
      res.send({code: 0, msg: '注册成功', status: 200, data: { token, username }});
    })
    .catch(err => {
      registerLogger.error(`用户注册失败-err ====== ${err.message}`)
      res.send({code: -1, msg: '注册失败', status: 200});
    })

  const saveNewTokenSql = `INSERT INTO m_token VALUES('${token}', '${newAllToken}', '${username}')`
  registerLogger.trace(`用户注册Token存储-SQL ====== ${saveNewTokenSql}`)
  queryTodo(saveNewTokenSql)
    .then(results => {})
    .catch(err => {
      registerLogger.error(`用户注册Token存储 ====== ${err.message}`)
    })
}
// 存储token值 isInsert true 是新增token false 为更细token
function saveToToken(username, res, isInsert = true) {
  let newAllToken = createToken({ username });
  let t = newAllToken.split('.')
  let token = t[2]
  let saveTokenSql = ''
  if (isInsert) {
    saveTokenSql = `INSERT INTO m_token VALUES('${token}', '${newAllToken}', '${username}')`
  } else {
    saveTokenSql = `UPDATE m_token SET a_token='${newAllToken}', token='${token}' WHERE username='${username}'`
  }
  loginLogger.trace(`存储token值-SQL ====== ${saveTokenSql}`)
  queryTodo(saveTokenSql)
    .then(results => {
      res && res.send({
        code: 0, 
        msg: 'ok', 
        status: 200, 
        data: { token, username }
      });
    })
    .catch(err => {
      loginLogger.error(`存储token值 ====== ${err.message || '失败，请重试'}`)
      res.send({code: -1, msg: '失败，请重试', status: 200});
    })
}

module.exports = router;