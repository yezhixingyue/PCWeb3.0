/* eslint-disable consistent-return */
/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
/*
 * @Describe: 产品报价 -- 状态管理仓库
 * @FilePath: /src/store/Quotation/Quotation.js
 */

import api from '@/api/index';
import massage from '@/assets/js/utils/message';
import router from '@/router';
import QuotationClassType from './QuotationClassType';

// eslint-disable-next-line no-unused-vars
// import utils from "@/assets/js/utils";

export default {
  namespaced: true, // 开启命名空间
  state: {
    /* 产品分类相关
    -------------------------------*/
    productClassify: [], // 产品两级类别原始数据
    productNames: [], // 全部产品名称原始数据
    isShowClassifyDia: false, // 报价产品类别弹窗展示状态
    /* 当前选中产品ID及名称及类别
    -------------------------------*/
    curProductID: '',
    curProductName: '',
    curProductClass: null,
    /* 当前选中产品详细信息
    -------------------------------*/
    curProductInfo2Quotation: null,
    /* 获取产品报价请求信息
    -------------------------------*/
    obj2GetProductPrice: { ProductParams: {} },
    /* 获取产品报价结果信息
    -------------------------------*/
    ProductQuotationResult: null,
    /* 下单地址相关信息
    -------------------------------*/
    addressInfo4PlaceOrder: null,
    /* 当前选中优惠券信息
    -------------------------------*/
    selectedCoupon: null,
    /* 当前状态是报价还是下单
    -------------------------------*/
    curSelectStatus: '报价',
    /* 当前预下单文件内容
    -------------------------------*/
    curFileContent: '',
    /* 预下单后获取到的数据信息
    -------------------------------*/
    PreCreateData: null,
    /* 支付二维码信息
    -------------------------------*/
    curPayInfo2Code: null,
    /* 预下单请求数据
    -------------------------------*/
    curReqObj4PreCreate: null,
    /* 控制弹窗3- 支付二维码弹窗显示状态
    -------------------------------*/
    isShow2PayDialog: false,
    /* 初始页面字体
    -------------------------------*/
    initPageText: '',
    /** 当前选中的用于报价的产品
    ---------------------------------------- */
    curProduct: null,
    /** 是否为点击tag标签获取产品报价信息  （ 此时不全清下单报价页面信息 只部分展示loading ）
    ---------------------------------------- */
    isFetchingPartProductData: false,
    ProductDisplayPropertyTypeList: [
      { Name: '元素', ID: 0 },
      { Name: '元素组', ID: 1 },
      { Name: '物料', ID: 3 },
      { Name: '工艺', ID: 4 },
      { Name: '工厂', ID: 5 },
      { Name: '尺寸组', ID: 6 },
    ],
    /** 受到交互影响的属性列表数据
    ---------------------------------------- */
    PropertiesAffectedByInteraction: [],
    curEffectiveControlList: [],
    /** 当前产品正在生效的 需要上传的文件列表
    ---------------------------------------- */
    FileList: [],
    FileTypeList: [],
    isUploading: false,
    RiskWarningTipsObj: { origin: '', tipsList: '' },
    successNum: 0,
    /** 报价、预下单、加入购物车时的忽略风险提示类型列表  传值：IgnoreRiskLevel
    ---------------------------------------- */
    RiskWarningTipsTypes: {
      None: 0, // 不忽略提示 服务器默认为0
      PageTips: 1, // 忽略页面提示（ 加入购物车默认忽略 ）
      All: 2, // 忽略所有提示
    },
  },
  getters: {
    /* 全部产品分类结构树，用于报价目录展示
    -------------------------------*/
    allProductClassify(state) {
      if (
        state.productClassify.length === 0
        || state.productNames.length === 0
      ) {
        return [];
      }
      let level1List = state.productClassify // 挑选第一级分类
        .filter(item => item.Level === 1)
        .map(item => ({ ...item, children: [] }));
      // 设置第二级分类
      level1List.forEach(level1 => {
        const _list = state.productClassify
          .filter(item => item.ParentID === level1.ID)
          .map(item => ({ ...item, children: [] }));
        level1.children = _list;
      });
      // 添加第三级产品内容
      const namesList = process.env.VUE_APP_BASE_URL && process.env.VUE_APP_BASE_URL === 'test-new-product' ? state.productNames : state.productNames.filter(it => it.AllowCustomOrder);
      namesList.forEach(item => {
        const _list = item.ClassifyList.filter(it => it.Type === 2);
        _list.forEach(_it => {
          level1List.forEach(leve1 => {
            if (_it.FirstLevel.ID === leve1.ID) {
              leve1.children.forEach(level2 => {
                if (_it.SecondLevel.ID === level2.ID) {
                  level2.children.push(item);
                }
              });
            }
          });
        });
      });
      // 筛选去除无下属产品的分类
      level1List.forEach(
        level1 => (level1.children = level1.children.filter(
          level2 => level2.children.length > 0,
        )),
      );
      level1List = level1List.filter(_leve1 =>
        // // console.log(_leve1, _leve1.children, _leve1.children.length);
        _leve1.children.length > 0);
      return level1List;
    },
    /* 当前选中产品名称信息，用于报价页头文字展示
    -------------------------------*/
    curProductShowNameInfo(state) {
      if (!state.curProductClass) return [];
      const { FirstLevel, SecondLevel } = state.curProductClass;
      const FirstName = FirstLevel.Name;
      const SecondName = SecondLevel.Name;
      return [FirstName, SecondName, state.curProductName];
    },
    localAllControlList(state) {
      if (!state.curProductInfo2Quotation) return [];
      if ((!Array.isArray(state.curProductInfo2Quotation.ControlList) || state.curProductInfo2Quotation.ControlList.length === 0)
       && (!Array.isArray(state.curProductInfo2Quotation.FileList) || state.curProductInfo2Quotation.FileList.length === 0)) return [];
      const list1 = state.curProductInfo2Quotation.ControlList || [];
      const list2 = state.curProductInfo2Quotation.FileList || [];
      return [...list1, ...list2];
    },
    /* 当前选中产品交互条件列表所需要的涉及到的元素ID列表
    -------------------------------*/
    affectedElementIDsByInteraction(state, getters) {
      if (getters.localAllControlList.length === 0) return [];
      const list = getters.localAllControlList.map(it => {
        const _list = [];
        if (it.Constraint && Array.isArray(it.Constraint.ItemList)) {
          it.Constraint.ItemList.forEach(_it => {
            if (_it.Property && _it.Property.Element && _it.Property.Element.ID) {
              _list.push(_it.Property.Element.ID);
            }
          });
        }
        return _list;
      }).reduce((l1, l2) => [...l1, ...l2], []);
      return [...new Set(list)];
    },
    /* 当前选中产品交互条件列表所需要的涉及到的元素组本身ID列表
    -------------------------------*/
    affectedElementGroupIDsByInteraction(state, getters) {
      if (getters.localAllControlList.length === 0) return [];
      const list = getters.localAllControlList.map(it => {
        const _list = [];
        if (it.Constraint && Array.isArray(it.Constraint.ItemList)) {
          it.Constraint.ItemList.forEach(_it => {
            if (_it.Property && _it.Property.Group && _it.Property.Group.ID) {
              _list.push(_it.Property.Group.ID);
            }
          });
        }
        return _list;
      }).reduce((l1, l2) => [...l1, ...l2], []);
      return [...new Set(list)];
    },
    /* 当前选中产品交互条件列表所需要的涉及到的 工艺ID列表
    -------------------------------*/
    affectedCraftIDsByInteraction(state, getters) {
      if (getters.localAllControlList.length === 0) return [];
      const list = getters.localAllControlList.map(it => {
        const _list = [];
        if (it.Constraint && Array.isArray(it.Constraint.ItemList)) {
          it.Constraint.ItemList.forEach(_it => {
            if (_it.Property && _it.Property.Craft && _it.Property.Craft.ID) {
              _list.push(_it.Property.Craft.ID);
            }
          });
        }
        return _list;
      }).reduce((l1, l2) => [...l1, ...l2], []);
      return [...new Set(list)];
    },
    /* 当前选中产品交互条件列表是否需要触发尺寸 boolean
    -------------------------------*/
    affectedSizeByInteraction(state, getters) {
      if (getters.localAllControlList.length === 0) return false;
      const t = getters.localAllControlList.find(it => {
        if (it.Constraint && Array.isArray(it.Constraint.ItemList)) {
          const t1 = it.Constraint.ItemList.find(_it => {
            if (_it.Property && _it.Property.Type === 6 && !_it.Property.Element) {
              return true;
            }
            return false;
          });
          if (t1) return true;
        }
        return false;
      });
      return !!t;
    },
    /* 当前选中产品交互条件列表是否需要触发物料 boolean
    -------------------------------*/
    affectedMaterialByInteraction(state, getters) {
      if (getters.localAllControlList.length === 0) return false;
      const t = getters.localAllControlList.find(it => {
        if (it.Constraint && Array.isArray(it.Constraint.ItemList)) {
          const t1 = it.Constraint.ItemList.find(_it => {
            if (_it.Property && _it.Property.Type === 5) {
              return true;
            }
            return false;
          });
          if (t1) return true;
        }
        return false;
      });
      return !!t;
    },
  },
  mutations: {
    /* 设置产品分类相关
    -------------------------------*/
    setProductClassify(state, list) {
      state.productClassify = list;
    },
    setProductNames(state, list) {
      state.productNames = list;
    },
    /* 设置报价产品类别弹窗展示状态
    -------------------------------*/
    setIsShowClassifyDia(state, bool) {
      state.isShowClassifyDia = bool;
    },
    /* 设置当前选中的产品、产品ID及名称及类别
    -------------------------------*/
    setCurProductInfo(state, payload) {
      state.curProduct = payload;
      const { ID, ClassifyList, ShowName } = payload; // payload为当前产品所有信息
      const t = ClassifyList.find(it => it.Type === 2);
      state.curProductID = ID;
      state.curProductClass = t || null;
      state.curProductName = ShowName;
    },
    /* 当前选中产品详细信息
    -------------------------------*/
    setCurProductInfo2Quotation(state, data) {
      if (!data && data !== null) return;
      // 处理产品信息
      const curProductInfo2Quotation = QuotationClassType.initOriginData(data);
      const ProductParams = QuotationClassType.init(data);

      state.curProductInfo2Quotation = curProductInfo2Quotation;
      state.obj2GetProductPrice.ProductParams = ProductParams;

      state.initPageText = '';

      const { propList, EffectiveControlList } = QuotationClassType.getPropertiesAffectedByInteraction({ ProductParams, curProductInfo2Quotation, getList: true });
      state.PropertiesAffectedByInteraction = propList;
      state.curEffectiveControlList = EffectiveControlList;

      state.FileList = QuotationClassType.getFileListInEffect(state.obj2GetProductPrice.ProductParams, state.curProductInfo2Quotation)
        .map(it => QuotationClassType.getCreateFileItem(it));
    },
    /* 清除选中产品详细信息
    -------------------------------*/
    clearCurProductInfo2Quotation(state) {
      state.curProductInfo2Quotation = null;
      state.obj2GetProductPrice.ProductParams = {};
      state.ProductQuotationResult = null;
    },
    /* 设置获取产品报价结果信息
    -------------------------------*/
    setProductQuotationResult(state, data) {
      state.ProductQuotationResult = data;
    },
    /* 设置下单地址相关信息
    -------------------------------*/
    setAddressInfo4PlaceOrder(state, data) {
      state.addressInfo4PlaceOrder = data;
    },
    /* 设置当前选中优惠券信息
    -------------------------------*/
    setSelectedCoupon(state, data) {
      state.selectedCoupon = data;
    },
    /* 设置当前状态是报价还是下单
    -------------------------------*/
    setCurSelectStatus(state, msg) {
      state.curSelectStatus = msg;
    },
    /* 设置预下单后获取到的数据信息
    -------------------------------*/
    setPreCreateData(state, data) {
      if (!data) return;
      state.PreCreateData = data;
    },
    /* 设置当前预下单文件内容
    -------------------------------*/
    setCurFileContent(state, data) {
      state.curFileContent = data;
    },
    /* 设置支付二维码信息
    -------------------------------*/
    setCurPayInfo2Code(state, data) {
      state.curPayInfo2Code = data;
    },
    /* 设置预下单请求数据
    -------------------------------*/
    setCurReqObj4PreCreate(state, data) {
      state.curReqObj4PreCreate = data;
    },
    /* 控制弹窗3- 支付二维码弹窗显示状态
    -------------------------------*/
    setIsShow2PayDialog(state, bool) {
      state.isShow2PayDialog = bool;
    },
    /* 设置订单付款成功后的状态
    -------------------------------*/
    setPaySuccessOrderDataStatus(state) {
      // '设置订单付款成功后的状态,清除一些数据的状态值'); ----------------- !!!
      state.PreCreateData = null;

      state.ProductQuotationResult = null;
      state.curFileContent = '';
      state.curPayInfo2Code = null;
      state.curReqObj4PreCreate = null;
      state.selectedCoupon = null;

      const _keepingData = localStorage.getItem('isOrderDataKeeping');
      if (!(_keepingData && _keepingData === 'true')) {
        state.initPageText = '下单成功';
        // state.curProduct = null;
      } else {
        state.successNum += 1;
      }
    },
    /* 下单成功后的状态清理
    -------------------------------*/
    clearStateAfterPlaceOrderSuccess(state) {
      state.selectedCoupon = null;
    },
    /* 设置初始页面字体
    -------------------------------*/
    setInitPageText(state, text) {
      state.initPageText = text;
    },
    /* 注销及登录状态清理
    -------------------------------*/
    clearStateForNewCustomer(state) {
      state.isShowClassifyDia = false;
      state.curProductID = '';
      state.curProductName = '';
      state.curProductClass = null;
      state.curProductInfo2Quotation = null;
      state.obj2GetProductPrice = { ProductParams: {} };
      state.ProductQuotationResult = null;
      state.addressInfo4PlaceOrder = null;
      state.selectedCoupon = null;
      state.curSelectStatus = '报价';
      state.curFileContent = '';
      state.PreCreateData = null;
      state.curPayInfo2Code = null;
      state.curReqObj4PreCreate = null;
      state.isShow2PayDialog = false;
      state.initPageText = '';
      state.curProduct = null;
      state.PropertiesAffectedByInteraction = [];
      state.curEffectiveControlList = [];
      state.RiskWarningTipsObj = { origin: '', tipsList: '' };
      state.FileList = [];
      state.FileTypeList = [];
      state.isUploading = false;
      state.successNum = 0;
    },
    /** 设置是否为点击tag标签获取产品报价信息  （ 此时不全清下单报价页面信息 只部分展示loading ）
    ---------------------------------------- */
    setIsFetchingPartProductData(state, bool) {
      state.isFetchingPartProductData = bool;
    },
    /** 设置产品报价面板信息
    ---------------------------------------- */
    setObj2GetProductPriceProductParams(state, [PartID, PartIndex, Type, ID, Value]) {
      let TargetPart;
      if (!PartID) TargetPart = state.obj2GetProductPrice.ProductParams;
      else {
        const t = state.obj2GetProductPrice.ProductParams.PartList.find(it => it.PartID === PartID);
        // if (t && t.List && t.List[PartIndex]) TargetPart = t[PartIndex]; // ------------------------- ???? 为什么加了这一行代码呢
        // TargetPart = t.List[PartIndex];
        if (t && t.List && t.List[PartIndex]) TargetPart = t.List[PartIndex];
      }
      if (!TargetPart) return;
      let target;
      switch (Type) {
        case '元素':
          target = TargetPart.ElementList.find(it => it.ElementID === ID);
          if (target) {
            const {
              CustomerInputValues, disabledByInteraction, hiddenByInteraction, DisabledValue,
            } = Value;
            target.CustomerInputValues = CustomerInputValues;
            target.disabledByInteraction = disabledByInteraction;
            target.hiddenByInteraction = hiddenByInteraction;
            target.DisabledValue = DisabledValue;
          }
          break;
        case '元素组':
          target = TargetPart.GroupList.find(it => it.GroupID === ID);
          if (target) target.List = Value;
          break;
        case '尺寸组':
          TargetPart.Size = Value;
          break;
        case '物料':
          TargetPart.MaterialID = Value;
          break;
        case '工艺':
          TargetPart.CraftList = Value;
          break;
        default:
          break;
      }
    },
    setObj2GetProductPriceProductParamsGroupItem(state, [PartID, PartIndex, ID, Value]) {
      let TargetPart;
      if (!PartID) TargetPart = state.obj2GetProductPrice.ProductParams;
      else {
        const t = state.obj2GetProductPrice.ProductParams.PartList.find(it => it.PartID === PartID);
        // if (t && t.List && t.List[PartIndex]) TargetPart = t[PartIndex]; // ------------------------- ???? 为什么加了这一行代码呢
        // TargetPart = t.List[PartIndex];
        if (t && t.List && t.List[PartIndex]) TargetPart = t.List[PartIndex];
      }
      if (!TargetPart) return;
      const target = TargetPart.GroupList.find(it => it.GroupID === ID);
      if (target) {
        const [lv1Index, index, temp] = Value;
        target.List[lv1Index].List.splice(index, 1, temp);
      }
    },
    /** 设置产品报价面板信息 -- 部件添加与删除
    ---------------------------------------- */
    setObj2GetProductPriceProductParamsPartChange(state, [PartID, index, item]) {
      const t = state.obj2GetProductPrice.ProductParams.PartList.find(it => it.PartID === PartID);
      if (!t) return;
      if (!item) { // 删除
        t.List.splice(index, 1);
      } else { // 添加
        t.List.push(item);
      }
      const { ProductParams } = state.obj2GetProductPrice;
      const { propList, EffectiveControlList } = QuotationClassType.getPropertiesAffectedByInteraction({ ProductParams, curProductInfo2Quotation: state.curProductInfo2Quotation, getList: true });
      state.PropertiesAffectedByInteraction = propList;
      state.curEffectiveControlList = EffectiveControlList;
      state.RiskWarningTipsObj = { origin: '', tipsList: '' };
      state.FileList = QuotationClassType.setFileListInEffect(state.obj2GetProductPrice.ProductParams, state.curProductInfo2Quotation, state.FileList);
    },
    setPropertiesAffectedByInteraction(state, data) { // 获取受交互影响属性列表
      state.RiskWarningTipsObj = { origin: '', tipsList: '' };
      const { ProductParams } = state.obj2GetProductPrice;
      const target = { ...data, lastEffectiveList: state.curEffectiveControlList };
      const { propList, EffectiveControlList } = QuotationClassType.getPropertiesAffectedByInteraction({ ProductParams, curProductInfo2Quotation: state.curProductInfo2Quotation, target, getList: true });
      state.PropertiesAffectedByInteraction = propList;
      state.curEffectiveControlList = EffectiveControlList;
      state.FileList = QuotationClassType.setFileListInEffect(state.obj2GetProductPrice.ProductParams, state.curProductInfo2Quotation, state.FileList);
    },
    setFileTypeList(state, list) {
      state.FileTypeList = list;
    },
    setIsUploading(state, bool) {
      state.isUploading = bool;
    },
    setRiskWarningTips(state, { origin, tipsList }) { // origin：price | car | place
      state.RiskWarningTipsObj = { origin, tipsList };
    },
    setItemFlieList(state, [list, id]) {
      const t = state.FileList.find(it => it.ID === id);
      if (t) {
        t.FileList = list;
      }
    },
  },
  actions: {
    /* 产品分类相关 getProductClassify getProductLists
    -------------------------------*/
    async getProductClassify({ getters, commit }) {
      if (getters.allProductClassify.length > 0) return;
      const res = await Promise.all([
        api.getProductClassify(),
        api.getProductLists(),
      ]);
      if (res && res.length === 2) {
        const [classifyDate, namesDate] = res;
        if (classifyDate.data.Status === 1000) {
          commit('setProductClassify', classifyDate.data.Data);
        }
        if (namesDate.data.Status === 1000) {
          commit('setProductNames', namesDate.data.Data);
        }
        if (namesDate.data.Status === 1000 && classifyDate.data.Status === 1000) return true;
        return false;
      }
      return false;
    },
    /* 获取产品详情
    -------------------------------*/
    async getProductDetail({ state, commit }, [config = {}, id = ''] = []) {
      const { saveOldData, closeloading } = { saveOldData: false, closeloading: false, ...config };
      if (!saveOldData) commit('clearCurProductInfo2Quotation');
      let isError = false;
      const res = await api.getProductDetail([id || state.curProductID, closeloading]).catch(() => isError = true); // !saveOldData
      if (saveOldData) commit('setIsFetchingPartProductData', false);
      if (isError) {
        if (saveOldData) commit('setIsFetchingPartProductData', false);
        router.push('');
        return false;
      }
      if (res.data.Status !== 1000) {
        router.push('');
        return false;
      }
      commit('setCurProductInfo2Quotation', res.data.Data);
      if (!router.currentRoute.query.id || router.currentRoute.query.id !== (id || state.curProductID)) {
        router.push(`?id=${id || state.curProductID}`);
      }
      return res.data.Data;
    },
    /* 获取文件对应列表
    -------------------------------*/
    async getFileTypeList({ state, commit }) {
      if (state.FileTypeList.length > 0) return;
      const resp = await api.getFileTypeList().catch(() => {});
      if (resp && resp.data.Status === 1000) {
        commit('setFileTypeList', resp.data.Data);
      }
    },
    /* 获取产品报价信息
    -------------------------------*/
    async getProductPrice({ state, commit }) {
      const productData = state.obj2GetProductPrice.ProductParams;
      commit('setCurSelectStatus', '报价');
      const _data = {};
      _data.ProductParams = QuotationClassType.transformToSubmit(productData, state.curProductInfo2Quotation, state.PropertiesAffectedByInteraction);
      commit('setProductQuotationResult', null);
      if (state.addressInfo4PlaceOrder && state.addressInfo4PlaceOrder.Address.Address.Consignee && state.addressInfo4PlaceOrder.Address.Address.Latitude) {
        _data.Address = state.addressInfo4PlaceOrder.Address;
      }
      let key = true;
      const res = await api.getProductPrice(_data).catch(() => { key = false; });
      if (!key || res.data.Status === 7025 || res.data.Status === 8037) return;
      // if (res.data.Status === 6225) return res.data;
      if (res.data.Status !== 1000) return res.data.Message;
      if (!res.data.Data || !res.data.Data.HavePrice) {
        return '暂无报价，请联系客服获取报价信息!';
      } // 可能为null 当需要客服咨询报价
      if (res.data.Data && res.data.Data.RiskList && res.data.Data.RiskList.length > 0) {
        const tipsList = res.data.Data.RiskList.filter(it => it.First === 3).map(it => it.Second);
        if (tipsList.length > 0) commit('setRiskWarningTips', { origin: 'place', tipsList });
        const msgArray = res.data.Data.RiskList.filter(it => it.First === 2).map(it => it.Second);
        if (msgArray.length > 0) massage.warnSingleError({ title: '温馨提示', msg: msgArray });
      }
      commit('setProductQuotationResult', res.data.Data);
      return true;
    },
    delay(storeObj, duration) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, duration);
      });
    },
    /* 下单 - 预下单
    -------------------------------*/
    async getOrderPreCreate({ state, commit, rootState }, { compiledName, fileContent, callBack }) {
      // 1. 配置组合生成请求对象
      const _requestObj = { List: [], OrderType: 2, PayInFull: false };
      const _itemObj = {};
      _itemObj.IsOrder = false; // 预下单false  正式下单 true
      // 2. 编译文件名称 --- 此处需要修改
      if (compiledName) _itemObj.FilePath = compiledName;
      // 3. 补充平台单号
      if (state.addressInfo4PlaceOrder.OutPlate.Second) _itemObj.OutPlate = state.addressInfo4PlaceOrder.OutPlate;
      // 4. 填充收货地址与配送方式
      _itemObj.Address = {};
      _itemObj.Address.Express = state.addressInfo4PlaceOrder.Address.Express;
      if (state.addressInfo4PlaceOrder.Address.AddressID) {
        _itemObj.Address.AddressID = state.addressInfo4PlaceOrder.Address.AddressID;
      } else {
        _itemObj.Address.Address = state.addressInfo4PlaceOrder.Address.Address;
      }
      // 5. 填充文件内容
      _itemObj.Content = fileContent;
      // 6. 记录文件内容与当前接口请求类型
      commit('setCurFileContent', fileContent);
      commit('setCurSelectStatus', '下单');
      // 7. 填充优惠券信息
      if (state.selectedCoupon) _itemObj.Coupon = { CouponCode: state.selectedCoupon.CouponCode };

      // 8. 填充面板信息
      const productData = state.obj2GetProductPrice.ProductParams;
      const ProductParams = QuotationClassType.transformToSubmit(productData, state.curProductInfo2Quotation, state.PropertiesAffectedByInteraction);

      _itemObj.ProductParams = ProductParams;

      if (state.ProductQuotationResult) _itemObj.IgnoreRiskLevel = state.RiskWarningTipsTypes.All;

      // 9. 最终完成提交信息
      _requestObj.List.push(_itemObj);

      // 10. 接口提交
      const res = await api.getOrderPreCreate(_requestObj).catch(() => {});

      // 11. 提交成功后的处理函数
      const successHandler = (PreCreateData, requestObj) => {
        commit('setCurReqObj4PreCreate', _itemObj);
        commit('setPreCreateData', PreCreateData);
        const _b = rootState.common.customerBalance;
        const { FundBalance } = PreCreateData;
        if (FundBalance !== +_b) commit('common/setCustomerBalance', FundBalance, { root: true });
        if (callBack) callBack();
        return [PreCreateData, requestObj];
      };
      if (res && res.data.Status === 1000) {
        return successHandler(res.data.Data, _requestObj);
      }
      if (res && [9166, 9167, 9168, 9169, 9170, 9171, 9172].includes(res.data.Status)) {
        return new Promise((resolve) => {
          massage.warnCancelBox({
            title: res.data.Message,
            msg: '是否 [ 取消使用优惠券 ] 然后下单',
            successFunc: async () => {
              delete _requestObj.List[0].Coupon;
              commit('setSelectedCoupon', null);
              const resp = await api.getOrderPreCreate(_requestObj);
              if (resp.data.Status === 1000) {
                resolve(successHandler(resp.data.Data, _requestObj));
              }
            },
            failFunc: () => {
              resolve(null);
            },
          });
        });
      }
      if (res && res.data.Status === 6225) {
        if (res.data.DisplayMode !== 3) {
          return new Promise((resolve) => {
            massage.warnCancelBox({
              title: '存在风险，是否继续下单?',
              msg: res.data.Message.split('#'),
              confirmButtonText: '继续下单',
              successFunc: async () => {
                _requestObj.List[0].ProductParams.IsIgnoreRisk = true;
                const resp = await api.getOrderPreCreate(_requestObj);
                if (resp.data.Status === 1000) {
                  resolve(successHandler(resp.data.Data, _requestObj));
                }
              },
              failFunc: () => {
                resolve(null);
              },
            });
          });
        }
        commit('setRiskWarningTips', { origin: 'place', tipsList: res.data.Message });
        return res.data;
      }
    },
    /* 下单 - 保存购物车
    -------------------------------*/
    async getQuotationSave2Car({ state, commit, dispatch }, { FileList, fileContent, callBack }) {
      const _itemObj = { IgnoreRiskLevel: state.RiskWarningTipsTypes.PageTips };
      _itemObj.IsOrder = false; // 预下单false  正式下单 true
      if (FileList) _itemObj.FileList = FileList;
      _itemObj.FileHaveUpload = true;
      if (state.addressInfo4PlaceOrder.OutPlate.Second) _itemObj.OutPlate = state.addressInfo4PlaceOrder.OutPlate;
      _itemObj.Address = {};
      _itemObj.Address.Express = state.addressInfo4PlaceOrder.Address.Express;
      if (state.addressInfo4PlaceOrder.Address.AddressID) {
        _itemObj.Address.AddressID = state.addressInfo4PlaceOrder.Address.AddressID;
      } else {
        _itemObj.Address.Address = state.addressInfo4PlaceOrder.Address.Address;
      }
      _itemObj.Content = fileContent;
      if (state.selectedCoupon) _itemObj.Coupon = { CouponCode: state.selectedCoupon.CouponCode };

      const productData = state.obj2GetProductPrice.ProductParams;
      const ProductParams = QuotationClassType.transformToSubmit(productData, state.curProductInfo2Quotation, state.PropertiesAffectedByInteraction);

      _itemObj.ProductParams = ProductParams;

      if (state.ProductQuotationResult) _itemObj.IgnoreRiskLevel = state.RiskWarningTipsTypes.All;

      const res = await api.getQuotationSave(_itemObj).catch(() => {});

      const handleSuccess = async () => { // 处理成功后的函数
        massage.successSingle({ title: '添加成功!', successFunc: callBack });
        const _obj = JSON.parse(JSON.stringify(state.curProductInfo2Quotation));
        commit('setCurProductInfo2Quotation', null);
        commit('setSelectedCoupon', null);
        await dispatch('delay', 10);
        commit('setCurProductInfo2Quotation', _obj);
      };

      const handleError = () => { // 失败处理函数 暂未使用 -- 交由统一错误方式处理
        // massage.failSingleError({ title: '添加购物车失败!', msg: response && response.data.Message ? response.data.Message : '服务器响应失败' });
      };
      if (res && res.data.Status === 1000) {
        if (res.data.Data && res.data.Data.RiskList && res.data.Data.RiskList.length > 0) {
          const msgArray = res.data.Data.RiskList.filter(it => it.First === 2).map(it => it.Second);
          if (msgArray.length > 0) {
            massage.warnCancelBox({
              title: '存在风险，是否继续加入购物车?',
              msg: msgArray,
              confirmButtonText: '继续加入',
              successFunc: async () => {
                _itemObj.IgnoreRiskLevel = state.RiskWarningTipsTypes.All;
                const resp = await api.getQuotationSave(_itemObj).catch(() => {});
                if (resp && resp.data.Status === 1000) handleSuccess();
                else handleError(resp);
              },
            });
          }
        } else {
          handleSuccess();
        }
      } else if (res && [9166, 9167, 9168, 9169, 9170, 9171, 9172].includes(res.data.Status)) {
        massage.warnCancelBox({
          title: res.data.Message,
          msg: '是否 [ 取消使用优惠券 ] 然后加入购物车',
          successFunc: async () => {
            commit('setSelectedCoupon', null);
            delete _itemObj.Coupon;
            const resp = await api.getQuotationSave(_itemObj).catch(() => {});
            if (resp && resp.data.Status === 1000) handleSuccess();
            else handleError(resp);
          },
        });
      } else {
        handleError(res);
      }
    },
    /* 最终下单
    -------------------------------*/
    async getPayResult({ state }, cb) {
      if (!state.curPayInfo2Code || !state.curPayInfo2Code.PayCode) return;
      const res = await api.getPayResult(state.curPayInfo2Code.PayCode);
      if (res.data.Status === 1000) cb(res.data.Data);
    },
    async placeOrderFromPreCreate({ state, commit, rootState }, { temp, cb, isFormOrder, PayInFull, submitSuccessFunc }) {
      const _obj = temp ? { ...temp } : { OrderType: 2, PayInFull, List: [] };
      let item;
      if (!isFormOrder) {
        item = [...rootState.shoppingCar.curShoppingCarDataBeforeFirstPlace];
        _obj.List = item;
      }
      _obj.List = _obj.List.map(it => ({ ...it, IsFileInLan: true, IgnoreRiskLevel: state.RiskWarningTipsTypes.All }));
      const res = await api.CreateOrderFromPreCreate(_obj).catch(() => {});
      if (!res || res.data.Status !== 1000) {
        throw new Error(res && res.data.Message ? res.data.Message : '服务器未响应');
      }
      if (submitSuccessFunc) submitSuccessFunc();
      if (res.data.Data) {
        const _b = rootState.common.customerBalance;
        const { FundBalance } = res.data.Data;
        if (FundBalance !== +_b) commit('common/setCustomerBalance', FundBalance, { root: true });
      }
      commit('setCurPayInfo2Code', res.data.Data);
      commit('clearStateAfterPlaceOrderSuccess');
      // 成功后清除优惠券等信息
      if (!res.data.Data) {
        // commit('setClock2PaySuccess');
        // console.log('placeOrderFromPreCreate');
        massage.successSingle({
          title: '下单成功!',
          successFunc: () => {
            if (isFormOrder) commit('setPaySuccessOrderDataStatus');
            if (cb) cb(); // 清除购物车中一些数据 然后跳转购物车列表页面 该方法目前只在购物车提交时使用
            commit('setIsShow2PayDialog', false);
          },
        });
      }
    },
    async placeOrderFromPrePay({ commit, rootState }, { PayInFull, cb }) {
      const _obj = { OrderType: 2, PayInFull, List: [] };
      // console.log(rootState.unpayList, rootState.unpayList.curUnpayListDataBeforeFirstPlace);
      _obj.List = rootState.unpayList.curUnpayListDataBeforeFirstPlace.map(it => ({ ID: it.OrderID }));
      // // console.log('placeOrderFromPrePay');
      const res = await api.getPaymentOrderCreate(_obj);
      if (res.data.Status !== 1000) {
        throw new Error(res.data.Message);
      }
      if (res.data.Data) {
        const _b = rootState.common.customerBalance;
        const { FundBalance } = res.data.Data;
        if (FundBalance !== +_b) commit('common/setCustomerBalance', FundBalance, { root: true });
      }
      commit('setCurPayInfo2Code', res.data.Data);
      commit('clearStateAfterPlaceOrderSuccess');
      // 成功后清除优惠券等信息
      if (!res.data.Data) {
        massage.successSingle({
          title: '支付成功!',
          successFunc: () => {
            if (cb) cb(); // 清除购物车中一些数据 然后跳转购物车列表页面 该方法目前只在未付款单提交时使用
            commit('setIsShow2PayDialog', false);
          },
        });
      }
    },
  },
};
