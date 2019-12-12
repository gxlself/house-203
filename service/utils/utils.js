const currentTime = function() {
  let d = new Date()
  let year = d.getFullYear()
  let mon = checkSingle(d.getMonth() + 1)
  let day = checkSingle(d.getDate())
  let hour = checkSingle(d.getHours())
  let min = checkSingle(d.getMinutes())
  let sec = checkSingle(d.getSeconds())

  return `${year}-${mon}-${day} ${hour}:${min}:${sec}`
}

const checkSingle = function(time) {
  let exec_time = time < 10 ? '0' + time : time
  return exec_time
}

module.exports = {
  currentTime
}