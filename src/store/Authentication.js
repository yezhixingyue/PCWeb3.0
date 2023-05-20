import api from '@/api';
import store from '@/store';

export default {
  namespaced: true,
  state: {
    // 企业认证相关
    authCompanyInfo: null,
  },
  getters: {},
  mutations: {
    // 企业认证信息
    setAuthCompanyInfo(state, value) {
      state.authCompanyInfo = value;
    },
    // 企业认证信息修改
    changeAuthCompanyInfo(state, { key, value }) {
      state.authCompanyInfo[key] = value;
    },
  },
  actions: {
    async getAuthCompanyInfo({ commit }) {
      // if (!store.state.common.customerInfo) {
      //   store.dispatch('common/getCustomerDetail');
      // }
      const { CustomerID } = store.state.common.customerInfo;
      const res = await api.getAuthenticationInfo(CustomerID);
      if (res.data.Status === 1000) {
        commit('setAuthCompanyInfo', res.data.Data);
      }
    },
  },
};
