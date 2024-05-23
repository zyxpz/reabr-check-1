<template>
  <view class="page">
    <view class="content">
      <uni-forms
        ref="baseForm"
        :model="formData"
        labelWidth="194rpx"
        :rules="customRules"
      >
        <view class="card">
          <view class="g-flex-aic"
            ><image
              src="/static/car_info.svg"
              class="icon-image"
            />车辆及到场信息</view
          >
          <u-cus-gap size="24" />

          <uni-forms-item
            style="margin-bottom: 12rpx"
            label="车牌："
            name="truckNo"
          >
            <uni-easyinput
              type="text"
              v-model="formData.truckNo"
              placeholder="请输入姓名"
            />
          </uni-forms-item>
          <uni-forms-item
            label="车辆到场时间："
            name="time"
            style="margin-bottom: 12rpx"
          >
            <uni-datetime-picker v-model="formData.time" @change="changeTime">
              <uni-easyinput type="text" v-model="formData.time"
            /></uni-datetime-picker>
          </uni-forms-item>
          <uni-forms-item
            label="车辆称重照片："
            name="gpics"
            style="margin-bottom: 12rpx"
          >
            <uni-file-picker
              v-model="formData.gpics"
              file-mediatype="image"
              mode="grid"
              file-extname="png,jpg"
              :limit="9"
              @progress="progress"
              @success="success"
              @fail="fail"
              @select="select"
              :source-type="['camera, album']"
            />
          </uni-forms-item>
          <uni-forms-item
            label="货/铭牌照片："
            name="tpics"
            style="margin-bottom: 12rpx"
          >
            <uni-file-picker
              v-model="formData.tpics"
              file-mediatype="image"
              mode="grid"
              file-extname="png,jpg"
              :limit="9"
              @progress="progress"
              @success="success"
              @fail="fail"
              @select="select"
              :source-type="['camera, album']"
            />
          </uni-forms-item>
          <uni-forms-item
            label="送货单照片："
            name="sendPics"
            style="margin-bottom: 0rpx"
          >
            <uni-file-picker
              v-model="formData.sendPics"
              file-mediatype="image"
              mode="grid"
              file-extname="png,jpg"
              :limit="9"
              @progress="progress"
              @success="success"
              @fail="fail"
              @select="select"
              :source-type="['camera, album']"
            />
          </uni-forms-item>
        </view>
        <view class="card">
          <view class="g-flex-aic"
            ><image
              src="/static/accept_result.svg"
              class="icon-image"
            />验收结果</view
          >
          <u-cus-gap size="24" />
          <uni-forms-item
            style="margin-bottom: 4rpx"
            label="验收结果："
            name="result"
          >
            <uni-data-checkbox
              v-model="formData.result"
              :localdata="checkResultLists"
            ></uni-data-checkbox>
          </uni-forms-item>
          <uni-forms-item
            label="验收意见："
            name="remark"
            style="margin-bottom: 4rpx"
          >
            <uni-easyinput
              type="textarea"
              autoHeight
              v-model="formData.remark"
              placeholder="请输入内容"
            ></uni-easyinput>
          </uni-forms-item>
        </view>
        <view class="card">
          <view class="g-flex-aic"
            ><image
              src="/static/position.svg"
              class="icon-image"
            />外部代码</view
          >
          <u-cus-gap size="24" />
          <view class="g-flex-aic-jcsb">
            <uni-easyinput
              type="text"
              v-model="formData.extNo"
              placeholder="请输入"
            />
            <image src="/static/scan.svg" class="icon-scan" />
          </view>
        </view>
      </uni-forms>
    </view>
    <uni-row class="g-flex-aic-jcsb">
      <uni-col :span="6"
        ><button type="default" @click="handlePrev">上一步</button></uni-col
      >
      <uni-col :span="6"
        ><button type="default" @click="handleDraft">暂存</button></uni-col
      >
      <uni-col :span="10"
        ><button type="primary" @click="handleSave">保存并归档</button></uni-col
      >
    </uni-row>
  </view>
</template>
<script>
import image from 'ali-oss/lib/image';
import permision from '@/common/permission';
export default {
  data() {
    return {
      formData: {
        /**
         * 车牌号
         */
        truckNo: '豫A29S6F',
        /**
         * 外部系统代码
         */
        extNo: '',
        result: '1',
      },
      checkResultLists: [
        {
          text: '合格进场',
          value: '1',
        },
        {
          text: '不合格退场',
          value: '2',
        },
      ],
      // 自定义表单校验规则
      customRules: {
        truckNo: {
          rules: [
            {
              required: true,
              errorMessage: '车牌不能为空',
            },
          ],
        },
        time: {
          rules: [
            {
              required: true,
              errorMessage: '车辆到场时间不能为空',
            },
          ],
        },
        result: {
          rules: [
            {
              required: true,
              errorMessage: '验收结果必选',
            },
          ],
        },
        // hobby: {
        //   rules: [
        //     {
        //       format: 'array',
        //     },
        //     {
        //       validateFunction: function (rule, value, data, callback) {
        //         if (value.length < 2) {
        //           callback('请至少勾选两个兴趣爱好');
        //         }
        //         return true;
        //       },
        //     },
        //   ],
        // },
      },
    };
  },
  methods: {
    changeTime(e) {
      this.formData.time = e;
    },
    // 获取上传状态
    select(e) {
      console.log('选择文件：', e);
    },
    // 获取上传进度
    progress(e) {
      console.log('上传进度：', e);
    },

    // 上传成功
    success(e) {
      console.log('上传成功');
    },

    // 上传失败
    fail(e) {
      console.log('上传失败：', e);
    },
    /**
     * 扫一扫
     */
    async scan() {
      // #ifdef APP-PLUS
      let status = await this.checkPermission();
      if (status !== 1) {
        return;
      }
      // #endif
      uni.scanCode({
        success: (res) => {
          this.formData.extNo = res.result;
        },
        fail: (err) => {
          // 需要注意的是小程序扫码不需要申请相机权限
        },
      });
    },
    /**
     * 检查相机权限
     */
    async checkPermission() {
      let status = permision.isIOS
        ? await permision.requestIOS('camera')
        : await permision.requestAndroid('android.permission.CAMERA');

      if (status === null || status === 1) {
        status = 1;
      } else {
        uni.showModal({
          content: '需要相机权限',
          confirmText: '设置',
          success: function (res) {
            if (res.confirm) {
              permision.gotoAppSetting();
            }
          },
        });
      }
      return status;
    },
    handlePrev() {
      uni.navigateBack();
    },
    handleDraft() {
      this.$refs.baseForm
        .validate()
        .then((res) => {
          console.log('success', res);
          uni.showToast({
            title: `校验通过`,
          });
        })
        .catch((err) => {
          console.log('err', err);
        });
    },
    handleSave() {
      uni.showToast({
        title: '保存成功',
        icon: 'success',
      });
    },
  },
};
</script>
<style lang="scss">
.page {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100vh - 60px);
}
.content {
  flex: 1;
  overflow: auto;
}
.card {
  background: #fff;
  padding: 24rpx 16rpx;
  margin: 16rpx;
}
.icon-image {
  width: 40rpx;
  height: 40rpx;
  margin-right: 6rpx;
}
.icon-scan {
  width: 40rpx;
  height: 40rpx;
  margin-left: 12rpx;
}
</style>
