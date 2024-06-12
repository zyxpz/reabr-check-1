<template>
  <view>
    <DaDropdown
      :dropdownMenu="dropdownMenuList"
      themeColor="#007aff"
      textColor="#333333"
      :duration="300"
      fixedTop
      ref="DaDropdownRef"
      @confirm="handleConfirm"
    >
      <!-- <template #slot1="{ item, index }">
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
      </template> -->
    </DaDropdown>
    <view class="list-container">
      <view class="uni-list">
        <view v-for="(item, index) in listData" :key="index" class="item">
          <view>
            <view class="header">
              <view class="g-flex">
                <view class="title">{{ item.no }}</view>
                <image
                  src="/static/copy.svg"
                  class="icon-image"
                  @click="() => setClipboard(item.no)"
                />
              </view>
              <view>
                <uni-tag
                  :inverted="true"
                  :text="item.isVerify === 2 ? '已归档' : '未归档'"
                  :type="item.isVerify === 2 ? 'primary' : 'default'"
                  size="mini"
                  class="tag"
                />
                <uni-tag
                  :inverted="true"
                  :text="item.pushStatus === 2 ? '已推送' : '未推送'"
                  :type="item.pushStatus === 2 ? 'success' : 'default'"
                  size="mini"
                />
              </view>
            </view>
            <view @click="() => handleToDetail(item)">
              <view class="body">
                <view v-for="dt in item?.list" :key="dt.materialSpec">
                  <uni-row class="material">
                    <uni-col :span="15">{{
                      dt?.materialName + '/' + dt?.materialSpec
                    }}</uni-col>
                    <uni-col :span="4" class="g-text-a-r"
                      >{{ dt.sendAmount }}根</uni-col
                    >
                    <uni-col :span="5" class="g-text-a-r"
                      >{{ dt.sendWeight }}千克</uni-col
                    >
                  </uni-row>
                </view>
              </view>
              <view class="footer">
                <uni-row class="info-item">
                  <uni-col :span="6">收货归属方</uni-col>
                  <uni-col :span="18" class="g-text-a-r">{{
                    item.attributionName
                  }}</uni-col>
                </uni-row>
                <uni-row class="info-item">
                  <uni-col :span="6">实际收货人</uni-col>
                  <uni-col :span="18" class="g-text-a-r">{{
                    item.consumeName
                  }}</uni-col>
                </uni-row>
                <uni-row class="info-item" v-if="truckTime">
                  <uni-col :span="6">收货时间</uni-col>
                  <uni-col :span="18" class="g-text-a-r">{{
                    truckTime ? truckTime?.replace('T', '') : ''
                  }}</uni-col>
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
import DaDropdown from '@/components/da-dropdown/index.vue';
import request from '@/utils/request.js';
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
          prop: 'no',
        },
        {
          title: '记录状态',
          type: 'cell',
          prop: 'isVerify',
          showAll: false,
          showIcon: true,
          options: [
            { label: '全部', value: '' },
            { label: '未归档', value: '1' },
            { label: '已归档', value: '2' },
          ],
        },
        {
          title: '推送状态',
          type: 'cell',
          prop: 'pushStatus',
          showAll: false,
          showIcon: true,
          options: [
            { label: '全部', value: '1' },
            { label: '未推送', value: '1' },
            { label: '已推送', value: '2' },
          ],
        },
      ],
      /**
       * 搜索数据
       */
      searchParams: {
        isVerify: '',
        pushStatus: '',
      },
      current: 1,
      size: 10,
      total: 0,
      searchOrder: '',
      listData: [],
      last_id: '',
      reload: false,
      status: 'nomore',
      adpid: '',
      contentText: {
        contentdown: '上拉加载更多',
        contentrefresh: '加载中',
        contentnomore: '没有更多',
      },
    };
  },
  onLoad() {},
  onShow() {
    this.adpid = this.$adpid;
    this.reload = true;
    this.last_id = '';
    this.searchParams.attributionId =
      uni.getStorageSync('attribute-info')?.attributionId;
    this.searchParams.consumeId = uni.getStorageSync('tenant-info')?.consumeId;
    this.searchParams.uid = uni.getStorageSync('tenant-info')?.uid;
    console.log(this.searchParams, 888999);
    this.getList({
      current: 1,
      size: this.size,
      ...this.searchParams,
    });
  },
  onPullDownRefresh() {
    this.reload = true;
    this.last_id = '';
    this.getList({
      current: 1,
      size: this.size,
      ...this.searchParams,
    });
  },
  onReachBottom() {
    if (Math.ceil(this.total / 10) < this.current) {
      this.status = 'noMore';
    } else {
      this.status = 'more';
      this.getList({
        current: this.current,
        size: this.size,
        ...this.searchParams,
      });
    }
  },
  methods: {
    getList(params) {
      if (this.last_id) {
        //说明已有数据，目前处于上拉加载
        this.status = 'loading';
      }
      request.post('/api/rebarCheck/checkList', params).then((res) => {
        if (res?.success) {
          this.current++;
          const list = res?.data?.records;
          this.listData = this.reload ? list : this.listData?.concat(list);
          this.last_id = list[list.length - 1]?.id;
          this.reload = false;
          this.total = res?.data?.total;
          if (this.total < this.size) {
            this.status = 'noMore';
          }
        }
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
      this.searchParams = {
        ...this.searchParams,
        ...value,
      };
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
     * 获取详情
     */
    async getDetail() {
      this.detail = res?.data;
      console.log(this.detail, 'this.detail');
    },
    /**
     * 跳转到详情
     */
    async handleToDetail(item) {
      if (item.isVerify === 2) {
        /** 已归档的跳转到详情 */
        uni.navigateTo({
          url: `/pages/receiveRecords/receiveRecordsDetail?id=${item.id}`,
        });
      } else {
        /** 未归档的需要跳转到相应的编辑页面 */
        const res = await request.get(`/api/rebarCheck/checkDetail/${item.id}`);
        const { checkConfirmVO, checkReverseVO, checkTruckVO } =
          res?.data ?? {};
        /** 盘螺 */
        if (item.type === 2) {
          /** 如何判断走到哪一步？ */
          /** 没有反向复核 */
          if (!checkConfirmVO.reverseWeightType) {
            uni.navigateTo({
              url: `/pages/addReceive/checkTrayRebar?id=${item.id}`,
            });
          } else {
            uni.navigateTo({
              url: `/pages/addReceive/confirmCarInfos?id=${item.id}`,
            });
          }
        }
        /** 直螺 */
        if (item.type === 1) {
          /** 没有反向复核 */
          if (!checkConfirmVO.reverseWeightType) {
            uni.navigateTo({
              url: `/pages/addReceive/checkFirst?id=${item.id}`,
            });
          }
          /** 判断是否进行到确认数据 */
          const isConfirmed = checkConfirmVO?.list?.every(
            (one) =>
              one.hasOwnProperty('confirmAmount') &&
              one.hasOwnProperty('confirmWeight'),
          );
          if (checkConfirmVO.reverseWeightType) {
            uni.navigateTo({
              url: isConfirmed
                ? `/pages/addReceive/confirmCarInfos?id=${item.id}`
                : `/pages/addReceive/confirmData?id=${item.id}`,
            });
          }
        }
      }
    },
  },
  watch: {
    searchParams(newValue) {
      this.reload = true;
      this.last_id = '';
      this.current = 1;
      this.getList({
        current: 1,
        size: this.size,
        ...newValue,
      });
    },
  },
  onHide() {
    uni.hideLoading();
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
