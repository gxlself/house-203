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
					 id="scrollView"
					 >
			<view class="chat-list">
				<view class="user-chat" 
					 :class="[{'chat-left': username !== c.from}, {'chat-right': username === c.from}]" 
					 v-for="(c, i) in chats" :key="i">
					<view :class="[{'left-ava': username !== c.from}, {'left-node': username === c.from}]">
						{{ username !== c.from ? c.from[0] : ''}}
					</view>
					<view class="chat-content">
						<view class="chat-nick">{{c.from}}</view>
						<text :class="[
									{'userself': !(username !== c.from)},
									{'other': username !== c.from}
								]" v-html="c.content.default"></text>
					</view>
					<view :class="[{'right-ava': username === c.from}, {'right-node': username !== c.from}]">
						{{ username === c.from ? c.from[0] : ''}}
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="bottom-input" :class="{'iphoneX': isIphoneX}">
			<input type="text" v-model="chatContent" class="chat-input" :focus="true" @blur="blur" @focus="focus" confirm-type="send" :confirm-hold="true" @confirm="sendMessage"></input>
			<button v-if="!isFocus && chatContent" class="send-chat" type="primary" @tap="sendMessage">+</button>
			<button v-if="!isFocus && chatContent" class="send-chat" type="primary" @tap="sendMessage">发送</button>
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
				scrollTop: 1000,
				isFocus: false,
				groupId: 1,
				size: 15,
				page: 1,
				count: 0,
				chatType: "groupChat",
				isLoading: false,
			}
		},
		components: {
			headerBar
		},
		onLoad() {
			this.getCacheChat()
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
			// 监听消息发送
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
								this.scrollToBottom()
							})
							break;
						case 'getUserInfo': 
							console.log(message.data)
							let tempUsers = []
							uni.setStorageSync(`group-${this.groupId}`, message.data)
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
			focus() {
				// #ifdef H5
				let timer = setTimeout(() => {
					document.body.scrollTo(0, 9999)
					clearTimeout(timer)
				}, 200)
				// #endif
				this.isFocus = true
				// this.scrollToBottom()
			},
			blur() {
				// #ifdef H5
				document.scrollingElement.scrollTo(0, 0);
				// #endif
				this.isFocus = false
				// this.scrollToBottom()
			},
			// 退出
			loginout() {
				uni.clearStorageSync()
				uni.showToast({ title: '登出成功', icon: 'loading', mask: true })
				let timer = setTimeout(() => {
					clearTimeout(timer)
					uni.reLaunch({ url: '../login/login' })
				}, 1000)

				// uni.reLaunch({ url: '../card-game/card-game' })
			},
			sendMessage() {
				const that = this
				uni.hideKeyboard()
				if (that.chatContent === '') {
					return
				}
				let chat = {
					type: this.chatType,
					groupId: that.groupId,
					user: that.username,
					content: {
						type: "text",
						default: that.chatContent
					}
				}
				if (chatSocket) {
					chatSocket.send({
						data: JSON.stringify(chat),
						success: () => {
							that.chatContent = ''
						}
					})
				} else {
					that.initConnect((socket) => {
						socket.send({
							data: JSON.stringify(chat),
							success: () => {
								that.chatContent = ''
							}
						})
					})
				}
				
			},
			// 下拉触顶
			scrolltoupper() {
				if (this.isLoading) {
					return;
				}
				if (this.chats.length >= this.count) {
					return
				}
				this.isLoading = true
				this.getCacheChat()
			},
			// 上拉触底
			scrolltolower() {
			},
			// 初始化连接
			initConnect(fn) {
				chatSocket = null;
				socketTask('/user').then(socket => {
					chatSocket = socket
					chatSocket.onMessage(this.onMessage)
					chatSocket.onError(this.onError)
					chatSocket.onClose(this.closeSocket)
					return socket
				}).then(socket => {
					typeof fn === 'function' && fn(socket)
				})
			},
			scrollToBottom() {
				this.getNode().then(res => {
					console.log(res)
				})
				this.scrollTop += 300
			},
			// 获取节点信息
			getNode() {
				return new Promise(function(resolve, reject){
					let query = uni.createSelectorQuery().in(this)
					query.select('#scrollView').boundingClientRect(data => {
						try {
							resolve(data)
						} catch(error) {
							reject(error)
						}
					}).exec();
				})
			},
			getCacheChat() {
				let that = this
				let option = {
					size: this.size,
					page: this.page,
					groupId: this.groupId,
					chatType: this.chatType,
				}
				request('/user/chatlist', option, 'POST')
					.then(response => {
						if (response.code === 0) {
							that.chats = response.data.chats.concat(that.chats)
						} else {
							uni.showToast({ icon: 'none', title: response.msg })
						}
						return response
					})
					.catch(error => {
						uni.showToast({ icon: 'none', title: error.message })
					})
					.then(response => {
						that.count = response.data.count
						let page = Math.ceil(that.count / that.size)
						if (that.isLoading && that.page < page) {
							that.isLoading = false
							that.page++
						} else {
							that.scrollToBottom()
						}
					})
			}
		},
		onHide() {
			this.initConnect()
		},
		onUnload() {
			chatSocket = null
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
		z-index: 3;
		input{
			background: #fff;
			padding: 4upx 15upx;
			flex: 1;
		}
		.send-chat{
			margin-left: 15upx;
			height: 60upx;
			line-height: 58upx;
			text-align: center;
			font-size: 24upx;
			border-radius: 8upx;
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
		transform: translateY(-12upx);
	}
	.chat-nick{
		color: #888;
		font-size: 24upx;
		padding: 5upx 0;
		transform: translateY(-12upx);
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
		z-index: 1;
	}
	.other::after{
		left: -16upx;
		border-radius: 0% 100% 0% 0%;
		background: #f8f8f8;
		z-index: 2;
	}
	.userself::before{
		background: #00FF00;
		right: -16upx;
		z-index: 1;
	}
	.userself::after{
		background: #fff;
		right: -16upx;
		border-radius: 100% 0% 0% 0%;
		background: #f8f8f8;
		z-index: 2;
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
