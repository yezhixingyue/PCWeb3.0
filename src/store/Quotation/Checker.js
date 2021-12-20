/* eslint-disable arrow-body-style */
/* eslint-disable object-curly-newline */

import { getNumberValueList, getValueIsOrNotNumber } from '@/assets/js/utils/utils';
import { getCombineAffectedPropList, getPropertiesAffectedByInteraction } from '@/store/Quotation/EffectiveControlList';
import InterAction from '@/store/Quotation/Interaction';

const getMatchedValuesInSection = (ValueList, MinValue, MaxValue) => {
  const list = ValueList.filter(it => it > MinValue && (it <= MaxValue || MaxValue === -1));
  return list;
};

const checkNumberSectionList = (value, SectionList, valueList, { propName, Unit }) => {
  let isInSection = false;
  let msgArr = [];
  for (let i = 0; i < SectionList.length; i += 1) {
    const section = SectionList[i];
    const { MinValue, MaxValue, IsGeneralValue, Increment } = section;
    if (+value > MinValue && (+value <= MaxValue || MaxValue === -1)) { // 符合范围区间 进入判断
      isInSection = true;
      let temp = null;
      if (!IsGeneralValue) {
        let T = Increment.toString().indexOf('.');
        T = T === -1 ? 0 : Increment.toString().length - T - 1;
        const arr = new Array(T);
        arr.fill('0');
        T = `1${arr.join('')}`;
        if ((+value * T - MinValue * T) % (Increment * T) !== 0) {
          temp = {
            MinValue,
            MaxValue,
            IncrementList: [Increment],
            isIncrement: true,
          };
        }
      }
      if (IsGeneralValue && valueList) {
        temp = {
          MinValue,
          MaxValue,
          ValueList: valueList,
          isIncrement: false,
        };
      }
      if (temp) {
        const t = msgArr.find(it => it.MinValue === MinValue && it.MaxValue === MaxValue);
        if (!t) {
          msgArr.push(temp);
        } else if (t.isIncrement && !t.IncrementList.includes(Increment)) {
          t.IncrementList.push(Increment);
        }
      } else {
        msgArr.push('isRight');
      }
    }
  }
  if (!isInSection) {
    const list = [];
    SectionList.forEach(it => {
      const { MinValue, MaxValue } = it;
      const t = list.find(_it => _it.MinValue === MinValue && _it.MaxValue === MaxValue);
      if (!t) list.push(it);
    });
    const minList = list.map(it => it.MinValue);
    const maxList = list.map(it => it.MaxValue);
    const min = Math.min(...minList);
    if (value <= min) return `${propName}必须大于${min}${Unit}`;
    const max = Math.max(...maxList);
    if (value > max) return `${propName}不能超过${max}${Unit}`;
    const _arrText = list.map(({ MinValue, MaxValue }) => {
      if (MaxValue === -1) return `大于${MinValue}`;
      return `大于${MinValue}且小于等于${MaxValue}`;
    }).join('、');
    const msg = `${propName}输入不正确，不在取值范围内，可选取值范围：${_arrText}`;
    return msg;
  }

  msgArr = msgArr.map(it => {
    if (typeof it === 'object') {
      const { MinValue, MaxValue, isIncrement, IncrementList, ValueList } = it;
      if (isIncrement) {
        const list = IncrementList.map(_it => `${_it}${Unit}`);
        return `${MinValue}${Unit}以上每次增加${list.join('或')}`;
      }
      const filterValueList = getMatchedValuesInSection(ValueList, MinValue, MaxValue);
      if (MaxValue === -1) {
        return `${MinValue}${Unit}以上应从${filterValueList}中取值`;
      }
      return `[ 大于${MinValue}且小于等于${MaxValue} ]时应从${filterValueList}中取值`;
    }
    return it;
  });
  const t = msgArr.find(it => it === 'isRight');
  if (t === undefined) {
    return `${propName}${msgArr.join(' 或 ')}`;
  }
  return '';
};

/**
 * @description: 检查元素值是否符合规范
 * @param {*} value 值
 * @param {*} element 所赋值的元素
 * @return {*}
 */
