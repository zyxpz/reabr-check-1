<template>
  <view class="title"
    >各规格收货数据<text style="color: red" v-show="!readOnly">点选确认</text
    ><text v-show="readOnly">确认</text></view
  >
  <view class="card" v-for="dt in materialLists">
    <view class="spec">{{ dt.materialSpec }}</view>
    <view class="length">单根长度（米）： {{ dt.length }} 米</view>
    <uni-table ref="table" border emptyText="暂无数据">
      <uni-tr>
        <uni-th width="15px" align="center"> 维度</uni-th>
        <uni-th width="25px" align="center">送货单</uni-th>
        <uni-th width="25px" align="center">复核结果</uni-th>
      </uni-tr>
      <uni-tr v-for="(item, index) in dt?.children" :key="index">
        <uni-td align="center">{{ item.name }}</uni-td>
        <uni-td
          :style="item.checkedType === '1' ? 'background-color: #28fb28' : ''"
          align="center"
          @click="() => handleTd(dt, item, '1')"
        >
          <view class="name">{{ item.amount }}</view>
        </uni-td>
        <uni-td
          align="center"
          :style="item.checkedType === '2' ? 'background-color: #28fb28' : ''"
          @click="() => handleTd(dt, item, '2')"
          >{{ item.amount1 }}</uni-td
        >
      </uni-tr>
    </uni-table>
    <u-cus-gap size="20" />
    <view>
      <text>数量确认：</text>
      <text
        >{{ dt?.children?.[1]?.confirmWeight ?? '-' }}
        千克，
        {{ dt?.children?.[0]?.confirmAmount ?? '-' }}
        根
      </text>
    </view>
  </view>
</template>
<script>
import { v4 as uuidv4 } from 'uuid';
export default {
  props: ['readOnly', 'checkType', 'detail'],
  data() {
    return {
      materialLists: [],
    };
  },
  methods: {
    /**
     * 点击表格单元格
     * @param dt 规格卡片分类
     * @param item 点击的是那一行数据
     * @param type 点击的是哪一列 1：送货单 2：复核结果 3：实点根数
     */
    handleTd(dt, item, type) {
      if (this.readOnly) return;
      this.materialLists = this.materialLists.map((one) => {
        if (one.id === dt.id) {
          return {
            ...one,
            children: one.children.map((two) => {
              const temp =
                item.key === 'account'
                  ? {
                      confirmAmount: type === '1' ? two.amount : two.amount1,
                    }
                  : {
                      confirmWeight: type === '1' ? two.amount : two.amount1,
                    };
              if (two.key === item.key) {
                return {
                  ...two,
                  checkedType: type,
                  ...temp,
                };
              } else {
                return two;
              }
            }),
          };
        } else {
          return one;
        }
      });
      console.log(this.materialLists, 'this.materialLists');
    },
  },
  watch: {},
  watch: {
    detail(newValue) {
      this.materialLists = newValue?.checkConfirmVO?.list?.map((one) => ({
        ...one,
        children: [
          {
            name: '根数',
            key: 'account',
            amount: one.sendAmount,
            amount1: one.reverseTheoryAmount,
            checkedType: one.confirmAmount
              ? one.reverseTheoryAmount === one.confirmAmount
                ? '2'
                : '1'
              : undefined,
          },
          {
            name: '重量（千克）',
            key: 'weight',
            amount: one.sendWeight,
            amount1: one.reverseTheoryWeight,
            checkedType: one.confirmWeight
              ? one.reverseTheoryWeight === one.confirmWeight
                ? '2'
                : '1'
              : undefined,
          },
        ],
      }));
      console.log(this.materialLists, 'this.materialLists');
    },
  },
};
</script>
<style>
.title {
  font-size: 30rpx;
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
.spec {
  margin-bottom: 16rpx;
}
.length {
  font-size: 24rpx;
  color: #333;
  margin-bottom: 16rpx;
}
</style>
