<template>
  <view class="add-material-page">
    <view>
      <view class="text">请根据送货单添加待验收钢筋规格 </view>
      <button v-if="rebarType === '1'" type="primary" @click="visible = true">
        添加直螺纹钢筋
      </button>
      <button v-if="rebarType === '2'" type="primary" @click="visible = true">
        添加盘螺纹钢筋
      </button>
      <u-cus-gap size="16" />
      <uni-data-checkbox
        v-if="rebarType === '1'"
        v-model="checkType"
        :localdata="weighTypeList"
        @change="handleChangeWeighType"
      ></uni-data-checkbox>
      <u-cus-gap size="12" />
      <view class="uni-panel">
        <view class="uni-panel-h g-flex-aic-jcsb">
          <view class="g-flex-aic">
            <view><text v-show="rebarType === '1'">混装</text>实称总重量</view>
            <uni-easyinput
              class="total-input"
              errorMessage
              v-model="actualWeight"
              type="number"
              placeholder="请输入"
              @input="(e) => changeTotalWeight(e)"
            />
            <text>千克</text>
          </view>
          <view class="g-a" @click="handleScan">扫码获取</view>
        </view>
      </view>
    </view>
    <view class="items-container">
      <view v-for="item in list" class="item">
        <view class="g-flex-aic-jcsb item-header">
          <text class="item-sepc"
            >{{ item.materialName }}/{{ item.materialSpec }}</text
          >
          <text class="g-a" @click="() => handleRemove(item.cusId)">移除</text>
        </view>
        <text>送货单数量</text>
        <u-cus-gap size="16" />
        <view v-if="rebarType === '1'">
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
            <text>根</text>
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
            <text>根</text>
          </view>
        </view>
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
          <text>千克</text>
        </view>
      </view>
    </view>
    <uni-row>
      <uni-col :span="list.length ? 7 : 24"
        ><button type="warn" @click="handleCancel">取消</button></uni-col
      >
      <uni-col v-show="list.length" :span="16" :offset="1"
        ><button type="primary" @click="handleCheck" hover-class="is-hover">
          校验复核
        </button></uni-col
      >
    </uni-row>
    <choose-category
      :visible="visible"
      @confirm="handleCategoryConfirm"
      @cancel="visible = false"
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
      rebarType: '1',
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
       * 是否手动输入
       */
      isHandle: false,
      /**
       * 弹窗显示状态
       */
      visible: false,
      /**
       * 钢筋规格型号
       */
      list: [
        // {
        //   cusId: uuidv4(),
        //   /**
        //    * 单根长度
        //    */
        //   length: '',
        //   /**
        //    * 送货单根数
        //    */
        //   sendAmount: '',
        //   /**
        //    * 实点根数
        //    */
        //   actualAmount: '',
        //   /**
        //    * 送货单重量
        //    */
        //   sendWeight: '',
        //   /** 送货重量单位 */
        //   sendWeightUnit: '千克',
        //   /** 确认根数 */
        //   confirmAmount: '',
        //   /** 确认重量 */
        //   confirmWeight: '',
        // },
      ],
      /**
       * 长度数组
       */
      lenArr: ['6', '9', '13'],
      /** 收料 id */
      id: '',
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
      this.isHandle = true;
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
      console.log(text, cusId);
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
        attributionCode: 1088,
        // assembleUrl: 'http://weighmaster.pinming.cn/material-client-management/api/receiptRecycle/assemble',
        assembleUrl:
          'https://zz-test05.pinming.org/material-client-management/api/receiptRecycle/assemble',
        warning4Url: getWarning4Url(),
      };
      let paramsStr = '';
      Object.keys(params).forEach((key, index) => {
        if (!index) {
          /* 预发环境 */
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
      const res = await request.post('/api/rebarCheck/add', {
        attributionId: attributeInfo?.attributionId,
        phoneSn: phoneSn,
        checkType: this.checkType,
        /** 实称总重 */
        actualWeight: this.actualWeight,
        /** 单位 */
        weightUnit: '千克',
        /** 收料钢筋 */
        list: this.list,
      });
      this.id = res?.data;
      this.rebarCheckFirst();
    },

    async rebarCheckFirst() {
      if (!this.id) return;
      const res = await request.get(`/api/rebarCheck/first/${this.id}`);
      uni.navigateTo({
        url:
          this.rebarType === '1'
            ? `/pages/addReceive/checkFirst?id=${this.id}`
            : `/pages/addReceive/checkTrayRebar?id=${this.id}`,
      });
    },
    /**
     * 校验复核
     */
    handleCheck() {
      this.addRebar();
    },
  },
  watch: {
    scanData(newValue) {
      console.log(newValue, 'newValue');
    },
  },

  onLoad(options) {
    this.rebarType = options.rebarType;
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
}

.item-content-row-title {
  // width: 220rpx
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
.is-hover {
  color: rgba(255, 255, 255, 0.6);
  background-color: #179b16;
  border-color: #179b16;
}
button {
  font-size: 32rpx;
}
</style>
