<script>
	export default {
		onLaunch: function () {
			let token = uni.getStorageSync('token')
			let username = uni.getStorageSync('username')
			if (token && username) {
				uni.reLaunch({
					url: 'pages/choose/choose'
				})
			}
		},
		onShow: function () {
			console.log('App Show')
		},
		onHide: function () {
			console.log('App Hide')
		}
	}
</script>

<style>
.page{
	min-height: 100vh;
	background: #f8f8f8;
	box-sizing: border-box;
}
.gxl-white{
	background: #fff;
}
.gxl-b{
	border-bottom: 1upx solid #EBEBEB; 
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
	animation: waveCircle 1s ease normal ;
	box-shadow: 0 0 10px rgba(0,0,0,.3) inset;
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
