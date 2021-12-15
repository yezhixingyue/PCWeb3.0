<template>
  <section class="mp-batch-upload-page-header-comps-product-filter-comp-wrap">
    <el-select :value="curProductInfo.isSingle" @change="(e) => handleChangePropsFunc([['isSingle'], e])" size="mini" :disabled='disabled'>
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <ProductSelector
      hiddenLabel
      useOrigin
      :hasAll='false'
      :disabled='disabled || !curProductInfo.isSingle'
      :changePropsFunc="handleChangePropsFunc"
      :ClassID="curProductInfo.ClassID"
      :TypeID="curProductInfo.TypeID"
      :ProductID="curProductInfo.ProductID"
      level1EmptyLabel='产品一级分类'
      level2EmptyLabel='产品二级分类'
      level3EmptyLabel='具体产品'
       size="mini"
      :typeList="[['ClassID'],['TypeID'],['ProductID']]"
    />
  </section>
</template>

<script>
import ProductSelector from '@/components/common/Selector/ProductSelectorIndex.vue';

export default {
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ProductSelector,
  },
  computed: {
    curProductInfo() {
      return this.value;
    },
  },
  data() {
    return {
      options: [
        { label: '单产品上传', value: true },
        { label: '多产品上传', value: false },
      ],
    };
  },
  methods: {
    handleChangePropsFunc([[key], val]) {
      this.$emit('change', [key, val]);
    },
  },
};
</script>
<style lang='scss'>
.mp-batch-upload-page-header-comps-product-filter-comp-wrap {
  display: flex;
  align-items: center;
  .el-select {
    width: 120px;
  }
  > .mp-order-product-select-wrap {
    > li {
      margin-right: 10px;
    }
  }
  > .el-select {
    margin-right: 20px;
  }
}
</style>
