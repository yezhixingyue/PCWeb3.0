/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/* eslint-disable no-nested-ternary */
import validateCheck from '@/assets/js/validator/validateCheck';
import massage from '@/assets/js/utils/message';
import store from '@/store';

function _getProperty(_arr, isGroup) { // 转换属性
  return _arr.map(it => {
    if (it.CustomizedOptionValue) {
      return ({
        PropertyID: it.PropertyID,
        CustomizedOptionValue: it.CustomizedOptionValue,
      });
    }
    // // console.log(it, 'it-----------');
    if (isGroup && it.ValueType === 2) {
      let CustomizedOptionValue = '';
      const _t = it.OptionList.find(sub => sub.OptionID === it.CustomerInputValue);
      if (_t) CustomizedOptionValue = _t.Value;
      return ({
        CustomerInputValue: it.CustomerInputValue,
        PropertyID: it.PropertyID,
        CustomizedOptionValue,
      });
    }
    return ({
      CustomerInputValue: it.CustomerInputValue,
      PropertyID: it.PropertyID,
      // ---- 此处有最大最小值限制 --- 需要进行校验
    });

    // return ({
    //   PropertyID: it.PropertyID,
    //   CustomizedOptionValue: "3mm",
    //   CustomerInputValue: it.CustomerInputValue,
    // })
  });
}

function _setErrMsg(errMsg) {
  const msg = store.state.Quotation.curSelectStatus;
  // console.log(store.state.Quotation.curSelectStatus);
  massage.failSingleError({ title: `${msg}失败`, msg: errMsg });
}

// eslint-disable-next-line consistent-return
function _checkCraft(_isRequireCraftList, item, _selectdCraftIdList, curCraftRelationList) {
  if (!_selectdCraftIdList.includes(item.CraftID)) { // 当前已选择工艺列表中没有正在判断的必选工艺项 -- item
    if (curCraftRelationList.length === 0) { // 肯定没有互斥工艺，进行报错及return
      return false;
    } // 存在有工艺关系的工艺
    // let key = true;
    // const _isRequireCraftIDsList = _isRequireCraftList.map(_it => _it.CraftID);
    // for (let _i = 0; _i < curCraftRelationList.length; _i += 1) {
    //   const rule = curCraftRelationList[_i];
    //   if (rule.RelationType === 1) { // 互斥工艺关系判断
    //     // // console.log("1213213131231 第1种方式");
    //     const _t = rule.CraftList.find(_c => _c.CraftID === item.CraftID);
    //     // // console.log("1213213131231 第1种方式---2", _t, rule.CraftList, item);
    //     if (_t) {
    //       // // console.log("1213213131231 第1种方式---2", _t, _t.CraftName);
    //       // // console.log("rule.CraftList:", rule.CraftList)
    //       for (let _i2 = 0; _i2 < rule.CraftList.length; _i2 += 1) {
    //         const _subC = rule.CraftList[_i2];
    //         if (_subC.CraftID !== _t.CraftID) {
    //           if (_selectdCraftIdList.includes(_subC.CraftID)) {
    //             // 能到此处 说明： 当前已选择工艺列表中存在有【当前正在判断的未勾选的必选工艺， 即此处item变量 】的互斥工艺  所以该工艺可不选
    //             key = false;
    //             // // console.log("---------------------------key:", key);
    //             // eslint-disable-next-line consistent-return
    //             return;
    //           } if (!_selectdCraftIdList.includes(_subC.CraftID) && _isRequireCraftIDsList.includes(_subC.CraftID)) {
    //             return _subC.CraftNickName;
    //           }
    //         }
    //       }
    //     }
    //   }
    //   if (rule.RelationType === 2) {
    //     // 单向依赖 分2种情况：1. 它依赖与别的工艺，别的工艺不依赖与它，此时它选不选都不影响其它工艺 所以此时其不选必不通过验证
    //     //  2. 别的工艺依赖与它  此时它应当为必选
    //     // 所以单向依赖时  工艺都为必选
    //     // // console.log("1213213131231 第2种方式");
    //   }
    //   if (rule.RelationType === 3) {
    //     // 双向依赖 如果其在已选择列表中没有互斥的工艺存在  则继续看其双向绑定的工艺是否在需要必选的列表中，
    //     // 如果不存在则不考虑，如果存在则继续判断该依赖的工艺在已选择的列表中是否存在互斥工艺
    //     const _ruleList = [...rule.CraftList, rule.MasterCraft];
    //     const _ruleIdsList = _ruleList.map(_t => _t.CraftID);
    //     // // console.log("1213213131231 第三种方式");
    //     if (_ruleIdsList.includes(item.CraftID)) {
    //       // 当前未选择的工艺存在该列表中
    //       // // console.log("1213213131231 第三种方式-1");
    //       for (let _ruleIndex = 0; _ruleIndex < _ruleIdsList.length; _ruleIndex += 1) {
    //         const _targetRule = _ruleList[_ruleIndex];
    //         // // console.log("1213213131231 第三种方式-2",  _targetRule.CraftName, _targetRule);
    //         if (_targetRule.CraftID !== item.CraftID) {
    //           // // console.log("1213213131231 第三种方式-3", _targetRule.CraftName);
    //           if (_isRequireCraftIDsList.includes(_targetRule.CraftID)) {
    //             // 说明有双向绑定的工艺存在需要选择的工艺列表中 此时进行判断
    //             // // console.log("1213213131231 第三种方式-4",  _targetRule.CraftName);
    //             if (!_selectdCraftIdList.includes(_targetRule.CraftID)) {
    //               // 继续判断该工艺的满足项  应当使用递归方式 下一步提取判断过程 进行循环递归调用
    //               // // console.log("1213213131231 第三种方式-5",  _targetRule.CraftName);
    //               const _tempRequireCraftList = _isRequireCraftList.filter(_it => _it.CraftID !== item.CraftID);
    //               // // console.log("调用了_checkCraft方法")
    //               return _checkCraft(_tempRequireCraftList, _targetRule, _selectdCraftIdList, curCraftRelationList);
    //             }
    //           }
    //           // // console.log(_targetRule.CraftName, "-----------------------------!")
    //         }
    //       }
    //     }
    //   }
    // }
    // if (key) {
    //   return false;
    // }
  }
}

