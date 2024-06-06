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
        <view class="right">{{ detail?.checkTruckVO?.truckNo }}</view>
      </view>
      <view class="item g-flex-aic-jcsb">
        <view class="left">车辆到场时间：</view>
        <view class="right">{{
          detail?.checkTruckVO?.truckTime?.replace('T', ' ')
        }}</view>
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
            v-model="turckPics"
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
            v-model="goodsPics"
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
            v-model="sendPics"
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
        <view class="right">{{
          detail?.checkTruckVO?.checkResult === 1 ? '合格进场' : '不合格退场'
        }}</view>
      </view>
      <view class="item g-flex-aic">
        <view class="left">验收意见：</view>
        <view class="right">{{ detail?.checkTruckVO?.checkRemark }}</view>
      </view>
    </view>
    <view class="card">
      <view class="g-flex-aic"
        ><image src="/static/position.svg" class="icon-image" />外部代码</view
      >
      <u-cus-gap size="24" />
      <view class="item">{{ detail?.checkTruckVO?.extNo }}</view>
    </view>
  </view>
</template>
<script>
export default {
  props: ['detail'],
  computed: {
    turckPics() {
      return this.detail?.checkTruckVO?.truckPics?.map((one, index) => ({
        name: `${index}.png`,
        extname: 'png',
        url: one,
      }));
    },
    goodsPics() {
      return this.detail?.checkTruckVO?.goodsPics?.map((one, index) => ({
        name: `${index}.png`,
        extname: 'png',
        url: one,
      }));
    },
    sendPics() {
      return this.detail?.checkTruckVO?.sendPics?.map((one, index) => ({
        name: `${index}.png`,
        extname: 'png',
        url: one,
      }));
    },
  },
};
</script>
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
.left {
  width: 200rpx;
}
.right {
  flex: 1;
  text-align: right;
}
</style>
