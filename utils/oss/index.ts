// @ts-nocheck
import OSS from 'ali-oss';
import { fileSts, uploadFileConfig } from './service';
import {
  base64UrlToBlob,
  checkUpload,
  computeMD5,
  filterFile,
  getFileIcon,
  getFileMine,
  getFileName,
  getFileSize,
  getFileType,
} from './file';

/**
 * antd 自定义OSS上传
 * @param file 文件
 * @param subSystem 上传方 1：CCBIM 2：公司内部 3 第三方  默认 公司内部
 * @param fileOwnerType  上传人 1：个人 2：企业   默认 企业
 * @param minFileSize  小文件通过分片上传会概率出现上传方式失败  所以要根据文件大小改变上传方式 默认 50 * 10 * 100 * 1024
 * @param partSize  分片的大小 默认 50 * 100 * 1024
 * @param parallel  分片次数 默认 20
 * @param accept 过滤上传的文件
 * @param blob 上次Blob
 * @param isSTS 自定义后缀
 * @param computeMD5 是否打开MD5验证
 * @param onUploadBefore 触发上传之前
 * @param onUploadAfter 触发上传之后
 * @param onProgress 上传过程中
 * @param onMD5Progress 计算MD5的过程
 * @param onSuccess 上传完成的回调
 */
interface IParameters {
  file: File;
  /** 自定义获取配置服务端 */
  urlPrefix?: string;
  /** 是否gboss */
  gboss?: boolean;
  /** 直接传base64 */
  base64?: string;
  /** 直接传base64, 格式 */
  base64Type?: string;
  /** 自定义文件格式 */
  suffix?: string;
  blobFile?: Blob;
  minFileSize?: number;
  subSystem?: number;
  partSize?: number;
  parallel?: number;
  fileOwnerType?: number;
  accept?: string[];
  /** 是否打开MD5验证*/
  computeMD5?: boolean;
  onUploadBefore?: () => void;
  onUploadAfter?: (fileUuid: string, sourceFile: any) => void;
  onProgress?: (progress: number) => void;
  onMD5Progress?: (progress: number) => void;
  onSuccess?: (response: any) => void;
  onError?: () => void;
}

interface IUploadFileConfig {
  bucket: string;
  callBackUrl: string;
  endPoint: string;
}

interface policyInf {
  accessKeyId: string;
  accessKeySecret: string;
  bucket: string;
  endPoint: string;
  expire: string;
  securityToken: string;
  ossType: number;
}

interface IFile {
  addUser: string;
  coId: number;
  fileKey: string | null;
  fileMd5: string;
  fileName: string;
  fileSize: number;
  fileUuid: string;
  mId: number | null;
  optId: number | null;
  pjId: number | null;
  uploadKey: string;
  uploadUrl: string;
}

interface IFileStsApi {
  fileList: IFile[];
  policyInf: policyInf;
}

export interface FileInterface {
  uid: string;
  name: string;
  size: number;
  type: string;
  fileUuid?: string;
  url?: string;
  [key: string]: any;
}

