<template>
	<view class="chat-page gxl-white">
		<header-bar title="203屋" :back="false" sure="退出" @surefun="loginout"></header-bar>
		<scroll-view scroll-y 
					 scroll-with-animation="true" 
					 @scrolltoupper="scrolltoupper"
					 @scrolltolower="scrolltolower"
					 :class="{'iphoneX-content-padding': isIphoneX}"
					 class="scroll-view"
					 >
			<view class="user-chat" :class="[{'chat-left': username !== c.from || username !== c.user}, {'chat-right': username === c.from || username === c.user}]" v-for="(c, i) in chats" :key="i">
				<view class="left-ava">
					
				</view>
				<view class="chat-content">
					<text>
						{{c.content.default}}
					</text>
				</view>
				<view class="right-ava">
					
				</view>
			</view>
		</scroll-view>
		<view class="bottom-input" :class="{'iphoneX': isIphoneX}">
			<input type="text" v-model="chatContent" class="chat-input" @blur="blur" @focus="focus" confirm-type="send" @confirm="sendMessage"/>
			<button class="send-chat" type="primary">+</button>
		</view>
	</view>
</template>

<script>
	import { request, socketTask } from '../../utils/request.js'
	import headerBar from '../../components/header-bar.vue'
	let chatSocket = null
	export default {
		data() {
			return {
				usernameFoucus: false,
				passwordFoucus: false,
				chatContent: '',
				chats: [],
			}
		},
		components: {
			headerBar
		},
		onLoad() {
			socketTask('/user').then(socket => {
				chatSocket = socket
				chatSocket.onMessage(this.onMessage)
				chatSocket.onError(this.onError)
				chatSocket.onClose(this.closeSocket)
				return socket
			}).then(socket => {
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
			onMessage(response) {
				let message = JSON.parse(response.data)
				if (message.code === -1) {
					uni.clearStorageSync()
					uni.showToast({ title: '登录状态失效', icon: 'loading', mask: true })
					let timer = setTimeout(() => {
						clearTimeout(timer)
						uni.reLaunch({ url: '../login/login' })
					}, 1000)
				} else {
					switch(message.data.type) {
						case 'groupChat': 
							console.log(message)
							this.chats.push(message.data)
							break;
						case 'getUserInfo': 
							console.log(message.data)
							break;
					}
				}
			},
			onError(error) {},
			closeSocket() {},
			focus() {
				// #ifdef H5
				this.scrollTop = document.scrollingElement.scrollTop;
				setTimeout(() => {
					document.scrollingElement.scrollTo(0, uni.getSystemInfoSync().screenHeight)
				},200)
				// #endif
			},
			blur() {
				// #ifdef H5
				document.scrollingElement.scrollTo(0, this.scrollTop);
				// #endif
			},
			loginout() {
				request('/loginout', {}, 'POST').then(res => {
					if (res.code === 0) {
						uni.clearStorageSync()
						uni.showToast({ title: '登出成功', icon: 'loading', mask: true })
						let timer = setTimeout(() => {
							clearTimeout(timer)
							uni.reLaunch({ url: '../login/login' })
						}, 1000)
					} else {
						uni.clearStorageSync()
						uni.reLaunch({ url: '../login/login' })
					}
				})
			},
			sendMessage() {
				const that = this
				uni.hideKeyboard()
				if (that.chatContent === '') {
					return
				}
				let chat = {
					type: "groupChat",
					groupId: 1,
					user: this.username,
					content: {
						type: "text",
						default: that.chatContent
					}
				}
				chatSocket.send({
					data: JSON.stringify(chat),
					success: () => {
						that.chatContent = ''
					}
				})
			},
			// 下拉触顶
			scrolltoupper() {
			},
			// 上拉触底
			scrolltolower() {
			}
		},
		computed: {
			isIphoneX() {
				let systemInfo = uni.getSystemInfoSync()
				return systemInfo.platform === 'ios' && systemInfo.screenHeight >= 812
			},
			username() {
				return uni.getStorageSync('username')
			}
		}
	}
</script>

<style lang="scss" scoped>
.chat-page{
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	transition: .3s;
	.bottom-input{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 10upx 30upx;
		background: #f8f8f8;
		border-top: 1upx solid #ebebeb;
		display: flex;
		flex-wrap: nowrap;
		input{
			background: #fff;
			padding: 4upx 15upx;
			flex: 1;
		}
		.send-chat{
			margin-left: 15upx;
			padding: 0;
			width: 60upx;
			height: 60upx;
			line-height: 55upx;
			text-align: center;
			border-radius: 50%;
		}
	}
	.scroll-view{
	  height: 100vh;
	  box-sizing: border-box;
	  padding: 80upx 0upx 81upx;
	  &.iphoneX-content-padding{
	  	padding-bottom: 140upx;
	  }
	}
	.iphoneX{
		padding-bottom: 68upx;
	}
}
.user-chat{
	display: flex;
	flex-wrap: nowrap;
	justify-content: space-between;
	.left-ava, .right-ava{
		width: 80upx;
		height: 80upx;
		border-radius: 50%;
		background: #eee;
	}
	
}
.chat-content{
	flex: 1;
	text{
		display: inline-flex;
		background: #DD4CB2;
		padding: 10upx;
		border-radius: 8upx;
	}
}
.chat-left{
	.chat-content{
		text-align: left;
	}
}
.chat-right{
	.chat-content{
		text-align: right;
	}
}
</style>
