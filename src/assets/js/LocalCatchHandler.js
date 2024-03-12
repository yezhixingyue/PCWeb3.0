export default class LocalCatchHandler {
  /** 从本地缓存中读取数据 */
  static getFieldFromLocalStorage(AccountID, Field) {
    if (!AccountID) return null;

    const str = localStorage.getItem('localCacheDataByMpzj');
    if (str) {
      const obj = JSON.parse(str);
      if (obj && obj[Field]) {
        return obj[Field][AccountID];
      }
    }

    return null;
  }

  /** 向本地缓存中写入数据 */
  static setFieldFromLocalStorage(AccountID, Field, Value) {
    if (!AccountID) return;
    const str = localStorage.getItem('localCacheDataByMpzj');
    const obj = str ? JSON.parse(str) : {};

    if (!obj[Field]) obj[Field] = {};

    obj[Field][AccountID] = Value;

    localStorage.setItem('localCacheDataByMpzj', JSON.stringify(obj));
  }
}
