<template>
  <view class="card">
    <view class="title"
      >总重偏差（千克）<text style="color: red" v-show="!readOnly"
        >点选确认</text
      ></view
    >
    <uni-table ref="table" border emptyText="暂无数据">
      <uni-tr>
        <uni-th width="30px" align="center"> 实称总重</uni-th>
        <uni-th width="25px" align="center">面单总重</uni-th>
        <uni-th width="25px" align="center">偏差重量</uni-th>
        <uni-th width="10px" align="center">偏差率</uni-th>
        <uni-th width="10px" align="center">结果</uni-th>
      </uni-tr>
      <uni-tr v-for="(item, index) in dataSource" :key="index">
        <uni-td
          align="center"
          :style="
            item.reverseWeightType === 1 ? 'background-color: #28fb28' : ''
          "
          @click="() => handleTd(1)"
          >{{ item.actualWeight }}</uni-td
        >
        <uni-td
          :style="
            item.reverseWeightType === 2 ? 'background-color: #28fb28' : ''
          "
          align="center"
          @click="() => handleTd(2)"
        >
          <view class="name">{{ item.sendWeight }}</view>
        </uni-td>
        <uni-td align="center">{{ item.weightDif }}</uni-td>
        <uni-td align="center">
          {{ item.weightRate }}
        </uni-td>
        <uni-td align="center" class="td-10vw td-result">
          <uni-icons
            v-if="item.weightResult === 1"
            type="checkbox-filled"
            color="#23d923"
          />
          <uni-icons v-if="item.weightResult === 2" type="clear" color="red" />
        </uni-td>
      </uni-tr>
    </uni-table>
    <u-cus-gap size="20" />
    <u-cus-result
      :type="
        detail?.checkReverseVO?.totalCheckVO?.weightResult === 1
          ? 'success'
          : 'fail'
      "
      text="总重偏差检验"
    />
    <u-cus-gap size="30" />
    <view>
      <text>数量确认：</text>
      <text
        >{{ dataSource?.[0]?.confirmWeight ?? '-' }} 千克
        {{ reverseWeightType === 1 ? '（ 实称总重 ）' : '（ 面单总重 ）' }}
      </text>
    </view>
  </view>
</template>
<script>
export default {
  props: ['detail', 'readOnly'],
  data() {
    return {
      dataSource: [],
    };
  },
  methods: {
    /**
     * 点击表格单元格
     * @param type 点击的是哪一列 1：送货单 2：复核结果 3：实点根数
     */
    handleTd(type) {
      console.log(this.readOnly, 'this.readOnly');
      if (this.readOnly) return;
      this.dataSource = this.dataSource.map((one) => {
        return {
          ...one,
          reverseWeightType: type,
          confirmWeight: type === 1 ? one?.actualWeight : one?.sendWeight,
        };
      });
    },
  },
  watch: {
    detail(newV) {
      const { checkReverseVO, checkConfirmVO } = newV;
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
    },
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
