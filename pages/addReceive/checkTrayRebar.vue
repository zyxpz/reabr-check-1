<template>
  <view class="page">
    <view class="card">
      <view class="title">总重偏差（千克）</view>
      <uni-table ref="table" border emptyText="暂无数据">
        <uni-tr>
          <uni-th width="30%" align="center">
            <view class="td-content">实称总重</view></uni-th
          >
          <uni-th width="25%" align="center">面单总重</uni-th>
          <uni-th width="25%" align="center">偏差重量</uni-th>
          <uni-th width="10%" align="center">偏差率</uni-th>
          <uni-th width="10%" align="center">结果</uni-th>
        </uni-tr>
        <uni-tr v-for="(item, index) in dataSource" :key="index">
          <uni-td
            align="center"
            :style="item.checkedType === '1' ? 'background-color: #28fb28' : ''"
            @click="() => handleTd('1')"
            >{{ item.number1 }}</uni-td
          >
          <uni-td
            :style="item.checkedType === '2' ? 'background-color: #28fb28' : ''"
            align="center"
            @click="() => handleTd('2')"
          >
            <view class="name">{{ item.number2 }}</view>
          </uni-td>
          <uni-td
            align="center"
            :style="item.checkedType === '3' ? 'background-color: #28fb28' : ''"
            @click="() => handleTd('3')"
            >{{ item.number3 }}</uni-td
          >
          <uni-td
            :style="item.checkedType === '4' ? 'background-color: #28fb28' : ''"
            align="center"
            @click="() => handleTd('4')"
          >
            {{ item.number4 }}
          </uni-td>
          <uni-td align="center">
            <u-cus-result type="success" size="mini" />
          </uni-td>
        </uni-tr>
      </uni-table>
      <u-cus-gap size="20" />
      <u-cus-result type="success" text="总重偏差检验" />
      <u-cus-gap size="30" />
      <view>
        <text>数量确认：</text>
        <text>1230.123 千克 </text>
      </view>
    </view>
    <uni-row class="g-flex-aic-jcsb">
      <uni-col :span="8"
        ><button type="primary" @click="handleChangeOriginData">
          修改运单数据
        </button></uni-col
      >
      <uni-col :span="6"
        ><button type="warn" @click="handleCancel">取消</button></uni-col
      >
      <uni-col :span="8"
        ><button type="primary" @click="handleNext">
          确认车辆信息
        </button></uni-col
      >
    </uni-row>
  </view>
</template>
<script>
import { v4 as uuidv4 } from 'uuid';
export default {
  data() {
    return {
      dataSource: [
        {
          id: uuidv4(),
          number1: 123,
          number2: 234,
          number3: 111,
          number4: 767,
          checkedType: '',
        },
      ],
    };
  },
  methods: {
    /**
     * 点击表格单元格
     * @param type 点击的是哪一列 1：送货单 2：复核结果 3：实点根数
     */
    handleTd(type) {
      this.dataSource = this.dataSource.map((one) => {
        console.log(one);
        return {
          ...one,
          checkedType: type,
        };
      });
    },
    /**
     * 修改运单数据
     */
    handleChangeOriginData() {
      uni.navigateTo({
        url: '/pages/addReceive/addMaterial',
      });
    },
    /**
     * 取消
     */
    handleCancel() {
      uni.switchTab({
        url: '/pages/tabBar/AddReceive/AddReceive',
      });
    },
    /**
     * 确认车辆信息
     */
    handleNext() {
      uni.navigateTo({
        url: '/pages/addReceive/confirmCarInfos',
      });
    },
  },
};
</script>
<style>
.page {
  padding: 16rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100vh - 72px);
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
