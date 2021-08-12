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
    /* 获取产品报价时的产品信息
    -------------------------------*/
    ProductQuotationDetail: null,
    /* 修改信息以通知工艺组件进行禁用状态的工艺取消
    -------------------------------*/
    watchTarget2DelCraft: 0,
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
    /* 预下单中存放的订单文件
    -------------------------------*/
    orderFile4PreCreateData: null,
    /* 支付二维码信息
    -------------------------------*/
    curPayInfo2Code: null,
    /* 预下单请求数据
    -------------------------------*/
    curReqObj4PreCreate: null,
    /* 控制弹窗3- 支付二维码弹窗显示状态
    -------------------------------*/
    isShow2PayDialog: false,
    /* 下单时 - 支付全款是否为禁用状态  （初始不禁用， 下单成功后禁用， 返回其它页面时重新设置为不禁用）
    -------------------------------*/
    isFullPayoutDisabled: false,
    /* 初始页面字体
    -------------------------------*/
    initPageText: '',
    /* 客户设置快捷方式
    -------------------------------*/
    customerShortCutList: [],
    /** 当前选中的用于报价的产品
    ---------------------------------------- */
    curProduct: null,
    /** 是否为点击tag标签获取产品报价信息  （ 此时不全清下单报价页面信息 只部分展示loading ）
    ---------------------------------------- */
    isFetchingPartProductData: false,
    // /** 报价页面产品右侧边栏推荐信息
    // ---------------------------------------- */
    // productAsideIntroData: null,
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
      namesList.forEach(item => level1List.forEach(leve1 => {
        if (item.ProductClass.First === leve1.ID) {
          leve1.children.forEach(level2 => {
            if (item.ProductClass.Second === level2.ID) {
              level2.children.push(item);
            }
          });
        }
      }));
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
    curProductShowNameInfo(state, getters) {
      if (!state.curProductClass) return [];
      const { First, Second } = state.curProductClass;
      const level1Item = getters.allProductClassify.find(
        item => item.ID === First,
      );
      if (!level1Item) return [];
      const level2Item = level1Item.children.find(item => item.ID === Second);
      return [level1Item.ClassName, level2Item.ClassName, state.curProductName];
    },
    /* 当前选中产品工艺关系列表
    -------------------------------*/
    curCraftRelationList(state, getters, rootVal) {
      const _CraftRelationList = rootVal.common.CraftRelationList;
      if (_CraftRelationList.length === 0) return [];
      // const _ProductClass = state.obj2GetProductPrice.ProductParams.ProductClass;
      // if (!_ProductClass) return [];
      // const _list = _CraftRelationList.filter(item => {
      //   const { First, Second } = item.ProductClass;
      //   return First === _ProductClass.First && Second === _ProductClass.Second;
      // });
      // return _list;
      return _CraftRelationList;
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
    /* 设置当前选中的产品ID及名称及类别
    -------------------------------*/
    setCurProductInfo(state, payload) {
      const { ProductID, ProductClass, ProductName } = payload; // payload为当前产品所有信息
      state.curProductID = ProductID;
      state.curProductClass = ProductClass;
      state.curProductName = ProductName;
    },
    /* 当前选中产品详细信息
    -------------------------------*/
    setCurProductInfo2Quotation(state, data) {
      if (!data && data !== null) return;
      QuotationClassType.handlePropertyRelevanceList(data);
      QuotationClassType.handleCraftConditionList(data);
      state.curProductInfo2Quotation = data;
      state.obj2GetProductPrice.ProductParams = QuotationClassType.init(data);
      state.initPageText = '';
    },
    /* 清除选中产品详细信息
    -------------------------------*/
    clearCurProductInfo2Quotation(state) {
      state.curProductInfo2Quotation = null;
      state.obj2GetProductPrice.ProductParams = {};
      state.ProductQuotationResult = null;
    },
    /* 初始化数据
    ------------------------------- */
    initInfo2Quotation(state) {
      state.curProductInfo2Quotation = null;
      state.obj2GetProductPrice.ProductParams = {};
      state.curProductID = '';
      state.curProductClass = null;
      state.curProductName = '';
    },
    /* 设置获取产品报价请求信息
    -------------------------------*/
    setProductParams(state, [type, value]) {
      state.obj2GetProductPrice.ProductParams[type] = value;
    },
    /* 设置产品报价信息中产品属性列表中值的信息
    -------------------------------*/
    setProductParamsPropertyList(state, [index, value, type]) {
      if (!type) {
        // 说明为选项值
        state.obj2GetProductPrice.ProductParams.PropertyList[
          index
        ].CustomerInputValue = value;
      } else {
        state.obj2GetProductPrice.ProductParams.PropertyList[
          index
        ].CustomizedOptionValue = value;
      }
    },
    /* 设置产品报价中产品工艺信息 三种修改类型: add   del   maybeEdit
    -------------------------------*/
    setProductParamsCraftList(state, [type, item, cb, isSystemSelect = false]) {
      const _curCraftRelationList = this.getters[// 当前产品需要满足的工艺条件信息，只当增加工艺的时候需要使用， 删除时也需要
        'Quotation/curCraftRelationList'
      ];
      const _curCraftRules = [];
      // 获取到当前要添加工艺所符合的工艺关系列表
      _curCraftRelationList.forEach(it => {
        if (it.MasterCraft && it.MasterCraft.CraftID === item.CraftID) {
          _curCraftRules.push(it);
          return;
        }
        it.CraftList.forEach(it2 => {
          if (it2.CraftID === item.CraftID) {
            _curCraftRules.push(it);
          }
        });
      });
      let _key = '';
      let _ids;
      const _targetCraftList = state.obj2GetProductPrice.ProductParams.CraftList.find(it => it.ChoiceType === 1);

      switch (type) {
        case 'add':
          state.obj2GetProductPrice.ProductParams.CraftList2Req.First.push(item);
          if (
            _targetCraftList && _targetCraftList.CraftList.find(it => it.CraftID === item.CraftID)
          ) {
            _targetCraftList.CraftList.find(
              it => it.CraftID === item.CraftID,
            ).isSystemSelect = isSystemSelect;
          }
          _key = 'add';
          break;
        case 'del':
          // console.log(item, item.CraftName);
          // eslint-disable-next-line no-case-declarations
          const _delTarget = state.obj2GetProductPrice.ProductParams.CraftList2Req.First.find(
            _it => _it.CraftID === item.CraftID,
          );
          if (!_delTarget) return;
          state.obj2GetProductPrice.ProductParams.CraftList2Req.First = state.obj2GetProductPrice.ProductParams.CraftList2Req.First.filter(
            it => it.CraftID !== item.CraftID,
          );
          _key = 'del';
          break;
        case 'maybeEdit': // 可能为编辑模式
          _ids = state.obj2GetProductPrice.ProductParams.CraftList2Req.First.map(
            it => it.CraftID,
          );
          if (_ids.includes(item.CraftID)) {
            state.obj2GetProductPrice.ProductParams.CraftList2Req.First = state.obj2GetProductPrice.ProductParams.CraftList2Req.First.map(
              it => {
                if (it.CraftID !== item.CraftID) return it;
                return item;
              },
            );
          } else {
            state.obj2GetProductPrice.ProductParams.CraftList2Req.First.push(
              item,
            );
            // 下面只判断可选工艺 为其添加增加方式的状态，必选工艺未使用，不做处理 || 一个工艺不可能同时是可选和必选工艺
            if (
              _targetCraftList && _targetCraftList.CraftList.find(it => it.CraftID === item.CraftID)
            ) {
              _targetCraftList.CraftList.find(
                it => it.CraftID === item.CraftID,
              ).isSystemSelect = isSystemSelect;
            }
            _key = 'add';
          }

          state.obj2GetProductPrice.ProductParams.CraftList.forEach(
            _listItem => {
              _listItem.CraftList.forEach(_item => {
                if (_item.CraftID === item.CraftID) {
                  _item.historyData = item.historyData;
                }
              });
            },
          );

          break;
        default:
          break;
      }

      const IDs = state.obj2GetProductPrice.ProductParams.CraftList2Req.First.map(
        it => it.CraftID,
      );

      if (_curCraftRules.length > 0 && _key === 'add') {
        // 执行工艺关系设置
        _curCraftRules.forEach(rule => {
          if (rule.MasterCraft) {
            if (rule.MasterCraft.CraftID === item.CraftID) {
              // 此种情况 当前工艺依赖于rule.CraftList中的所有工艺项，如果其以在列表则不管，如果不在列表且不需要再进行选择或输入则直接勾选，否则看情况是否进行提示
              rule.CraftList.forEach(it => {
                if (!IDs.includes(it.CraftID)) {
                  cb({
                    list: [it],
                    type: 'add',
                  }); // 返回回去由组件继续进行判断添加处理(如果已在列表中则不用做额外处理)
                }
              });
            } else if (rule.MasterCraft.CraftID !== item.CraftID) {
              // 此种情况，当前工艺类型和上面一样同为单向和双向依赖，根据情况进行判断，如果为单向依赖则不做处理，如果为双向依赖则返回进行继续添加任务
              if (
                rule.RelationType === 3
                && !IDs.includes(rule.MasterCraft.CraftID)
              ) {
                cb({
                  list: [rule.MasterCraft],
                  type: 'add',
                });
              }
            }
          } else {
            // 此中目前必为互斥关系，为以后扩展情况发生，进行进一步条件判断
            // eslint-disable-next-line no-lonely-if
            if (rule.RelationType === 1) {
              // 互斥 --- 对列表中其它工艺依次进行删除
              rule.CraftList.forEach(craft => {
                if (
                  craft.CraftID !== item.CraftID
                  && IDs.includes(craft.CraftID)
                ) {
                  cb({
                    list: [craft],
                    type: 'del',
                  });
                }
              });
            }
          }
        });
      }

      if (_curCraftRules.length > 0 && _key === 'del') {
        // 此时需要把单向依赖(其为被依赖项时)和双向依赖的工艺一起去除
        _curCraftRules.forEach(rule => {
          if (rule.MasterCraft) {
            if (
              rule.MasterCraft.CraftID === item.CraftID
              && rule.RelationType === 3
            ) {
              rule.CraftList.forEach(it => {
                if (IDs.includes(it.CraftID)) {
                  cb({
                    list: [it],
                    type: 'del',
                  });
                }
              });
            } else if (rule.MasterCraft.CraftID !== item.CraftID) {
              if (IDs.includes(rule.MasterCraft.CraftID)) {
                cb({
                  list: [rule.MasterCraft],
                  type: 'del',
                });
              }
            }
          }
        });
      }
    },
    /* 修改产品报价部件信息 -- 修改部件平面信息
    -------------------------------*/
    setQuotationPartPlainInfo(state, [indexLv1, indexLv2, type, value]) {
      state.obj2GetProductPrice.ProductParams.PartList[indexLv1].PartList[
        indexLv2
      ][type].First = value;
    },
    /* 修改产品报价部件信息 -- 修改部件属性列表信息
    -------------------------------*/
    setQuotationPartPropertyList(
      state,
      [indexLv1, indexLv2, index, value, type],
    ) {
      if (!type) {
        state.obj2GetProductPrice.ProductParams.PartList[indexLv1].PartList[
          indexLv2
        ].PropertyList[index].CustomerInputValue = value;
      } else {
        state.obj2GetProductPrice.ProductParams.PartList[indexLv1].PartList[
          indexLv2
        ].PropertyList[index].CustomizedOptionValue = value;
      }
    },
    /* 修改产品报价部件信息 -- 修改部件印刷属性列表信息
    -------------------------------*/
    setQuotationPartPrintPropertyList(
      state,
      [indexLv1, indexLv2, value, index],
    ) {
      state.obj2GetProductPrice.ProductParams.PartList[indexLv1].PartList[
        indexLv2
      ].PrintTypeList[index].CustomerInputValue = value.OptionID;
    },
    /* 修改产品报价部件信息 -- 修改部件尺寸信息
    -------------------------------*/
    setQuotationPartSizePropertyList(state, [indexLv1, indexLv2, value]) {
      state.obj2GetProductPrice.ProductParams.PartList[indexLv1].PartList[
        indexLv2
      ].SizePropertyList = [...value];
    },
    /* 修改产品报价部件信息 -- 设置印刷属性组信息
    -------------------------------*/
    setPrintPropertyGroupList(
      state,
      [indexLv1, indexLv2, index1, index2, index3, value, type],
    ) {
      // // console.log(state.obj2GetProductPrice.ProductParams.PartList[indexLv1].PartList[
      //   indexLv2
      // ].PrintPropertyGroupList[index1].PropertyList);
      if (!type) {
        state.obj2GetProductPrice.ProductParams.PartList[indexLv1].PartList[
          indexLv2
        ].PrintPropertyGroupList[index1].PropertyList[index2].Second[
          index3
        ].CustomerInputValue = value;
      } else {
        state.obj2GetProductPrice.ProductParams.PartList[indexLv1].PartList[
          indexLv2
        ].PrintPropertyGroupList[index1].PropertyList[index2].Second[
          index3
        ].CustomizedOptionValue = value;
      }
    },
    /* 修改产品报价部件信息 -- 设置普通属性组信息
    -------------------------------*/
    setPropertyGroupList(
      state,
      [indexLv1, indexLv2, index1, index2, index3, value, type],
    ) {
      if (!type) {
        state.obj2GetProductPrice.ProductParams.PartList[indexLv1].PartList[
          indexLv2
        ].PropertyGroupList[index1].PropertyList[index2].Second[
          index3
        ].CustomerInputValue = value;
      } else {
        state.obj2GetProductPrice.ProductParams.PartList[indexLv1].PartList[
          indexLv2
        ].PropertyGroupList[index1].PropertyList[index2].Second[
          index3
        ].CustomizedOptionValue = value;
      }
    },
    /* 设置产品报价部件信息 -- 设置产品工艺信息 三种修改类型: add   del   maybeEdit
    -------------------------------*/
    setPartProductParamsCraftList(
      state,
      [indexLv1, indexLv2, [type, item, cb, isSystemSelect = false]],
    ) {
      const _curCraftRelationList = this.getters[// 当前产品需要满足的工艺条件信息，只当增加工艺的时候需要使用， 删除时也需要
        'Quotation/curCraftRelationList'
      ];
      const _curCraftRules = [];
      // 获取到当前要添加工艺所符合的工艺关系列表
      _curCraftRelationList.forEach(it => {
        if (it.MasterCraft && it.MasterCraft.CraftID === item.CraftID) {
          _curCraftRules.push(it);
          return;
        }
        it.CraftList.forEach(it2 => {
          if (it2.CraftID === item.CraftID) {
            _curCraftRules.push(it);
          }
        });
      });
      let _key = '';
      let _ids;
      switch (type) {
        case 'add':
          state.obj2GetProductPrice.ProductParams.PartList[indexLv1].PartList[indexLv2].PartCraftList2Req.First.push(item);
          if (
            state.obj2GetProductPrice.ProductParams.PartList[indexLv1].PartList[
              indexLv2
            ].CraftList.find(it => it.ChoiceType === 1)
            && state.obj2GetProductPrice.ProductParams.PartList[indexLv1].PartList[
              indexLv2
            ].CraftList.find(it => it.ChoiceType === 1).CraftList.find(
              it => it.CraftID === item.CraftID,
            )
          ) {
            state.obj2GetProductPrice.ProductParams.PartList[indexLv1].PartList[
              indexLv2
            ].CraftList.find(it => it.ChoiceType === 1).CraftList.find(
              it => it.CraftID === item.CraftID,
            ).isSystemSelect = isSystemSelect;
          }
          _key = 'add';
          break;
        case 'del':
          state.obj2GetProductPrice.ProductParams.PartList[indexLv1].PartList[
            indexLv2
          ].PartCraftList2Req.First = state.obj2GetProductPrice.ProductParams.PartList[
            indexLv1
          ].PartList[indexLv2].PartCraftList2Req.First.filter(
            it => it.CraftID !== item.CraftID,
          );
          _key = 'del';
          break;
        case 'maybeEdit': // 可能为编辑模式
          _ids = state.obj2GetProductPrice.ProductParams.PartList[
            indexLv1
          ].PartList[indexLv2].PartCraftList2Req.First.map(it => it.CraftID);
          if (_ids.includes(item.CraftID)) {
            state.obj2GetProductPrice.ProductParams.PartList[indexLv1].PartList[
              indexLv2
            ].PartCraftList2Req.First = state.obj2GetProductPrice.ProductParams.PartList[
              indexLv1
            ].PartList[indexLv2].PartCraftList2Req.First.map(it => {
              if (it.CraftID !== item.CraftID) return it;
              return item;
            });
          } else {
            _key = 'add';
            state.obj2GetProductPrice.ProductParams.PartList[indexLv1].PartList[
              indexLv2
            ].PartCraftList2Req.First.push(item);
            // console.log(
            //   state.obj2GetProductPrice.ProductParams.PartList[indexLv1]
            //     .PartList[indexLv2],
            // );
            const _list2SetSystemSelec = state.obj2GetProductPrice.ProductParams.PartList[
              indexLv1
            ].PartList[indexLv2].CraftList.find(it => it.ChoiceType === 1);
            if (
              _list2SetSystemSelec
              && _list2SetSystemSelec.CraftList.find(
                it => it.CraftID === item.CraftID,
              )
            ) {
              state.obj2GetProductPrice.ProductParams.PartList[
                indexLv1
              ].PartList[indexLv2].CraftList.find(
                it => it.ChoiceType === 1,
              ).CraftList.find(
                it => it.CraftID === item.CraftID,
              ).isSystemSelect = isSystemSelect;
            }
          }
          state.obj2GetProductPrice.ProductParams.PartList[indexLv1].PartList[
            indexLv2
          ].CraftList.forEach(_listItem => {
            _listItem.CraftList.forEach(_item => {
              if (_item.CraftID === item.CraftID) {
                _item.historyData = item.historyData;
              }
            });
          });
          break;
        default:
          break;
      }

      const IDs = state.obj2GetProductPrice.ProductParams.PartList[
        indexLv1
      ].PartList[indexLv2].PartCraftList2Req.First.map(it => it.CraftID);

      if (_curCraftRules.length > 0 && _key === 'add') {
        // 执行工艺关系设置
        _curCraftRules.forEach(rule => {
          if (rule.MasterCraft) {
            if (rule.MasterCraft.CraftID === item.CraftID) {
              // 此种情况 当前工艺依赖于rule.CraftList中的所有工艺项，如果其以在列表则不管，如果不在列表且不需要再进行选择或输入则直接勾选，否则看情况是否进行提示
              rule.CraftList.forEach(it => {
                if (!IDs.includes(it.CraftID)) {
                  cb({
                    list: [it],
                    type: 'add',
                  }); // 返回回去由组件继续进行判断添加处理(如果已在列表中则不用做额外处理)
                }
              });
            } else if (rule.MasterCraft.CraftID !== item.CraftID) {
              // 此种情况，当前工艺类型和上面一样同为单向和双向依赖，根据情况进行判断，如果为单向依赖则不做处理，如果为双向依赖则返回进行继续添加任务
              if (
                rule.RelationType === 3
                && !IDs.includes(rule.MasterCraft.CraftID)
              ) {
                cb({
                  list: [rule.MasterCraft],
                  type: 'add',
                });
              }
            }
          } else {
            // 此中目前必为互斥关系，为以后扩展情况发生，进行进一步条件判断
            // eslint-disable-next-line no-lonely-if
            if (rule.RelationType === 1) {
              // 互斥 --- 对列表中其它工艺依次进行删除
              rule.CraftList.forEach(craft => {
                if (
                  craft.CraftID !== item.CraftID
                  && IDs.includes(craft.CraftID)
                ) {
                  cb({
                    list: [craft],
                    type: 'del',
                  });
                }
              });
            }
          }
        });
      }

      if (_curCraftRules.length > 0 && _key === 'del') {
        // 此时需要把单向依赖(其为被依赖项时)和双向依赖的工艺一起去除
        _curCraftRules.forEach(rule => {
          if (rule.MasterCraft) {
            if (
              rule.MasterCraft.CraftID === item.CraftID
              && rule.RelationType === 3
            ) {
              // 此种情况 当前工艺依赖于rule.CraftList中的所有工艺项，如果其以在列表则不管，如果不在列表且不需要再进行选择或输入则直接勾选，否则看情况是否进行提示
              rule.CraftList.forEach(it => {
                if (IDs.includes(it.CraftID)) {
                  cb({
                    list: [it],
                    type: 'del',
                  });
                }
              });
            } else if (rule.MasterCraft.CraftID !== item.CraftID) {
              // 此种情况，当前工艺类型和上面一样同为单向和双向依赖，根据情况进行判断，如果为单向依赖则不做处理，如果为双向依赖则删除
              if (IDs.includes(rule.MasterCraft.CraftID)) {
                cb({
                  list: [rule.MasterCraft],
                  type: 'del',
                });
              }
            }
          }
        });
      }
    },
    /* 设置产品报价产品信息 -- 新增部件
    -------------------------------*/
    addPartProductParamsPartList(state, [indexLv1, item]) {
      const _item = JSON.parse(JSON.stringify(item));
      state.obj2GetProductPrice.ProductParams.PartList[indexLv1].PartList.push(
        _item,
      );
    },
    /* 设置产品报价产品信息 -- 删除部件
    -------------------------------*/
    delPartProductParamsPartList(state, [indexLv1, indexLv2]) {
      state.obj2GetProductPrice.ProductParams.PartList[
        indexLv1
      ].PartList.splice(indexLv2, 1);
    },
    /* 设置产品报价部件信息 -- 新增印刷属性组
    -------------------------------*/
    addPartPrintPropertyGroupList(
      state,
      [indexLv1, indexLv2, [index1, itemData]],
    ) {
      const _itemData = JSON.parse(JSON.stringify(itemData));
      state.obj2GetProductPrice.ProductParams.PartList[indexLv1].PartList[
        indexLv2
      ].PrintPropertyGroupList[index1].PropertyList.push(_itemData);
    },
    /* 设置产品报价部件信息 -- 删除印刷属性组
    -------------------------------*/
    delPartPrintPropertyGroupList(
      state,
      [indexLv1, indexLv2, [index1, index2]],
    ) {
      state.obj2GetProductPrice.ProductParams.PartList[indexLv1].PartList[
        indexLv2
      ].PrintPropertyGroupList[index1].PropertyList.splice(index2, 1);
    },
    /* 设置产品报价部件信息 -- 新增属性组
    -------------------------------*/
    addPartPropertyGroupList(state, [indexLv1, indexLv2, [index1, itemData]]) {
      const _itemData = JSON.parse(JSON.stringify(itemData));
      state.obj2GetProductPrice.ProductParams.PartList[indexLv1].PartList[
        indexLv2
      ].PropertyGroupList[index1].PropertyList.push(_itemData);
    },
    /* 设置产品报价部件信息 -- 删除属性组
    -------------------------------*/
    delPartPropertyGroupList(state, [indexLv1, indexLv2, [index1, index2]]) {
      state.obj2GetProductPrice.ProductParams.PartList[indexLv1].PartList[
        indexLv2
      ].PropertyGroupList[index1].PropertyList.splice(index2, 1);
    },
    /* 设置获取产品报价结果信息
    -------------------------------*/
    setProductQuotationResult(state, data) {
      state.ProductQuotationResult = data;
    },
    /* 设置获取产品报价结果信息
    -------------------------------*/
    setProductQuotationDetail(state, data) {
      state.ProductQuotationDetail = data;
    },
    /* 设置某个工艺状态为disabled
    -------------------------------*/
    setCraftItemDisabled(state, [CraftID, type, bool]) {
      if (type === 'isMain') {
        const _list = state.obj2GetProductPrice.ProductParams.CraftList.find(
          it => it.ChoiceType === 1,
        ).CraftList;
        const _t = _list.find(it => it.CraftID === CraftID);
        _t.disabled = bool;
      }
    },
    /* 设置部件某个工艺状态为disabled
    -------------------------------*/
    setCraftItemDisabled4Part(state, [indexLv1, indexLv2, [CraftID, bool]]) {
      const _list = state.obj2GetProductPrice.ProductParams.PartList[
        indexLv1
      ].PartList[indexLv2].CraftList.find(it => it.ChoiceType === 1).CraftList;
      const _t = _list.find(it => it.CraftID === CraftID);
      _t.disabled = bool;
      // }
    },
    /* 修改信息以通知工艺组件进行禁用状态的工艺取消
    -------------------------------*/
    setWatchTarget2DelCraft(state) {
      state.watchTarget2DelCraft += 1;
    },
    /* 设置默认产品
    -------------------------------*/
    setDefaultProductInfo(state, item) {
      // state.obj2GetProductPrice.ProductParams =
      QuotationClassType.backfillDefaultProduct(state.obj2GetProductPrice.ProductParams, item);
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
    /* 设置预下单中存放的订单文件
    -------------------------------*/
    setOrderFile4PreCreateData(state, file) {
      state.orderFile4PreCreateData = file;
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
      state.orderFile4PreCreateData = null;

      state.ProductQuotationResult = null;
      state.ProductQuotationDetail = null;
      state.curFileContent = '';
      state.curPayInfo2Code = null;
      state.curReqObj4PreCreate = null;
      state.selectedCoupon = null;
      state.isFullPayoutDisabled = false;

      const _keepingData = localStorage.getItem('isOrderDataKeeping');
      // console.log(_keepingData);
      if (!(_keepingData && _keepingData === 'true')) {
        state.curProductID = '';
        state.curProductClass = null;
        state.curProductName = '';
        state.curProductInfo2Quotation = null;
        state.obj2GetProductPrice = {
          ProductParams: {},
        };
        state.initPageText = '下单成功';
        state.curProduct = null;
      }
    },
    /* 下单成功后的状态清理
    -------------------------------*/
    clearStateAfterPlaceOrderSuccess(state) {
      // // console.log(1231232132132131);
      state.selectedCoupon = null;
      state.isFullPayoutDisabled = true;
    },
    /* 设置支付全款禁用状态    下单时 - 支付全款是否为禁用状态  （初始不禁用， 下单成功后禁用， 返回其它页面时重新设置为不禁用）
    -------------------------------*/
    setIsFullPayoutDisabled(state, bool) {
      state.isFullPayoutDisabled = bool;
    },
    /* 设置初始页面字体
    -------------------------------*/
    setInitPageText(state, text) {
      state.initPageText = text;
    },
    /* 设置客户快捷方式
    -------------------------------*/
    setCustomerShortCutList(state, data) {
      state.customerShortCutList = data;
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
      state.ProductQuotationDetail = null;
      state.watchTarget2DelCraft = 0;
      state.addressInfo4PlaceOrder = null;
      state.selectedCoupon = null;
      state.curSelectStatus = '报价';
      state.curFileContent = '';
      state.PreCreateData = null;
      state.orderFile4PreCreateData = null;
      state.curPayInfo2Code = null;
      state.curReqObj4PreCreate = null;
      state.isShow2PayDialog = false;
      state.isFullPayoutDisabled = false;
      state.initPageText = '';
      state.customerShortCutList = [];
      state.curProduct = null;
    },
    /** 设置当前选中的用于报价的产品
    ---------------------------------------- */
    setCurProduct(state, data) {
      state.curProduct = data;
    },
    /** 设置是否为点击tag标签获取产品报价信息  （ 此时不全清下单报价页面信息 只部分展示loading ）
    ---------------------------------------- */
    setIsFetchingPartProductData(state, bool) {
      state.isFetchingPartProductData = bool;
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
    async getProductDetail({ state, commit }, config = {}) {
      const { saveOldData, closeloading } = { saveOldData: false, closeloading: false, ...config };
      if (!saveOldData) commit('clearCurProductInfo2Quotation');
      let isError = false;
      const res = await api.getProductDetail([state.curProductID, closeloading]).catch(() => isError = true); // !saveOldData
      if (saveOldData) commit('setIsFetchingPartProductData', false);
      if (isError) {
        if (saveOldData) commit('setIsFetchingPartProductData', false);
        return false;
      }
      if (res.data.Status !== 1000) return false;
      commit('setCurProductInfo2Quotation', res.data.Data);
      // console.log(router.currentRoute.query.id);
      if (!router.currentRoute.query.id || router.currentRoute.query.id !== state.curProductID) {
        // console.log('change place query -----');
        router.push(`?id=${state.curProductID}`);
      }
      return true;
    },
    /* 获取产品报价信息
    -------------------------------*/
    async getProductPrice({ state, commit, dispatch }) {
      // console.log(curSelectStatus);
      const productData = state.obj2GetProductPrice.ProductParams;
      commit('setCurSelectStatus', '报价');
      if (QuotationClassType.check(productData) === false) return;
      const _data = {};
      commit('setWatchTarget2DelCraft');
      await dispatch('delay', 10);
      _data.ProductParams = QuotationClassType.filter(
        QuotationClassType.transform(productData),
      );
      // const { CustomerID } = this.state.account.accountObj;
      // _data.Customer = { CustomerID };
      commit('setProductQuotationResult', null);
      commit('setProductQuotationDetail', null);
      if (state.addressInfo4PlaceOrder && state.addressInfo4PlaceOrder.Address.Address.Consignee && state.addressInfo4PlaceOrder.Address.Address.Latitude) {
        _data.Address = state.addressInfo4PlaceOrder.Address;
      }
      let key = true;
      const res = await api.getProductPrice(_data).catch(() => { key = false; });
      // if (!key) return;
      if (!key || res.data.Status === 7025 || res.data.Status === 8037) return;
      // eslint-disable-next-line consistent-return
      if (res.data.Status !== 1000) return res.data.Message;
      if (!res.data.Data || !res.data.Data.HavePrice) {
        // eslint-disable-next-line consistent-return
        return '暂无报价，请联系客服获取报价信息!';
      } // 可能为null 当需要客服咨询报价
      commit('setProductQuotationResult', res.data.Data);
      commit('setProductQuotationDetail', productData);
      // eslint-disable-next-line consistent-return
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
    async getOrderPreCreate({ state, commit, dispatch, rootState }, { compiledName, fileContent, callBack }) {
      // // console.log(state, compiledName, fileContent);
      // 配置组合生成请求对象
      const _requestObj = { List: [], OrderType: 2, PayInFull: false };
      const _itemObj = {};
      _itemObj.IsOrder = false; // 预下单false  正式下单 true
      if (compiledName) _itemObj.FilePath = compiledName;
      if (state.addressInfo4PlaceOrder.OutPlate.Second) _itemObj.OutPlate = state.addressInfo4PlaceOrder.OutPlate;
      _itemObj.Address = {};
      _itemObj.Address.Express = state.addressInfo4PlaceOrder.Address.Express;
      if (state.addressInfo4PlaceOrder.Address.AddressID) {
        _itemObj.Address.AddressID = state.addressInfo4PlaceOrder.Address.AddressID;
      } else {
        _itemObj.Address.Address = state.addressInfo4PlaceOrder.Address.Address;
        // console.log(state.addressInfo4PlaceOrder.Address.Address.Latitude);
        // if (!state.addressInfo4PlaceOrder.Address.Address.Latitude) alert('未定位')
      }
      _itemObj.Content = fileContent;
      commit('setCurFileContent', fileContent);
      commit('setCurSelectStatus', '下单');
      if (state.selectedCoupon) _itemObj.Coupon = { CouponCode: state.selectedCoupon.CouponCode };

      const productData = state.obj2GetProductPrice.ProductParams;
      if (QuotationClassType.check(productData) === false) return;
      commit('setWatchTarget2DelCraft');
      await dispatch('delay', 10);
      const ProductParams = QuotationClassType.filter(
        QuotationClassType.transform(productData),
      );

      _itemObj.ProductParams = ProductParams;

      _requestObj.List.push(_itemObj);
      const res = await api.getOrderPreCreate(_requestObj);
      // // console.log(res);
      // // console.log(res.data.Status);
      if (res.data.Status === 1000) {
        commit('setCurReqObj4PreCreate', _itemObj);
        commit('setPreCreateData', res.data.Data);
        // commit('setCurProduct', null);
        const _b = rootState.common.customerBalance;
        const { FundBalance } = res.data.Data;
        if (FundBalance !== +_b) commit('common/setCustomerBalance', FundBalance, { root: true });
        callBack();
      } else if ([9164, 9165, 9166, 9167, 9168, 9169, 9170].includes(res.data.Status)) {
        massage.warnCancelBox({
          title: res.data.Message,
          msg: '是否 [ 取消使用优惠券 ] 然后下单',
          successFunc: async () => {
            delete _requestObj.List[0].Coupon;
            commit('setSelectedCoupon', null);
            const resp = await api.getOrderPreCreate(_requestObj);

            if (resp.data.Status === 1000) {
              commit('setCurReqObj4PreCreate', _itemObj);
              commit('setPreCreateData', resp.data.Data);
              // commit('setCurProduct', null);
              const _b = rootState.common.customerBalance;
              const { FundBalance } = resp.data.Data;
              if (FundBalance !== +_b) commit('common/setCustomerBalance', FundBalance, { root: true });
              callBack();
            }
          },
        });
      }
    },
    /* 下单 - 保存购物车
    -------------------------------*/
    async getQuotationSave2Car({ state, commit, dispatch }, { compiledName, fileContent, FileSize }) {
      const _itemObj = {};
      _itemObj.IsOrder = false; // 预下单false  正式下单 true
      _itemObj.FilePath = compiledName;
      _itemObj.FileHaveUpload = true;
      if (FileSize) _itemObj.FileSize = FileSize;
      if (state.addressInfo4PlaceOrder.OutPlate.Second) _itemObj.OutPlate = state.addressInfo4PlaceOrder.OutPlate;
      _itemObj.Address = {};
      _itemObj.Address.Express = state.addressInfo4PlaceOrder.Address.Express;
      if (state.addressInfo4PlaceOrder.Address.AddressID) {
        _itemObj.Address.AddressID = state.addressInfo4PlaceOrder.Address.AddressID;
      } else {
        _itemObj.Address.Address = state.addressInfo4PlaceOrder.Address.Address;
        // if (!state.addressInfo4PlaceOrder.Address.Address.Latitude) alert('未定位')
      }
      _itemObj.Content = fileContent;
      if (state.selectedCoupon) _itemObj.Coupon = { CouponCode: state.selectedCoupon.CouponCode };

      const productData = state.obj2GetProductPrice.ProductParams;
      if (QuotationClassType.check(productData) === false) return;
      commit('setWatchTarget2DelCraft');
      await dispatch('delay', 10);
      const ProductParams = QuotationClassType.filter(
        QuotationClassType.transform(productData),
      );

      _itemObj.ProductParams = ProductParams;
      const res = await api.getQuotationSave(_itemObj);
      // // console.log(res);

      if (res.data.Status === 1000) {
        massage.successSingle({ title: '添加成功!' });
        const _obj = JSON.parse(JSON.stringify(state.curProductInfo2Quotation));
        commit('setCurProductInfo2Quotation', null);
        commit('setSelectedCoupon', null);
        await dispatch('delay', 10);
        commit('setCurProductInfo2Quotation', _obj);
      } else if ([9164, 9165, 9166, 9167, 9168, 9169, 9170].includes(res.data.Status)) {
        massage.warnCancelBox({
          title: '未达到优惠券使用金额',
          msg: '是否 [ 取消使用优惠券 ] 然后加入购物车',
          successFunc: async () => {
            commit('setSelectedCoupon', null);
            delete _itemObj.Coupon;
            const resp = await api.getQuotationSave(_itemObj);
            if (resp.data.Status === 1000) {
              massage.successSingle({ title: '添加成功!' });
              const _obj = JSON.parse(JSON.stringify(state.curProductInfo2Quotation));
              commit('setCurProductInfo2Quotation', null);
              await dispatch('delay', 10);
              commit('setCurProductInfo2Quotation', _obj);
            }
          },
        });
      }
    },
    /* 最终下单
    -------------------------------*/
    async getPayResult({ state }, cb) {
      if (!state.curPayInfo2Code || !state.curPayInfo2Code.PayCode) return;
      const res = await api.getPayResult(state.curPayInfo2Code.PayCode);
      if (res.data.Status === 1000) cb(res.data.Data);
    },
    async placeOrderFromPreCreate({ state, commit, rootState }, { FilePath, PayInFull, cb, isSpotGoods = false, FileSize }) {
      const _obj = { OrderType: 2, PayInFull, List: [] };
      let item;
      if (FilePath || isSpotGoods) {
        item = { ...state.curReqObj4PreCreate, FilePath };
        if (FileSize) item.FileSize = FileSize;
        _obj.List.push(item);
      } else {
        item = [...rootState.shoppingCar.curShoppingCarDataBeforeFirstPlace];
        _obj.List = item;
      }

      const res = await api.CreateOrderFromPreCreate(_obj);
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
        // commit('setClock2PaySuccess');
        // console.log('placeOrderFromPreCreate');
        massage.successSingle({
          title: '下单成功!',
          successFunc: () => {
            if (FilePath || (!FilePath && isSpotGoods)) commit('setPaySuccessOrderDataStatus');
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
    /* 获取客户设置快捷方式
    -------------------------------*/
    async getCustomerShortCutList({ commit }) {
      const res = await api.getCustomerShortCutList();
      if (res.data.Status === 1000) {
        // console.log(res);
        commit('setCustomerShortCutList', res.data.Data);
      }
    },
    // eslint-disable-next-line consistent-return
    async getCustomerShortCutSave(args, data) {
      // console.log(args);
      const res = await api.getCustomerShortCutSave(data);
      // console.log(res);
      if (res.data.Status !== 1000) return false;
      return true;
    },
  },
};