const _elementTypeChecker = (value, element, showPropName, PartName) => {
  if (!value && value !== 0) return { msg: '值未设置', result: false };
  const { Type, NumbericAttribute, OptionAttribute, HiddenToCustomer, Name, Unit } = element; // 开关类型暂未判断 或可不需要
  if (Type === 1) { // 数值类型元素
    const { AllowDecimal, SectionList, InputContent, Allow, AllowCustomer } = NumbericAttribute;
    const isConformNumberType = getValueIsOrNotNumber(value, !AllowDecimal);
    if (!isConformNumberType) {
      const msg = `${showPropName ? `[${PartName || ''}${Name}] ` : ''}不正确，请输入正确的数字类型（${AllowDecimal ? '允许小数' : '不允许小数'}）`;
      return { msg, result: false };
    }
    if (SectionList && Array.isArray(SectionList) && SectionList.length > 0) {
      const valueList = getNumberValueList(InputContent);
      if (valueList.includes(`${value}`)) {
        return { msg: '', result: true };
      }
      if (!Allow && !valueList.includes(`${value}`)) {
        return { msg: `${showPropName ? `[${PartName || ''}${Name}] ` : ''}值不正确，请从${valueList}中取值`, result: false };
      }
      if (!AllowCustomer && !HiddenToCustomer && !valueList.includes(`${value}`)) {
        return { msg: `${showPropName ? `[${PartName || ''}${Name}] ` : ''}值不正确，请从${valueList}中取值`, result: false };
      }
      const msg = checkNumberSectionList(value, SectionList, valueList, { propName: showPropName ? Name : '', Unit });
      if (msg) return { msg, result: false };
    }
    return { msg: '', result: true };
  }
  if (Type === 2) { // 选项元素
    const { Allow, OptionList } = OptionAttribute;
    const optionIDs = OptionList.map(it => it.ID);
    if (!Allow && !optionIDs.includes(value) && !HiddenToCustomer) {
      return { msg: `${showPropName ? `[${PartName || ''}${Name}] ` : ''}不允许自定义`, result: false };
    }
    return { msg: '', result: true };
  }
  return { msg: '', result: true };
};

/**
 * @description: 验证元素，返回错误结果，空串则代表验证通过
 * @param {*}
 * @return {*}
 */
export const checkElement = ({ values, prop, AffectedPropList, showPropName, PartName }) => {
  if (!prop || !values) return '';
  const _showPropName = typeof showPropName === 'boolean' ? showPropName : true;
  if (Array.isArray(AffectedPropList) && AffectedPropList.length > 0) {
    // 如果已经被禁用，则直接返回空字符串，不再进行验证
    if (InterAction.getDisabledOrNot(AffectedPropList) || InterAction.getIsHiddenOrNot(AffectedPropList)) return '';
    if (prop.Type === 2) { // 选项元素，判断是否有值在禁用或隐藏列表中
      const disabledList = InterAction.getDisabledOptionList(AffectedPropList);
      const hiddenList = InterAction.getHiddenedOptionList(AffectedPropList);
      const requiredList = InterAction.getRequirededOptionList(AffectedPropList);
      const arr = [...disabledList, ...hiddenList];
      if (arr.length > 0) {
        const valueIDs = values.map(it => it.ID).filter(it => it);
        const t = arr.find(it => valueIDs.includes(it));
        if (t) {
          const target = prop.OptionAttribute?.OptionList?.find(_it => _it.ID === t);
          if (target) return `${_showPropName ? `[${PartName || ''}${prop.Name}] ` : ''}选项 [ ${target.Name} ]不可用，请删除或更换`;
        }
      }
      if (requiredList.length > 0) {
        const valueIDs = values.map(it => it.ID).filter(it => it);
        const t2 = requiredList.filter(it => !valueIDs.includes(it));
        if (t2.length > 0) {
          const target = t2.map(it => prop.OptionAttribute?.OptionList?.find(_it => _it.ID === it)).filter(it => it);
          if (target.length > 0) {
            const text = target.map(it => `[ ${it.Name} ]`).join('、');
            return `${_showPropName ? `[${PartName || ''}${prop.Name}] ` : ''}选项中 ${text} 为必选项`;
          }
        }
      }
    }
  }
  let IsRequired = false;
  let operation = '填写';
  if (prop.Type === 2 && (prop.OptionAttribute?.OptionList?.length > 0 || prop.OptionAttribute?.AllowCustomer === false)) {
    operation = '选择';
  }
  if (prop.NumbericAttribute && prop.NumbericAttribute.IsRequired) IsRequired = true;
  if (prop.OptionAttribute && prop.OptionAttribute.IsRequired) IsRequired = true;
  if (IsRequired && values && values.length === 0) return `请${operation}${PartName || ''}${prop.Name}`;
  // 判断是否为多选选项元素
  // let isMultiple = false;
  if (prop.Type === 2 && !prop.OptionAttribute.IsRadio) {
    // 多选元素
    const len = values.length;
    // 需要判断 1. 必选情况下 未选值 (长度为0)
    if (len === 0 && IsRequired) {
      return `请选择${PartName || ''}${prop.Name}`;
    }
    // 2. 在已选择的情况下(长度大于0)，选项的数量与限制数量不符合
    if (prop.OptionAttribute.UseTimes) {
      const { MinValue, MaxValue } = prop.OptionAttribute.UseTimes;
      if (((MinValue || MinValue === 0) && len < MinValue) || ((MaxValue || MaxValue === 0) && len > MaxValue)) {
        // 项数不符合
        if (MinValue === MaxValue) return `${_showPropName ? `${PartName || ''}${prop.Name}` : ''}必须选择${MinValue}项`;
        if (MaxValue === -1 || len < MinValue) return `${_showPropName ? `${PartName || ''}${prop.Name}` : ''}至少选择${MinValue}项`;
        if (len > MaxValue) return `${_showPropName ? `${PartName || ''}${prop.Name}` : ''}最多选择${MaxValue}项`;
        return `${_showPropName ? `${PartName || ''}${prop.Name}` : ''}应选择${MinValue}至${MaxValue}项`;
      }
    }
  }
  if (values && values.length === 1) {
    const [{ ID, Name, Value }] = values;
    if (!ID && !Name && !Value && IsRequired) return `请${operation}${PartName || ''}${prop.Name}`;
    if (Name || Value) {
      const res = _elementTypeChecker(Name || Value, prop, _showPropName, PartName);
      if (res) return res.msg;
    }
  }
  return '';
};

