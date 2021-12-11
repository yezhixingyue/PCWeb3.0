/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import { isEqual, isGreatThen, isLessThen } from '@/assets/js/utils/utils';

export const creatNewTargetValue = (DefaultOrDisabledValue, _El) => {
  // if (!DefaultOrDisabledValue && DefaultOrDisabledValue !== 0) return '';
  const _t = {
    CustomerInputValues: [{ IsInteractionResult: true }],
    DisabledValue: '',
    ElementID: _El.ID,
    disabledByInteraction: false,
    hiddenByInteraction: false,
  };
  _t.CustomerInputValues[0].Value = DefaultOrDisabledValue;
  if (_El.Type === 3) {
    let bool;
    if (DefaultOrDisabledValue === _El.SwitchAttribute.CloseValue) bool = false;
    if (DefaultOrDisabledValue === _El.SwitchAttribute.OpenValue) bool = true;
    if (typeof bool === 'boolean') _t.CustomerInputValues[0].IsOpen = bool;
  }
  if (_El.Type === 2) {
    const o = _El.OptionAttribute.OptionList.find(_it => _it.Value === DefaultOrDisabledValue);
    if (o) {
      _t.CustomerInputValues[0].ID = o.ID;
    }
  }
  return _t;
};

/**
 * @description: 获取元素的值，仅多选选项元素选取本身结果时返回数组；其它均返回单一值
 * @param {*}
 * @return {*}
 */
const getElementTypeValue = (Element, FixedType, ElementValList, ElementList, isSize, isGroup) => {
  if (!Element || !ElementValList || !ElementList) return null;
  let t = ElementValList.find(it => it.ElementID === Element.ID);
  const _El = ElementList.find(it => it.ID === Element.ID);
  if (!_El) return null;
  if (_El.HiddenToCustomer && (_El.DefaultValue || _El.DefaultValue === 0)) {
    // 对客户隐藏 但设置有隐藏值
    t = creatNewTargetValue(_El.DefaultValue, _El);
  }
  if (!t) return null;
  if (!_El.HiddenToCustomer && (t.hiddenByInteraction || t.disabledByInteraction)) {
    t = creatNewTargetValue(t.DisabledValue, _El);
  }
  // }
  if (!t.CustomerInputValues || t.CustomerInputValues.length === 0) {
    if (_El.Type === 2 && _El.OptionAttribute && !_El.OptionAttribute.IsRadio) return [];
    return null;
  }
  // 获取元素值
  let _Value = '';
  if (_El.Type === 2 && _El.OptionAttribute && !_El.OptionAttribute.IsRadio) { // 多选选项元素
    _Value = t.CustomerInputValues.map(it => it.ID).filter(it => it);
    // _Value = t.CustomerInputValues.map(it => it.ID || ''); // 不筛选空值
  } else {
    const [{ ID, Name, Value, IsOpen }] = t.CustomerInputValues;
    _Value = ID || Name || IsOpen;
    if (!_Value && _Value !== false) _Value = Value;
    if (isSize && ID) {
      const _t = _El.OptionAttribute.OptionList.find(it => it.ID === ID);
      return _t ? _t.Value : '';
    }
  }
  // 如果 FixedType 有值 存在4种情况： 已选项数、和、最大值、最小值
  if ((FixedType || FixedType === 0) && _El.Type === 2 && _El.OptionAttribute && _El.OptionAttribute.OptionList) {
    let FixedTypeValue = '';
    let _Vals;
    switch (FixedType) {
      case 0: // 已选项数
        FixedTypeValue = Array.isArray(_Value) ? _Value : [_Value];
        FixedTypeValue = FixedTypeValue.filter(it => it || it === 0);
        // return (it ? it.ID : _El.OptionAttribute.CustomizeValue);
        FixedTypeValue = FixedTypeValue.map(_ID => _El.OptionAttribute.OptionList.find(it => it.ID === _ID)).map(it => (it ? it.ID : Math.random().toString(16).slice(-8)));
        if (!isGroup) return FixedTypeValue.length;
        break;
      case 1: // 和
        FixedTypeValue = Array.isArray(_Value) ? _Value : [_Value];
        FixedTypeValue = FixedTypeValue.filter(it => it || it === 0);
        _Vals = FixedTypeValue.map(_ID => _El.OptionAttribute.OptionList.find(it => it.ID === _ID)).map(it => (it ? it.Value : _El.OptionAttribute.CustomizeValue));
        if (_Vals.length > 0) FixedTypeValue = _Vals.reduce((prev, next) => prev + next, 0);
        break;
      case 2: // 最小值
        FixedTypeValue = Array.isArray(_Value) ? _Value : [_Value];
        FixedTypeValue = FixedTypeValue.filter(it => it || it === 0);
        _Vals = FixedTypeValue.map(_ID => _El.OptionAttribute.OptionList.find(it => it.ID === _ID)).map(it => (it ? it.Value : _El.OptionAttribute.CustomizeValue));
        if (_Vals.length > 0) FixedTypeValue = Math.min(..._Vals);
        break;
      case 3: // 最大值
        FixedTypeValue = Array.isArray(_Value) ? _Value : [_Value];
        FixedTypeValue = FixedTypeValue.filter(it => it || it === 0);
        _Vals = FixedTypeValue.map(_ID => _El.OptionAttribute.OptionList.find(it => it.ID === _ID)).map(it => (it ? it.Value : _El.OptionAttribute.CustomizeValue));
        if (_Vals.length > 0) FixedTypeValue = Math.max(..._Vals);
        break;
      default:
        break;
    }
    return FixedTypeValue;
  }
  return _Value;
};

