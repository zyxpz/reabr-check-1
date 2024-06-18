import {
  getUploadFileConfig,
  fileSts,
  uploadToOss,
  uploadToMinio,
  uploadHuaWeiYun,
  uploadToStatic,
  uploadToMerchants,
} from './server';
// import { compressImage } from '../compress';
const defaultMd5 = '00000000000000000000000000000000';
import CryptoJS from './cryptoJS';

const fileUtil = {
  /***
   * 获取文件的md5
   * @param file  	自定义file对象
   * @param srcFile	h5的File文件对象
   * @returns {Promise<void>}
   */
  async getFileMd5(file, srcFile) {
    const filePath = file?.filePath;
    // #ifdef H5
    await this.hashFile(srcFile).then((res) => {
      const hexHash = res.md5;
      Object.assign(file, {
        fileMd5: hexHash,
      });
    });
    // #endif

    // #ifdef APP-PLUS
    const resolveLocalFileSystemURL = (filePath) => {
      return new Promise((resolve, reject) => {
        plus.io.requestFileSystem(
          plus.io.PRIVATE_DOC,
          function (fs) {
            plus.io.getFileInfo({
              filePath,
              digestAlgorithm: 'md5',
              success: (res) => {
                resolve(res.digest);
              },
              fail: (err) => {
                console.log(err, 'err');
                resolve('');
              },
            });
          },
          function (e) {
            resolve('');
          },
        );
      });
    };
    const MD5_APP_PLUS = await resolveLocalFileSystemURL(filePath);
    console.log(MD5_APP_PLUS, 'MD5_APP_PLUS');
    Object.assign(file, {
      fileMd5: MD5_APP_PLUS,
    });
    // #endif

    // #ifdef MP
    // #ifdef MP-ALIPAY
    await uni.getFileInfo({
      filePath: filePath,
      success: (res) => {
        //成功的回调
        Object.assign(file, {
          fileSize: res.size,
          fileMd5: res.digest,
        });
      },
    });
    // #endif
    // #ifndef MP-ALIPAY
    const byteData = uni.getFileSystemManager().readFileSync(filePath);
    console.log.l('byteData', byteData);
    const sMD5 = uni.$u.md5;
    let spark = new sMD5.ArrayBuffer();
    spark.append(byteData);
    let hexHash = spark.end(false);
    uni.$u.log.l('hexHash', hexHash);
    Object.assign(file, {
      fileMd5: hexHash,
    });
    // #endif
    // #endif
  },
  /**
   * 用于计算文件的hash值，包括sha256值和md5值
   */
  hashFile(file) {
    /**
     * 使用指定的算法计算hash值
     */
    function hashFileInternal(file, alog) {
      // 指定块的大小，这里设置为20MB,可以根据实际情况进行配置
      const chunkSize = 2 * 1024 * 1024;
      let promise = Promise.resolve();
      // 使用promise来串联hash计算的顺序。因为FileReader是在事件中处理文件内容的，必须要通过某种机制来保证update的顺序是文件正确的顺序
      for (let index = 0; index < file.size; index += chunkSize) {
        promise = promise.then(() =>
          hashBlob(file.slice(index, index + chunkSize)),
        );
      }

      /**
       * 更新文件块的hash值
       */
      function hashBlob(blob) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = ({ target }) => {
            // const CryptoJS = uni.$u.crypto;
            const wordArray = CryptoJS.lib.WordArray.create(target.result);
            // 增量更新计算结果
            alog.update(wordArray);
            resolve();
          };
          reader.readAsArrayBuffer(blob);
        });
      }

      function stringify(wordArray) {
        // Shortcuts
        const words = wordArray.words;
        const sigBytes = wordArray.sigBytes;

        // Convert
        const hexChars = [];
        for (let i = 0; i < sigBytes; i++) {
          const bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
          hexChars.push((bite >>> 4).toString(16));
          hexChars.push((bite & 0x0f).toString(16));
        }

        return hexChars.join('');
      }

      // 使用promise返回最终的计算结果
      return promise.then(() => stringify(alog.finalize()));
    }

    // 同时计算文件的sha256和md5,并使用promise返回
    // const CryptoJS = uni.$u.crypto;
    return Promise.all([
      // hashFileInternal(file, CryptoJS.algo.SHA256.create()),
      hashFileInternal(file, CryptoJS.algo.MD5.create()),
    ]).then(([md5]) => ({
      // sha256,
      md5,
    }));
  },
};

const objectUrlToFile = (blobUrl, fileName, fileMime) => {
  // blobUrl转File对象
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', blobUrl, true);
    xhr.responseType = 'blob';
    xhr.onload = function (e) {
      if (this.status == 200) {
        let blob = this.response;
        let files = new window.File([blob], fileName, {
          type: fileMime || blob.type,
        }); // blob.type 自定义文件名
        resolve(files);
      } else {
        reject(false);
      }
    };
    xhr.send();
  });
};

