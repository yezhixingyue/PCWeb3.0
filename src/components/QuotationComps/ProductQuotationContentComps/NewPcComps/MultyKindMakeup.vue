<!--
 * @Describe: 多款联拼组件
 * @FilePath: /src/components/QuotationComps/ProductQuotationContentComps/NewPcComps/MultyKindMakeup.vue
-->

<template>
  <section
    class="mp-duotation-content-comps-makeup-wrap"
    v-if="!(maxColCount === 1 && maxRowCount === 1)"
  >
    <div>
      <span class="title gray">长边拼数：</span>
      <el-input v-model="rowNum" :disabled="maxRowCount === 1"
        @focus='utils.handleSelect' :min='1' :max='maxRowCount'></el-input>
      <span class="gray remark">行</span>
    </div>
    <div class="col-box">
      <span class="title gray">短边拼数：</span>
      <el-input v-model="colNum" :disabled="maxColCount === 1"
        @focus='utils.handleSelect' :min='1' :max='maxColCount'></el-input>
      <span class="gray remark">列</span>
    </div>
    <el-checkbox v-if="AllowMultyKindMakeup" v-model="checked">多款联拼</el-checkbox>
  </section>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  props: {
    /**
     * 是否允许多款联拼
     */
    AllowMultyKindMakeup: {
      type: Boolean,
      default: false,
    },
    /**
     * 最大联拼列数
     */
    maxColCount: {
      type: Number,
    },
    /**
     * 最大联拼行数
     */
    maxRowCount: {
      type: Number,
    },
  },
  data() {
    return {
      isAllowMakeup: true,
    };
  },
  computed: {
    ...mapState('Quotation', ['obj2GetProductPrice']),
    rowNum: {
      get() {
        return this.obj2GetProductPrice.ProductParams.MakeupRowNumber;
      },
      set(newVal) {
        const _val = newVal.replace(/[^\d]/g, '');
        this.setProductParams(['MakeupRowNumber', _val]);
      },
    },
    colNum: {
      get() {
        return this.obj2GetProductPrice.ProductParams.MakeupColumnNumber;
      },
      set(newVal) {
        const _val = newVal.replace(/[^\d]/g, '');
        this.setProductParams(['MakeupColumnNumber', _val]);
      },
    },
    checked: {
      get() {
        return this.obj2GetProductPrice.ProductParams.MultyKindMakeup;
      },
      set(e) {
        const key = e;
        this.setProductParams(['MultyKindMakeup', key]);
      },
    },
  },
  methods: {
    ...mapMutations('Quotation', ['setProductParams']),
  },
};
</script>

<style lang="scss">
.mp-duotation-content-comps-makeup-wrap {
  > div {
    display: inline-block;
    &.col-box {
      margin: 0 30px 0 80px;
    }
  }
  margin-bottom: 22px;
}
</style>
