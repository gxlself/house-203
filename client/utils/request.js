import { API_URL, WS_URL } from './env'
const request = function(url, data = {}, method = 'GET') {
	uni.showLoading();
	return new Promise(function(resolve, reject) {
		let token = uni.getStorageSync('token')
		let username = uni.getStorageSync('username')
		if (!token || !username) {
			uni.clearStorageSync()
			uni.reLaunch({ url: '../../pages/login/login' })
			reject(new Error('token失效'))
			return
		}
		uni.request({
			url: API_URL + url,
			data: data,
			method: method,
			header: {
				"authorization": `${token},${username}`
			},
			success(response) {
				console.log(response.data.status === 200)
				if (response.statusCode === 401) {
					uni.clearStorageSync()
					uni.reLaunch({ url: '../../pages/login/login' })
					reject(new Error('token失效'))
				} else if (response.statusCode === 200) {
					resolve(response.data)
				}
				uni.hideLoading();
			},
			fail(error) {
				reject(error)
				uni.hideLoading();
			}
		})
	})
}
const login = function(url, data = {}, method = 'POST') {
	uni.showLoading();
	return new Promise(function(resolve, reject) {
		uni.request({
			url: API_URL + url,
			data: data,
			method: method,
			success(response) {
				resolve(response.data)
				uni.hideLoading();
			},
			fail(error) {
				reject(error)
				uni.hideLoading();
			}
		})
	})
}
const register = function(url, data = {}, method = 'POST') {
	return new Promise(function(resolve, reject) {
		uni.request({
			url: API_URL + url,
			data: data,
			method: method,
			success(response) {
				resolve(response.data)
				uni.hideLoading();
			},
			fail(error) {
				reject(error)
			}
		})
	})
}
const socketTask = function(url) {
	let token = uni.getStorageSync('token')
	let username = uni.getStorageSync('username')
	if (!token || !username) {
		uni.clearStorageSync()
		uni.reLaunch({ url: '../../pages/login/login' })
		return
	}
	return new Promise(function(resolve, reject) {
		const socket = uni.connectSocket({
			url: WS_URL + url + `?authorization=${token},${username}`,
			complete: ()=> {}
		});
		socket.onOpen(() => {
			let chat = {
				type: "refreshConnect",
				content: '重新连入'
			}
			socket.send({
				data: JSON.stringify(chat),
				success() {
					console.log('send success')
				}
			})
			resolve(socket)
		})
		socket.onError(() => {
			socketTask(url).then(() => {})
		})
	})
}
module.exports = {
	request,
	login,
	register,
	socketTask
}