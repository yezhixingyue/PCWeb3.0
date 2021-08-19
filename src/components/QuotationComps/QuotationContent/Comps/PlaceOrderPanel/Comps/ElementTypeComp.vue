<template>
  <div class="mp-place-order-content-element-type-show-item-comp-wrap" v-if="!Property.HiddenToCustomer">
    <label v-if="!hiddenLabel && !Property.IsNameHidden">{{Property.Name}}：</label>
    <!-- 数字类型 -->
    <NumberTypeItemComp
     v-if="Property.Type === 1"
     v-model="PropValue"
     :InputContent='Property.NumbericAttribute.InputContent'
     @focus="onFocus"
     @blur="onBlur"
     :isNumberic='isNumberic'
     :Allow="Property.NumbericAttribute.AllowCustomer" />
    <!-- 选项类型 -->
    <OptionTypeItemComp
     v-if="Property.Type === 2"
     v-model="PropValue"
     :options='Property.OptionAttribute.OptionList'
     :Allow='Property.OptionAttribute.AllowCustomer'
     :isMultiple='!Property.OptionAttribute.IsRadio'
     :SelectMode='Property.OptionAttribute.SelectMode' />
    <!-- 开关 -->
    <SwitchTypeItemComp
     v-if="Property.Type === 3"
     v-model="PropValue"
     :OpenValue="Property.SwitchAttribute.OpenValue"
     :CloseValue="Property.SwitchAttribute.CloseValue"
     :Words="Property.SwitchAttribute.Words || ''" />
    <span v-if="Property.Unit">{{Property.Unit}}</span>
  </div>
</template>

<script>
import { mapState } from 'vuex';
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
        if (this.Property.Type !== 2) { // 非选项类型
          return Array.isArray(this.value) && this.value.length > 0 ? this.value[0].Value : '';
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
        if (this.Property.Type !== 2) { // 非选项类型
          const temp = { Value: `${val}` };
          this.$emit('input', [temp]);
        } else if (this.Property.OptionAttribute && this.Property.OptionAttribute.IsRadio) {
          const temp = { ID: '', Name: '' };
          // 此处应判断是否为ID，在options中则为ID， 否则为Name
          if (Array.isArray(this.Property.OptionAttribute.OptionList)) {
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
  },
  data() {
    return {
    };
  },
  methods: {
    handleDefaultValueInit() {
      if (this.Property.Type === 2 && this.Property.OptionAttribute) { // 选项值 单选 | 多选
        const ValueList = this.Property.OptionAttribute.OptionList?.filter(it => it.IsChecked).map(it => ({ ID: it.ID })) || [];
        this.$emit('input', ValueList);
      }
      if (this.Property.Type === 1 && this.Property.NumbericAttribute) { // 数字值
        let Value = this.Property.NumbericAttribute.CheckedValue;
        if (!Value && Value !== 0) Value = '';
        const ValueList = [{ Value: `${Value}` }];
        this.$emit('input', ValueList);
      }
      if (this.Property.Type === 3 && this.Property.SwitchAttribute) { // 开关
        const Value = this.Property.SwitchAttribute.DefaultOpen ? this.Property.SwitchAttribute.OpenValue : this.Property.SwitchAttribute.CloseValue;
        const ValueList = [{ Value: `${Value}` }];
        this.$emit('input', ValueList);
      }
    },
    onFocus() {
      this.$emit('focus');
    },
    onBlur() {
      this.$emit('blur');
    },
  },
  mounted() {
    // 1. 后续需要有一个枚举值来确定是否需要初始化该默认数据(如编辑或还原时需保留原数据，不可使用默认数据处理)
    // if (!this.isOrderRestore && this.needInit) {
    //   this.handleDefaultValueInit();
    // }
  },
};
</script>
<style lang='scss'>
.mp-place-order-content-element-type-show-item-comp-wrap {
  display: inline-block;
  margin-right: 20px;
  &:last-of-type {
    margin-right: 0;
  }
  > label {
    color: #888;
    font-size: 13px;
    width: 7em;
    overflow: hidden;
    text-align: right;
    display: inline-block;
    vertical-align: -9px;
  }
  > span {
    font-size: 12px;
    color: #888;
  }
}
</style>
