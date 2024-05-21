<template>
  <view class="add-material-page">
    <view class="content">
      <view class="item">
        <text class="title">1、送货单各规格数据自洽检验</text>
        <uni-section title="送货单各规格数据自洽检验" type="line" padding>
          <uni-table
            ref="table"
            :loading="loading"
            border
            emptyText="暂无更多数据"
          >
            <uni-tr>
              <uni-th width="20%" align="center">日期</uni-th>
              <uni-th width="20%" align="center">姓名</uni-th>
              <uni-th width="20%">地址</uni-th>
              <uni-th width="20%" align="center">设置</uni-th>
              <uni-th width="20%" align="center">设置</uni-th>
            </uni-tr>
            <uni-tr v-for="(item, index) in []" :key="index">
              <uni-td>{{ item.date }}</uni-td>
              <uni-td>
                <view class="name">{{ item.name }}</view>
              </uni-td>
              <uni-td align="center">{{ item.address }}</uni-td>
              <uni-td>
                <view class="uni-group">
                  <button class="uni-button" size="mini" type="primary">
                    修改
                  </button>
                  <button class="uni-button" size="mini" type="warn">
                    删除
                  </button>
                </view>
              </uni-td>
            </uni-tr>
          </uni-table>
        </uni-section>
      </view>
    </view>
    <uni-row class="btn-content">
      <uni-col :span="9"
        ><button type="primary" @click="handleCheck">
          修改运单数据
        </button></uni-col
      >
      <uni-col :span="6"
        ><button type="warn" @click="handleCancel">取消</button></uni-col
      >
      <uni-col :span="6"
        ><button type="primary" @click="handleCheck">继续</button></uni-col
      >
    </uni-row>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style lang="scss">
.add-material-page {
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100vh - 72px);
}
.content {
  flex: 1;
  overflow: auto;
}
.btn-content {
  display: flex;
  justify-content: space-between;
}
.item {
  background-color: #fff;
  padding-top: 16rpx;
}
.title {
  font-weight: 700;
  font-size: 28rpx;
  padding: 16rpx;
}
</style>
