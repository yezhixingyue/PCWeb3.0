<template>
  <div v-if="originReceiverData || editData">
    <InvoiceMakeupForm
     :originReceiverData="originReceiverData"
     :editData="editData"
     :originEnterpriseData="originEnterpriseData"
     :fetchEnterpriseDataError="fetchEnterpriseDataError"
     @goback="goback"
     @view="onView"
     @submit="submit"
     :switchToEnterprise="switchToEnterprise"
     :class="{loading: loading}"
     key="1"
    />
  </div>
</template>

<script>
import InvoiceMakeupForm from '../../../packages/InvoiceComps/InvoiceMakeupForm/index.vue';
import { InvoiceTypeEnums, InvoiceTitleEnums } from '../../../packages/InvoiceComps/enums';

export default {
  props: {
    willGoback: {
      type: Boolean,
      default: false,
    },
    editData: {
      type: Object,
      default: null,
    },
  },
  components: {
    InvoiceMakeupForm,
  },
  data() {
    return {
      originReceiverData: null,
      originEnterpriseData: null,
      fetchEnterpriseDataError: false,
      loading: false,
    };
  },
  computed: {
  },
  methods: {
    goback() {
      this.$emit('goback');
    },
    onView() { // 查看审核中|被驳回状态
      this.$emit('view', this.originEnterpriseData);
    },
    submit(e) {
      this.$emit('submit', e);
    },
    async getOriginEnterpriseData() { // 设置初始收票人数据
      if (this.editData) return;
      const resp = await this.api.getInvoiceHistoryDetail().catch(() => null);
      if (resp && resp.data.Status === 1000) {
        this.originReceiverData = resp.data.Data || {};
        const { InvoiceType, InvoiceMainBody } = this.originReceiverData;
        if (!(InvoiceType === InvoiceTypeEnums.normal.ID && InvoiceMainBody === InvoiceTitleEnums.personal.ID)) {
          this.switchToEnterprise();
        }
      }
    },
    async switchToEnterprise() { // 获取企业开票信息数据
      if (this.editData) return;
      this.loading = true;
      const resp = await this.api.getInvoiceEnterpriseDetail().catch(() => null);
      this.loading = false;
      if (resp && resp.data.Status === 1000) {
        this.originEnterpriseData = resp.data.Data || {};
      } else {
        this.fetchEnterpriseDataError = true;
      }
    },
  },
  mounted() { // 当编辑被驳回详情的时候，不用执行getOriginEnterpriseData、switchToEnterprise方法，此时应获取到详情信息，填充至originReceiverData，并且企业状态修改至''，
    if (!this.willGoback) this.getOriginEnterpriseData();
  },
};
</script>
<style lang='scss'>
</style>
