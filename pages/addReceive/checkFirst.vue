<template>
  <view class="add-material-page">
    <view class="content">
      <delivery-node :detail="detail" />
      <u-cus-gap size="24" />
      <total-weight-deviation
        ref="childComp"
        :detail="detail"
        :id="id"
        :getDetail="getDetail"
      />
      <view v-show="reverseWeightType">
        <u-cus-gap size="24" />
        <reverse-check :detail="detail" />
      </view>
    </view>
  </view>
  <view class="btn-content">
    <uni-row class="btn-row">
      <uni-col :span="9"
        ><button type="primary" @click="handleChangeOriginData">
          修改运单数据
        </button></uni-col
      >
      <uni-col :span="6"
        ><button type="warn" @click="handleCancel">取消</button></uni-col
      >
      <uni-col :span="6"
        ><button type="primary" @click="handleNext">继续</button></uni-col
      >
    </uni-row>
  </view>
</template>

<script>
import DeliveryNode from './components/deliveryNote/deliveryNote.vue';
import TotalWeightDeviation from './components/totalWeightDeviation/totalWeightDeviation.vue';
import ReverseCheck from './components/reverseCheck/reverseCheck.vue';
import request from '@/utils/request.js';

export default {
  components: {
    DeliveryNode,
    TotalWeightDeviation,
    ReverseCheck,
  },
  data() {
    return {
      /** 验收单据详情 */
      detail: {},
    };
  },
  methods: {
    /**
     * 继续
     */
    async handleNext() {
      if (!this.reverseWeightType) {
        const reverseWeightType = this.$refs.childComp.reverseWeightType;
        if (!reverseWeightType || reverseWeightType === 'undefined') {
          uni.showToast({
            title: '请选择反向复核总重使用类型',
            icon: 'none',
          });
          return;
        }
      } else {
        uni.redirectTo({
          url: `/pages/addReceive/confirmData?id=${this.id}`,
        });
      }
    },
    /**
     * 修改运单数据
     */
    handleChangeOriginData() {
      uni.redirectTo({
        url: `/pages/addReceive/addMaterial?id=${this.id}&rebarType=${this.detail?.checkConfirmVO?.type}`,
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
    /**
     * 获取详情
     */
    async getDetail() {
      uni.showLoading();
      const res = await request.get(`/api/rebarCheck/checkDetail/${this.id}`);
      uni.hideLoading();
      this.detail = res?.data;
    },
  },
  onLoad(options) {
    this.id = options.id;
    this.getDetail();
  },
  onMounted() {
    this.getDetail();
  },
  watch: {
    id() {
      this.getDetail();
    },
  },
  computed: {
    reverseWeightType() {
      return this.detail?.checkReverseVO?.totalCheckVO?.reverseWeightType;
    },
  },
  onHide() {
    uni.hideLoading();
  },
};
</script>

<style lang="scss">
.add-material-page {
  padding: 16rpx 12rpx;
  // display: flex;
  // flex-direction: column;
  // justify-content: space-between;
  // height: calc(100vh - 32rpx);
  height: auto !important;
  margin-bottom: 46px;
}
.content {
  flex: 1;
  overflow: auto;
}
.btn-content {
  position: fixed;
  bottom: 10px;
  width: 100%;
}
.btn-row {
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
