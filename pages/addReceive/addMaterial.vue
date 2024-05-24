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
        v-model="weighType"
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
              v-model="totalWeight"
              type="number"
              placeholder="请输入"
              @input="(e) => changeInput(e, item.id, 'length')"
            />
            <text>千克</text>
          </view>
          <view class="g-a">扫码获取</view>
        </view>
      </view>
    </view>
    <view class="items-container">
      <view v-for="item in choosedMaterialList" class="item">
        <view class="g-flex-aic-jcsb item-header">
          <text class="item-sepc">规格型号</text>
          <text class="g-a" @click="() => handleRemove(item.id)">移除</text>
        </view>
        <text>送货单数量</text>
        <u-cus-gap size="16" />
        <view v-if="rebarType === '1'">
          <view class="item-content-row">
            <view class="item-content-row-title">单根长度(米)：</view>
            <view class="g-flex">
              <uni-tag
                @click="() => handleLengthTag(text, item.id)"
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
                @input="(e) => changeInput(e, item.id, 'length')"
              />
            </view>
          </view>
          <view class="item-content-row">
            <view class="item-content-row-title">送货单根数：</view>
            <view class="other-input">
              <uni-easyinput
                errorMessage
                v-model="item.amount"
                type="number"
                placeholder="请输入"
                @input="(e) => changeInput(e, item.id, 'amount')"
              />
            </view>
            <text>根</text>
          </view>
          <view v-show="weighType === 1" class="item-content-row">
            <view class="item-content-row-title">实点根数：</view>
            <view class="other-input">
              <uni-easyinput
                errorMessage
                v-model="item.actualAmount"
                type="number"
                placeholder="请输入"
                @input="(e) => changeInput(e, item.id, 'actualAmount')"
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
              v-model="item.weight"
              type="number"
              placeholder="请输入"
              @input="(e) => changeInput(e, item.id, 'weight')"
            />
          </view>
          <text>千克</text>
        </view>
      </view>
    </view>
    <uni-row>
      <uni-col :span="choosedMaterialList.length ? 7 : 24"
        ><button type="warn" @click="handleCancel">取消</button></uni-col
      >
      <uni-col v-show="choosedMaterialList.length" :span="16" :offset="1"
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
import ChooseCategory from './chooseCategory.vue';
import { v4 as uuidv4 } from 'uuid';
export default {
  components: {
    CusTip,
    ChooseCategory,
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
          value: 0,
        },
        {
          text: '称重 + 实点根数验收',
          value: 1,
        },
      ],
      /**
       * 选中的称重类型
       */
      weighType: 1,
      /**
       * 混装实重总重量
       */
      totalWeight: '',
      /**
       * 弹窗显示状态
       */
      visible: false,
      /**
       * 钢筋规格型号
       */
      choosedMaterialList: [
        {
          id: uuidv4(),
          /**
           * 单根长度
           */
          length: '',
          /**
           * 送货单根数
           */
          amount: '',
          /**
           * 实点根数
           */
          actualAmount: '',
          /**
           * 送货单重量
           */
          weight: '',
        },
        {
          id: uuidv4(),
          /**
           * 单根长度
           */
          length: '',
          /**
           * 送货单根数
           */
          amount: '',
          /**
           * 实点根数
           */
          actualAmount: '',
          /**
           * 送货单重量
           */
          weight: '',
        },
        {
          id: uuidv4(),
          /**
           * 单根长度
           */
          length: '',
          /**
           * 送货单根数
           */
          amount: '',
          /**
           * 实点根数
           */
          actualAmount: '',
          /**
           * 送货单重量
           */
          weight: '',
        },
        {
          id: uuidv4(),
          /**
           * 单根长度
           */
          length: '',
          /**
           * 送货单根数
           */
          amount: '',
          /**
           * 实点根数
           */
          actualAmount: '',
          /**
           * 送货单重量
           */
          weight: '',
        },
      ],
      /**
       * 长度数组
       */
      lenArr: ['6', '9', '13'],
    };
  },
  methods: {
    /**
     * 选中称重类型
     */
    handleChangeWeighType(e) {
      this.weighType = Number(e.detail.value);
    },
    /**
     * 选择钢筋规格型号回调
     */
    handleCategoryConfirm(value) {
      console.log(value, 888);
      value?.forEach((one) => {
        let arr = Array.from({ length: one.count }, (_, index) => index);
        arr.forEach(() => {
          this.choosedMaterialList.unshift({
            ...one,
            id: uuidv4(),
          });
        });
      });
      this.visible = false;
    },
    /**
     * 移除某个钢筋规格型号
     */
    handleRemove(id) {
      this.choosedMaterialList = this.choosedMaterialList?.filter(
        (one) => one.id !== id,
      );
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
    handleLengthTag(text, id) {
      console.log(text, id);
      this.choosedMaterialList = this.choosedMaterialList?.map((one) => {
        return {
          ...one,
          length: one?.id === id ? text : one.length,
        };
      });
    },
    /**
     * 输入框变化
     */
    changeInput(e, id, type) {
      console.log(e, id, type);
      this.choosedMaterialList = this.choosedMaterialList?.map((one) => {
        return {
          ...one,
          [type]: one?.id === id ? e : one[type],
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
     * 校验复核
     */
    handleCheck() {
      uni.navigateTo({
        url:
          this.rebarType === '1'
            ? '/pages/addReceive/checkFirst'
            : '/pages/addReceive/checkTrayRebar',
      });
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
