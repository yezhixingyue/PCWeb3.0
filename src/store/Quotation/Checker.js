/* eslint-disable arrow-body-style */
/* eslint-disable object-curly-newline */

const pointStartNumberReg = /^\.\d+$/;

/**
 * @description: 给一个值，判断该值是否为数字类型，返回布尔值结果 但isInteger值为true时则判断是否为整数类型 为true则为数字类型
 * @param {*} val
 * @return {*}
 */
export const getValueIsOrNotNumber = (val, isInteger) => {
  if (!val && val !== 0) return false;
  if (pointStartNumberReg.test(val)) return false;
  const _val = typeof val === 'number' ? val : +val;
  let _bool = !Number.isNaN(_val);
  if (_bool && isInteger) _bool = Number.isInteger(_val);
  return _bool;
};

/**
 * @description: 把数字组成的数组字符串拆分开为数组
 * @param {*} valueList
 * @return {*}
 */
export const getNumberValueList = (valueList) => {
  const reg = /\s|,|，/;
  return valueList.split(reg).filter(it => it);
};

/**
 * @description: 检查元素值是否符合规范
 * @param {*} value 值
 * @param {*} element 所赋值的元素
 * @return {*}
 */
const _elementTypeChecker = (value, element) => {
  if (!value && value !== 0) return { msg: '值未设置', result: false };
  const { Type, NumbericAttribute, OptionAttribute, HiddenToCustomer } = element; // 开关类型暂未判断 或可不需要
  if (Type === 1) { // 数值类型元素
    const { AllowDecimal, SectionList, InputContent, Allow, AllowCustomer } = NumbericAttribute;
    const isConformNumberType = getValueIsOrNotNumber(+value, !AllowDecimal);
    if (!isConformNumberType) {
      const msg = `输入值错误，请输入正确的数字类型（${AllowDecimal ? '允许小数' : '不允许小数'}）`;
      return { msg, result: false };
    }
    if (SectionList && Array.isArray(SectionList) && SectionList.length > 0) {
      const valueList = getNumberValueList(InputContent);
      if (valueList.includes(`${value}`)) {
        return { msg: '', result: true };
      }
      if (!Allow && !valueList.includes(`${value}`)) {
        return { msg: `值不正确，不允许自定义，请从${valueList}中取值`, result: false };
      }
      if (!AllowCustomer && !HiddenToCustomer && !valueList.includes(`${value}`)) {
        return { msg: `值不正确，不允许客户自定义，请从${valueList}中取值`, result: false };
      }
      let isInSection = false;
      for (let i = 0; i < SectionList.length; i += 1) {
        const section = SectionList[i];
        const { MinValue, MaxValue, IsGeneralValue, Increment } = section;
        if (+value > MinValue && (+value <= MaxValue || MaxValue === -1)) { // 符合范围区间 进入判断
          isInSection = true;
          if (!IsGeneralValue && (+value - MinValue) % Increment !== 0) {
            const msg = `输入值不正确，（${MinValue}, ${MaxValue}]区间内应符合增量为${Increment}`;
            return { msg, result: false };
          }
          if (IsGeneralValue) {
            const msg = `输入值不正确，（${MinValue}, ${MaxValue}]区间内应从${valueList}对应区间中取值`;
            return { msg, result: false };
          }
        }
      }
      if (!isInSection) {
        const msg = '输入值不正确，不在分段控制范围内';
        return { msg, result: false };
      }
    }
    return { msg: '', result: true };
  }
  if (Type === 2) { // 选项元素
    const { Allow, OptionList } = OptionAttribute;
    const optionIDs = OptionList.map(it => it.ID);
    if (!Allow && !optionIDs.includes(value)) {
      return { msg: '该选项元素不允许自定义', result: false };
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
export const checkElement = (values, prop) => {
  let IsRequired = false;
  if (prop.NumbericAttribute && prop.NumbericAttribute.IsRequired) IsRequired = true;
  if (prop.OptionAttribute && prop.OptionAttribute.IsRequired) IsRequired = true;
  if (IsRequired && values.length === 0) return `请设置${prop.Name}`;
  // 判断是否为多选选项元素
  // let isMultiple = false;
  if (prop.Type === 2 && !prop.OptionAttribute.IsRadio) {
    // 多选元素
    const len = values.length;
    // 需要判断 1. 必选情况下 未选值 (长度为0)
    if (len === 0 && IsRequired) return `请选择${prop.Name}`;
    // 2. 在已选择的情况下(长度大于0)，选项的数量与限制数量不符合
    if (len > 0) {
      if (prop.OptionAttribute.UseTimes) {
        const { MinValue, MaxValue } = prop.OptionAttribute.UseTimes;
        if (((MinValue || MinValue === 0) && len < MinValue) || ((MaxValue || MaxValue === 0) && len > MaxValue)) {
          // 项数不符合
          if (MinValue === MaxValue) return `${prop.Name}项数选择不正确，应选择${MinValue}项`;
          return `${prop.Name}项数选择不正确，应选择${MinValue}至${MaxValue}项`;
        }
      }
    }
  }
  if (values.length === 1) {
    const [{ ID, Name, Value }] = values;
    if (!ID && !Name && !Value && IsRequired) return `请设置${prop.Name}`;
    if (Name || Value) {
      const res = _elementTypeChecker(Name || Value, prop);
      if (res) return res.msg;
    }
  }
  return '';
};

const getElementValue = CustomerInputValues => { // 返回字符串 或 数组 （可多选且多选时返回的数组）
  if (!Array.isArray(CustomerInputValues) || CustomerInputValues.length === 0) return '';
  const getSingleValue = (item) => {
    const { ID, Name, Value } = item;
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

export const checkElementGroup = (valueList, prop) => {
  if (valueList && valueList.length > 0 && prop && prop.ElementList && prop.ElementList.length > 0) {
    for (let i = 0; i < valueList.length; i += 1) {
      const itemValues = valueList[i]; // 单行所有元素组成的值列表
      for (let index = 0; index < itemValues.List.length; index += 1) {
        const { ElementID, CustomerInputValues } = itemValues.List[index];
        const _Element = prop.ElementList.find(it => it.ID === ElementID);
        const msg = checkElement(CustomerInputValues, _Element);
        if (msg) return { msg, ElementID, index: i };
      }
    }
    for (let i = 0; i < prop.ElementList.length; i += 1) {
      const Element = prop.ElementList[i];
      if (Element.ForbidRepeat && valueList.length > 1) {
        const values = valueList.map(it => {
          const t = it.List.find(_it => _it.ElementID === Element.ID);
          if (t) {
            return JSON.stringify(getElementValue(t.CustomerInputValues));
          }
          return '';
        });
        if (getStrArrIsRepeat(values)) {
          return {
            msg: `${Element.Name}值不允许重复，请检查`,
            ElementID: Element.ID,
            index: 'all',
          };
        }
      }
    }
  }
  return '';
};

export const checkSizeGroup = (value, prop) => {
  if (value && prop) {
    const { List, isCustomize } = value;
    if (isCustomize && prop.GroupInfo && prop.GroupInfo.ElementList) {
      for (let i = 0; i < List.length; i += 1) {
        const { ElementID, CustomerInputValues } = List[i];
        const _Element = prop.GroupInfo.ElementList.find(it => it.ID === ElementID);
        const msg = checkElement(CustomerInputValues, _Element);
        if (msg) return { msg, ElementID, index: 0 };
      }
    }
  }
  return '';
};

export const checkCraft = (value, prop, CraftConditionList, CraftList) => {
  // 判断是否有必选的单选工艺组，判断其是否已有选择，如果无则报错
  if (prop && Array.isArray(prop.List) && prop.List.length > 0 && Array.isArray(CraftList) && CraftList.length > 0) {
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
              const _t = value.find(_it => _it.CraftID === craftID);
              if (_t) {
                target = _t;
                break;
              }
            }
            if (!target) {
              const craftNames = List.map(_craftID => CraftList.find(_it => _it.ID === _craftID))
                .filter(_it => _it && !_it.HiddenToCustomer).map(_it => _it.ShowName);
              if (craftNames.length === 1) return `${craftNames[0]}为必选工艺`;
              return `${craftNames.join('、')}等${craftNames.length}种工艺中应至少选择一种工艺`;
            }
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
