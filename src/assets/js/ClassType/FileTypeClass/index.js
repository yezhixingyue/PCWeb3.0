import UploadFileByBreakPoint from './UploadFileByBreakPoint';
import { extname } from '../../utils/utils';

const sha1 = require('js-sha1');

/**
 * @description: 处理文件上传相关的方法类
 * @param {*}
 * @return {*}
 */
export default class FileTypeClass {
  /**
   * @description: 解析文件，获取文件唯一标识名称
   * @param {*} file
   * @return {*}
   */
  static getUniqueFileName(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onerror = () => {
        reject(new Error('文件解析失败'));
      };
      reader.onloadend = async () => {
        if (!(reader.result)) return;
        const ext = extname(file.name);
        const _name = `${sha1(reader.result)}.${ext}`; // 文件名称, 文件唯一标识
        resolve(_name);
      };
    });
  }

  static UploadFileByBreakPoint(file, name, onUploadProgressFunc, finalPercentage) {
    return UploadFileByBreakPoint(file, name, onUploadProgressFunc, finalPercentage);
  }
}
