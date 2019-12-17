const jwt = require('jsonwebtoken');
var { sign } = require('../config/config')

const createToken = (content, secretOrPrivateKey) => {
  return jwt.sign(content, secretOrPrivateKey, {
    expiresIn: 60 * 60 * 24 * 2  // 48小时过期
  }) 
}

const verify = (token) => {
  return new Promise(function(resolve, reject) {
    jwt.verify(token, sign, (err, decode) => {
      if (err) {
        reject(false)
      } else {
        resolve(true)
      }
    })
  })
}

module.exports = {
  createToken,
  verify
}