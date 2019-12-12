const jwt = require('jsonwebtoken');

const createToken = (content, secretOrPrivateKey) => {
  return jwt.sign(content, secretOrPrivateKey, {
    expiresIn: 60 * 60 * 24  // 24小时过期
  }) 
}

const verify = (token, secretOrPublicKey, next) => {
  return jwt.verify(token, secretOrPublicKey, (err, decode) => {
    if (err) {
      next({ code: -1, errMsg: err})
    } else {
      next({ code: 0 })
    }
  })
}

module.exports = {
  createToken,
  verify
}