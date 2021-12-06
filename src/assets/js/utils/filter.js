import Vue from 'vue';
import store from '@/store';

Vue.filter('format2MiddleLangTypeDate', date => {
  if (!date) return '';
  const _arr = date.split('T');
  const [t1, t2s] = _arr;
  const t2 = t2s.split('.')[0].slice(0, -3);
  return `${t1}  ${t2}`;
});

Vue.filter('numToFixed2', num => {
  // // console.log(num);
  if (!num && num !== 0) return '';
  return num.toFixed(2);
});

/**
 * 客户账号交易类型
 */
const { TransactionTypeList } = store.state.common;
Vue.filter('formatTransactionType', Type => {
  // // console.log(Type);
  const _t = TransactionTypeList.find(_it => +_it.value === +Type);
  // // console.log(TransactionTypeList, _t);
  if (_t) return _t.label;
  return '';
});

const { formatTransactionCurrencyList } = store.state.common;
Vue.filter('formatTransactionCurrency', Currency => {
  const _t = formatTransactionCurrencyList.find(_it => _it.ID === Currency);
  if (_t) return _t.name;
  return '';
});

// 为手机号码中间4位数字转换为*号样式
Vue.filter('formatMobile', mobile => {
  if (!mobile || mobile.length !== 11) return '';
  const _arr = mobile.split('');
  const _arr1 = _arr.map((it, i) => {
    if (i > 2 && i < 7) return '*';
    return it;
  });
  return _arr1.join('');
});

// 订单状态
const { OrderStatusList } = store.state.common;
Vue.filter('formatStatus', (status) => {
  if (!status && status !== 0) return '';
  if (status === 10) return '未付款';
  const arr = OrderStatusList.find((item) => item.value === status);
  if (arr) return arr.label.trim();
  return status;
});

// 订单状态 -- 包裹列表专用
const { OrderStatusList4PackageList } = store.state.common;
Vue.filter('formatStatus4PackageList', status => {
  if (!status && status !== 0) return '';
  if (status === 10) return '未付款';
  const arr = OrderStatusList4PackageList.find(item => item.value === status);
  if (arr) return arr.label.trim();
  return status;
});

Vue.filter('getPayTime', ProducePeriod => {
  if (!ProducePeriod) return '';
  const { LatestPayTime } = ProducePeriod;
  // // console.log(LatestPayTime.split('T')[1].split('+')[0].slice(0, 5));
  return `${LatestPayTime.split('T')[1].split('+')[0].slice(0, 5)}点前支付`;
});

Vue.filter('getDoneTime', (ProducePeriod, showTime = false) => {
  if (!ProducePeriod) return '';
  const { IncludeDiliveryTime, TotalTime } = ProducePeriod;
  const str = IncludeDiliveryTime ? '送达' : '生产完成';
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
  const hour = TotalTime.split('T')[1].split('+')[0].slice(0, 5); // 显示具体时间（时 分 秒）
  // const hour = ''; // 不显示具体时间
  return `预计${timeStr} ${hour} ${str}`;
});

const { AppealList } = store.state.common;
Vue.filter('formatAppealType', status => {
  const t = AppealList.find(it => it.value === status);
  if (t) return t.label;
  return '';
});

const { FeedbackProgress } = store.state.common;
Vue.filter('formatFeedbackProgress', status => {
  const t = FeedbackProgress.find(it => it.value === status);
  if (t) return t.label;
  return '';
});

/**
 * 列举优惠券详情信息
 */
Vue.filter('getCouponList', ({ CouponList }) => {
  if (Array.isArray(CouponList) && CouponList.length > 0) {
    const list = CouponList.map(({ CouponInfo, Number }) => {
      if (CouponInfo && CouponInfo.Data) {
        const { Amount, MinPayAmount } = CouponInfo.Data;
        if (MinPayAmount && Amount && Number) {
          return `满${MinPayAmount}减${Amount}券${Number}张`;
        }
      }
      return '';
    }).filter(it => it);
    return `${list.join('、')}`;
  }
  return '';
});

export const formarProductAmountFunc = data => { // 根据数据返回产品数量与款数展示内容
  if (data) {
    const {
      ProductAmount, Unit, KindCount, HaveKind, HaveNumber,
    } = data;
    let amount = '';
    let kindCount = '';
    if (HaveNumber !== false && ProductAmount) {
      amount = `${ProductAmount}${Unit || '个'}`;
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

/**
 * 根据列表数据获取需要展示的产品分类+产品名称
 */
export const getFullName = data => {
  if (!data) return '';
  const { DisplayName, ProductName, ClassList } = data;
  const Name = DisplayName || ProductName;
  if (!Name) return '';
  if (!ClassList || ClassList.length === 0) return Name;
  const t = ClassList.find(it => it.Type === 2);
  return t && t.FirstLevel && t.FirstLevel.Name ? `${t.FirstLevel.Name} - ${Name}` : Name;
};
Vue.filter('getFullName', getFullName);

export default {
  formarProductAmountFunc,
  getFullName,
};