/**
 * @description: 获取元素组的值
 * @param {*}
 * @return {*}
 */
const getElementGroupTypeValue = (Element, FixedType, target, targetOriginData, isSubControl, ControlItem) => {
  let _GroupValue;
  if (target && targetOriginData) {
    if (!Element) { // 元素组本身
      if (FixedType === 4) _GroupValue = target.List.length; // 元素组使用次数
    } else {
      const ElValues = target.List.map(({ List }) => {
        const isSize = false;
        const isGroup = true;
        const _itemVal = getElementTypeValue(Element, FixedType, List, targetOriginData.ElementList, isSize, isGroup);
        return _itemVal;
      }).filter(_it => _it || _it === 0 || _it === false);
      if (ElValues.length === 0) {
        if (FixedType === 0) {
          return 0;
        }
        return null;
      }
      switch (FixedType) {
        case 0: // 已选项数 -- 此时ElValues中为目标元素已选项数的值，对其进行相加得出总已选项数
          _GroupValue = [...new Set(ElValues.reduce((prev, next) => [...prev, ...next], []))].length;
          break;
        case 1: // 和
          _GroupValue = ElValues.reduce((prev, next) => prev + next, 0);
          break;
        case 2: // 最小值
          _GroupValue = Math.min(...ElValues);
          break;
        case 3: // 最大值
          _GroupValue = Math.max(...ElValues);
          break;
        default:
          break;
      }
      if (!FixedType && FixedType !== 0) {
        if (Array.isArray(ElValues[0])) {
          _GroupValue = [...ElValues]; // 多选选项元素时
        } else { // 单选时
          // 此处需要判断所在元素组的使用次数
          const { UseTimes, ID } = targetOriginData;
          const { GroupID } = ControlItem;
          if ((UseTimes && UseTimes.MinValue === 1 && UseTimes.MaxValue === 1) || (isSubControl && GroupID && GroupID === ID)) { // 单次使用元素组的单选元素 - 直接返回值 -> 同普通元素（非元素组元素）
            const [_val] = ElValues;
            _GroupValue = _val;
          } else { // 多次使用元素组的单选元素
            _GroupValue = [...ElValues];
            if (_GroupValue.length < target.List.length) {
              const d = target.List.length - _GroupValue.length;
              _GroupValue = [..._GroupValue, ...new Array(d)];
            }
          }
        }
      }
    }
  }
  //  else if (targetOriginData) {
  //   if (Element) {

  //   }
  // }
  return _GroupValue;
};

