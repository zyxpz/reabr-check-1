<template>
  <view class="add-material-page">
    <view>
      <view class="text">请根据送货单添加待验收钢筋规格 </view>
      <button
        v-if="rebarType === 1"
        type="primary"
        :disabled="visible"
        @click="visible = true"
      >
        添加直螺纹钢筋
      </button>
      <button v-if="rebarType === 2" type="primary" @click="visible = true">
        添加盘螺纹钢筋
      </button>
      <u-cus-gap size="16" />
      <uni-data-checkbox
        v-if="rebarType === 1"
        v-model="checkType"
        :localdata="weighTypeList"
        @change="handleChangeWeighType"
      ></uni-data-checkbox>
      <u-cus-gap size="12" />
      <view class="uni-panel">
        <view class="uni-panel-h g-flex-aic-jcsb">
          <view class="g-flex-aic">
            <view><text v-show="rebarType === 1">混装</text>实称总重量</view>
            <uni-easyinput
              class="total-input"
              errorMessage
              v-model="actualWeight"
              type="number"
              placeholder="请输入"
              :min="0"
              @input="(e) => changeTotalWeight(e)"
              :disabled="!inputEnable"
            />
            <view>千克</view>
          </view>
          <view class="g-a" @click="handleScan">扫码获取</view>
        </view>
      </view>
    </view>
    <view class="items-container">
      <view v-for="item in list" class="item">
        <view class="g-flex-aic-jcsb item-header">
          <view class="item-sepc"
            >{{ item.materialName }}/{{ item.materialSpec }}</view
          >
          <view class="g-a item-del" @click="() => handleRemove(item.cusId)"
            >移除</view
          >
        </view>
        <text>送货单数量</text>
        <u-cus-gap size="16" />
        <view v-if="rebarType === 1">
          <view class="item-content-row">
            <view class="item-content-row-title">单根长度(米)：</view>
            <view class="g-flex">
              <uni-tag
                @click="() => handleLengthTag(text, item.cusId)"
                v-for="text in lenArr"
                :text="text"
                :key="text"
                custom-style="background-color: rgb(240 240 240 / 74%);border: solid 1px #eee;color: #000; margin-right: 16rpx;padding: 12rpx 28rpx; font-size: 26rpx "
              />
            </view>
            <view class="length-input">
              <uni-easyinput
                errorMessage
                v-model="item.length"
                type="number"
                placeholder="请输入"
                @input="(e) => changeInput(e, item.cusId, 'length')"
              />
            </view>
          </view>
          <view class="item-content-row">
            <view class="item-content-row-title">送货单根数：</view>
            <view class="other-input">
              <uni-easyinput
                errorMessage
                v-model="item.sendAmount"
                type="number"
                placeholder="请输入"
                @input="(e) => changeInput(e, item.cusId, 'sendAmount')"
              />
            </view>
            <view>根</view>
          </view>
          <view v-show="checkType === 2" class="item-content-row">
            <view class="item-content-row-title">实点根数：</view>
            <view class="other-input">
              <uni-easyinput
                errorMessage
                v-model="item.actualAmount"
                type="number"
                placeholder="请输入"
                @input="(e) => changeInput(e, item.cusId, 'actualAmount')"
              />
            </view>
            <view>根</view>
          </view>
        </view>
        <view>
          <view class="item-content-row">
            <view class="item-content-row-title">送货重量：</view>
            <view class="other-input">
              <uni-easyinput
                errorMessage
                v-model="item.sendWeight"
                type="number"
                placeholder="请输入"
                @input="(e) => changeInput(e, item.cusId, 'sendWeight')"
              />
            </view>
            <view>千克</view>
          </view>
        </view>
      </view>
    </view>
    <uni-row>
      <uni-col :span="list.length ? 7 : 24"
        ><button type="warn" @click="handleCancel">取消</button></uni-col
      >
      <uni-col v-show="list.length" :span="16" :offset="1"
        ><button type="primary" :loading="checkLoading" @click="handleCheck">
          校验复核
        </button></uni-col
      >
    </uni-row>
    <choose-category
      :visible="visible"
      @confirm="handleCategoryConfirm"
      @cancel="visible = false"
      :rebarType="rebarType"
    />
  </view>
