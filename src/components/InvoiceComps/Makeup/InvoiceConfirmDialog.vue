<template>
  <CommonDialogComp
      width="625px"
      top="12vh"
      title="发票开具确认书"
      submitText="同意"
      cancelText="关闭"
      :visible.sync="localVisible"
      @cancle="localVisible = false"
      @submit="onSubmit"
      class="mp-erp-invoice-confirm-comp-dialog-comp-wrap"
    >
      <!-- 内容区 -->
      <p class="i mb-13">依据国家税收相关法律法规及发票管理相关规定，任何单位和个人不得要求他人为自己开具与实际经济业务情况不符的增值税发票。</p>
      <p>包含但不限于下列情况：</p>
      <p class="i">1、没有发生货物采购或没有接受应税劳务，要求他人为自己或第三方开具增值税发票。</p>
      <p class="i">2、实际发生货物采购与接受应税劳务，但要求他人为自己或第三方开具与实际经济业务在品类、数量和金额等方面不符的增值税发票。</p>
      <p class="i mt-13">本人作为发票申请人已充分了解上述相关法律法规及发票管理规定，确认填写的开票信息中买方与卖方（郑州名片之家电子商务有限公司、河南凌顶揽众印务有限公司）实际发生经济业务的单位或个人，并确认仅就实际购买的商品或劳务的品类、数量和金额索取增值税发票。
       如本人未按国家相关法律法规及发票管理规定，申请开具或使用增值税发票，由本人自行承担所有的法律责任。</p>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '../../../packages/CommonDialogComp';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    CommonDialogComp,
  },
  computed: {
    localVisible: {
      get() {
        return this.visible;
      },
      set(bool) {
        this.$emit('update:visible', bool);
      },
    },
  },
  methods: {
    onSubmit() {
      this.$emit('submit');
      this.localVisible = false;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-invoice-confirm-comp-dialog-comp-wrap {
  text-align: left;
  .el-dialog__body {
    padding-left: 35px;
    font-size: 13px;
    p {
      line-height: 30px;
    }
    p.i {
      text-indent: 2em;
    }
  }
}
</style>
