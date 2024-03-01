/* eslint-disable object-curly-newline */
import api from '@/api';
import CommonClassType from './CommonClassType';
// import { Message } from 'element-ui';
// import massage from '@/assets/js/utils/message';
// import asyncNonCurrentFunc from '../assets/js/utils/asyncNonCurrentFunc';

export default {
  namespaced: true,
  state: {
    /** 订单列表页面相关
    ---------------------------------------- */
    OrderList: [], // --------- 订单信息列表
    OrderListNumber: 0,
    showOrderListNumber: 0,
    orderTotalAmount: 0,
    condition4OrderList: {
      Date: {
        First: '',
        Second: '',
      },
      DateType: 'last7Date',
      ProductClass: {
        First: '',
        Second: '',
      },
      ProductID: '',
      Page: 1,
      PageSize: 10,
      Status: '',
      KeyWords: '',
      FieldType: 3,
      OrderBySendTime: false,
    },
    /** 当前订单详情数据
    ---------------------------------------- */
    curOrderDetailData: null,
    /** 是否重新获取当前订单列表数据 (从详情返回不需要)
    ---------------------------------------- */
    shouldGetNewListData: true,
    loading: false,
  },
  getters: {
    /** 合包后的订单列表信息
    ---------------------------------------- */
    // computedOrderlist(state) {
    //   const _list = state.OrderList;
    //   if (_list.length === 0) return [];
    //   const _obj = {};
    //   _list.forEach((it, i) => {
    //     let _PackageID;
    //     if (it.Package) {
    //       _PackageID = it.Package.ID;
    //     } else {
    //       _PackageID = `unPackageOrder${i}`;
    //     }
    //     if (!_obj[_PackageID]) _obj[_PackageID] = [];
    //     _obj[_PackageID].push(it);
    //   });
    //   const list = Object.values(_obj);
    //   return list;
    // },
  },
  mutations: {
    /** 设置订单列表数据
    ---------------------------------------- */
    setOrderList(state, [list, num, count]) {
      state.OrderList = list;
      if (num || num === 0) state.OrderListNumber = num;
      if (count || count === 0) state.showOrderListNumber = count;
    },
    setLoading(state, bool) {
      state.loading = bool;
    },
    setOrderTotalAmount(state, amount) {
      state.orderTotalAmount = amount;
    },
    setCondition4OrderList(state, [[key1, key2], value]) {
      if (key2) state.condition4OrderList[key1][key2] = value;
      else state.condition4OrderList[key1] = value;
    },
    setDate4ConditionDate(state, key) {
      CommonClassType.setDate(state[key]);
    },
    clearCondition4OrderList(state) {
      state.condition4OrderList = {
        Date: {
          First: '',
          Second: '',
        },
        DateType: 'last7Date',
        ProductClass: {
          First: '',
          Second: '',
        },
        ProductID: '',
        Page: 1,
        PageSize: 10,
        Status: '',
        KeyWords: '',
        FieldType: 3,
        OrderBySendTime: false,
      };
    },
    /** 设置当前订单详情数据
    ---------------------------------------- */
    setCurOrderDetailData(state, data) {
      state.curOrderDetailData = data;
    },
    /** 获取订单信息后，更新当前订单详情中的资金数据
    ---------------------------------------- */
    updateOrderDetailData(state, data) {
      if (!state.curOrderDetailData) return;
      const _temp = { ...state.curOrderDetailData };
      _temp.Funds = data.Funds;
      _temp.Weight = data.Weight;
      _temp.ProducePeriod = data.ProducePeriod;
      state.curOrderDetailData = _temp;
    },
    handleCancelOrder(state, [OrderID, ID]) {
      const _t = state.OrderList.find(it => it.ID === ID);
      if (_t) {
        const t = _t.OrderList.find(it => it.OrderID === OrderID);
        if (t) {
          t.Funds.Refund = t.Funds.HavePaid;
          t.Funds.Unpaid = 0;
          t.Status = 254;
          let _Freight = 0;
          const unCancelItem = _t.OrderList.find(_it => _it.OrderID !== OrderID && _it.Status !== 254);
          if (!unCancelItem) {
            _Freight = t.Funds.Freight;
          }
          state.orderTotalAmount = +(state.orderTotalAmount - t.Funds.FinalPrice - _Freight).toFixed(2);
        }
      }
    },
    /** 是否重新获取当前订单列表数据 (从详情返回不需要)
    ---------------------------------------- */
    setShouldGetNewListData(state, bool) {
      state.shouldGetNewListData = bool;
    },
    /* 注销及登录状态清理
    -------------------------------*/
    clearStateForNewCustomer(state) {
      state.OrderList = [];
      state.OrderListNumber = 0;
      state.showOrderListNumber = 0;
      state.condition4OrderList = {
        Date: {
          First: '',
          Second: '',
        },
        DateType: 'last7Date',
        ProductClass: {
          First: '',
          Second: '',
        },
        ProductID: '',
        Page: 1,
        PageSize: 10,
        Status: '',
        KeyWords: '',
        FieldType: 3,
        OrderBySendTime: false,
      };
      state.curOrderDetailData = null;
      state.shouldGetNewListData = true;
    },
  },
  actions: {
    /** 获取订单列表数据
    ---------------------------------------- */
    async getOrderList({ state, commit }, page = 1) {
      if (!state.shouldGetNewListData) {
        commit('setShouldGetNewListData', true);
        return;
      }
      commit('setCondition4OrderList', [['Page', ''], page]);
      commit('setDate4ConditionDate', 'condition4OrderList');
      const _obj = CommonClassType.filter(state.condition4OrderList);
      if (_obj.Date) {
        _obj.PlaceDate = _obj.Date;
        delete _obj.Date;
      }
      commit('setLoading', true);
      const res = await api.getCustomerOrderList(_obj).catch(() => null);
      commit('setLoading', false);
      if (res && res.data.Status === 1000) {
        commit('setOrderList', [res.data.Data, res.data.DataNumber, res.data.VersionCode]);
        if (res.data.Message && page === 1) commit('setOrderTotalAmount', res.data.Message);
      } else {
        commit('setOrderList', [[], undefined]);
      }
    },
  },
};
