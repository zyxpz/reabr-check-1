<template>
  <view>
    <review-type :checkType="checkType" :detail="detail" />
    <finally-weight :detail="detail" />
    <material-amount-confirm
      :readOnly="Boolean(true)"
      :checkType="checkType"
      :detail="detail"
    />
  </view>
</template>
<script>
import ReviewType from '@/pages/addReceive/components/reviewType/reviewType.vue';
import FinallyWeight from '@/pages/addReceive/components/finallyWeight/finallyWeight.vue';
import MaterialAmountConfirm from '@/pages/addReceive/components/materialAmountConfirm/materialAmountConfirm.vue';

export default {
  props: ['checkType', 'detail'],
  components: {
    ReviewType,
    MaterialAmountConfirm,
    FinallyWeight,
  },
  data() {
    return {};
  },
};
</script>
