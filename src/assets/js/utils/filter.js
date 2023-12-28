import Vue from 'vue';
import store from '@/store';

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
  if (status === 253) return '已取消';
  return status;
});

// 订单状态 -- 包裹列表专用
const { OrderStatusList4PackageList } = store.state.common;
Vue.filter('formatStatus4PackageList', status => {
  if (!status && status !== 0) return '';
  if (status === 10) return '未付款';
  const arr = OrderStatusList4PackageList.find(item => item.value === status);
  if (arr) return arr.label.trim();
  if (status === 253) return '已取消';
  return status;
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

Vue.filter('formatNumber', num => +((+num).toFixed(2)));

export default {
};
