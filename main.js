import App from './App';
import store from './store';
import { HFdebugging } from '@/uni_modules/HF-HF_debugging/common/next.js';

// #ifndef VUE3
import Vue from 'vue';
Vue.config.productionTip = false;
Vue.prototype.$store = store;
Vue.prototype.$adpid = '1111111111';
Vue.prototype.$backgroundAudioData = {
  playing: false,
  playTime: 0,
  formatedPlayTime: '00:00:00',
};
Vue.config.ignoredElements = [/^uv-/]; // 忽略所有以 'uv-' 开头的元素
App.mpType = 'app';
const app = new Vue({
  store,
  ...App,
});
app.$mount();
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue';
export function createApp() {
  const app = createSSRApp(App);
  new HFdebugging({ app });
  app.use(store);
  app.config.globalProperties.$adpid = '1111111111';
  app.config.globalProperties.$backgroundAudioData = {
    playing: false,
    playTime: 0,
    formatedPlayTime: '00:00:00',
  };
  return {
    app,
  };
}
// #endif