function mountRelevanceInformation(list, RelevanceItem) { // 向属性中挂载关联信息
  for (let index = 0; index < list.length; index += 1) {
    const _PrintType = list[index];
    // // console.log(_PrintType, RelevanceItem);
    if (_PrintType.PropertyID === RelevanceItem.RelevanceProperty.PropertyID) {
      if (!_PrintType.RelevanceInformation) _PrintType.RelevanceInformation = [RelevanceItem];
      else _PrintType.RelevanceInformation.push(RelevanceItem);
      return;
    }
  }
}

// eslint-disable-next-line consistent-return
function getValue(list, MasterProperty) { // 向属性中挂载关联信息 从多个列表中找出一个符合要求的项 进行返回
  for (let index = 0; index < list.length; index += 1) {
    const item = list[index];
    // // console.log(item, RelevanceItem);
    if (item.PropertyID === MasterProperty.PropertyID) {
      // item.RelevanceInformation = RelevanceItem;
      // console.log('getValue', item.CustomerInputValue, item);
      return item;
    }
  }
  // const _t = list.find(it => it.PropertyID === MasterProperty.PropertyID);
  // if (_t) return _t;
}

/**
 * @description: 根据 [ 系统值、关系类型、客户值 ] 获取是否满足条件的结果(bool值)
 * @param {*} Value 系统值
 * @param {*} Operator 关系类型
 * @param {*} CustomerValue 客户值
 * @return {*}
 */
const getJudgeResult = (Value, Operator, CustomerValue) => {
  if (!CustomerValue && CustomerValue !== 0) return false;
  // 判断值是否符合条件
  let key = false;
  switch (Operator) {
    case 1:
      // 等于
      if (typeof CustomerValue === 'number' && +CustomerValue === +Value) key = true;
      if (typeof CustomerValue === 'string' && CustomerValue === Value) key = true;
      break;
    case 2:
      // 不等于
      if (typeof CustomerValue === 'number' && +CustomerValue !== +Value) key = true;
      if (typeof CustomerValue === 'string' && CustomerValue !== Value) key = true;
      break;
    case 3:
      // 大于
      if (+CustomerValue > +Value) key = true;
      break;
    case 4:
      // 大于等于
      if (+CustomerValue >= +Value) key = true;
      break;
    case 5:
      // 小于
      if (+CustomerValue < +Value) key = true;
      break;
    case 6:
      // 小于等于
      if (+CustomerValue <= +Value) key = true;
      break;

    default:
      key = false;
      break;
  }
  // // console.log(Operator, Value, ProductAmount, key);
  return key;
};

/**
 * @description: 获取工艺条件判断限制验证结果
 * @param {*} data
 * @param {*} productData
 * @return {*}
 */
const getVerifyResult4Craft = (data, productData, PartData) => {
  if (data.ChoiceType === 2) return null; // 只判断可选工艺
  const _t = data.CraftList.filter(it => it.CraftCondition && it.CraftCondition.length > 0);
  if (_t.length === 0) return null;

  for (let i = 0; i < _t.length; i += 1) {
    const craftItem = _t[i]; // 有条件限制的工艺项目 -- 根据其限制条件找到对应的值进行判断
    // console.log(`craftItem${i}:`, craftItem); // ID 工艺ID
    for (let index = 0; index < craftItem.CraftCondition.length; index += 1) {
      // ---------------------- 单个工艺条件 与其它无关
      const singleCondition = craftItem.CraftCondition[index];
      // console.log(singleCondition); // UseStatus  1 禁选   2必选
      let bool = singleCondition.Constraint.FilterType === 1; // Tips 错误提示  FilterType 1 满足所有  2满足任一
      let cannotJudge = false;
      singleCondition.Constraint.ItemList.forEach(it => {
        if (singleCondition.Constraint.FilterType === 1 && !bool) return;
        if (singleCondition.Constraint.FilterType === 2 && bool) return;
        if (cannotJudge) return;
        // ------------------------------ 单个工艺条件 多个子项 ： 与其它上下子条件有关 - 值受 FilterType 值影响 （ 1 : 满足所有, 2: 满足任一）
        // console.log(it); // Operator 关系  PropertyType 属性类型 Value 值 ValueType 值类型   PartID ? PropertyID ?
        let res = false; // 数值判断结果 -- 是否满足条件
        let _t; // 查询属性时使用
        switch (it.PropertyType) {
          case 1: // 产品数量
            res = getJudgeResult(it.Value, it.Operator, productData.ProductAmount);
            break;
          case 2: // 部件数量
            res = getJudgeResult(it.Value, it.Operator, PartData.PartAmount.First);
            break;
          case 33: // 物料
            res = getJudgeResult(it.Value, it.Operator, PartData.Material.First);
            break;
          case 34: // 实际克重
            _t = PartData.MaterialList.find(_it => PartData.Material.First === _it.MaterialID);
            res = _t ? getJudgeResult(it.Value, it.Operator, _t.Weight) : false;
            break;
          case 62: // 印刷属性
            _t = PartData.PrintTypeList.find(_it => it.PropertyID === _it.PropertyID);
            res = _t ? getJudgeResult(it.Value, it.Operator, _t.CustomerInputValue) : false;
            break;
          case 63: // 部件属性 (包含尺寸组) SizePropertyList | PropertyList
            _t = PartData.PropertyList.find(_it => it.PropertyID === _it.PropertyID);
            if (!_t) _t = PartData.SizePropertyList.find(_it => it.PropertyID === _it.PropertyID);
            res = _t ? getJudgeResult(it.Value, it.Operator, _t.CustomerInputValue) : false;
            break;
          // case 65: // 印刷属性组
          //   console.log(it, '印刷属性组', PartData);
          //   break;
          // case 66: // 部件属性组
          //   console.log(it, '部件属性组', PartData);
          //   break;
          default:
            // console.log(craftItem, productData, PartData);
            cannotJudge = true; // 不在上述中 不做判断 由系统后台判断
            break;
        }
        if (res && singleCondition.Constraint.FilterType === 2) bool = !bool; // 满足当前条件 且 满足任一
        if (!res && singleCondition.Constraint.FilterType === 1) bool = !bool; // 不满足当前条件 且 满足所有
      });
      // console.log('为true时即为满足该大条件:', bool); // 为true时即为满足该大条件
      if (bool && !cannotJudge) {
        // 找到当前部件中是否包含当前工艺
        // console.log('找到当前部件中是否包含当前工艺:', craftItem.CraftID, PartData.PartCraftList2Req.First);
        const t = PartData.PartCraftList2Req.First.find(it => it.CraftID === craftItem.CraftID);
        if (!((t && singleCondition.UseStatus === 2) || (!t && singleCondition.UseStatus === 1))) {
          // 不满足条件
          return singleCondition.Tips;
        }
      }
    }
  }
};

