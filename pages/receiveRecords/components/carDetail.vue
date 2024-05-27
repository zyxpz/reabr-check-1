<template>
  <view>
    <view class="card">
      <view class="g-flex-aic"
        ><image
          src="/static/car_info.svg"
          class="icon-image"
        />车辆及到场信息</view
      >
      <u-cus-gap size="24" />
      <view class="item g-flex-aic-jcsb">
        <view class="left">车牌：</view>
        <view class="right">adsfasd</view>
      </view>
      <view class="item g-flex-aic-jcsb">
        <view class="left">车辆到场时间：</view>
        <view class="right">adsfasd</view>
      </view>
      <view class="item g-flex-aic">
        <view class="left">车辆称重照片：</view>
        <view class="right">
          <uni-file-picker
            file-mediatype="image"
            mode="grid"
            :limit="9"
            :source-type="['camera, album']"
            :readonly="true"
        /></view>
      </view>
      <view class="item g-flex-aic">
        <view class="left">货/铭牌照片：</view>
        <view class="right">
          <uni-file-picker
            file-mediatype="image"
            mode="grid"
            :limit="9"
            :source-type="['camera, album']"
            :readonly="true"
        /></view>
      </view>
      <view class="item g-flex-aic">
        <view class="left">送货单照片：</view>
        <view class="right">
          <uni-file-picker
            file-mediatype="image"
            mode="grid"
            :limit="9"
            :source-type="['camera, album']"
            :readonly="true"
        /></view>
      </view>
    </view>
    <view class="card">
      <view class="g-flex-aic"
        ><image
          src="/static/accept_result.svg"
          class="icon-image"
        />验收结果</view
      >
      <u-cus-gap size="24" />
      <view class="item g-flex-aic-jcsb">
        <view class="left">验收结果：</view>
        <view class="right">adsfasd</view>
      </view>
      <view class="item g-flex-aic">
        <view class="left">验收意见：</view>
        <view class="right">adsfasd</view>
      </view>
    </view>
    <view class="card">
      <view class="g-flex-aic"
        ><image src="/static/position.svg" class="icon-image" />外部代码</view
      >
      <u-cus-gap size="24" />
      <view class="item">xxcc</view>
    </view>
  </view>
</template>
<script></script>
<style>
.card {
  background: #fff;
  padding: 24rpx 16rpx;
  margin: 16rpx;
}
.icon-image {
  width: 40rpx;
  height: 40rpx;
  margin-right: 6rpx;
}
.icon-scan {
  width: 40rpx;
  height: 40rpx;
  margin-left: 12rpx;
}
.item {
  padding: 12rpx 12rpx;
  color: #666;
  font-size: 26rpx;
}
</style>
