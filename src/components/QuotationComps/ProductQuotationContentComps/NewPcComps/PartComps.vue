<!--
 * @Describe: 部件 mp-duotation-content-comps-part-comp-wrap
 * @FilePath: /src/components/QuotationComps/ProductQuotationContentComps/NewPcComps/PartComps.vue
-->
<template>
  <article>
    <part-single-comps
      v-for="(Part, i) of PartList"
      :key="Part.PartID"
      :PartData="Part"
      :index="i"
    />
  </article>
</template>

<script>
import PartSingleComps from '@/components/QuotationComps/ProductQuotationContentComps/NewPcComps/PartSingleComps.vue';

export default {
  props: {
    /**
     * 部件列表数据
     */
    PartList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    PartSingleComps,
  },
};
</script>

<style lang="scss"></style>
