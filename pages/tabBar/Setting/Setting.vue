<template>
  <view class="page">
    <uni-notice-bar
      v-if="!tenantInfo"
      text="请在“设置”页，复制设备码到基石进行用户码授权"
    />
    <!-- <uni-notice-bar text="用户授权码失效，请重新绑定。" />
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
            tenantInfo?.userName
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
            attributeInfo?.name
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
            tenantInfo?.consumeName
          }}</text>
        </template>
      </uni-list-item>
    </uni-list>
  </view>
</template>

<script>
import request from '@/utils/request';
import { mapState, mapMutations } from 'vuex';
import { cloneDeep } from 'lodash';
// #ifdef APP-PLUS
import * as ClientId from '@/uni_modules/sm-did';
// #endif
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
      tenantInfo: null,
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
      /** 模拟平台数据 */
      isMock: false,
    };
  },
  computed: {
    ...mapState(['suerInfo']),
  },
  onLoad() {
    // #ifdef APP-PLUS
    if (uni.getSystemInfoSync()?.platform === 'android') {
      this.register();
    }
    // #endif
  },
  methods: {
    ...mapMutations(['setUserInfo', 'setCusToken']),
    register() {
      ClientId.register({});
    },
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
      if (this.isMock) {
        let uuid = '';
        if (uni.getSystemInfoSync()?.platform === 'android') {
          uuid = '6f09fd892317210ca50856d84ec7b820';
        }
        if (uni.getSystemInfoSync().platform === 'ios') {
          uuid = 'D71073FB48F84F32B7E68D73BC7936C0';
        }
        this.systemInfo = {
          model: uuid,
        };
      }
      // #ifdef APP-PLUS
      if (uni.getSystemInfoSync()?.platform === 'android') {
        // Android 平台代码
        if (!this.isMock) {
          const uuid = ClientId.getClientId();
          this.systemInfo = {
            model: uuid,
          };
        }
      }
      if (uni.getSystemInfoSync().platform === 'ios') {
        if (!this.isMock) {
          var testModule = uni.requireNativePlugin('Univalsoft-DeviceId');
          testModule.getDeviceIDCallback((ret) => {
            this.systemInfo = {
              model: ret,
            };
          });
        }
        // iOS 平台代码
        // 注意：iOS 不允许直接获取 IMEI
      }
      // #endif
      uni.setStorageSync('phoneSn', this.systemInfo?.model);
      uni.showLoading();
      const res = await request.get(
        `/api/common/getInfoByPhoneSn/${this.systemInfo.model}`,
      );
      uni.hideLoading();
      this.infosByPhoneSn = res?.data;
      const storageTenantInfo = uni.getStorageSync('tenant-info');
      if (!storageTenantInfo) {
        /** 如果没有缓存，直接取第一个 */
        this.tenantIndex = 0;
        this.tenantInfo = res?.data?.[0];
      } else {
        /**
         * 判断缓存是否在租户列表里
         */
        if (res?.data?.find((one) => one.uid === storageTenantInfo?.uid)) {
          const tenantIndex = res?.data?.findIndex(
            (one) => one.uid === storageTenantInfo?.uid,
          );
          const tenantInfo = cloneDeep(res?.data?.[tenantIndex]);
          this.tenantIndex = tenantIndex;
          this.tenantInfo = tenantInfo;
        } else {
          this.tenantIndex = 0;
          this.tenantInfo = res?.data?.[0];
        }
      }
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
    this.getSystemInfo();
  },
  watch: {
    tenantInfo(newValue, pre) {
      console.log(newValue, 'newvalue');
      this.attributeList = newValue?.list;
      /** 如果租户变了，清空归属方缓存 */
      if (newValue?.uid === pre?.uid) {
        const storageAttributionInfo = uni.getStorageSync('attribute-info');
        /** 如果租户相同，但是归属方不在归属方列表，需要清空缓存 */
        if (
          !newValue?.list?.find(
            (one) =>
              one.attributionId === storageAttributionInfo?.attributionId,
          )
        ) {
          uni.setStorageSync('attribute-info', null);
        }
      } else {
        uni.setStorageSync('attribute-info', null);
      }
      uni.setStorageSync('tenant-info', newValue);
    },
    attributeList(newValue) {
      const storageAttributionInfo = uni.getStorageSync('attribute-info');
      const tempIndex = newValue?.findIndex(
        (one) => one.attributionId === storageAttributionInfo?.attributionId,
      );
      this.attributeIndex = tempIndex >= 0 ? tempIndex : 0;
      this.attributeInfo = newValue?.[this.attributeIndex];
    },
    attributeInfo(newValue) {
      uni.setStorageSync('attribute-info', newValue);
      if (!this.tenantInfo?.uid || !newValue?.attributionId) {
        uni.setStorageSync('cus-token', '');
        return;
      }
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
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
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
