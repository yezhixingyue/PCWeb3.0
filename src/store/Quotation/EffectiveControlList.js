/* eslint-disable object-curly-newline */

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
 * @param {*}
 * @return {*}
 */
export const getTargetPropertyValue = (Property, ProductParams, curProductInfo2Quotation) => {
  /**
  * 寻找目标步骤：
  * 1. 寻找到目标部件（产品或部件）： 通过Part来确定；如果部件使用次数大于1则返回null
  * 2. 根据Type枚举值来确定目标属性类型： 元素 | 元素组 | 尺寸 | 物料 | 工艺
  * 3. 5种情况分别进行处理，找到每种情况的目标对象
  * 4-1. 元素类型： Type值为3， 可能为元素本身 也可能为元素fixedType值 （多选选项元素才有：已选项数、和、最大值、最小值）
  */

  const { Part, Type, Craft, Group, Element, FixedType } = Property;
  // 寻找到目标部件，产品本身也调整数据格式后做为部件返回
  const targetPart = !Part ? { List: [ProductParams] } : (ProductParams.PartList?.find(it => it.PartID === Part.ID) || null);
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

  if (temp) console.log('temp----- ', temp);
  return true;
};

/**
 * @description: 判断交互中的单个条件是否满足
 * @param {*}
 * @return {*}  boolean
 */
export const getSingleItemListIsRight = (item, ProductParams, curProductInfo2Quotation) => {
  if (!item || !ProductParams) return false;
  const { Property, Operator, ValueList } = item;
  if (!Property || !Operator || !ValueList) return false;
  const targetValue = getTargetPropertyValue(Property, ProductParams, curProductInfo2Quotation);
  if (!targetValue) return false;
  return true;
};

/**
 * @description: 判断一条交互的触发条件是否能够匹配上
 * @param {*}
 * @return {*} 返回匹配结果: bool值
 */
export const judgeWhetherItWork = (ControlItem, ProductParams, curProductInfo2Quotation) => {
  if (!ControlItem) return false;
  const { Constraint } = ControlItem;
  if (!Constraint) return false;
  const { FilterType, ItemList } = Constraint; // ItemList：条件列表    FilterType：满足方式 1 满足所有   2 满足任一
  if (ItemList.length > 0) {
    if (FilterType === 1) { // 满足所有
      const inconformityItem = ItemList.find(it => !getSingleItemListIsRight(it, ProductParams, curProductInfo2Quotation)); // 找到不符合的项目
      return !inconformityItem;
    }
    // 满足任一
    const conformityItem = ItemList.find(it => getSingleItemListIsRight(it, ProductParams, curProductInfo2Quotation)); // 找到不符合的项目
    return !!conformityItem;
  }
  return true;
};
