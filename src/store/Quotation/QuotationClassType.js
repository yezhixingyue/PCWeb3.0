/* eslint-disable object-curly-newline */
/* eslint-disable no-use-before-define */
import massage from '@/assets/js/utils/message';
import store from '@/store';
import { getPropertiesAffectedByInteraction } from './EffectiveControlList';
import InterAction from './Interaction';

// eslint-disable-next-line no-unused-vars
function _setErrMsg(errMsg) {
  const msg = store.state.Quotation.curSelectStatus;
  massage.failSingleError({ title: `${msg}失败`, msg: errMsg });
}

export const getRequiredCraftListAndSubControlList = (obj) => {
  const ControlList = obj.ControlList?.filter(it => it.ControlType === 0 && it.Constraint?.ItemList?.length === 0);
  const requiredCraftList = ControlList && ControlList.length > 0
    ? ControlList
      .map(it => it.List.filter(_it => _it.Operator === 23 && _it.Property.Craft && !_it.Property.Element && !_it.Property.Group))
      .reduce((prev, next) => [...prev, ...next], [])
    : []; // 必选工艺列表
  const subControlList = obj.ControlList?.filter(it => it.ControlType === 1) || []; // 子交互列表
  return { requiredCraftList, subControlList };
};

export default class QuotationClassType {
  static init(obj) {
    if (!obj || Object.prototype.toString.call(obj) !== '[object Object]') return {};
    const _obj = JSON.parse(JSON.stringify(obj));
    const { requiredCraftList, subControlList } = getRequiredCraftListAndSubControlList(obj);
    const ProductInfo = this.getPartSubmitData(_obj, requiredCraftList, subControlList) || {}; // 生成产品本身数据
    const partSubmitDatas = _obj.PartList.map(part => { // 生成部件列表数据
      const List = [];
      const PartID = part.ID;
      const showPart = !!this.getPartSubmitData(part, []); // showPart用来指定去除一些无效数据
      if (part.UseTimes && part.UseTimes.MinValue > 0) {
        for (let i = 0; i < part.UseTimes.MinValue; i += 1) {
          const item = this.getPartSubmitData(part, requiredCraftList, subControlList);
          if (showPart) List.push({ ...item, key: Math.random().toString(36).slice(-10) });
        }
      }
      return { PartID, List, showPart };
    }).filter(it => it.showPart);
    return {
      ProductID: _obj.ID,
      ...ProductInfo,
      PartList: [...partSubmitDatas],
    };
  }

  static getInitCustomerInputValues(el) { // 获取属性默认checked值
    let temp = [{
      ID: '',
      Name: '',
      Value: '',
    }];
    switch (el.Type) {
      case 1: // 数字值
        if (el.NumbericAttribute && (el.NumbericAttribute.CheckedValue || el.NumbericAttribute.CheckedValue === 0)) {
          temp[0].Value = `${el.NumbericAttribute.CheckedValue}`;
        }
        break;
      case 2: // 选项值
        temp = el.OptionAttribute?.OptionList?.filter(it => it.IsChecked && !it.HiddenToCustomer).map(it => ({ ID: it.ID })) || temp;
        break;
      case 3: // 开关
        if (el.SwitchAttribute) {
          temp[0].Value = el.SwitchAttribute.DefaultOpen ? `${el.SwitchAttribute.OpenValue}` : `${el.SwitchAttribute.CloseValue}`;
        }
        break;
      default:
        break;
    }
    return temp;
  }

  static initOriginData(obj) {
    if (!obj || Object.prototype.toString.call(obj) !== '[object Object]') return {};
    const _obj = JSON.parse(JSON.stringify(obj));
    if (Array.isArray(_obj.DisplayList)) {
      _obj.DisplayList = _obj.DisplayList.map(it => ({ ...it, key: Math.random().toString(36).slice(-10) }));
    }
    return _obj;
  }

