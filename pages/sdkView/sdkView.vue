<!--
 * @Author: @pinming-chenhao
 * @Date: 2023-11-30 13:57:49
 * @LastEditors: @pinming-chenhao
 * @LastEditTime: 2023-12-07 15:50:38
 * @Description: 
-->

<template>
  <web-view
    ref="iframeRoot"
    id="ifram-root"
    style="height: 100vh; width: 100vw"
    :src="src"
    @message="onMessage"
    height="300px"
  >
  </web-view>
</template>
<script>
// import { onMounted, ref } from 'vue';
// import { useRoute } from 'vue-router';
import { mapMutations, mapState } from 'vuex';
import Test from './index';
// import { getUrlParam } from '@/utils/index';

// const route = useRoute();
// const attributionCode = route?.params?.attributionCode;
// onMounted(() => {
//   console.log(attributionCode, 'options');
//   new Test({
//     container: this.$refs.iframRoot,
//     urlParams: {
//       attributionCode: attributionCode,
//       assembleUrl: '/material-management/api/biz/sdk/sdk',
//     },
//     onOk: (data) => {
//       console.log(data, 'onOk');
//     },
//     onCancel: () => {
//       console.log('cancel');
//     },
//   });
// });
export default {
  data() {
    return {
      params: {},
      src: '',
    };
  },
  onLoad(options) {
    this.params = options;
    let search = '';
    Object.keys(options).forEach((key, index) => {
      if (!index) {
        /* 预发环境 */
        // search = `https://zhuang.pinming.cn/material-sdk-h5/#/?${key}=${options[key]}`;
        search = `https://zz-test05.pinming.org/material-sdk-h5/#/?${key}=${options[key]}`;
        // search = `http://192.168.1.184:5174/#/?${key}=${options[key]}`;
        /** 测试环境 */
        // search = `${window.location.origin}/material-sdk-h5/#/?${key}=${urlParams[key]}`;
        /** 本地 */
        // search = `/#/?${key}=${urlParams[key]}`;
      } else {
        search = `${search}&${key}=${options[key]}`;
      }
    });
    console.log(search, 'search');
    this.src = search;
  },
  mounted() {
    // new Test({
    //   container: this.$refs.iframRoot,
    //   urlParams: {
    //     attributionCode: this.params.attributionCode,
    //     assembleUrl: '/material-management/api/biz/sdk/sdk',
    //   },
    //   onOk: (data) => {
    //     console.log(data, 'onOk');
    //   },
    //   onCancel: () => {
    //     console.log('cancel');
    //   },
    // });
  },
  methods: {
    ...mapMutations(['setScanData']),
    onMessage(event) {
      console.log('Message event:', event); // Log the entire event object
      const message = event.detail.data[0];
      // if (message.action === 'cancel') {
      //   const data = message.data;
      //   console.log(data, 888);
      //   this.setScanData(data);
      //   uni.navigateBack({
      //     delta: 1,
      //   });
      // }
      if (message.action === 'confirm') {
        const data = message.data;
        this.setScanData(data);
        uni.navigateBack({
          delta: 1,
        });
      }
    },
  },
};
</script>
