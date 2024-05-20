<template>
  <view class="add-material-page">
    <view class="text">请根据送货单添加待验收钢筋规格 </view>
    <button type="primary">添加直螺纹钢筋</button>
    <uni-data-checkbox v-model="radio1" :localdata="sex"></uni-data-checkbox>
  </view>
</template>

<script>
import CusTip from '@/components/cus-tip'
export default {
  components: {
    CusTip
  },
  data() {
    return {
      sex: [{
        text: '仅称重验收',
        value: 0
      }, {
        text: '称重 + 实点根数验收',
        value: 1
      },],
    }
  },
  methods: {

  }
}
</script>

<style>
.add-material-page {
  padding: 24rpx
}

.text {
  background-color: #fff;
  padding: 24rpx;
  margin-bottom: 24rpx;
}
</style>
