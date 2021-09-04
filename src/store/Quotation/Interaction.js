/**
 * @description: 交互相关方法
 * @引用路径  import InterAction from '@/store/Quotation/Interaction';
 * @param {*}
 * @return {*}
 */
export default class InterAction {
  static getDisabledOrNot(AffectedPropList) { // 判断元素是否被禁用
    if (AffectedPropList.length > 0) {
      const t = AffectedPropList.find(it => it.Property && !it.Property.FixedType && it.Property.FixedType !== 0 && it.OptionList.length === 0);
      if (t) return t.Operator === 21;
    }
    return false;
  }

  static getIsHiddenOrNot(AffectedPropList) { // 判断元素是否被隐藏
    if (AffectedPropList.length > 0) {
      const t = AffectedPropList.find(it => it.Property && !it.Property.FixedType && it.Property.FixedType !== 0 && it.OptionList.length === 0);
      if (t) return t.Operator === 22;
    }
    return false;
  }

  static getDisabledOptionList(AffectedPropList) { // 获取禁用掉的属性列表
    if (AffectedPropList.length > 0) {
      const t = AffectedPropList.find(it => it.Property && (it.Property.FixedType || it.Property.FixedType === 0) && it.OptionList.length > 0);
      if (t && t.Operator === 21) return t.OptionList;
    }
    return [];
  }

  static getHiddenedOptionList(AffectedPropList) { // 获取隐藏掉的属性列表
    if (AffectedPropList.length > 0) {
      const t = AffectedPropList.find(it => it.Property && (it.Property.FixedType || it.Property.FixedType === 0) && it.OptionList.length > 0);
      if (t && t.Operator === 22) return t.OptionList;
    }
    return [];
  }
}