  static getPartSubmitData(PartData, requiredCraftList, subControlList) { // 转换产品|部件数据为提交数据
    const { ProductDisplayPropertyTypeList } = store.state.Quotation;
    let temp;
    if (Array.isArray(PartData.DisplayList) && PartData.DisplayList.length > 0) {
      // 去除无效数据，比如物料数组长度为0的物料属性
      const _DisplayList = PartData.DisplayList.filter(item => {
        const t = ProductDisplayPropertyTypeList.find(it => it.ID === item.Type);
        let bool = false;
        if (t) {
          bool = true;
          const TypeName = t.Name;
          switch (TypeName) {
            case '物料':
              if (!PartData.MaterialList || PartData.MaterialList.filter(it => !it.HiddenToCustomer).length === 0) {
                bool = false;
              }
              break;

            default:
              break;
          }
        }
        return bool;
      });
      if (_DisplayList.length === 0) return null;
      temp = {};
      let isCraftInited = false;
      let _list = [];
      if (Array.isArray(subControlList)) _list = subControlList.filter(it => (!it.PartID && PartData.ProductClass) || it.PartID === PartData.ID);
      // 部件本身的子交互：
      temp.SubControlList = _list.filter(_it => _it.PartID && !_it.GroupID && !_it.CraftID);
      // 部件上元素组 或 部件工艺元素组上的子交互
      const otherSubControlList = _list.filter(_it => _it.GroupID);
      temp.ChildSubControlList = otherSubControlList;
      PartData.DisplayList.forEach(item => {
        const t = ProductDisplayPropertyTypeList.find(it => it.ID === item.Type);
        if (t) {
          const TypeName = t.Name;
          let target = null;
          switch (TypeName) {
            case '元素':
              target = PartData.ElementList.find(it => it.ID === item.Property.ID && !it.HiddenToCustomer);
              if (target) {
                if (!temp.ElementList) temp.ElementList = [];
                temp.ElementList.push({ ElementID: target.ID, CustomerInputValues: this.getInitCustomerInputValues(target) });
              }
              break;
            case '元素组':
              target = getTargetGroup(item, PartData.SizeGroup, PartData.GroupList);
              if (target) {
                // 判断是否尺寸组
                const [Prop, isSize] = target;
                if (isSize) temp.Size = getSizeSubmitData(Prop); // 尺寸组
                else {
                  if (!temp.GroupList) temp.GroupList = [];
                  temp.GroupList.push(this.getGroupItemSubmitData(Prop, false, otherSubControlList)); // 元素组
                }
              }
              break;
            case '物料':
              // 此处获取该部件物料列表数据(筛选过后)，如果长度为0 则不生成下面数据 -- 已在上面筛选判断
              target = PartData.MaterialList.filter(it => !it.HiddenToCustomer);
              if (target.length > 0) temp.MaterialID = target[0].ID;
              break;
            case '工艺':
              if (isCraftInited) return;
              temp.CraftList = [];
              if (Array.isArray(PartData.CraftConditionList) && PartData.CraftConditionList.length > 0) {
                PartData.CraftConditionList.forEach(it => {
                  if (it.IsRequired && it.DefaultCraft) {
                    const _craft = PartData.CraftList.find(_it => _it.ID === it.DefaultCraft && !_it.HiddenToCustomer);
                    if (_craft && (!_craft.ElementList || _craft.ElementList.length === 0) && (!_craft.GroupList || _craft.GroupList.length === 0)) {
                      const _data = this.getCraftItemSubmitData(_craft, otherSubControlList);
                      temp.CraftList.push(_data);
                    }
                  }
                });
              }
              if (Array.isArray(requiredCraftList)) {
                requiredCraftList.forEach(({ Property }) => {
                  if ((!Property.Part && PartData.ProductClass) || (Property.Part && Property.Part.ID === PartData.ID)) {
                    // 同为产品 或 同一部件
                    // 接着判断是否已勾选
                    const _craft = PartData.CraftList.find(_it => _it.ID === Property.Craft.ID && !_it.HiddenToCustomer);
                    if (_craft && _craft.ElementList.length === 0 && _craft.GroupList.length === 0) {
                      const _t = temp.CraftList.find(it => it.CraftID === Property.Craft.ID);
                      if (!_t) temp.CraftList.push(this.getCraftItemSubmitData(_craft, otherSubControlList));
                    }
                  }
                });
              }
              isCraftInited = true;
              // 其实是工艺显示分组，所以
              // 1 首先要找到该分组
              // target = PartData.CraftGroupList.find(it => it.ID === item.Property.ID);
              // if (target && Array.isArray(target.List)) {
              //   // 2 找到该分组对应到的工艺组成的列表，并筛选掉需要对客户隐藏的工艺
              //   const _craftList = PartData.CraftList.filter(it => target.List.includes(it.ID) && !it.HiddenToCustomer);
              //   // 3. 把工艺分组转换成需要提交的数据格式
              //   const _list = _craftList.map(_craft => this.getCraftItemSubmitData(_craft));
              //   // 4. 把该列表数据加入到总数据的CraftList中
              //   if (!temp.CraftList) temp.CraftList = [];
              //   temp.CraftList.push(..._list);
              // }
              break;
            default:
              break;
          }
        }
      });
    }
    return temp;
  }

