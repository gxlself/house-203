<template>
	<view class="chat-page gxl-white">
		<header-bar title="203屋" :back="false" sure="退出" @surefun="loginout"></header-bar>
		<scroll-view scroll-y 
					 scroll-with-animation="true" 
					 @scrolltoupper="scrolltoupper"
					 @scrolltolower="scrolltolower"
					 :class="{'iphoneX-content-padding': isIphoneX}"
					 class="scroll-view"
					 style="background: #F8F8F8;"
					 :scroll-top="scrollTop" 
					 >
			<view class="user-chat" 
				 :class="[{'chat-left': username !== c.from || username !== c.user}, {'chat-right': username === c.from || username === c.user}]" 
				 v-for="(c, i) in chats" :key="i">
				<view class="left-ava" v-if="!(username === c.from || username === c.user)">
					{{c.from[0]}}
				</view>
				<view class="left-node" v-if="username === c.from || username === c.user"></view>
				<view class="chat-content">
					<text :class="[
						{'userself': !(username !== c.from || username !== c.user)},
						{'other': username !== c.from || username !== c.user}
					]" v-html="c.content.default"></text>
				</view>
				<view class="right-ava" v-if="!(username !== c.from || username !== c.user)">
					{{username[0]}}
				</view>
				<view class="right-node" v-if="username !== c.from || username !== c.user"></view>
			</view>
		</scroll-view>
		<view class="bottom-input" :class="{'iphoneX': isIphoneX}">
			<input type="text" v-model="chatContent" class="chat-input" @blur="blur" @focus="focus" confirm-type="send" @confirm="sendMessage"/>
			<!-- <button class="send-chat" type="primary">+</button> -->
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
				users: {},
				scrollTop: 999
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
				let that = this
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
							that.chats.push(message.data)
							that.$nextTick(() => {
								setTimeout(() => {
									that.scrollTop = 9999999
								}, 100)
							})
							break;
						case 'getUserInfo': 
							console.log(message.data)
							let tempUsers = []
							break;
					}
				}
			},
			onError(error) {},
			closeSocket() {},
			focus() {
				let that = this
				// #ifdef H5
				this.scrollTop = document.scrollingElement.scrollTop;
				setTimeout(() => {
					document.scrollingElement.scrollTo(0, uni.getSystemInfoSync().screenHeight)
					that.$nextTick(() => {
						setTimeout(() => {
							that.scrollTop = 9999999
						}, 100)
					})
				},200)
				// #endif
			},
			blur() {
				// #ifdef H5
				document.scrollingElement.scrollTo(0, this.scrollTop);
				this.$nextTick(() => {
					this.scrollTop = 9999999
				})
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
	  padding: 80upx 0upx;
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
	padding: 0 20upx;
	.left-ava, .right-ava, .left-node, .right-node{
		width: 70upx;
		height: 70upx;
		line-height: 70upx;
		text-align: center;
		border-radius: 50%;
		
	}
	.left-ava, .right-ava{
		background: #eee;
	}
	.left-node, .right-node{
		background: none;
	}
}
.user-chat{
	margin: 24upx 0;
}
.user-chat:last-child{
	margin-bottom: 24upx;
}
.chat-content{
	flex: 1;
	margin: 0 16upx;
	text{
		font-size: 28upx;
		display: inline-flex;
		background: #fff;
		padding: 16upx 20upx;
		text-align: justify;
		border-radius: 8upx;
		word-break: break-all;
	}
	.other, .userself{
		position: relative;
	}
	.userself{
		background: #00FF00;
	}
	.other::before, .other::after, .userself::before,.userself::after{
		position: absolute;
		content: '';
		width: 16upx;
		height: 16upx;
	}
	.other::before{
		background: #fff;
		left: -16upx;
	}
	.other::after{
		left: -16upx;
		border-radius: 0% 100% 0% 0%;
		background: #f8f8f8;
	}
	.userself::before{
		background: #00FF00;
		right: -16upx;
	}
	.userself::after{
		background: #fff;
		right: -16upx;
		border-radius: 100% 0% 0% 0%;
		background: #f8f8f8;
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
