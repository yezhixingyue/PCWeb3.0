<template>
  <CommonDialogComp
      width="625px"
      top="15vh"
      title="开票政策"
      cancelText="关闭"
      :visible.sync="localVisible"
      :showSubmit="false"
      @cancle="localVisible = false"
      class="mp-erp-invoice-policy-comp-dialog-comp-wrap"
    >
      <!-- 内容区 -->
      <p><span class="is-bold">1. 发票申请时间</span>：平台自助申请开票，支持名片之家自营物流签收完成及其他三方运输单位发货之日起，3个月内订单的发票申请；</p>
      <p><span class="is-bold">2. 审核开票周期</span>：自助申请开票提交之后2个工作日内审核完毕，申请审核通过之后5个工作日完成开票（周六、日及法定节假日顺延），每月25日后的开票申请视为次月1日申请；</p>
      <p><span class="is-bold">3. 发票发送方式</span>：个人发票及增值税电子普通发票，会以短信或电子邮箱的形式发送；增值税专用发票为纸质发票，会以京东快递或顺丰快递的形式邮寄，运费均为到付；</p>
      <p><span class="is-bold">4. 申请建议</span>：为提高开票效率，建议每月一次集中申请开票；需要邮寄的增值税专用发票，同批次申请邮寄地址相同的会合并寄出</p>
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
};
</script>
<style lang='scss'>
.mp-erp-invoice-policy-comp-dialog-comp-wrap {
  text-align: left;
  .el-dialog__body {
    padding-left: 35px;
    font-size: 13px;
    p {
      line-height: 30px;
      margin-bottom: 12px;
      span {
        color: #444;
      }
    }
  }
}
</style>
