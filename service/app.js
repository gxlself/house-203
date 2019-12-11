var express = require('express');
var app = express();

var expressWs = require('express-ws')(app);
var router = express.Router();

// 不拦截
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS')
  next()
})

app.use(function (req, res, next) {
  return next();
});

app.ws('/', function (ws, req){
  ws.on('message', function (msg) {
    console.log('/', msg);
    ws.send(123);
  })
}) 
app.ws('/user', function (ws, req){
  ws.on('message', function (msg) {
    ws.send(456);
  })
}) 

app.listen(2039, function() {
  console.log('listen 2039 port.');
});