const upload$ = {
  // 批量上传图片
  async uploadFiles(fileList, config) {
    let list = [];
    let index;
    let { fetchFileDetail } = config || {}; // 兼容ccbim文件上传
    for (index in fileList) {
      let item = fileList[index];
      let { url, newFileName, file } = item;
      // 微信模拟器为 wxLocalResource，真机为weixin://resourceid
      if (
        url.startsWith('weixin://resourceid') ||
        url.startsWith('wxLocalResource')
      ) {
        // 微信 公众号
        const result = await uni.$u.miniProgram?.uploadWechatFile(item, config);
        if (result) {
          const [uuid] = result.uuids || [];
          const [item] = result.files || [];
          if (!fetchFileDetail) {
            list.push(uuid);
          } else {
            list.push({
              uuid,
              fileDetail: {
                ...item,
                fileId: uuid,
                fileSize: item.size,
              },
            });
          }
        }
      } else if (url.startsWith('http') || url.startsWith('wxfile')) {
        // 微信
        let files = await this.uploadsFile({
          filePath: url,
          srcFile: item,
          config,
        });
        if (files.fileUuid) {
          list.push(files.fileUuid);
        }
      } else if (
        url.startsWith('blob') ||
        url.startsWith('file') ||
        url.startsWith('_doc')
      ) {
        if (url.startsWith('blob') || !file) {
          // ios拍照 blob对象没有file
          file = await objectUrlToFile(
            url,
            file ? file.name : `${this.getFileName()}.png`,
          );
          Object.defineProperty(file, 'path', {
            value: url,
            writable: true,
          });
        }

        let files = await this.uploadsFile({
          filePath: file.path,
          newFileName,
          srcFile: file,
          config,
        });
        if (files) {
          if (fetchFileDetail) {
            list.push({
              uuid: files.fileUuid,
              fileDetail: {
                ...files,
                fileId: files.fileUuid,
                name: files.fileName,
                md5: files.fileMd5,
              },
            });
          } else {
            list.push(files.fileUuid);
          }
        }
      } else {
        //如果不是上述协议，那么当作uuid存
        list.push(url);
      }
    }
    return fetchFileDetail ? list : list.join(',');
  },
  // 上传文件
  async uploadsFile(data) {
    let {
      filePath,
      fileSize,
      newFileName,
      srcFile,
      config,
      compress = { compress: true },
    } = data;
    fileSize = fileSize || srcFile.size;
    // 文件类型
    //截取path 后面的唯一id作为临时名字
    let fileName = filePath.substr(filePath.lastIndexOf('/') + 1);
    //如果临时name 没有后缀拼接; 文件blob不能加后缀，会找不到文件，造成上传失败
    if (fileName.indexOf('.') == -1) {
      // app选择图片没有 srcFile.name
      fileName = srcFile.name || `${this.getFileName()}.png`;
    }

    const fileIcon = fileName.substr(fileName.lastIndexOf('.') + 1);

    const [fileType, fileMime] = this.getFileType(fileName);

    if (compress.compress) {
      // #ifdef H5
      // const result = await compressImage(filePath, srcFile, fileMime);
      // filePath = result[0];
      // fileSize = result[1].size;
      // srcFile = result[1];
      // uni.$u.log.l('after compress', filePath);
      // #endif
    }
    const file = {
      fileName: newFileName || fileName,
      fileIcon,
      fileSize,
      fileType,
      fileMime,
      filePath,
    };

    // #ifdef App-Plus
    Object.assign(file, {
      fileMd5: defaultMd5,
    });
    // #endif
    // #ifndef App-Plus
    await fileUtil.getFileMd5(file, srcFile);
    // #endif
    if (!file.fileMd5) {
      return {};
    }
    // 上传文件
    await getUploadFileConfig(file);
    await fileSts(file, config);
    // 是否已经上传
    if (file.isUploaded) {
      file.success = true;
      return file;
    } else {
      // uni.$u.log.l('policyInf', file.policyInf);
      if (file.policyInf.ossType === 3 || file.policyInf.ossType === -2) {
        // minio || H3C
        return this.uploadMinio(file, srcFile, fileMime);
      } else if (file.policyInf.ossType === 4) {
        // huawei
        return uploadHuaWeiYun({ file, srcFile, fileMime });
      } else if (file.policyInf.ossType === -1) {
        // 招商蛇口
        return uploadToMerchants(file);
      } else {
        return this.uploadOSS(file);
      }
    }
  },
  // 上传文件[uploadsFile] - 弃用
  async upload(file, config) {
    return await this.uploadFile(
      file.url || file.path,
      file.size,
      file,
      config,
    );
  },
  // 上传文件[uploadsFile] - 弃用
  async uploadFile(
    filePath,
    fileSize,
    srcFile,
    config,
    // 兼容以前代码，默认开启压缩
    compress = { compress: true },
  ) {
    const result = await this.uploadsFile({
      filePath,
      fileSize,
      srcFile,
      config,
      compress,
    });
    return result || {};
  },

  initUpload(file) {
    // 先上传到本地
    if (file.policyInf.ossType === 2) {
      this.uploadStatic(file);
    } else {
      this.uploadOSS(file);
    }
  },
  async uploadMinio(file, srcFile, fileMime) {
    // 上传到minio
    return uploadToMinio({ file, srcFile, fileMime });
  },
  async uploadOSS(file) {
    // 上传到oss
    return uploadToOss(file);
  },
  async uploadStatic(file) {
    // 上传本地服务器
    return uploadToStatic(file);
  },
  getFileType(name) {
    // 获取文件类型和格式
    let fType;
    let fMine;
    const fileIcon = name.substr(name.lastIndexOf('.') + 1);
    fType = 1;
    fMine = `image/${fileIcon || 'png'}`;
    // if (uni.$u.util.isImage(name)) {
    //   fType = 1;
    //   fMine = `image/${fileIcon || 'png'}`;
    // } else if (uni.$u.util.isVideo(name)) {
    //   fType = 3;
    //   fMine = 'audio/mpeg';
    // } else {
    //   fType = 4;
    //   fMine = fileIcon;
    // }
    return [fType, fMine];
  },
  getFileName() {
    const randomNum = Math.floor(
      Math.random() * (900001 - 100000 + 1) + 100000,
    ); // 生成范围在100000到900001之间的随机数
    return (
      uni.$u.timeFormat(new Date().getTime(), 'yyyyMMddHHmmssSSS') +
      String(randomNum).padStart(6, '0')
    ); // 将随机数转为字符串并添加前导零直到长度达到6位
  },
};
export default upload$;
