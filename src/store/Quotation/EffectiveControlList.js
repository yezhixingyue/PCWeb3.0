/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import { isEqual, isGreatThen, isLessThen } from '@/assets/js/utils/utils';

/**
 * @description: 获取元素的值，仅多选选项元素选取本身结果时返回数组；其它均返回单一值
 * @param {*}
 * @return {*}
 */
const getElementTypeValue = (Element, FixedType, ElementValList, ElementList, isSize) => {
  if (!Element || !ElementValList || !ElementList) return null;
  const t = ElementValList.find(it => it.ElementID === Element.ID);
  const _El = ElementList.find(it => it.ID === Element.ID);
  if (!t || !_El) return null;
  if (!t.CustomerInputValues || t.CustomerInputValues.length === 0) return null;
  // 获取元素值
  let _Value = '';
  if (_El.Type === 2 && _El.OptionAttribute && !_El.OptionAttribute.IsRadio) { // 多选选项元素
    _Value = t.CustomerInputValues.map(it => it.ID).filter(it => it);
  } else {
    const [{ ID, Name, Value }] = t.CustomerInputValues;
    _Value = ID || Name || Value;
    if (isSize && ID) {
      const _t = _El.OptionAttribute.OptionList.find(it => it.ID === ID);
      return _t ? _t.Value : '';
    }
  }
  // 如果 FixedType 有值 存在4种情况： 已选项数、和、最大值、最小值
  if ((FixedType || FixedType === 0) && _El.Type === 2 && Array.isArray(_Value) && _El.OptionAttribute && _El.OptionAttribute.OptionList) {
    let FixedTypeValue = '';
    let _Vals;
    switch (FixedType) {
      case 0: // 已选项数
        FixedTypeValue = _Value.length;
        break;
      case 1: // 和
        if (Array.isArray(_Value)) {
          _Vals = _Value.map(_ID => _El.OptionAttribute.OptionList.find(it => it.ID === _ID)).filter(it => it).map(it => it.Value);
          if (_Vals.length > 0) FixedTypeValue = _Vals.reduce((prev, next) => prev + next, 0);
        }
        break;
      case 2: // 最小值
        if (Array.isArray(_Value)) {
          _Vals = _Value.map(_ID => _El.OptionAttribute.OptionList.find(it => it.ID === _ID)).filter(it => it).map(it => it.Value);
          if (_Vals.length > 0) FixedTypeValue = Math.min(..._Vals);
        }
        break;
      case 3: // 最大值
        if (Array.isArray(_Value)) {
          _Vals = _Value.map(_ID => _El.OptionAttribute.OptionList.find(it => it.ID === _ID)).filter(it => it).map(it => it.Value);
          if (_Vals.length > 0) FixedTypeValue = Math.max(..._Vals);
        }
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
const getElementGroupTypeValue = (Element, FixedType, target, targetOriginData) => {
  let _GroupValue;
  if (target && targetOriginData) {
    if (!Element) { // 元素组本身
      if (FixedType === 4) _GroupValue = target.List.length; // 元素组使用次数
    } else {
      const ElValues = target.List.map(({ List }) => getElementTypeValue(Element, FixedType, List, targetOriginData.ElementList)).filter(_it => _it);
      // temp = getElementTypeValue(Element, FixedType, ElValues);
      if (ElValues.length === 0) return null;
      switch (FixedType) {
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
        if (Array.isArray(ElValues[0])) _GroupValue = ElValues.reduce((prev, next) => [...prev, ...next], []); // 多选选项元素时
        else _GroupValue = [...ElValues]; // 单选时
      }
    }
  }
  return _GroupValue;
};

/**
 * @description: 获取工艺值 （包含是否选中）
 * @param {*}
 * @return {*}
 */
const getCraftTypeValue = (Element, Group, FixedType, target, targetOriginData) => {
  let _CraftValue;
  if (!Element && !Group && !FixedType) _CraftValue = !!target; // 工艺是否选中 返回布尔值
  else if (target) {
    if (Group) { // 工艺上属性组
      const targetGroup = target.GroupList.find(_it => _it.GroupID === Group.ID);
      const targetGroupOriginData = targetOriginData.GroupList.find(_it => _it.ID === Group.ID);
      _CraftValue = getElementGroupTypeValue(Element, FixedType, targetGroup, targetGroupOriginData);
    } else {
      _CraftValue = getElementTypeValue(Element, FixedType, target.ElementList, targetOriginData.ElementList);
    }
  }
  return _CraftValue;
};

const getSiztTypeValue = (Size, SizeGroup, Element, FixedType) => {
  if (!Size || !SizeGroup) return null;
  const { ID, List, isCustomize } = Size;
  if (!isCustomize && !ID) return null;
  if (FixedType === 7) { // 常规尺寸
    return isCustomize ? '' : ID; // 如果为自定义则返回空，否则返回ID
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
export const getTargetPropertyValue = (Property, ProductParams, curProductInfo2Quotation, isSubControl) => {
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
      temp = getElementGroupTypeValue(Element, FixedType, target, targetOriginData);
      break;
    case 3: // 独立元素
      temp = getElementTypeValue(Element, FixedType, targetPartItem.ElementList, targetPartData.ElementList);
      break;
    case 4: // 工艺
      target = targetPartItem.CraftList.find(_it => _it.CraftID === Craft.ID);
      targetOriginData = targetPartData.CraftList.find(_it => _it.ID === Craft.ID);
      temp = getCraftTypeValue(Element, Group, FixedType, target, targetOriginData, Craft);
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

  // if (temp) console.log('temp----- ', temp);
  return temp;
};

/**
 * @description: 判断 值、关系、对比结果 是否相匹配
 * @param {*}  value: 多选元素 或 多次使用元素组的单选元素返回都为ID组成的数组 其它都为值
 * @return {*} 返回匹配结果：布尔值
 */
const matchValueWithValueList = (value, Operator, ValueList) => {
  const getIsEqual = () => { // 判断是否相等
    if (Array.isArray(value) && ValueList.length === 1) { // 可多次出现并等于
      const _list = [...new Set(value)];
      if (_list.length > 1) return false;
      return _list[0] === ValueList[0].Value;
    }
    if (!Array.isArray(value) && ValueList.length === 1) { // 单次出现
      return isEqual(value, ValueList[0].Value);
    }
    if (ValueList.length > 1) { // 等于对比列表中其中一种
      if (!Array.isArray(value)) { // 目前只比对不可多次出现目标
        return ValueList.map(it => it.Value).includes(value);
      }
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
        bool = value.includes(ValueList[0].Value);
      }
      break;
    case 8: // 不包含...
      if (Array.isArray(value)) {
        bool = !value.includes(ValueList[0].Value);
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
export const getSingleItemListIsMatched = (item, ProductParams, curProductInfo2Quotation, isSubControl) => {
  if (!item || !ProductParams) return false;
  const { Property, Operator, ValueList } = item;
  if (!Property || (!Operator && Operator !== 0) || !ValueList) return false;
  const targetValue = getTargetPropertyValue(Property, ProductParams, curProductInfo2Quotation, isSubControl);
  if (!targetValue && targetValue !== 0 && typeof targetValue !== 'boolean') return false;
  return matchValueWithValueList(targetValue, Operator, ValueList);
};

/**
 * @description: 判断一条交互的触发条件是否能够匹配上
 * @param {*}
 * @return {*} 返回匹配结果: bool值
 */
export const judgeWhetherItWork = (ControlItem, ProductParams, curProductInfo2Quotation, isSubControl) => {
  if (!ControlItem) return false;
  const { Constraint } = ControlItem;
  if (!Constraint) return false;
  const { FilterType, ItemList } = Constraint; // ItemList：条件列表    FilterType：满足方式 1 满足所有   2 满足任一
  if (ItemList.length > 0) {
    if (FilterType === 1) { // 满足所有
      const inconformityItem = ItemList.find(it => !getSingleItemListIsMatched(it, ProductParams, curProductInfo2Quotation, isSubControl)); // 找到不符合的项目
      return !inconformityItem;
    }
    // 满足任一
    const conformityItem = ItemList.find(it => getSingleItemListIsMatched(it, ProductParams, curProductInfo2Quotation, isSubControl)); // 找到符合的项目
    return !!conformityItem;
  }
  return true;
};

/**
 * @description: 获取到当前生效的交互列表
 * @param {*}
 * @return {*}
 */
export const getEffectiveControlList = (ProductParams, curProductInfo2Quotation, SubControlList) => { // 获取当前生效的交互列表 --- 后面调整至按照优先级从小到大排序
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

  const list = InteractionControlList.filter(it => judgeWhetherItWork(it, ProductParams, curProductInfo2Quotation, isSubControl))
    .sort((f, s) => f.Priority - s.Priority); // 按照优先级进行排序
  return list;
};

export const getPerfectPropertyByImperfectProperty = (imperfectProp, PropertyList) => {
  if (!imperfectProp || !PropertyList || !Array.isArray(PropertyList) || PropertyList.length === 0) return null;
  const t = PropertyList.find(it => {
    const { Product, Part, Craft, Material, Group, Element, FixedType, Type, TableData, Cost, Constraint, Formula } = it;
    if (!((!Product && Product === imperfectProp.Product) || (Product && imperfectProp.Product && Product.ID === imperfectProp.Product.ID))) return false;
    if (!((!Part && Part === imperfectProp.Part) || (Part && imperfectProp.Part && Part.ID === imperfectProp.Part.ID))) return false;
    if (!((!Craft && Craft === imperfectProp.Craft) || (Craft && imperfectProp.Craft && Craft.ID === imperfectProp.Craft.ID))) return false;
    if (!((!Material && Material === imperfectProp.Material) || (Material && imperfectProp.Material && Material.ID === imperfectProp.Material.ID))) return false;
    if (!((!Group && Group === imperfectProp.Group) || (Group && imperfectProp.Group && Group.ID === imperfectProp.Group.ID))) return false;
    if (!((!Element && Element === imperfectProp.Element) || (Element && imperfectProp.Element && Element.ID === imperfectProp.Element.ID))) return false;
    if (!((!TableData && TableData === imperfectProp.TableData) || (TableData && imperfectProp.TableData && TableData.ID === imperfectProp.TableData.ID))) return false;
    if (!((!Cost && Cost === imperfectProp.Cost) || (Cost && imperfectProp.Cost && Cost.ID === imperfectProp.Cost.ID))) return false;
    if (!((!Constraint && Constraint === imperfectProp.Constraint) || (Constraint && imperfectProp.Constraint && Constraint.ID === imperfectProp.Constraint.ID))) return false;
    if (!((!Formula && Formula === imperfectProp.Formula) || (Formula && imperfectProp.Formula && Formula.ID === imperfectProp.Formula.ID))) return false;
    if (FixedType !== imperfectProp.FixedType) return false;
    if (Type !== imperfectProp.Type) return false;
    return true;
  });
  if (t) {
    if (t.FixedType === 255) { // 常量
      const { DefaultValue } = imperfectProp;
      return { ...t, DefaultValue };
    }
    if (t.Type === 9) {
      const { CraftOptionList } = imperfectProp;
      if (CraftOptionList && t.CraftOptionList) {
        const list = t.CraftOptionList.map(it => {
          const _t = CraftOptionList.find(_it => _it.ID === it.ID && JSON.stringify(_it.Part) === JSON.stringify(it.Part));
          return _t || it;
        });
        return { ...t, CraftOptionList: list };
      }
    }
    return t;
  }
  return null;
};

/**
 * @description: 对获取到的正在生效的交互列表根据优先级进行筛选，筛选出需要受到影响的属性列表
 * @param {*}
 * @return {*}
 */
export const getPropertiesAffectedByInteraction = (ProductParams, curProductInfo2Quotation, SubControlList) => {
  // 获取到当前  正在生效的  且  已按照优先级从重要到不重要的顺序进行排序的  交互列表
  const EffectiveControlList = getEffectiveControlList(ProductParams, curProductInfo2Quotation, SubControlList);
  if (!EffectiveControlList) return [];
  const arr = [];
  EffectiveControlList.forEach(({ List }) => {
    if (Array.isArray(List)) {
      List.forEach(it => {
        const _list = arr.map(_it => _it.Property);
        const t = getPerfectPropertyByImperfectProperty(it.Property, _list);
        if (!t) arr.push(it);
      });
    }
  });
  return arr;
};

export const combineAffectedPropList = (AffectedPropList, PartAffectedPropList, CraftAffectedPropList, GroupAffectedPropList) => {
  console.log('合并 交互 与 子交互', AffectedPropList, PartAffectedPropList, CraftAffectedPropList, GroupAffectedPropList);
};
