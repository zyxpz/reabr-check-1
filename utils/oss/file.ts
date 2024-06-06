import SparkMD5 from 'spark-md5';

export const getFileIcon = (suffix: string, file: File, blob?: Blob) => {
  if (suffix) return suffix;
  if (blob && blob.size > 0) {
    return 'png';
  }
  const { name } = file;
  return name.slice(name.lastIndexOf('.') + 1).toLowerCase();
};

export const filterFile = (
  accept: string[],
  suffix: string,
  file: File,
  onError?: () => void,
) => {
  return new Promise((resolve) => {
    if (accept.length > 0 && !accept.includes(getFileIcon(suffix, file))) {
      uni.showToast({
        title: `请上传${accept.join(',')}格式文件`,
        icon: 'none',
      });
      onError && onError();
    } else {
      resolve(true);
    }
  });
};

export const computeMD5 = (
  blob: Blob,
  file: File,
  onMD5Progress?: (progress: number) => void,
) => {
  return new Promise((resolve) => {
    if (blob.size > 0) {
      computeBaseMD5(resolve, blob);
    } else {
      computeFileMD5(resolve, file, onMD5Progress);
    }
  });
};
const computeFileMD5 = (
  resolve: any,
  file: File,
  onMD5Progress?: (progress: number) => void,
) => {
  const fileReader = new FileReader();
  const blobSlice = File.prototype.slice;
  const sparkChunkSize = 5242880;
  const sparkChunks = Math.ceil(file.size / sparkChunkSize);
  let currentChunk = 0;
  fileReader.onload = (e) => {
    const spark = new SparkMD5.ArrayBuffer();
    onMD5Progress && onMD5Progress(((currentChunk + 1) / sparkChunks) * 100);
    // @ts-ignore
    spark.append(e.target.result);
    currentChunk++;
    if (currentChunk < sparkChunks) {
      loadNext();
    } else {
      resolve(spark.end());
    }
  };
  const loadNext = () => {
    const start = currentChunk * sparkChunkSize;
    const end =
      start + sparkChunkSize >= file.size ? file.size : start + sparkChunkSize;
    fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
  };
  loadNext();
};
const computeBaseMD5 = (resolve: any, blob: Blob) => {
  const fileReader = new FileReader();
  fileReader.readAsArrayBuffer(blob);
  fileReader.onload = (evt: any) => {
    if (evt.target.readyState === FileReader.DONE) {
      const spark = new SparkMD5.ArrayBuffer();
      spark.append(evt.target.result);
      resolve(spark.end());
    }
  };
};

// 检查是否已经上传过
export const checkUpload = (fileStsApi: any): boolean => {
  const { fileList } = fileStsApi;
  return !!fileList[0].fileKey;
};

export const base64UrlToBlob = (base64: string, type) => {
  const bytes = window.atob(base64);
  // 处理异常,将ascii码小于0的转换为大于0
  // const ab = new ArrayBuffer(bytes.length)
  const buffer = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    buffer[i] = bytes.charCodeAt(i);
  }
  return new Blob([buffer.buffer], { type: type });
};

export const getFileMine = (blob: Blob, file: File, suffix: string) => {
  if (blob.size > 0) {
    return blob.type;
  }
  const { type } = file;
  if (type) {
    return type;
  }
  return getFileIcon(suffix, file);
};

export const getFileName = (blob: Blob, file: File, suffix: string) => {
  if (blob.size > 0) {
    return `${Math.random().toString(36).substr(2)}.${
      suffix ? suffix : '.png'
    }`;
  }
  return file.name;
};

export const getFileSize = (blob: Blob, file: File) => {
  if (blob.size > 0) {
    return blob.size;
  }
  return file.size;
};

export const getFileType = (blob: Blob, suffix: string, file: File) => {
  if (blob && blob.size > 0) {
    return 1;
  }
  const name = suffix ? suffix : file.name.toLowerCase();
  if (
    /\.(gif|jpg|jpeg|png|jfif|bmp|tif|tga|exif|fpx|svg|webp|apng)$/.test(name)
  ) {
    return 1;
  }
  if (/\.(wav|flav|ape|alac|mp3|JPaavG|ogg|opus)$/.test(name)) {
    return 2;
  }
  if (
    /\.(mpeg|avi|mov|asf|wmv|nvai|3gp|ra|ram|mkv|flv|f4v|rmvb|webm|mp4)$/.test(
      name,
    )
  ) {
    return 3;
  }
  return 4;
};
