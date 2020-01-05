<template>
	<view class="game-page">
		<header-bar title="卡牌游戏" :back="true"></header-bar>
		<view class="game-house">
			<view class="game-house-item" v-for="(house, index) in gameHouses">
				<view></view>
				<view></view>
			</view>
		</view>
	</view>
</template>

<script>
	import { request, socketTask } from '../../utils/request.js'
	import headerBar from '../../components/header-bar.vue'
	export default {
		data() {
			return {
				gameHouses: [],	// 游戏房间
			};
		},
		components: {
			headerBar
		},
		methods: {

		},
		onLoad() {
			this.gameHouses = [
				{name: 1, id: 1},
				{name: 1, id: 1},
				{name: 1, id: 1},
				{name: 1, id: 1},
				{name: 1, id: 1},
			]
		},
		onShow() {

		}
	}
</script>

<style lang="scss" scoped>
.game-page{
	padding: 80upx 0 0;
	.game-house{
		&-item{
			width: 400upx;
			height: 400upx;
			border-radius: 50%;
			margin: 0 auto;
			box-shadow: 0 0 12upx #eee;
		}
		&-item+&-item{
			margin-bottom: 30upx;
		}
	}
}
</style>