  static getGroupItemSubmitData(Prop, isItem = false, otherSubControlList) { // 获取元素组提交数据
    const { UseTimes, ID, ElementList } = Prop;
    const getItem = () => {
      const _item = {
        List: [],
        key: Math.random().toString(36).slice(-10),
      };
      _item.List = ElementList.filter(_it => !_it.HiddenToCustomer)
        .map(_it => ({ ElementID: _it.ID, CustomerInputValues: this.getInitCustomerInputValues(_it) }));
      return _item;
    };
    if (isItem) return getItem();
    const _groupItem = {
      GroupID: ID,
      List: [], // 此处一项代表一行
      SubControlList: [],
    };
    if (UseTimes && UseTimes.MinValue > 0) {
      for (let i = 0; i < UseTimes.MinValue; i += 1) {
        const _item = getItem();
        _groupItem.List.push(_item);
      }
    }
    if (otherSubControlList.length > 0) {
      _groupItem.SubControlList = otherSubControlList.filter(it => it.GroupID === Prop.ID);
    }
    return _groupItem;
  }

  static getCraftItemSubmitData(_craft, otherSubControlList) {
    let GroupList = [];
    let ElementList = [];
    if (Array.isArray(_craft.ElementList)) {
      ElementList = _craft.ElementList.filter(el => !el.HiddenToCustomer).map(el => ({
        ElementID: el.ID,
        CustomerInputValues: this.getInitCustomerInputValues(el),
      }));
    }
    if (Array.isArray(_craft.GroupList)) {
      const _otherSubControlList = otherSubControlList.filter(it => it.CraftID === _craft.ID);
      GroupList = _craft.GroupList.filter(_it => !_it.HiddenToCustomer).map(_it => this.getGroupItemSubmitData(_it, false, _otherSubControlList));
    }
    const _item = {
      CraftID: _craft.ID,
      GroupList,
      ElementList,
    };
    return _item;
  }

