<template>
  <el-input v-model.trim="content" v-if="!InputContent" size="small" class="mp-erp-number-type-element-display-input-comp" maxlength="9"></el-input>
  <CanFreeCreateSelectComp v-else :allow-create='Allow' :placeholder='placeholder' v-model="content" :options='options' />
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
    InputContent: { // 选项列表
      type: String,
      default: '',
    },
    Allow: { // 是否允许自定义
      type: Boolean,
      default: false,
    },
    value: {},
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