const getElementValue = CustomerInputValues => { // 返回字符串 或 数组 （可多选且多选时返回的数组）
  if (!Array.isArray(CustomerInputValues) || CustomerInputValues.length === 0) return '';
  const getSingleValue = (item) => {
    const { ID, Name, Value, IsOpen } = item;
    if (IsOpen === true || IsOpen === false) return IsOpen;
    if (!ID && !Name && !Value) return '';
    return ID || Value || Name;
  };
  if (CustomerInputValues.length === 1) {
    return getSingleValue(CustomerInputValues[0]);
  }
  return CustomerInputValues.map(it => getSingleValue(it));
};

const getStrArrIsRepeat = arr => { // 判断字符串组成的数组是否有重复项
  if (!Array.isArray(arr) || arr.length <= 1) return false;
  const obj = {};
  arr.forEach(it => {
    if (obj[it]) obj[it] += 1;
    else obj[it] = 0;
  });
  return Object.keys(obj).length < arr.length;
};

export const checkElementGroup = ({ valueList, prop, AffectedPropList, subGroupAffectedPropList, PartName }) => {
  // if (Array.isArray(AffectedPropList) && AffectedPropList.length > 0) {
  //   // 如果已经被禁用，则直接返回空字符串，不再进行验证
  //   if (InterAction.getDisabledOrNot(AffectedPropList)) return ''; // 使用该方法验证有问题--没有判断被禁用的是否为元素组本身 -- 由于元素组禁用和隐藏功能本身被废弃，故不再修改
  // }
  const groupName = prop && prop.Name && !prop.IsNameHidden ? `${PartName || ''}${prop.Name}` : '';
  // groupName = '';
  if (valueList && valueList.length > 0 && prop && prop.ElementList && prop.ElementList.length > 0) {
    const CustomerCanUseElementList = prop.ElementList.filter(it => !it.HiddenToCustomer);
    for (let i = 0; i < valueList.length; i += 1) {
      const itemValues = valueList[i]; // 单行所有元素组成的值列表
      const _AffectedPropList = AffectedPropList || [];
      const _subGroupAffectedPropList = subGroupAffectedPropList ? (subGroupAffectedPropList[i] || []) : [];
      const combineList = getCombineAffectedPropList(_AffectedPropList, _subGroupAffectedPropList); // 合并交互与子交互
      for (let index = 0; index < itemValues.List.length; index += 1) {
        const { ElementID, CustomerInputValues } = itemValues.List[index];
        const _Element = CustomerCanUseElementList.find(it => it.ID === ElementID);
        const ElementAffectedPropList = combineList.filter((_it) => _it.Property && _it.Property.Element
         && _Element && _it.Property.Element.ID === _Element.ID);
        const msg = checkElement({
          values: CustomerInputValues, prop: _Element, AffectedPropList: ElementAffectedPropList, PartName: groupName,
        });
        if (msg) return { msg, ElementID, index: i };
      }
    }
    for (let i = 0; i < CustomerCanUseElementList.length; i += 1) {
      const Element = CustomerCanUseElementList[i];
      if (Element.ForbidRepeat && valueList.length > 1) {
        const values = valueList.map(it => {
          const t = it.List.find(_it => _it.ElementID === Element.ID);
          if (t) {
            let _val = getElementValue(t.CustomerInputValues);
            const isNumber = getValueIsOrNotNumber(_val);
            if (isNumber) _val = +_val;
            if (!_val) return _val;
            if (Array.isArray(_val) && Element.Type === 2 && Element.OptionAttribute?.OptionList?.length > 0) {
              const list = Element.OptionAttribute.OptionList.filter(_it => _val.includes(_it.ID)).map(_it => _it.ID);
              return JSON.stringify(list);
            }
            return JSON.stringify(_val);
          }
          return '';
        }).filter(it => it !== '');
        if (getStrArrIsRepeat(values)) {
          return {
            msg: `${groupName}${groupName ? '' : (PartName || '')}${Element.Name}值不允许重复，请检查重复值`,
            ElementID: Element.ID,
            index: 'all',
          };
        }
      }
    }
  }
  return '';
};

