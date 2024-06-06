import request from '@/utils/request';
import qs from 'qs';
export const fileSts = async (params) =>
  request.post(`/api/oss/fileSts?${qs.stringify(params)}`);
export const uploadFileConfig = async (params) =>
  request.post(`/api/oss/uploadFileConfig?${qs.stringify(params)}`);
