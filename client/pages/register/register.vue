<template>
	<view class="page gxl-white">
		<header-bar :back="true" sure="" title=""></header-bar>
		<view class="content">
			<view class="h3-title">
				注册
			</view>
			<view class="login-input">
				<input  class="gxl-b" 
						:class="{'focus': usernameFoucus}"
						v-model="username"
						@focus="usernameFoucus = true" 
						@blur="usernameFoucus = false"
						placeholder-style="font-size:30upx;color: #999999;padding: 0 10upx;" 
						placeholder="设置登录账号" 
						type="text"/>
				<input 	class="gxl-b" 
						:class="{'focus': passwordFoucus}" 
						v-model="password"
						@focus="passwordFoucus = true" 
						@blur="passwordFoucus = false"
						placeholder-style="font-size:30upx;color: #999999;padding: 0 10upx;" 
						placeholder="设置登录密码" 
						type="password"/>
			</view>
			<view class="login">
				<button class="login-btn" @tap="registerSubmit">注册</button>
			</view>
		</view>
	</view>
</template>

<script>
	import { register } from '../../utils/request.js'
	import headerBar from '../../components/header-bar.vue'
	let socketTask = null
	export default {
		data() {
			return {
				usernameFoucus: false,
				passwordFoucus: false,
				username: '',
				password: '',
			}
		},
		components: {
			headerBar
		},
		onLoad() {
			
		},
		methods: {
			registerSubmit() {
				if (!this.username) {
					uni.showToast({
						title: '请设置账号',
						icon: 'none'
					})
					return
				}
				if (!this.password) {
					uni.showToast({ title: '请设置密码', icon: 'none' })
					return
				}
				let option = {
					username: this.username,
					password: this.password
				}
				uni.showLoading({
					title: '注册中~'
				})
				register('/register', option).then(res => {
					uni.hideLoading()
					if (res.code === 0) {
						uni.showToast({ title: '注册成功', icon: 'loading', mask: true })
						uni.setStorageSync('token', res.data.token)
						uni.setStorageSync('username', res.data.username)
						let timer = setTimeout(() => {
							clearTimeout(timer)
							// uni.reLaunch({ url: '../index/index' })
							uni.redirectTo({ url: '../index/index' })
						}, 1000)
					} else {
						uni.showToast({ icon: 'none', title: res.msg })
					}
				})
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

</style>
