import store from '@/store';
import InterAction from '@/store/Quotation/Interaction';
import { transformNumToChindNum } from '../../assets/js/utils/utils';

/**
 * @description: 根据元素的值及元素本身的数据生成元素组展示内容
 * @param {*}
 * @return {*}
 */
const getElementValueContent = (CustomerInputValues, origin, giveUpUnit) => {
  if (CustomerInputValues && origin && Array.isArray(CustomerInputValues) && CustomerInputValues.length > 0) {
    // ---------------------------- 获取到选项元素展示结果内容
    if (origin.Type === 2 && origin.OptionAttribute) {
      if (!origin.OptionAttribute.IsRadio) { // 多选选项元素，此时value为ID组成的数组
        const optionNames = CustomerInputValues.map(it => {
          const t = origin.OptionAttribute.OptionList.find(_it => _it.ID === it.ID);
          return t ? t.Name : '';
        }).filter(it => it);
        return optionNames.join('、');
      } // 单选 此时value为单对象数组（对象中ID, Name都可能有值）
      const [{ ID, Name }] = CustomerInputValues;
      if (Name) return Name;
      const t = origin.OptionAttribute.OptionList.find(_it => _it.ID === ID);
      return t ? t.Name : '';
    }
    if (origin.Type === 1) { // 数字类型
      const [{ Value }] = CustomerInputValues;
      const { Unit } = origin;
      if (Value || Value === 0) return Unit && !giveUpUnit ? `${+Value}${Unit || ''}` : `${+Value}`;
    }
    if (origin.Type === 3 && origin.SwitchAttribute) { // 开关类型=
      const [{ IsOpen }] = CustomerInputValues;
      if (IsOpen) return origin.SwitchAttribute.Words;
      // if (+Value === origin.SwitchAttribute.CloseValue) return `不${origin.SwitchAttribute.Words}`;
    }
  }
  return '';
};

/**
 * @description: 获取到元素的Label和Content属性用以显示到页面详情中
 * @param {*}
 * @return {*}
 */
const getDisplayContentByElement = (ElementValList, item, ElementDataList, giveUpUnit) => {
  if (Array.isArray(ElementValList) && ElementValList.length > 0 && item && item.Property && Array.isArray(ElementDataList) && ElementDataList.length > 0) {
    const temp = {
      Label: '',
      Content: '',
    };
    const origin = ElementDataList.find(it => it.ID === item.Property.ID);
    if (origin) {
      if (!origin.IsNameHidden && origin.Name) temp.Label = origin.Name;
      const valueData = ElementValList.find(it => it.ElementID === item.Property.ID);
      if (valueData && !(valueData.IsInteractionResult && valueData.hiddenByInteraction)) {
        temp.Content = getElementValueContent(valueData.CustomerInputValues, origin, giveUpUnit);
        return temp;
      }
    }
  }
  return null;
};

const getDisplayContentByGroup = (GroupValList, item, GroupDataList) => { // 获取元素组展示文字内容（用于下单详情元素组内容展示）
  if (Array.isArray(GroupValList) && GroupValList.length > 0 && item && item.Property && Array.isArray(GroupDataList) && GroupDataList.length > 0) {
    const origin = GroupDataList.find(it => it.ID === item.Property.ID);
    if (origin) {
      const groupValueData = GroupValList.find(it => it.GroupID === item.Property.ID);
      if (groupValueData && groupValueData.List && groupValueData.List.length > 0) {
        let _list = [];
        groupValueData.List.forEach(valList => {
          const groupItemContent = origin.ElementList
            .map(_it => getDisplayContentByElement(valList.List, { Property: { ID: _it.ID } }, origin.ElementList))
            .filter(_it => _it && _it.Content)
            .map(({ Label, Content }) => `${Label}${Label ? '：' : ''}${Content}`);
          if (groupItemContent) _list.push(groupItemContent);
        });
        if (_list.length > 0) {
          _list = _list.map((Content, i) => {
            let Label = _list.length > 1 && i > 0 ? `${origin.Name}-notFirst` : origin.Name;
            if (origin.IsNameHidden) Label = '';
            return { Label, Content };
          });
          return _list;
        }
      }
    }
  }
  return null;
};

