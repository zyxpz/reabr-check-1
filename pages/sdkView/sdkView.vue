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
  >
  </web-view>
</template>
<script>
// import { onMounted, ref } from 'vue';
// import { useRoute } from 'vue-router';
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
    console.log(this.$refs.iframRoot, 123);
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
};
</script>
