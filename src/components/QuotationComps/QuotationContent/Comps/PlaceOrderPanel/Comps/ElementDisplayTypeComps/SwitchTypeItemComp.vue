<template>
  <el-switch
    v-model="switchValue"
    active-color="#428dfa"
    inactive-color="#DCDFE6"
    :active-value="`${OpenValue}`"
    :inactive-value="`${CloseValue}`"
    :disabled='isDisabled'
    :active-text="Words"
    class="mp-erp-switch-type-element-display-select-comp">
  </el-switch>
</template>

<script>
export default {
  props: {
    OpenValue: {
      type: Number,
      required: true,
    },
    CloseValue: {
      type: Number,
      required: true,
    },
    Words: {
      type: String,
      required: true,
    },
    value: {},
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    switchValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-switch-type-element-display-select-comp {
  margin-left: 5px;
  // &.el-switch {
  //   .el-switch__core {
  //     height: 17px;
  //     width: 38px !important;
  //     &::after {
  //       top: 1px;
  //       height: 13px;
  //       width: 13px;
  //     }
  //   }
  //   &.is-checked .el-switch__core::after {
  //     margin-left: -14px;
  //   }
  // }
  input {
    width: unset !important;
  }
}
</style>
