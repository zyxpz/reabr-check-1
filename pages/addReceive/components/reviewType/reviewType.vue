<template>
  <view>
    <view class="title">复核模式</view>
    <view class="des-card">{{ checkType === 2 ? '实称 + 实点' : '实称' }}</view>
    <view class="title">总重选中（千克）</view>
    <view class="des-card"
      ><uni-table
        ref="table"
        :loading="loading"
        border
        emptyText="暂无数据"
        class="table"
      >
        <uni-tr>
          <uni-th width="35px" align="center">
            <view class="word-break">实称总重(手动录入)</view></uni-th
          >
          <uni-th width="20px" align="center">面单总量</uni-th>
          <uni-th width="20px" align="center">偏差重量</uni-th>
          <uni-th width="15px" align="center">偏差率(%)</uni-th>
        </uni-tr>
        <uni-tr
          v-for="(item, index) in detail?.checkReverseVO?.totalCheckVO
            ? [detail?.checkReverseVO?.totalCheckVO]
            : []"
          :key="index"
        >
          <uni-td align="center">{{ item.actualWeight }}</uni-td>
          <uni-td align="center">
            <view class="name">{{ item.sendWeight }}</view>
          </uni-td>
          <uni-td align="center">{{ item.weightDif }}</uni-td>
          <uni-td align="center">
            {{ item.weightRate }}
          </uni-td>
        </uni-tr>
      </uni-table>
      <view class="total-des"
        >反向复核使用总重量：{{ detail?.checkConfirmVO?.actualWeight }} （{{
          detail?.checkConfirmVO?.reverseWeightType ? '实称总重' : '面单数量'
        }}）
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: ['checkType', 'detail'],
};
</script>
<style lang="scss">
.title {
  font-size: 30rpx;
  color: #333;
  text-align: center;
  font-weight: 500;
  margin: 16rpx;
}
.des-card {
  background-color: #fff;
  padding: 16rpx;
  margin-bottom: 16rpx;
  margin: 16rpx;
  text-align: center;
}
.total-des {
  text-align: left;
  margin: 28rpx 0 8rpx 0;
}
</style>