const getVerifyResult4Craft4Product = (data, productData) => {
  if (data.ChoiceType === 2) return null; // 只判断可选工艺
  const _t = data.CraftList.filter(it => it.CraftCondition && it.CraftCondition.length > 0);
  if (_t.length === 0) return null;
  for (let i = 0; i < _t.length; i += 1) {
    const craftItem = _t[i]; // 有条件限制的工艺项目 -- 根据其限制条件找到对应的值进行判断
    for (let index = 0; index < craftItem.CraftCondition.length; index += 1) {
      const singleCondition = craftItem.CraftCondition[index];
      let bool = singleCondition.Constraint.FilterType === 1; // Tips 错误提示  FilterType 1 满足所有  2满足任一
      let cannotJudge = false;
      singleCondition.Constraint.ItemList.forEach(it => {
        if (singleCondition.Constraint.FilterType === 1 && !bool) return;
        if (singleCondition.Constraint.FilterType === 2 && bool) return;
        if (cannotJudge) return;
        let res = false; // 数值判断结果 -- 是否满足条件
        switch (it.PropertyType) {
          case 1: // 产品数量
            res = getJudgeResult(it.Value, it.Operator, productData.ProductAmount);
            break;
          default:
            cannotJudge = true; // 不在上述中 不做判断 由系统后台判断
            break;
        }
        if (res && singleCondition.Constraint.FilterType === 2) bool = !bool; // 满足当前条件 且 满足任一
        if (!res && singleCondition.Constraint.FilterType === 1) bool = !bool; // 不满足当前条件 且 满足所有
      });
      if (bool && !cannotJudge) {
        const t = productData.CraftList2Req.First.find(it => it.CraftID === craftItem.CraftID);
        if (!((t && singleCondition.UseStatus === 2) || (!t && singleCondition.UseStatus === 1))) {
          // 不满足条件
          return singleCondition.Tips;
        }
      }
    }
  }
};

export function getRelevanceInTargetValue(targetObj, RelevanceInformation) {
  const _arr = [];
  RelevanceInformation.forEach((Relevance) => {
    const _t = targetObj.PartList.find(it => it.PartID === Relevance.MasterProperty.PartID).PartList[0];
    // 暂只判断第一个部件中属性信息
    if (_t.PrintPropertyGroupList.length > 0) {
      // 印刷属性组
      for (let index = 0; index < _t.PrintPropertyGroupList.length; index += 1) {
        const element = _t.PrintPropertyGroupList[index];
        const res = getValue(element.PropertyList, Relevance.MasterProperty);
        if (res) {
          _arr.push(res.CustomerInputValue);
          return;
        }
      }
    }
    if (_t.PrintTypeList.length > 0) {
      // 印刷属性
      const res = getValue(_t.PrintTypeList, Relevance.MasterProperty);
      if (res) {
        _arr.push(res.CustomerInputValue);
        return;
      }
    }
    if (_t.PropertyGroupList.length > 0) {
      // 属性组
      for (let index = 0; index < _t.PropertyGroupList.length; index += 1) {
        const element = _t.PropertyGroupList[index];
        const res = getValue(element.PropertyList, Relevance.MasterProperty);
        if (res) {
          _arr.push(res.CustomerInputValue);
          return;
        }
      }
    }
    if (_t.PropertyList.length > 0) {
      // 属性
      const res = getValue(_t.PropertyList, Relevance.MasterProperty);
      if (res) {
        _arr.push(res.CustomerInputValue);
        return;
      }
    }
    if (_t.SizeGroup) {
      // 尺寸组
      // // console.log(RelevanceIndex);
      // // console.log(_t.SizePropertyList, Relevance, Relevance.MasterProperty, RelevanceInformation);
      const res = getValue(_t.SizePropertyList, Relevance.MasterProperty);
      // // console.log(res);
      // return;
      if (res && Relevance.Compare === 1) {
        const _obj = {};
        _obj.val = res.CustomerInputValue;
        _obj.Compare = Relevance.Compare;
        _arr.push(_obj);
      }
    }
  });
  // console.log('getRelevanceInTargetValue');
  return _arr;
  // })
}

