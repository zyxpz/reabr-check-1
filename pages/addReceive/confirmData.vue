<template>
  <view class="page">
    <view class="text">请确认实收钢筋数据</view>
    <view class="content">
      <view class="title">复核模式</view>
      <view class="des-card">实称 + 实点</view>
      <finally-weight />
      <material-amount-confirm />
    </view>
    <uni-row class="g-flex-aic-jcsb">
      <uni-col :span="8"
        ><button type="primary" @click="handleChangeOriginData">
          上一步
        </button></uni-col
      >
      <uni-col :span="15"
        ><button type="primary" @click="handleNext">
          确认车辆信息
        </button></uni-col
      >
    </uni-row>
  </view>
</template>

<script>
import FinallyWeight from './components/finallyWeight/finallyWeight.vue';
import MaterialAmountConfirm from './components/materialAmountConfirm/materialAmountConfirm.vue';
export default {
  components: {
    FinallyWeight,
    MaterialAmountConfirm,
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {},
  mounted() {},
};
</script>
<style lang="scss">
.page {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100vh - 60px);
}
.content {
  flex: 1;
  overflow: auto;
}
.text {
  background-color: #fff;
  padding: 16rpx;
  margin: 16rpx;
  text-align: center;
  font-weight: 500;
  font-size: 32rpx;
}
.title {
  font-size: 28rpx;
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
.card {
  background: #fff;
  padding: 16rpx;
  margin: 16rpx;
}
</style>
