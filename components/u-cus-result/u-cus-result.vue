<template>
  <view v-if="type === 'success'" class="result">
    <uni-icons
      type="checkbox-filled"
      color="#23d923"
      :size="size === 'mini' ? 18 : 60"
    />
    <view v-if="size !== 'mini'" class="result">{{ text }}</view>
  </view>
  <view v-else class="result">
    <uni-icons type="clear" color="red" :size="size === 'mini' ? 30 : 60" />
    <view v-if="size !== 'mini'">{{ text }}</view>
  </view>
</template>
<script>
export default {
  props: ['type', 'text', 'size'],
  data() {
    return {};
  },
};
</script>
<style lang="scss">
.result {
  text-align: center;
  font-size: 32rpx;
  color: #444;
}
</style>
