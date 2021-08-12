/* eslint-disable object-curly-newline */
import api from '@/api';
import ClassType from './CommonClassType';
// import { Message } from 'element-ui';
// import massage from '@/assets/js/utils/message';
// import asyncNonCurrentFunc from '../assets/js/utils/asyncNonCurrentFunc';

export default {
  namespaced: true,
  state: {
    /** 账单页面相关
    ---------------------------------------- */
    FundBillList: [], // --------- 账单信息列表
    FundBillListNumber: 0,
    condition4FundBillList: {
      Date: {
        First: '',
        Second: '',
      },
      DateType: 'today',
      Page: 1,
      PageSize: 12,
      Type: '',
    },
    /** 售后单页面相关
    ---------------------------------------- */
    ServiceAfterSaleList: [], // --------- 售后信息列表
    ServiceAfterSaleListNumber: 0,
    condition4ServiceAfterSaleList: {
      Date: {
        First: '',
        Second: '',
      },
      DateType: 'today',
      Page: 1,
      PageSize: 12,
      FieldType: 3,
    },
    editFeedbackData: null, // 问题反馈编辑信息
    RejectReasonList: [], // 问题原因列表
    needFetchListData: true, // 是否需要获取反馈列表信息
    listData: null, // 反馈列表信息数据
    listDataNumber: 0,
    /** 售后申请单页面相关（客户反馈页面）
    ---------------------------------------- */
    condition4FeedbackList: {
      Page: 1,
      PageSize: 12,
      QuestionID: '',
      Status: '',
      Date: {
        First: '',
        Second: '',
      },
      DateType: 'today',
      KeyWords: '',
    },
    FeedbackList: [],
    FeedbackDataNumber: 0,
  },
  getters: {
  },
  mutations: {
    /** 设置账单信息列表
    ---------------------------------------- */
    setFundBillList(state, [list, num]) {
      state.FundBillList = list;
      if (num || num === 0) state.FundBillListNumber = num;
    },
    setCondition4FundBillList(state, [[key1, key2], value]) {
      if (key2) state.condition4FundBillList[key1][key2] = value;
      else state.condition4FundBillList[key1] = value;
    },
    setDate4ConditionDate(state, key) {
      ClassType.setDate(state[key]);
    },
    /** 设置售后单信息列表
    ---------------------------------------- */
    setServiceAfterSaleList(state, [list, num]) {
      state.ServiceAfterSaleList = list;
      if (num || num === 0) state.ServiceAfterSaleListNumber = num;
    },
    setCondition4ServiceAfterSaleList(state, [[key1, key2], value]) {
      if (key2) state.condition4ServiceAfterSaleList[key1][key2] = value;
      else state.condition4ServiceAfterSaleList[key1] = value;
    },
    // setDate4ConditionDate(state, key) {
    //   ClassType.setDate(state[key]);
    // },
    setEditFeedbackData(state, data) { // 设置问题反馈编辑信息
      state.editFeedbackData = data;
    },
    setRejectReasonList(state, list) { // 设置问题原因列表
      state.RejectReasonList = list;
    },
    setNeedFetchListData(state, bool) { // 是否需要获取反馈列表信息
      state.needFetchListData = bool;
    },
    setListData(state, data) { // 反馈列表信息数据
      state.listData = data;
    },
    setListDataNumber(state, num) { // 反馈列表信息数据条码数
      state.listDataNumber = num;
    },
    /* 注销及登录状态清理
    -------------------------------*/
    clearStateForNewCustomer(state) {
      state.FundBillList = [];
      state.FundBillListNumber = 0;
      state.condition4FundBillList = {
        Date: {
          First: '',
          Second: '',
        },
        DateType: 'today',
        Page: 1,
        PageSize: 12,
        Type: '',
      };
      state.ServiceAfterSaleList = [];
      state.ServiceAfterSaleListNumber = 0;
      state.condition4ServiceAfterSaleList = {
        Date: {
          First: '',
          Second: '',
        },
        DateType: 'today',
        Page: 1,
        PageSize: 12,
        FieldType: 3,
      };
      state.editFeedbackData = null;
      state.condition4FeedbackList = {
        Page: 1,
        PageSize: 12,
        QuestionID: '',
        Status: '',
        Date: {
          First: '',
          Second: '',
        },
        DateType: 'today',
        KeyWords: '',
      };
      state.FeedbackList = [];
      state.FeedbackDataNumber = 0;
    },
    /** 售后申请单页面相关（客户反馈页面）
    ---------------------------------------- */
    setFeedbackList(state, [list, count]) {
      state.FeedbackList = list;
      if (count || count === 0) state.FeedbackDataNumber = count;
    },
    setCondition4Feedback(state, [[key1, key2], value]) {
      if (key2) state.condition4FeedbackList[key1][key2] = value;
      else state.condition4FeedbackList[key1] = value;
    },
    clearCondition4Feedback(state) {
      state.condition4FeedbackList = {
        Page: 1,
        PageSize: 12,
        QuestionID: '',
        Status: '',
        Date: {
          First: '',
          Second: '',
        },
        DateType: 'today',
        KeyWords: '',
      };
    },
    setFullCondition4Feedback(state, obj) {
      state.condition4FeedbackList = obj;
    },
    setListItemCancel4Feedback(state, id) {
      if (!id) return;
      const t = state.FeedbackList.find(it => it.ID === id);
      if (t) t.Status = 255;
    },
  },
  actions: {
    /** 账单页面相关
    ---------------------------------------- */
    async getFundBillList({ state, commit }, page = 1) {
      commit('setCondition4FundBillList', [['Page', ''], page]);
      commit('setFundBillList', [[], undefined]);
      commit('setDate4ConditionDate', 'condition4FundBillList');
      const _obj = ClassType.filter(state.condition4FundBillList);
      const res = await api.getCustomerFundBill(_obj);
      if (res.data.Status === 1000) {
        commit('setFundBillList', [res.data.Data, res.data.DataNumber]);
      }
    },
    /** 售后单页面相关
    ---------------------------------------- */
    async getServiceAfterSaleList({ state, commit }, page = 1) {
      commit('setCondition4ServiceAfterSaleList', [['Page', ''], page]);
      commit('setServiceAfterSaleList', [[], undefined]);
      commit('setDate4ConditionDate', 'condition4ServiceAfterSaleList');
      const _obj = ClassType.filter(state.condition4ServiceAfterSaleList);
      if (_obj.Date) {
        _obj.CreateTime = _obj.Date;
        delete _obj.Date;
      }
      const res = await api.getAfterSalesList(_obj);
      if (res.data.Status === 1000) {
        commit('setServiceAfterSaleList', [res.data.Data, res.data.DataNumber]);
      }
    },
    async getRejectReasonList({ state, commit }) { // 获取问题原因列表
      if (state.RejectReasonList.length > 0) return state.RejectReasonList;
      const res = await api.getQuestionList();
      if (res.data.Status === 1000) {
        commit('setRejectReasonList', res.data.Data);
        return res.data.Data;
      }
      return [];
    },
    /** 售后申请单页面相关（客户反馈页面）
    ---------------------------------------- */
    async getListData4Feedback({ state, commit }, page = 1) {
      commit('setCondition4Feedback', [['Page', ''], page]);
      commit('setDate4ConditionDate', 'condition4FeedbackList');
      const _obj = ClassType.filter(state.condition4FeedbackList, true);
      if (_obj.Date) {
        _obj.ApplyTime = _obj.Date;
        delete _obj.Date;
      }
      let key = true;
      // state.dataList = [];
      commit('setFeedbackList', [[]]);
      const res = await api.getAfterSalesApplyList(_obj).catch(() => { key = false; });
      if (key && res.data.Status === 1000) {
        commit('setFeedbackList', [res.data.Data, res.data.DataNumber]);
      }
    },
  },
};
