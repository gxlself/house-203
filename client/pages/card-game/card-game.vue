<template>
	<view class="game-page">
		<header-bar title="卡牌游戏" :back="true"></header-bar>
		<view class="game-house">
			<view class="game-house-item" v-for="(house, index) in gameHouses">

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

		},
		onShow() {

		}
	}
</script>

<style lang="scss" scoped>
.game-page{
	padding: 80upx 0 0;
	.game-house{
		display: flex;
		justify-content: space-around;
		&-item{
			box-shadow: 0 0 12upx #eee;
		}
	}
}
</style>
