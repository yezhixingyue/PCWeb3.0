<template>
  <el-select
    v-model="content"
    :filterable='AllowCreate'
    default-first-option
    :multiple='isMultiple'
    :allow-create='AllowCreate'
    :placeholder='placeholder'
    :disabled='isDisabled'
    @blur.native='onBlur'
    @change.native='onBlur'
    @focus.native="onFocus"
    @blur="onBlur"
    ref="oSelect"
    size="small"
    class="mp-erp-option-type-element-display-select-comp">
    <el-option
      v-for="item in options"
      :key="item.ID || item"
      :label="item.Name || item"
      :disabled='DisabledOptionList.includes(item.ID || item)'
      :value="item.ID || item">
    </el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    AllowCreate: { // 是否允许自定义
      type: Boolean,
      default: false,
    },
    value: {},
    placeholder: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
      default: () => [],
    },
    isMultiple: { // 是否可多选
      type: Boolean,
      default: false,
    },
    filterable: { // 是否可多选
      type: Boolean,
      default: true,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    DisabledOptionList: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    content: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
    optionLabels() {
      return this.options.map(it => it.Name);
    },
  },
  methods: {
    onBlur(e) {
      if (e.target.value && this.AllowCreate) {
        const t = this.options.find(it => it.Name === e.target.value);
        const _val = t ? t.ID : e.target.value;
        this.$emit('input', _val);
      }
      this.$emit('blur');
    },
    onFocus() {
      this.$emit('focus');
    },
  },
  mounted() {
    if (this.AllowCreate && this.$refs.oSelect) {
      const _func = this.$refs.oSelect.onInputChange;
      const oInpBox = this.$refs.oSelect.$children.find(it => it.$el.className.includes('el-input'));
      this.$refs.oSelect.onInputChange = () => {
        if (oInpBox) this.$emit('input', oInpBox.value);
        _func();
      };
    }
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
