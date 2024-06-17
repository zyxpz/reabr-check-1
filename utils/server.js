// import server from '../server';
import request from '@/utils/request';
import qs from 'qs';
import { Base64 } from 'js-base64';
import CryptoJS from './cryptoJS';

const config = {
  // '1.0': {
  //   uploadFileConfigUrl: `${server.homeServer}/common/uploadFileConfig.htm`,
  //   fileStsUrl: `${server.homeServer}/common/fileSts.htm`,
  //   getStsParams: (params) => {
  //     return {
  //       'form.subSystem': 2,
  //       'form.fileOwnerType': 2,
  //       'form.fileName': params.fileName,
  //       'form.fileSize': params.fileSize,
  //       'form.fileType': params.fileType,
  //       'form.fileMd5': params.fileMd5,
  //       'form.fileMime': params.fileMime,
  //       // 'form.plugNo': uni.$u.defaultSetting.plugNo,
  //       'form.picRadio': '',
  //       'form.playTime': '',
  //     };
  //   },
  // },
  '2.0': {
    uploadFileConfigUrl: `/api/oss/uploadFileConfig`,
    // uploadFileConfigUrl: `${server.fileCenter}/v1beta/uploadFileConfig.htm`,
    fileStsUrl: `/api/oss/fileSts`,
    getStsParams: (params) => {
      return {
        ...params,
        fileCenterVersion: '20001',
        subSystem: 2,
        fileOwnerType: 2,
        picRadio: '',
        playTime: '',
        // plugNo: uni.$u.defaultSetting.plugNo,
      };
    },
  },
};

// 获取文件配置
export const getUploadFileConfig = (file) => {
  const { uploadFileConfigUrl } = config['2.0'];
  return new Promise((resolve, reject) => {
    // const request = uni.$u.http;
    try {
      request
        .post(
          `/api/oss/uploadFileConfig?${qs.stringify({
            subSystem: 2,
          })}`,
        )
        .then((res) => {
          if (res) {
            Object.assign(file, {
              fileConfig: res,
            });
            resolve();
          }
        })
        .catch((err) => {
          reject(err);
          console.log(err, 'err');
        });
    } catch (error) {
      console.log(error, 'error');
    }
  });
};

// 获取fileSts
export const fileSts = (file, uploadConfig) => {
  const { fileStsUrl, getStsParams } = config['2.0'];
  return new Promise((resolve, reject) => {
    let data = getStsParams(file);
    data = {
      ...data,
      storageProviderName: getUploadFileConfigName({
        file,
        uploadConfig,
        reject,
      }),
    };
    if (data.storageProviderName) {
      // 多平台
      Object.assign(file, {
        fileConfig: file.fileConfig.configs[data.storageProviderName],
      });
    }
    const header = {};
    let formdata = '';

    // #ifndef H5
    const boundary = `----FooBar${new Date().getTime()}`;
    formdata += formdataFun(data, boundary);
    Object.assign(header, {
      Accept: 'application/json',
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
    });
    // #endif
    // const request = uni.$u.http;
    // request
    //   .post(fileStsUrl, formdata || data, header)
    try {
      request
        .post(`/api/oss/fileSts?${qs.stringify(data)}`)
        .then((res) => {
          if (res.errorMsg) {
            file.error = '上传出错';
            file.blob = '';
          } else {
            const { fileList, policyInf } = res?.data ?? {};
            // #ifdef App-Plus
            // wgt不秒传
            file.isUploaded = false;
            // #endif
            // #ifdef App-Plus
            if (fileList[0].fileKey) {
              file.isUploaded = true;
            }
            // #endif
            // uni.$u.log.l("fileList:" + fileList)
            // uni.$u.log.l("fileUuid:" + fileList[0].fileUuid)

            file.fileList = fileList;
            file.fileUuid = fileList[0].fileUuid;
            file.uploadUrl = fileList[0].uploadUrl || '';
            file.policyInf = policyInf;
            file.fileKey = `${file.fileUuid}.${file.fileIcon}`;
            Object.assign(file, {
              fileBody: {
                fileKey: file.fileKey,
                fileSize: file.fileSize,
                fileMd5: file.MD5,
                fileId: fileList[0].fileUuid,
              },
            });
            resolve();
          }
        })
        .catch((err) => {
          console.log(err, 'err');
          reject(err);
        });
    } catch (error) {
      console.log(error, 'error');
    }
  });
};