/**
 * @description: 获取工艺值 （包含是否选中）
 * @param {*} Element, Group, FixedType, target, targetOriginData, Craft, isSubControl, ControlItem
 * @return {*}
 */
const getCraftTypeValue = (Element, Group, FixedType, target, targetOriginData, Craft, isSubControl, ControlItem) => {
  let _CraftValue;
  if (target && target.disabledByInteraction) _CraftValue = false;
  else if (!Element && !Group && !FixedType) _CraftValue = !!target && !target.disabledByInteraction; // 工艺是否选中 返回布尔值
  else if (target) {
    if (Group) { // 工艺上属性组
      const targetGroup = target.GroupList.find(_it => _it.GroupID === Group.ID);
      const targetGroupOriginData = targetOriginData.GroupList.find(_it => _it.ID === Group.ID);
      _CraftValue = getElementGroupTypeValue(Element, FixedType, targetGroup, targetGroupOriginData, isSubControl, ControlItem);
    } else {
      _CraftValue = getElementTypeValue(Element, FixedType, target.ElementList, targetOriginData.ElementList);
    }
  }
  return _CraftValue;
};

const getIsEqualBySizeListAndItemValues = (itemValues, SizeItemValues) => { // 尺寸相关： 判断自定义值与常规尺寸项目值是否相同
  if (Array.isArray(itemValues) && Array.isArray(SizeItemValues) && itemValues.length > 0 && SizeItemValues.length === itemValues.length) {
    const notEqualItem = itemValues.find(({ First, Second }) => {
      const _t = SizeItemValues.find(_it => _it.First === First);
      if (_t) {
        return !(isEqual(Second, _t.Second) || (Second === true && _t.Second === 'True') || (Second === false && _t.Second === 'False'));
      }
      return true;
    });
    return !notEqualItem;
  }
  return false;
};

const getSizeGroupIDByCustomizeSize = (ItemValueList, SizeList) => { // 尺寸相关：在常规尺寸中找到自定义尺寸所对应的常规尺寸的ID值，如果找不到则返回''
  if (!Array.isArray(ItemValueList) || !Array.isArray(SizeList) || ItemValueList.length === 0 || SizeList.length === 0) return '';
  const itemValues = ItemValueList.map(it => {
    const First = it.ElementID;
    let Second = '';
    const [{ ID, Name, Value, IsOpen }] = it.CustomerInputValues;
    Second = ID || Name || IsOpen;
    if (!Second && Second !== false) Second = Value;
    return { First, Second };
  });
  const t = SizeList.find(it => getIsEqualBySizeListAndItemValues(itemValues, it.List));
  return t ? t.ID : '';
};

const getSiztTypeValue = (Size, SizeGroup, Element, FixedType) => {
  if (!Size || !SizeGroup) return null;
  const { ID, List, isCustomize } = Size;
  if (FixedType === 35 && !isCustomize) { // 求值：是否为自定义 且明确为非自定义则直接返回结果，如不明确则后续继续判断
    if (isCustomize) {
      const _id = getSizeGroupIDByCustomizeSize(List, SizeGroup.SizeList);
      if (!_id) return true;
    }
    return false; // 是否自定义
  }
  if (!isCustomize && !ID) return null;
  if (FixedType === 7) { // 求值：常规尺寸ID   明确为非自定义则直接返回常规尺寸ID，如不明确则后续继续判断
    if (isCustomize) {
      const _id = getSizeGroupIDByCustomizeSize(List, SizeGroup.SizeList);
      return _id;
    }
    return ID; // 常规尺寸ID
  }
  let _list;
  if (!isCustomize) { // 不是自定义 转换该常规尺寸对应的值为列表
    if (Array.isArray(SizeGroup.SizeList)) {
      const t = SizeGroup.SizeList.find(_it => _it.ID === Size.ID);
      if (t && t.List) {
        _list = t.List.map(({ First, Second }) => {
          const _t = SizeGroup.GroupInfo.ElementList.find(_it => _it.ID === First);
          const _temp = { Value: '', ID: '' };
          if (_t) {
            if (_t.Type === 2) _temp.ID = Second;
            else _temp.Value = Second;
          }
          return { ElementID: First, CustomerInputValues: [_temp] };
        });
      }
    }
  } else {
    _list = List;
  }
  _list = _list.map(it => ({ ElementID: it.ElementID, Value: getElementTypeValue({ ID: it.ElementID }, null, _list, SizeGroup.GroupInfo.ElementList, true) }));

  if (FixedType || FixedType === 0) {
    let num;
    _list = _list.map(it => it.Value).filter(it => it);
    switch (FixedType) {
      case 5: // 最短边
        num = Math.min(..._list);
        break;
      case 6: // 最长边
        num = Math.max(..._list);
        break;
      default:
        break;
    }
    return num;
  }
  if (Element) {
    const t = _list.find(it => it.ElementID === Element.ID);
    return t ? t.Value : null;
  }
  return null;
};

