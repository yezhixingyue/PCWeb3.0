<template>
  <CanFreeCreateSelectComp v-if="!isRadio" v-model="checkVal" :placeholder="placeholder" :allow-create='Allow' :options='options' :isMultiple='isMultiple' />
  <el-radio-group v-model="checkVal" v-else>
    <el-radio v-for="item in options" :key="item.ID" :label="item.ID">{{item.Name}}</el-radio>
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
    Allow: { // 是否允许自定义
      type: Boolean,
      default: false,
    },
    isMultiple: { // 是否可多选
      type: Boolean,
      default: false,
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
      const SelectModeEnum = [{ Name: '单选按钮', ID: 0 }, { Name: '下拉框', ID: 1 }];
      const t = SelectModeEnum.find(it => it.ID === this.SelectMode);
      return t && t.Name === '单选按钮' && !this.isMultiple;
    },
  },
};
</script>
<style lang='scss'>
</style>
