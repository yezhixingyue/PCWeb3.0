<template>
  <footer class="mp-pc-invoice-search-list-page-footer-comp-wrap">
    <Count
      :watchPage='condition4SearchList.Page'
      :handlePageChange='handlePageChange'
      :count='InvoiceSearchDataNumber'
      :pageSize='condition4SearchList.PageSize'
      rightContent='个申请单'
      >
    </Count>
  </footer>
</template>

<script>
import { mapState } from 'vuex';
import Count from '../../common/Count.vue';

export default {
  components: {
    Count,
  },
  computed: {
    ...mapState('invoice', ['InvoiceSearchDataNumber', 'condition4SearchList']),
  },
  methods: {
    handlePageChange(page) {
      this.$store.dispatch('invoice/getInvoiceSearchDataList', [page, true]);
    },
  },
};
</script>
<style lang='scss'>
.mp-pc-invoice-search-list-page-footer-comp-wrap {
  height: 55px;
}
</style>
