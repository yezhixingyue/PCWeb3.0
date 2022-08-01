import anime from 'animejs/lib/anime.es';
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

export function animateScroll(start, end, callback, handleAnimateEnd, duration = 300) {
  let num = start;
  const tick = 16; // 每隔16毫秒完成一次变化
  const total = duration;
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
  return b.toLowerCase();
}
/**
 * 转换时间格式
 * @param {*} date
 */
export function getDateFormat2Date(date) {
  return date ? date.split('T')[0] : '';
}

/**
 * @description: 给一个值，判断该值是否为数字类型，返回布尔值结果 但isInteger值为true时则判断是否为整数类型 为true则为数字类型
 * @param {*} val
 * @return {*}
 */
export const getValueIsOrNotNumber = (val, isInteger) => {
  const pointStartNumberReg = /^\.\d+$/;
  const pointEndReg = /\w+\.$/;
  if (!val && val !== 0) return false;
  if (pointStartNumberReg.test(val) || pointEndReg.test(val)) return false;
  const _val = typeof val === 'number' ? val : +val;
  let _bool = !Number.isNaN(_val);
  if (_bool && isInteger) _bool = Number.isInteger(_val);
  return _bool;
};

/**
 * @description: 把数字组成的数组字符串拆分开为数组
 * @param {*} valueList
 * @return {*}
 */
export const getNumberValueList = (valueList) => {
  const reg = /\s|,|，/;
  return valueList.split(reg).filter(it => it && getValueIsOrNotNumber(it)).map(it => `${+it}`);
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

/**
   * @description: 转换十以内的阿拉伯数字为中文数字
   * @param {*}
   * @return {*}
   */
export const transformNumToChindNum = (num) => {
  const str = '一二三四五六七八九十';
  if (getValueIsOrNotNumber(num, true) && num < str.length && num >= 0) return str[num];
  return num;
};

/**
 * 判断数组中是否存在重复项
 *
 * @param {*} list
 */
export const getIsOrNotHasRepeatItemInArray = list => {
  if (!Array.isArray(list) || list.length < 2) return false;
  const len1 = list.length;
  const len2 = [...new Set(list)].length;
  return len1 > len2;
};

export const getNameFromListByIDs = (ids, list, defaultKeys = { label: 'Name', value: 'ID' }) => {
  if (typeof ids === 'string' || typeof ids === 'number') { // 单个Name模式， 返回单个ID
    const t = list.find(it => it[defaultKeys.value] === ids);
    return t ? t[defaultKeys.label] : '';
  }
  if (Array.isArray(ids)) { // 传递进来的是Name列表模式，同样返回ID组成的列表
    const arr = ids.map(ID => list.find(it => it[defaultKeys.value] === ID)).filter(it => it).map(it => it[defaultKeys.label]);
    return arr.length > 0 ? arr : '';
  }
  return '';
};

/**
 *
 *
 * @param {*} dom 判断的目标元素
 * @param {number} [topDis=130] 页面顶部被占用的高度（吊顶高度） 需要减去该高度
 * @param {number} [bottomDis=0] 页面底部被占用的高度
 * @param {*} complete 动画完成后的回调函数
 */
export const handleScrollAfterGetPriceFailed = (dom, topDis = 130, bottomDis = 0, complete) => {
  if (dom) {
    const { top } = dom.getBoundingClientRect(); // 距离页面顶部的高度
    const { clientHeight } = document.body;
    // 判断元素是否在视野外
    // 两种情况： 1. 元素在可视区上方， 此时 top - topDis < 0  2. 元素在可视区下方， 此时top - (clientHeight - bottomDis) > 0
    if (top - topDis < 0 || top - (clientHeight - bottomDis) > 0) { // 在视野外面
      // 移动页面scrollTop，让目标元素出现在视野中
      const oApp = document.getElementById('app');
      if (oApp) {
        const willToTop = oApp.scrollTop + top - 200 > 0 ? oApp.scrollTop + top - 200 : 0;
        anime({
          targets: oApp,
          scrollTop: willToTop,
          duration: 400,
          easing: 'easeInOutSine',
          complete() {
            console.log(0);
            if (complete) complete();
          },
        });
      }
    }
  }
};

let oApp;
export const scrollToTop = (top = 0) => {
  if (!oApp) {
    oApp = document.getElementById('app');
  }
  if (oApp) {
    setTimeout(() => {
      oApp.scrollTop = top;
    }, 0);
  }
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
  transformNumToChindNum,
  getIsOrNotHasRepeatItemInArray,
  getNameFromListByIDs,
  handleScrollAfterGetPriceFailed,
  scrollToTop,
};
