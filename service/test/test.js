var { currentTime } = require('../utils/utils')

let a = new Promise((resolve, reject) => {
  resolve(currentTime())
})

let b = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(currentTime())
  },1000)
})

Promise.all([a, b]).then(valuse => {
  console.log(valuse)
})


setTimeout(() => {
  console.log(currentTime())
}, 2000)