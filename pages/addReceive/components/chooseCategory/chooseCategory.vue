<template>
  <view>
    <!-- 普通弹窗 -->
    <uni-popup
      ref="popup"
      background-color="#fff"
      @change="changePopup"
      type="bottom"
    >
      <view class="popup">
        <uni-row class="popup-header">
          <uni-col :span="23">
            <view class="popup-title">请选择钢筋规格型号</view>
          </uni-col>
          <uni-col :span="1">
            <uni-icons type="closeempty" @click="clsoePopup" />
          </uni-col>
        </uni-row>
        <view class="popup-content">
          <view class="categroy-content">
            <uni-row
              class="item"
              v-for="item in materialList"
              :key="item.materialId"
            >
              <uni-col :span="18">
                <view class="name"
                  >{{ item.materialName }}/{{ item.materialSpec }}</view
                >
              </uni-col>
              <uni-col :span="6">
                <view class="counter">
                  <button
                    :disabled="item.count < 1"
                    class="btn btn-left"
                    @click="() => decrease(item)"
                  >
                    -
                  </button>
                  <input
                    class="input"
                    type="number"
                    :value="item.count"
                    @input="(e) => updateCount(e, item)"
                    :min="0"
                  />
                  <button class="btn btn-right" @click="() => increase(item)">
                    +
                  </button>
                  <!-- <uni-number-box :min="0" :value="item.count" /> -->
                </view>
              </uni-col>
            </uni-row>
          </view>
        </view>
        <button class="confirm" type="primary" @click="handleConfirm">
          确定
        </button>
      </view>
    </uni-popup>
  </view>
</template>
<script>
import { materialList } from '../../../../common/constants';

export default {
  props: ['visible'],
  data() {
    return {
      /**
       * 钢筋规格型号
       */
      materialList,
    };
  },
  methods: {
    /**
     * 关闭钢筋弹窗
     */
    clsoePopup() {
      this.$emit('cancel');
    },
    destroyPopup() {
      /**
       * 销毁弹窗
       */
    },
    /**
     * 弹窗状态改变
     * @param e
     * @param e.show 弹窗是否显示
     * @param e.type 弹窗弹出类型
     */
    changePopup(e) {
      if (e.show === false) {
        /**
         * 清除数据
         */
        this.clsoePopup();
      }
    },
    decrease(item) {
      this.materialList.forEach((one) => {
        if (one.materialId === item.materialId) {
          one.count--;
        }
      });
    },
    increase(item) {
      this.materialList.forEach((one) => {
        if (one.materialId === item.materialId) {
          one.count++;
        }
      });
    },
    updateCount(e, item) {
      console.log(e, 'ee');
      this.materialList.forEach((one) => {
        if (one.materialId === item.materialId) {
          one.count = Number(e.detail.value);
        }
      });
    },
    handleConfirm() {
      this.$emit('confirm', this.materialList);
    },
    /**
     * 获取钢筋列表数据
     */
    async getMaterialList() {},
  },

  watch: {
    visible() {
      if (this.visible) {
        this.$refs.popup.open();
        this.getMaterialList();
      } else {
        this.$refs.popup.close();
        this.materialList?.forEach((one) => {
          one.count = 0;
        });
      }
    },
  },
  mounted() {},
};
</script>
<style>
.add-material-page {
  padding: 24rpx;
}

.text {
  background-color: #fff;
  padding: 24rpx;
  margin-bottom: 24rpx;
}

.popup {
  height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.popup-header {
  padding: 24rpx;
}

.popup-content {
  padding: 0 24rpx;
  background-color: #fff;
  width: calc(100vw - 48rpx);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  overflow: auto;
}

.popup-title {
  text-align: center;
  font-size: 30rpx;
}

.categroy-content {
  flex: 1;
}

.item {
  margin: 24rpx;
}

.counter {
  display: flex;
  align-items: center;
}

.btn {
  width: 50rpx;
  height: 52rpx;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: -6rpx;
}

.btn-left:after {
  border-right: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.btn-right:after {
  border-left: none;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.input {
  height: 48rpx;
  width: 80rpx;
  text-align: center;
  margin: 0;
  border: 1rpx solid rgba(0, 0, 0, 0.2);
  z-index: 1;
  color: #666;
  font-size: 26rpx;
}

.confirm {
  width: 90%;
  margin: 24rpx 5%;
}

.name {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  /* 定义文本的最大行数为2 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  /* 使用省略号表示被裁剪的文本 */
  margin-right: 24rpx;
}
</style>
