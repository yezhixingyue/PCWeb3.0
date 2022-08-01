<template>
  <section>
    <CombineTable v-if="!willGoback" :list="invoiceList" :total="invoiceTotalAmount" />
    <InvoiceMakeupFormContainner @goback="goback" @submit="submit" @view="onView" :willGoback="willGoback" :editData="editData" />
    <InvoiceEnterpriseViewDialog :visible.sync="visible" :EnterpriseData="EnterpriseData" v-if="EnterpriseData" @jumpSearch="jumpSearch" />
  </section>
</template>

<script>
// 该页面文件在合并开票页面及被驳回的发票编辑页面共用
import { mapState } from 'vuex';
import CombineTable from '../../../../packages/InvoiceComps/ApplyDetailContent/CombineTable.vue';
import InvoiceMakeupFormContainner from '../../../../components/InvoiceComps/Makeup/InvoiceMakeupFormContainner.vue';
import InvoiceEnterpriseViewDialog from '../../../../components/InvoiceComps/Makeup/InvoiceEnterpriseViewDialog.vue';

export default {
  components: {
    CombineTable,
    InvoiceMakeupFormContainner,
    InvoiceEnterpriseViewDialog,
  },
  computed: {
    ...mapState('invoice', ['curCombineResult', 'curCondition4MakeupList', 'curInvoiceEditData']),
    isEdit() {
      return this.$route.name === 'InvoiceEditPage';
    },
    editData() {
      return this.isEdit ? this.curInvoiceEditData : null;
    },
    willGoback() {
      if (this.isEdit) {
        return !this.curInvoiceEditData;
      }
      return !this.curCombineResult || !this.curCondition4MakeupList;
    },
    invoiceList() {
      if (this.isEdit) {
        return this.curInvoiceEditData ? this.curInvoiceEditData.MakeUpInfo || [] : [];
      }
      return this.curCombineResult ? this.curCombineResult.Data.InvoiceUseCategorySet || [] : [];
    },
    invoiceTotalAmount() {
      if (this.isEdit) {
        return this.curInvoiceEditData ? this.curInvoiceEditData.InvoiceAmount || '' : '';
      }
      return this.curCombineResult ? this.curCombineResult.Data.TotalInvoiceAmount || '' : '';
    },
  },
  data() {
    return {
      visible: false,
      EnterpriseData: null,
    };
  },
  methods: {
    goback() {
      if (this.isEdit) {
        if (!this.willGoback) {
          this.$router.go(-1);
        } else {
          this.$router.replace('/mySetting/invoiceSearch/list');
        }
        return;
      }
      this.$router.replace('/mySetting/invoiceMakeup/list');
    },
    async submit(formData) {
      const temp = {
        ...formData,
      };
      if (!temp.InvoiceID && temp.InvoiceID !== 0) {
        temp.InvoiceEndTime = this.curCombineResult.Data.InvoiceEndTime;
        temp.InvoiceUseCategoryFilter = { ...this.curCondition4MakeupList };
        delete temp.InvoiceID;
      }
      const resp = await this.api.getInvoiceSave(temp).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          this.$store.commit('invoice/setCurCondition4MakeupList', null);
          this.$store.commit('invoice/setCurInvoiceEditData', null);
          this.goback();
        };
        this.messageBox.successSingle({
          title: '提交成功',
          successFunc: cb,
          failFunc: cb,
        });
      }
    },
    onView(e) { // 查看审核中|被驳回具体信息
      this.EnterpriseData = e;
      this.visible = true;
    },
    jumpSearch() {
      this.$router.replace({
        path: '/mySetting/invoiceSearch',
        query: { source: 'rejected' },
      });
    },
  },
  created() { // 通过url信息获取到被驳回详情数据？ 或（如果不需要获取时） 在仓库中获取该详情数据 -- 此时应修改下面跳回条件
    if (this.willGoback) {
      this.goback();
    }
  },
};
</script>
<style lang='scss'>
</style>
