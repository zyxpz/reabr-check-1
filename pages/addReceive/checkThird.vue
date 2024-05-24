<template>
  <view class="add-material-page">
    <view class="content">
      <delivery-node />
      <u-cus-gap size="24" />
      <total-weight-deviation />
      <u-cus-gap size="24" />
      <reverse-check />
    </view>
    <uni-row class="btn-content">
      <uni-col :span="9"
        ><button type="primary" @click="handleChangeOriginData">
          修改运单数据
        </button></uni-col
      >
      <uni-col :span="6"
        ><button type="warn" @click="handleCancel">取消</button></uni-col
      >
      <uni-col :span="6"
        ><button type="primary" @click="handleNext">下一步</button></uni-col
      >
    </uni-row>
  </view>
</template>

<script>
import DeliveryNode from './components/deliveryNote/deliveryNote.vue';
import TotalWeightDeviation from './components/totalWeightDeviation/totalWeightDeviation.vue';
import ReverseCheck from './components/reverseCheck/reverseCheck.vue';
export default {
  components: {
    DeliveryNode,
    TotalWeightDeviation,
    ReverseCheck,
  },
  data() {
    return {};
  },
  methods: {
    /**
     * 修改运单数据
     */
    handleChangeOriginData() {
      uni.navigateTo({
        url: '/pages/addReceive/addMaterial',
      });
    },
    /**
     * 继续
     */
    handleNext() {
      uni.navigateTo({
        url: '/pages/addReceive/confirmData',
      });
    },
    /**
     * 取消
     */
    handleCancel() {
      uni.switchTab({
        url: '/pages/tabBar/AddReceive/AddReceive',
      });
    },
  },
};
</script>

<style lang="scss">
.add-material-page {
  padding: 16rpx 12rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100vh - 32rpx);
}
.content {
  flex: 1;
  overflow: auto;
}
.btn-content {
  display: flex;
  justify-content: space-between;
}
.item {
  background-color: #fff;
  padding-top: 16rpx;
}
.title {
  font-weight: 700;
  font-size: 28rpx;
  padding: 16rpx;
}
button {
  font-size: 32rpx;
}
.uni-table-scroll {
  width: calc(100vw - 68rpx);
}
.uni-table-th {
  padding: 12rpx 12rpx;
  font-weight: 400;
  color: #333;
  font-size: 26rpx;
}
.uni-table-td {
  font-size: 24rpx;
  padding: 12rpx;
  font-weight: 400;
  color: #333;
  line-height: 30rpx;
}
</style>