// 上传oss
export const uploadToOss = (file) => {
  const { fileConfig } = file;
  // 上传oss
  const policy = computePolicy();
  const signature = computeSignature(file.policyInf.accessKeySecret, policy);
  const callback = Base64.encode(
    JSON.stringify({
      callbackUrl: fileConfig?.data?.callBackUrl,
      callbackBody: JSON.stringify(file.fileBody),
      callbackBodyType: 'application/json',
    }),
  );
  console.log(
    `https://${fileConfig?.data?.bucket}.${
      fileConfig?.data?.endPoint?.split('//')[1]
    }`,
    'url',
  );
  console.log(fileConfig, 'fileConfig');
  return new Promise((resolve) => {
    console.log({
      url: `https://${fileConfig?.data?.bucket}.${
        fileConfig?.data?.endPoint?.split('//')[1]
      }`, // 开发者服务器的URL。  https://pmbimcloud-test-company.oss-cn-hangzhou.aliyuncs.com
      filePath: file.filePath,
      // #ifdef MP-DINGTALK
      fileName: 'file',
      // #endif
      // #ifndef MP-DINGTALK
      name: 'file',
      // #endif
      formData: {
        key: file.fileKey,
        policy,
        OSSAccessKeyId: file.policyInf.accessKeyId,
        signature,
        callback,
        'x-oss-security-token': file.policyInf.securityToken, // 使用STS签名时必传。
      },
    });
    try {
      uni.uploadFile({
        url: `https://${fileConfig?.data?.bucket}.${
          fileConfig?.data?.endPoint?.split('//')[1]
        }`, // 开发者服务器的URL。  https://pmbimcloud-test-company.oss-cn-hangzhou.aliyuncs.com
        filePath: file.filePath,
        // #ifdef MP-DINGTALK
        fileName: 'file',
        // #endif
        // #ifndef MP-DINGTALK
        name: 'file',
        // #endif
        formData: {
          key: file.fileKey,
          policy,
          OSSAccessKeyId: file.policyInf.accessKeyId,
          signature,
          callback,
          'x-oss-security-token': file.policyInf.securityToken, // 使用STS签名时必传。
        },
        success: (res) => {
          console.log(res, 'res');
          resolve(file);
        },
        fail: (err) => {
          console.log(err, 'err');
        },
      });
    } catch (error) {
      console.log(error, 'error');
    }
  });
};

// uploadTominio
export const uploadToMinio = (data) => {
  const { file, srcFile } = data;
  return new Promise(async (resolve, reject) => {
    // #ifdef H5
    // 文件上传
    await uploadFetchFile({
      ...file,
      uploadUrl: file.uploadUrl,
      method: 'PUT',
      body: srcFile,
      json: false,
    });
    resolve(file);
    // #endif
    // #ifdef APP-PLUS
    uni.sendNativeEvent('upload', { paths: file.filePath }, (arr) => {
      const [item] = arr;
      if (item) {
        // mylog(`appplus download robot ${taskId} zip success`, filePath)
        resolve(file);
      } else {
        reject(new Error(`upload error`));
      }
    });
    return;
    // #endif
  });
};

// 华为云
export const uploadHuaWeiYun = async (data) => {
  const { file, srcFile, fileMime } = data;
  return new Promise(async (resolve, reject) => {
    // #ifdef H5
    await uploadFetchFile({
      ...file,
      uploadUrl: file.uploadUrl,
      method: 'PUT',
      headers: {
        'Content-Type': fileMime,
      },
      body: srcFile,
      json: false,
    });
    resolve(data);
    // #endif
    // #ifndef H5
    uploadRequestFile(
      {
        ...file,
        uploadUrl: file.uploadUrl,
        method: 'PUT',
        headers: {
          'Content-Type': fileMime,
        },
        body: srcFile,
        json: false,
      },
      resolve,
      reject,
    );
    // #endif
  });
};

// 本地上传
export const uploadToStatic = (file) => {
  uni.uploadFile({
    url: `${file.policyInf.endPoint}/front/upload`, // 开发者服务器的URL。
    filePath: file.filePath,
    // #ifdef MP-DINGTALK
    fileName: 'file',
    // #endif
    // #ifndef MP-DINGTALK
    name: 'file',
    // #endif
    formData: {
      fileKey: file.fileKey,
      fileId: file.fileUuid,
      dir: file.policyInf.bucket,
    },
    success: (res) => {
      uni.$u.log.l('success', res);
    },
    fail: (err) => {
      uni.$u.log.l(err);
    },
  });
};

