import store from '../../../store';

export function isNumber(val) {
  return /^[0-9]+.?[0-9]*$/.test(val);
}

const { UnitTypeList } = store.state.common;
export function getUnit(unitID) {
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

export default {
  isNumber,
  getUnit,
  handleSelect,
  delay,
  animateScroll,
  extname,
  getDateFormat2Date,
};