const getElementValueText = (CustomerInputValues, Element, AffectedPropList, isDetail) => {
  const _AffectedPropList = AffectedPropList.filter(it => it.Property.Element);
  if (_AffectedPropList && _AffectedPropList.length > 0) {
    const list = _AffectedPropList.filter(it => it.Property.Element.ID === Element.ID);
    if (list.length > 0) {
      if (InterAction.getDisabledOrNot(list) || InterAction.getIsHiddenOrNot(list)) return '';
    }
  }
  const { IsNameHidden } = Element;
  const _EleName = IsNameHidden || !isDetail ? '' : Element.Name;
  const list = ['长', '宽', '高'];
  const EleName = list.includes(Element.Name) ? Element.Name : _EleName; // 移除名称 不再显示
  if (!CustomerInputValues || CustomerInputValues.length === 0) return '';
  if (CustomerInputValues.length === 1) {
    // eslint-disable-next-line object-curly-newline
    const [{ ID, Name, Value, IsOpen }] = CustomerInputValues;
    if (Element.Type === 3) {
      // 开关
      if (IsOpen) {
        if (isDetail) {
          return {
            Content: Element.SwitchAttribute.Words || Element.Name,
          };
        }
        return Element.SwitchAttribute.Words || Element.Name;
      }
    }
    if (Element.Type === 1 && Value) {
      // 数值
      if (isDetail) {
        return {
          Label: Element.Unit ? '' : EleName,
          Content: `${Value}${Element.Unit}`,
        };
      }
      return `${EleName}${EleName ? '：' : ''}${Value}${EleName ? ' ' : ''}${Element.Unit}`;
    }
    if (
      Element.Type === 2
      && Element.OptionAttribute
      && Element.OptionAttribute.IsRadio
      && Element.OptionAttribute.OptionList
    ) {
      if (ID) {
        const t = Element.OptionAttribute.OptionList.find(
          (_it) => _it.ID === ID,
        );
        if (t) {
          if (isDetail) {
            return {
              Content: `${t.Name}`,
            };
          }
          return `${EleName}${EleName ? '：' : ''}${t.Name}`;
        }
      }
      if (Name) {
        if (isDetail) {
          return {
            Content: Name,
          };
        }
        return `${EleName}${EleName ? '：' : ''}${Name}`;
      }
    }
  }
  if (
    Element.Type === 2
    && Element.OptionAttribute
    && !Element.OptionAttribute.IsRadio
    && Element.OptionAttribute.OptionList
  ) {
    const ids = CustomerInputValues.map((it) => it.ID).filter((it) => it);
    if (ids.length > 0) {
      const names = ids
        .map((id) => Element.OptionAttribute.OptionList.find((it) => it.ID === id))
        .filter((it) => it)
        .map((it) => it.Name);
      if (isDetail) {
        return {
          Content: names.join('，'),
        };
      }
      return `${EleName}${EleName ? '：' : ''}${names.join('，')}`;
    }
  }
  return '';
};

const handleCraftContentCombine = list => {
  const list1 = list.filter(it => it.includes('：')).map(it => it.split('：')[1]);
  if (list1.length <= 1) return list;
  let combineContent = list1.join(' x ');
  const units = list1.map(it => it.split(' ')[1]).filter(it => it);
  const values = list1.map(it => it.split(' ')[0]).filter(it => it);
  const list2 = list.filter(it => !it.includes('：'));
  if (units.length === list1.length) {
    const len = [...new Set(units)].length;
    if (len === 1) {
      combineContent = `${values.join(' x ')}${units[0]}`;
    }
  }
  return [combineContent, ...list2].filter(it => it);
};

