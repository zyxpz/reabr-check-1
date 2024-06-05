// request.js

// 基础URL配置，根据实际情况修改
const BASE_URL = '';

// 创建一个通用的请求函数
const request = (url, method, data, header = {}) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + url,
      method: method,
      data: data,
      header: {
        'Content-Type': 'application/json',
        Authentication:
          'qbf65PbCUW3CeVZRkOSLuKw6GWDkbpFTNIObD5CeZsmyovVQE5Pi0hfiHAKuZSfFiWPUX9FJquQhV5iQKu30SIRWcpu1qx4yxK6lJaGnoi39AtP2C2mta3SPe1zlOzdu',
        ...header,
      },
      success: (res) => {
        console.log(res, 'res');
        if (res.data.success) {
          resolve(res.data);
        } else {
          uni.showToast({
            title: res?.data?.errMessage,
            icon: 'none',
          });
          reject(res);
        }
      },
      fail: (err) => {
        console.log(err, 'err');
        uni.showToast({
          title: err?.data?.errMessage,
        });
        reject(err);
      },
    });
  });
};

// 封装的GET请求
const get = (url, data = {}, header = {}) => {
  return request(url, 'GET', data, header);
};

// 封装的POST请求
const post = (url, data = {}, header = {}) => {
  return request(url, 'POST', data, header);
};

// 封装的PUT请求
const put = (url, data = {}, header = {}) => {
  return request(url, 'PUT', data, header);
};

// 封装的DELETE请求
const del = (url, data = {}, header = {}) => {
  return request(url, 'DELETE', data, header);
};

// 导出模块
export default {
  get,
  post,
  put,
  delete: del,
};