/**
 * @description: 获取到目标Value值
 * @param {*} isSubControl 是否是子交互
 * @return {*}
 */
export const getTargetPropertyValue = (Property, ProductParams, curProductInfo2Quotation, isSubControl, ControlItem) => {
  /**
  * 寻找目标步骤：
  * 1. 寻找到目标部件（产品或部件）： 通过Part来确定；如果部件使用次数大于1则返回null
  * 2. 根据Type枚举值来确定目标属性类型： 元素 | 元素组 | 尺寸 | 物料 | 工艺
  * 3. 5种情况分别进行处理，找到每种情况的目标对象
  * 4-1. 元素类型： Type值为3， 可能为元素本身 也可能为元素fixedType值 （多选选项元素才有：已选项数、和、最大值、最小值）
  */

  const { Part, Type, Craft, Group, Element, FixedType } = Property;
  // 寻找到目标部件，产品本身也调整数据格式后做为部件返回
  let targetPart = !Part ? { List: [ProductParams] } : (ProductParams.PartList?.find(it => it.PartID === Part.ID) || null);
  if (isSubControl) targetPart = { List: [ProductParams] }; // --------------- 修改部分
  const targetPartData = !Part ? curProductInfo2Quotation : (curProductInfo2Quotation.PartList?.find(it => it.ID === Part.ID) || null);
  if (!targetPart || !targetPartData) return null;
  if (targetPart.List.length !== 1) return null; // 只判断单次使用， 多次使用直接返回null
  const [targetPartItem] = targetPart.List;
  let temp;
  let target;
  let targetOriginData;
  switch (Type) {
    case 2: // 元素组 --- 1 元素组本身（Element为null）  2 元素组上的元素
      target = targetPartItem.GroupList.find(_it => _it.GroupID === Group.ID);
      targetOriginData = targetPartData.GroupList.find(_it => _it.ID === Group.ID);
      temp = getElementGroupTypeValue(Element, FixedType, target, targetOriginData, isSubControl, ControlItem);
      break;
    case 3: // 独立元素
      temp = getElementTypeValue(Element, FixedType, targetPartItem.ElementList, targetPartData.ElementList);
      break;
    case 4: // 工艺
      if (targetPartItem && targetPartItem.CraftList) {
        target = targetPartItem.CraftList.find(_it => _it.CraftID === Craft.ID);
        targetOriginData = targetPartData.CraftList.find(_it => _it.ID === Craft.ID);
        temp = getCraftTypeValue(Element, Group, FixedType, target, targetOriginData, Craft, isSubControl, ControlItem);
      }
      if (!temp && temp !== false) temp = 'craftIsNotExist';
      break;
    case 5: // 物料
      temp = targetPartItem.MaterialID;
      break;
    case 6: // 尺寸组
      temp = getSiztTypeValue(targetPartItem.Size, targetPartData.SizeGroup, Element, FixedType);
      break;
    default:
      break;
  }

  return temp;
};

