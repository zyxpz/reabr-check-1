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
            <uni-icons type="closeempty" @click="closePopup" />
          </uni-col>
        </uni-row>
        <view class="search-container">
          <uni-easyinput
            v-model="searchValue"
            placeholder="请输入材料名称或规格型号进行搜索"
          >
            <template #right>
              <uni-icons
                type="search"
                size="24"
                class="search-icon"
                @click="handleSearch"
              ></uni-icons></template
          ></uni-easyinput>
        </view>
        <view class="popup-content">
          <view class="categroy-content">
            <virtual-list
              :allList="showMaterialList"
              :containerHeight="600"
              ref="virtualListRef"
            >
              <template v-slot:default="{ item }">
                <uni-row class="item">
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
                      <button
                        class="btn btn-right"
                        @click="() => increase(item)"
                      >
                        +
                      </button>
                      <!-- <uni-number-box :min="0" :value="item.count" /> -->
                    </view>
                  </uni-col>
                </uni-row>
              </template>
            </virtual-list>
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
// import { materialList } from '../../../../common/constants';
import request from '@/utils/request';
import VirtualList from '../../../../components/virtualList/virtualList.vue';
export default {
  props: ['visible', 'rebarType'],
  components: {
    VirtualList,
  },
  data() {
    return {
      /**
       * 钢筋规格型号
       */
      materialList: [],
      searchValue: '',
    };
  },
  methods: {
    /**
     * 关闭钢筋弹窗
     */
    closePopup() {
      this.$refs.popup.close();
      this.searchValue = '';
      this.materialList = [];
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
        if (one.id === item.id) {
          one.count--;
        }
      });
    },
    increase(item) {
      this.materialList.forEach((one) => {
        if (one.id === item.id) {
          one.count++;
        }
      });
    },
    updateCount(e, item) {
      this.materialList.forEach((one) => {
        if (one.id === item.id) {
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
    async getMaterialList() {
      uni.showLoading();
      const res = await request.get(`/api/rebarCheck/rebarMaterialList`, {
        type: this.rebarType,
      });
      uni.hideLoading();

      this.materialList = res?.data?.map((one) => ({
        ...one,
        count: 0,
        show: true,
      }));
    },
    handleSearch() {
      this.materialList = this.materialList.map((one) => ({
        ...one,
        show:
          one.materialName?.includes(this.searchValue) ||
          one?.materialSpec?.includes(this.searchValue),
      }));
      this.$refs.virtualListRef?.handleScroll({ detail: { scrollTop: 0 } });
    },
  },

  watch: {
    visible() {
      if (this.visible) {
        this.$refs.popup.open();
        this.getMaterialList();
      } else {
        this.$refs.popup.close();
        this.searchValue = '';
        this.materialList = [];
      }
    },
  },
  computed: {
    showMaterialList() {
      return this.materialList?.filter((one) => one?.show);
    },
  },
  mounted() {},
};
</script>
<style lang="less">
.add-material-page {
  padding: 24rpx;
}
.search-container {
  padding: 0 24rpx 8rpx 24rpx;
  position: relative;
}
.search-icon {
  color: rgb(192, 196, 204) !important;
  margin: 0 16rpx 4rpx 0;
}
.custom-esayinput {
  .uni-easyinput__content-input {
    padding-right: 40rpx !important;
  }
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
  // overflow: auto;
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
  border: solid 1rpx #efefef;
  border-radius: 4px;
}

.btn {
  width: 50rpx;
  height: 52rpx;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  border: none;
}
.btn-left::after {
  border: none;
}
.btn-left {
  border: none;
  border-radius: 0;
  border-bottom-left-radius: 4px;
  border-top-left-radius: 4px;
  border-right: solid 1px #efefef;
}
.btn-right::after {
  border: none;
}
.btn-right {
  border: none;
  border-radius: 0;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  border-left: solid 1px #efefef;
}

.input {
  text-align: center;
  margin: 0;
  border: 1rpx solid rgba(0, 0, 0, 0.2);
  z-index: 1;
  color: #666;
  font-size: 26rpx;
  flex: 1;
  border: none;
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
