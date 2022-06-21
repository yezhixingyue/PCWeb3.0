import message from '../../assets/js/utils/message';
import InvoiceMakeupListConditionClass from './InvoiceMakeupListConditionClass';
import InvoiceSearchListConditionClass from './InvoiceSearchListConditionClass';
import { scrollToTop } from '../../assets/js/utils/utils';
import api from '../../api';
import { InvoiceMakeUpStatusEnums, InvoiceStatusEnums } from '../../packages/InvoiceComps/enums';

export default {
  namespaced: true,
  state: {
    loading: false,
    /** 申请开票列表数据相关
    ------------------------------------------ */
    condition4InvoiceMakeupList: new InvoiceMakeupListConditionClass(),
    InvoiceMakeupOrderList: [],
    InvoiceMakeupOrderNumber: 0,
    curCondition4MakeupList: null,
    curCombineResult: null, // 合并开票结果数据
    /** 发票查询列表数据相关
    ------------------------------------------ */
    condition4SearchList: new InvoiceSearchListConditionClass(),
    InvoiceSearchDataList: [],
    InvoiceSearchDataNumber: 0,
    curInvoiceEditData: null,
  },
  getters: {
  },
  mutations: {
    setLoading(state, bool) {
      state.loading = bool;
    },
    setDate4Condition(state, [key, DateLabel]) {
      state[key]._setDate(DateLabel);
      // CommonClassType.setDate(state[key], DateLabel);
    },
    /** 申请开票列表数据相关
    ------------------------------------------ */
    setConditionForInvoiceMakeupList(state, [[key1, key2], value]) {
      if (key2) state.condition4InvoiceMakeupList[key1][key2] = value;
      else state.condition4InvoiceMakeupList[key1] = value;
    },
    clearConditionForInvoiceMakeupList(state) {
      state.condition4InvoiceMakeupList = new InvoiceMakeupListConditionClass(state.condition4InvoiceMakeupList.MakeupStatus);
    },
    setInvoiceMakeupOrderList(state, [data, dataNumber]) {
      state.InvoiceMakeupOrderList = data || [];
      if (typeof dataNumber === 'number') state.InvoiceMakeupOrderNumber = dataNumber;
    },
    setCurCondition4MakeupList(state, data) {
      state.curCondition4MakeupList = data;
    },
    setCurCombineResult(state, data) {
      state.curCombineResult = data;
    },
    /** 发票查询列表数据相关
    ------------------------------------------ */
    setCondition4SearchList(state, [[key1, key2], value]) {
      if (key2) state.condition4SearchList[key1][key2] = value;
      else state.condition4SearchList[key1] = value;
    },
    clearCondition4SearchList(state) {
      state.condition4SearchList = new InvoiceSearchListConditionClass();
    },
    setInvoiceSearchDataList(state, [data, dataNumber]) {
      state.InvoiceSearchDataList = data || [];
      if (typeof dataNumber === 'number') state.InvoiceSearchDataNumber = dataNumber;
    },
    setInvoiceCancel(state, invoiceID) {
      const t = state.InvoiceSearchDataList.find(it => it.InvoiceID === invoiceID);
      if (t) {
        t.InvoiceStatus = InvoiceStatusEnums.canceled.ID;
      }
    },
    setCurInvoiceEditData(state, data) { // 设置当前正在编辑的发票详情数据
      state.curInvoiceEditData = data;
    },
  },
  actions: {
    /** 申请开票列表数据相关
    ------------------------------------------ */
    async getInvoiceMakeupOrderList({ state, commit }, [page, scroll] = [1, false]) {
      commit('setConditionForInvoiceMakeupList', [['Page', ''], page]);
      commit('setDate4Condition', ['condition4InvoiceMakeupList', 'OrderTime']);
      const _obj = state.condition4InvoiceMakeupList._getFilterResult();
      _obj.IsAllowInvoice = _obj.MakeupStatus === InvoiceMakeUpStatusEnums.canMakeup.ID;
      delete _obj.MakeupStatus;
      commit('setLoading', true);
      const resp = await api.getOrderInvoiceList(_obj).catch(() => null);
      commit('setCurCondition4MakeupList', _obj);
      if (resp && resp.data.Status === 1000) {
        commit('setInvoiceMakeupOrderList', [resp.data.Data, resp.data.DataNumber]);
        if (scroll) scrollToTop(40);
      } else {
        commit('setInvoiceMakeupOrderList', [[], undefined]);
      }
      commit('setLoading', false);
    },
    /** 发票查询列表数据相关
    ------------------------------------------ */
    async getInvoiceSearchDataList({ state, commit }, [page, scroll] = [1, false]) {
      commit('setCondition4SearchList', [['Page', ''], page]);
      commit('setDate4Condition', ['condition4SearchList', 'InvoiceApplyTime']);
      const _obj = state.condition4SearchList._getFilterResult();
      commit('setLoading', true);
      const resp = await api.getInvoiceList(_obj).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        commit('setInvoiceSearchDataList', [resp.data.Data, resp.data.DataNumber]);
        if (scroll) scrollToTop(40);
      } else {
        commit('setInvoiceSearchDataList', [[], undefined]);
      }
      commit('setLoading', false);
    },
    async getInvoiceCancel({ commit }, invoiceID) {
      const resp = await api.getInvoiceCancel(invoiceID).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const callBack = () => {
          commit('setInvoiceCancel', invoiceID);
        };
        message.successSingle({ title: '添加成功!', successFunc: callBack, failFunc: callBack });
      }
    },
  },
};
