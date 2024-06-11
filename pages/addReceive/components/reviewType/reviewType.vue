<template>
  <view>
    <view class="title">复核模式</view>
    <view class="des-card">{{ checkType === 2 ? '实称 + 实点' : '实称' }}</view>
  </view>
</template>
<script>
export default {
  props: ['checkType', 'detail'],
};
</script>
<style lang="scss">
.title {
  font-size: 30rpx;
  color: #333;
  text-align: center;
  font-weight: 500;
  margin: 16rpx;
}
.des-card {
  background-color: #fff;
  padding: 16rpx;
  margin-bottom: 16rpx;
  margin: 16rpx;
  text-align: center;
}
.total-des {
  text-align: left;
  margin: 28rpx 0 8rpx 0;
}
</style>
