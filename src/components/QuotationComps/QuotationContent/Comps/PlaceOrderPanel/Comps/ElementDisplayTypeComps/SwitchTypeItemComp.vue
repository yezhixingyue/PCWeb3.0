<template>
  <!-- <el-switch
    v-model="switchValue"
    active-color="#428dfa"
    inactive-color="#DCDFE6"
    :active-value="`${OpenValue}`"
    :inactive-value="`${CloseValue}`"
    :disabled='isDisabled'
    :active-text="Words"
    class="mp-erp-switch-type-element-display-select-comp">
  </el-switch> -->
  <el-checkbox v-model="switchValue" :disabled='isDisabled' class="mp-erp-switch-type-element-display-select-comp">
    {{Words}}
  </el-checkbox>
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
        // const _val = val ? this.OpenValue : this.CloseValue;
        this.$emit('input', val);
        this.$emit('blur', val);
      },
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-switch-type-element-display-select-comp {
  margin-left: 5px;
  width: auto !important;
  width: unset !important;
  .el-checkbox__label {
    font-size: 13px;
    position: relative;
    top: 1px;
  }
}
</style>