const getArrayIsEqual = (arr1, arr2) => { // 都为字符串或数字组成的数组
  // if (arr1.length !== arr2.length) return false;
  // 进行去重操作
  const _arr1 = [...new Set(arr1)];
  const _arr2 = [...new Set(arr2)];
  if (_arr1.length !== _arr2.length) return false;
  const t = _arr1.find(it => !_arr2.includes(it));
  return !t;
};

const getValueIsContainList = (value, ValueList) => { // 获取是否包含结果
  if (value.length === 0) return false;
  const Values = ValueList.map(it => it.Value);
  const compareFunc = (arr) => { // 获取到是否严格匹配的结果 匹配成功则返回true
    const _arr = [...new Set(arr)]; // 去重
    const len1 = _arr.length;
    if (len1 < Values.length) return false;
    const unionSet = [...new Set([...arr, ...Values])];
    const len2 = unionSet.length;
    return len1 === len2;
  };
  if (Array.isArray(value[0])) { // 严格匹配每一个
    const t = value.find(arrItem => !compareFunc(arrItem));
    return !t;
  }
  // 去重后再严格匹配
  return compareFunc(value);
};

const getValueIsNotContainList = (value, ValueList) => { // 获取是否不包含结果
  if (value.length === 0) return true;
  const Values = ValueList.map(it => it.Value);
  const compareFunc = (arr) => { // 获取到是否严格匹配的结果 匹配成功则返回true
    const target = arr.find(it => Values.includes(it));
    return !target;
  };
  if (Array.isArray(value[0])) { // 严格匹配每一个
    const t = value.find(arrItem => !compareFunc(arrItem));
    return !t;
  }
  // 去重后再严格匹配
  return compareFunc(value);
};

/**
 * @description: 判断 值、关系、对比结果 是否相匹配
 * @param {*}  value: 多选元素 或 多次使用元素组的单选元素返回都为ID组成的数组 其它都为值
 * @return {*} 返回匹配结果：布尔值
 */
const matchValueWithValueList = (value, Operator, ValueList) => {
  const getIsEqual = () => { // 判断是否相等
    if (!ValueList || ValueList.length === 0) return true;
    const Values = ValueList.map(it => it.Value);
    if (!Array.isArray(value) && ValueList.length > 0) {
      if (ValueList.length === 1) {
        return isEqual(value, ValueList[0].Value) || (value === true && ValueList[0].Value === 'True') || (value === false && ValueList[0].Value === 'False'); // 完全相等
      }
      return Values.includes(value); // 等于任一
    }
    if (Array.isArray(value) && value.length > 0 && ValueList.length > 0) {
      if (Array.isArray(value[0])) { // 元素组（单选或多选）上的多选选项元素 -- 严格相等
        const t = value.find(arrItem => { // 找到不符合的
          if (arrItem.length === 0 || arrItem.length !== ValueList.length) return true;
          // 处理严格匹配
          return !getArrayIsEqual(arrItem, Values);
        });
        if (t) return false;
        return true;
      }
      // 普通多选元素 或 多次元素组的单选元素
      // 1 去重
      // 2. 执行严格匹配
      return getArrayIsEqual(value, Values); // 内部执行去重
    }
    return false;
  };

  let bool = false;
  switch (Operator) {
    case 1: // 等于
      bool = getIsEqual();
      break;

    case 2: // 不等于
      bool = !getIsEqual();
      break;
    case 3: // 大于
      bool = isGreatThen(value, ValueList[0].Value);
      break;
    case 4: // 大于等于
      bool = isGreatThen(value, ValueList[0].Value) || isEqual(value, ValueList[0].Value);
      break;
    case 5: // 小于
      bool = isLessThen(value, ValueList[0].Value);
      break;
    case 6: // 小于等于
      bool = isLessThen(value, ValueList[0].Value) || isEqual(value, ValueList[0].Value);
      break;
    case 7: // 包含...
      if (Array.isArray(value)) {
        bool = getValueIsContainList(value, ValueList);
      }
      break;
    case 8: // 不包含...
      if (Array.isArray(value)) {
        bool = getValueIsNotContainList(value, ValueList);
      }
      break;
    case 9: // 选中...
      if (typeof value === 'boolean') bool = value;
      break;
    case 10: // 不选中...
      if (typeof value === 'boolean') bool = !value;
      break;
    default:
      break;
  }
  return bool;
};