const getGroupValueText = (List, Group, AffectedPropList, isDetail) => {
  if (AffectedPropList.length > 0) {
    const t = AffectedPropList.find(it => !it.Property.Element && it.Property.Group && it.Property.Group.ID === Group.ID && [21, 22].includes(it.Operator));
    if (t) return '';
  }
  if (List.length > 1 && !isDetail) {
    return `${Group.Name}${List.length}处`;
  }
  if (List.length > 0) {
    // const item = List[0];
    let str = isDetail ? [] : '';
    List.forEach((item, i) => {
      const arr = [];
      item.List.forEach(({ ElementID, CustomerInputValues }) => {
        const t = Group.ElementList.find((_it) => _it.ID === ElementID);
        if (t) {
          const _SingleAffectedPropList = AffectedPropList.filter(_it => _it.Property
           && _it.Property.Group && _it.Property.Group.ID === Group.ID && _it.Property.Element);
          const text = getElementValueText(CustomerInputValues, t, _SingleAffectedPropList, isDetail);
          if (text) {
            // if (isDetail) {
            //   console.log(text);
            //   const _text = text.filter(it => it).map(it => it.Contemt).join(' ');
            //   if (_text) arr.push(_text);
            // } else {
            //   arr.push(text);
            // }
            arr.push(text);
          }
        }
      });
      if (arr.length > 0) {
        let GroupName = Group.IsNameHidden || !isDetail ? '' : Group.Name;
        if (GroupName && List.length > 1) GroupName += i + 1;
        const _list = isDetail ? arr : handleCraftContentCombine(arr);
        // const GroupName = ''; // 移除名称 不再显示
        if (str && !isDetail) str += ' ';
        if (isDetail) {
          str.push({
            type: 'GroupList',
            Label: GroupName,
            Content: _list.filter(it => it).map(it => it.Content).join(' '),
          });
        } else {
          str += `${GroupName}${GroupName ? '：' : ' '}[ ${_list.join(
            `${!isDetail ? ' ' : '，'}`,
          )} ]`;
        }
      }
    });
    return str;
  }
  return '';
};

const getUniqueSizeUnit = (SizeList, SizeElementList) => {
  const list1 = SizeList.map(it => it.ElementID);
  const list2 = SizeElementList.filter(it => list1.includes(it.ID));
  const unitList = list2.map(it => it.Unit || '');
  if ([...new Set(unitList)].length === 1) {
    return {
      Unit: unitList[0],
      isUnique: true,
    };
  }
  return { isUnique: false, Unit: '' };
};

// ------------------------------------------- ↑ 上面为通过下单数据获取到产品详细信息

// ------------------------------------------- ↓ 下面为通过详情数据获取到产品详细信息
// eslint-disable-next-line no-unused-vars
const getElementValueContentFromDetail = (target, isCraftUse) => {
  let Content = '';
  if (Array.isArray(target.CustomerInputValues) && target.CustomerInputValues.length > 0) {
    if (target.CustomerInputValues.length > 1) {
      Content = target.CustomerInputValues.map(it => it.Name).join('、');
    } else if (target.Attributes.Type === 3 && !target.CustomerInputValues[0].IsOpen) {
      Content = '';
    } else {
      Content = target.CustomerInputValues[0].Name;
      // if (target.Attributes.Unit) Content += target.Attributes.Unit;
    }
  }
  const Label = (target.Attributes.IsNameHidden || (isCraftUse && !(!target.Attributes.Unit && target.Attributes.Type === 1))) ? '' : target.Attributes.Name;
  return { Label, Content };
};

const getDisplayContentByElementFromDetailData = (ElementList, item, isCraftUse) => {
  if (item && item.Property && Array.isArray(ElementList) && ElementList.length > 0) {
    const target = ElementList.find(it => it.ElementID === item.Property.ID);
    if (target) {
      const { Label, Content } = getElementValueContentFromDetail(target, isCraftUse);
      if (Content) {
        return { Label, Content };
      }
    }
  }
  return null;
};

const getDisplayContentByGroupFromDetailData = (GroupList, item, isCraftUse = false) => {
  if (Array.isArray(GroupList) && GroupList.length > 0 && item) {
    const target = GroupList.find(it => it.GroupID === item.Property.ID);
    if (target && target.List.length > 0) {
      let _list = [];
      target.List.forEach(valList => {
        const groupItemContent = valList.List
          .map(_it => {
            const t = getDisplayContentByElementFromDetailData(valList.List, { Property: { ID: _it.ElementID } }, isCraftUse);
            return t;
          })
          .filter(_it => _it && _it.Content)
          .map(({ Label, Content }) => `${Label}${Label ? '：' : ''}${Content}`);
        if (groupItemContent) _list.push(groupItemContent);
      });
      if (_list.length > 0) {
        _list = _list.map((Content, i) => {
          // eslint-disable-next-line no-nested-ternary
          let Label = _list.length > 1 && i > 0
            ? (isCraftUse ? `${target.Attributes.Name}${i + 1}` : `${target.Attributes.Name}-notFirst`)
            : _list.length > 1 && isCraftUse ? `${target.Attributes.Name}${i + 1}` : target.Attributes.Name;
          if (target.Attributes.IsNameHidden) Label = '';
          return { Label, Content };
        });
        return _list;
      }
    }
  }
  return null;
};

