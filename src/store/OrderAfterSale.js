/* eslint-disable object-curly-newline */
import api from '@/api';
import ClassType from './CommonClassType';

export default {
  namespaced: true,
  state: {
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

    PlaceDate: {
      First: '2022-04-13T02:01:34.806Z',
      Second: '2022-04-13T02:01:34.806Z',
    },
    ID: '00000000-0000-0000-0000-000000000000',
    FieldType: 1,
    Page: 0,
    KeyWords: 'string',
    PageSize: 0,
    Order: {
      First: 'string',
      Second: 0,
    },

  },
  getters: {
  },
  mutations: {

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
    clearCondition4ServiceAfterSaleList(state) {
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
    },

  },
  actions: {
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
  },
};
