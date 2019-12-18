const jwt = require('jsonwebtoken');
var { sign } = require('../config/config')

const createToken = (content) => {
  return jwt.sign(content, sign, {
    expiresIn: 60 * 60 * 24 * 2  // 48小时过期
  }) 
}

const verify = (token) => {
  return new Promise(function(resolve, reject) {
    jwt.verify(token, sign, (err, decode) => {
      if (err) {
        reject(err)
      } else {
        resolve(decode)
      }
    })
  })
}

module.exports = {
  createToken,
  verify
}