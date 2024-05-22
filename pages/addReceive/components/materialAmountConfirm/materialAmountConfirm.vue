<template>
  <view class="title"
    >各规格收货数据<text style="color: red">点选确认</text></view
  >
  <view class="card" v-for="dt in materialLists">
    <view class="spec">{{ dt.name }}</view>
    <view class="length">单根长度（米）： {{ dt.amount }} 米</view>
    <uni-table ref="table" border emptyText="暂无数据">
      <uni-tr>
        <uni-th width="30%" align="center">
          <view class="td-content">维度</view></uni-th
        >
        <uni-th width="25%" align="center">送货单</uni-th>
        <uni-th width="25%" align="center">复核结果</uni-th>
        <uni-th width="10%" align="center">实点根数</uni-th>
      </uni-tr>
      <uni-tr v-for="(item, index) in dt.children" :key="index">
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
        <uni-td
          :style="item.checkedType === '3' ? 'background-color: #28fb28' : ''"
          align="center"
          @click="() => handleTd(dt, item, '3')"
        >
          {{ item.diff }}
        </uni-td>
      </uni-tr>
    </uni-table>
    <u-cus-gap size="20" />
    <view>
      <text>数量确认：</text>
      <text>1230.123 千克， 25 根 </text>
    </view>
  </view>
</template>
<script>
import { v4 as uuidv4 } from 'uuid';
export default {
  data() {
    return {
      materialLists: [
        {
          name: 'HRB400φ24',
          amount: 12,
          amount1: 12,
          diff: 0,
          id: uuidv4(),
          children: [
            {
              name: '根数',
              key: 'account',
              amount: 12,
              amount1: 12,
              diff: 0,
            },
            {
              name: '重量（千克）',
              key: 'weight',
              amount: 12,
              amount1: 12,
              diff: 0,
            },
          ],
        },
        {
          name: 'HRB400φ24',
          amount: 12,
          amount1: 12,
          diff: 0,
          id: uuidv4(),
        },
      ],
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
      console.log(dt, item, type);
      this.materialLists = this.materialLists.map((one) => {
        if (one.id === dt.id) {
          return {
            ...one,
            children: one.children.map((two) => {
              if (two.key === item.key) {
                return {
                  ...two,
                  checkedType: type,
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
};
</script>
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
.spec {
  margin-bottom: 16rpx;
}
.length {
  font-size: 24rpx;
  color: #333;
  margin-bottom: 16rpx;
}
</style>
