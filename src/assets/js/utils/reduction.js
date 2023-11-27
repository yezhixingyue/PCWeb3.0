/**
 * 从原始中还原值到类中；如果有数组类型的属性时，尽量对该属性进行一下单独处理
 *
 * @param {Object} obj 需要改的对象
 * @param {Object} data 原有数据
 * @param {Boolean} force 是否强制赋值
 */
const restoreInitDataByOrigin = (obj, data, force = false) => {
  if (data && Object.prototype.toString.call(data) === '[object Object]' && obj && Object.prototype.toString.call(obj) === '[object Object]') {
    const _obj = obj;
    Object.keys(data).forEach(key => {
      if (Object.prototype.hasOwnProperty.call(_obj, key)) {
        if (data[key] && Object.prototype.toString.call(data[key]) === '[object Object]') {
          restoreInitDataByOrigin(obj[key], data[key], force);
        } else if (Array.isArray(data[key])) {
          _obj[key] = JSON.parse(JSON.stringify(data[key]));
        } else if (data[key] || data[key] === 0 || data[key] === false || force) {
          _obj[key] = data[key];
        }
      }
    });
  }
};

export default restoreInitDataByOrigin;
