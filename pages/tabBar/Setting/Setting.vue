<template>
  <view class="page">
    <!-- <uni-notice-bar text="请在“设置”页，扫一扫绑定基石授权用户码" />
    <uni-notice-bar text="用户授权码失效，请重新绑定。" />
    <uni-notice-bar text="当前归属方未订阅此服务或订阅已到期。" /> -->
    <uni-list :border="listBorder" class="bg">
      <uni-list-item>
        <template v-slot:header>
          <view class="slot-box slot-left">
            <text>设备码</text>
          </view>
        </template>
        <template v-slot:body>
          <text class="slot-box slot-text" ref="textToCopy">{{
            systemInfo.model
          }}</text>
        </template>
        <template v-slot:footer>
          <text @click="handleCopy" class="cus-a">复制</text>
        </template>
      </uni-list-item>
      <uni-list-item>
        <template v-slot:header>
          <view class="slot-box slot-left">
            <text>基石租户</text>
          </view>
        </template>
        <template v-slot:body>
          <text class="slot-box slot-text" ref="attribute">{{
            tenantInfo.userName
          }}</text>
        </template>
        <template v-slot:footer>
          <picker
            @change="changeTenant"
            :value="tenantIndex"
            :range="infosByPhoneSn"
            range-key="userName"
          >
            <text class="cus-a">切换</text>
          </picker>
        </template>
      </uni-list-item>
      <uni-list-item>
        <template v-slot:header>
          <view class="slot-box slot-left">
            <text>归属方</text>
          </view>
        </template>
        <template v-slot:body>
          <text class="slot-box slot-text" ref="attribute">{{
            attributeInfo.name
          }}</text>
        </template>
        <template v-slot:footer>
          <picker
            @change="changeAttribute"
            :value="attributeIndex"
            :range="attributeList"
            range-key="name"
          >
            <text class="cus-a">切换</text>
          </picker>
        </template>
      </uni-list-item>
      <uni-list-item>
        <template v-slot:header>
          <view class="slot-box slot-left">
            <text>用户</text>
          </view>
        </template>
        <template v-slot:body>
          <text class="slot-box slot-text" ref="attribute">{{
            tenantInfo.consumeName
          }}</text>
        </template>
      </uni-list-item>
    </uni-list>
  </view>
</template>