/**
 * @description: 判断交互中的单个条件是否满足和匹配
 * @param {*}
 * @return {*}  boolean
 */
export const getSingleItemListIsMatched = (item, ProductParams, curProductInfo2Quotation, isSubControl, ControlItem) => {
  if (!item || !ProductParams) return false;
  const { Property, Operator, ValueList } = item;
  if (!Property || (!Operator && Operator !== 0) || !ValueList || ValueList.length === 0) return false;
  const targetValue = getTargetPropertyValue(Property, ProductParams, curProductInfo2Quotation, isSubControl, ControlItem);
  if (!targetValue && targetValue !== 0 && targetValue !== false && typeof targetValue !== 'boolean' && Operator !== 2) return false;
  if (targetValue === 'craftIsNotExist') return false;
  return matchValueWithValueList(targetValue, Operator, ValueList, Property);
};

const getTargetIsMatchedOrNot = (target, ItemList) => {
  // let bool = true;
  let targetProp;
  switch (target.type) {
    case '元素':
      targetProp = ItemList.find(({ Property }) => Property && Property.Element && !Property.Group && !Property.Craft && Property.Element.ID === target.target.ID);
      break;
    case '元素组':
      targetProp = ItemList.find(({ Property }) => Property && Property.Group && !Property.Craft && Property.Group.ID === target.target.ID);
      break;
    case '尺寸组':
      targetProp = ItemList.find(({ Property }) => Property && Property.Type && Property.Type === 6);
      break;
    case '物料':
      targetProp = ItemList.find(({ Property }) => Property && Property.Type && Property.Type === 5);
      break;
    case '工艺':
      targetProp = ItemList.find(({ Property }) => Property && Property.Craft && Property.Craft.ID === target.target.ID);
      break;
    case '工厂': // 工厂隐藏
      // targetProp = this.placeData.FactoryList;
      break;
    default:
      break;
  }
  return !!targetProp;
};

/**
 * @description: 判断一条交互的触发条件是否能够匹配上
 * @param {*}
 * @return {*} 返回匹配结果: bool值
 */
export const judgeWhetherItWork = ({ ControlItem, ProductParams, curProductInfo2Quotation, isSubControl, target }) => {
  if (!ControlItem) return false;
  const { Constraint } = ControlItem;
  if (!Constraint) return false;
  const { FilterType, ItemList } = Constraint; // ItemList：条件列表    FilterType：满足方式 1 满足所有   2 满足任一
  if (ItemList && ItemList.length > 0) {
    if (target) {
      // 判断当前正在匹配的交互条目是否能和目标对应上，如果可以对应上，则继续向下进行继续重新判断；如果对应不上则沿用上次判断的结果
      const bool = getTargetIsMatchedOrNot(target, ItemList);
      if (!bool) {
        return target.lastIDList.includes(ControlItem.ID);
      }
    }
    if (FilterType === 1) { // 满足所有
      const inconformityItem = ItemList.find(it => !getSingleItemListIsMatched(it, ProductParams, curProductInfo2Quotation, isSubControl, ControlItem)); // 找到不符合的项目
      return !inconformityItem;
    }
    // 满足任一
    const conformityItem = ItemList.find(it => getSingleItemListIsMatched(it, ProductParams, curProductInfo2Quotation, isSubControl, ControlItem)); // 找到符合的项目
    return !!conformityItem;
  }
  return true;
};

/**
 * @description: 获取到当前生效的交互列表
 * @param {*}
 * @return {*}
 */
