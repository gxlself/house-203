<template>
	<view class="game-page">
		<header-bar title="拖拉机" :back="true"></header-bar>
		<button type="primary" @tap="sendMessage">发送消息</button>
	</view>
</template>

<script>
	import { request, socketTask } from '../../utils/request.js'
	import headerBar from '../../components/header-bar.vue'
	let chatSocket = null
	export default {
		data() {
			return {
				
			};
		},
		components: {
			headerBar
		},
		onLoad() {
			this.initConnect((socket) => {
				let chat = {
					type: 'getUserInfo',
					groupId: 1
				}
				socket.send({
					data: JSON.stringify(chat)
				})
			})
		},
		methods: {
			// 初始化连接
			initConnect(fn) {
				chatSocket = null;
				socketTask('/game').then(socket => {
					chatSocket = socket
					chatSocket.onMessage(this.onMessage)
					chatSocket.onError(this.onError)
					chatSocket.onClose(this.closeSocket)
					return socket
				}).then(socket => {
					typeof fn === 'function' && fn(socket)
				})
			},
			onMessage(response) {
				let that = this
				let message = JSON.parse(response.data)
				console.log('message', message)
				if (message.code === -1) {
					uni.clearStorageSync()
					uni.showToast({ title: '登录状态失效', icon: 'loading', mask: true })
					let timer = setTimeout(() => {
						clearTimeout(timer)
						uni.reLaunch({ url: '../login/login' })
					}, 1000)
				} else {
					switch(message.data.type) {
						case 'game': 
							
							break;
						case 'getGameUserInfo': 
							console.log(message.data)
							break;
					}
				}
			},
			onError(error) {
				this.initConnect()
			},
			closeSocket() {
				this.initConnect()
			},
			sendMessage() {
				let option = {
					msg: 123
				}
				chatSocket.send({
					data: JSON.stringify(option),
					success() {}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.game-page{
	padding-top: 80upx;
}
</style>
