/* eslint-disable object-curly-newline */
import api from '@/api';
import { Message } from 'element-ui';
import massage from '@/assets/js/utils/message';
import asyncNonCurrentFunc from '../assets/js/utils/asyncNonCurrentFunc';

export default {
  namespaced: true,
  state: {
    /** 未付款单信息列表
    ---------------------------------------- */
    unpayDataList: [],
    /** 未付款单信息列表条数
    ---------------------------------------- */
    unpayDataNumber: 0,
    /** 当前未付款单订单详情
    ---------------------------------------- */
    curUnpayListDetailData: null,
    /** 当前完成第一步预下单 [前] 的未付款单提交的订单列表数据
    ---------------------------------------- */
    curUnpayListDataBeforeFirstPlace: null,
    /** 当前完成第一步预下单的未付款单订单数据
    ---------------------------------------- */
    curUnpayListData4FirstPlace: null,
  },
  getters: {
  },
  mutations: {
    /** 设置未付款单信息列表
    ---------------------------------------- */
    setUnpayDataList(state, { Data, DataNumber }) {
      state.unpayDataList = Data.map(it => ({ ...it, isCanceled: false, isPaid: false }));
      state.unpayDataNumber = DataNumber;
    },
    /** 设置当前未付款单订单详情
    ---------------------------------------- */
    setCurUnpayListDetailData(state, data) {
      state.curUnpayListDetailData = data;
    },
    /** 获取未付款订单详情信息后，更新当前未付款订单详情中的资金数据
    ---------------------------------------- */
    updateCurUnpayListDetailData(state, data) {
      if (!state.curUnpayListDetailData) return;
      const _temp = { ...state.curUnpayListDetailData };
      _temp.Funds = data.Funds;
      _temp.Weight = data.Weight;
      _temp.ProducePeriod = data.ProducePeriod;
      state.curUnpayListDetailData = _temp;
    },
    /** 当前完成第一步预下单 [前] 的未付款单提交的订单列表数据
    ---------------------------------------- */
    setCurUnpayListDataBeforeFirstPlace(state, list) {
      state.curUnpayListDataBeforeFirstPlace = list;
    },
    /** 设置当前完成第一步预下单的未付款单订单数据
    ---------------------------------------- */
    setCurUnpayListData4FirstPlace(state, data) {
      state.curUnpayListData4FirstPlace = data;
    },
    /** 支付成功后 设置对应订单状态
    ---------------------------------------- */
    setOrderStatusAfterPaid(state, PayCode) {
      const t = state.unpayDataList.find(it => it.PayCode === PayCode);
      if (t) {
        t.isPaid = true;
        t.PackageList.forEach(({ OrderList }) => {
          OrderList.forEach(order => {
            const _order = order;
            _order.Status = 200;
          });
        });
      }
    },
    /** 删除订单后，设置订单状态
    ---------------------------------------- */
    setMultipleOrderDataStatus(state, { allList, failList }) {
      // const allIDList = allList.map(it => it.PayCode);
      const failIDList = failList ? failList.map(it => it.PayCode) : [];
      state.unpayDataList.forEach(it => {
        // FileErrorMessage
        const item = it;
        if (allList.includes(it.PayCode) && !failIDList.includes(it.PayCode)) {
          item.PackageList.forEach(({ OrderList }) => {
            OrderList.forEach(order => {
              const _order = order;
              _order.Status = 254;
            });
          });
          item.isCanceled = true;
        }
        if (allList.includes(it.PayCode) && failIDList.includes(it.PayCode)) {
          item.PackageList.forEach(({ OrderList }) => {
            OrderList.forEach(order => {
              const _order = order;
              _order.Status = '取消失败';
              const _t = failList.find(_it => _it.PayCode === it.PayCode);
              if (_t) _order.Status = _t.Message;
            });
          });
        }
      });
      // const _list = state.unpayDataList;
      // state.unpayDataList = _list.filter(it => it.FileErrorMessage !== '已删除');
      // state.unpayDataNumber = state.unpayDataList.length;
      // if (failList.length === 0)
    },
    /** 清理未付款单订单列表，清除已上传订单
    ---------------------------------------- */
    clearUnpayDataList(state) {
      const _list = state.unpayDataList;
      state.unpayDataList = _list.filter(it => !it.isCanceled && !it.isPaid);
      state.unpayDataNumber = state.unpayDataList.length;
    },
    /* 注销及登录状态清理
    -------------------------------*/
    clearStateForNewCustomer(state) {
      state.unpayDataList = [];
      state.unpayDataNumber = 0;
      state.curUnpayListDetailData = null;
      state.curUnpayListDataBeforeFirstPlace = null;
      state.curUnpayListData4FirstPlace = null;
    },
  },
  actions: {
    /** 获取未付款单信息列表
    ---------------------------------------- */
    async getUnpayList({ commit }) {
      const res = await api.getUnpayList().catch(() => {});
      if (res && res.data.Status === 1000) {
        commit('setUnpayDataList', res.data);
      }
    },
    /** 未付款单提交第一步
    ---------------------------------------- */
    async getOrderPreCreateFromUnpayList({ commit, rootState }, list) {
      // console.log(list);
      const List = list.map(it => ({ ID: it.OrderID }));
      const _obj = { OrderType: 2, PayInFull: false, List };
      const res = await api.getOrderPrePay(_obj);
      if (res.data.Status === 1000) {
        commit('setCurUnpayListData4FirstPlace', res.data.Data);
        commit('setCurUnpayListDataBeforeFirstPlace', list);
        const _b = rootState.common.customerBalance;
        const { FundBalance } = res.data.Data;
        if (FundBalance !== +_b) commit('common/setCustomerBalance', FundBalance, { root: true });
        return true;
      }
      return false;
    },
    /** 删除未付款单订单
    ---------------------------------------- */
    async getOrderCancle({ commit }, [list, isAddPrepare]) {
      if (list.length === 0) Message.error('请选择付款单');

      const _list = list.map(it => ({ PayCode: it, closeTip: true, isAddPrepare }));

      const res = await asyncNonCurrentFunc(api.getUnpayOrderCancle, _list);

      const _res = res.map((it, i) => ({ ...it, PayCode: _list[i] })); // 非并发方式处理批量取消，获取总结果

      const hasWrongList = _res.filter(it => it.data.Status !== 1000);

      if (hasWrongList.length === 0) { // 如果没有取消失败的项则提示成功
        massage.successSingle({ title: '取消成功!' });
        commit('setMultipleOrderDataStatus', { allList: list, failList: [] });
        return true;
      }

      const _errTextList = hasWrongList.map(it => ({
        PayCode: it.PayCode,
        Status: it.data.Status,
        Message: it.data.Message,
      }));
      commit('setMultipleOrderDataStatus', { allList: list, failList: _errTextList }); // 有失败项，把失败项除外的订单进行状态改变

      const _failLen = _errTextList.length;
      const _successLen = list.length - _failLen;
      massage.failSingleError({
        title: '部分付款单取消失败!',
        msg: `${_successLen} 条成功， ${_failLen} 条失败，具体请查看列表订单状态`,
      }); // 弹窗提示出错订单
      return true;
    },
  },
};