export default class QuotationClassType {
  static init(obj) {
    // console.log(obj);
    if (!obj) return;
    const _obj = JSON.parse(JSON.stringify(obj));
    _obj.ProductAmount = '';
    _obj.KindCount = 1;
    _obj.MakeupRowNumber = 1;
    _obj.MakeupColumnNumber = 1;
    _obj.MultyKindMakeup = false;
    _obj.CraftList2Req = {
      // 产品工艺 ----------- 改名
      First: [],
      Second: true,
    };
    _obj.CraftList = _obj.CraftList.map(item => ({
      ...item,
      CraftList: item.CraftList.map(it2 => ({
        ...it2,
        disabled: false, // 是否禁用
        historyData: null, // 存放输入历史
        isSystemSelect: false, // 是否由系统勾选
        PositionID: item.PositionID,
        PropertyList: it2.PropertyList.map(it3 => ({
          ...it3,
          CustomizedOptionValue: null,
        })),
      })),
    }));

    // 设置必选工艺(不需进行额外选择的)默认勾选
    const _needCraftList = _obj.CraftList.find(it => it.ChoiceType === 2);
    if (_needCraftList && _needCraftList.CraftList.length > 0) {
      _needCraftList.CraftList.forEach(it => {
        if (it.PropertyList.length === 0) {
          const _it = JSON.parse(JSON.stringify(it));
          _it.PropertyList = [[]];
          _obj.CraftList2Req.First.push(_it);
        }
      });
    }

    _obj.PropertyList = _obj.PropertyList.map(item => ({
      ...item,
      CustomizedOptionValue: null,
      CustomerInputValue: item.ValueType === 2 ? item.OptionList[0].OptionID : '',
    }));
    _obj.PartList = _obj.PartList.map(Part => {
      const _CraftList = Part.CraftList.map(item => ({
        ...item,
        CraftList: item.CraftList.map(it2 => ({
          ...it2,
          disabled: false,
          historyData: null,
          isSystemSelect: false,
          PositionID: item.PositionID,
          PropertyList: it2.PropertyList.map(it3 => ({
            ...it3,
            CustomizedOptionValue: null,
          })),
        })),
      }));

      const _PartCraftList2Req = {
        // 部件工艺 ----------- 改名
        First: [],
        Second: true,
      };

      // eslint-disable-next-line no-shadow
      const _needCraftList = _CraftList.find(it => it.ChoiceType === 2);
      if (_needCraftList && _needCraftList.CraftList.length > 0) {
        _needCraftList.CraftList.forEach(it => {
          if (it.PropertyList.length === 0) {
            const _it = JSON.parse(JSON.stringify(it));
            _it.PropertyList = [[]];
            _PartCraftList2Req.First.push(_it);
          }
        });
      }
      return ({
        PartID: Part.PartID, // ok
        AllowChangePartNumber: true,
        PartList: [
          {
            ...Part,
            singlePartID: Part.PartID + (`${Math.random()}`).replace('.', ''),
            PartAmount: {
              First: '',
              Second: true,
            },
            Material: {
              // ok 物料
              First: Part.MaterialList && Part.MaterialList.length > 0 ? Part.MaterialList[0].MaterialID : '',
              Second: true,
            },
            MaterialBrand: {
              // ok 物料品牌
              First: Part.BrandList && Part.BrandList.length > 0 ? Part.BrandList[0].BrandID : '',
              Second: true,
            },
            Size: {
              // 尺寸
              First: '',
              Second: true,
            },
            SizePropertyList: [],
            PartCraftList2Req: _PartCraftList2Req,
            PropertyGroupList: [
              ...Part.PropertyGroupList.map(PropertyGroup => ({
                ...PropertyGroup,
                AllowCustomized: true,
                PropertyList: [
                  {
                    Second: PropertyGroup.PropertyList.map(Property => {
                      const _CustomerInputValue = Property.ValueType === 2 ? Property.OptionList[0].OptionID : '';
                      return ({
                        ...Property,
                        CustomizedOptionValue: null,
                        CustomerInputValue: _CustomerInputValue,
                      });
                    }),
                  },
                ],
              })),
            ],
            PrintPropertyGroupList: [
              ...Part.PrintPropertyGroupList.map(PrintPropertyGroup => ({
                ...PrintPropertyGroup,
                AllowCustomized: true,
                PropertyList: [
                  {
                    Second: PrintPropertyGroup.PropertyList.map(Property => ({
                      ...Property,
                      CustomizedOptionValue: null,
                      CustomerInputValue: Property.OptionList[0].OptionID,
                    })),
                  },
                ],
              })),
            ],
            PropertyList: [
              ...Part.PropertyList.map(Property => ({
                ...Property,
                CustomizedOptionValue: null,
                AllowCustomized: true,
                CustomerInputValue: Property.ValueType === 2 ? Property.OptionList[0].OptionID : '',
              })),
            ],
            CraftList: _CraftList,
            PrintTypeList: [
              ...Part.PrintTypeList.map(PrintType => ({
                ...PrintType,
                AllowCustomized: true,
                CustomerInputValue: PrintType.OptionList[0].OptionID,
              })),
            ],
          },
        ],
      });
    });

    return _obj;
  }

