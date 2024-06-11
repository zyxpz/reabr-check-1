<template>
  <view class="so-mask">
    <view class="main-plate animation-scale-up">
      <view class="main-plate-head">
        <view class="main-plate-type">
          <radio-group @change="Changetype">
            <label>
              <radio value="1" :checked="type === 1" />
              普通车牌
            </label>
            <label>
              <radio value="2" :checked="type === 2" />
              新能源车牌
            </label>
          </radio-group>
        </view>
      </view>
      <view class="main-plate-body">
        <view
          class="main-plate-word"
          :class="{ active: currenttIndex == 0 }"
          @tap="inputSwitch"
          data-index="0"
        >
          <text>{{ currentInputValue[0] }}</text>
        </view>
        <view
          class="main-plate-word"
          :class="{ active: currenttIndex == 1 }"
          @tap="inputSwitch"
          data-index="1"
        >
          <text>{{ currentInputValue[1] }}</text>
        </view>
        <view class="main-plate-dot"></view>
        <view
          class="main-plate-word"
          :class="{ active: currenttIndex == 2 }"
          @tap="inputSwitch"
          data-index="2"
        >
          <text>{{ currentInputValue[2] }}</text>
        </view>
        <view
          class="main-plate-word"
          :class="{ active: currenttIndex == 3 }"
          @tap="inputSwitch"
          data-index="3"
        >
          <text>{{ currentInputValue[3] }}</text>
        </view>
        <view
          class="main-plate-word"
          :class="{ active: currenttIndex == 4 }"
          @tap="inputSwitch"
          data-index="4"
        >
          <text>{{ currentInputValue[4] }}</text>
        </view>
        <view
          class="main-plate-word"
          :class="{ active: currenttIndex == 5 }"
          @tap="inputSwitch"
          data-index="5"
        >
          <text>{{ currentInputValue[5] }}</text>
        </view>
        <view
          class="main-plate-word"
          :class="{ active: currenttIndex == 6 }"
          @tap="inputSwitch"
          data-index="6"
        >
          <text>{{ currentInputValue[6] }}</text>
        </view>
        <view
          class="main-plate-word"
          :class="{ active: currenttIndex == 7 }"
          @tap="inputSwitch"
          v-if="type == 2"
          data-index="7"
        >
          <text>{{ currentInputValue[7] }}</text>
        </view>
      </view>
      <view class="main-plate-foot">
        <view class="main-plate-keyboard" :style="{ height: keyboardHeight }">
          <view id="keyboard">
            <block v-if="inputType == 1">
              <view
                hover-class="hover"
                class="main-plate-key"
                v-for="el of provincesText"
                :key="el"
                :data-value="el"
                @tap="chooseKey"
                >{{ el }}</view
              >
            </block>
            <block v-if="inputType == 1">
              <text class="main-plate-key fill-block"></text>
              <text class="main-plate-key fill-block"></text>
            </block>
            <block v-if="inputType >= 3">
              <view
                hover-class="hover"
                class="main-plate-key"
                v-for="el of numberText"
                :key="el"
                :data-value="el"
                @tap="chooseKey"
                >{{ el }}</view
              >
            </block>
            <block v-if="inputType >= 2">
              <view
                hover-class="hover"
                class="main-plate-key"
                v-for="el of wordText"
                :key="el"
                :data-value="el"
                @tap="chooseKey"
                >{{ el }}</view
              >
            </block>
            <block v-if="inputType == 3">
              <text
                v-for="el of fillBlock"
                :key="el.num"
                class="main-plate-key fill-block"
              ></text>
            </block>
            <block v-if="inputType == 4">
              <view
                hover-class="hover"
                class="main-plate-key"
                v-for="el of lastWordText"
                :key="el"
                :data-value="el"
                @tap="chooseKey"
                >{{ el }}</view
              >
            </block>
            <text
              v-if="inputType == 4"
              class="main-plate-key fill-block"
            ></text>
          </view>
        </view>
        <view class="main-plate-btn-group">
          <view>
            <button
              class="main-plate-btn main-plate-btn--cancel"
              @tap="$emit('close')"
            >
              取消
            </button>
          </view>
          <view>
            <button
              class="main-plate-btn main-plate-btn--delete"
              @tap="deleteKey"
            >
              删除
            </button>
            <button
              class="main-plate-btn main-plate-btn--submit"
              @tap="exportPlate"
            >
              选择
            </button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  name: 'uni-plate-input',
  data() {
    return {
      type: 1, //车牌类型
      currenttIndex: 0, //当前编辑的输入框
      currentInputValue: ['', '', '', '', '', '', ''],
      fillBlock: [
        {
          num: 11,
        },
        {
          num: 12,
        },
        {
          num: 13,
        },
        {
          num: 14,
        },
        {
          num: 15,
        },
        {
          num: 16,
        },
      ],
      keyboardHeightInit: false,
      keyboardHeight: 'auto',
      provincesText: [
        '京',
        '冀',
        '沪',
        '津',
        '晋',
        '蒙',
        '辽',
        '吉',
        '黑',
        '苏',
        '浙',
        '皖',
        '闽',
        '赣',
        '鲁',
        '豫',
        '鄂',
        '湘',
        '桂',
        '琼',
        '渝',
        '川',
        '贵',
        '云',
        '粤',
        '藏',
        '陕',
        '甘',
        '青',
        '宁',
        '新',
      ],
      numberText: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
      wordText: [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'J',
        'K',
        'L',
        'M',
        'N',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
      ],
      lastWordText: ['港', '澳', '军', '警', '学', '领'],
    };
  },
  props: {
    plate: {
      type: String,
    },
  },
  computed: {
    inputType() {
      switch (this.currenttIndex) {
        case 0:
          return 1;
        case 1:
          return 2;
        case 2:
          return 3;
        case 3:
          return 3;
        case 4:
          return 3;
        case 5:
          return 3;
        case 6:
          return this.type == 2 ? 3 : 4;
        case 7:
          return 4;
        default:
          return 1;
      }
    },
  },
  watch: {
    currenttIndex: function (n, o) {
      if (!this.keyboardHeightInit) return;
      this.$nextTick(() => {
        this.changeKeyboardHeight();
      });
    },
  },
  methods: {
    inputSwitch(e) {
      const { index } = e.currentTarget.dataset;
      this.currenttIndex = parseInt(index);
    },
    Changetype(e) {
      const { value } = e.detail;
      this.type = parseInt(value);
      this.currenttIndex = 0;
      if (value == 1) {
        this.currentInputValue = ['', '', '', '', '', '', ''];
      } else {
        this.currentInputValue = ['', '', '', '', '', '', '', ''];
      }
    },
    chooseKey(e) {
      const { value } = e.currentTarget.dataset;
      this.$set(this.currentInputValue, this.currenttIndex, value);
      if (this.type == 1 && this.currenttIndex < 6) {
        this.currenttIndex++;
      }
      if (this.type == 2 && this.currenttIndex < 7) {
        this.currenttIndex++;
      }
    },
    deleteKey() {
      this.$set(this.currentInputValue, this.currenttIndex, '');
      if (this.currenttIndex != 0) this.currenttIndex--;
    },
    exportPlate() {
      const plate = this.currentInputValue.join('');
      let err = false;
      if (this.type === 1 && plate.length != 7) {
        err = true;
      } else if (this.type === 2 && plate.length != 8) {
        err = true;
      }
      if (err)
        return uni.showToast({
          title: '请输入完整的车牌号码!',
          icon: 'none',
        });
      this.$emit('export', plate);
    },
    changeKeyboardHeight() {
      const that = this;
      const query = uni.createSelectorQuery().in(this);
      query.select('#keyboard').boundingClientRect();
      query.exec(function (res) {
        if (res && res[0]) {
          that.keyboardHeight = res[0].height + uni.upx2px(30) + 'px';
          that.keyboardHeightInit = true;
        }
      });
    },
  },
  mounted() {
    const plateKey = this.plate.split('');
    if (plateKey.length === 7) {
      this.type = 1;
    } else if (plateKey.length === 8) {
      this.type = 2;
    }
    if (plateKey.length === 7 || plateKey.length === 8) {
      this.currentInputValue = plateKey;
      this.currenttIndex = plateKey.length - 1;
    }
    setTimeout(() => {
      //在动画结束之后才开始获取
      this.$nextTick(() => {
        this.changeKeyboardHeight();
      });
    }, 600);
  },
};
</script>
<style scoped lang="less">
.so-mask {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
}
.main-plate {
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
  width: 100%;
  left: 0;
  background: #fff;
  padding: 25upx 25upx 0 25upx;
  &-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &-type {
    flex: 1;
    display: block;
    label {
      display: inline-block;
      min-height: 32upx;
      font-size: 26upx;
      margin-right: 10upx;
    }
  }
  &-body {
    box-sizing: border-box;
    padding: 30upx 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &-word {
    border: 1upx solid #ccc;
    border-radius: 10upx;
    height: 0;
    margin: 0 5upx;
    box-sizing: border-box;
    padding-bottom: calc((100% - 70upx) / 7);
    width: calc((100% - 70upx) / 7);
    position: relative;
    &.active {
      border-color: #007aff;
      box-shadow: 0 0 15upx 0 #007aff;
    }
    text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      font-weight: 700;
      font-size: 32upx;
    }
  }
  &-dot {
    width: 15upx;
    height: 15upx;
    background: #ccc;
    border-radius: 50%;
    margin: 0 5upx;
  }
  &-keyboard {
    background: #eee;
    margin-left: -25upx;
    margin-right: -25upx;
    padding: 20upx 25upx 10upx 25upx;
    box-sizing: border-box;
    transition: all 0.3s;
    & > view {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
  }
  &-key {
    display: block;
    background: #fff;
    border-radius: 10upx;
    box-shadow: 0 0 8upx 0 #bbb;
    width: 80upx;
    height: 80upx;
    margin: 5upx 0;
    font-size: 32upx;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    &.hover {
      background: #efefef;
    }
    &.fill-block {
      width: 80upx;
      height: 80upx;
      background: none;
      box-shadow: none;
    }
  }
  &-btn {
    display: inline-block;
    background: #fff;
    border-radius: 10upx;
    box-shadow: 0 0 10upx 0 #bbb;
    font-size: 28upx;
    text-align: center;
    margin: 0 0 0 10upx;
    padding: 0 25upx;
    &-group {
      display: flex;
      justify-content: space-between;
      background: #eee;
      margin-left: -25upx;
      margin-right: -25upx;
      box-sizing: border-box;
      padding: 0 25upx 10upx 25upx;
    }
    &--cancel {
      margin: 0;
    }
    &--submit {
      background: #5773f9;
      color: #fff;
    }
    &--delete {
      color: #fd6b6d;
    }
  }
}

.animation-scale-up {
  animation-duration: 0.2s;
  animation-timing-function: ease-out;
  animation-fill-mode: both;
  animation-name: scale-up;
}
@keyframes scale-up {
  0% {
    opacity: 0.8;
    transform: scale(0.8);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