export const getEffectiveControlList = ({ ProductParams, curProductInfo2Quotation, SubControlList, target }) => { // 获取当前生效的交互列表 --- 后面调整至按照优先级从小到大排序
  if (!ProductParams || !curProductInfo2Quotation) return null;
  let InteractionControlList;
  let isSubControl = false;
  if (Array.isArray(SubControlList)) {
    InteractionControlList = SubControlList;
    isSubControl = true;
  } else {
    const { ControlList } = curProductInfo2Quotation;
    if (!Array.isArray(ControlList) || ControlList.length === 0) return null;
    InteractionControlList = ControlList.filter(it => it.ControlType === 0); // 筛选出交互列表 另外还有子交互列表未处理
  }
  const curTarget = target ? { ...target, lastIDList: target.lastEffectiveList.map(it => it.ID) } : undefined;
  const list = InteractionControlList.filter(it => judgeWhetherItWork({ ControlItem: it, ProductParams, curProductInfo2Quotation, isSubControl, target: curTarget }))
    .sort((f, s) => f.Priority - s.Priority); // 按照优先级进行排序
  return list;
};

export const getPerfectPropertyByImperfectProperty = (imperfectProp, PropertyList, Operator) => {
  if (!imperfectProp || !PropertyList || !Array.isArray(PropertyList) || PropertyList.length === 0) return false;
  const i = PropertyList.findIndex(it => {
    const { Product, Part, Craft, Material, Group, Element, FixedType, Type, TableData, Cost, Constraint, Formula } = it.Property;
    if (!((!Product && Product === imperfectProp.Property.Product) || (Product && imperfectProp.Property.Product && Product.ID === imperfectProp.Property.Product.ID))) return false;
    if (!((!Part && Part === imperfectProp.Property.Part) || (Part && imperfectProp.Property.Part && Part.ID === imperfectProp.Property.Part.ID))) return false;
    if (!((!Craft && Craft === imperfectProp.Property.Craft) || (Craft && imperfectProp.Property.Craft && Craft.ID === imperfectProp.Property.Craft.ID))) return false;
    if (!((!Material && Material === imperfectProp.Property.Material) || (Material && imperfectProp.Property.Material && Material.ID === imperfectProp.Property.Material.ID))) return false;
    if (!((!Group && Group === imperfectProp.Property.Group) || (Group && imperfectProp.Property.Group && Group.ID === imperfectProp.Property.Group.ID))) return false;
    if (!((!Element && Element === imperfectProp.Property.Element) || (Element && imperfectProp.Property.Element && Element.ID === imperfectProp.Property.Element.ID))) return false;
    if (!((!TableData && TableData === imperfectProp.Property.TableData) || (TableData && imperfectProp.Property.TableData && TableData.ID === imperfectProp.Property.TableData.ID))) return false;
    if (!((!Cost && Cost === imperfectProp.Property.Cost) || (Cost && imperfectProp.Property.Cost && Cost.ID === imperfectProp.Property.Cost.ID))) return false;
    if (!((!Constraint && Constraint === imperfectProp.Property.Constraint) || (Constraint && imperfectProp.Property.Constraint && Constraint.ID === imperfectProp.Property.Constraint.ID))) return false;
    if (!((!Formula && Formula === imperfectProp.Property.Formula) || (Formula && imperfectProp.Property.Formula && Formula.ID === imperfectProp.Property.Formula.ID))) return false;
    if (FixedType !== imperfectProp.Property.FixedType) return false;
    if (Type !== imperfectProp.Property.Type) return false;
    return true;
  });
  if (i > -1) {
    const t = PropertyList[i];
    if ((t.Property.FixedType || t.Property.FixedType === 0) && t.OptionList.length > 0) {
      // 找出差异与新增部分
      const list1 = t.OptionList;
      const list2 = imperfectProp.OptionList;
      if (Operator === t.Operator) { // 都为隐藏或禁用 +++ 后添加一种新的关系类型：必选
        const newList = list2.filter(_it => !list1.includes(_it));
        if (newList.length === 0) return true;
        return {
          index: i,
          item: { ...t, OptionList: [...t.OptionList, ...newList] },
        };
      }
      // 为不同的限制方式
      const newList = list1.filter(_it => !list2.includes(_it));
      const prevTemp = {
        index: i,
        item: { ...t, OptionList: [...newList] },
      };
      const nextTemp = {
        index: -1,
        item: { ...imperfectProp },
      };
      return [prevTemp, nextTemp];
    }
    return true;
  }
  return false;
};

