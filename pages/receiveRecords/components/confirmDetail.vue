<template>
  <view v-if="detail?.checkConfirmVO?.type === 2">
    <tray-rebar :detail="detail" :readOnly="readOnly" />
  </view>
  <view v-if="detail?.checkConfirmVO?.type === 1">
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
import TrayRebar from '@/pages/addReceive/components/trayRebar/trayRebar.vue';

export default {
  props: ['checkType', 'detail'],
  components: {
    ReviewType,
    MaterialAmountConfirm,
    FinallyWeight,
    TrayRebar,
  },
  data() {
    return {
      readOnly: true,
    };
  },
};
</script>
