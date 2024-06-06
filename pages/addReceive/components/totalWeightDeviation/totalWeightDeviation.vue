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
        <uni-th width="30px" align="center">
          <view class="word-break">实称总重(手动录入)</view></uni-th
        >
        <uni-th width="25px" align="center">面单总量</uni-th>
        <uni-th width="25px" align="center">偏差重量</uni-th>
        <uni-th width="15px" align="center">偏差率(%)</uni-th>
        <uni-th width="10px" align="center">结果</uni-th>
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
        <uni-td align="center" class="td-10vw td-result">
          <uni-icons
            v-show="item.weightResult === 1"
            type="checkbox-filled"
            color="#23d923"
          />
          <uni-icons
            v-show="item.weightResult === 2"
            type="clear"
            color="red"
          />
        </uni-td>
      </uni-tr>
    </uni-table>
    <view class="g-flex-aic-jcc">
      <view class="g-flex-aic-jcsa" style="width: 80%">
        <u-cus-result
          :type="
            detail?.checkReverseVO?.totalCheckVO?.weightResult === 1
              ? 'success'
              : 'fail'
          "
          text="总重偏差检验"
        />
      </view>
    </view>
    <u-cus-gap size="16" />
    <view class="g-flex choose-content">
      <view>反向复核总重使用：</view>
      <uni-data-checkbox
        v-model="reverseWeightType"
        :localdata="weighTypeList"
        @change="handleChangeWeighType"
      ></uni-data-checkbox>
    </view>
  </view>
</template>
<script>
export default {
  props: ['detail'],
  data() {
    return {
      loading: false,
      reverseWeightType: '',
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
  watch: {
    detail(newValue) {
      this.reverseWeightType =
        newValue?.checkReverseVO?.totalCheckVO?.reverseWeightType + '';
      this.weighTypeList = this.weighTypeList?.map((one) => ({
        ...one,
        disable: newValue?.checkReverseVO?.totalCheckVO?.reverseWeightType,
      }));
    },
  },
};
</script>
<style lang="scss">
.title {
  font-weight: 700;
  font-size: 32rpx;
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
.word-break {
  word-break: break-all;
}
.uni-data-checklist .checklist-group {
  flex-wrap: nowrap !important;
}
</style>
