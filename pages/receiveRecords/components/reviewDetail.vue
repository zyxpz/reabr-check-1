<template>
  <view class="tab-content">
    <delivery-node />
    <u-cus-gap size="24" />
    <total-weight-deviation />
    <u-cus-gap size="24" />
    <reverse-check />
  </view>
</template>
<script>
import DeliveryNode from '@/pages/addReceive/components/deliveryNote/deliveryNote.vue';
import TotalWeightDeviation from '../../addReceive/components/totalWeightDeviation/totalWeightDeviation.vue';
import ReverseCheck from '../../addReceive//components/reverseCheck/reverseCheck.vue';
export default {
  components: {
    DeliveryNode,
    TotalWeightDeviation,
    ReverseCheck,
  },
};
</script>
