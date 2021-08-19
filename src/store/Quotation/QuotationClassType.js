/* eslint-disable no-use-before-define */
import massage from '@/assets/js/utils/message';
import store from '@/store';

// eslint-disable-next-line no-unused-vars
function _setErrMsg(errMsg) {
  const msg = store.state.Quotation.curSelectStatus;
  massage.failSingleError({ title: `${msg}失败`, msg: errMsg });
}

export default class QuotationClassType {
  static init(obj) {
    if (!obj || Object.prototype.toString.call(obj) !== '[object Object]') return {};
    const _obj = JSON.parse(JSON.stringify(obj));

    const ProductInfo = this.getPartSubmitData(_obj); // 生成产品本身数据
    const partSubmitDatas = _obj.PartList.map(part => { // 生成部件列表数据
      const List = [];
      const PartID = part.ID;
      if (part.UseTimes && part.UseTimes.MinValue > 0) {
        for (let i = 0; i < part.UseTimes.MinValue; i += 1) {
          const item = this.getPartSubmitData(part);
          List.push({ ...item, key: Math.random().toString(36).slice(-10) });
        }
      }
      return { PartID, List };
    });
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
        temp = el.OptionAttribute?.OptionList?.filter(it => it.IsChecked).map(it => ({ ID: it.ID })) || temp;
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

  static getPartSubmitData(PartData) { // 转换产品|部件数据为提交数据
    const { ProductDisplayPropertyTypeList } = store.state.Quotation;
    const temp = {};
    if (Array.isArray(PartData.DisplayList)) {
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
                  temp.GroupList.push(this.getGroupItemSubmitData(Prop)); // 元素组
                }
              }
              break;
            case '物料':
              // 暂不用操作
              temp.Material = { ID: '' };
              break;
            case '工艺':
              // 其实是工艺显示分组，所以
              // 1 首先要找到该分组
              target = PartData.CraftGroupList.find(it => it.ID === item.Property.ID);
              if (target && Array.isArray(target.List)) {
                // 2 找到该分组对应到的工艺组成的列表，并筛选掉需要对客户隐藏的工艺
                const _craftList = PartData.CraftList.filter(it => target.List.includes(it.ID) && !it.HiddenToCustomer);
                // 3. 把工艺分组转换成需要提交的数据格式
                const _list = _craftList.map(_craft => {
                  let GroupList = [];
                  let ElementList = [];
                  if (Array.isArray(_craft.ElementList)) {
                    ElementList = _craft.ElementList.filter(el => !el.HiddenToCustomer).map(el => ({
                      ElementID: el.ID,
                      CustomerInputValues: this.getInitCustomerInputValues(el),
                    }));
                  }
                  if (Array.isArray(_craft.GroupList)) {
                    GroupList = _craft.GroupList.filter(_it => !_it.HiddenToCustomer).map(_it => this.getGroupItemSubmitData(_it));
                  }
                  const _item = {
                    CraftID: _craft.ID,
                    GroupList,
                    ElementList,
                  };
                  return _item;
                });
                // 4. 把该列表数据加入到总数据的CraftList中
                if (!temp.CraftList) temp.CraftList = [];
                temp.CraftList.push(..._list);
              }
              break;
            default:
              break;
          }
        }
      });
    }
    return temp;
  }

  static getGroupItemSubmitData(Prop, isItem = false) { // 获取元素组提交数据
    const { UseTimes, ID, ElementList } = Prop;
    const getItem = () => {
      const _item = {
        List: [],
        key: Math.random().toString(36).slice(-10),
      };
      _item.List = ElementList.map(_it => ({ ElementID: _it.ID, CustomerInputValues: this.getInitCustomerInputValues(_it) }));
      return _item;
    };
    if (isItem) return getItem();
    const _groupItem = {
      GroupID: ID,
      List: [], // 此处一项代表一行
    };
    if (UseTimes && UseTimes.MinValue > 0) {
      for (let i = 0; i < UseTimes.MinValue; i += 1) {
        const _item = getItem();
        _groupItem.List.push(_item);
      }
    }
    return _groupItem;
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
  if (Array.isArray(SizeList) && SizeList.length > 0) ID = SizeList[0].ID;
  if (AllowCustomerCustomize && IsCheckedCustomerCustomize) {
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

// const getGroupItemSubmitData = (Prop) => { // 获取元素组提交数据
//   const { UseTimes, ID, ElementList } = Prop;
//   const _groupItem = {
//     GroupID: ID,
//     List: [], // 此处一项代表一行
//   };
//   if (UseTimes && UseTimes.MinValue > 0) {
//     for (let i = 0; i < UseTimes.MinValue; i += 1) {
//       const _item = {
//         List: [],
//         key: Math.random().toString(36).slice(-10),
//       };
//       _item.List = ElementList.map(_it => ({ ElementID: _it.ID, CustomerInputValues: QuotationClassType.getInitCustomerInputValues(_it) }));
//       _groupItem.List.push(_item);
//     }
//   }
//   return _groupItem;
// };
