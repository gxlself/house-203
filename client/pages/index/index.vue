<template>
	<view class="page gxl-white">
		<header-bar title="203屋" :back="false" sure="退出" @surefun="loginout"></header-bar>
		<scroll-view scroll-y
					 scroll-with-animation="true"
					>
			<view class="user-chat" :class="[{'chat-left': !c.user.isSelf}, {'chat-right': c.user.isSelf}]" v-for="(c, i) in chat" :key="i">
				<view class="left-ava">
					
				</view>
				<view class="chat-content">
					<text>
						{{c.user.say}}
					</text>
				</view>
				<view class="right-ava">
					
				</view>
			</view>
		</scroll-view>
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
				chat: [
					{
						user: {
							isSelf: true,
							nickname: "张三",
							say: "不糊会二不糊会二不糊会二不糊会二不糊会二不糊会二不糊会二不糊会二不糊会二不糊会二不糊会二 "
						}
					},
					{
						user: {
							isSelf: true,
							nickname: '李四',
							say: "难的糊涂"
						}
					},
					{
						user: {
							isSelf: false,
							nickname: '李四',
							say: "难的糊涂"
						}
					},
					{
						user: {
							isSelf: false,
							nickname: '李四',
							say: "难的糊涂"
						}
					},
					{
						user: {
							isSelf: true,
							nickname: '李四',
							say: "难的糊涂难的糊涂难的糊涂难的糊涂难的糊涂难的糊涂难的糊涂难的糊涂难的糊涂难的糊涂难的糊涂"
						}
					},
					{
						user: {
							isSelf: false,
							nickname: '李四',
							say: "难的糊涂"
						}
					},
					{
						user: {
							isSelf: false,
							nickname: '李四',
							say: "难的糊涂"
						}
					},
					{
						user: {
							isSelf: true,
							nickname: '李四',
							say: "难的糊涂"
						}
					}
				]
			}
		},
		components: {
			headerBar
		},
		onLoad() {
			socketTask('/user').then(socket => {
				chatSocket = socket
				chatSocket.send({
					data: '{love: 123}'
				})
				chatSocket.onMessage(this.onMessage)
				chatSocket.onError(this.onError)
				chatSocket.onClose(this.closeSocket)
			})
		},
		methods: {
			onMessage(response) {
				console.log('onMessage', response)
			},
			onError(error) {
				
			},
			closeSocket() {
				request('/loginout', {}, 'POST').then(res => {
					if (res.code === 0) {
						uni.clearStorageSync()
						uni.showToast({ icon: 'loading', title: res.msg, duration:1000 , mask: true})
						let timer = setTimeout(() => {
							clearTimeout(timer)
							uni.reLaunch({ url: '../login/login' })
						}, 1000)
					} else {
						console.log('err', res)
					}
				})
			},
			loginout() {
				this.closeSocket()
			}
		}
	}
</script>

<style lang="scss" scoped>
.page{
	padding: 80upx 32upx 0;
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
