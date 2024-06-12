<template>
  <view class="page">
    <view class="card">
      <view class="title">总重偏差（千克）</view>
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
            <uni-icons
              v-if="item.weightResult === 2"
              type="clear"
              color="red"
            />
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
        <text>{{ dataSource?.[0]?.confirmWeight ?? '-' }} 千克 </text>
      </view>
    </view>
    <uni-row class="g-flex-aic-jcsb">
      <uni-col :span="9"
        ><button type="primary" @click="handleChangeOriginData">
          修改运单数据
        </button></uni-col
      >
      <uni-col :span="5"
        ><button type="warn" @click="handleCancel">取消</button></uni-col
      >
      <uni-col :span="9"
        ><button type="primary" @click="handleNext">
          确认车辆信息
        </button></uni-col
      >
    </uni-row>
  </view>
</template>
<script>
import request from '@/utils/request';

export default {
  data() {
    return {
      detail: {},
      dataSource: [],
    };
  },
  methods: {
    /**
     * 点击表格单元格
     * @param type 点击的是哪一列 1：送货单 2：复核结果 3：实点根数
     */
    handleTd(type) {
      this.dataSource = this.dataSource.map((one) => {
        return {
          ...one,
          reverseWeightType: type,
          confirmWeight: type === 1 ? one?.actualWeight : one?.sendWeight,
        };
      });
    },
    /**
     * 修改运单数据
     */
    handleChangeOriginData() {
      uni.redirectTo({
        url: `/pages/addReceive/addMaterial?id=${this.id}&rebarType=${this.detail?.checkConfirmVO?.type}`,
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
    async handleNext() {
      /** 如果没有说明是新增 */
      const reverseWeightType = this.dataSource?.[0]?.reverseWeightType;
      if (!reverseWeightType) {
        uni.showToast({
          title: '请点选使用的复核总重',
          icon: 'none',
        });
        return;
      } else {
        console.log(reverseWeightType, 'reverseWeightType');
        uni.showLoading();
        await request.get(
          `/api/rebarCheck/reverseWeightType/${this.id}/${reverseWeightType}`,
        );
        uni.showLoading();
        uni.redirectTo({
          url: `/pages/addReceive/confirmCarInfos?id=${this.id}`,
        });
      }
    },
    async getDetail() {
      uni.showLoading();
      try {
        const res = await request.get(`/api/rebarCheck/checkDetail/${this.id}`);
        uni.hideLoading();
        this.detail = res?.data;
        const { checkReverseVO, checkConfirmVO } = res?.data;
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
        console.log(this.dataSource, 'dataSource');
      } catch (error) {
        uni.hideLoading();
      }
    },
  },
  onLoad(options) {
    this.id = options.id;
    this.getDetail();
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