  // eslint-disable-next-line consistent-return
  static check(obj) {
    const curCraftRelationList = store.getters['Quotation/curCraftRelationList'];

    const {
      ProductAmount, KindCount, MakeupColumnNumber, MakeupRowNumber, MaxMakeupRowNumber,
      MaxMakeupColumnNumber, PropertyList, PartList,
    } = obj;

    // 产品数量校验
    const ProductAmountRules = [
      {
        strategy: 'isNotEmpty',
        errorMsg: '请输入产品数量!',
      },
      {
        strategy: 'isPositiveInt',
        errorMsg: '产品数量必须为大于0的整数类型',
      },
    ];
    if (!validateCheck(ProductAmount, ProductAmountRules, _setErrMsg)) return false;

    // 产品款数检验
    const KindCountRules = [
      {
        strategy: 'isNotEmpty',
        errorMsg: '请输入款数!',
      },
      {
        strategy: 'isPositiveInt',
        errorMsg: '产品款数必须为大于0的整数类型',
      },
    ];
    if (!validateCheck(KindCount, KindCountRules, _setErrMsg)) return false;

    // 联拼行数校验
    const RowNumberRules = [
      {
        strategy: 'isNotEmpty',
        errorMsg: '请输入联拼行数!',
      },
      {
        strategy: 'isPositiveInt',
        errorMsg: '联拼行数必须为大于0的整数',
      },
      {
        strategy: `Maximum:${MaxMakeupRowNumber}`,
        errorMsg: `最大联拼${MaxMakeupRowNumber}行`,
      },
      {
        strategy: 'Minimum:1',
        errorMsg: '最少联拼1行',
      },
    ];
    if (!validateCheck(MakeupRowNumber, RowNumberRules, _setErrMsg)) return false;

    // 联拼列数校验
    const ColumnNumberRules = [
      {
        strategy: 'isNotEmpty',
        errorMsg: '请输入联拼列数!',
      },
      {
        strategy: 'isPositiveInt',
        errorMsg: '联拼列数必须为大于0的整数',
      },
      {
        strategy: `Maximum:${MaxMakeupColumnNumber}`,
        errorMsg: `最多联拼${MaxMakeupColumnNumber}列`,
      },
      {
        strategy: 'Minimum:1',
        errorMsg: '最少联拼1列',
      },
    ];
    if (!validateCheck(MakeupColumnNumber, ColumnNumberRules, _setErrMsg)) return false;

    // 属性校验
    for (let i = 0; i < PropertyList.length; i += 1) {
      const item = PropertyList[i];
      const _name = item.PropertyName;
      let _value;
      let _rules;
      // eslint-disable-next-line no-nested-ternary
      const _max = item.MaxValue ? item.MaxValue === -1 ? Infinity : item.MaxValue : Infinity;
      if (item.ValueType === 1) {
        _rules = [
          {
            strategy: 'isNotEmpty',
            errorMsg: `${_name}值不能为空!`,
          },
          {
            strategy: 'isPositiveInt',
            errorMsg: `${_name}值必须为大于0的整数`,
          },
          {
            strategy: `Maximum:${_max}`,
            errorMsg: `${_name}值最大为${_max}`,
          },
          {
            strategy: `Minimum:${item.MinValue}`,
            errorMsg: `${_name}值最小为${item.MinValue}`,
          },
        ];
        _value = item.CustomerInputValue;
      } else {
        _value = item.CustomizedOptionValue ? item.CustomizedOptionValue : item.CustomerInputValue;
        _rules = [
          {
            strategy: 'isNotEmpty',
            errorMsg: `${_name}值不能为空!`,
          },
        ];
      }

      if (!validateCheck(_value, _rules, _setErrMsg)) return false;
    }

    // 产品工艺校验 --- 尚未考虑工艺间关联和互斥问题 后续添加   --- 正在处理
    const _ProductCraftList = obj.CraftList.filter(it => it.ChoiceType === 2);
    if (_ProductCraftList.length > 0) {
      const _isRequireCraftList = _ProductCraftList[0].CraftList;
      if (_isRequireCraftList.length > 0) {
        const _selectdCraftIdList = obj.CraftList2Req.First.map(it => it.CraftID);
        for (let i = 0; i < _isRequireCraftList.length; i += 1) {
          const item = _isRequireCraftList[i];
          // // console.log(`第${i}次调用外部------------------_checkCraft方法，当前判断的工艺为ite${item.CraftName}`)
          // // console.log(_isRequireCraftList, item, _selectdCraftIdList, curCraftRelationList, "接上面")
          const res = _checkCraft(_isRequireCraftList, item, _selectdCraftIdList, curCraftRelationList);
          // // console.log(res);
          if (res === false) {
            _setErrMsg(`主产品中[ ${item.CraftNickName} ]是必选工艺!`);
            return false;
          }
          // if (typeof res === 'string') {
          //   _setErrMsg(`主产品中[ ${item.CraftNickName} ]和[ ${res} ]两种工艺需要选择其中一种!`);
          //   return false;
          // }
        }
      }
    }

    for (let i = 0; i < obj.CraftList.length; i += 1) {
      const CraftInfoItem = obj.CraftList[i];
      console.log(obj);
      const verifyRes = getVerifyResult4Craft4Product(CraftInfoItem, obj); // 获取工艺条件判断限制验证结果 为字符串时即为返回的错误信息  其它则通过
      if (verifyRes && typeof verifyRes === 'string') {
        _setErrMsg(verifyRes);
        return false;
      }
    }

    // 部件校验
    for (let index = 0; index < PartList.length; index += 1) {
      const PartItem = PartList[index];
      // console.log(PartItem, index, '-------------PartItem-----------');
      for (let i = 0; i < PartItem.PartList.length; i += 1) {
        const Part = PartItem.PartList[i];

        // 校验部件数量
        const _PartCount = Part.PartAmount.First;
        const _PartName = Part.PartName;
        const _Multiple = Part.Multiple;
        // eslint-disable-next-line no-nested-ternary
        const _max = Part.MaxNumber ? Part.MaxNumber === -1 ? Infinity : Part.MaxNumber : Infinity;
        const _PartCountRules = [
          {
            strategy: 'isNotEmpty',
            errorMsg: `请输入${_PartName}数量!`,
          },
          {
            strategy: 'isPositiveInt',
            errorMsg: `${_PartName}数量必须为大于0的整数类型`,
          },
          {
            strategy: `Maximum:${_max}`,
            errorMsg: `${_PartName}数量最大为${_max}`,
          },
          {
            strategy: `Minimum:${Part.MinNumber}`,
            errorMsg: `${_PartName}数量最小为${Part.MinNumber}`,
          },
          {
            strategy: `isMultiple:${_Multiple}`,
            errorMsg: `${_PartName}数量必须是${_Multiple}的倍数`,
          },
        ];
        if (!validateCheck(_PartCount, _PartCountRules, _setErrMsg)) return false;

        // 校验物料  ------------------ 设置默认值

        // 尺寸组校验
        if (Part.SizeGroup && Part.SizePropertyList.length < Part.SizeGroup.PropertyList.length) {
          // _setErrMsg(`请补充部件${Part.PartName}中${Part.SizeGroup.GroupName}信息`);
          _setErrMsg(`尺寸${Part.SizeGroup.PropertyList[0].PropertyName}值不能为空!`);
          return false;
        }
        // eslint-disable-next-line no-shadow
        for (let i = 0; i < Part.SizePropertyList.length; i += 1) {
          const item = Part.SizeGroup.PropertyList[i];
          const _value = Part.SizePropertyList[i].CustomerInputValue;
          const _name = item.PropertyName;
          // eslint-disable-next-line no-shadow
          const _max = item.MaxValue ? item.MaxValue === -1 ? Infinity : item.MaxValue : Infinity;
          const _rules = [
            {
              strategy: 'isNotEmpty',
              errorMsg: `尺寸${_name}值不能为空!`,
            },
            {
              strategy: 'isNotNum',
              errorMsg: `尺寸${_name}值必须为大于0的数字类型`,
            },
            {
              strategy: 'Minimum:0',
              errorMsg: `尺寸${_name}值必须为大于0的数字类型`,
            },
            {
              strategy: `Maximum:${_max}`,
              errorMsg: `尺寸${_name}值最大为${_max}`,
            },
            {
              strategy: `Minimum:${item.MinValue}`,
              errorMsg: `尺寸${_name}值最小为${item.MinValue}`,
            },
          ];
          if (!validateCheck(_value, _rules, _setErrMsg)) return false;
        }

        // 部件属性校验
        for (let i = 0; i < Part.PropertyList.length; i += 1) {
          const item = Part.PropertyList[i];
          const _name = item.PropertyName;
          let _value;
          let _rules;
          const _max = item.MaxValue ? item.MaxValue === -1 ? Infinity : item.MaxValue : Infinity;
          if (item.ValueType === 1) {
            _rules = [
              {
                strategy: 'isNotEmpty',
                errorMsg: `${Part.PartName}中${_name}值不能为空!`,
              },
              {
                strategy: 'isPositiveInt',
                errorMsg: `${Part.PartName}中${_name}值必须为大于0的整数`,
              },
              {
                strategy: `Maximum:${_max}`,
                errorMsg: `${Part.PartName}中${_name}值最大为${_max}`,
              },
              {
                strategy: `Minimum:${item.MinValue}`,
                errorMsg: `${Part.PartName}中${_name}值最小为${item.MinValue}`,
              },
            ];
            _value = item.CustomerInputValue;
          } else {
            _value = item.CustomizedOptionValue ? item.CustomizedOptionValue : item.CustomerInputValue;
            _rules = [
              {
                strategy: 'isNotEmpty',
                errorMsg: `${Part.PartName}中${_name}值不能为空!`,
              },
            ];
          }

          if (!validateCheck(_value, _rules, _setErrMsg)) return false;
        }

        // 印刷属性暂不校验 --- 设置默认选项

        // 印刷属性组不校验 --- 设置默认选项

        // 属性组校验
        for (let i = 0; i < Part.PropertyGroupList.length; i += 1) {
          const PropertyGroup = Part.PropertyGroupList[i];
          for (let i2 = 0; i2 < PropertyGroup.PropertyList.length; i2 += 1) {
            const Property = PropertyGroup.PropertyList[i2];
            for (let i3 = 0; i3 < Property.Second.length; i3 += 1) {
              const item = Property.Second[i3];
              const _firstName = PropertyGroup.GroupName;
              const _name = item.PropertyName;
              let _value;
              let _rules;
              if (item.ValueType === 1) {
                const _max = item.MaxValue ? item.MaxValue === -1 ? Infinity : item.MaxValue : Infinity;
                _rules = [
                  {
                    strategy: 'isNotEmpty',
                    errorMsg: `${_firstName}${_name}值不能为空!`,
                  },
                  {
                    strategy: 'isPositiveInt',
                    errorMsg: `${_firstName}${_name}值必须为大于0的整数`,
                  },
                  {
                    strategy: `Maximum:${_max}`,
                    errorMsg: `${_firstName}${_name}值最大为${_max}`,
                  },
                  {
                    strategy: `Minimum:${item.MinValue}`,
                    errorMsg: `${_firstName}${_name}值最小为${item.MinValue}`,
                  },
                ];
                _value = item.CustomerInputValue;
              } else {
                _value = item.CustomizedOptionValue ? item.CustomizedOptionValue : item.CustomerInputValue;
                _rules = [
                  {
                    strategy: 'isNotEmpty',
                    errorMsg: `${_firstName}${_name}值不能为空!`,
                  },
                ];
              }

              if (!validateCheck(_value, _rules, _setErrMsg)) return false;
            }
          }
        }
        // 部件工艺校验
        const _PartCraftList = Part.CraftList.filter(it => it.ChoiceType === 2);
        if (_PartCraftList.length > 0) {
          const _isRequireCraftList = _PartCraftList[0].CraftList;
          if (_isRequireCraftList.length > 0) {
            const _selectdCraftIdList = Part.PartCraftList2Req.First.map(it => it.CraftID);
            // console.log(_isRequireCraftList, _selectdCraftIdList, _PartCraftList, Part.CraftList);
            for (let i = 0; i < _isRequireCraftList.length; i += 1) {
              const item = _isRequireCraftList[i];
              const res = _checkCraft(_isRequireCraftList, item, _selectdCraftIdList, curCraftRelationList);
              // // console.log(res);
              if (res === false) {
                _setErrMsg(`${_PartName}中[ ${item.CraftNickName} ]是必选工艺!`);
                return false;
              }
              // if (typeof res === 'string') {
              //   _setErrMsg(`${_PartName}中[ ${item.CraftNickName} ]和[ ${res} ]两种工艺需要选择其中一种!`);
              //   return false;
              // }
              // if (!_selectdCraftIdList.includes(item.CraftID)) {
              //   if (curCraftRelationList.length === 0) {
              //     _setErrMsg(`${Part.PartName}中${item.CraftNickName}是必选工艺!`);
              //     return false;
              //   } else {
              //     // 只判断互斥关系即可
              //     let key = true;
              //     for (let _i = 0; _i < curCraftRelationList.length; _i += 1) {
              //       const rule = curCraftRelationList[_i];
              //       if (rule.RelationType === 1) {
              //         const _t = rule.CraftList.find(_c => _c.CraftID === item.CraftID);
              //         if (_t) {
              //           for (let _i2 = 0; _i2 < rule.CraftList.length; _i2 += 1) {
              //             const _subC = rule.CraftList[_i2];
              //             if (_subC.CraftID !== _t.CraftID) {
              //               if (_selectdCraftIdList.includes(_subC.CraftID)) {
              //                 key = false;
              //                 break;
              //               };
              //             }
              //           }
              //         }
              //       }
              //     }
              //     if (key) {
              //       _setErrMsg(`${Part.PartName}中${item.CraftNickName}是必选工艺!`);
              //       return false;
              //     }
              //   }
              // }
            }
          }
        }

        // 工艺条件判断
        for (let i = 0; i < Part.CraftList.length; i += 1) {
          const CraftInfoItem = Part.CraftList[i];
          const verifyRes = getVerifyResult4Craft(CraftInfoItem, obj, Part); // 获取工艺条件判断限制验证结果 为字符串时即为返回的错误信息  其它则通过
          if (verifyRes && typeof verifyRes === 'string') {
            _setErrMsg(verifyRes);
            return false;
          }
        }

        // return true;
      }
    }
  }

