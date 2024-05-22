<template>
  <view class="title">总重选用（千克）</view>
  <view class="card">
    <uni-table ref="table" :loading="loading" border emptyText="暂无数据">
      <uni-tr>
        <uni-th width="30%" align="center">
          <view class="td-content">混装实称总重(手动录入)</view></uni-th
        >
        <uni-th width="25%" align="center">面单总量</uni-th>
        <uni-th width="25%" align="center">偏差值</uni-th>
        <uni-th width="10%" align="center">偏差率</uni-th>
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
      </uni-tr>
    </uni-table>
    <u-cus-gap size="16" />
    <view>
      <text>反向复核使用总重量：</text>
      <text>1230.123 千克 （实称总重）</text>
    </view>
  </view>
</template>
<script></script>
<style>
.title {
  font-size: 28rpx;
  color: #333;
  text-align: center;
  font-weight: 500;
  margin: 16rpx;
}
.card {
  background: #fff;
  padding: 16rpx;
  margin: 16rpx;
}
</style>