<script>
import request from '@/utils/request';
import { mapState, mapMutations, mapActions } from 'vuex';
// var testModule = uni.requireNativePlugin('Univalsoft-DeviceId');
export default {
  data() {
    return {
      /**
       * list border
       */
      listBorder: false,
      /**
       * 设备信息
       */
      systemInfo: {},
      /**
       * 租户信息
       */
      tenantInfo: {},
      tenantIndex: 0,
      /**
       * 归属方信息
       */
      attributeList: [],
      attributeInfo: {},
      attributeIndex: 0,
      /**
       * 用户信息
       */
      userInfo: {},
      /** 根据设备码拿用户信息 */
      infosByPhoneSn: [],
    };
  },
  computed: {
    ...mapState(['suerInfo']),
  },
  methods: {
    ...mapMutations(['setUserInfo', 'setCusToken']),
    writeFile(path, content) {
      plus.io.requestFileSystem(
        plus.io.PRIVATE_DOC,
        function (fs) {
          fs.root.getFile(
            path,
            { create: true },
            function (fileEntry) {
              fileEntry.createWriter(function (writer) {
                writer.onwrite = function () {
                  console.log('文件写入成功');
                };
                writer.onerror = function (e) {
                  console.log('文件写入失败', e);
                };
                writer.write(content);
              });
            },
            function (e) {
              console.log('获取文件失败', e);
            },
          );
        },
        function (e) {
          console.log('请求文件系统失败', e);
        },
      );
    },
    readFile(path) {
      plus.io.requestFileSystem(
        plus.io.PRIVATE_DOC,
        function (fs) {
          fs.root.getFile(
            path,
            { create: false },
            function (fileEntry) {
              fileEntry.file(function (file) {
                const reader = new plus.io.FileReader();
                reader.onloadend = function (e) {
                  console.log('文件读取成功', e.target.result);
                };
                reader.onerror = function (e) {
                  console.log('文件读取失败', e);
                };
                reader.readAsText(file);
              });
            },
            function (e) {
              console.log('获取文件失败', e);
            },
          );
        },
        function (e) {
          console.log('请求文件系统失败', e);
        },
      );
    },

    async getSystemInfo() {
      //    uni.getSystemInfo({
      //    	success: (res) => {
      // console.log(res, 'res')
      //    		this.systemInfo = res
      //    	}
      //    })
      uni.showLoading();
      const res = await request.get(
        `/api/common/getInfoByPhoneSn/a8da73764917e978`,
      );
      uni.hideLoading();
      this.infosByPhoneSn = res?.data;
      const storageTenantInfo = uni.getStorageSync('tenant-info');
      const storageAttributionInfo = uni.getStorageSync('attribute-info');
      if (!storageTenantInfo) {
        this.tenantIndex = 0;
        this.tenantInfo = this.infosByPhoneSn?.[0];
      } else {
        this.tenantIndex = this.infosByPhoneSn?.findIndex(
          (one) => one.uid === storageTenantInfo?.uid,
        );
        this.tenantInfo = this.infosByPhoneSn?.[this.tenantIndex];
        this.attributeIndex = this.tenantInfo?.list?.findIndex(
          (one) => (one.attributionId = storageAttributionInfo?.attributionId),
        );
        this.attributeInfo = this.tenantInfo?.list?.[this.attributeIndex];
        console.log(res?.data, this.tenantIndex, this.tenantInfo, 888);
      }

      // #ifdef APP-PLUS
      if (uni.getSystemInfoSync()?.platform === 'android') {
        console.log(plus.device.uuid, 'uuid');
        // Android 平台代码
        this.systemInfo = {
          model: plus.device.uuid,
        };
      }
      if (uni.getSystemInfoSync().platform === 'ios') {
        // this.systemInfo = {
        //   model: '123456789',
        // };
        // testModule.getDeviceIDCallback((ret) => {
        //   uni.showToast({
        //     title: '调用方法 uuid ' + ret,
        //     icon: 'none',
        //   });
        // });
        // iOS 平台代码
        // 注意：iOS 不允许直接获取 IMEI
      }
      // #endif
      this.systemInfo = {
        model: 'a8da73764917e978',
      };
    },

    handleCopy() {
      try {
        const text = this.systemInfo?.model;
        if (text?.length === 0) {
          uni.showModal({
            title: '设置剪贴板失败',
            content: '内容不能为空',
            showCancel: false,
          });
        } else {
          uni.setClipboardData({
            data: text,
            success: () => {
              // 成功处理
              // #ifdef MP-ALIPAY || MP-BAIDU || MP-TOUTIAO
              uni.showToast({
                title: '设置剪贴板成功',
                icon: 'success',
                mask: !1,
                duration: 100,
              });
              // #endif
            },
            fail: () => {
              // 失败处理
              // #ifdef MP-ALIPAY || MP-BAIDU || MP-TOUTIAO
              uni.showToast({
                title: '储存数据失败!',
                icon: 'none',
                mask: !1,
              });
              // #endif
            },
          });
        }
      } catch (err) {
        console.error('复制文本时出错：', err);
      }
    },
    /**
     * 切换租户
     * @params e.target.value 选中的索引
     */
    changeTenant(e) {
      const index = e.detail?.value;
      this.tenantIndex = index;
      this.tenantInfo = this.infosByPhoneSn?.[index];
    },
    /**
     * 切换归属方
     */
    changeAttribute(e) {
      const index = e.detail?.value;
      this.attributeIndex = index;
      this.attributeInfo = this.attributeList?.[index];
    },
  },
  onShow() {
    // this.readFile('data.txt');
    // this.writeFile('data.txt', 'your data');
    this.getSystemInfo();
  },
  watch: {
    tenantInfo(newValue) {
      this.attributeList = this.infosByPhoneSn?.find(
        (one) => one.uid === newValue?.uid,
      )?.list;
      this.attributeIndex = 0;
      this.attributeInfo = this.attributeList?.[0];
    },
    attributeInfo(newValue) {
      // this.setUserInfo({
      //   /** 选中的租户 */
      //   tenantInfo: this.tenantInfo,
      //   /** 选中的归属方 */
      //   attributeInfo: newValue,
      //   phoneSn: this.systemInfo?.model,
      // });
      uni.setStorageSync('tenant-info', this.tenantInfo);
      uni.setStorageSync('attribute-info', newValue);
      uni.setStorageSync('phoneSn', this.systemInfo?.model);
      if (!this.tenantInfo?.uid || !newValue?.attributionId) return;
      uni.showLoading();
      request
        .get(
          `/api/common/loginByPhoneSn/${this.systemInfo?.model}/${this.tenantInfo?.uid}/${newValue?.attributionId}`,
        )
        .then((res) => {
          this.setCusToken(res?.data);
          uni.setStorageSync('cus-token', res?.data);
        });
      uni.hideLoading();
    },
  },
  onHide() {
    uni.hideLoading();
  },
};
</script>

<style lang="scss">
.page {
  padding: 12rpx;
}
.slot-box {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  align-items: center;
  font-size: 28rpx !important;
}

.slot-text {
  flex: 1;
  color: #999;
  margin: 0 16rpx;
}
.slot-left {
  width: 120rpx;
}

.cus-a {
  font-size: 24rpx;
  color: #1677ff;
  cursor: pointer;
}
</style>
