<template>
	<view class="page gxl-white">
		<header-bar title="203屋" :back="false" sure="退出" @surefun="loginout"></header-bar>
		
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
	.h3-title{
		padding: 40upx 0;
		font-size: 40upx;
		font-weight:bold;
	}
	.login-input{
		padding: 44upx 0 0;
		margin: 0 0 80upx;
		color: #666; 
		font-size: 32upx;
		input{
			caret-color: #FC8800;
			padding: 28upx 0;
		}
		input + input{
			margin: 20upx 0 0;
		}
		.focus{
			position:relative;
			border-bottom-color: #DD4CB2!important;
		}
		.focus::after {
			content:' ';
			border-radius: 50%;
			position: absolute;
			z-index:1;
			background-color: rgba(247,85,109, .3);
			-webkit-animation: waveCircle 1s ease normal ;
			box-shadow: 0 0 10px rgba(0,0,0,.3) inset;
		}
	}
	.login{
		&-btn{
			font-size: 32upx;
			height: 96upx;
			line-height: 96upx;
			border-radius: 96upx;
			color: #fff;
			background: linear-gradient(171deg,rgba(255,93,80,1) 0%,rgba(247,85,109,1) 20%,rgba(221,76,178,1) 37%,rgba(162,77,244,1) 60%,rgba(101,113,255,1) 77%,rgba(39,203,251,1) 100%);
		}
	}
	.find-password{
		color: #EB3055;
		font-size: 28upx;
		text-align: right;
		padding: 20upx 8upx;
		margin: 10upx 0;
	}
}
@keyframes waveCircle {
	0% {
		left: 50%;
		top: 50%;
		width: 0;
		height: 0;
    }
    100% {
		left: 0upx;
		top: -300upx;
		opacity: 0;
		width: 700upx;
		height: 700upx;
    }
}
</style>
