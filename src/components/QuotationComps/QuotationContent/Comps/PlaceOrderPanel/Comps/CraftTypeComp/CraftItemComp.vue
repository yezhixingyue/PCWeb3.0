<template>
  <li class="mp-place-order-panel-comp-craft-type-item-comp-wrap">
    <ShowProductBtn
      @click.native="handleClick"
      :title="craftTitle"
      :disabled="disabled"
      :isActive="!!value"
      :tips='disabled ? ConditionTextForCraftDisabled : ""'
    />
    <template v-if="value && !withoutContent">
      <i class="iconfont icon-bianji is-cyan" @click="handleEditClick"></i>
    </template>
    <HelpTipsComp :tipsData='craftTipsData' :title="Craft.ShowName" />
    <CraftContentSetupDialog
      :visible.sync="visible"
      :Craft="Craft"
      :setupData="value"
      :PartID='PartID'
      :PartIndex='PartIndex'
      :AffectedPropList="ChildUseAffectedPropList"
      :ChildSubControlList='ChildSubControlList'
      :PartAffectedPropList='PartAffectedPropList'
      @submit="handleDialogSubmit"
    />
  </li>
</template>

<script>
import ShowProductBtn from '@/components/QuotationComps/SMComps/ShowProductBtn.vue';
import InterAction from '@/store/Quotation/Interaction';
import ShowProductDetail from '@/store/Quotation/ShowProductDetail';
import QuotationClassType from '@/store/Quotation/QuotationClassType';
import { creatNewTargetValue } from '@/store/Quotation/EffectiveControlList';
import HelpTipsComp from '@/components/QuotationComps/PlaceOrderComps/HelpTipsComp';
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
    ChildSubControlList: { // 子交互列表
      type: Array,
      default: () => [],
    },
    PartID: {
      type: String,
      default: '',
    },
    PartIndex: {
      type: Number,
      default: 0,
    },
    PartAffectedPropList: { // 部件子交互生效属性控制信息列表
      type: Array,
      default: null,
    },
    CraftTipsDataList: { // 工艺提示列表
      type: Array,
      default: () => [],
    },
  },
  components: {
    ShowProductBtn,
    CraftContentSetupDialog,
    HelpTipsComp,
  },
  data() {
    return {
      visible: false,
      disabled: false,
      required: false,
      recordInfo: null,
      ConditionTextForCraftDisabled: '', // 当工艺被禁用时的文字提示
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
        this.Craft?.GroupList?.filter((_it) => !_it.HiddenToCustomer).filter(it => {
          const t = it.ElementList.find(_it => !_it.HiddenToCustomer);
          return !!t;
        }) || []
      );
    },
    withoutContent() {
      return (
        this.filteredElementShowList.length === 0
        && this.filteredGroupShowList.length === 0
      );
    },
    craftTitleObj() {
      const list = this.ChildUseAffectedPropList;
      const titleObj = ShowProductDetail.getCraftContentName(this.value, this.Craft, list, this.disabled);
      return titleObj;
    },
    craftTitle() {
      if (this.craftTitleObj) {
        const { Name, Content } = this.craftTitleObj;
        return Content ? `${Name} ${Content}` : Name;
      }
      return '';
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
    craftTipsData() {
      if (this.CraftTipsDataList && this.CraftTipsDataList.length > 0) {
        const t = this.CraftTipsDataList.find(it => it.ID === this.Craft.ID);
        return t || null;
      }
      return null;
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
        const _data = QuotationClassType.getCraftItemSubmitData(
          this.Craft,
          this.ChildSubControlList,
        );
        this.$emit('change', _data);
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
    handleElementAffectedListChange(ElementAffectedList, ElementValList, ElementList) {
      const _ElementList = ElementValList.map(it => {
        const _list = ElementAffectedList.filter(_it => _it.Property.Element.ID === it.ElementID);
        if (_list.length === 0) {
          return {
            ...it, disabledByInteraction: false, hiddenByInteraction: false, DisabledValue: '',
          };
        }
        const t = ElementList.find(_it => _it.ID === it.ElementID);
        if (t) {
          const disabledByInteraction = InterAction.getDisabledOrNot(_list);
          const hiddenByInteraction = InterAction.getIsHiddenOrNot(_list);
          if (!disabledByInteraction && !hiddenByInteraction) {
            let _CustomerInputValues = it.CustomerInputValues;
            if (t.Type === 2) {
              const arr = [...InterAction.getDisabledOptionList(_list), ...InterAction.getHiddenedOptionList(_list)];
              _CustomerInputValues = it.CustomerInputValues.map(_it => (!arr.includes(_it.ID) ? _it : null)).filter(_it => _it);
            }
            return {
              ...it,
              disabledByInteraction: false,
              hiddenByInteraction: false,
              DisabledValue: '',
              CustomerInputValues: _CustomerInputValues,
            };
          }
          const DisabledValue = InterAction.getUnusabledValueByInteraction(_list);
          const temp = creatNewTargetValue(DisabledValue, t);
          return {
            ...temp,
            disabledByInteraction,
            hiddenByInteraction,
            DisabledValue,
          };
        }
        return it;
      });
      return _ElementList;
    },
    handleGroupAffectedListChange(GroupAffectedList) {
      const GroupList = this.value.GroupList.map(it => {
        const _list = GroupAffectedList.filter(_it => _it.Property.Group.ID === it.GroupID && _it.Property.Element);
        // if (_list.length === 0) return it;
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
    OwnUseAffectedPropList: {
      handler(newVal) {
        this.ConditionTextForCraftDisabled = '';
        if (newVal.length === 1) {
        // 目前只考虑长度为1的情况，因为目前对一个工艺只允许设置一条交互，必选或者禁用
          const { Operator } = newVal[0]; // Operator 21 禁用    22 隐藏    23 必选
          if (Operator === 21) {
            this.disabled = true;
            this.required = false;
            const list = newVal[0]._ConditionTextList || [];
            this.ConditionTextForCraftDisabled = list.length > 0
              ? `当 ${list.join('\r\n并且 ')} 时，\r\n不能做${this.craftTitleObj && this.craftTitleObj.Name ? `${this.craftTitleObj.Name}工艺` : '该工艺'}`
              : '';
            if (this.value && !(this.value.disabledByInteraction && !this.value.requiredByInteraction)) {
            // this.$emit('change', { ...this.value, disabledByInteraction: true, requiredByInteraction: false });
              this.$emit('change', null);
            }
          }
          if (Operator === 23) {
            this.disabled = false;
            this.required = true;
            if (this.value && !(!this.value.disabledByInteraction && this.value.requiredByInteraction)) {
              this.$emit('change', { ...this.value, disabledByInteraction: false, requiredByInteraction: true }, false);
            }
          }
        } else {
          this.disabled = false;
          this.required = false;
          if (this.value && !(!this.value.disabledByInteraction && !this.value.requiredByInteraction)) {
            this.$emit('change', { ...this.value, disabledByInteraction: false, requiredByInteraction: false }, false);
          }
        }
      },
      immediate: true,
    },
    required(newVal, oldVal) {
      if (newVal && !!this.value) return;
      if (newVal) {
        // 此处应执行必选，建议不自动执行勾选，以触发提示
      } else if (oldVal) {
        // 从必选变为非必选， 触发提示
      }
    },
    ChildUseAffectedPropList: {
      handler(val) { // 监听子元素或子元素组上交互属性列表 当其发生变化时：
        if (JSON.stringify(this.recordInfo) === JSON.stringify(val)) return;
        this.recordInfo = val;
        //  1. 查看当前是否已选，如果已选则检查取值是否符合交互，不符合则提示报错；2.当原来有提示，现在交互为空则重新触发提示进行取消 -- 可用一个状态来记录是否已触发错误提示
        if (!val || !this.value) return;
        const ElementAffectedList = val.filter(it => it.Property && !it.Property.Group);
        const GroupAffectedList = val.filter(it => it.Property && it.Property.Group);
        const ElementList = this.handleElementAffectedListChange(ElementAffectedList, this.value.ElementList, this.Craft.ElementList);
        const GroupList = this.handleGroupAffectedListChange(GroupAffectedList);
        this.$emit('change', { ...this.value, ElementList, GroupList });
      },
      immediate: true,
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
    &:active {
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
  .mp-place-order-help-tip-comp-wrap {
    margin-right: -8px;
  }
}
</style>
