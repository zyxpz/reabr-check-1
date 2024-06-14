<template>
  <view class="page">
    <view class="content">
      <uni-forms
        ref="baseForm"
        :model="formData"
        labelWidth="105px"
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
          <uni-forms-item label="车牌:" name="truckNo">
            <view @click="() => (plateShow = true)">
              <uni-easyinput
                type="text"
                v-model="formData.truckNo"
                placeholder="请输入车牌"
                style="height: 35px"
                :disabled="disabled"
                @focus="onFocus"
              />
            </view>
            <plate-input
              v-if="plateShow"
              :plate="formData.truckNo"
              @export="setPlate"
              @close="plateShow = false"
            />
          </uni-forms-item>
          <uni-forms-item label="车辆到场时间:" name="truckTime">
            <uni-datetime-picker
              v-model="formData.truckTime"
              type="datetime"
              @change="changeTime"
            >
              <!-- <view class="time-picker">{{ formData.time ?? '请选择' }}</view> -->
            </uni-datetime-picker>
          </uni-forms-item>
          <uni-forms-item label="车辆称重照片:" name="truckPic">
            <uni-file-picker
              v-model="formData.truckPic"
              file-mediatype="image"
              mode="grid"
              file-extname="png,jpg"
              :limit="9"
              @progress="progress"
              @success="success"
              @fail="fail"
              @select="(e) => select(e, 'truckPic', 'truckPicTemp')"
              :source-type="['camera, album']"
              :auto-upload="false"
            />
          </uni-forms-item>
          <uni-forms-item label="货/铭牌照片:" name="goodsPic">
            <uni-file-picker
              v-model="formData.goodsPic"
              file-mediatype="image"
              mode="grid"
              file-extname="png,jpg"
              :limit="9"
              @select="(e) => select(e, 'goodsPic', 'goodsPicTemp')"
              @progress="progress"
              @success="success"
              @fail="fail"
              :source-type="['camera, album']"
            />
          </uni-forms-item>
          <uni-forms-item
            label="送货单照片:"
            name="sendPic"
            style="margin-bottom: 0rpx"
          >
            <uni-file-picker
              v-model="formData.sendPic"
              file-mediatype="image"
              mode="grid"
              file-extname="png,jpg"
              :limit="9"
              @progress="progress"
              @success="success"
              @fail="fail"
              @select="(e) => select(e, 'sendPic', 'sendPicTemp')"
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
            label="验收结果:"
            name="checkResult"
          >
            <uni-data-checkbox
              v-model="formData.checkResult"
              :localdata="checkResultLists"
            ></uni-data-checkbox>
          </uni-forms-item>
          <uni-forms-item
            label="验收意见:"
            name="checkRemark"
            style="margin-bottom: 4rpx"
          >
            <uni-easyinput
              type="textarea"
              autoHeight
              v-model="formData.checkRemark"
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
            <image src="/static/scan.svg" class="icon-scan" @click="scan" />
          </view>
        </view>
      </uni-forms>
    </view>
    <uni-row class="g-flex-aic-jcsb">
      <uni-col :span="6"
        ><button type="primary" @click="handlePrev">上一步</button></uni-col
      >
      <uni-col :span="6"
        ><button :loading="loading" type="warn" @click="() => handleSave(1)">
          暂存
        </button></uni-col
      >
      <uni-col :span="10"
        ><button
          :loading="saveLoading"
          type="primary"
          @click="() => handleSave(2)"
        >
          保存并归档
        </button></uni-col
      >
    </uni-row>
  </view>
</template>
<script>
import permision from '@/common/permission';
import PlateInput from '../../components/uni-plate-input/uni-plate-input.vue';
import request from '@/utils/request';
import oss from '@/utils/oss';
import moment from 'moment';

