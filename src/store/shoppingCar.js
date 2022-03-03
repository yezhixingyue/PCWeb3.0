/* eslint-disable semi */
/* eslint-disable object-curly-newline */
import api from '@/api';
import { Message } from 'element-ui';
import massage from '@/assets/js/utils/message';
import asyncNonCurrentFunc from '../assets/js/utils/asyncNonCurrentFunc';

export default {
  namespaced: true,
  state: {
    /** 购物车信息列表
    ---------------------------------------- */
    shoppingDataList: [],
    /** 购物车信息列表条数
    ---------------------------------------- */
    shoppingDataNumber: 0,
    /** 当前购物车订单详情
    ---------------------------------------- */
    curShoppingCarDetailData: null,
    /** 当前完成第一步预下单 [前] 的购物车提交的订单列表数据
    ---------------------------------------- */
    curShoppingCarDataBeforeFirstPlace: null,
    /** 当前完成第一步预下单的购物车订单数据
    ---------------------------------------- */
    curShoppingCarData4FirstPlace: null,
  },
  getters: {
  },
  mutations: {
    /** 设置购物车信息列表
    ---------------------------------------- */
    setShoppingDataList(state, { Data }) {
      state.shoppingDataList = Data
        .filter(it => it.FileHaveUpload)
        .map(it => ({ ...it, _isOrder: false, _isPaid: false, isRemoveError: false, _isRemove: false, _removeErrorText: '' }));
      state.shoppingDataNumber = state.shoppingDataList.length;
    },
    /** 设置当前购物车订单详情
    ---------------------------------------- */
    setCurShoppingCarDetailData(state, data) {
      state.curShoppingCarDetailData = data;
    },
    /** 当前完成第一步预下单 [前] 的购物车提交的订单列表数据
    ---------------------------------------- */
    setCurShoppingCarDataBeforeFirstPlace(state, list) {
      state.curShoppingCarDataBeforeFirstPlace = list;
    },
    /** 设置当前完成第一步预下单的购物车订单数据
    ---------------------------------------- */
    setCurShoppingCarData4FirstPlace(state, data) {
      state.curShoppingCarData4FirstPlace = data;
    },
    /** 删除订单后，设置订单状态
    ---------------------------------------- */
    setMultipleOrderDataStatus(state, { allList, failList }) {
      const allIDList = allList.map(it => it.OrderID);
      const failIDList = failList ? failList.map(it => it.OrderID) : [];
      state.shoppingDataList.forEach(it => {
        const item = it;
        if (allIDList.includes(it.OrderID) && !failIDList.includes(it.OrderID)) {
          item.FileErrorMessage = '已删除';
          item._isRemove = true;
        }
        if (allIDList.includes(it.OrderID) && failIDList.includes(it.OrderID)) {
          item.FileErrorMessage = '删除失败';
          item._isRemoveError = true;
          const _t = failList.find(sub => sub.OrderID === item.OrderID);
          if (_t) item._removeErrorText = _t.Message;
        }
      });
      const _removeIDList = state.shoppingDataList.filter(it => it._isRemove).map(it => it.OrderID);
      _removeIDList.forEach(it => {
        const i = state.shoppingDataList.findIndex(_it => _it.OrderID === it);
        if (i > -1) {
          state.shoppingDataList.splice(i, 1);
        }
      });
      state.shoppingDataNumber = state.shoppingDataList.length;
    },
    setShoppingDataStatusAfterSubmit(state, { List, Msg, _isOrder, _isPaid }) {
      const submitedIDs = List.map(it => it.OrderID);// FileErrorMessage
      submitedIDs.forEach(ID => {
        const i = state.shoppingDataList.findIndex(it => it.OrderID === ID);
        if (i > -1) {
          const temp = { ...state.shoppingDataList[i] };
          temp.FileErrorMessage = Msg;
          temp._isOrder = _isOrder;
          temp._isPaid = _isPaid;
          state.shoppingDataList.splice(i, 1, temp);
        }
      });
    },
    /** 清理购物车订单列表，清除已上传订单
    ---------------------------------------- */
    clearShoppingDataList(state, list) {
      const _list = list.map(it => it.OrderID);// FileErrorMessage
      _list.forEach(it => {
        const i = state.shoppingDataList.findIndex(_it => _it.OrderID === it);
        if (i > -1) {
          state.shoppingDataList.splice(i, 1);
        }
      });
      state.shoppingDataNumber = state.shoppingDataList.length;
    },
    /* 注销及登录状态清理
    -------------------------------*/
    clearStateForNewCustomer(state) {
      state.shoppingDataList = [];
      state.shoppingDataNumber = 0;
      state.curShoppingCarDetailData = null;
      state.curShoppingCarDataBeforeFirstPlace = null;
      state.curShoppingCarData4FirstPlace = null;
    },
  },
  actions: {
    /** 获取购物车信息列表
    ---------------------------------------- */
    async getQuotationList({ commit }) {
      const res = await api.getQuotationList().catch(() => null);
      if (res && res.data.Status === 1000) {
        commit('setShoppingDataList', res.data);
      }
    },
    /** 购物车提交第一步
    ---------------------------------------- */
    async getOrderPreCreateFromShoppingCar({ commit }, list) {
      const _obj = { OrderType: 2, PayInFull: false, List: list };
      const res = await api.getOrderPreCreate(_obj).catch(() => null);
      if (res && res.data.Status === 1000) {
        commit('setCurShoppingCarData4FirstPlace', res.data.Data);
        commit('setCurShoppingCarDataBeforeFirstPlace', list);
        const { FundBalance, FundBeanNumber } = res.data.Data;
        const temp = {};
        if (typeof FundBalance === 'number') {
          temp.FundBalance = FundBalance;
        }
        if (typeof FundBeanNumber === 'number') {
          temp.FundBeanNumber = FundBeanNumber;
        }
        commit('common/setCustomerBalance', temp, { root: true });
        return { PreCreateData: res.data.Data, OriginList: list };
      }
      return null;
    },
    /** 删除购物车订单
    ---------------------------------------- */
    async getQuotationRemove({ commit }, list) {
      if (list.length === 0) Message.error('请选择订单');

      const _list = list.map(it => ({ preOrderID: it.OrderID, closeTip: true }));

      const res = await asyncNonCurrentFunc(api.getQuotationRemove, _list);

      const _res = res.map((it, i) => {
        const _it = it || {};
        return ({ ..._it, preOrderID: _list[i].preOrderID });
      }); // 非并发方式处理批量取消，获取总结果

      const hasWrongList = _res.filter(it => !it.data || it.data.Status !== 1000);

      if (hasWrongList.length === 0) { // 如果没有取消失败的项则提示成功
        massage.successSingle({ title: '删除成功!' });
        commit('setMultipleOrderDataStatus', { allList: list, failList: [] });
        return;
      }

      const _errTextList = hasWrongList.map(it => ({
        OrderID: it.preOrderID,
        Message: it.data ? it.data.Message : '订单删除失败',
      }));
      commit('setMultipleOrderDataStatus', { allList: list, failList: _errTextList }); // 有失败项，把失败项除外的订单进行状态改变

      const len = _errTextList.length;
      massage.failSingleError({ title: `共有${len}条订单取消失败!`, msg: '具体请查看列表订单状态' }); // 弹窗提示出错订单
    },
  },
};
