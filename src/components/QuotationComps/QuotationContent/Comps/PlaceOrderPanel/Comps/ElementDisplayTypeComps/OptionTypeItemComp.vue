<template>
  <CanFreeCreateSelectComp
    v-if="!isRadio"
    v-model="checkVal"
    :placeholder="placeholder"
    :isDisabled="isDisabled"
    :allow-create="Allow"
    :options="localOptions"
    :isMultiple="isMultiple"
    :DisabledOptionList='DisabledOptionList'
  />
  <el-radio-group v-model="checkVal" v-else :disabled="isDisabled">
    <el-radio v-for="item in localOptions" :key="item.ID || item.Name" :label="item.ID"
     @click.native.stop="onRadioItemClick(item)" :disabled='DisabledOptionList.includes(item.ID)'>{{
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
    placeholder: {
      type: String,
      default: '请选择',
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
  },
  components: {
    CanFreeCreateSelectComp,
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
    isRadio() {
      const SelectModeEnum = [
        { Name: '单选按钮', ID: 0 },
        { Name: '下拉框', ID: 1 },
      ];
      const t = SelectModeEnum.find((it) => it.ID === this.SelectMode);
      return t && t.Name === '单选按钮' && !this.isMultiple;
    },
    localOptions() {
      // const _options = this.options.filter(it => !this.HiddenOptionList.includes(it.ID || it)
      //  || (this.value === it.ID || this.value === it || (Array.isArray(this.value) && this.value.includes(it.ID || it))));
      const _options = this.options.filter(it => !this.HiddenOptionList.includes(it.ID || it));
      if (!this.IsRequired && !this.isMultiple && !this.isRadio) _options.unshift({ ID: '', Name: '请选择' });
      return _options;
    },
  },
  data() {
    return {
      timer: null,
    };
  },
  methods: {
    onRadioItemClick(e) {
      if (!this.value || this.IsRequired || this.value !== e.ID) return;
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.checkVal = '';
        this.timer = null;
      }, 0);
    },
  },
};
</script>
<style lang='scss'>
</style>
