/* eslint-disable object-curly-newline */

const getElementTypeValue = (FixedType, eles) => {
  console.log('元素组 元素', FixedType, eles);
  if (!FixedType) {
    console.log('元素本身');
  }
};

/**
 * @description: 获取到目标Value值
 * @param {*}
 * @return {*}
 */
export const getTargetPropertyValue = (Property, ProductParams) => {
  /**
  * 寻找目标步骤：
  * 1. 寻找到目标部件（产品或部件）： 通过Part来确定；如果部件使用次数大于1则返回null
  * 2. 根据Type枚举值来确定目标属性类型： 元素 | 元素组 | 尺寸 | 物料 | 工艺
  * 3. 5种情况分别进行处理，找到每种情况的目标对象
  * 4-1. 元素类型： 可能为元素本身 也可能为元素fixedType值
  */

  // eslint-disable-next-line no-unused-vars
  const { Part, Type, Craft, Group, Element, FixedType } = Property;
  // 寻找到目标部件，产品本身也调整数据格式后做为部件返回
  const targetPart = !Part ? { List: [ProductParams] } : (ProductParams.PartList?.find(it => it.PartID === Part.ID) || null);
  if (!targetPart) return null;
  // console.log('Property  targetPart', Property, targetPart.List, targetPart.List.length, ProductParams);
  if (targetPart.List.length !== 1) return null; // 只判断单次使用， 多次使用直接返回null
  const [targetPartItem] = targetPart.List;
  console.log('targetPartItem', targetPartItem);
  let temp;
  let target;
  switch (Type) {
    case 2: // 元素组 --- 1 元素组本身（Element为null）  2 元素组上的元素
      target = targetPartItem.GroupList.find(_it => _it.GroupID === Group.ID);
      if (target) {
        if (!Element) { // 元素组本身
          // console.log('元素组', FixedType, target);
          if (FixedType === 4) temp = target.List.length; // 元素组使用次数
        } else {
          const eles = target.List.map(({ List }) => List.find(_it => _it.ElementID === Element.ID)).filter(_it => _it);
          temp = getElementTypeValue(FixedType, eles);
        }
      }
      break;
    case 3: // 元素

      break;
    case 4: // 工艺

      break;
    case 5: // 物料

      break;
    case 6: // 尺寸组

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
export const getSingleItemListIsRight = (item, ProductParams) => {
  if (!item || !ProductParams) return false;
  const { Property, Operator, ValueList } = item;
  if (!Property || !Operator || !ValueList) return false;
  const targetValue = getTargetPropertyValue(Property, ProductParams);
  if (!targetValue) return false;
  return true;
};

/**
 * @description: 判断一条交互的触发条件是否能够匹配上
 * @param {*}
 * @return {*} 返回匹配结果: bool值
 */
export const judgeWhetherItWork = (ControlItem, ProductParams) => {
  if (!ControlItem) return false;
  const { Constraint } = ControlItem;
  if (!Constraint) return false;
  const { FilterType, ItemList } = Constraint; // ItemList：条件列表    FilterType：满足方式 1 满足所有   2 满足任一
  if (ItemList.length > 0) {
    if (FilterType === 1) { // 满足所有
      const inconformityItem = ItemList.find(it => !getSingleItemListIsRight(it, ProductParams)); // 找到不符合的项目
      return !inconformityItem;
    }
    // 满足任一
    const conformityItem = ItemList.find(it => getSingleItemListIsRight(it, ProductParams)); // 找到不符合的项目
    return !!conformityItem;
  }
  return true;
};
