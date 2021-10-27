<template>
  <div class="mp-place-order-content-element-type-show-item-comp-wrap" v-if="!Property.HiddenToCustomer && !hidden"
   :class="{isshow: !hidden, isNameHide: hiddenLabel || Property.IsNameHidden}">
    <label v-if="!hiddenLabel && !Property.IsNameHidden" class="el-title">
      <i v-show="showError" class="is-bold is-pink is-font-13">!</i>
      {{Property.Name}}：</label>
      <!-- <i v-show="isError" class="is-pink is-bold is-font-14"></i> {{Property.Name}}：</label> -->
    <!-- 数字类型 -->
    <NumberTypeItemComp
     class="element-type-content"
     contentBefore=''
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
     class="element-type-content"
     contentBefore=''
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
     class="element-type-content"
     contentBefore=''
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
import { mapState, mapGetters } from 'vuex';
import InterAction from '@/store/Quotation/Interaction';
import { creatNewTargetValue } from '@/store/Quotation/EffectiveControlList';
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
    isError: {
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
    ...mapGetters('Quotation', ['affectedElementIDsByInteraction']),
    PropValue: {
      get() {
        let _value = this.value;
        if (this.disabled && this.DisabledValue) _value = this.DisabledValue;
        if (this.Property.Type === 1) { // 数值类型
          return Array.isArray(_value) && _value.length > 0 ? _value[0].Value : '';
        }
        if (this.Property.Type === 3) { // 开关类型
          return Array.isArray(_value) && _value.length > 0 ? _value[0].IsOpen : '';
        }
        if (this.Property.OptionAttribute?.IsRadio) {
          return Array.isArray(_value) && _value.length > 0 ? _value[0].Name || _value[0].ID : '';
        }
        if (this.Property.OptionAttribute && !this.Property.OptionAttribute?.IsRadio) {
          return Array.isArray(_value) && _value.length > 0 ? _value.map(it => it.ID) : [];
        }
        return '';
      },
      set(val) {
        if (this.Property.Type === 1) { // 数值类型
          const temp = { Value: `${val}` };
          this.$emit('input', { CustomerInputValues: [temp], ...this.disabledInfoObj });
        } else if (this.Property.Type === 3) { // 开关
          const temp = { IsOpen: val };
          this.$emit('input', { CustomerInputValues: [temp], ...this.disabledInfoObj });
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
          this.$emit('input', { CustomerInputValues: [temp], ...this.disabledInfoObj });
        } else if (this.Property.OptionAttribute && !this.Property.OptionAttribute.IsRadio) {
          // 多选  此时不允许自定义
          this.$emit('input', { CustomerInputValues: Array.isArray(val) ? val.map(ID => ({ ID })) : [], ...this.disabledInfoObj });
        }
      },
    },
    disabled() { // 禁用
      return InterAction.getDisabledOrNot(this.AffectedPropList);
    },
    DisabledValue() {
      const t = creatNewTargetValue(InterAction.getUnusabledValueByInteraction(this.AffectedPropList), this.Property);
      if (t && t.CustomerInputValues) return t.CustomerInputValues;
      return '';
    },
    showError() {
      if (!this.isError) return false;
      if (this.Property.Type === 1) return false;
      if (this.Property.Type === 2) {
        const SelectModeEnum = [
          { Name: '单选按钮', ID: 0 },
          { Name: '下拉框', ID: 1 },
        ];
        const t = SelectModeEnum.find((it) => it.ID === this.Property.OptionAttribute.SelectMode);
        return !(t && t.Name === '单选按钮' && this.Property.OptionAttribute.IsRadio);
      }
      return true;
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
    switchDisabledOrHidden() {
      // 排除isDisabled；因为其由上一级传来且只能是元素组或尺寸时才会传递，（尺寸组和元素组不再允许禁用或隐藏，所以该值废弃，不再考虑（其发生改变时本地无隐藏值，也需传递））
      // return this.hidden || this.isDisabled || this.disabled;
      return this.hidden || this.disabled;
    },
  },
  data() {
    return {
      val: '',
      disabledInfoObj: { // 记录当前禁用及隐藏信息
        disabledByInteraction: false,
        hiddenByInteraction: false,
        DisabledValue: '',
      },
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
  watch: {
    DisabledValue: { // 之前使用switchDisabledOrHidden，判断不准确修改为该值
      handler(newVal, oldVal) {
        if (!newVal === !oldVal) return;
        const DisabledValue = newVal ? InterAction.getUnusabledValueByInteraction(this.AffectedPropList) : '';
        this.disabledInfoObj = {
          disabledByInteraction: this.disabled,
          hiddenByInteraction: this.hidden,
          DisabledValue,
        };
        this.$nextTick(() => {
          this.$emit('input', { CustomerInputValues: [...this.value], ...this.disabledInfoObj });
          if (this.disabled) this.PropValue = DisabledValue;
          this.$nextTick(() => {
            if (this.affectedElementIDsByInteraction.includes(this.Property.ID)) {
              this.$emit('interaction');
            }
          });
        });
      },
      immediate: true,
    },
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
  // .el-input.is-disabled .el-input__inner {
  //   color: rgba($color: #000000, $alpha: 0);
  // }
  .el-checkbox__input.is-disabled .el-checkbox__inner {
    background-color: #f5f5f5;
  }
  .el-radio__input.is-disabled .el-radio__inner {
    background-color: #f5f5f5;
  }
}
</style>
