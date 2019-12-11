const request = function(url, data = {}, method = 'GET') {
	return new Promise(function(resolve, reject) {
		uni.request({
			url: url,
			data: data,
			method: method,
			success(response) {
				resolve(response)
			},
			fail(error) {
				reject(error)
			}
		})
	})
}
module.exports = {
	request
}