export default {
  components: {
    PlateInput,
  },
  data() {
    return {
      id: '',
      // #ifdef H5 || APP-PLUS
      disabled: true,
      // #endif
      plateShow: false,
      /**
       * 暂存 loading
       */
      loading: false,
      /**
       * 保存 loading
       */
      saveLoading: false,
      formData: {
        /**
         * 车牌号
         */
        // truckNo: '豫A29S6F',
        truckNo: '',
        /**
         * 外部系统代码
         */
        extNo: '',
        /**
         * 车辆到场时间
         */
        truckTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        checkResult: '1',
        truckPic: [],
        truckPicTemp: [],
        goodsPic: [],
        goodsPicTemp: [],
        sendPic: [],
        sendPicTemp: [],
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
        truckTime: {
          rules: [
            {
              required: true,
              errorMessage: '车辆到场时间不能为空',
            },
          ],
        },
        checkResult: {
          rules: [
            {
              required: true,
              errorMessage: '验收结果必选',
            },
          ],
        },
      },
      detail: {},
    };
  },
  methods: {
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      if (type === 'day') {
        return `${value}日`;
      }
      return value;
    },
    changeTime(e) {
      this.formData.truckTime = e;
    },
    // 获取上传状态
    select(e, type, tempType) {
      this.formData[type] = (this.formData[type] ?? [])?.concat(e.tempFiles);
      this.formData[tempType] = (this.formData[tempType] ?? [])?.concat(
        e.tempFiles,
      );
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
      if (this.detail?.checkConfirmVO?.type === 1) {
        uni.redirectTo({
          url: `/pages/addReceive/confirmData?id=${this.id}`,
        });
      }
      if (this.detail?.checkConfirmVO?.type === 2) {
        uni.redirectTo({
          url: `/pages/addReceive/checkTrayRebar?id=${this.id}`,
        });
      }
    },
    onFocus() {
      this.plateShow = true;
      uni.hideKeyBoard();
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
    changePic(tempFiles, type) {
      const promiseArr = [];
      tempFiles?.forEach((one) => {
        if (one?.file) {
          promiseArr.push(oss(one));
        } else {
          promiseArr.push(oss({ file: one, blobFile: true }));
        }
      });
      if (promiseArr?.length) {
        try {
          return Promise.all(promiseArr).then((res) => {
            console.log('上传成功，文件 URL:', res);
            return res;
          });
        } catch (e) {
          console.error('上传失败:', e);
        }
      }
      return Promise.resolve([]);
    },
    setPlate(plate) {
      if (plate.length >= 7) this.formData.truckNo = plate;
      this.plateShow = false;
    },
    async getDetail() {
      uni.showLoading();
      const res = await request.get(`/api/rebarCheck/checkDetail/${this.id}`);
      uni.hideLoading();
      this.detail = res?.data;
      const {
        truckNo,
        truckTime,
        goodsPic,
        sendPic,
        truckPic,
        truckPics,
        checkRemark,
        checkResult,
        extNo,
      } = res?.data?.checkTruckVO;
      this.formData.truckNo = truckNo;

      const tempUuidTruckPics = res?.data?.checkTruckVO?.truckPic
        ?.split(',')
        ?.filter((one) => one);

      this.formData = {
        truckNo,
        truckTime: truckTime
          ? moment(truckTime).format('YYYY-MM-DD HH:mm:ss')
          : undefined,
        checkRemark,
        checkResult: checkResult + '',
        extNo,
        truckPic: truckPics?.map((one, index) => ({
          name: `${tempUuidTruckPics?.[index]}.png`,
          extname: 'png',
          url: one,
          uuid: tempUuidTruckPics?.[index],
          isDetail: true,
        })),
        truckPicTemp: res?.data?.checkTruckVO?.truckPic
          ?.split(',')
          ?.filter((one) => one)
          ?.map((one, index) => ({
            uuid: one,
            isDetail: true,
            url: res?.data?.checkTruckVO?.truckPics?.[index],
          })),
      };
      console.log(this.formData, ' this.formData');
    },
    async handleSave(isVerify) {
      const {
        truckPicTemp,
        goodsPicTemp,
        sendPicTemp,
        truckNo,
        truckTime,
        ...rest
      } = this.formData;

      if (!truckNo && isVerify === 2) {
        uni.showToast({
          title: '车牌必填！',
          icon: 'none',
        });
        return;
      }

      /** 货/铭牌照片 */
      /** 所有现在看到的图片数组， 详情的按照 uuid 区分， 非详情的按照 url获取 */
      const truckPic = truckPicTemp.filter((one) =>
        this.formData.truckPic?.find((dt) =>
          one.isDetail
            ? one.uuid === dt?.name?.split('.')?.[0]
            : dt.url === one.url,
        ),
      );
      /** 过滤出详情中剩余未被删除的数据 */
      const detailTruckPic = truckPic?.filter((one) => one.isDetail);
      /** 转换新增的数据 */
      const tempTruckPicUuid = await this.changePic(
        truckPic?.filter((one) => !one.isDetail),
      );
      /** 最终图片数据是由详情中未被删除的+新增的 */
      const finallyTruckPicUuid = detailTruckPic
        ?.map((one) => one.uuid)
        ?.concat(tempTruckPicUuid);

      /** 货/铭牌照片 */
      const goodsPic = goodsPicTemp?.filter((one) =>
        this.formData.goodsPic?.find((dt) =>
          one.isDetail
            ? one.uuid === dt?.name?.split('.')?.[0]
            : dt.url === one.url,
        ),
      );

      /** 过滤出详情中剩余未被删除的数据 */
      const detailGoodsPic = truckPic?.filter((one) => one.isDetail);
      /** 转换新增的数据 */
      const tempGoodsPicUuid = await this.changePic(
        goodsPic?.filter((one) => !one.isDetail),
      );
      /** 最终图片数据是由详情中未被删除的+新增的 */
      const finallyGoodsPicUuid = detailGoodsPic
        ?.map((one) => one.uuid)
        ?.concat(tempGoodsPicUuid);

      /** 送货单照片 */
      const sendPic = sendPicTemp?.filter((one) =>
        this.formData.sendPic?.find((dt) =>
          one.isDetail
            ? one.uuid === dt?.name?.split('.')?.[0]
            : dt.url === one.url,
        ),
      );
      /** 过滤出详情中剩余未被删除的数据 */
      const detailSendPic = sendPic?.filter((one) => one.isDetail);
      const tempSendPicUuid = await this.changePic(
        sendPic?.filter((one) => !one.isDetail),
      );

      /** 最终图片数据是由详情中未被删除的+新增的 */
      const finallySendPicUuid = detailSendPic
        ?.map((one) => one.uuid)
        ?.concat(tempSendPicUuid);
      // if (!truckPic?.length) {
      //   uni.showToast({
      //     title: '请添加车辆称重照片！',
      //     icon: 'none',
      //   });
      //   return;
      // }
      // if (!goodsPic?.length) {
      //   uni.showToast({
      //     title: '请添加货/铭牌照片！',
      //     icon: 'none',
      //   });
      //   return;
      // }
      // if (!sendPic?.length) {
      //   uni.showToast({
      //     title: '请添加送货单照片！',
      //     icon: 'none',
      //   });
      //   return;
      // }
      uni.showLoading();
      if (isVerify === 1) {
        this.loading = true;
      } else {
        this.saveLoading = true;
      }
      try {
        const res = await request.post('/api/rebarCheck/truckOrPicUpdate', {
          ...rest,
          truckPic: finallyTruckPicUuid?.join(),
          goodsPic: finallyGoodsPicUuid?.join(),
          sendPic: finallySendPicUuid?.join(),
          id: this.id,
          isVerify,
          truckNo,
          truckTime,
        });
        uni.hideLoading();
        this.loading = false;
        if (res.success) {
          uni.showToast({
            title: isVerify === 1 ? '暂存成功' : '保存并归档成功',
            icon: 'success',
          });
          if (isVerify === 2) {
            uni.switchTab({
              url: '/pages/tabBar/ReceiveRecords/ReceiveRecords',
            });
          }
        } else {
          uni.showToast({
            title: '保存失败',
            icon: 'error',
          });
        }
      } catch (error) {
        uni.hideLoading();
        if (isVerify === 1) {
          this.loading = false;
        } else {
          this.saveLoading = false;
        }
      }
    },
  },
  onLoad(options) {
    this.id = options.id;
    this.getDetail();
  },
  onHide() {
    uni.hideLoading();
  },
};
</script>
<style lang="scss">
.page {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100vh - 32rpx);
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
.uni-forms-item {
  margin-bottom: 16rpx !important;
}
.time-picker {
  height: 30px;
  border: solid 1px #dcdfe6;
  display: flex;
  align-items: center;
  color: rgb(51, 51, 51);
  padding-left: 10px;
}
.is-disabled {
  color: rgb(51, 51, 51) !important;
  background-color: #fff !important;
}
</style>
