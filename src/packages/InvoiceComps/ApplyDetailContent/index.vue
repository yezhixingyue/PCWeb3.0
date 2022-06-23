<template>
  <div v-if="detailData" class="mp-common-comp-invoice-apply-detail-content-wrap" :class="{[projectType]:projectType}">
    <InvoiceApplyStatusComp :detailData="detailData" :showThroughBtn="projectType==='erp'" @through="onThroughClick" :invoiceStatus="invoiceStatus" />
    <SheetListComp v-for="it in SheetList" :key="it.title" :item="it" />
    <CombineTable :list="invoiceList" :total="invoiceTotalAmount" />
  </div>
</template>

<script>
import InvoiceApplyStatusComp from './InvoiceApplyStatusComp.vue';
import SheetListComp from './SheetListComp.vue';
import CombineTable from './CombineTable.vue';
import { InvoiceTypeEnums, InvoiceTitleEnums } from '../enums';
import { format2MiddleLangTypeDateFunc } from '../../commonFilters';
import { projectType } from '../../../assets/js/setup';
import { formatBankCard } from '../utils';

export default {
  props: {
    detailData: {
      type: Object,
      default: null,
    },
  },
  components: {
    InvoiceApplyStatusComp,
    SheetListComp,
    CombineTable,
  },
  data() {
    return {
      SheetList: [],
      projectType,
    };
  },
  computed: {
    invoiceList() {
      return this.detailData ? this.detailData.MakeUpInfo || [] : [];
    },
    invoiceTotalAmount() {
      return this.detailData ? this.detailData.InvoiceAmount || '' : '';
    },
    invoiceStatus() {
      return this.detailData ? this.detailData.InvoiceStatus : '';
    },
  },
  methods: {
    getDetailSheetListData() {
      if (!this.detailData) return;
      const {
        InvoiceType, InvoiceMainBody, InvoiceAmount,
        EnterpriseName, CreditCode, RegisteredAddress, RegisteredTelephone, OpeningBank, BankAccount,
        ReceiverContactWay, ReceiverMail, CreateTime, OperateTime, PersonalName,
        ReceiverName, ReceiverProvinceName, ReceiverCityName, ReceiverCountyName, ReceiverAddress,
      } = this.detailData;
      const arr = [];
      if (InvoiceType === InvoiceTypeEnums.special.ID) { // 专票 分为2个表
        const temp1 = {
          title: '发票信息',
          list: [
            { label: '开票金额', value: `￥${InvoiceAmount}元`, color: '#ff3769' },
            { label: '发票类型', value: InvoiceTypeEnums.special.Name },
            { label: '抬头名称', value: EnterpriseName },
            { label: '统一社会信用代码', value: CreditCode },
            { label: '注册地址', value: RegisteredAddress },
            { label: '注册电话', value: RegisteredTelephone },
            { label: '开户银行', value: OpeningBank },
            { label: '银行账号', value: formatBankCard(BankAccount) },
            { label: '申请开票时间', value: format2MiddleLangTypeDateFunc(CreateTime) },
            { label: '处理时间', value: OperateTime ? format2MiddleLangTypeDateFunc(OperateTime) : '' },
          ],
        };
        const _receiverAddress = `${ReceiverProvinceName || ''}${ReceiverCityName || ''}${ReceiverCountyName || ''}${ReceiverAddress || ''}`;
        const temp2 = {
          title: '收票人信息',
          list: [
            { label: '收票人姓名', value: ReceiverName },
            { label: '收票人地址', value: _receiverAddress },
            { label: '收票人电话', value: ReceiverContactWay },
          ],
        };
        arr.push(temp1, temp2);
      } else if (InvoiceMainBody === InvoiceTitleEnums.enterprise.ID) { // 企业普票  1个表
        const temp = {
          title: '发票信息',
          list: [
            { label: '开票金额', value: `￥${InvoiceAmount}元`, color: '#ff3769' },
            { label: '发票类型', value: InvoiceTypeEnums.normal.Name },
            { label: '抬头名称', value: EnterpriseName },
            { label: '统一社会信用代码', value: CreditCode },
            { label: '注册地址', value: RegisteredAddress },
            { label: '注册电话', value: RegisteredTelephone },
            { label: '开户银行', value: OpeningBank },
            { label: '银行账号', value: formatBankCard(BankAccount) },
            { label: '收票人手机', value: ReceiverContactWay },
            { label: '收票人邮箱', value: ReceiverMail },
            { label: '申请开票时间', value: format2MiddleLangTypeDateFunc(CreateTime) },
            { label: '处理时间', value: OperateTime ? format2MiddleLangTypeDateFunc(OperateTime) : '' },
          ],
        };
        arr.push(temp);
      } else { // 个人普票  1个表
        const temp = {
          title: '发票信息',
          list: [
            { label: '开票金额', value: `￥${InvoiceAmount}元`, color: '#ff3769' },
            { label: '发票类型', value: InvoiceTypeEnums.normal.Name },
            { label: '抬头类型', value: InvoiceTitleEnums.personal.Name },
            { label: '抬头名称', value: PersonalName },
            { label: '收票人手机', value: ReceiverContactWay },
            { label: '收票人邮箱', value: ReceiverMail },
            { label: '申请开票时间', value: format2MiddleLangTypeDateFunc(CreateTime) },
            { label: '处理时间', value: OperateTime ? format2MiddleLangTypeDateFunc(OperateTime) : '' },
          ],
        };
        arr.push(temp);
      }
      this.SheetList = arr;
    },
    onThroughClick() {
      this.$emit('through');
    },
    repaint() {
      this.getDetailSheetListData();
      if (this.$refs.oStatusDom) this.$refs.oStatusDom.init();
    },
  },
  watch: {
    invoiceStatus: {
      handler() {
        this.getDetailSheetListData();
      },
      immediate: true,
    },
  },
  // mounted() {
  //   this.getDetailSheetListData();
  // },
};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.mp-common-comp-invoice-apply-detail-content-wrap {
  font-size: 14px;
  &.erp {
    .blue-v-line {
      color: $--color-primary !important;
    }
  }
}
</style>
