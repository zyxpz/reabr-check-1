<template>
  <view class="page">
    <tray-rebar ref="childComp" :detail="detail" />
    <uni-row class="g-flex-aic-jcsb">
      <uni-col :span="9"
        ><button type="primary" @click="handleChangeOriginData">
          修改运单数据
        </button></uni-col
      >
      <uni-col :span="5"
        ><button type="warn" @click="handleCancel">取消</button></uni-col
      >
      <uni-col :span="9"
        ><button type="primary" @click="handleNext">
          确认车辆信息
        </button></uni-col
      >
    </uni-row>
  </view>
</template>
<script>
import request from '@/utils/request';
import TrayRebar from './components/trayRebar/trayRebar.vue';

export default {
  components: {
    TrayRebar,
  },
  data() {
    return {
      detail: {},
      dataSource: [],
    };
  },
  methods: {
    /**
     * 点击表格单元格
     * @param type 点击的是哪一列 1：送货单 2：复核结果 3：实点根数
     */
    handleTd(type) {
      this.dataSource = this.dataSource.map((one) => {
        return {
          ...one,
          reverseWeightType: type,
          confirmWeight: type === 1 ? one?.actualWeight : one?.sendWeight,
        };
      });
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
     * 确认车辆信息
     */
    async handleNext() {
      /** 如果没有说明是新增 */
      const reverseWeightType =
        this.$refs.childComp?.dataSource?.[0]?.reverseWeightType;
      if (!reverseWeightType) {
        uni.showToast({
          title: '请点选使用的复核总重',
          icon: 'none',
        });
        return;
      } else {
        uni.showLoading();
        await request.get(
          `/api/rebarCheck/reverseWeightType/${this.id}/${reverseWeightType}`,
        );
        uni.showLoading();
        uni.redirectTo({
          url: `/pages/addReceive/confirmCarInfos?id=${this.id}`,
        });
      }
    },
    async getDetail() {
      uni.showLoading();
      try {
        const res = await request.get(`/api/rebarCheck/checkDetail/${this.id}`);
        uni.hideLoading();
        this.detail = res?.data;
        const { checkReverseVO, checkConfirmVO } = res?.data;
        this.dataSource = checkReverseVO?.totalCheckVO
          ? [
              {
                ...checkReverseVO?.totalCheckVO,
                reverseWeightType: checkConfirmVO?.reverseWeightType,
                confirmWeight: checkConfirmVO?.reverseWeightType
                  ? checkConfirmVO?.reverseWeightType === 1
                    ? checkReverseVO?.totalCheckVO?.actualWeight
                    : checkReverseVO?.totalCheckVO?.sendWeight
                  : undefined,
              },
            ]
          : [];
        console.log(this.dataSource, 'dataSource');
      } catch (error) {
        uni.hideLoading();
      }
    },
  },
  onLoad(options) {
    this.id = options.id;
    this.getDetail();
  },
};
</script>
<style>
.page {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100vh - 16rpx);
}
.title {
  font-size: 32rpx;
  color: #333;
  font-weight: 500;
  margin: 16rpx 0 24rpx 0;
}
.card {
  background: #fff;
  padding: 16rpx;
  margin: 16rpx;
}
.spec {
  margin-bottom: 16rpx;
}
.length {
  font-size: 24rpx;
  color: #333;
  margin-bottom: 16rpx;
}
</style>
