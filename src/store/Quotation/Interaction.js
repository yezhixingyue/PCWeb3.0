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

  static getDisabledOptionList(AffectedPropList) { // 获取禁用掉的选项列表
    if (AffectedPropList.length > 0) {
      const t = AffectedPropList.find(it => it.Property && (it.Property.FixedType || it.Property.FixedType === 0) && it.OptionList.length > 0);
      if (t && t.Operator === 21) return t.OptionList;
    }
    return [];
  }

  static getHiddenedOptionList(AffectedPropList) { // 获取隐藏掉的选项列表
    if (AffectedPropList.length > 0) {
      const t = AffectedPropList.find(it => it.Property && (it.Property.FixedType || it.Property.FixedType === 0) && it.OptionList.length > 0);
      if (t && t.Operator === 22) return t.OptionList;
    }
    return [];
  }

  static getDisabledCraftIDList(AffectedPropList) {
    if (!Array.isArray(AffectedPropList)) return [];
    return AffectedPropList.filter(it => it.Property && it.Property.Craft && !it.Property.Element && !it.Property.Group && it.Operator === 21)
      .map(it => it.Property.Craft.ID);
  }

  static getRequiredCraftIDList(AffectedPropList) {
    if (!Array.isArray(AffectedPropList)) return [];
    return AffectedPropList.filter(it => it.Property && it.Property.Craft && !it.Property.Element && !it.Property.Group && it.Operator === 23)
      .map(it => it.Property.Craft.ID);
  }

  static setElementListClear4Craft(ElementList, ElementAffectedPropList) {
    if (!Array.isArray(ElementList) || ElementList.length === 0) return [];
    if (!Array.isArray(ElementAffectedPropList) || ElementAffectedPropList.length === 0) return ElementList;
    const _ElementList = ElementList.map(it => {
      const AffectedPropList = ElementAffectedPropList.filter(_it => _it.Property?.Element?.ID === it.ElementID);
      if (AffectedPropList.length === 0) return it;
      if (this.getDisabledOrNot(AffectedPropList) || this.getIsHiddenOrNot(AffectedPropList)) {
        const temp = { ...it, CustomerInputValues: it.CustomerInputValues.map(() => ({ ID: '', Name: '', Value: '' })) };
        return temp;
      }
      return it;
    });
    return _ElementList;
  }

  static setElementGroupListClear4Craft(GroupList, GroupAffectedPropList) {
    if (!Array.isArray(GroupList) || GroupList.length === 0) return [];
    if (!Array.isArray(GroupAffectedPropList) || GroupAffectedPropList.length === 0) return GroupList;
    const _GroupList = GroupList.map(it => {
      const AffectedPropList = GroupAffectedPropList.filter(_it => _it.Property?.Group?.ID === it.GroupID);
      if (AffectedPropList.length === 0) return it;
      if (this.getDisabledOrNot(AffectedPropList) || this.getIsHiddenOrNot(AffectedPropList)) {
        return {
          ...it,
          List: it.List.map(lv1 => ({
            ...lv1,
            List: lv1.List.map(el => ({ ...el, CustomerInputValues: el.CustomerInputValues.map(() => ({ ID: '', Name: '', Value: '' })) })),
          })).slice(0, 1),
        };
      }
      return {
        ...it,
        List: it.List.map(lv1 => ({
          ...lv1,
          List: this.setElementListClear4Craft(lv1.List, GroupAffectedPropList),
        })),
      };
    });
    return _GroupList;
  }
}
