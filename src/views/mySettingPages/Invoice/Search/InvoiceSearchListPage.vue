<template>
  <section class="mp-pc-invoice-search-list-page-wrap">
    <SearchListHeader />
    <div class="content">
      <InvoiceListEmptyComp v-if="InvoiceSearchDataList.length === 0 && InvoiceSearchDataNumber === 0" :loading="loading" />
      <SearchListTable :loading="loading" :list="InvoiceSearchDataList" @detail="viewDetail" @cancel="cancelInvoice" v-else />
    </div>
    <SearchListFooter />
  </section>
</template>

<script>
import { mapState } from 'vuex';
import SearchListHeader from '../../../../components/InvoiceComps/Search/SearchListHeader.vue';
import SearchListTable from '../../../../components/InvoiceComps/Search/SearchListTable.vue';
import InvoiceListEmptyComp from '../../../../components/InvoiceComps/InvoiceListEmptyComp.vue';
import SearchListFooter from '../../../../components/InvoiceComps/Search/SearchListFooter.vue';
import { InvoiceStatusEnums } from '../../../../packages/InvoiceComps/enums';

export default {
  components: {
    SearchListHeader,
    SearchListTable,
    InvoiceListEmptyComp,
    SearchListFooter,
  },
  computed: {
    ...mapState('invoice', ['InvoiceSearchDataList', 'InvoiceSearchDataNumber', 'loading']),
  },
  methods: {
    viewDetail(item) { // 查看开票详情.
      if (!item) return;
      this.$router.push({
        name: 'InvoiceSearchDetailPage',
        params: {
          invoiceID: item.InvoiceID,
        },
      });
    },
    cancelInvoice(item) { // 取消发票申请 -- 该方法已取消：不再显示取消按钮
      this.$store.dispatch('invoice/getInvoiceCancel', item.InvoiceID);
    },
    getListData() {
      if (this.$route.query.source === 'rejected') {
        this.$store.commit('invoice/clearCondition4SearchList');
        this.$store.commit('invoice/setCondition4SearchList', [['DateType', ''], 'all']);
        this.$store.commit('invoice/setCondition4SearchList', [['InvoiceStatus', ''], InvoiceStatusEnums.rejected.ID]);
      }
      this.$store.dispatch('invoice/getInvoiceSearchDataList');
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name !== 'InvoiceSearchDetailPage') {
        vm.getListData();
      } else {
        if (!vm.InvoiceSearchDataNumber) {
          vm.getListData();
          return;
        }
        vm.$nextTick(() => {
          setTimeout(() => {
            const oApp = document.getElementById('app');
            oApp.scrollTop = to.meta.y;
          }, 0);
        });
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    const oApp = document.getElementById('app');
    const self = from;
    if (to.name === 'InvoiceSearchDetailPage') {
      self.meta.y = oApp.scrollTop;
    } else {
      self.meta.y = 0;
    }
    next();
  },
};
</script>
<style lang='scss'>
.mp-pc-invoice-search-list-page-wrap {
  // margin-left: -45px;
  .mp-pc-invoice-list-is-empty-comp-wrap {
    padding-top: 156px;
  }
  > .content {
    padding-top: 30px;
  }
}
</style>
