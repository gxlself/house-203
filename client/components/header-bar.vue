<template>
	<view class="header-bar gxl-b gxl-white">
		<text class="header-left" :class="{'back': back}" @tap="navigateBack"></text>
		<view class="title">{{title}}</view>
		<text class="header-right" @tap="rightEvent">{{sure}}</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		props: {
			back: {
				type: Boolean,
				default: true
			},
			sure: {
				type: String,
				default: ''
			},
			title: {
				type: String,
				default: '203'
			}
		},
		methods: {
			rightEvent(e) {
				this.$emit('surefun', e)
			},
			navigateBack() {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
.header-bar{
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 30upx;
	text-align: right;
	.header-left, .header-right{
		width: 150upx;
		height: 80upx;
		line-height: 80upx;
	}
	.back{
		background: url('../static/header-back.png') 10upx center no-repeat;
		background-size: 30upx;
	}
	.header-left{
		padding-left: 20upx;
	}
	.header-right{
		color: #FC8800;
		padding-right: 20upx;
	}
	.title{
		color: #2a2a2a;
	}
}
</style>
