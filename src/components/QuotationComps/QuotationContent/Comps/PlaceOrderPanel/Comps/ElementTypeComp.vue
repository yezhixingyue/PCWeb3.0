<template>
  <div class="mp-place-order-content-element-type-show-item-comp-wrap" v-if="!Property.HiddenToCustomer" v-show="!hidden">
    <label v-if="!hiddenLabel && !Property.IsNameHidden" class="el-title">{{Property.Name}}：</label>
    <!-- 数字类型 -->
    <NumberTypeItemComp
     v-if="Property.Type === 1"
     v-model.lazy="PropValue"
     :InputContent='Property.NumbericAttribute.InputContent'
     @focus="onFocus"
     @blur="onBlur"
     :isNumberic='isNumberic'
     :DisplayWidth='DisplayWidth'
     :DisplayWidthIsAuto='DisplayWidthIsAuto'
     :isDisabled='isDisabled || disabled'
     :Allow="Property.NumbericAttribute.AllowCustomer" />
    <!-- 选项类型 -->
    <OptionTypeItemComp
     v-if="Property.Type === 2"
     v-model.lazy="PropValue"
     :options='Property.OptionAttribute.OptionList.filter(it => !it.HiddenToCustomer)'
     :Allow='Property.OptionAttribute.AllowCustomer && !disabledDefine'
     :isMultiple='!Property.OptionAttribute.IsRadio'
     :IsRequired='Property.OptionAttribute.IsRequired'
     :isDisabled='isDisabled || disabled'
     :DisabledOptionList='DisabledOptionList'
     :HiddenOptionList='HiddenOptionList'
     :DisplayWidth='DisplayWidth'
     :DisplayWidthIsAuto='DisplayWidthIsAuto'
     :SelectMode='Property.OptionAttribute.SelectMode'
     @blur="onBlur" />
    <!-- 开关 -->
    <SwitchTypeItemComp
     v-if="Property.Type === 3"
     v-model.lazy="PropValue"
     :OpenValue="Property.SwitchAttribute.OpenValue"
     :CloseValue="Property.SwitchAttribute.CloseValue"
     :isDisabled='isDisabled || disabled'
     :Words="Property.SwitchAttribute.Words || ''"
     @blur="onBlur" />
    <span v-if="Property.Unit">{{Property.Unit}}</span>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import InterAction from '@/store/Quotation/Interaction';
import NumberTypeItemComp from './ElementDisplayTypeComps/NumberTypeItemComp.vue';
import OptionTypeItemComp from './ElementDisplayTypeComps/OptionTypeItemComp.vue';
import SwitchTypeItemComp from './ElementDisplayTypeComps/SwitchTypeItemComp.vue';

export default {
  props: {
    Property: {
      type: Object,
      required: true,
    },
    hiddenLabel: {
      type: Boolean,
      default: false,
    },
    value: {},
    needInit: {
      type: Boolean,
      default: true,
    },
    isNumberic: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    AffectedPropList: { // 受到交互影响的工艺列表
      type: Array,
      default: () => [],
    },
    SuggesWidth: { // 建议元素宽度
      type: Number,
      default: 140,
    },
  },
  components: {
    NumberTypeItemComp,
    OptionTypeItemComp,
    SwitchTypeItemComp,
  },
  computed: {
    ...mapState('Quotation', ['isOrderRestore']),
    PropValue: {
      get() {
        if (this.Property.Type === 1) { // 数值类型
          return Array.isArray(this.value) && this.value.length > 0 ? this.value[0].Value : '';
        }
        if (this.Property.Type === 3) { // 开关类型
          return Array.isArray(this.value) && this.value.length > 0 ? this.value[0].IsOpen : '';
        }
        if (this.Property.OptionAttribute?.IsRadio) {
          return Array.isArray(this.value) && this.value.length > 0 ? this.value[0].Name || this.value[0].ID : '';
        }
        if (this.Property.OptionAttribute && !this.Property.OptionAttribute?.IsRadio) {
          return Array.isArray(this.value) && this.value.length > 0 ? this.value.map(it => it.ID) : [];
        }
        return '';
      },
      set(val) {
        if (this.Property.Type === 1) { // 数值类型
          const temp = { Value: `${val}` };
          this.$emit('input', [temp]);
        } else if (this.Property.Type === 3) { // 开关
          const temp = { IsOpen: val };
          this.$emit('input', [temp]);
        } else if (this.Property.OptionAttribute && this.Property.OptionAttribute.IsRadio) {
          const temp = { ID: '', Name: '' };
          // 此处应判断是否为ID，在options中则为ID， 否则为Name
          if (Array.isArray(this.Property.OptionAttribute.OptionList) && val) {
            const t = this.Property.OptionAttribute.OptionList.find(it => it.ID === val);
            if (t) temp.ID = val;
            else temp.Name = val;
          } else {
            temp.Name = val;
          }
          this.$emit('input', [temp]);
        } else if (this.Property.OptionAttribute && !this.Property.OptionAttribute.IsRadio) {
          // 多选  此时不允许自定义
          this.$emit('input', Array.isArray(val) ? val.map(ID => ({ ID })) : []);
        }
      },
    },
    disabled() { // 禁用
      return InterAction.getDisabledOrNot(this.AffectedPropList);
    },
    hidden() { // 隐藏
      return InterAction.getIsHiddenOrNot(this.AffectedPropList);
    },
    DisabledOptionList() { // 禁用的选项
      return InterAction.getDisabledOptionList(this.AffectedPropList);
    },
    HiddenOptionList() { // 隐藏的选项
      return InterAction.getHiddenedOptionList(this.AffectedPropList);
    },
    disabledDefine() {
      return this.DisabledOptionList.includes('00000000-0000-0000-0000-000000000000');
    },
    SetupDisplayWidth() { // 只数值元素与选项元素有效
      if (this.Property) {
        const { Type, NumbericAttribute, OptionAttribute } = this.Property;
        if (Type === 1 && NumbericAttribute) {
          const { DisplayWidth, IsWidthAdaption } = NumbericAttribute;
          if (DisplayWidth && !IsWidthAdaption) return DisplayWidth;
        }
        if (Type === 2 && OptionAttribute) {
          const { DisplayWidth, IsWidthAdaption } = OptionAttribute;
          if (DisplayWidth && !IsWidthAdaption) return DisplayWidth;
        }
      }
      return 0;
    },
    DisplayWidth() {
      if (this.SetupDisplayWidth) return this.SetupDisplayWidth;
      return this.SuggesWidth ? this.SuggesWidth : 140;
    },
    DisplayWidthIsAuto() {
      return !this.SetupDisplayWidth || false;
    },
  },
  data() {
    return {
      val: '',
    };
  },
  methods: {
    onFocus() {
      this.$emit('focus');
    },
    onBlur(e) {
      this.$emit('blur');
      if (this.val === e) return;
      this.val = e;
      this.$nextTick(() => {
        this.$emit('interaction');
      });
    },
  },
  mounted() {
  },
};
</script>
<style lang='scss'>
.mp-place-order-content-element-type-show-item-comp-wrap {
  display: inline-block;
  margin-right: 20px;
  white-space: nowrap;
  &:last-of-type {
    margin-right: 0;
  }
  > label {
    color: #888;
    font-size: 13px;
    // width: 7em;
    overflow: hidden;
    text-align: right;
    display: inline-block;
    vertical-align: -9px;
  }
  > span {
    font-size: 12px;
    color: #888;
  }
  .el-input.is-disabled .el-input__inner {
    color: rgba($color: #000000, $alpha: 0);
  }
}
</style>