// 招商蛇口文件上传
export const uploadToMerchants = async (file) => {
  const { policyInf, filePath, fileName, uploadUrl } = file;
  const formData = new FormData();
  const obFile = await uni.$u.miniProgram.objectUrlToFile(filePath, fileName);
  formData.append('file', obFile);
  // 文件上传
  const result = await uploadFetchFile({
    ...file,
    uploadUrl: `${policyInf?.endPoint}/cos-upload/v1/uploadFile`,
    method: 'POST',
    headers: {
      Authorization: uploadUrl,
    },
    body: formData,
  });
  const { fileUuid } = result;

  // 绑定文件id
  await uni.$u.http.post(`${server.fileCenter}/v1beta/confirmFile`, {
    fileUuid,
    resourceId: result?.body?.resourceId,
  });

  return result;
};

// h5上传 (uploadFile 无法指定name)
const uploadFetchFile = (data) => {
  const { uploadUrl, headers, method, body, json } = data;
  return new Promise((resolve) => {
    fetch(uploadUrl, {
      method,
      headers,
      body,
    })
      .then((response) => {
        return json ? response.json() : response.text();
      })
      .then((res) => {
        resolve({
          ...data,
          ...res,
        });
      })
      .catch((error) => {
        uni.$u.log.l('error', error);
      });
  });
};

// 系统uni.uploadFile 不支持put上传
const uploadRequestFile = (data, resolve) => {
  const { file, uploadUrl, headers, method, body, json } = data;
  const fs = uni.getFileSystemManager();
  fs.readFile({
    filePath: file.filePath,
    position: 0,
    success(res) {
      uni.request({
        url: uploadUrl,
        data: res.data,
        header: headers,
        method,
        success: (res) => {
          uni.$u.log.l('res', res);
          resolve(file);
        },
        fail: (error) => {
          reject(error);
          uni.$u.log.l('error', error);
        },
      });
    },
    fail(res) {
      reject(res);
      console.error(res);
    },
  });
};

// 获取多平台的上传平台
const getUploadFileConfigName = (data) => {
  const { file, uploadConfig, reject } = data;
  let name;
  if (uploadConfig && uni.$u.defaultSetting.fileVersion === '2.0') {
    if (
      uploadConfig.force &&
      !file.fileConfig?.configs[uploadConfig.uploadType]
    ) {
      return reject('文件上传不支持此平台');
    }
    const item =
      file.fileConfig?.configs &&
      file.fileConfig?.configs[uploadConfig.uploadType];
    if (item) {
      name = uploadConfig.uploadType;
    }
  }
  return name || file.fileConfig?.defaultConfigName || '';
};

// 传入表单上传的policy字段，对policy进行Base64编码
const computePolicy = () => {
  const date = new Date();
  date.setHours(date.getHours() + 1);
  const policyText = {
    expiration: date.toISOString(), // 设置policy过期时间。
    conditions: [
      // 限制上传大小。
      ['content-length-range', 0, 1024 * 1024 * 1024 * 1024 * 1024],
    ],
  };
  // const Base64 = uni.$u.base64;
  return Base64.encode(JSON.stringify(policyText));
};

// 签名计算
const computeSignature = (accessKeySecret, canonicalString) => {
  // const CryptoJS = uni.$u.crypto;
  // 利用SK对Base64编码后的policy结果进行HMAC-SHA1签名计算
  const bytes = CryptoJS.HmacSHA1(canonicalString, accessKeySecret);
  // 对计算结果进行Base64编码，得到最终的签名信息
  return CryptoJS.enc.Base64.stringify(bytes);
};

// oss上传配置
const formdataFun = (params = {}, boundary = '') => {
  let result = '';
  for (let i in params) {
    result += `\r\n--${boundary}`;
    result += `\r\nContent-Disposition: form-data; name="${i}"`;
    result += `\r\n`;
    result += `\r\n${params[i]}`;
  }
  if (result) {
    result += `\r\n--${boundary}`;
  }
  return result;
};