  static transform(obj) {
    const _obj = JSON.parse(JSON.stringify(obj));
    const _condition = {};
    const {
      ProductAmount, ProductID, KindCount, MakeupColumnNumber, MakeupRowNumber,
      MultyKindMakeup, CraftList2Req, PropertyList, PartList, Factory,
    } = _obj;
    _condition.ProductAmount = ProductAmount;
    _condition.ProductID = ProductID;
    _condition.KindCount = KindCount;
    _condition.MakeupColumnNumber = MakeupColumnNumber;
    _condition.MakeupRowNumber = MakeupRowNumber;
    _condition.MultyKindMakeup = MultyKindMakeup;
    _condition.FactoryID = Factory.FactoryID ? Factory.FactoryID : null;
    _condition.CraftList = CraftList2Req; // 处理产品工艺信息
    _condition.CraftList.First = _condition.CraftList.First.map(item => ({
      CraftID: item.CraftID,
      PositionID: item.PositionID,
      PropertyList: item.PropertyList.map(it2Arr => _getProperty(it2Arr)),
    }));
    _condition.PropertyList = _getProperty(PropertyList);
    _condition.PartList = PartList.map(item => ({
      PartID: item.PartID,
      PartList: item.PartList.map(it2 => {
        const _CraftList = it2.PartCraftList2Req; // 处理部件工艺

        _CraftList.First = _CraftList.First.map(item => ({
          CraftID: item.CraftID,
          PositionID: item.PositionID,
          PropertyList: item.PropertyList.map(it2Arr => _getProperty(it2Arr)),
        }));

        const _PropertyList = _getProperty([...it2.PropertyList, ...it2.PrintTypeList]);

        let _PropertyGroupList = [...it2.PropertyGroupList, ...it2.PrintPropertyGroupList]; // 处理部件属性组与印刷属性组(合2为1)

        _PropertyGroupList = _PropertyGroupList.map(item => {
          const _PropertyList = item.PropertyList.map(it2 => {
            // // console.log(it2);
            const _Second = _getProperty(it2.Second, true);
            // const
            return ({
              Second: _Second,
              OptionList: it2.OptionList,
            });
          });
          return ({
            GroupID: item.GroupID,
            PropertyList: _PropertyList,
          });
        });

        return ({
          PartID: it2.PartID,
          CraftList: _CraftList,
          Material: it2.Material,
          MaterialBrand: it2.MaterialBrand,
          PartAmount: it2.PartAmount,
          PropertyList: _PropertyList,
          PropertyGroupList: _PropertyGroupList,
          SizePropertyList: it2.SizePropertyList,
          Size: it2.Size,
        });
      }),
    }));

    return _condition;
  }