const getCraftItemContentNameFromDetailData = (Craft) => {
  if (!Craft) return { Name: '工艺' };
  const { ElementList, GroupList } = Craft;
  if (
    (!Array.isArray(ElementList) || ElementList.length === 0)
      && (!Array.isArray(GroupList) || GroupList.length === 0)
  ) return { Name: Craft.Attributes.DisplayName };
  const ElContent = [];
  const GroupContent = [];
  const hasElementList = Array.isArray(ElementList) && ElementList.length > 0;
  const hasGroupList = Array.isArray(GroupList) && GroupList.length > 0;
  const hiddenGroupName = !hasElementList && hasGroupList && GroupList.length === 1;
  if (hasElementList) {
    ElementList.forEach((it) => {
      const _data = getElementValueContentFromDetail(it, true);
      if (_data) {
        const { Label, Content } = _data;
        // if (Content) ElContent.push(`${Label}${Label ? '：' : ''}${Content}`);
        if (Content) ElContent.push({ type: 'ElementList', Label, Content });
      }
    });
  }
  if (hasGroupList) {
    GroupList.forEach((it) => {
      if (it.List.length === 0) return;
      const _data = getDisplayContentByGroupFromDetailData(GroupList, { Property: { ID: it.GroupID } }, true);
      if (Array.isArray(_data) && _data.length > 0) {
        _data.forEach((_it) => {
          const { Label, Content } = _it;
          if (Content) {
            // if (hiddenGroupName || !Label) GroupContent.push(`[ ${Content.join('，')} ]`);
            // else GroupContent.push(`${Label}：[ ${Content.join('，')} ]`);
            if (hiddenGroupName || !Label) GroupContent.push({ type: 'GroupList', Label: '', Content: `${Content.join('，')}` });
            else GroupContent.push({ type: 'GroupList', Label, Content: `${Content.join('，')}` });
          }
        });
      }
    });
  }
  if (ElContent.length > 0 || GroupContent.length > 0) {
    const temp = {
      Name: Craft.Attributes.DisplayName,
      // Content: `${ElContent.join('，')}${ElContent.length > 0 && GroupContent.length > 0 ? '；' : ''}${GroupContent.join('，')}`,
      Content: [...ElContent, ...GroupContent],
    };
    return temp;
  }
  return { Name: Craft.Attributes.DisplayName };
};

const getDisplayContentByCraftFromDetailData = ({ CraftList, CraftGroupList }, item) => {
  if (item && Array.isArray(CraftList) && Array.isArray(CraftGroupList) && item.Property && item.Property.ID) {
    const t = CraftGroupList.find(it => it.ID === item.Property.ID);
    if (t) {
      const list = CraftList.filter(it => t.List.includes(it.CraftID));
      if (list.length > 0) {
        const CraftGroupLabel = t.Name || '工艺';
        const temp = { Label: CraftGroupLabel, Content: [] };
        temp.Content = list.map(it => getCraftItemContentNameFromDetailData(it)).filter(it => it);
        return temp;
      }
    }
  }
  return null;
};

/**
 * @description: 用产品详情展示的类
 * @param {*}
 * @return {*}
 */
export default class ProductDetailTypeShowClass {
  static getCraftContentName(value, Craft, ChildUseAffectedPropList = [], disabled = false, isDetail = false) {
    if (!Craft) return { Name: '工艺' };
    if (!value || disabled) return { Name: Craft.ShowName };
    const { ElementList, GroupList } = value;
    if (
      (!Array.isArray(ElementList) || ElementList.length === 0)
      && (!Array.isArray(GroupList) || GroupList.length === 0)
    ) return { Name: Craft.ShowName };
    let ElContent = [];
    let GroupContent = [];
    const hasElementList = Array.isArray(ElementList) && ElementList.length > 0;
    const hasGroupList = Array.isArray(GroupList) && GroupList.length > 0;
    const filteredElementShowList = Craft.ElementList?.filter((_it) => !_it.HiddenToCustomer) || [];
    const filteredGroupShowList = Craft.GroupList?.filter((_it) => !_it.HiddenToCustomer) || [];
    if (hasElementList) {
      ElementList.forEach((it) => {
        const t = filteredElementShowList.find(
          (_it) => _it.ID === it.ElementID,
        );
        if (t) {
          const text = getElementValueText(it.CustomerInputValues, t, ChildUseAffectedPropList, isDetail);
          if (text) ElContent.push(text);
        }
      });
      ElContent = ElContent.filter(it => it);
      ElContent = isDetail ? ElContent : handleCraftContentCombine(ElContent);
    }
    if (hasGroupList) {
      GroupList.forEach((it) => {
        const t = filteredGroupShowList.find(
          (_it) => _it.ID === it.GroupID,
        );
        if (t) {
          const text = getGroupValueText(it.List, t, ChildUseAffectedPropList, isDetail);
          if (text) {
            if (isDetail) {
              GroupContent.push(...text);
            } else {
              GroupContent.push(text);
            }
          }
        }
      });
      GroupContent = GroupContent.filter(it => it);
    }
    if (ElContent.length > 0 || GroupContent.length > 0) {
      const temp = {
        Name: Craft.ShowName,
        Content: !isDetail
          ? `${ElContent.join(' ')} ${GroupContent.join(' ')}`
          : [...ElContent, ...GroupContent],
        // : `${ElContent.join('，')}${GroupContent.length > 0 ? '；' : ''} ${GroupContent.join(' ')}`,
      };
      // return `${Craft.ShowName} ${ElContent.join(' ')} ${GroupContent.join('')}`;
      return temp;
    }
    return { Name: Craft.ShowName };
  }