</template>

<script>
import CusTip from '@/components/cus-tip';
import ChooseCategory from './components/chooseCategory/chooseCategory.vue';
import { getWarning4Url } from '@/utils/index.ts';
import { v4 as uuidv4 } from 'uuid';
import request from '@/utils/request.js';
import { mapState } from 'vuex';

export default {
  components: {
    CusTip,
    ChooseCategory,
  },
  computed: {
    ...mapState(['scanData', 'userInfo']),
  },
  data() {
    return {
      /**
       * 钢筋类型 1：直螺纹钢筋 2：盘螺纹钢筋
       */
      rebarType: 1,
      /**
       * 称重类型
       */
      weighTypeList: [
        {
          text: '仅称重验收',
          value: 1,
        },
        {
          text: '称重 + 实点根数验收',
          value: 2,
        },
      ],
      weightUnit: '千克',
      /**
       * 验收类型 1 仅称重验收, 2 称重+实点根数验收
       */
      checkType: 1,
      /**
       * 混装实重总重量
       */
      actualWeight: '',
      /**
       * 是否允许手动输入
       */
      inputEnable: true,
      /**
       * 是否手动输入
       */
      isInput: 2,
      /**
       * 弹窗显示状态
       */
      visible: false,
      /**
       * 钢筋规格型号
       */
      list: [],
      checkLoading: false,
      /**
       * 长度数组
       */
      lenArr: ['6', '9', '13'],
      /** 收料 id */
      id: '',
      detail: {},
    };
  },
  methods: {
    /**
     * 选中称重类型
     */
    handleChangeWeighType(e) {
      this.checkType = Number(e.detail.value);
    },
    /**
     * 更改总重
     */
    changeTotalWeight(e) {
      this.actualWeight = e;
      this.isInput = 1;
    },
    /**
     * 选择钢筋规格型号回调
     */
    handleCategoryConfirm(value) {
      value?.forEach((one) => {
        let arr = Array.from({ length: one.count }, (_, index) => index);
        arr.forEach(() => {
          this.list.unshift({
            ...one,
            cusId: uuidv4(),
            sendWeightUnit: '千克',
          });
        });
      });
      this.visible = false;
    },
    /**
     * 移除某个钢筋规格型号
     */
    handleRemove(cusId) {
      this.list = this.list?.filter((one) => one.cusId !== cusId);
    },
    /**
     * 选择总单位
     */
    changeUnit(e) {
      console.log(e, 999);
    },
    /**
     * 点击长度 tag
     */
    handleLengthTag(text, cusId) {
      this.list = this.list?.map((one) => {
        return {
          ...one,
          length: one?.cusId === cusId ? text : one.length,
        };
      });
    },
    /**
     * 输入框变化
     */
    changeInput(e, cusId, type) {
      console.log(e, cusId, type);
      this.list = this.list?.map((one) => {
        return {
          ...one,
          [type]: one?.cusId === cusId ? e : one[type],
        };
      });
    },
    /**
     * 取消 返回到新增收料
     */
    handleCancel() {
      uni.switchTab({
        url: '/pages/tabBar/AddReceive/AddReceive',
      });
    },
    /**
     * 扫码获取
     * @param options
     */
    handleScan() {
      const params = {
        attributionCode: uni.getStorageSync('attribute-info')?.code,
        // assembleUrl: 'http://weighmaster.pinming.cn/material-client-management/api/receiptRecycle/assemble',
        assembleUrl:
          'https://zz-test05.pinming.org/material-client-management/api/common/check/assemble',
        warning4Url: getWarning4Url(),
        appKey: uni.getStorageSync('tenant-info')?.appKey,
        appSecretKey: uni.getStorageSync('tenant-info')?.appSecretKey,
      };
      let paramsStr = '';
      Object.keys(params).forEach((key, index) => {
        if (!index) {
          /* 第一个参数 */
          paramsStr = `?${key}=${params[key]}`;
        } else {
          paramsStr = `${paramsStr}&${key}=${params[key]}`;
        }
      });
      uni.navigateTo({
        url: `/pages/sdkView/sdkView${paramsStr}`,
      });
    },
    /**
     * 新增收料
     */
    async addRebar() {
      const attributeInfo = uni.getStorageSync('attribute-info');
      const phoneSn = uni.getStorageSync('phoneSn');
      if (!this.actualWeight || this.actualWeight <= 0) {
        uni.showToast({
          title: '请检查实称总重量须大于 0',
          icon: 'none',
        });
        return;
      }
      /**
       * 材料校验
       */
      /** 实称+实点 */
      let validErr = false;
      if (this.checkType === 2 && this.rebarType === 1) {
        validErr = this.list?.find(
          (one) =>
            !one.length ||
            one.length <= 0 ||
            !one.sendAmount ||
            one.sendAmount <= 0 ||
            !one?.actualAmount ||
            one?.actualAmount <= 0 ||
            !one?.sendWeight ||
            one?.sendWeight <= 0,
        );
      }
      /** 直螺 */
      if (this.checkType === 1 && this.rebarType === 1) {
        validErr = this.list?.find(
          (one) =>
            !one.length ||
            one.length <= 0 ||
            !one.sendAmount ||
            one.sendAmount <= 0 ||
            !one?.sendWeight ||
            one?.sendWeight <= 0,
        );
      }
      /**
       * 盘螺
       */
      if (this.rebarType === 2) {
        validErr = this.list?.find(
          (one) => !one?.sendWeight || one?.sendWeight <= 0,
        );
      }
      if (validErr) {
        uni.showToast({
          title: '请检查材料送货数据必填且需大于0！',
          icon: 'none',
        });
        return;
      }
      let repeatErr = false;
      if (this.rebarType === 1) {
        repeatErr = this.list.find((one, index) => {
          const id = one?.materialId ?? one?.id;
          return this.list?.find((dl, i) => {
            const dlId = dl?.materialId ?? dl?.id;
            return (
              dlId + '' + dl?.length === id + '' + one?.length && index !== i
            );
          });
        });
      }
      if (this.rebarType === 2) {
        repeatErr = this.list.find((one, index) => {
          const id = one?.materialId ?? one?.id;
          return this.list?.find((dl, i) => {
            const dlId = dl?.materialId ?? dl?.id;
            return dlId == id && index !== i;
          });
        });
      }
      if (repeatErr) {
        uni.showToast({
          title: `存在相同规格${
            this.rebarType === 1 ? '(单根长度)' : ''
          } 的钢筋，请检查！`,
          icon: 'none',
        });
        return;
      }
      const params = {
        attributionId: attributeInfo?.attributionId,
        phoneSn: phoneSn,
        checkType: this.rebarType === 1 ? this.checkType : undefined,
        /** 实称总重 */
        actualWeight: this.actualWeight,
        /** 单位 */
        weightUnit: '千克',
        /** 收料钢筋 */
        list: this.list?.map((one) => {
          const { count, cusId, extCode, id, materialId, ...rest } = one;
          return {
            ...rest,
            materialId: materialId ?? id,
          };
        }),
        /**
         * 是否手动输入 1 是 2 否
         */
        isInput: this.isInput,
        id: this.id,
      };
      const requestFun = this.id
        ? request.post('/api/rebarCheck/complexUpdate', params)
        : request.post('/api/rebarCheck/add', params);
      this.checkLoading = true;
      try {
        const res = await requestFun;
        this.checkLoading = false;
        if (!this.id) {
          this.id = res?.data;
        }
        if (this.rebarType === 1) {
          this.rebarCheckFirst();
        } else {
          uni.redirectTo({
            url: `/pages/addReceive/checkTrayRebar?id=${this.id}`,
          });
        }
      } catch (error) {
        this.checkLoading = false;
      }
    },

    async rebarCheckFirst() {
      if (!this.id) return;
      const res = await request.get(`/api/rebarCheck/first/${this.id}`);
      uni.redirectTo({
        url: `/pages/addReceive/checkFirst?id=${this.id}`,
      });
    },
    /**
     * 校验复核
     */
    handleCheck() {
      this.addRebar();
    },
    async getDetail(newValue) {
      if (!newValue) return;
      uni.showLoading();
      const res = await request.get(`/api/rebarCheck/checkDetail/${newValue}`);
      uni.hideLoading();
      this.detail = res?.data;
      console.log(this.detail, 'this.detail');
    },
    async inputEnableFun() {
      const res = await request.get(
        `/api/app/extShow/inputEnable/${
          uni.getStorageSync('tenant-info')?.uid
        }`,
      );
      this.inputEnable = res?.data?.isInputEnable === 1 ? true : false;
      console.log(res, 'res');
    },
  },
  watch: {
    scanData(newValue) {
      this.isInput = 2;
      const { GrossWeighValue, ValueUnit, TareWeighValue } = newValue ?? {};
      const diff = GrossWeighValue - TareWeighValue;
      this.actualWeight =
        Math.floor(
          (ValueUnit === '千克' ? diff : diff * 1000)?.toFixed(2) * 100,
        ) / 100;
      console.log(newValue, 'newValue');
    },
    id(newValue) {
      this.getDetail(newValue);
    },
    detail(newValue) {
      if (newValue?.checkReverseVO) {
        this.list = newValue?.checkConfirmVO?.list?.map((one) => ({
          ...one,
          cusId: uuidv4(),
        }));
        this.actualWeight =
          newValue?.checkReverseVO?.totalCheckVO?.actualWeight;
        this.isInput = newValue?.checkReverseVO?.totalCheckVO?.isInput;
        this.checkType = newValue?.checkReverseVO?.totalCheckVO?.checkType;
      }
    },
  },

  onLoad(options) {
    this.rebarType = Number(options.rebarType);
    this.id = options.id;
  },
  onShow() {
    this.inputEnableFun();
  },
};
</script>