  static transformToSubmit(obj, curProductInfo2Quotation, PropertiesAffectedByInteraction) {
    if (!obj || !curProductInfo2Quotation) return obj;
    const clearEmpty = false; // 是否清除掉数值列表为空的元素

    const temp = JSON.parse(JSON.stringify(obj));
    const getSizeData = (Size, partData) => {
      if (Size && !Size.isCustomize && Size.ID && partData.SizeGroup && Array.isArray(partData.SizeGroup.SizeList)) {
        const t = partData.SizeGroup.SizeList.find(_it => _it.ID === Size.ID);
        if (t && t.List) {
          const _list = t.List.map(({ First, Second }) => {
            const _t = partData.SizeGroup.GroupInfo.ElementList.find(_it => _it.ID === First);
            const _temp = { Value: '', ID: '' };
            if (_t) {
              if (_t.Type === 2) _temp.ID = Second;
              else _temp.Value = Second;
            }
            return { ElementID: First, CustomerInputValues: [_temp] };
          });
          return { ...Size, List: _list };
        }
      }
      return Size;
    };
    // 转换产品尺寸
    if (temp.Size) temp.Size = getSizeData(temp.Size, curProductInfo2Quotation);
    if (Array.isArray(temp.PartList) && temp.PartList.length > 0) {
      // 转换部件尺寸
      const OriginPartList = curProductInfo2Quotation.PartList || [];
      temp.PartList.forEach(it => {
        if (Array.isArray(it.List) && it.List.length > 0) {
          const { PartID } = it;
          const targetOriginPart = OriginPartList.find(_it => _it.ID === PartID);
          if (targetOriginPart) {
            it.List.forEach(itemPartData => {
              const _itemPartData = itemPartData;
              if (itemPartData.Size) _itemPartData.Size = getSizeData(itemPartData.Size, targetOriginPart);
            });
          }
        }
      });
    }
    // 转换数值 清除为空的元素值等
    const getSingleElementClearValue = ElVal => {
      if (!ElVal || !Array.isArray(ElVal.CustomerInputValues) || ElVal.CustomerInputValues.length === 0) return null;
      const CustomerInputValues = ElVal.CustomerInputValues.map(({ ID, Name, Value }) => {
        if (ID) return { ID };
        if (Name) return { Name };
        if (Value) return { Value };
        return null;
      }).filter(it => it);
      if (CustomerInputValues.length === 0 && clearEmpty) return null;
      return {
        ...ElVal,
        CustomerInputValues,
      };
    };
    const getElementListValueFilter = (ElementList, disabledElementIDs = []) => {
      if (!ElementList || !Array.isArray(ElementList)) return [];
      return ElementList.map(it => (disabledElementIDs.includes(it.ElementID) ? null : getSingleElementClearValue(it))).filter(it => it);
    };
    const getGroupListValueFilter = (GroupList, GroupAffectedPropList = []) => {
      if (!GroupList || !Array.isArray(GroupList)) return [];
      const disabledGroupIDs = InterAction.getDisabledOrHiddenedGroupIDList(GroupAffectedPropList);
      return GroupList.map(Group => {
        if (!Array.isArray(Group.List) || Group.List.length === 0) return null;
        const List = Group.List.map(item => {
          if (disabledGroupIDs.includes(item.GroupID)) return null;
          const groupItemAffectedPropList = GroupAffectedPropList.filter(it => it.Property.Group.ID === item.GroupID);
          const disabledElementIDs = InterAction.getDisabledOrHiddenedElementIDList(groupItemAffectedPropList);
          const itemList = getElementListValueFilter(item.List, disabledElementIDs);
          if (itemList.length === 0) return null;
          return {
            ...item,
            List: itemList,
          };
        }).filter(it => it);
        if (List.length === 0) return null;
        return {
          ...Group,
          List,
        };
      }).filter(it => it);
    };
    const getCraftListValueFilter = (CraftList, CraftAffectedPropList = []) => {
      const disabledCraftIDs = InterAction.getDisabledOrHiddenedCraftIDList(CraftAffectedPropList);
      return CraftList.map(Craft => {
        if (disabledCraftIDs.includes(Craft.CraftID)) return null;
        const CraftItemAffectedList = CraftAffectedPropList.filter(it => it.Property.Craft.ID === Craft.CraftID);
        const GroupAffectedPropList = InterAction.getGroupTypeAffectedPropList(CraftItemAffectedList);
        const disabledElementIDs = InterAction.getDisabledOrHiddenedElementIDList(CraftItemAffectedList);
        return {
          ...Craft,
          ElementList: getElementListValueFilter(Craft.ElementList, disabledElementIDs),
          GroupList: getGroupListValueFilter(Craft.GroupList, GroupAffectedPropList),
        };
      }).filter(it => it);
    };

    const getClearPartEmptyValues = (Part, PartID) => {
      if (!Part || Object.prototype.toString.call(Part) !== '[object Object]') return Part;
      // 找出作用与当前部件的交互列表数据
      let InterActionData = [];
      if (Array.isArray(PropertiesAffectedByInteraction) && PropertiesAffectedByInteraction.length > 0) {
        InterActionData = PropertiesAffectedByInteraction
          .filter(it => (!it.Property.Part && !PartID) || (it.Property.Part && it.Property.Part.ID === PartID));
      }
      const _Part = Part;
      if (Array.isArray(_Part.ElementList)) {
        const disabledElementIDs = InterAction.getDisabledOrHiddenedElementIDList(InterActionData);
        _Part.ElementList = getElementListValueFilter(_Part.ElementList, disabledElementIDs);
      }
      if (Array.isArray(_Part.GroupList)) {
        const GroupAffectedPropList = InterAction.getGroupTypeAffectedPropList(InterActionData);
        _Part.GroupList = getGroupListValueFilter(_Part.GroupList, GroupAffectedPropList);
      }
      if (Array.isArray(_Part.CraftList)) {
        const CraftAffectedPropList = InterAction.getCraftTypeAffectedPropList(InterActionData);
        _Part.CraftList = getCraftListValueFilter(_Part.CraftList, CraftAffectedPropList);
      }
      if (_Part.Size && typeof _Part.Size === 'object') {
        _Part.Size = {
          ..._Part.Size,
          List: getElementListValueFilter(_Part.Size.List),
        };
      }
      // 物料暂不处理
      return _Part;
    };
    const _temp = getClearPartEmptyValues(temp);
    const PartList = temp.PartList.map(part => ({
      ...part,
      List: part.List.map(it => getClearPartEmptyValues(it, part.PartID)),
    }));
    // 后面或可需要在此处处理用于转换受交互限制的属性值修改任务...
    return {
      ..._temp,
      PartList,
    };
  }