  static getCraftItemContentName(itemID, CraftValList, CraftList, isDetail = false) {
    if (!itemID || !CraftValList || !CraftList) return null;
    const val = CraftValList.find(it => it.CraftID === itemID);
    if (!val) return null;
    const data = CraftList.find(it => it.ID === itemID);
    if (!data) return null;
    return this.getCraftContentName(val, data, [], false, isDetail);
  }

  static getDisplayContentByCraft(CraftValList, item, originPartData, isDetail = false) {
    if (CraftValList && item && originPartData && originPartData.CraftGroupList) {
      const t = originPartData.CraftGroupList.find(it => it.ID === item.Property.ID);
      // getDisplayContentByGroup
      if (t && t.List) {
        const temp = { Label: t.Name, Content: [] };
        temp.Content = t.List
          .map(it => ProductDetailTypeShowClass.getCraftItemContentName(it, CraftValList, originPartData.CraftList, isDetail))
          .filter(it => it);
        console.log(temp);
        return temp;
      }
    }
    return null;
  }

  static getDisplayContentFromPartData(partData, originPartData) {
    const { DisplayList } = originPartData;
    const arr = [];
    const { ProductDisplayPropertyTypeList } = store.state.Quotation;
    if (Array.isArray(DisplayList) && DisplayList.length > 0) {
      DisplayList.forEach(itemData => {
        const t = ProductDisplayPropertyTypeList.find(it => it.ID === itemData.Type);
        if (!t) return;
        let target;
        switch (t.Name) {
          case '元素':
            target = getDisplayContentByElement(partData.ElementList, itemData, originPartData.ElementList);
            if (target && target.Content) {
              arr.push({ type: 'ElementList', Label: target.Label, Content: target.Content });
            }
            break;
          case '元素组':
            target = getDisplayContentByGroup(partData.GroupList, itemData, originPartData.GroupList);
            // if (Array.isArray(target)) {
            //   arr.push(...target.map(it => ({ type: 'GroupList', Label: it.Label, Content: it.Content })));
            // }
            if (Array.isArray(target) && target.length > 0) {
              target.forEach((_it) => {
                const { Label, Content } = _it;
                if (Content) {
                  // if (!Label) GroupContent.push(`${Content.join('，')}`);
                  // else GroupContent.push(`${Label}：[ ${Content.join('，')} ]`);
                  arr.push({ type: 'GroupList', Label, Content: `${Content.join('，')}` });
                }
              });
            }
            break;
          case '尺寸组':
            if (partData.Size && partData.Size.List && partData.Size.List.length > 0 && originPartData.SizeGroup && originPartData.SizeGroup.GroupInfo) {
              // 判断是否为相同单位
              const { isUnique, Unit } = getUniqueSizeUnit(partData.Size.List, originPartData.SizeGroup.GroupInfo.ElementList);
              target = partData.Size.List
                .map(_it => getDisplayContentByElement(
                  partData.Size.List, { Property: { ID: _it.ElementID } }, originPartData.SizeGroup.GroupInfo.ElementList, isUnique,
                ))
                .filter(_it => _it && _it.Content)
                .map(({ Content }) => `${Content}`).join(' x ');
              if (target) arr.push({ type: 'Size', Label: originPartData.SizeGroup.GroupInfo.Name, Content: target ? target.concat(Unit) : target });
            }
            break;
          case '物料':
            for (let i = 0; i < originPartData.TypeList.length; i += 1) {
              const { List } = originPartData.TypeList[i];
              target = List.find(it => it.ID === partData.MaterialID);
              if (target) {
                arr.push({ type: 'MaterialID', Label: originPartData.MaterialDisplayName, Content: target.Name });
                break;
              }
            }
            break;
          case '工艺':
            target = this.getDisplayContentByCraft(partData.CraftList, itemData, originPartData, true);
            if (target) {
              arr.push({ type: 'CraftList', Label: target.Label, Content: target.Content });
            }
            break;
          case '工厂': // 工厂隐藏 不考虑
            break;
          default:
            break;
        }
      });
    }
    return arr;
  }