  static filter(obj) {
    if (!obj) return;
    const _obj = obj;
    if (_obj.CraftList.First.length === 0) delete _obj.CraftList;
    if (_obj.PropertyList.length === 0) delete _obj.PropertyList;
    _obj.PartList.forEach(item => {
      item.PartList.forEach(it2 => {
        if (it2.CraftList.First.length === 0) delete it2.CraftList;
        if (!it2.Material.First) delete it2.Material;
        if (!it2.Size.First) delete it2.Size;
        if (!it2.MaterialBrand.First) delete it2.MaterialBrand;
        if (it2.PropertyGroupList.length === 0) delete it2.PropertyGroupList;
        if (it2.PropertyList.length === 0) delete it2.PropertyList;
        if (it2.SizePropertyList.length === 0) delete it2.SizePropertyList;
      });
    });
    return _obj;
  }

  // 设置回填默认产品
  static backfillDefaultProduct(obj, item) {
    // console.log(obj, item);
    // 1. 回填产品工艺信息  -----  根据客户端情况来看： 工艺禁用不做判断(含部件工艺)
    // eslint-disable-next-line max-len
    const requiredCraftIDList = obj.CraftList.find(it => it.ChoiceType === 2) ? obj.CraftList.find(it => it.ChoiceType === 2).CraftList.map(it => it.CraftID) : [];
    obj.CraftList2Req.First = obj.CraftList2Req.First.filter(it => requiredCraftIDList.includes(it.CraftID));
    if (item.CraftList.First.length > 0) {
      const _listData = obj.CraftList.find(it => it.ChoiceType === 1);
      _listData.AllowCustomized = item.CraftList.Second;
      item.CraftList.First.forEach(it => {
        if (obj.CraftList2Req.First.find(_it => _it.CraftID === it.CraftID)) return;
        const _t = _listData.CraftList.find(_it => _it.CraftID === it.CraftID);
        if (_t) {
          if (obj.CraftList2Req.First) obj.CraftList2Req.First.push(_t);
        }
      });
    }

    // 2. 回填产品部件信息
    item.PartList.forEach((partItem) => {
      const _t = obj.PartList.find(it => it.PartID === partItem.PartID);
      // 是否允许增减部件数量
      _t.AllowChangePartNumber = partItem.AllowChangePartNumber;

      // 删除多余的
      if (_t.PartList.length > partItem.PartList.length) {
        const _num = _t.PartList.length - partItem.PartList.length;
        _t.PartList.splice(partItem.PartList.length, _num);
      }

      partItem.PartList.forEach((part, i) => {
        if (!_t.PartList[i] && i === 0) return;
        if (!_t.PartList[i] && i > 0) _t.PartList[i].push(JSON.parse(JSON.stringify(_t.PartList[0])));

        // 2.1 回填部件数量
        if (part.PartAmount.First) {
          _t.PartList[i].PartAmount.First = part.PartAmount.First;
          _t.PartList[i].PartAmount.Second = part.PartAmount.Second; // 判断是否允许客户自定义输入
        }

        // 2.2 回填部件尺寸组
        if (part.Size.First !== '00000000-0000-0000-0000-000000000000') {
          _t.PartList[i].Size.First = part.Size.First;
          _t.PartList[i].Size.Second = part.Size.Second;
        }

        // 2.2 回填部件物料
        if (part.Material.First !== '00000000-0000-0000-0000-000000000000') {
          _t.PartList[i].Material.First = part.Material.First;
          _t.PartList[i].Material.Second = part.Material.Second;
        }

        // 2.3 回填印刷属性 和 普通属性
        if (part.PropertyList.length > 0) {
          part.PropertyList.forEach(prop => {
            let _tProp;
            _tProp = _t.PartList[i].PrintTypeList.find(_it => _it.PropertyID === prop.PropertyID);
            if (!_tProp) _tProp = _t.PartList[i].PropertyList.find(_it => _it.PropertyID === prop.PropertyID);
            if (_tProp) {
              _tProp.CustomerInputValue = prop.CustomerInputValue;
              _tProp.AllowCustomized = prop.AllowCustomized;
            }
          });
        }

        // 2.4 回填印刷属性组 和 普通属性组
        if (part.PropertyGroupList.length > 0) {
          part.PropertyGroupList.forEach(prop => {
            let _tGroup;
            _tGroup = _t.PartList[i].PrintPropertyGroupList.find(_it => _it.GroupID === prop.GroupID);
            if (!_tGroup) _tGroup = _t.PartList[i].PropertyGroupList.find(_it => _it.GroupID === prop.GroupID);
            if (_tGroup) {
              _tGroup.AllowCustomized = prop.AllowCustomized;

              // 删除多余的
              if (_tGroup.PropertyList.length > prop.PropertyList.length) {
                const _num = _tGroup.PropertyList.length - prop.PropertyList.length;
                _tGroup.PropertyList.splice(prop.PropertyList.length, _num);
              }

              prop.PropertyList.forEach((item, i) => {
                if (!_tGroup.PropertyList[i] && i === 0) return;
                if (!_tGroup.PropertyList[i] && i > 0) _tGroup.PropertyList.push(JSON.parse(JSON.stringify(_tGroup.PropertyList[0])));

                item.Second.forEach(subItem => {
                  const _tProp = _tGroup.PropertyList[i].Second.find(it => it.PropertyID === subItem.PropertyID);
                  if (_tProp) {
                    _tProp.AllowCustomized = subItem.AllowCustomized;
                    _tProp.CustomerInputValue = subItem.CustomerInputValue;
                  }
                });
              });
            }
          });
        }

        // 2.5 回填工艺信息 PartList

        const craftList2NoRequire = _t.PartList[i].CraftList.find(it => it.ChoiceType === 2);
        const requiredCraftIDList = craftList2NoRequire ? craftList2NoRequire.CraftList.map(it => it.CraftID) : [];
        _t.PartList[i].PartCraftList2Req.First = _t.PartList[i].PartCraftList2Req.First.filter(it => requiredCraftIDList.includes(it.CraftID));
        if (part.CraftList.First.length > 0) {
          const _listData = _t.PartList[i].CraftList.find(it => it.ChoiceType === 1);
          _listData.AllowCustomized = part.CraftList.Second;
          part.CraftList.First.forEach(it => {
            if (_t.PartList[i].PartCraftList2Req.First.find(_it => _it.CraftID === it.CraftID)) return;
            const _target = _listData.CraftList.find(_it => _it.CraftID === it.CraftID);
            if (_target) {
              if (_t.PartList[i].PartCraftList2Req.First) _t.PartList[i].PartCraftList2Req.First.push(_target);
            }
          });
        }
      });
    });
  }