  static getPropertiesAffectedByInteraction(ProductParams, curProductInfo2Quotation) { // 获取到当前受到交互影响的需要处理的属性列表
    return getPropertiesAffectedByInteraction(ProductParams, curProductInfo2Quotation);
  }
}

const getTargetGroup = (item, SizeGroup, GroupList) => { // 根据Display中的属性组信息获取到对应的尺寸组或元素组数据 并对其以区分
  if (SizeGroup?.GroupInfo?.ID === item.Property.ID && !SizeGroup.GroupInfo.HiddenToCustomer) {
    // 尺寸组
    return [SizeGroup, true];
  }
  if (!GroupList) return null;
  const t = GroupList.find(it => it.ID === item.Property.ID && !it.HiddenToCustomer);
  return t ? [t, false] : null;
};

const getSizeSubmitData = (Prop) => { // 获取尺寸组提交数据
  let ID = '';
  let isCustomize = false;
  const List = [];
  const {
    AllowCustomerCustomize, IsCheckedCustomerCustomize, GroupInfo, SizeList,
  } = Prop;
  if (Array.isArray(SizeList) && SizeList.filter(it => !it.HiddenToCustomer).length > 0) ID = SizeList.filter(it => !it.HiddenToCustomer)[0].ID;
  if (AllowCustomerCustomize && (IsCheckedCustomerCustomize || SizeList.filter(_it => !_it.HiddenToCustomer).length === 0)) {
    isCustomize = true;
  }
  if (Array.isArray(GroupInfo?.ElementList)) {
    GroupInfo.ElementList.forEach(el => {
      const _item = {
        ElementID: el.ID,
        CustomerInputValues: QuotationClassType.getInitCustomerInputValues(el),
      };
      List.push(_item);
    });
  }
  return { ID, isCustomize, List };
};
