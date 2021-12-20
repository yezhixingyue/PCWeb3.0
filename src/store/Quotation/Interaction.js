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

  static getUnusabledValueByInteraction(AffectedPropList) { // 获取禁用或隐藏时的计算值
    if (AffectedPropList.length > 0) {
      const t = AffectedPropList.find(it => it.Property && !it.Property.FixedType && it.Property.FixedType !== 0 && it.OptionList.length === 0);
      if (t && (t.Operator === 21 || t.Operator === 22)) return t.DefaultValue || t.DefaultValue === 0 ? t.DefaultValue : '';
    }
    return '';
  }

  static getDisabledOptionList(AffectedPropList) { // 获取禁用掉的选项列表
    if (AffectedPropList.length > 0) {
      const list = AffectedPropList
        .filter(it => it.Property && (it.Property.FixedType || it.Property.FixedType === 0) && it.OptionList.length > 0 && it.Operator === 21);
      if (list.length > 0) {
        return list.map(it => it.OptionList).reduce((prev, next) => [...prev, ...next], []);
      }
    }
    return [];
  }

  static getHiddenedOptionList(AffectedPropList) { // 获取隐藏掉的选项列表
    if (AffectedPropList.length > 0) {
      const list = AffectedPropList
        .filter(it => it.Property && (it.Property.FixedType || it.Property.FixedType === 0) && it.OptionList.length > 0 && it.Operator === 22);
      if (list.length > 0) {
        return list.map(it => it.OptionList).reduce((prev, next) => [...prev, ...next], []);
      }
    }
    return [];
  }

  static getRequirededOptionList(AffectedPropList) { // 获取必选的选项列表
    if (AffectedPropList.length > 0) {
      const list = AffectedPropList
        .filter(it => it.Property && (it.Property.FixedType || it.Property.FixedType === 0) && it.OptionList.length > 0 && it.Operator === 23);
      if (list.length > 0) {
        return list.map(it => it.OptionList).reduce((prev, next) => [...prev, ...next], []);
      }
    }
    return [];
  }

  static getDisabledCraftIDList(AffectedPropList) {
    if (!Array.isArray(AffectedPropList)) return [];
    return AffectedPropList.filter(it => it.Property && it.Property.Craft && !it.Property.Element && !it.Property.Group && it.Operator === 21)
      .map(it => it.Property.Craft.ID);
  }

  static getRequiredCraftIDList(AffectedPropList) { // 找必选工艺前 应先看看其是否已被更优先级更高的交互条目禁用
    if (!Array.isArray(AffectedPropList)) return [];
    const disabledCraftList = AffectedPropList
      .map(it => {
        if (it.Property && it.Property.Craft && !it.Property.Element && !it.Property.Group && it.Operator === 21) return it;
        return null;
      }).map((it, i) => {
        if (it) return { index: i, ID: it.Property.Craft.ID };
        return null;
      }).filter(it => it);
    return AffectedPropList.filter((it, i) => {
      const bool = it.Property && it.Property.Craft && !it.Property.Element && !it.Property.Group && it.Operator === 23;
      if (bool) {
        const t = disabledCraftList.find(_it => _it.ID === it.Property.Craft.ID);
        if (t && t.index <= i) return false; // 在必选时已先被禁用
        return true;
      }
      return false;
    }).map(it => ({ CraftID: it.Property.Craft.ID, _ConditionTextList: it._ConditionTextList }));
  }

  // static setElementListClear4Craft(ElementList, ElementAffectedPropList) {
  //   if (!Array.isArray(ElementList) || ElementList.length === 0) return [];
  //   if (!Array.isArray(ElementAffectedPropList) || ElementAffectedPropList.length === 0) return ElementList;
  //   const _ElementList = ElementList.map(it => {
  //     const AffectedPropList = ElementAffectedPropList.filter(_it => _it.Property?.Element?.ID === it.ElementID);
  //     if (AffectedPropList.length === 0) return it;
  //     if (this.getDisabledOrNot(AffectedPropList) || this.getIsHiddenOrNot(AffectedPropList)) {
  //       const temp = { ...it, CustomerInputValues: it.CustomerInputValues.map(() => ({ ID: '', Name: '', Value: '' })) };
  //       return temp;
  //     }
  //     return it;
  //   });
  //   return _ElementList;
  // }

  // static setElementGroupListClear4Craft(GroupList, GroupAffectedPropList) {
  //   if (!Array.isArray(GroupList) || GroupList.length === 0) return [];
  //   if (!Array.isArray(GroupAffectedPropList) || GroupAffectedPropList.length === 0) return GroupList;
  //   const _GroupList = GroupList.map(it => {
  //     const AffectedPropList = GroupAffectedPropList.filter(_it => _it.Property?.Group?.ID === it.GroupID);
  //     if (AffectedPropList.length === 0) return it;
  //     if (this.getDisabledOrNot(AffectedPropList) || this.getIsHiddenOrNot(AffectedPropList)) {
  //       return {
  //         ...it,
  //         List: it.List.map(lv1 => ({
  //           ...lv1,
  //           List: lv1.List.map(el => ({ ...el, CustomerInputValues: el.CustomerInputValues.map(() => ({ ID: '', Name: '', Value: '' })) })),
  //         })).slice(0, 1),
  //       };
  //     }
  //     return {
  //       ...it,
  //       List: it.List.map(lv1 => ({
  //         ...lv1,
  //         List: this.setElementListClear4Craft(lv1.List, GroupAffectedPropList),
  //       })),
  //     };
  //   });
  //   return _GroupList;
  // }

  static getDisabledOrHiddenedElementIDList(AffectedPropList) {
    if (Array.isArray(AffectedPropList) && AffectedPropList.length > 0) {
      let list = AffectedPropList
        .filter(it => [21, 22].includes(it.Operator) && it.Property.Element && (!it.Property.FixedType && it.Property.FixedType !== 0));
      // console.log(AffectedPropList, list.map(it => ({ ElementID: it.Property.Element.ID, DisabledOrHideDefaultValue: it.DefaultValue })));
      list = list.map(it => ({ ElementID: it.Property.Element.ID, DisabledOrHideDefaultValue: it.DefaultValue })).filter(it => it.ElementID);
      return list;
    }
    return [];
  }

  static getGroupTypeAffectedPropList(AffectedPropList) {
    if (Array.isArray(AffectedPropList) && AffectedPropList.length > 0) {
      return AffectedPropList.filter(it => it.Property.Group && !it.Property.Craft);
    }
    return [];
  }

  static getDisabledOrHiddenedGroupIDList(AffectedPropList) {
    if (Array.isArray(AffectedPropList) && AffectedPropList.length > 0) {
      return AffectedPropList
        .filter(it => [21, 22].includes(it.Operator) && it.Property.Group && !it.Property.Element)
        .map(it => it.Property.Group.ID)
        .filter(it => it);
    }
    return [];
  }

  static getCraftTypeAffectedPropList(AffectedPropList) {
    if (Array.isArray(AffectedPropList) && AffectedPropList.length > 0) {
      return AffectedPropList.filter(it => it.Property.Craft);
    }
    return [];
  }

  static getDisabledOrHiddenedCraftIDList(AffectedPropList) {
    if (Array.isArray(AffectedPropList) && AffectedPropList.length > 0) {
      return AffectedPropList
        .filter(it => [21, 22].includes(it.Operator) && it.Property.Craft && !it.Property.Group && !it.Property.Element)
        .map(it => it.Property.Craft.ID)
        .filter(it => it);
    }
    return [];
  }
}
