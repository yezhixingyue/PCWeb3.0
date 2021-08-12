<!--
 * @Describe: 报价模块 -- 款数
 * @FilePath: /src/components/QuotationComps/ProductQuotationContentComps/NewPcComps/SingleInputComp.vue
-->

<template>
  <section
    class="mp-duotation-content-comps-single-input-comp-wrap"
    v-show="!(minNum && minNum === maxNum)"
  >
    <span class="title gray">{{title}}：</span>
    <!-- <div class="kind-content"> -->
      <el-input v-model.trim="inpValue" @focus='utils.handleSelect' :disabled="disabled"></el-input>
    <!-- </div> -->
    <span class="remark gray">{{ remark }}</span>
  </section>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  model: {
    prop: 'value',
    event: 'changeFunc',
  },
  props: {
    /**
     * 标题
     */
    title: {
      type: String,
      default: '款数',
    },
    /**
     * 备注信息
     */
    remark: {
      type: String,
      default: '款',
    },
    /**
     * 该组件负责处理的值
     */
    value: {
      required: true,
    },
    minNum: {},
    maxNum: {},
    /**
     * 是否为禁止输入状态
     */
    disabled: {},
  },
  computed: {
    ...mapState('Quotation', ['obj2GetProductPrice']),
    inpValue: {
      get() {
        return this.value;
      },
      set(newValue) {
        const _val = newValue.replace(/[^\d]/g, '');
        this.$emit('changeFunc', _val);
      },
    },
  },
  methods: {
    ...mapMutations('Quotation', ['setProductParams', 'curProductInfo2Quotation']),
  },
  watch: {
    curProductInfo2Quotation: {
      handler(newVal) {
        // console.log('curProductInfo2Quotatio-------------------------------n');
        if (newVal) {
          if (this.minNum && this.minNum === this.maxNum) {
            this.$emit('changeFunc', this.minNum);
          }
        }
      },
      immediate: true,
    },
  },
  updated() {
    // console.log('updated-------------------');
  },
  // mounted() {
  //   if (this.minNum && this.minNum === this.maxNum) {
  //     this.$emit('changeFunc', this.minNum);
  //   }
  // },
};
</script>

<style class="scss">
section.mp-duotation-content-comps-single-input-comp-wrap > header {
  height: 24px;
  line-height: 24px;
}
</style>
