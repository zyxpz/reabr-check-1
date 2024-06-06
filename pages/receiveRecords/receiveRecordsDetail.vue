<template>
  <view class="page">
    <uv-tabs
      :list="tabs"
      @change="handleClickTab"
      :activeStyle="{ color: '#3c9cff' }"
      lineWidth="160rpx"
    ></uv-tabs>
    <view class="content">
      <view v-show="activeKey === 'confirm'"
        ><confirm-detail :checkType="checkType" :detail="detail"
      /></view>
      <view v-show="activeKey === 'review'" style="padding: 16rpx"
        ><review-detail :detail="detail"
      /></view>
      <view v-show="activeKey === 'car'"><car-detail :detail="detail" /></view>
    </view>
  </view>
</template>
<script>
import ReviewDetail from './components/reviewDetail.vue';
import ConfirmDetail from './components/confirmDetail.vue';
import CarDetail from './components/carDetail.vue';
import request from '@/utils/request.js';
// import ConfirmCarInfo from '@/pages/addReceive/confirmCarInfos.vue';

export default {
  components: {
    ReviewDetail,
    ConfirmDetail,
    // ConfirmCarInfo,
    CarDetail,
  },
  data() {
    return {
      activeKey: 'confirm',
      tabs: [
        {
          name: '数量确认详情',
          key: 'confirm',
        },
        {
          name: '数量复核详情',
          key: 'review',
        },
        {
          name: '车辆及其他',
          key: 'car',
        },
      ],
      id: '',
      detail: {},
    };
  },
  onLoad(options) {
    this.id = options.id;
    this.getDetail();
  },
  methods: {
    handleClickTab(item) {
      console.log(item, 'item');
      this.activeKey = item.key;
    },
    async getDetail() {
      const res = await request.get(`/api/rebarCheck/checkDetail/${this.id}`);
      this.detail = res?.data;
    },
  },
  computed: {
    checkType() {
      return this.detail.checkConfirmVO?.checkType;
    },
  },
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
  // padding: 16rpx;
  flex: 1;
  overflow: auto;
}
</style>
