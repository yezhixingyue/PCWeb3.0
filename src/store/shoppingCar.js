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
    setShoppingDataList(state, { Data, DataNumber }) {
      state.shoppingDataList = Data.filter(it => it.FileHaveUpload);
      state.shoppingDataNumber = DataNumber;
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
        // FileErrorMessage
        const item = it;
        if (allIDList.includes(it.OrderID) && !failIDList.includes(it.OrderID)) item.FileErrorMessage = '已删除';
        if (allIDList.includes(it.OrderID) && failIDList.includes(it.OrderID)) {
          item.FileErrorMessage = '删除失败';
          const _t = failList.find(sub => sub.OrderID === item.OrderID);
          if (_t) item.FileErrorMessage = _t.Message;
        }
      });
      const _list = state.shoppingDataList;
      state.shoppingDataList = _list.filter(it => it.FileErrorMessage !== '已删除');
      state.shoppingDataNumber = state.shoppingDataList.length;
      // if (failList.length === 0)
    },
    /** 清理购物车订单列表，清除已上传订单
    ---------------------------------------- */
    clearShoppingDataList(state) {
      const _list = state.shoppingDataList;
      state.shoppingDataList = _list.filter(it => it.FileErrorMessage !== '订单已提交');
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
      const res = await api.getQuotationList();
      if (res.data.Status === 1000) {
        commit('setShoppingDataList', res.data);
      }
    },
    /** 购物车提交第一步
    ---------------------------------------- */
    async getOrderPreCreateFromShoppingCar({ commit, rootState }, list) {
      const _obj = { OrderType: 2, PayInFull: false, List: list };
      const res = await api.getOrderPreCreate(_obj);
      if (res.data.Status === 1000) {
        commit('setCurShoppingCarData4FirstPlace', res.data.Data);
        commit('setCurShoppingCarDataBeforeFirstPlace', list);
        const _b = rootState.common.customerBalance;
        const { FundBalance } = res.data.Data;
        if (FundBalance !== +_b) commit('common/setCustomerBalance', FundBalance, { root: true });
        return true;
      }
      return false;
    },
    /** 删除购物车订单
    ---------------------------------------- */
    async getQuotationRemove({ commit }, list) {
      if (list.length === 0) Message.error('请选择订单');

      const _list = list.map(it => ({ preOrderID: it.OrderID, closeTip: true }));

      // console.log(_list, list);

      const res = await asyncNonCurrentFunc(api.getQuotationRemove, _list);
      // const res = [];

      const _res = res.map((it, i) => ({ ...it, preOrderID: _list[i].preOrderID })); // 非并发方式处理批量取消，获取总结果

      const hasWrongList = _res.filter(it => it.data.Status !== 1000);

      if (hasWrongList.length === 0) { // 如果没有取消失败的项则提示成功
        massage.successSingle({ title: '删除成功!' });
        commit('setMultipleOrderDataStatus', { allList: list, failList: [] });
        return;
      }

      const _errTextList = hasWrongList.map(it => ({
        OrderID: it.preOrderID,
        Status: it.data.Status,
        Message: it.data.Message,
      }));
      commit('setMultipleOrderDataStatus', { allList: list, failList: _errTextList }); // 有失败项，把失败项除外的订单进行状态改变

      const len = _errTextList.length;
      massage.failSingleError({ title: `${len}条订单取消失败!`, msg: '请查看列表状态' }); // 弹窗提示出错订单
    },
  },
};