export const checkSizeGroup = ({ value, prop, AffectedPropList, PartName }) => {
  const _sizeName = prop
    ? `${prop && prop.GroupInfo && prop.GroupInfo.Name && !prop.GroupInfo.IsNameHidden ? prop.GroupInfo.Name : ''}`
    : '';
  if (value && prop && !value.isCustomize && !value.ID) {
    return {
      msg: `请选择${PartName || ''}${_sizeName || '尺寸'}`,
      index: 0,
    };
  }
  if (Array.isArray(AffectedPropList) && AffectedPropList.length > 0) {
    // 如果已经被禁用，则直接返回空字符串，不再进行验证
    if (InterAction.getDisabledOrNot(AffectedPropList)) return '';
    if (value && prop && !value.isCustomize && value.ID) {
      const disabledList = InterAction.getDisabledOptionList(AffectedPropList);
      const hiddenList = InterAction.getHiddenedOptionList(AffectedPropList);
      const arr = [...disabledList, ...hiddenList];
      if (arr.length > 0 && arr.includes(value.ID)) {
        return { msg: `${PartName || ''}${_sizeName || '尺寸'}不可用，请更改`, index: 0 };
      }
    }
  }
  if (value && prop) {
    const { List, isCustomize } = value;
    if (isCustomize && prop.GroupInfo && prop.GroupInfo.ElementList) {
      for (let i = 0; i < List.length; i += 1) {
        const { ElementID, CustomerInputValues } = List[i];
        const _Element = prop.GroupInfo.ElementList.find(it => it.ID === ElementID);
        const msg = checkElement({ values: CustomerInputValues, prop: _Element, PartName: `${PartName || ''}${_sizeName || '尺寸'}` });
        // if (_sizeName && msg) msg = `${PartName || ''}${_sizeName}中，${msg}`;
        if (msg) return { msg, ElementID, index: 0 };
      }
    }
  }
  return '';
};

