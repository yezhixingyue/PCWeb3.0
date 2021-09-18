<template>
  <PanelItemComp v-if="ProductParams && curProductInfo2Quotation">
    <template #img>
      <img src="@/assets/images/product-info.png" alt="">
    </template>
    <ul>
      <li>
        <span class="label">产品名称：</span>
        <div class="text is-font-14 is-bold">{{curProductInfo2Quotation.ShowName}}</div>
      </li>
    </ul>
  </PanelItemComp>
</template>

<script>
import ShowProductDetail from '@/store/Quotation/ShowProductDetail';
import PanelItemComp from './PanelItemComp.vue';

export default {
  props: {
    ProductParams: {
      type: Object,
      default: null,
    },
    curProductInfo2Quotation: {
      type: Object,
      default: null,
    },
  },
  components: {
    PanelItemComp,
  },
  methods: {
    getProductDetailShowDataList() {
      const data = ShowProductDetail.getProductDetailShowDataList(this.ProductParams, this.curProductInfo2Quotation);
      console.log('getProductDetailShowDataList', data);
    },
  },
  mounted() {
    this.getProductDetailShowDataList();
  },
};
</script>
<style lang='scss'>
</style>
