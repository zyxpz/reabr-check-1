<template>
  <view  class="tip-content">
    <view v-show="tipType === 1" class="tip">
      <view class="ta-c">请在“设置”页</view>
      <view class="ta-c">复制设备码到基石进行用户码授权</view>
    </view>
    <view v-show="tipType === 2" class="tip">
      <view class="ta-c">用户授权码失效，请重新绑定。</view>
    </view>
    <view v-show="tipType === 3" class="tip">
      <view class="ta-c">当前归属方未订阅此服务或订阅已到期。</view>
    </view>
  </view>
</template>


<script>
	export default {
    props: {
      /**
       * 提示类型
       */
      tipType: {
        type: Number,
        required: false
      }
    },
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	.tip-content {
		padding: 64rpx 24rpx;
	}
	.tip {
		background-color: rgb(255, 249, 234);
		font-size: 36rpx;
		color:rgb(255, 154, 67);
		padding: 48rpx 24rpx;
	}
	.ta-c {
		text-align: center;
	}
</style>
