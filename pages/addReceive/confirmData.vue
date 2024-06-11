<template>
  <view class="page">
    <view class="text">请确认实收钢筋数据</view>
    <view class="content">
      <review-type :checkType="checkType" :detail="detail" />
      <finally-weight :detail="detail" />
      <material-amount-confirm
        :checkType="checkType"
        :detail="detail"
        ref="confirmMaterial"
      />
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
import request from '@/utils/request.js';

export default {
  components: {
    FinallyWeight,
    MaterialAmountConfirm,
    reviewType,
  },
  data() {
    return {
      loading: false,
      detail: {},
    };
  },
  methods: {
    /**
     * 获取详情
     */
    async getDetail() {
      if (!this.id) {
        uni.showToast({
          title: '缺少id参数',
          icon: 'none',
        });
        return;
      }
      uni.showLoading();
      const res = await request.get(`/api/rebarCheck/checkDetail/${this.id}`);
      uni.hideLoading();
      this.detail = res?.data;
    },
    handlePrev() {
      uni.redirectTo({
        url: `/pages/addReceive/checkFirst?id=${this.id}`,
      });
    },
    async handleNext() {
      const list = this.$refs.confirmMaterial.materialLists.map((one) => ({
        ...one,
        confirmAmount: one.children?.[0]?.confirmAmount,
        confirmWeight: one.children?.[1]?.confirmWeight,
        children: undefined,
      }));
      await request.post(`/api/rebarCheck/chooseConfirm/${this.id}`, list);
      uni.redirectTo({
        url: `/pages/addReceive/confirmCarInfos?id=${this.id}`,
      });
    },
  },
  onLoad(options) {
    this.id = options.id;
    this.getDetail();
  },
  mounted() {},
  computed: {
    checkType() {
      return this.detail.checkConfirmVO?.checkType;
    },
  },
  onHide() {
    uni.hideLoading();
  },
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
