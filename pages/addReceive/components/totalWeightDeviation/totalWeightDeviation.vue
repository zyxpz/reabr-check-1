<template>
  <view class="item">
    <text class="title">2、总重偏差(千克)</text>
    <uni-table
      ref="table"
      :loading="loading"
      border
      emptyText="暂无数据"
      class="table"
    >
      <uni-tr>
        <uni-th width="30%" align="center">
          <view class="td-content">实称总重(手动录入)</view></uni-th
        >
        <uni-th width="25%" align="center">面单总量</uni-th>
        <uni-th width="25%" align="center">偏差重量</uni-th>
        <uni-th width="10%" align="center">偏差率</uni-th>
        <uni-th width="10%" align="center">结果</uni-th>
      </uni-tr>
      <uni-tr
        v-for="(item, index) in [{ name: 'HRB400φ24', amount: 12 }]"
        :key="index"
      >
        <uni-td align="center">{{ item.name }}</uni-td>
        <uni-td align="center">
          <view class="name">{{ item.amount }}</view>
        </uni-td>
        <uni-td align="center">{{ item.amount1 }}</uni-td>
        <uni-td align="center">
          {{ item.diff }}
        </uni-td>
        <uni-td align="center">
          {{ item.diff }}
        </uni-td>
      </uni-tr>
    </uni-table>
    <view class="g-flex-aic-jcc">
      <view class="g-flex-aic-jcsa" style="width: 80%">
        <u-cus-result type="success" text="总重偏差检验" />
      </view>
    </view>
    <u-cus-gap size="16" />
    <view class="g-flex-aic choose-content">
      <view>反向复核总重使用：</view>
      <uni-data-checkbox
        v-model="weighType"
        :localdata="weighTypeList"
        @change="handleChangeWeighType"
      ></uni-data-checkbox>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      weighType: '',
      weighTypeList: [
        { text: '实称总重', value: '1' },
        { text: '面单总重', value: '2' },
      ],
    };
  },
  methods: {
    handleChangeWeighType(e) {
      console.log(e);
      this.weighType = e.value;
    },
  },
};
</script>
<style lang="scss">
.title {
  font-weight: 700;
  font-size: 28rpx;
  padding: 16rpx;
}
.item {
  background-color: #fff;
  padding-top: 16rpx;
}
.uni-table-scroll {
  width: calc(100vw - 68rpx);
}
.choose-content {
  font-size: 28rpx !important;
  padding: 16rpx;
}
.table {
  margin: 24rpx 16rpx;
}
.td-content {
  max-width: 20vw;
  word-break: break-all;
}
</style>
