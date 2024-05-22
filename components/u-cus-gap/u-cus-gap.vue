<template>
  <view>
    <view v-show="direction === 'horizontal'" :style="horizontalStyle" />
    <view v-show="direction === 'vertical'" :style="verticalStyle" />
  </view>
</template>
<script>
export default {
  props: {
    direction: {
      type: String,
      default: 'horizontal',
    },
    size: {
      type: [String, Number],
      default: 24,
    },
  },
  computed: {
    horizontalStyle() {
      return {
        height: this.size + 'rpx',
        width: '100%',
      };
    },
    verticalStyle() {
      return {
        width: this.size + 'rpx',
        height: '100%',
      };
    },
  },
};
</script>
<style></style>
