<template>
  <div class="mp-erp-common-comps-recharge-comp-wrap">
    <el-button type="warning" size="mini" class="btn" @click="visible = true">充值</el-button>
    <CommonDialogComp
      width="500px"
      top="20vh"
      title="在线充值"
      :visible.sync="visible"
      :showSubmit="false"
      showDanger
      dangerText="立即充值"
      @danger="submitForm"
      @cancle="visible = false"
      @open="onOpen"
      @closed="onClosed"
      class="mp-erp-common-comps-recharge-comp-dialog-comp-wrap"
    >
      <!-- 内容区 -->
      <el-form
        :model="ruleForm"
        hide-required-asterisk
        :rules="rules"
        @submit.native.prevent
        ref="ruleForm"
        label-width="180px"
        class="recharge-ruleForm"
        size="mini"
      >
        <el-form-item label="当前余额：">
          <span class="is-pink is-bold" v-if="!loading">{{ curAmount }}元</span>
          <span class="is-gray is-font-size-12" v-else>获取中</span>
        </el-form-item>
        <el-form-item label="充值金额：" prop="Amount">
          <el-input v-model.trim="ruleForm.Amount" :disabled="loading" placeholder="请输入充值金额" size="mini"></el-input>
          <span>元</span>
        </el-form-item>
      </el-form>
    </CommonDialogComp>
    <!-- 二维码弹窗 -->
    <QrCodeForPayDialogComp v-model="QrCodeVisible" :payInfoData="payInfoData" @success='handlePaidSuccess'>
      <div class="pay-info" v-if="payInfoData">
        <div class="customer">
          <p>
            <span>客户：</span>
            <span class="is-bold">{{customer.CustomerName}}<template v-if="customer.CustomerSN">（{{customer.CustomerSN}}）</template></span>
          </p>
          <p>
            <span class="is-gray">[ 请使用微信或支付宝扫码支付 ]</span>
          </p>
        </div>
        <div class="amount">
          <span>扫码支付：</span>
          <span class="is-origin is-bold">￥{{(+payInfoData.Amount).toFixed(2)}}元</span>
        </div>
      </div>
    </QrCodeForPayDialogComp>
  </div>
</template>

<script>
import CommonDialogComp from '@/components/common/CommonDialogComp';
import QrCodeForPayDialogComp from '@/components/common/QrCodeForPayDialogComp';

export default {
  props: {
    customer: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    CommonDialogComp,
    QrCodeForPayDialogComp,
  },
  data() {
    const checkAmount = (rule, value, callback) => {
      if (!this.$utils.getValueIsOrNotNumber(value)) {
        callback('格式不正确，请输入数字格式');
        return;
      }
      if (value < 0.01) {
        callback('充值金额不能小于0.01');
        return;
      }
      callback();
    };

    return {
      visible: false,
      curAmount: '',
      loading: false,
      ruleForm: {
        Amount: '',
      },
      rules: {
        Amount: [
          { required: true, message: '请输入充值金额', trigger: 'blur' },
          { validator: checkAmount, trigger: 'blur' },
        ],
      },
      payInfoData: null,
      QrCodeVisible: false,
    };
  },
  methods: {
    async onOpen() {
      this.payInfoData = null;
      this.QrCodeVisible = false;
      this.ruleForm.Amount = '';
      this.curAmount = '';
      if (this.customer && this.customer.CustomerID) {
        this.loading = true;
        const resp = await this.api
          .getCustomerFundBalance(this.customer.CustomerID, { closeLoading: true })
          .catch(() => null);
        this.loading = false;
        if (resp && resp.data.Status === 1000) {
          this.curAmount = resp.data.Data;
        }
      }
    },
    onClosed() {
      this.$refs.ruleForm.resetFields();
    },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.handleRecharge(this.ruleForm.Amount);
        }
      });
    },
    async handleRecharge(Amount) {
      const temp = {
        Amount,
        CustomerID: this.customer.CustomerID,
      };
      const resp = await this.api.getCustomerRecharge(temp).catch(() => null);
      if (resp && resp.data.Status === 1000) { // 获取充值信息成功
        this.payInfoData = resp.data.Data;
        this.visible = false;
        this.QrCodeVisible = true;
      }
    },
    handlePaidSuccess() { // 充值成功
      if (this.payInfoData) {
        const allAmount = +(+this.curAmount + this.payInfoData.Amount).toFixed(2);
        this.$emit('success', allAmount);
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-common-comps-recharge-comp-wrap {
  display: inline-block;
  button.el-button.btn {
    height: 25px;
    padding: 0;
    width: 60px;
    margin-left: 15px;
  }
  .mp-erp-common-comps-recharge-comp-dialog-comp-wrap {
    .el-dialog__body {
      .recharge-ruleForm {
        > .el-form-item .el-form-item__content {
          color: #585858;
          height: 30px;
          .el-input {
            width: 160px;
            margin-right: 4px;
            & + span {
              font-size: 12px;
              color: #888;
            }
            input {
              &::placeholder {
                color: #cbcbcb;
              }
            }
          }
          .is-pink {
            font-size: 15px;
          }
        }
      }
    }
    .el-dialog__footer {
      .dialog-footer p {
        display: flex;
        flex-direction: row-reverse;
        .el-button--default {
          border-color: rgba($color: #000000, $alpha: 0) !important;
          background-color: #fff;
          margin-left: 0;
          margin-right: 20px;
        }
      }
    }
  }
  .pay-info {
    .customer {
      padding-bottom: 40px;
      > p {
        padding-bottom: 16px;
      }
    }
    .amount {
      font-size: 14px;
      .is-origin {
        font-size: 16px;
      }
    }
  }
}
.el-input.is-disabled .el-input__inner {
  background-color: #f8f8f8;
}
</style>
