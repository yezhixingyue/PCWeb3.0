<template>
  <section class="mp-invoie-search-detaill-page-wrap">
    <ApplyDetailContent v-if="detailData" :detailData="detailData" />
    <footer v-if="detailData">
      <el-button v-if="detailData.InvoiceStatus === InvoiceStatusEnums.rejected.ID" type="primary" @click="onEditClick">编辑</el-button>
      <el-button class="cancel-btn" @click="goback">返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import ApplyDetailContent from '../../../../packages/InvoiceComps/ApplyDetailContent/index.vue';
import { InvoiceStatusEnums } from '../../../../packages/InvoiceComps/enums';

export default {
  components: {
    ApplyDetailContent,
  },
  data() {
    return {
      invoiceID: '',
      detailData: null,
      InvoiceStatusEnums,
    };
  },
  computed: {
    ...mapState('invoice', ['InvoiceSearchDataList', 'curInvoiceEditData']),
  },
  methods: {
    async getDetailData() {
      if (!this.invoiceID && this.invoiceID !== 0) return;
      const resp = await this.api.getInvoiceDetail(this.invoiceID).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        this.detailData = resp.data.Data;
      }
    },
    goback() {
      this.$router.replace('/mySetting/invoiceSearch/list');
    },
    onEditClick() {
      this.$store.commit('invoice/setCurInvoiceEditData', { ...this.detailData, EnterpriseStatus: '', InvoiceID: +this.invoiceID });
      this.$router.push('/mySetting/invoiceSearch/edit');
    },
  },
  created() {
    if (!this.InvoiceSearchDataList || this.InvoiceSearchDataList.length === 0) {
      this.goback();
      return;
    }
    this.invoiceID = this.$route.params.invoiceID;
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name !== 'InvoiceEditPage') {
        vm.getDetailData();
      } else {
        if (!vm.curInvoiceEditData || vm.curInvoiceEditData.InvoiceID !== +vm.invoiceID) {
          vm.getDetailData();
          return;
        }
        const _vm = vm;
        _vm.detailData = { ...vm.curInvoiceEditData };
        _vm.$nextTick(() => {
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
    if (to.name === 'InvoiceEditPage') {
      self.meta.y = oApp.scrollTop;
    } else {
      self.meta.y = 0;
    }
    next();
  },
};
</script>
<style lang='scss'>
.mp-invoie-search-detaill-page-wrap {
  >  footer {
    text-align: center;
    padding-top: 10px;
    padding-bottom: 30px;
    > .el-button {
      width: 140px;
      & + .el-button {
        margin-left: 30px;
      }
    }
  }
}
</style>
