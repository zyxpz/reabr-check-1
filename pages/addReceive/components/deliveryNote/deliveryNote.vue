<template>
  <view class="item">
    <text class="title">1、送货单各规格数据自洽检验</text>
    <uni-section title="送货单各规格数据自洽检验(根/支)" type="line" padding>
      <uni-table ref="table" :loading="loading" border emptyText="暂无数据">
        <uni-tr>
          <uni-th width="30px" align="center">规格型号</uni-th>
          <uni-th width="30px" align="center">送货单根数</uni-th>
          <uni-th width="30px" align="center">理重复核根数</uni-th>
          <uni-th width="15px" align="center">差异</uni-th>
          <uni-th width="10px" align="center">结果</uni-th>
        </uni-tr>
        <uni-tr
          v-for="(item, index) in detail?.checkReverseVO?.theoryCheckVO ?? []"
          :key="index"
        >
          <uni-td align="center"
            ><view>{{ item.materialSpec }}</view></uni-td
          >
          <uni-td align="center">
            <view>{{ item.sendAmount }}</view>
          </uni-td>
          <uni-td align="center">{{ item.theoryAmount }}</uni-td>
          <uni-td align="center">
            {{ item.amountDif }}
          </uni-td>
          <uni-td align="center" class="td-10vw td-result">
            <uni-icons
              v-show="item.amountResult === 1"
              type="checkbox-filled"
              color="#23d923"
            />
            <uni-icons
              v-show="item.amountResult === 2"
              type="clear"
              color="red"
            />
          </uni-td>
        </uni-tr>
      </uni-table>
    </uni-section>
    <uni-section title="重量自洽检验(千克)" type="line" padding>
      <uni-table ref="table" :loading="loading" border emptyText="暂无数据">
        <uni-tr>
          <uni-th width="30px" align="center">规格型号</uni-th>
          <uni-th width="30px" align="center">送货单重量</uni-th>
          <uni-th width="30px" align="center">理重复核重量</uni-th>
          <uni-th width="15px" align="center">差异</uni-th>
          <uni-th width="10px" align="center">结果</uni-th>
        </uni-tr>
        <uni-tr
          v-for="(item, index) in detail?.checkReverseVO?.theoryCheckVO ?? []"
          :key="index"
        >
          <uni-td align="center"
            ><view>{{ item.materialSpec }}</view></uni-td
          >
          <uni-td align="center">
            <view>{{ item.sendWeight }}</view>
          </uni-td>
          <uni-td align="center">{{ item.theoryWeight }}</uni-td>
          <uni-td align="center">
            {{ item.weightDif }}
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
    </uni-section>
    <view class="g-flex-aic-jcc">
      <view class="g-flex-aic-jcsa" style="width: 80%">
        <u-cus-result
          :type="finallyAmountResult ? 'success' : 'fail'"
          text="各规格根数检验"
        />
        <u-cus-result
          :type="finallyWeightResult ? 'success' : 'fail'"
          text="各规格重量校验"
        />
      </view>
    </view>
    <u-cus-gap size="16" />
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
  watch: {
    detail(newValue) {
      console.log(newValue, 77);
    },
  },
  computed: {
    finallyWeightResult() {
      return this?.detail?.checkReverseVO?.theoryCheckVO?.every(
        (one) => one.weightResult === '1',
      );
    },
    finallyAmountResult() {
      return this?.detail?.checkReverseVO?.theoryCheckVO?.every(
        (one) => one.amountResult === '1',
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
  padding-top: 16rpx;
}
.uni-table-scroll {
  width: calc(100vw - 68rpx);
}
.word-break {
  word-break: break-all;
}
.td-result {
  padding: 0 !important;
}
</style>
