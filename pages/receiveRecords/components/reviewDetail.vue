<template>
  <view class="tab-content">
    <delivery-node :detail="detail" />
    <u-cus-gap size="24" />
    <total-weight-deviation :detail="detail" />
    <u-cus-gap size="24" />
    <reverse-check :detail="detail" />
  </view>
</template>
<script>
import DeliveryNode from '@/pages/addReceive/components/deliveryNote/deliveryNote.vue';
import TotalWeightDeviation from '../../addReceive/components/totalWeightDeviation/totalWeightDeviation.vue';
import ReverseCheck from '../../addReceive//components/reverseCheck/reverseCheck.vue';
export default {
  props: ['detail'],
  components: {
    DeliveryNode,
    TotalWeightDeviation,
    ReverseCheck,
  },
};
</script>
