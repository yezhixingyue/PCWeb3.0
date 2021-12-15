<template>
  <section class="mp-batch-upload-page-header-comps-address-setup-comp-wrap">
    <ConsigneeAddressSetpComp
      v-if="customer"
      ref="oConsigneeAddressSetpComp"
      isBatchUploadUse
      :watchClearVal="customer"
      :customerInfo="customer"
      :ExpressList="ExpressList"
      @changeAddressInfo="setAddressInfo4PlaceOrder"
      @validChange='handleValidChange'
    />
  </section>
</template>

<script>
import ConsigneeAddressSetpComp from '@/components/QuotationComps/PlaceOrderComps/ConsigneeAddressSetpComp/index.vue';
import { mapState } from 'vuex';

export default {
  props: {
    customer: {
      type: Object,
      default: null,
    },
  },
  components: {
    ConsigneeAddressSetpComp,
  },
  computed: {
    ...mapState('common', ['ExpressList']),
  },
  methods: {
    setAddressInfo4PlaceOrder(data) {
      this.$emit('change', data);
    },
    handleValidChange(onlyAddChange) { // 触发有效地址改变事件（指会影响到运费计算的地址改变 1. 配送方式发生改变 2. 配送方式未改变但省市区发生改变 3. 注意避免省市区改变后影响到配送方式改变的重复事件触发）
      this.$emit('validAddChange', onlyAddChange);
    },
  },
  mounted() {
    this.$store.dispatch('common/getExpressList');
  },
};
</script>
<style lang='scss'>
.mp-batch-upload-page-header-comps-address-setup-comp-wrap {
  font-size: 14px;
}
</style>
