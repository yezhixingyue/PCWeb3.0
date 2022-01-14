<template>
  <el-input
    @focus="onFocus($event, 'inp')"
    @blur="onBlur"
    v-model.trim.lazy="content"
    v-if="!InputContent || isNumberic"
    size="small"
    class="mp-erp-number-type-element-display-input-comp"
    maxlength="9"
    :style="`width:${DisplayWidth}px`"
    :disabled='isDisabled || !Allow'
  ></el-input>
  <CanFreeCreateSelectComp
    v-else
    :allow-create="Allow"
    :placeholder="placeholder"
    :DisplayWidth='DisplayWidth'
    :DisplayWidthIsAuto='DisplayWidthIsAuto'
    v-model="content"
    :CtrlZIndex='CtrlZIndex'
    @focus="onFocus"
    @blur="onBlur"
    @change="onSelectChange"
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
    CtrlZIndex: {
      type: Boolean,
      default: false,
    },
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
    DisplayWidth: {
      type: Number,
      default: 60,
    },
    DisplayWidthIsAuto: { // 是否宽度可自定义
      type: Boolean,
      default: true,
    },
    GeneralValues: {
      type: Array,
      default: null,
    },
  },
  components: {
    CanFreeCreateSelectComp,
  },
  computed: {
    options() {
      if (this.GeneralValues && Array.isArray(this.GeneralValues)) return this.GeneralValues.map(it => it.toString());
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
    onFocus(e, type) {
      this.$emit('focus');
      if (type === 'inp' && typeof e === 'object') e.target.select();
    },
    onBlur() {
      this.$emit('blur', this.value);
    },
    onSelectChange(e) {
      this.$emit('blur', e);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-number-type-element-display-input-comp {
  .el-input__inner {
    font-size: 12px;
  }
  &.el-input {
    margin-right: 10px;
    margin-left: 5px;
    input {
      height: 30px;
      line-height: 28px;
      padding-right: 20px;
    }
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
