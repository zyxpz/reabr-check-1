<template>
  <view class="page">
    <uv-tabs
      :list="tabs"
      @change="handleClickTab"
      :activeStyle="{ color: '#3c9cff' }"
      lineWidth="160rpx"
    ></uv-tabs>
    <view class="content">
      <view v-show="activeKey === 'confirm'"><confirm-detail /></view>
      <view v-show="activeKey === 'review'" style="padding: 16rpx"
        ><review-detail
      /></view>
      <view v-show="activeKey === 'car'">car</view>
    </view>
  </view>
</template>
<script>
import ReviewDetail from './components/reviewDetail.vue';
import ConfirmDetail from './components/confirmDetail.vue';

export default {
  components: {
    ReviewDetail,
    ConfirmDetail,
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
    };
  },
  methods: {
    handleClickTab(item) {
      console.log(item, 'item');
      this.activeKey = item.key;
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