export const checkCraft = ({ value, prop, CraftConditionList, CraftList, AffectedPropList, curProductInfo2Quotation, PartName }) => {
  // 1. 找到应禁用或必选的工艺本身， 如果已被禁用则从列表中去除然后进行后面判断，如果是必选而没有选中则报错处理
  const _CraftList = CraftList.filter(it => !it.HiddenToCustomer);
  const diabledCraftIDs = InterAction.getDisabledCraftIDList(AffectedPropList);
  const _value = value.filter(_it => !diabledCraftIDs.includes(_it.CraftID));
  const requiredCraft = InterAction.getRequiredCraftIDList(AffectedPropList);
  if (requiredCraft.length > 0) {
    const selectedCraftIDs = _value.map(it => it.CraftID);
    const t = requiredCraft.find(it => !selectedCraftIDs.includes(it.CraftID));
    if (t) {
      const targetCraft = _CraftList.find(it => it.ID === t.CraftID);
      if (targetCraft) {
        let condition = '';
        if (Array.isArray(t._ConditionTextList)) {
          condition = t._ConditionTextList.join(' 并且 ');
          if (condition) condition = `当${condition}时，`;
        }
        return `${condition}${PartName || ''}[ ${targetCraft.ShowName} ] 工艺必选`;
      }
    }
  }
  // 判断是否有必选的单选工艺组，判断其是否已有选择，如果无则报错
  if (prop && Array.isArray(prop.List) && Array.isArray(CraftConditionList) && prop.List.length > 0 && Array.isArray(_CraftList) && _CraftList.length > 0) {
    const requiredList = CraftConditionList.filter(it => it.IsRequired);
    if (requiredList.length > 0) {
      for (let i = 0; i < requiredList.length; i += 1) {
        const { List } = requiredList[i];
        if (List && List.length > 0) {
          let bool;
          List.forEach(_it => {
            if (!bool && prop.List.includes(_it)) bool = true;
          });
          if (bool) {
            let target;
            for (let index = 0; index < List.length; index += 1) {
              const craftID = List[index];
              const _t = _value.find(_it => _it.CraftID === craftID);
              if (_t) {
                target = _t;
                break;
              }
            }
            if (!target) {
              const craftNames = List.map(_craftID => _CraftList.find(_it => _it.ID === _craftID))
                .filter(_it => _it && !_it.HiddenToCustomer).map(_it => _it.ShowName);
              if (craftNames.length === 1) return `${PartName || ''} [ ${craftNames[0]} ]为必选工艺`;
              return `${PartName ? `${PartName}中` : ''} [ ${craftNames.join('、')} ] 至少选择一种`;
            }
          }
        }
      }
    }
  }
  // 参数发生变动，请重新设置某某工艺参数 ---- 对工艺参数进行校验及报错
  if (prop && Array.isArray(prop.List) && prop.List.length > 0 && Array.isArray(_CraftList) && _CraftList.length > 0 && _value.length > 0) {
    // 1. 找出当前正在校验的工艺分组列表条目
    const list = _value.filter(it => prop.List.includes(it.CraftID));
    for (let i = 0; i < list.length; i += 1) {
      const craftValItem = list[i];
      // 2. 找到该工艺对应的参数数据
      const craftDataItem = _CraftList.find(it => it.ID === craftValItem.CraftID);
      // 3. 筛选出带参数的工艺进行校验
      if (Array.isArray(craftDataItem.ElementList) && craftDataItem.ElementList.length > 0) {
        // 工艺上带有元素
        for (let elIndex = 0; elIndex < craftValItem.ElementList.length; elIndex += 1) {
          const elValItem = craftValItem.ElementList[elIndex];
          const elDataItem = craftDataItem.ElementList.find(_it => _it.ID === elValItem.ElementID);
          if (elDataItem) {
            // 4. 找出对应的交互限制 需要
            const _elAffectedPropList = AffectedPropList
              .filter(_it => _it.Property.Craft && _it.Property.Craft.ID === craftDataItem.ID
                 && !_it.Property.Group
                 && _it.Property.Element && _it.Property.Element.ID === elDataItem.ID);
            const errMsg = checkElement({ values: elValItem.CustomerInputValues || [], prop: elDataItem, AffectedPropList: _elAffectedPropList });
            // 5. 对工艺设置参数进行校验并返回结果
            if (errMsg) return `${PartName ? `${PartName}` : ''}[ ${craftDataItem.Name} ] 工艺里面，${errMsg}`;
          }
        }
      }
      if (Array.isArray(craftDataItem.GroupList) && craftDataItem.GroupList.length > 0) {
        // 工艺上带有元素组
        for (let groupIndex = 0; groupIndex < craftValItem.GroupList.length; groupIndex += 1) {
          const groupValItem = craftValItem.GroupList[groupIndex];
          const groupDataItem = craftDataItem.GroupList.find(_it => _it.ID === groupValItem.GroupID);
          if (groupDataItem) {
            // 4. 找出对应的交互限制 需要
            const _groupAffectedPropList = AffectedPropList
              .filter(_it => _it.Property.Craft && _it.Property.Craft.ID === craftDataItem.ID
                 && _it.Property.Group && _it.Property.Group.ID === groupDataItem.ID);
            // 4.1 子交互
            let _subGroupAffectedPropList = [];
            if (groupValItem.SubControlList) {
              const { SubControlList } = groupValItem;
              _subGroupAffectedPropList = groupValItem.List
                .map(_item => ({ _CraftList: [{ GroupList: [{ GroupID: groupValItem.GroupID, List: [_item] }], CraftID: craftValItem.CraftID }] }))
                .map(_item => getPropertiesAffectedByInteraction({ ProductParams: _item, curProductInfo2Quotation, SubControlList }));
            }
            const errMsg = checkElementGroup({
              valueList: groupValItem.List || [],
              prop: groupDataItem,
              AffectedPropList: _groupAffectedPropList,
              subGroupAffectedPropList: _subGroupAffectedPropList,
            });
            // 5. 对工艺设置参数进行校验并返回结果
            if (errMsg.msg) return `${PartName ? `${PartName}` : ''}[ ${craftDataItem.Name} ] 工艺中，${errMsg.msg}`;
          }
        }
      }
    }
  }
  return '';
};

export default {
  checkElement,
  checkElementGroup,
  checkSizeGroup,
  checkCraft,
};