<style lang="scss">
.add-material-page {
  padding: 16rpx 12rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100vh - 32rpx);
}

.text {
  background-color: #fff;
  padding: 24rpx;
  margin-bottom: 24rpx;
  font-size: 30rpx;
}

.input {
  width: 130rpx;
  border: solid 1px #ccc;
  margin: 0 20rpx;
}

.item {
  padding: 16rpx;
  margin: 16rpx 0;
  background-color: #fff;
}

.item-header {
  margin-bottom: 16rpx;
}

.item-content {
  font-size: 26rpx;
  color: #333;
}

.item-content-row {
  font-size: 26rpx;
  color: #333;
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}
.item-sepc {
  font-size: 28rpx;
  word-break: break-all;
  flex: 1;
}

.item-del {
  flex-shrink: 0;
  word-break: break-all;
  width: 80rpx;
  text-align: right;
}

.item-content-row-title {
  // width: 220rpx
  flex-shrink: 0;
}

.total-input {
  width: 200rpx !important;
  margin: 0 12rpx;
}

.uni-easyinput__content-input {
  font-size: 28rpx !important;
}

.length-input {
  width: 180rpx;
}

.other-input {
  width: 230rpx;
  margin-right: 16rpx;
}

.cancel-btn {
  margin-right: 24rpx;
}
.items-container {
  flex: 1;
  overflow: auto;
}

button {
  font-size: 32rpx;
}
</style>
