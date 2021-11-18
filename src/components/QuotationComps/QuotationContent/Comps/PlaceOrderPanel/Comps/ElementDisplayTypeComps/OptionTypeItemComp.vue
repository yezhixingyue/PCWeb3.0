<template>
  <CanFreeCreateSelectComp
    v-if="!isRadio && !isMultiple"
    v-model="checkVal"
    :placeholder="placeholder"
    :isDisabled="isDisabled"
    :allow-create="Allow"
    :options="localOptions"
    :isMultiple="isMultiple"
    :DisplayWidth='DisplayWidth'
    :DisplayWidthIsAuto='DisplayWidthIsAuto'
    :DisabledOptionList='DisabledOptionList'
    :CtrlZIndex='CtrlZIndex'
    @focus="onFocus"
    @blur="onBlur"
    @change="onSelectChange"
  />
  <el-checkbox-group v-else-if="isMultiple" v-model="checkVal"
   :disabled="isDisabled" class="mp-erp-option-type-element-display-check-group-select-comp" @change="onSelectChange">
    <el-checkbox v-for="item in localOptions" :key="item.ID || item.Name" :label="item.ID" :disabled='DisabledOptionList.includes(item.ID)'>
      {{item.Name}}
    </el-checkbox>
  </el-checkbox-group>
  <el-radio-group v-model="checkVal" v-else :disabled="isDisabled" @change="onSelectChange('radio')">
    <el-radio v-for="item in localOptions" :key="item.ID || item.Name" :label="item.ID"
     @click.native.stop="onRadioItemClick(item, DisabledOptionList.includes(item.ID))" :disabled='DisabledOptionList.includes(item.ID)'>{{
      item.Name
    }}</el-radio>
  </el-radio-group>
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
    value: {},
    options: {
      type: Array,
      default: () => [],
    },
    SelectMode: {
      type: Number,
      default: 1,
    },
    Allow: {
      // 是否允许自定义
      type: Boolean,
      default: false,
    },
    isMultiple: {
      // 是否可多选
      type: Boolean,
      default: false,
    },
    IsRequired: {
      // 是否必选
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    HiddenOptionList: {
      type: Array,
      default: () => [],
    },
    DisabledOptionList: {
      type: Array,
      default: () => [],
    },
    DisplayWidth: {
      type: Number,
      default: 60,
    },
    DisplayWidthIsAuto: { // 是否宽度可自定义
      type: Boolean,
      default: true,
    },
  },
  components: {
    CanFreeCreateSelectComp,
  },
  computed: {
    checkVal: {
      get() {
        return this.value;
      },
      set(val) { // 单选传字符串  多选传数组
        this.$emit('change', val);
      },
    },
    isRadio() {
      const SelectModeEnum = [
        { Name: '单选按钮', ID: 0 },
        { Name: '下拉框', ID: 1 },
      ];
      const t = SelectModeEnum.find((it) => it.ID === this.SelectMode);
      return t && t.Name === '单选按钮' && !this.isMultiple;
    },
    localOptions() {
      const _options = this.options.filter(it => !this.HiddenOptionList.includes(it.ID || it));
      if (!this.IsRequired && !this.isMultiple && !this.isRadio) _options.unshift({ ID: null, Name: '请选择' });
      return _options;
    },
  },
  data() {
    return {
      timer: null,
    };
  },
  methods: {
    onRadioItemClick(e, disabled) {
      if (!this.value || this.IsRequired || this.value !== e.ID || disabled) return;
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.checkVal = '';
        this.$emit('blur', '');
        this.timer = null;
      }, 0);
    },
    onBlur() {
      this.$emit('blur', this.value);
    },
    onFocus() {
      this.$emit('focus');
    },
    onSelectChange(e) {
      let t = e;
      if (t === 'radio') t = Math.random();
      this.$emit('blur', t);
    },
    handleInterAction(list) { // 处理选项列表变动时
      if (!Array.isArray(list) || list.length === 0) return;
      // 应分2种情况： 单选时 | 多选时
      if (!this.isMultiple) { // 单选
        if (list.includes(this.value)) {
          if (!this.isDisabled && this.value !== '') this.$emit('change', '');
        }
      } else if (Array.isArray(this.value) && this.value.length > 0) { // 多选
        const _val = this.value.filter(it => !list.includes(it));
        if (!this.isDisabled && JSON.stringify(this.value) !== JSON.stringify(_val)) this.$emit('change', _val);
      }
    },
    handleAllowChange(bool) { // 主要用于在动态切换为不允许自定义时，清除掉原来已设置的自定义的内容，仅为下拉框且为单选的情况下才会出现该情况
      if (!bool && this.value && !this.isMultiple && !this.isRadio) { // 不支持多选且为下拉框时才执行 多选不支持自定义
        const t = this.localOptions.find(it => it.ID === this.value);
        if (!t) {
          this.$emit('change', '');
        }
      }
    },
  },
  watch: {
    DisabledOptionList: {
      handler(val) {
        this.handleInterAction(val);
      },
      immediate: true,
    },
    HiddenOptionList: {
      handler(val) {
        this.handleInterAction(val);
      },
      immediate: true,
    },
    Allow: {
      handler(val) {
        this.handleAllowChange(val);
      },
      immediate: true,
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-option-type-element-display-check-group-select-comp {
  display: inline-block;
  white-space: normal;
  margin-left: 5px;
  margin-bottom: -5px;
  vertical-align: top;
  .el-checkbox__label {
    font-size: 13px;
  }
}
</style>
