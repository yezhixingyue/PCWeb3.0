<template>
  <el-select
   v-model="checkVal"
   :placeholder="placeholder"
   filterable
   default-first-option
   :allow-create='Allow'
   v-if="!isRadio"
   size="small"
   class="mp-erp-option-type-element-display-select-comp">
    <el-option
      v-for="item in options"
      :key="item.ID"
      :label="item.Name"
      :value="item.ID">
    </el-option>
  </el-select>
  <el-radio-group v-model="checkVal" v-else>
    <el-radio v-for="item in options" :key="item.ID" :label="item.ID">{{item.Name}}</el-radio>
  </el-radio-group>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    placeholder: {
      type: String,
      default: '请选择',
    },
    value: {},
    options: {
      type: Array,
      default: () => [],
    },
    isRadio: {
      type: Boolean,
      default: true,
    },
    Allow: { // 是否允许自定义
      type: Boolean,
      default: false,
    },
  },
  computed: {
    checkVal: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('change', val);
      },
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-option-type-element-display-select-comp {
  .el-input__inner {
    font-size: 12px;
    &::placeholder {
      font-size: 12px;
    }
  }
}
</style>
