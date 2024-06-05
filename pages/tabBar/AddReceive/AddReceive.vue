<template>
  <view class="add-receive-page">
    <view v-if="!isHasToken"><cus-tip :tipType="1" /></view>
    <view v-else class="btn-w-80">
      <view class="button-style" @click="() => handleToAddMaterial('1')"
        >验收混装直条钢筋</view
      >
      <view class="button-style" @click="() => handleToAddMaterial('2')"
        >验收盘螺钢筋</view
      >
    </view>
  </view>
</template>

<script>
import CusTip from '@/components/cus-tip';
export default {
  components: {
    CusTip,
  },
  data() {
    return {
      isHasToken: false,
    };
  },
  onLoad() {
    console.log(uni.getStorageSync('cus-token'), 77);
    this.isHasToken = uni.getStorageSync('cus-token');
  },
  methods: {
    handleToAddMaterial(type) {
      uni.navigateTo({
        url: `/pages/addReceive/addMaterial?rebarType=${type}`, // 替换为你的页面路径
      });
    },
  },
};
</script>

<style>
.add-receive-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
}
.tip-content {
  padding: 64rpx 24rpx;
}

.tip {
  background-color: rgb(255, 249, 234);
  font-size: 40rpx;
  color: rgb(255, 154, 67);
  padding: 48rpx 24rpx;
}

.ta-c {
  text-align: center;
}

.btn-content {
  padding: 0 10%;
}

.button-style {
  display: inline-block;
  /* 使其行为像行内块元素 */
  text-align: center;
  font-size: 54rpx;
  padding: 80rpx;
  margin: 40rpx 10%;
  width: 60%;
  /* 内边距，根据需要调整 */
  /* background-color: #007BFF; */
  /* 按钮的背景颜色，这里使用的是Bootstrap的主题蓝 */
  color: #999;
  /* 文字颜色 */
  text-align: center;
  /* 文字居中显示 */
  border-radius: 5px;
  /* 圆角边框 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  /* 阴影效果 */
  transition: background-color 0.3s;
  /* 过渡动画 */
  color: rgb(255, 154, 67);
  background-color: rgb(255, 249, 234);
}

.button-style:active {
  background-color: #fefefe;
  /* 鼠标悬停时的背景颜色 */
  cursor: pointer;
  /* 鼠标悬停时显示指针光标 */
}
</style>
