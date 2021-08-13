<template>
  <div class="mp-place-order-content-element-type-show-item-comp-wrap">
    <label v-if="!hiddenLabel">{{Property.Name}}：</label>
    <!-- 数字类型 -->
    <NumberTypeItemComp
     v-if="Property.Type === 1"
     v-model="eleTypeVal"
     :InputContent='Property.NumbericAttribute.InputContent'
     :Allow="Property.NumbericAttribute.AllowCustomer" />
    <!-- 选项类型 -->
    <OptionTypeItemComp
     v-if="Property.Type === 2"
     v-model="eleTypeVal"
     :options='Property.OptionAttribute.OptionList'
     :Allow='Property.OptionAttribute.AllowCustomer'
     :isRadio='Property.OptionAttribute.IsRadio' />
    <!-- 开关 -->
    <SwitchTypeItemComp
     v-if="Property.Type === 3"
     v-model="eleTypeVal"
     :OpenValue="Property.SwitchAttribute.OpenValue"
     :CloseValue="Property.SwitchAttribute.CloseValue"
     :Words="Property.SwitchAttribute.Words || ''" />
  </div>
</template>

<script>
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
  },
  components: {
    NumberTypeItemComp,
    OptionTypeItemComp,
    SwitchTypeItemComp,
  },
  data() {
    return {
      eleTypeVal: '',
    };
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
}
</style>
