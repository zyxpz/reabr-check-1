<template>
  <view class="item">
    <text class="title">1、送货单各规格数据自洽检验</text>
    <uni-section title="送货单各规格数据自洽检验(根/支)" type="line" padding>
      <uni-table
        ref="table"
        :loading="loading"
        border
        emptyText="暂无数据"
        minWidth="100"
      >
        <uni-tr>
          <uni-th width="30%" align="center">规格型号</uni-th>
          <uni-th width="25%" align="center">送货单根数</uni-th>
          <uni-th width="25%" align="center">理重复核根数</uni-th>
          <uni-th width="10%" align="center">差异</uni-th>
          <uni-th width="10%" align="center">结果</uni-th>
        </uni-tr>
        <uni-tr
          v-for="(item, index) in [{ name: 'HRB400φ24', amount: 12 }]"
          :key="index"
        >
          <uni-td align="center"
            ><view class="td-content">{{ item.name }}</view></uni-td
          >
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
    </uni-section>
    <uni-section title="重量自洽检验(千克)" type="line" padding>
      <uni-table
        ref="table"
        :loading="loading"
        border
        emptyText="暂无数据"
        minWidth="100"
      >
        <uni-tr>
          <uni-th width="30%" align="center">规格型号</uni-th>
          <uni-th width="25%" align="center">送货单重量</uni-th>
          <uni-th width="25%" align="center">理重复核重量</uni-th>
          <uni-th width="10%" align="center">差异</uni-th>
          <uni-th width="10%" align="center">结果</uni-th>
        </uni-tr>
        <uni-tr
          v-for="(item, index) in [{ name: 'HRB400φ24', amount: 12 }]"
          :key="index"
        >
          <uni-td align="center"
            ><view class="td-content">{{ item.name }}</view></uni-td
          >
          <uni-td align="center">
            <view class="name">{{ item.amount }}</view>
          </uni-td>
          <uni-td align="center">{{ item.amount1 }}</uni-td>
          <uni-td align="center">
            {{ item.diff }}
          </uni-td>
          <uni-td align="center">
            <u-cus-result type="success" size="mini" />
          </uni-td>
        </uni-tr>
      </uni-table>
    </uni-section>
    <view class="g-flex-aic-jcc">
      <view class="g-flex-aic-jcsa" style="width: 80%">
        <u-cus-result type="success" text="各规格根数检验" />
        <u-cus-result type="fail" text="各规格重量校验" />
      </view>
    </view>
    <u-cus-gap size="16" />
  </view>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
    };
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
.td-content {
  max-width: 20vw;
  word-break: break-all;
}
</style>