  // 处理属性关联， 给有属性关联信息的属性上添加上相关信息
  static handlePropertyRelevanceList(obj) {
    if (!obj) return;
    const _obj = obj;
    if (_obj.PropertyRelevanceList.length === 0) return _obj;
    _obj.PropertyRelevanceList.forEach(Relevance => {
      // console.log(Relevance);
      if (Relevance.Compare && Relevance.MasterProperty.PropertyID === Relevance.RelevanceProperty.PropertyID && Relevance.MasterProperty.PartID === Relevance.RelevanceProperty.PartID) return;
      const _t = _obj.PartList.find((item) => Relevance.RelevanceProperty.PartID === item.PartID);
      if (_t.PrintPropertyGroupList.length > 0) {
        // 印刷属性组
        for (let index = 0; index < _t.PrintPropertyGroupList.length; index += 1) {
          const element = _t.PrintPropertyGroupList[index];
          mountRelevanceInformation(element.PropertyList, Relevance);
        }
      }
      if (_t.PrintTypeList.length > 0) {
        // 印刷属性
        mountRelevanceInformation(_t.PrintTypeList, Relevance);
      }
      if (_t.PropertyGroupList.length > 0) {
        // 属性组
        for (let index = 0; index < _t.PropertyGroupList.length; index += 1) {
          const element = _t.PropertyGroupList[index];
          mountRelevanceInformation(element.PropertyList, Relevance);
        }
      }
      if (_t.PropertyList.length > 0) {
        mountRelevanceInformation(_t.PropertyList, Relevance);
      }
      if (_t.SizeGroup) {
        // 尺寸组
        mountRelevanceInformation(_t.SizeGroup.PropertyList, Relevance);
      }
    });
  }

  // 处理工艺上的条件判断，给设置有条件判断的工艺上添加相关信息
  static handleCraftConditionList(obj) {
    if (!obj) return {};
    const _obj = obj;
    if (_obj.CraftConditionList.length > 0) {
      _obj.CraftConditionList.forEach(it => {
        it.CraftList.forEach(craftId => {
          _obj.CraftList.forEach(CraftItemList => {
            if (CraftItemList.ChoiceType === 2) return;
            const _t = CraftItemList.CraftList.find(_Craft => _Craft.CraftID === craftId);
            if (_t) {
              if (!_t.CraftCondition) {
                _t.CraftCondition = [{ ...it, type: 'isMain' }];
              } else {
                _t.CraftCondition.push({ ...it, type: 'isMain' });
              }
            }
          });
        });
      });
    }
    _obj.PartList.forEach(part => {
      if (part.CraftConditionList && part.CraftConditionList.length > 0) {
        part.CraftConditionList.forEach(it => {
          it.CraftList.forEach(craftId => {
            part.CraftList.forEach(CraftItemList => {
              if (CraftItemList.ChoiceType === 2) return;
              const _t = CraftItemList.CraftList.find(_Craft => _Craft.CraftID === craftId);
              if (_t) {
                if (!_t.CraftCondition) {
                  _t.CraftCondition = [{ ...it }];
                } else {
                  _t.CraftCondition.push({ ...it });
                }
              }
            });
          });
        });
      }
    });
  }
}
