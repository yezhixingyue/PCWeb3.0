<!--
 * @Describe: 单选框按钮
 * @FilePath: /src/components/QuotationComps/SMComps/CheckBoxSingle.vue
-->
<template>
  <el-checkbox
    v-model="checked"
    shape="square"
    @change="handleChange"
    class="mp-duotation-sm-comps-checked-wrap"
  >
    {{ title }}
    <template #icon="props">
      <img
        class="img-icon"
        v-show="props.checked"
        :src="props.checked ? imgSrc : ''"
      />
    </template>
  </el-checkbox>
</template>

<script>
// import Vue from 'vue';
// import { Checkbox } from 'vant';
// const imgSrc = require("@/assets/images/selected.png");

// Vue.use(Checkbox);

export default {
  props: {
    title: {
      type: String,
      default: '自定义',
    },
    /**
     * 初始默认状态
     */
    default: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  data() {
    return {
      // imgSrc,
      checked: false,
    };
  },
  methods: {
    handleChange(e) {
      this.$emit('change', e);
    },
  },
  mounted() {
    this.checked = this.default;
  },
  computed: {
    watchValue() {
      return this.default;
    },
  },
  watch: {
    watchValue(newVal) {
      this.checked = newVal;
    },
  },
};
</script>

<style lang="scss">
// @import "@/assets/css/Common/var.scss";
.mp-duotation-sm-comps-checked-wrap.van-checkbox {
}
</style>
