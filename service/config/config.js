const sql = {
  host     : 'localhost',
  user     : 'root',
  password : 'gxlself',
  database : '203-chat'
}
// 未加密前签名
const sign = 'gxlself'

// 不在线状态
const NOT_ONLINR_STATUS = 0;
// 在线状态
const ONLINE_STATUS = 1;

module.exports = {
  sql,
  sign,
  NOT_ONLINR_STATUS,
  ONLINE_STATUS
}