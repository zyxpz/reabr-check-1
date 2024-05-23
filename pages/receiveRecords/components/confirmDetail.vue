<template>
  <view>
    <review-type />
    <material-amount-confirm :readOnly="true" />
  </view>
</template>
<script>
import reviewType from '@/pages/addReceive/components/reviewType/reviewType.vue';
import MaterialAmountConfirm from '@/pages/addReceive/components/materialAmountConfirm/materialAmountConfirm.vue';

export default {
  components: {
    reviewType,
    MaterialAmountConfirm,
  },
  data() {
    return {};
  },
};
</script>
