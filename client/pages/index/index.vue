<template>
	<view class="content">
		
	</view>
</template>

<script>
	import request from '../../utils/request.js'
	let socketTask = null
	export default {
		data() {
			return {
				title: 'Hello',
			}
		},
		onLoad() {
			socketTask = uni.connectSocket({
				url: 'ws://172.16.1.238:2039/user',
				complete: ()=> {}
			});
			socketTask.onOpen(this.onOpen)
			socketTask.onError(this.onError)
			socketTask.onClose(this.onClose)
			socketTask.onMessage(this.onMessage)
		},
		methods: {
			onMessage(response) {
				
			},
			onClose(error) {
				
			},
			onError(error) {
				
			},
			onOpen(response) {
				socketTask.send({
					data: 'love'
				})
			}
		}
	}
</script>

<style>
</style>
