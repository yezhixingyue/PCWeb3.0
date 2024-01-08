<template>
  <CommonDialogComp
      width="520px"
      top="12vh"
      title="微信账号绑定"
      :showSubmit="false"
      cancelText="关闭"
      :visible.sync="localVisible"
      @cancle="localVisible = false"
      class="mp-erp-invoice-confirm-comp-dialog-comp-wrap"
    >
      <WxLoginComp type="accountAndSecurity" />
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/packages/CommonDialogComp';
import WxLoginComp from '../LoginComps/WxLoginComp.vue';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    CommonDialogComp,
    WxLoginComp,
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
  },
};
</script>
<style lang='scss'>
.mp-erp-invoice-confirm-comp-dialog-comp-wrap {
  text-align: left;
  .el-dialog__body {
    padding-left: 35px;
    height: 360px;
    padding: 0;
    .wx-login-content {
      padding-top: 20px;
    }
  }
}
</style>
