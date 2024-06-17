<template>
  <!-- @scrolltolower触底事件，@scroll滚动事件 -->
  <scroll-view
    :scroll-top="scrollTop"
    scroll-y="true"
    :style="{ height: containerHeight + 'px' }"
    @scroll="handleScroll"
  >
    <view :style="paddingStyle">
      <view v-for="(item, index) in showList" :key="index" id="box">
        <slot :item="item" :$index="index"></slot>
      </view>
    </view>
  </scroll-view>
</template>

<script>
export default {
  props: {
    // 所有数据
    allList: {
      type: Array,
      default() {
        return [];
      },
    },
    // 容器高度
    containerHeight: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      oneHeight: 100, // 单个元素的高度,默认100.在mounted中会再次获取单个元素高度
      scrollTop: 0, // 滚动距离
    };
  },
  methods: {
    handleScroll(e) {
      this.scrollTop = e?.detail?.scrollTop || 0;
    },
  },
  mounted() {
    // 计算单个元素的高度
    this.$nextTick(() => {
      // uniapp中获取高度的兼容写法
      const query = uni.createSelectorQuery().in(this);
      query
        .select('#box')
        .boundingClientRect((data) => {
          if (data && data.height) {
            this.oneHeight = data.height;
          }
        })
        .exec();
    });
  },
  computed: {
    // 一屏多少条数据
    showNum() {
      return Math.ceil(this.containerHeight / this.oneHeight) + 2;
    },
    // 开始索引
    startIndex() {
      const curIndex = Math.floor(this.scrollTop / this.oneHeight);
      return Math.max(0, curIndex - this.showNum);
    },
    // 渲染元素最后的index
    endIndex() {
      const curIndex = Math.floor(this.scrollTop / this.oneHeight);
      const end = curIndex + this.showNum * 2;
      return Math.min(end, this.allList.length);
    },
    // 需要渲染的数据
    showList() {
      return this.allList.slice(this.startIndex, this.endIndex);
    },
    // 空白占位的高度
    paddingStyle() {
      return {
        paddingTop: `${this.startIndex * this.oneHeight}px`,
        paddingBottom: `${
          (this.allList.length - this.endIndex) * this.oneHeight
        }px`,
      };
    },
  },
};
</script>