  /**
   * @description: 按照DisplayList排序获取到展示列表
   * @param {*}
   * @return {*}
   */
  static getProductDetailShowDataList(ProductParams, curProductInfo2Quotation) {
    const rootContent = this.getDisplayContentFromPartData(ProductParams, curProductInfo2Quotation);
    const root = {
      Name: curProductInfo2Quotation.ShowName,
      ContentList: rootContent,
      Type: 'product',
    };
    const list = [root];
    ProductParams.PartList.forEach(Part => {
      const originPartData = curProductInfo2Quotation.PartList.find(it => it.ID === Part.PartID);
      if (originPartData && Part.List && Part.List.length > 0) {
        const showIndex = Part.List.length > 1;
        Part.List.forEach((PartItemValData, index) => {
          const Name = showIndex ? `${originPartData.Name}（ ${transformNumToChindNum(index)} ）` : originPartData.Name;
          const temp = {
            Name,
            ContentList: this.getDisplayContentFromPartData(PartItemValData, originPartData),
            Type: 'Part',
          };
          list.push(temp);
        });
      }
    });
    return list;
  }

  /**
   * @description: 购物车列表获取订单详情列表展示数据
   * @param {*} partData
   * @param {*} originPartData
   * @return {*}
   */
  static getDisplayContentFromPartDataByDetailData(DisplayList, ProductParams) {
    if (!ProductParams || !DisplayList) return [];
    const arr = [];
    const { ProductDisplayPropertyTypeList } = store.state.Quotation;
    if (Array.isArray(DisplayList) && DisplayList.length > 0) {
      DisplayList.forEach(itemData => {
        const t = ProductDisplayPropertyTypeList.find(it => it.ID === itemData.Type);
        if (!t) return;
        let target;
        switch (t.Name) {
          case '元素':
            target = getDisplayContentByElementFromDetailData(ProductParams.ElementList, itemData);
            if (target && target.Content) {
              arr.push({ type: 'ElementList', Label: target.Label, Content: target.Content });
            }
            break;
          case '元素组':
            target = getDisplayContentByGroupFromDetailData(ProductParams.GroupList, itemData);
            if (Array.isArray(target) && target.length > 0) {
              target.forEach((_it) => {
                const { Label, Content } = _it;
                if (Content) {
                  // if (!Label) GroupContent.push(`${Content.join('，')}`);
                  // else GroupContent.push(`${Label}：[ ${Content.join('，')} ]`);
                  arr.push({ type: 'GroupList', Label, Content: `${Content.join('，')}` });
                }
              });
            }
            // if (Array.isArray(target)) {
            //   arr.push(...target.map(it => ({ type: 'GroupList', Label: it.Label, Content: it.Content })));
            // }
            break;
          case '尺寸组':
            if (ProductParams.Size?.DisplayContent) {
              const Label = ProductParams.Size.GroupName || '尺寸';
              arr.push({ type: 'Size', Label, Content: ProductParams.Size.DisplayContent });
            }
            break;
          case '物料':
            if (ProductParams.Attributes?.MaterialName) {
              arr.push({ type: 'MaterialID', Label: ProductParams.Attributes.MaterialTipsName || '物料', Content: ProductParams.Attributes.MaterialName });
            }
            break;
          case '工艺':
            target = getDisplayContentByCraftFromDetailData(ProductParams, itemData);
            if (target) {
              arr.push({ type: 'CraftList', Label: target.Label, Content: target.Content });
            }
            break;
          case '工厂': // 工厂隐藏 不考虑
            break;
          default:
            break;
        }
      });
    }
    return arr;
  }
}