const Upload = async ({
  urlPrefix,
  gboss,
  file,
  minFileSize = 50 * 10 * 100 * 1024,
  partSize = 50 * 100 * 1024,
  parallel = 20,
  subSystem = 2,
  fileOwnerType = 2,
  accept = [],
  base64 = '',
  base64Type = 'image/png',
  suffix = '',
  blobFile,
  onMD5Progress,
  onUploadBefore,
  onProgress,
  onSuccess,
  onUploadAfter,
  onError,
}: IParameters) => {
  // 初始化阿里云
  const initOSS = () => {
    const { policyInf } = fileStsApi;
    const { bucket } = fileConfig;
    const { accessKeyId, accessKeySecret, securityToken } = policyInf;
    let region = 'oss-cn-hangzhou';
    if (policyInf.endPoint) {
      const regExp = new RegExp(/http[s]?:\/\/(.*?)\.aliyuncs/);
      const policyInfValue = policyInf.endPoint.match(regExp);
      if (policyInfValue) {
        region = policyInfValue[1];
      }
    }

    return new OSS({
      region,
      accessKeyId,
      accessKeySecret,
      bucket,
      stsToken: securityToken,
      secure: true,
      timeout: 180000000,
    });
  };

  // 分片上传
  const partUploadOSS = () => {
    return initOSS().multipartUpload(fileKey, file, {
      progress: (p) => {
        onProgress && onProgress(p * 100);
      },
      parallel,
      partSize,
      callback: getOSSCallBack(),
    });
  };

  // 通过put方式上传
  const uploadPutOSS = () => {
    return initOSS().put(fileKey, file, {
      callback: getOSSCallBack(),
    });
  };

  // 通过put方式上传base6图片
  const putBase = () => {
    return initOSS().put(fileKey, base64UrlToBlob(base64, base64Type), {
      callback: getOSSCallBack(),
    });
  };
  const putBlob = () => {
    return initOSS().put(fileKey, blobFile, {
      callback: getOSSCallBack(),
    });
  };

  // 通过MINIO方式上传
  const uploadMINIO = () => {
    return fetch(uploadUrl, {
      method: 'PUT',
      body: blobFile || file,
    });
  };
  // 上传到本地
  const uploadStatic = () => {
    return new Promise((resolve) => {
      const formData = new FormData();
      formData.append('fileKey', fileKey);
      formData.append('fileId', fileUuid);
      formData.append('dir', bucket);
      if (base64) {
        formData.append('base64File', base64UrlToBlob(base64, base64Type));
      }
      if (blobFile) {
        formData.append('file', blobFile);
      }
      if (!base64 && !blobFile) {
        formData.append('file', file);
      }
      uploadStaticApi(`${endPoint}/front/upload`, formData).then(() => {
        resolve(true);
      });
    });
  };

  const getOSSCallBack = () => {
    return {
      url: callBackUrl,
      body: JSON.stringify({
        fileKey,
        fileSize: getFileSize(blob, file),
        fileMd5: MD5,
        fileId: fileUuid,
      }),
      contentType: 'application/json',
    };
  };

  const uploadSuccess = () => {
    onSuccess && onSuccess({ fileUuid, fileMd5: MD5 });
    onUploadAfter &&
      onUploadAfter(fileUuid, {
        fileName: getFileName(blob, file, suffix),
        fileType: getFileType(blob, suffix, file),
        fileMd5: MD5,
      });
    return fileUuid;
  };

  if (!base64) {
    await filterFile(accept, suffix, file, onError);
  }
  if (!blobFile) {
    await filterFile(accept, suffix, file, onError);
  }
  onUploadBefore && onUploadBefore();
  const blob = blobFile ? blobFile : base64UrlToBlob(base64, base64Type);
  const MD5 = <string>await computeMD5(blob, file, onMD5Progress);
  const { data: fileConfig } = <IUploadFileConfig>(
    await uploadFileConfig({ subSystem: subSystem }, urlPrefix, gboss)
  );
  const params = gboss
    ? {
        subSystem: subSystem,
        fileOwnerType: fileOwnerType,
        fileMd5: MD5,
        fileMime: getFileMine(blob, file, suffix),
        fileName: getFileName(blob, file, suffix),
        fileSize: getFileSize(blob, file),
        fileType: getFileType(blob, suffix, file),
        picRadio: '',
        playTime: '',
      }
    : {
        subSystem: subSystem,
        fileOwnerType: fileOwnerType,
        fileMd5: MD5,
        fileMime: getFileMine(blob, file, suffix),
        fileName: getFileName(blob, file, suffix),
        fileSize: getFileSize(blob, file),
        fileType: getFileType(blob, suffix, file),
        picRadio: '',
        playTime: '',
      };
  const { data: fileStsApi } = <IFileStsApi>(
    await fileSts(params, urlPrefix, gboss)
  );
  const { callBackUrl } = fileConfig ?? {};
  const {
    fileList: [fileServer],
  } = fileStsApi;
  const { fileUuid, uploadUrl } = fileServer;
  // 已经上传过了，不需要重新上传
  if (checkUpload(fileStsApi)) {
    return uploadSuccess();
  }

  const {
    policyInf: { ossType, bucket, endPoint },
  } = fileStsApi;
  const fileKey = `${fileUuid}.${getFileIcon(
    suffix,
    file,
    blob,
  ).toLowerCase()}`;

  // 上传到本地
  if (ossType === 2) {
    await uploadStatic();
    return uploadSuccess();
  }

  // 通过MINIO方式上传
  if (ossType === 3) {
    await uploadMINIO();
    return uploadSuccess();
  }
  if (base64) {
    await putBase();
    return uploadSuccess();
  }
  if (blobFile) {
    await putBlob();
    return uploadSuccess();
  }
  if (file.size > minFileSize) {
    await partUploadOSS();
  } else {
    await uploadPutOSS();
  }
  return uploadSuccess();
};

export default Upload;
