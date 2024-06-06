<template>
  <view>
    <review-type :checkType="checkType" :detail="detail" />
    <material-amount-confirm
      :readOnly="Boolean(true)"
      :checkType="checkType"
      :detail="detail"
    />
  </view>
</template>
<script>
import reviewType from '@/pages/addReceive/components/reviewType/reviewType.vue';
import MaterialAmountConfirm from '@/pages/addReceive/components/materialAmountConfirm/materialAmountConfirm.vue';

export default {
  props: ['checkType', 'detail'],
  components: {
    reviewType,
    MaterialAmountConfirm,
  },
  data() {
    return {};
  },
};
</script>
