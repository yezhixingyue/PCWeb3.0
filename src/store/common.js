/* eslint-disable consistent-return */
/* eslint-disable object-curly-newline */
import api from '@/api/index';
import router from '@/router';
import massage from '@/assets/js/utils/message';
import { useCookie } from '@/assets/js/setup';
import Cookie from '@/assets/js/Cookie';

export default {
  namespaced: true,
  state: {
    /** 工艺关系列表信息
    ---------------------------------------- */
    CraftRelationList: [],
    /** 单位类型列表
    ---------------------------------------- */
    UnitTypeList: [
      {
        label: '米',
        value: 11,
      },
      {
        label: '厘米',
        value: 12,
      },
      {
        label: '毫米',
        value: 13,
      },
      {
        label: '专版印张数量',
        value: 15,
      },
      {
        label: '平方米',
        value: 21,
      },
      {
        label: '平方厘米',
        value: 22,
      },
      {
        label: '平方毫米',
        value: 23,
      },
      {
        label: '克',
        value: 31,
      },
      {
        label: '盎司',
        value: 32,
      },
      {
        label: '吨',
        value: 33,
      },
      {
        label: '丝',
        value: 34,
      },
      {
        label: '千克',
        value: 35,
      },
      {
        label: 'P',
        value: 41,
      },
      {
        label: '个',
        value: 42,
      },
      {
        label: '根/条/束',
        value: 43,
      },
      {
        label: '块',
        value: 44,
      },
      {
        label: '令',
        value: 45,
      },
      {
        label: '套',
        value: 46,
      },
      {
        label: '面',
        value: 47,
      },
      {
        label: '款',
        value: 60,
      },
      {
        label: '模位',
        value: 61,
      },
      {
        label: '总量',
        value: 62,
      },
      {
        label: '增量',
        value: 63,
      },
      {
        label: '大版占位单价',
        value: 64,
      },
      {
        label: '盒',
        value: 151,
      },
      {
        label: '张',
        value: 152,
      },
      {
        label: '本',
        value: 153,
      },
      {
        label: '件',
        value: 154,
      },
      {
        label: '副',
        value: 155,
      },
      {
        label: '包',
        value: 156,
      },
      {
        label: '幅',
        value: 157,
      },
      {
        label: '自定义',
        value: 255,
      },
    ],
    /** 配送列表
    ---------------------------------------- */
    ExpressList: [],
    /** 地址列表
    ---------------------------------------- */
    addressList: [],
    /** 客户信息
    ---------------------------------------- */
    customerInfo: null,
    /** 客户子账号列表
    ---------------------------------------- */
    customerAccountList: [],
    /** 客户资金余额
    ---------------------------------------- */
    customerBalance: null,
    /** 客户账单交易类型筛选方式列表
    ---------------------------------------- */
    TransactionTypeList: [
      {
        label: '所有',
        value: '',
      },
      {
        label: '充值',
        value: '11',
      },
      {
        label: '支出',
        value: '21',
      },
    ],
    /** 客户账单交易渠道列表
    ---------------------------------------- */
    formatTransactionCurrencyList: [
      { name: '不限', ID: '' },
      { name: '余额', ID: 1 },
      { name: '支付宝', ID: 3 },
      { name: '微信支付', ID: 4 },
      { name: '物流代收', ID: 5 },
      { name: '退款', ID: 12 },
      { name: '返现', ID: 15 },
      { name: '手动入账', ID: 16 },
      { name: '手动扣款', ID: 23 },
      { name: '支付订单', ID: 24 },
    ],
    /* 订单状态列表
    -------------------------------*/
    OrderStatusList: [
      { label: '不限', value: '' },
      { label: '待分发', value: 20 },
      { label: '已分发', value: 30 },
      { label: '已审稿', value: 40 },
      { label: '拼版中', value: 45 },
      { label: '已拼版', value: 50 },
      { label: '生产中', value: 55 },
      { label: '已生产', value: 60 },
      { label: '已入库', value: 70 },
      { label: '已发货', value: 80 },
      { label: '已完成', value: 200 },
      { label: '已取消', value: 254 },
      { label: '已过期', value: 255 },
      { label: '问题件', value: 35 },
    ],
    /* 订单状态列表 --- 包裹列表专用
    -------------------------------*/
    OrderStatusList4PackageList: [
      { label: '不限', value: '' },
      { label: '待分发', value: 20 },
      { label: '已分发', value: 30 },
      { label: '已审稿', value: 40 },
      { label: '拼版中', value: 45 },
      { label: '已拼版', value: 50 },
      { label: '生产中', value: 55 },
      { label: '未揽收', value: 60 },
      { label: '已入库', value: 70 },
      { label: '已发货', value: 80 },
      { label: '已完成', value: 200 },
      { label: '已取消', value: 254 },
      { label: '已过期', value: 255 },
      { label: '问题件', value: 35 },
    ],
    /* 系统滚动状态 #app元素
    -------------------------------*/
    ScrollInfo: {
      scrollTop: 0,
      scrollHeight: 0,
      offsetHeight: 0,
    },
    /* 售后申请类型（诉求意向）
    -------------------------------*/
    AppealList: [
      { label: '退货退款', value: 0 },
      { label: '补印', value: 1 },
      { label: '减款', value: 2 },
      { label: '其它', value: 255 },
    ],
    /* 售后申请处理进度
    -------------------------------*/
    FeedbackProgress: [
      { label: '已提交', value: 0 },
      { label: '处理中', value: 1 },
      { label: '处理成功', value: 2 },
      { label: '已拒绝', value: 3 },
      { label: '已取消', value: 255 },
    ],
    // initLoading: false, // 初始下单页面 加载初始化信息loading展示
  },
  getters: {
  },
  mutations: {
    /** 设置工艺条件信息
    ---------------------------------------- */
    setCraftRelationList(state, data) {
      state.CraftRelationList = data;
    },
    /** 设置客户信息
    ---------------------------------------- */
    setCustomerInfo(state, [data, bool]) {
      if (!data) {
        state.customerInfo = null;
        return;
      }
      const Address = data.Address.map(it => ({ ...it, isSelected: it.IsDefault }));
      state.customerInfo = { ...data, Address };
      if (!data || !data.FundInfo) return;
      if (bool) {
        const { Amount } = data.FundInfo;
        if ((Amount || Amount === 0) && Amount !== state.customerBalance) state.customerBalance = Amount;
      }
    },
    SetDefaultAddress(state, AddressID) {
      if (!state.customerInfo || !state.customerInfo.Address || state.customerInfo.Address.length === 0) return;
      state.customerInfo.Address.forEach(it => {
        const _it = it;
        _it.IsDefault = false;
      });
      const _t = state.customerInfo.Address.find(it => it.AddressID === AddressID);
      _t.IsDefault = true;
    },
    handleDelAddressOnStore(state, AddressID) {
      if (!state.customerInfo || !state.customerInfo.Address || state.customerInfo.Address.length === 0) return;
      state.customerInfo.Address = state.customerInfo.Address.filter(it => it.AddressID !== AddressID);
    },
    handleAddOrEditAddressOnStore(state, [obj, type]) {
      if (!state.customerInfo || !state.customerInfo.Address || !obj) return;
      if (type === 'add') {
        // state.customerInfo.Address.push(JSON.parse(JSON.stringify(obj)));
        let isSelected = false;
        let IsDefault = false;
        if (state.customerInfo.Address.length === 0) {
          isSelected = true;
          IsDefault = true;
        }
        state.customerInfo.Address.push(JSON.parse(JSON.stringify({ ...obj, isSelected, IsDefault })));
      } else if (type === 'edit') {
        const { AddressID } = obj;
        const _t = state.customerInfo.Address.find(it => it.AddressID === AddressID);
        // eslint-disable-next-line max-len
        const { AddressDetail, Consignee, ExpressArea, CustomerID, HavePosition, IsDefault, Latitude, Longitude, Mobile } = obj;
        _t.Consignee = Consignee;
        _t.Mobile = Mobile;
        _t.CustomerID = CustomerID;
        _t.AddressDetail = AddressDetail;
        _t.HavePosition = HavePosition;
        _t.IsDefault = IsDefault;
        _t.Latitude = Latitude;
        _t.Longitude = Longitude;
        const { RegionalName, RegionalID, CityName, CityID, CountyName, CountyID } = ExpressArea;
        _t.ExpressArea.RegionalName = RegionalName;
        _t.ExpressArea.RegionalID = RegionalID;
        _t.ExpressArea.CityName = CityName;
        _t.ExpressArea.CityID = CityID;
        _t.ExpressArea.CountyName = CountyName;
        _t.ExpressArea.CountyID = CountyID;
      }
      // sessionStorage.setItem('customerInfo', JSON.stringify(state.customerInfo));
    },
    /** 修改客户手机信息  修改手机号后进行该操作
    ---------------------------------------- */
    changeCustomerPhone(state, mobile) {
      if (!state.customerInfo) return;
      state.customerInfo.Account.Mobile = mobile;
      if (!state.customerInfo.Account.IsBranch) state.customerInfo.Mobile = mobile;
      // customerAccountList
      if (state.customerAccountList.length > 0) {
        const _t = state.customerAccountList.find(it => it.AccountID === state.customerInfo.Account.AccountID);
        _t.Mobile = mobile;
      }
    },
    /** 修改客户设置信息  是否允许发送未付款短信提醒
    ---------------------------------------- */
    setCustomerAcceptNotify(state, bool) {
      if (!state.customerInfo) return;
      state.customerInfo.Config.IsAcceptNotify = bool;
    },
    /** 设置客户子账号列表
    ---------------------------------------- */
    setCustomerAccountList(state, data) {
      state.customerAccountList = data;
    },
    /** 设置客户资金余额
    ---------------------------------------- */
    setCustomerBalance(state, balance) {
      state.customerBalance = balance;
    },
    /** 设置配送列表
    ---------------------------------------- */
    setExpressList(state, data) {
      state.ExpressList = data;
    },
    /** 地址列表
    ---------------------------------------- */
    setAddressList(state, data) {
      state.addressList = data;
    },
    /* 注销及登录状态清理
    -------------------------------*/
    clearStateForNewCustomer(state) {
      state.CraftRelationList = [];
      state.customerInfo = null;
      state.customerAccountList = [];
      state.customerBalance = null;
    },
    /* 修改默认选择地址
    -------------------------------*/
    changeSelectedAdd(state, item) {
      state.customerInfo.Address.forEach(it => {
        const _it = it;
        _it.isSelected = false;
      });
      const _t = state.customerInfo.Address.find(it => it.AddressID === item.AddressID);
      _t.isSelected = true;
    },
    /* 设置系统滚动状态 #app元素
    -------------------------------*/
    setScrollInfo(state, { scrollTop, scrollHeight, offsetHeight }) {
      state.ScrollInfo.scrollTop = scrollTop;
      state.ScrollInfo.scrollHeight = scrollHeight;
      state.ScrollInfo.offsetHeight = offsetHeight;
    },
    /* 修改账号基础信息成功后的数据处理方法
    -------------------------------*/
    setCustomerAuthenInfo(state, AuthenInfo4Submit) {
      const { QQ, CustomerName, AllowEdit, AuthenInfo } = AuthenInfo4Submit;
      const { TaxID, LicensePath, CompanyName, SellArea, DetailAddress } = AuthenInfo;
      state.customerInfo.QQ = QQ;
      state.customerInfo.CustomerName = CustomerName;
      state.customerInfo.AllowEdit = AllowEdit;
      state.customerInfo.AuthenInfo.TaxID = TaxID;
      state.customerInfo.AuthenInfo.LicensePath = LicensePath;
      state.customerInfo.AuthenInfo.CompanyName = CompanyName;
      state.customerInfo.AuthenInfo.DetailAddress = DetailAddress;
      state.customerInfo.AuthenInfo.SellArea = { ...SellArea };
      state.customerInfo.AuthStatus = 2;
    },

  },
  actions: {
    async getCraftRelationList({ state, commit }) {
      if (state.CraftRelationList.length > 0) return;
      const res = await api.getCraftRelationList();
      if (res.data.Status === 1000) {
        commit('setCraftRelationList', res.data.Data);
        return true;
      }
      return false;
    },
    async getCustomerDetail({ state, commit }, key = false) { // 获取账号基本信息
      if (state.customerInfo && !key) return;
      if (key) {
        commit('setCustomerInfo', [null, false]);
      } else {
        const sessionCust = useCookie ? Cookie.getCookie('customerInfo') : sessionStorage.getItem('customerInfo');
        if (sessionCust) {
          let user;
          try {
            user = JSON.parse(sessionCust);
          // eslint-disable-next-line no-empty
          } catch (error) {
          }
          if (user) {
            const token = Cookie.getCookie('token');
            if (user.Account.Token === token) {
              commit('setCustomerInfo', [user, false]);
              return;
            }
          }
        }
      }
      const res = await api.getCustomerDetail();
      if (res.data.Status === 1000) {
        commit('setCustomerInfo', [res.data.Data, true]);
        if (useCookie) Cookie.setCookie('customerInfo', JSON.stringify(res.data.Data), 'Session');
        else sessionStorage.setItem('customerInfo', JSON.stringify(res.data.Data));
        if (res.data.Data.AuthStatus !== 2) {
          massage.warnCancelBox({
            title: '账户信息未完善',
            msg: '您尚有资料未完善，无法享受优惠价格',
            cancelButtonText: '忽略',
            confirmButtonText: '去完善资料',
            successFunc: () => {
              router.push({
                path: '/mySetting/account',
                query: { redirect: 'placeOrder' },
              });
            },
          });
        }
        // eslint-disable-next-line consistent-return
        return true;
      }
    },
    async getCustomerFundBalance({ commit }) {
      let key = true;
      const res = await api.getCustomerFundBalance().catch(() => { key = false; });
      if (key && res.data.Status === 1000) {
        commit('setCustomerBalance', res.data.Data);
        return true;
      }
      return false;
    },
    async getExpressList({ state, commit }) {
      if (state.ExpressList.length > 0) return true;
      const _list = sessionStorage.getItem('expressList');
      if (_list) {
        commit('setExpressList', JSON.parse(_list));
        return true;
      }
      const res = await api.getExpressList();
      if (res.data.Status === 1000) {
        commit('setExpressList', res.data.Data);
        sessionStorage.setItem('expressList', JSON.stringify(res.data.Data));
        return true;
      }
      return false;
    },
    async getAddressIDList({ state, commit }, parent = undefined) {
      if (state.addressList.length > 0) return;
      const res = await api.getAddressIDList(parent);
      if (res.data.Status === 1000) {
        commit('setAddressList', res.data.Data);
      }
    },
    async getCustomerAccountList({ state, commit }, key = false) {
      if (state.customerAccountList.length > 0 && !key) return;
      const res = await api.getCustomerAccountList();
      if (res.data.Status === 1000) {
        commit('setCustomerAccountList', res.data.Data);
      }
    },
  },
};
