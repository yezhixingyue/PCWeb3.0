/**
 * 从原始中还原值到类中；如果有数组类型的属性时，尽量对该属性进行一下单独处理
 *
 * @param {Object} obj
 * @param {Object} data
 */
const restoreInitDataByOrigin = (obj, data) => {
  if (data && Object.prototype.toString.call(data) === '[object Object]' && obj && Object.prototype.toString.call(obj) === '[object Object]') {
    const _obj = obj;
    Object.keys(data).forEach(key => {
      if (Object.prototype.hasOwnProperty.call(_obj, key)) {
        if (data[key] && Object.prototype.toString.call(data[key]) === '[object Object]') {
          restoreInitDataByOrigin(obj[key], data[key]);
        } else if (Array.isArray(data[key])) {
          _obj[key] = JSON.parse(JSON.stringify(data[key]));
        } else if (data[key] || data[key] === 0 || data[key] === false) {
          _obj[key] = data[key];
        }
      }
    });
  }
};

export default restoreInitDataByOrigin;
