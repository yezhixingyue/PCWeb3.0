<template>
  <el-input
    @focus="onFocus"
    @blur="onBlur"
    v-model.trim.lazy="content"
    v-if="!InputContent || isNumberic"
    size="small"
    class="mp-erp-number-type-element-display-input-comp"
    maxlength="9"
    :disabled='isDisabled'
  ></el-input>
  <CanFreeCreateSelectComp
    v-else
    :allow-create="Allow"
    :placeholder="placeholder"
    v-model="content"
    @focus="onFocus"
    @blur="onBlur"
    class="mp-erp-number-type-element-option-display-input-comp"
    :options="options"
    :isDisabled='isDisabled'
  />
</template>

<script>
import CanFreeCreateSelectComp from './CanFreeCreateSelectComp.vue';

export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    placeholder: {
      type: String,
      default: '',
    },
    InputContent: {
      // 选项列表
      type: String,
      default: '',
    },
    Allow: {
      // 是否允许自定义
      type: Boolean,
      default: false,
    },
    value: {},
    isNumberic: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    CanFreeCreateSelectComp,
  },
  computed: {
    options() {
      if (!this.InputContent) return [];
      const valueList = this.utils.getNumberValueList(this.InputContent);
      return valueList;
    },
    content: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('change', val);
      },
    },
  },
  methods: {
    onFocus() {
      this.$emit('focus');
    },
    onBlur() {
      this.$emit('blur');
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-number-type-element-display-input-comp {
  .el-input__inner {
    font-size: 12px;
  }
}
.mp-erp-number-type-element-display-select-comp {
  .el-input__inner {
    font-size: 12px;
    &::placeholder {
      font-size: 12px;
    }
  }
}
</style>
