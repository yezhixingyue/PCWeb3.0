<template>
  <li class="mp-place-order-panel-comp-craft-type-item-comp-wrap">
    <ShowProductBtn
      @click.native="handleClick"
      :title="craftTitle"
      :disabled="disabled"
      :isActive="!!value"
    />
    <template v-if="value && !withoutContent">
      <i class="iconfont icon-bianji is-cyan" @click="handleEditClick"></i>
    </template>
    <CraftContentSetupDialog
      :visible.sync="visible"
      :Craft="Craft"
      :setupData="value"
      :AffectedPropList="ChildUseAffectedPropList"
      @submit="handleDialogSubmit"
    />
  </li>
</template>

<script>
import ShowProductBtn from '@/components/QuotationComps/SMComps/ShowProductBtn.vue';
import InterAction from '@/store/Quotation/Interaction';
import CraftContentSetupDialog from './CraftContentSetupDialog.vue';

export default {
  props: {
    Craft: {
      type: Object,
      default: () => ({}),
    },
    value: {
      type: Object,
      default: null,
    },
    AffectedPropList: {
      // 受到交互影响的工艺列表
      type: Array,
      default: () => [],
    },
  },
  components: {
    ShowProductBtn,
    CraftContentSetupDialog,
  },
  data() {
    return {
      visible: false,
      disabled: false,
      required: false,
      recordInfo: null,
    };
  },
  computed: {
    filteredElementShowList() {
      // 筛选后可用于客户设置的工艺元素列表 如果长度为0则没有元素或不需要设置元素
      return (
        this.Craft?.ElementList?.filter((_it) => !_it.HiddenToCustomer) || []
      );
    },
    filteredGroupShowList() {
      // 筛选后可用于客户设置的工艺元素组列表
      return (
        this.Craft?.GroupList?.filter((_it) => !_it.HiddenToCustomer) || []
      );
    },
    withoutContent() {
      return (
        this.filteredElementShowList.length === 0
        && this.filteredGroupShowList.length === 0
      );
    },
    craftTitle() {
      const list = this.ChildUseAffectedPropList;
      return this.getCraftContentName(list);
    },
    OwnUseAffectedPropList() {
      // 工艺自身交互限制  可能为必选或者禁用 目前该数组最多只有一个
      if (this.AffectedPropList.length === 0) return [];
      return this.AffectedPropList.filter((it) => it.Property && it.Property.Craft && !it.Property.Element && !it.Property.Group);
    },
    ChildUseAffectedPropList() {
      if (this.disabled || this.AffectedPropList.length === 0) return [];
      return this.AffectedPropList.filter((it) => it.Property && it.Property.Craft && (it.Property.Element || it.Property.Group));
    },
  },
  methods: {
    handleClick() {
      if (this.disabled) return;
      if (this.value) {
        this.$emit('change', null);
        return;
      }
      if (this.withoutContent) {
        // 无元素和元素组工艺
        this.$emit('change', {
          CraftID: this.Craft.ID,
          ElementList: [],
          GroupList: [],
        });
        return;
      }
      this.visible = true;
    },
    handleDialogSubmit(e) {
      this.$emit('change', e);
      this.visible = false;
    },
    handleEditClick() {
      this.visible = true;
    },
    getElementValueText(CustomerInputValues, Element, AffectedPropList) {
      const _AffectedPropList = AffectedPropList.filter(it => it.Property.Element);
      if (_AffectedPropList && _AffectedPropList.length > 0) {
        const list = _AffectedPropList.filter(it => it.Property.Element.ID === Element.ID);
        if (list.length > 0) {
          if (InterAction.getDisabledOrNot(list) || InterAction.getIsHiddenOrNot(list)) return '';
        }
      }
      const { IsNameHidden } = Element;
      const EleName = IsNameHidden ? '' : Element.Name;
      if (!CustomerInputValues || CustomerInputValues.length === 0 || !Element) return '';
      if (CustomerInputValues.length === 1) {
        const [{ ID, Name, Value }] = CustomerInputValues;
        if (Element.Type === 3) {
          // 开关
          if (
            Element.SwitchAttribute
            && `${Element.SwitchAttribute.OpenValue}` === Value
          ) return Element.SwitchAttribute.Words || Element.Name;
        }
        if (Element.Type === 1 && Value) {
          // 数值
          return `${EleName}${EleName ? '：' : ''}${Value}${Element.Unit}`;
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
            if (t) return `${EleName}${EleName ? '：' : ''}${t.Name}`;
          }
          if (Name) return `${EleName}${EleName ? '：' : ''}${Name}`;
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
          return names.join('，');
        }
      }
      return '';
    },
    getGroupValueText(List, Group, AffectedPropList) {
      if (AffectedPropList.length > 0) {
        const t = AffectedPropList.find(it => !it.Property.Element && it.Property.Group && it.Property.Group.ID === Group.ID && [21, 22].includes(it.Operator));
        if (t) return '';
      }
      if (List.length > 1) {
        return `${Group.Name}${List.length}处`;
      }
      if (List.length === 1) {
        const item = List[0];
        const arr = [];
        item.List.forEach(({ ElementID, CustomerInputValues }) => {
          const t = Group.ElementList.find((_it) => _it.ID === ElementID);
          if (t) {
            const _SingleAffectedPropList = AffectedPropList.filter(_it => _it.Property
             && _it.Property.Group && _it.Property.Group.ID === Group.ID && _it.Property.Element);
            const text = this.getElementValueText(CustomerInputValues, t, _SingleAffectedPropList);
            if (text) arr.push(text);
          }
        });
        if (arr.length > 0) {
          return `${Group.IsNameHidden ? '' : Group.Name} [ ${arr.join(
            '；',
          )} ]`;
        }
      }
      return '';
    },
    getCraftContentName(ChildUseAffectedPropList) {
      if (!this.Craft) return '工艺';
      if (!this.value) return this.Craft.ShowName;
      const { ElementList, GroupList } = this.value;
      if (
        (!Array.isArray(ElementList) || ElementList.length === 0)
        && (!Array.isArray(GroupList) || GroupList.length === 0)
      ) return this.Craft.ShowName;
      let ElContent = [];
      let GroupContent = [];
      const hasElementList = Array.isArray(ElementList) && ElementList.length > 0;
      const hasGroupList = Array.isArray(GroupList) && GroupList.length > 0;
      if (hasElementList) {
        ElementList.forEach((it) => {
          const t = this.filteredElementShowList.find(
            (_it) => _it.ID === it.ElementID,
          );
          if (t) {
            const text = this.getElementValueText(it.CustomerInputValues, t, ChildUseAffectedPropList);
            if (text) ElContent.push(text);
          }
        });
        ElContent = ElContent.filter(it => it);
      }
      if (hasGroupList) {
        GroupList.forEach((it) => {
          const t = this.filteredGroupShowList.find(
            (_it) => _it.ID === it.GroupID,
          );
          if (t) {
            const text = this.getGroupValueText(it.List, t, ChildUseAffectedPropList);
            if (text) GroupContent.push(text);
          }
        });
        GroupContent = GroupContent.filter(it => it);
      }
      if (ElContent.length > 0 || GroupContent.length > 0) {
        return `${this.Craft.ShowName} ${ElContent.join(
          ' ',
        )} ${GroupContent.join('')}`;
      }
      return this.Craft.ShowName;
    },
    handleElementAffectedListChange(ElementAffectedList, ElementValList, ElementList) {
      const _ElementList = ElementValList.map(it => {
        const _list = ElementAffectedList.filter(_it => _it.Property.Element.ID === it.ElementID);
        if (_list.length === 0) return it;
        const t = ElementList.find(_it => _it.ID === it.ElementID);
        if (t) {
          if (!InterAction.getDisabledOrNot(_list) && !InterAction.getIsHiddenOrNot(_list)) {
            if (t.Type === 2) {
              const arr = [...InterAction.getDisabledOptionList(_list), ...InterAction.getHiddenedOptionList(_list)];
              return {
                ...it,
                CustomerInputValues: it.CustomerInputValues.map(_it => (!arr.includes(_it.ID) ? _it : null)).filter(_it => _it),
              };
            }
          }
        }
        return it;
      });
      return _ElementList;
    },
    handleGroupAffectedListChange(GroupAffectedList) {
      const GroupList = this.value.GroupList.map(it => {
        const _list = GroupAffectedList.filter(_it => _it.Property.Group.ID === it.GroupID && _it.Property.Element);
        if (_list.length === 0) return it;
        const t = this.Craft.GroupList.find(_it => _it.ID === it.GroupID);
        if (t) {
          return {
            ...it,
            List: it.List.map(_it => ({ ..._it, List: this.handleElementAffectedListChange(_list, _it.List, t.ElementList) })),
          };
        }
        return it;
      });
      return GroupList;
    },
  },
  watch: {
    OwnUseAffectedPropList(newVal) {
      if (newVal.length === 1) {
        // 目前只考虑长度为1的情况，因为目前对一个工艺只允许设置一条交互，必选或者禁用
        const { Operator } = newVal[0]; // Operator 21 禁用    22 隐藏    23 必选
        if (Operator === 21) {
          this.disabled = true;
          this.required = false;
        }
        if (Operator === 23) {
          this.disabled = false;
          this.required = true;
        }
      } else {
        this.disabled = false;
        this.required = false;
      }
    },
    required(newVal, oldVal) {
      if (newVal && !!this.value) return;
      if (newVal) {
        // 此处应执行必选，建议不自动执行勾选，以触发提示
      } else if (oldVal) {
        // 从必选变为非必选， 触发提示
      }
    },
    ChildUseAffectedPropList(val) { // 监听子元素或子元素组上交互属性列表 当其发生变化时：
      if (JSON.stringify(this.recordInfo) === JSON.stringify(val)) return;
      this.recordInfo = val;
      //  1. 查看当前是否已选，如果已选则检查取值是否符合交互，不符合则提示报错；2.当原来有提示，现在交互为空则重新触发提示进行取消 -- 可用一个状态来记录是否已触发错误提示
      if (!val || val.length === 0 || !this.value) return;
      const ElementAffectedList = val.filter(it => it.Property && !it.Property.Group);
      const GroupAffectedList = val.filter(it => it.Property && it.Property.Group);
      const ElementList = this.handleElementAffectedListChange(ElementAffectedList, this.value.ElementList, this.Craft.ElementList);
      const GroupList = this.handleGroupAffectedListChange(GroupAffectedList);
      this.$emit('change', { ...this.value, ElementList, GroupList });
    },
  },
};
</script>
<style lang='scss'>
.mp-place-order-panel-comp-craft-type-item-comp-wrap {
  display: inline-block;
  margin-right: 25px;
  margin-bottom: 15px;
  > .mp-show-product-btn-wrap {
    min-width: 90px;
    box-sizing: border-box;
    line-height: 26px;
    &.active {
      border-color: #428dfa;
      color: #428dfa;
    }
  }
  > i {
    display: inline-block;
    width: 24px;
    height: 24px;
    background-color: rgb(245, 245, 245);
    border-radius: 50%;
    line-height: 24px;
    text-align: center;
    margin-left: 10px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 700;
  }
}
</style>
