<template>
  <view>
    <DaDropdown
      :dropdownMenu="dropdownMenuList"
      themeColor="#007aff"
      textColor="#333333"
      :duration="300"
      fixedTop
      ref="DaDropdownRef"
    >
      <template #slot1="{ item, index }">
        <uni-search-bar
          style="margin: 16rpx 0"
          radius="4"
          placeholder="请输入收料编号"
          clearButton="auto"
          cancelButton="none"
          ref="searchOrderRef"
          v-model="searchOrder"
          @change="(v) => (searchOrder = v)"
        />
        <uni-row class="g-flex-aic-jcsb">
          <uni-col :span="11"
            ><button type="default" @click="handleCancel">重置</button></uni-col
          >
          <uni-col :span="11"
            ><button type="primary" @click="handleSearchOrderConfirm">
              确定
            </button></uni-col
          >
        </uni-row>
        <u-cus-gap size="36" />
        <view> </view>
      </template>
    </DaDropdown>
    <view class="list-container">
      <view class="uni-list">
        <view v-for="(item, index) in listData" :key="index" class="item">
          <view>
            <view class="header">
              <view class="g-flex">
                <view class="title">adfhasldjkfhaskjdhf</view>
                <image
                  src="/static/copy.svg"
                  class="icon-image"
                  @click="() => setClipboard('adfhasldjkfhaskjdhf')"
                />
              </view>
              <view>
                <uni-tag
                  :inverted="true"
                  text="已归档"
                  type="primary"
                  size="mini"
                  class="tag"
                />
                <uni-tag
                  :inverted="true"
                  text="已推送"
                  type="success"
                  size="mini"
                />
              </view>
            </view>
            <view @click="() => handleToDetail(item)">
              <view class="body">
                <uni-row class="material">
                  <uni-col span="15">裸粉尴尬死的客户发空间说的话</uni-col>
                  <uni-col span="4" class="g-text-a-r">12根</uni-col>
                  <uni-col span="5" class="g-text-a-r">12378千克</uni-col>
                </uni-row>
                <uni-row class="material">
                  <uni-col span="15">裸粉尴尬死的客户发空间说的话</uni-col>
                  <uni-col span="4" class="g-text-a-r">12根</uni-col>
                  <uni-col span="5" class="g-text-a-r">12378千克</uni-col>
                </uni-row>
              </view>
              <view class="footer">
                <uni-row class="info-item">
                  <uni-col span="6">收货归属方</uni-col>
                  <uni-col span="18" class="g-text-a-r">杭州西湖二</uni-col>
                </uni-row>
                <uni-row class="info-item">
                  <uni-col span="6">实际收货人</uni-col>
                  <uni-col span="18" class="g-text-a-r">张三</uni-col>
                </uni-row>
                <uni-row class="info-item">
                  <uni-col span="6">收货时间</uni-col>
                  <uni-col span="18" class="g-text-a-r"
                    >2018-10-05 12:12:12</uni-col
                  >
                </uni-row>
              </view>
            </view>
          </view>
          <!-- #ifdef APP-PLUS -->
          <view class="ad-view" v-if="index > 0 && (index + 1) % 10 == 0">
            <ad :adpid="adpid" @error="aderror"></ad>
          </view>
          <!-- #endif -->
        </view>
      </view>
    </view>

    <uni-load-more
      :status="status"
      :icon-size="16"
      :content-text="contentText"
    />
  </view>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import DaDropdown from '@/components/da-dropdown/index.vue';
