<template>
  <view>
    <view class="item">
      <text class="title">3、反向根数复核(根/支)</text>
      <uni-table
        ref="table"
        :loading="loading"
        border
        emptyText="暂无数据"
        class="table"
      >
        <uni-tr>
          <uni-th width="30px" align="center">规格型号</uni-th>
          <uni-th width="30px" align="center">送货单根数</uni-th>
          <uni-th width="30px" align="center">实重复核根数</uni-th>
          <uni-th width="10px" align="center">差异</uni-th>
          <uni-th width="10px" align="center">结果</uni-th>
        </uni-tr>
        <uni-tr
          v-for="(item, index) in detail?.checkReverseVO?.reverseCheckVO ?? []"
          :key="index"
        >
          <uni-td align="center">{{ item.materialSpec }}</uni-td>
          <uni-td align="center">
            <view class="name">{{ item.sendAmount }}</view>
          </uni-td>
          <uni-td align="center">{{ item.reverseTheoryAmount }}</uni-td>
          <uni-td align="center">
            {{ item.amountDif }}
          </uni-td>
          <uni-td align="center">
            <uni-icons
              v-if="item.amountResult === 1"
              type="checkbox-filled"
              color="#23d923"
            />
            <uni-icons
              v-if="item.amountResult === 2"
              type="clear"
              color="red"
            />
          </uni-td>
        </uni-tr>
      </uni-table>
      <view class="g-flex-aic-jcc">
        <view class="g-flex-aic-jcsa" style="width: 80%">
          <u-cus-result
            :type="finallyAmountResult ? 'success' : 'fail'"
            text="反向根数复核结果"
          />
        </view>
      </view>
    </view>
    <view class="item">
      <text class="title">4、反向重量复核(千克)</text>
      <uni-table
        ref="table"
        :loading="loading"
        border
        emptyText="暂无数据"
        class="table"
      >
        <uni-tr>
          <uni-th width="30px" align="center">规格型号</uni-th>
          <uni-th width="30px" align="center">送货单重量</uni-th>
          <uni-th width="30px" align="center">实重复核重量</uni-th>
          <uni-th width="10px" align="center">差异</uni-th>
          <uni-th width="10px" align="center">结果</uni-th>
        </uni-tr>
        <uni-tr
          v-for="(item, index) in detail?.checkReverseVO?.reverseCheckVO ?? []"
          :key="index"
        >
          <uni-td align="center">{{ item.materialSpec }}</uni-td>
          <uni-td align="center">
            <view class="name">{{ item.sendWeight }}</view>
          </uni-td>
          <uni-td align="center">{{ item.reverseTheoryWeight }}</uni-td>
          <uni-td align="center">
            {{ item.weightDif }}
          </uni-td>
          <uni-td align="center">
            <uni-icons
              v-if="item.weightResult === 1"
              type="checkbox-filled"
              color="#23d923"
            />
            <uni-icons
              v-if="item.weightResult === 2"
              type="clear"
              color="red"
            />
          </uni-td>
        </uni-tr>
      </uni-table>
      <view class="g-flex-aic-jcc">
        <view class="g-flex-aic-jcsa" style="width: 80%">
          <u-cus-result
            :type="finallyWeightResult ? 'success' : 'fail'"
            text="反向重量复核结果"
          />
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: ['detail'],
  data() {
    return {
      loading: false,
    };
  },
  methods: {},
  computed: {
    finallyWeightResult() {
      return this?.detail?.checkReverseVO?.reverseCheckVO?.every(
        (one) => one.weightResult === 1,
      );
    },
    finallyAmountResult() {
      return this?.detail?.checkReverseVO?.reverseCheckVO?.every(
        (one) => one.amountResult === 1,
      );
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
  padding: 16rpx 0;
  margin-bottom: 24rpx;
}
.table {
  margin: 24rpx 16rpx;
}
.uni-table-scroll {
  width: calc(100vw - 68rpx);
}
.choose-content {
  font-size: 28rpx !important;
  padding: 16rpx;
}
</style>
