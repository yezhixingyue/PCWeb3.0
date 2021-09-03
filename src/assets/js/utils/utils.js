import store from '../../../store';

export function isNumber(val) {
  return /^[0-9]+.?[0-9]*$/.test(val);
}

export function getUnit(unitID) {
  const { UnitTypeList } = store.state.common;
  const _target = UnitTypeList.find(it => it.value === unitID);
  if (!_target) return '';
  return _target.label;
}

export function handleSelect(e) {
  e.target.select();
}

export function delay(duration) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

export function animateScroll(start, end, callback, handleAnimateEnd) {
  let num = start;
  const tick = 16; // 每隔16毫秒完成一次变化
  const total = 300;
  const times = Math.ceil(total / tick); // 变化的次数
  let curTimes = 0;
  const dis = (end - start) / times; // 总距离/次数，每次运动的距离
  const timer = setInterval(() => {
    curTimes += 1;
    num += dis;
    if (curTimes === times) {
      num = end;
      clearInterval(timer);
      if (handleAnimateEnd) handleAnimateEnd();
    }
    callback(num);
  }, tick);
  return timer;
}

export function extname(filename) {
  if (!filename || typeof filename !== 'string') {
    return '未知类型';
  }
  const a = filename.split('').reverse().join('');
  const b = a.substring(0, a.search(/\./)).split('').reverse().join('');
  return b;
}
/**
 * 转换时间格式
 * @param {*} date
 */
export function getDateFormat2Date(date) {
  return date ? date.split('T')[0] : '';
}

// export function MP(ak) {
//   return new Promise(((resolve, reject) => {
//     window.onload = () => {
//       resolve(window.BMap);
//     };
//     if (!window.BMap) {
//       const script = document.createElement('script');
//       script.type = 'text/javascript';
//       script.src = `http://api.map.baidu.com/api?v=1.4.15&ak=${ak}&callback=init`;
//       script.onerror = reject;
//       document.head.appendChild(script);
//     }
//   }));
// }
/**
 * @description: 把数字组成的数组字符串拆分开为数组
 * @param {*} valueList
 * @return {*}
 */
export const getNumberValueList = (valueList) => {
  const reg = /\s|,|，/;
  return valueList.split(reg).filter(it => it);
};

/**
 * @description: 给一个值，判断该值是否为数字类型，返回布尔值结果 但isInteger值为true时则判断是否为整数类型 为true则为数字类型
 * @param {*} val
 * @return {*}
 */
export const getValueIsOrNotNumber = (val, isInteger) => {
  const pointStartNumberReg = /^\.\d+$/;
  if (!val && val !== 0) return false;
  if (pointStartNumberReg.test(val)) return false;
  const _val = typeof val === 'number' ? val : +val;
  let _bool = !Number.isNaN(_val);
  if (_bool && isInteger) _bool = Number.isInteger(_val);
  return _bool;
};

/**
 * @description: 判断两个普通值（非对象、数组）是否相等
 * @param {*}
 * @return {*}
 */
export const isEqual = (a, b) => {
  if (getValueIsOrNotNumber(a) && getValueIsOrNotNumber(b)) return +a === +b;
  return a === b;
};

/**
 * @description: 判断a 是否 大于 b； 如果其中一个不为数字则返回false
 * @param {*}
 * @return {*}
 */
export const isGreatThen = (a, b) => {
  if (getValueIsOrNotNumber(a) && getValueIsOrNotNumber(b)) return +a > +b;
  return false;
};

export const isLessThen = (a, b) => {
  if (getValueIsOrNotNumber(a) && getValueIsOrNotNumber(b)) return +a < +b;
  return false;
};

export default {
  isEqual,
  isGreatThen,
  isLessThen,
  isNumber,
  getUnit,
  handleSelect,
  delay,
  animateScroll,
  extname,
  getDateFormat2Date,
  getNumberValueList,
  getValueIsOrNotNumber,
};
