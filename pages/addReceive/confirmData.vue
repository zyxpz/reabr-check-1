<template>
  <view class="page">
    <view class="text">请确认实收钢筋数据</view>
    <view class="content">
      <review-type />
      <material-amount-confirm />
    </view>
    <uni-row class="g-flex-aic-jcsb">
      <uni-col :span="8"
        ><button type="primary" @click="handlePrev">上一步</button></uni-col
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
import reviewType from './components/reviewType/reviewType.vue';
export default {
  components: {
    FinallyWeight,
    MaterialAmountConfirm,
    reviewType,
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    handlePrev() {
      uni.navigateTo({
        url: '/pages/addReceive/checkSecond',
      });
    },
    handleNext() {
      uni.navigateTo({
        url: '/pages/addReceive/confirmCarInfos',
      });
    },
  },
  mounted() {},
};
</script>
<style lang="scss">
.page {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100vh - 32rpx);
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

.card {
  background: #fff;
  padding: 16rpx;
  margin: 16rpx;
}
</style>
