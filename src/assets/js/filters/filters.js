// import Vue from 'vue';
// // import store from '@/store';

// Vue.filter('numToFixed2', num => {
//   if (!num && num !== 0) return '';
//   return num.toFixed(2);
// });

// Vue.filter('formatDate', (date) => (date ? date.split('.')[0].slice(0, -3).replace('T', ' ') : ''));

// const { OrderStatusList } = store.state.orderModule;
// Vue.filter('formatStatus', (status) => {
//   if (!status && status !== 0) return '';
//   if (status === 10) return '待付款';
//   const arr = OrderStatusList.find((item) => item.ID === status);
//   if (arr) return arr.name.trim();
//   return '';
// });

// const { OrderStatusList2Transport } = store.state.common;
// Vue.filter('formatTransportStatus', (status) => {
//   if (!status && status !== 0) return '';
//   if (status === 10) return '待付款';
//   const arr = OrderStatusList2Transport.find((item) => item.ID === status);
//   if (arr) return arr.name.trim();
//   return '';
// });

// /**
//  * 促销活动 - 活动状态转换
//  */
// const { PromoteStatusList } = store.state.common;
// Vue.filter('formatPromoteStatus', status => {
//   if (!status && status !== 0) return '';
//   const arr = PromoteStatusList.find((item) => item.ID === status);
//   if (arr) return arr.name.trim();
//   return '';
// });

// /**
//  * 促销活动 - 活动商品名称转换
//  */
// Vue.filter('formatPromoteProductList', ProductList => {
// //  // console.log(ProductList);
//   if (!ProductList || ProductList.length === 0) return '';
//   const _textArr = [];
//   ProductList.forEach(product => {
//     product.LimitList.forEach(limit => _textArr.push(limit.ProductName));
//   });
//   const _text = _textArr.join('、');
//   return _text;
// });

// /**
//  * 促销活动 - 获取用户类型
//  */
// Vue.filter('formatPromoteCustomerType', list => {
//   const _arr = list.map(it => it.Name);
//   return _arr.filter(it => it).join('、');
// });

// /**
//  * 促销活动 -- 活动用户等级
//  */
// Vue.filter('formatPromoteCustomerGrade', list => {
//   const _arr = list.map(it => it.Name);
//   return _arr.join('、');
// });

// /**
//  * 促销活动 -- 活动下单类型
//  */
// const { orderCreateTypeList } = store.state.common;
// Vue.filter('formatPromoteOrderType', list => {
//   const _list = list.map(it => orderCreateTypeList.find(type => type.ID === it.ID).name);
//   return _list.join('、');
// });

// /**
//  * 优惠券 -- 优惠券发放状态  ...mapState('common', ['CouponProvideStatusList', 'CouponUseStatusList']),
//  */
// const { CouponProvideStatusList } = store.state.common;
// Vue.filter('formatProvideStatus', ProvideStatus => {
//   const _t = CouponProvideStatusList.find(_it => _it.ID === ProvideStatus);
//   return _t.name;
// });

// /**
//  * 优惠券 -- 优惠券使用状态  ...mapState('common', ['CouponProvideStatusList', 'CouponUseStatusList']),
//  */
// const { CouponUseStatusList } = store.state.common;
// Vue.filter('formatUseStatus', UseStatus => {
//   const _t = CouponUseStatusList.find(_it => _it.ID === UseStatus);
//   return _t.name;
// });

// /**
//  * 转换长类型时间格式：   从 2020-07-24T23:59:59.997  转换为  2020-07-24  23:59:59
//  */
// Vue.filter('format2LangTypeDate', date => {
//   if (!date) return '';
//   const _arr = date.split('T');
//   const [t1, t2s] = _arr;
//   const t2 = t2s.split('.')[0];
//   return `${t1} ${t2}`;
// });

// /**
//  * 转换中长类型时间格式：   从 2020-07-24T23:59:59.997  转换为  2020-07-24  23:59
//  */
// Vue.filter('format2MiddleLangTypeDate', date => {
//   if (!date) return '';
//   const _arr = date.split('T');
//   const [t1, t2s] = _arr;
//   const t2 = t2s.split('.')[0].slice(0, -3);
//   return `${t1}  ${t2}`;
// });

// /**
//  * 优惠券 -- 优惠券码状态  ...mapState('common', ['CouponCodeStatusList']),
//  */
// const { CouponCodeStatusList } = store.state.common;
// Vue.filter('formatCouponCordStatus', CordStatus => {
//   const _t = CouponCodeStatusList.find(_it => _it.ID === CordStatus);
//   if (!_t) return '';
//   return _t.name;
// });

// /**
//  * 优惠券 -- 优惠券码生成方式  ...mapState('common', ['CouponGenerateTypeList']),
//  */
// const { CouponGenerateTypeList } = store.state.common;
// Vue.filter('formatGenerateType', GenerateType => {
//   const _t = CouponGenerateTypeList.find(_it => _it.ID === GenerateType);
//   return _t.name;
// });

// /**
//  * 客户余额流水类型
//  */
// const { FundBillBalanceTypeList } = store.state.common;
// Vue.filter('formatFundBillBalanceType', Type => {
//   const _t = FundBillBalanceTypeList.find(_it => _it.ID === Type);
//   if (_t) return _t.name;
//   return '';
// });

// /**
//  * 客户余额流水方式
//  */
// const { FundBillBalanceCurrencyList } = store.state.common;
// Vue.filter('formatFundBillBalanceCurrency', Currency => {
//   const _t = FundBillBalanceCurrencyList.find(_it => _it.ID === Currency);
//   if (_t) return _t.name;
//   return '';
// });

// /**
//  * 客户订单流水类型
//  */
// const { FundBillOrderTypeList } = store.state.common;
// Vue.filter('formatFundBillOrderType', Type => {
//   const _t = FundBillOrderTypeList.find(_it => _it.ID === Type);
//   if (_t) return _t.name;
//   return '';
// });
// /**
//  * 客户订单流水渠道
//  */
// const { FundBillOrderCurrencyList } = store.state.common;
// Vue.filter('formatFundBillOrderCurrency', Currency => {
//   const _t = FundBillOrderCurrencyList.find(_it => _it.ID === Currency);
//   if (_t) return _t.name;
//   return '';
// });
