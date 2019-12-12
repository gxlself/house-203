var express = require('express');
var expressWs = require('express-ws');
var router = express.Router();
var md5 = require('md5');
var { sqlTodo } = require('../utils/sql') 
var jwt = require('jsonwebtoken');
var { sign } = require('../config/config')
var loginLogger = require('../utils/log').useLog('login')
var registerLogger = require('../utils/log').useLog('register')
expressWs(router);

router
  .post('/login', function(req, res) {
    const username = md5(req.body.username)
    const password = md5(req.body.password)
    const queryLoginSql = `select username,password,o_username from m_users where username='${username}' and password='${password}';`
    loginLogger.trace(`系统登录SQL ====== ${queryLoginSql}`)
    sqlTodo(queryLoginSql, (results, fields) => {
      if (results.length === 0) {
        res.send({code: 1, msg: '账号与密码不匹配', status: 200});
      } else {
        const currentUser = results[0]
        // 生成token 并进行存取
        jwt.sign({username: currentUser.o_username}, sign, function(err, token) {
          const t = token.split('.')
          const queryToken = `SELECT username FROM m_token WHERE username='${currentUser.o_username}'`
          loginLogger.trace(`登录查找token-SQL ====== ${queryToken}`)
          sqlTodo(queryToken, results => {
            if (results.length == 0) {
              saveToToken(token, t[2], currentUser.o_username, res)
            } else {
              updateToken(token, t[2], currentUser.o_username, res)
            }
          }, err => {
            loginLogger.error(`登录查找token ====== ${err.message || '数据库错误， 请稍候再试'}`)
            res.send({code: -2, msg: '数据库错误， 请稍候再试', status: 200});
          })
        })
      }
    }, err => {
      loginLogger.error(`登录出错-SQL ====== ${queryLoginSql}`)
      loginLogger.error(`登录出错-err.message ====== ${err.message}`)
      res.send({code: 2, msg: '数据库查询错误', status: 200});
    })
  })
  .post('/register', function(req, res) {
    const o_username = req.body.username
    const o_password = req.body.password
    const username = md5(o_username)
    const password = md5(o_password)
    const queryRegisterSql = `select username from m_users where username='${username}';`
    registerLogger.trace(`用户注册进行唯一校验 ====== ${queryRegisterSql}`)
    sqlTodo(queryRegisterSql, (results, fields) => {
      if (results.length === 0) { // 可以注册
        // 生成token 并进行存取
        jwt.sign({username: req.body.username}, sign, function(err, token) {
          const t = token.split('.')
          saveUserInfo(username, password, o_username, o_password, 1, res,  t[2])
          saveToToken(token, t[2], req.body.username, null)
        })
      } else {
        res.send({code: 1, msg: '该账号已被占用', status: 200});
      }
    }, err => {
      registerLogger.error(`用户注册出错-SQL ====== ${queryRegisterSql}`)
      registerLogger.error(`用户注册出错-err ====== ${err.message}`)
      res.send({code: 2, msg: '数据库查询错误', status: 200});
    })
  })
// 注册的用户进行存储
function saveUserInfo(md5User, md5Pass, username, password, loginStatus = 1, res, token) {
  const saveUserInfoSql = `INSERT INTO m_users VALUES('${md5User}', '${md5Pass}', '${username}', '${password}', ${loginStatus})`
  sqlTodo(saveUserInfoSql, results => {
    registerLogger.trace(`用户注册成功 ====== ${username}`)
    res.send({code: 0, msg: '注册成功', status: 200, data: { token, username }});
  }, err => {
    registerLogger.error(`用户注册失败-SQL ====== ${saveUserInfoSql}`)
    registerLogger.error(`用户注册失败-err ====== ${err.message}`)
    res.send({code: -1, msg: '注册失败', status: 200});
  })
}
// 存储token值
function saveToToken (a_token, token, username, res) {
  const saveTokenSql = `INSERT INTO m_token VALUES('${token}', '${a_token}', '${username}')`
  loginLogger.trace(`存储token值-SQL ====== ${saveTokenSql}`)
  sqlTodo(saveTokenSql, results => {
    res && res.send({
      code: 0, 
      msg: 'ok', 
      status: 200, 
      data: { token, username }
    });
  }, err => {
    loginLogger.error(`存储token值-SQL ====== ${err.message || '失败，请重试'}`)
    res.send({code: -1, msg: '失败，请重试', status: 200});
  })
}
// 更新token值
function updateToken(a_token, token, username, res) {
  const updateTokenSql = `UPDATE m_token SET a_token='${a_token}',token='${token}',username='${username}'`
  loginLogger.trace(`存储token值-SQL ====== ${updateTokenSql}`)
  sqlTodo(updateTokenSql, results => {
    res.send({
      code: 0, 
      msg: 'ok', 
      status: 200, 
      data: { token, username }
    });
  }, err => {
    loginLogger.error(`更新token值-SQL ====== ${err.message || '失败，请重试'}`)
    res.send({code: -1, msg: '失败，请重试', status: 200});
  })
}

module.exports = router;