import { ref } from 'vue';
export default {
  components: {
    DaDropdown,
  },
  data() {
    return {
      dropdownMenuList: [
        {
          title: '搜索',
          type: 'search',
          prop: 'god0',
          // value: '哈哈哈', // 默认内容 哈哈哈
        },
        {
          title: '记录状态',
          type: 'cell',
          prop: 'god1',
          showAll: true,
          showIcon: true,
          options: [
            { label: '未归档', value: '1' },
            { label: '已归档', value: '2' },
          ],
        },
        {
          title: '推送状态',
          type: 'cell',
          prop: 'god2',
          showAll: true,
          showIcon: true,
          options: [
            { label: '未推送', value: '1' },
            { label: '已推送', value: '2' },
          ],
        },
        // {
        //   title: '筛选',
        //   type: 'slot1',
        //   prop: 'god3',
        // },
      ],
      /**
       * 搜索数据
       */
      searchParams: {
        god1: '',
        god2: '',
        god3: '',
      },
      searchOrder: '',
      listData: [
        {
          id: uuidv4(),
        },
        {
          id: uuidv4(),
        },
        {
          id: uuidv4(),
        },
      ],
      last_id: '',
      reload: false,
      status: 'more',
      adpid: '',
      contentText: {
        contentdown: '上拉加载更多',
        contentrefresh: '加载中',
        contentnomore: '没有更多',
      },
    };
  },
  onLoad() {
    this.adpid = this.$adpid;
    this.getList();
  },
  onPullDownRefresh() {
    this.reload = true;
    this.last_id = '';
    this.getList();
  },
  onReachBottom() {
    this.status = 'more';
    this.getList();
  },
  methods: {
    getList() {
      var data = {
        column: 'id,post_id,title,author_name,cover,published_at', //需要的字段名
      };
      if (this.last_id) {
        //说明已有数据，目前处于上拉加载
        this.status = 'loading';
        data.minId = this.last_id;
        data.time = new Date().getTime() + '';
        data.pageSize = 10;
      }
      uni.request({
        url: 'https://unidemo.dcloud.net.cn/api/news',
        data: data,
        success: (data) => {
          if (data.statusCode == 200) {
            const list = data;
            // this.listData = this.reload ? list : this.listData.concat(list);
            // this.last_id = list[list.length - 1].id;
            // this.reload = false;
          }
        },
        fail: (data, code) => {
          console.log('fail' + JSON.stringify(data));
        },
      });
    },
    goDetail: function (e) {
      uni.navigateTo({
        url:
          '../list2detail-detail/list2detail-detail?detailDate=' +
          encodeURIComponent(JSON.stringify(detail)),
      });
    },
    aderror(e) {
      console.log('aderror: ' + JSON.stringify(e.detail));
    },
    changeSearchOrder(v) {
      this.searchParams.god3 = v;
    },
    handleConfirm(value, data) {
      console.log(value, data, 888);
      this.searchParams = data;
    },
    handleSearchOrderConfirm(e) {
      this.searchParams.god3 = this.$refs.searchOrderRef?.searchVal;
      // 操作完成后关闭弹窗
      this.$refs.DaDropdownRef?.handlePopupMask();
    },
    handleCancel() {
      this.$refs.searchOrderRef?.clear();
    },
    /**
     * 复制
     */
    setClipboard: function (data) {
      // var data = this.data;
      if (data?.length === 0) {
        uni.showModal({
          title: '设置剪贴板失败',
          content: '内容不能为空',
          showCancel: false,
        });
      } else {
        uni.setClipboardData({
          data: data,
          success: () => {
            // 成功处理
            // #ifdef MP-ALIPAY || MP-BAIDU || MP-TOUTIAO
            uni.showToast({
              title: '设置剪贴板成功',
              icon: 'success',
              mask: !1,
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
    },
    /**
     * 跳转到详情
     */
    handleToDetail(item) {
      uni.navigateTo({
        url: `/pages/receiveRecords/receiveRecordsDetail?id=${item.id}`,
      });
    },
  },
};
</script>

<style>
.list-container {
  margin: 12rpx;
}
.uni-list {
  background-color: transparent;
}
.item {
  margin-bottom: 16rpx;
  background-color: #fff;
}
.icon-image {
  width: 42rpx;
  height: 42rpx;
  color: #d3d1d1;
  margin: 0 8rpx;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: solid 1px #efefef;
  padding: 18rpx;
  color: #555;
  font-size: 28rpx;
}
.material {
  padding: 0 18rpx 18rpx 18rpx;
}
.title {
  font-size: 32rpx;
}
.tag {
  margin-right: 12rpx;
}
.body {
  padding: 18rpx 0 0 0;
  border-bottom: solid 1px #efefef;
  color: #555;
  font-size: 26rpx;
}
.footer {
  padding: 18rpx 18rpx 0 18rpx;
  color: #555;
  font-size: 26rpx;
}
.info-item {
  margin-bottom: 18rpx;
  font-size: 28rpx;
}
</style>