/**
 * @description: 对获取到的正在生效的交互列表根据优先级进行筛选，筛选出需要受到影响的属性列表
 * @param {*}
 * @return {*}
 */
export const getPropertiesAffectedByInteraction = ({ ProductParams, curProductInfo2Quotation, SubControlList, target, getList }) => {
  // 获取到当前  正在生效的  且  已按照优先级从重要到不重要的顺序进行排序的  交互列表
  const EffectiveControlList = getEffectiveControlList({ ProductParams, curProductInfo2Quotation, SubControlList, target });
  if (!EffectiveControlList) {
    if (getList) {
      return {
        propList: [],
        EffectiveControlList: [],
      };
    }
    return [];
  }
  const arr = [];
  EffectiveControlList.forEach(({ List }) => {
    if (Array.isArray(List)) {
      List.forEach(it => {
        const t = getPerfectPropertyByImperfectProperty(it, arr, it.Operator);
        if (!t) arr.push(it);
        else if (Array.isArray(t)) {
          t.forEach(_it => {
            const { index, item } = _it;
            if (index === -1) arr.push(item);
            else arr.splice(index, 1, item);
          });
        } else if (typeof t === 'object') {
          const { index, item } = t;
          if (index === -1) arr.push(item);
          else arr.splice(index, 1, item);
        }
      });
    }
  });
  if (getList) {
    return {
      propList: arr,
      EffectiveControlList,
    };
  }
  return arr;
};

export const getCombineAffectedPropList = (AffectedPropList, PartAffectedPropList) => {
  const List = [...AffectedPropList, ...PartAffectedPropList];
  const arr = [];
  List.forEach(it => {
    const t = getPerfectPropertyByImperfectProperty(it, arr, it.Operator);
    if (!t) arr.push(it);
    else if (Array.isArray(t)) {
      t.forEach(_it => {
        const { index, item } = _it;
        if (index === -1) arr.push(item);
        else arr.splice(index, 1, item);
      });
    } else if (typeof t === 'object') {
      const { index, item } = t;
      if (index === -1) arr.push(item);
      else arr.splice(index, 1, item);
    }
  });
  return arr;
};

export const getFileListInEffect = (ProductParams, curProductInfo2Quotation, FileList) => {
  if (!Array.isArray(FileList) || FileList.length === 0) return [];
  const _list = JSON.parse(JSON.stringify(FileList));
  const list = _list.filter(it => judgeWhetherItWork({ ControlItem: it, ProductParams, curProductInfo2Quotation }))
    .sort((f, s) => f.Priority - s.Priority).filter(it => it.FileList && it.FileList.length > 0); // 按照优先级进行排序
  if (list.length > 0) {
    const allFiles = list.map(it => it.FileList).reduce((prev, next) => [...prev, ...next], []);
    const FileListInEffect = [];
    if (allFiles.length > 0) {
      let hasPrintFile = false; // 是否已有印刷文件，如果有则不再添加印刷文件
      allFiles.forEach(it => {
        const { IsPrintFile } = it;
        // if ((IsPrintFile && hasPrintFile)) return;
        const t = FileListInEffect.find(_it => _it.ID === it.ID);
        if (!t && !(IsPrintFile && hasPrintFile)) {
          FileListInEffect.push(it);
          if (IsPrintFile) hasPrintFile = true;
        } else {
          if (!t.IsRequired && it.IsRequired) {
            const _t = t;
            _t.IsRequired = true;
          }
          if (t.MaxSize < it.MaxSize) {
            const _t = t;
            _t.MaxSize = it.MaxSize;
          }
        }
      });
    }
    return FileListInEffect;
  }
  return [];
};
