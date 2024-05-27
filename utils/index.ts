export const generateRandomId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export function getUrlParam(name: string) {
  //构造一个含有目标参数的正则表达式对象
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  //匹配目标参数
  let r = window.location.search.substr(1).match(reg);
  //返回参数值，如果没有匹配到，则返回null
  if (r != null) return unescape(r[2]);
  return null;
}

/**
 * mpt-material-sdk warning4Url 接口
 */
export const getWarning4Url = () => {
  // const origin = window.location.origin;
  // /**
  //  * 本地和测试环境
  //  */
  // const regex = /https:\/\/zz-test\d+\.pinming\.org/;
  // if (origin.includes('localhost')) {
  //   return 'https://zz-test05.pinming.org/material-client-management/api/openapi/weigh/data/warning4';
  // }
  // if (regex.test(origin)) {
  //   return 'https://zz-test05.pinming.org/material-client-management/api/openapi/weigh/data/warning4';
  // }
  // /**
  //  * 预发环境
  //  */
  // if (origin === 'https://zzpre.pinming.org/') {
  //   return 'https://weighmaster.pinming.org/material-client-management/api/openapi/weigh/data/warning4';
  // }
  // /**
  //  * 正式环境
  //  */
  // return 'https://weighmaster.pinming.cn/material-client-management/api/openapi/weigh/data/warning4';
  return 'https://zz-test05.pinming.org/material-client-management/api/openapi/weigh/data/warning4';
};
