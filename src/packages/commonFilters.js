import Vue from 'vue';
import { projectType } from '@/assets/js/setup';

Vue.filter('getPayTime', ProducePeriod => {
  if (!ProducePeriod) return '';
  const { LatestPayTime } = ProducePeriod;
  return `${LatestPayTime.split('T')[1].split('+')[0].slice(0, 5)}点前支付`;
});

Vue.filter('getDoneTime', (ProducePeriod, showTime = false) => {
  if (!ProducePeriod) return '';
  const { IncludeDiliveryTime, TotalTime } = ProducePeriod;
  if (!TotalTime) return '';
  const str = IncludeDiliveryTime ? '送达' : '发货';
  const fullDay = TotalTime.split('T')[0];
  const m = fullDay.split('-')[1];
  const d = fullDay.split('-')[2];
  let dayTimeStr = ''; // `${m}月${d}日`
  const _m = `${new Date().getMonth() + 1}`;
  const _d = `${new Date().getDate()}`;
  if (+m === +_m) {
    if (+d === +_d) dayTimeStr = '今天';
    if (d - _d === 1) dayTimeStr = '明天';
    if (d - _d === 2) dayTimeStr = '后天';
  } else if ((_m - m === 1 || (m === '1' && _m === '12')) && (d === '1' || d === '2')) {
    const year = new Date().getFullYear();
    const surMonthDayCount = new Date(year, _m, 0).getDate();
    if (surMonthDayCount - _d === 0) {
      // eslint-disable-next-line no-nested-ternary
      dayTimeStr = d === '1' ? '明天' : (d === '2' ? '后天' : '');
    } else if (surMonthDayCount - _d === 1 && d === '1') {
      dayTimeStr = '后天';
    }
  }
  let timeStr = dayTimeStr || `${m}月${d}日`;
  if (showTime && dayTimeStr) timeStr += ` (${m}月${d}日) `;
  // console.log(showTime, 'showTime', ProducePeriod, `${m}月${d}日`, fullDay);
  // const hour = TotalTime.split('T')[1].split('+')[0].slice(0, 5); // 显示具体时间（时 分 秒）
  const hour = ''; // 不显示具体时间
  return `预计${timeStr}${hour}${str}`;
});

/**
 * 根据列表数据获取需要展示的产品分类+产品名称
 */
export const getFullName = data => {
  if (!data) return '';
  const { DisplayName, ProductName, ClassList } = data;
  const Name = DisplayName || ProductName;
  if (!Name) return '';
  if (!ClassList || ClassList.length === 0) return Name;
  const type = projectType === 'erp' ? 1 : 2;
  const t = ClassList.find(it => it.Type === type);
  return t && t.SecondLevel && t.SecondLevel.Name ? `${t.SecondLevel.Name}-${Name}` : Name;
};
Vue.filter('getFullName', getFullName);

export const formarProductAmountFunc = data => { // 根据数据返回产品数量与款数展示内容
  if (data) {
    const {
      ProductAmount, Unit, KindCount, HaveKind, HaveNumber,
    } = data;
    let amount = '';
    let kindCount = '';
    if (HaveNumber !== false && ProductAmount) {
      amount = `${ProductAmount}${Unit || ' '}`;
    }
    if (HaveKind !== false && KindCount) {
      kindCount = `${KindCount}款`;
    }
    return `${amount}${kindCount}`;
  }
  return '';
};
/**
 * 根据数据返回产品数量与款数展示内容
 */
Vue.filter('formarProductAmount', formarProductAmountFunc);

const formatListItemSize = SizeList => {
  if (!Array.isArray(SizeList) || SizeList.length === 0) return '';
  return SizeList.join('、');
};
Vue.filter('formatListItemSize', formatListItemSize);
Vue.filter('formatListItemCraft', formatListItemSize); // 暂同上共用同一个方法 后续如有需要再分开
Vue.filter('formatListItemMaterial', formatListItemSize); // 暂同上共用同一个方法 后续如有需要再分开

export default {
  getFullName,
  formarProductAmountFunc,
};
