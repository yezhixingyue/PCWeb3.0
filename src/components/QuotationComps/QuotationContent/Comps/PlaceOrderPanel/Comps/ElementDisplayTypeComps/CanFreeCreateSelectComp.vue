<template>
  <el-input
    @focus="onFocus($event, 'inp')"
    @blur="onBlur"
    v-model.trim.lazy="content"
    v-if="AllowCreate && options.length === 0"
    size="small"
    class="mp-erp-number-type-element-display-input-comp"
    maxlength="9"
    :style="`width:${localDisplayWidth}px`"
    :disabled='isDisabled'
  ></el-input>
  <el-select
    v-else
    v-model="content"
    :filterable='AllowCreate || isMaterial'
    default-first-option
    :multiple='isMultiple'
    :allow-create='AllowCreate'
    :placeholder='placeholder'
    :disabled='isDisabled'
    :popper-append-to-body='false'
    @blur.native='onNativeChange'
    @change.native='onNativeChange'
    @focus.native="onFocus"
    @blur="onBlur"
    @change="onChange"
    @visible-change='onVisibleChange'
    ref="oSelect"
    size="small"
    :style="`width:${localDisplayWidth}px`"
    class="mp-erp-option-type-element-display-select-comp">
    <el-option
      v-for="item in options"
      :key="typeof item === 'string'?item:(item.ID||item.Name)"
      :label="item.Name || item"
      :disabled="DisabledOptionList.includes(typeof item === 'string'?item:item.ID)"
      :value="typeof item === 'string'?item:item.ID">
    </el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    CtrlZIndex: {
      type: Boolean,
      default: false,
    },
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
    // filterable: { // 是否可多选
    //   type: Boolean,
    //   default: true,
    // },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    isMaterial: {
      type: Boolean,
      default: false,
    },
    DisabledOptionList: {
      type: Array,
      default: () => [],
    },
    DisplayWidth: {
      type: Number,
      default: 140,
    },
    DisplayWidthIsAuto: {
      type: Boolean,
      default: true,
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
    localDisplayWidth() {
      if (this.localWidth && this.localWidth > this.DisplayWidth && this.DisplayWidthIsAuto) return this.localWidth;
      return this.DisplayWidth;
    },
  },
  data() {
    return {
      localWidth: '',
      inputPaddingWidth: 45,
    };
  },
  methods: {
    onBlur(e) {
      this.handleBlur(e);
      this.$nextTick(() => {
        this.$emit('blur');
      });
    },
    handleBlur(e) {
      if (e.target.value && this.AllowCreate && !this.isMaterial) {
        const t = this.options.find(it => it.Name === e.target.value);
        const _val = t ? t.ID : e.target.value;
        this.$emit('input', _val);
      }
    },
    onFocus() {
      this.$emit('focus');
    },
    onChange(e) {
      this.$nextTick(() => {
        this.$emit('change', e);
      });
    },
    onVisibleChange(e) {
      if (this.CtrlZIndex) return;
      console.log('onVisibleChange');
      this.$store.commit('common/setIsPopperVisible', e);
    },
    onNativeChange(e) {
      this.handleBlur(e);
    },
    getWordsDisplayWidth(str) {
      if (!str || typeof str !== 'string') return 0;
      const oDiv = document.createElement('div');
      oDiv.style.fontSize = '12px';
      oDiv.style.float = 'left';
      oDiv.style.opacity = 0;
      oDiv.innerText = str;

      const oApp = document.getElementById('app');
      oApp.appendChild(oDiv);
      const width = oDiv.offsetWidth;
      oApp.removeChild(oDiv);
      if (width) return width + this.inputPaddingWidth + 5;
      return 0;
    },
    getAdaptiveWidth() {
      if (!this.DisplayWidthIsAuto || (!this.value && this.value !== 0)) return; // 如果不能自定义宽度的话则不再继续执行
      let label = this.options.find(it => {
        const id = typeof it === 'string' ? it : it.ID;
        return this.value === id;
      });
      if (!label) label = '';
      if (typeof label === 'object') label = label.Name || '';
      const maybeShowWordMaxCount = (this.DisplayWidth - this.inputPaddingWidth) / 12;
      if (label.length <= maybeShowWordMaxCount) this.localWidth = this.DisplayWidth;
      else {
        // 计算显示宽度
        const width = this.getWordsDisplayWidth(label);
        if (width && width > this.DisplayWidth) this.localWidth = width;
        else this.localWidth = this.DisplayWidth;
      }
    },
  },
  watch: {
    value: {
      handler() {
        this.getAdaptiveWidth();
      },
      immediate: true,
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
  &.el-select {
    margin-right: 10px;
    margin-left: 5px;
    .el-input {
      input {
        height: 30px;
        line-height: 28px;
      }
    }
  }
}
</style>
