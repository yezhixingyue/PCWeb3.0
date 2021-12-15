<template>
  <CommonDialogComp
    width="600px"
    top='13vh'
    title="扫码支付"
    :visible.sync="visible"
    @cancle="visible = false"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-common-comps-qr-code-for-payment-comp-dialog-comp-wrap">
    <div class="qr-code-content">
      <template v-if="payInfoData">
        <div class="img-box">
          <div v-if="QrCodeSrc && !loaded && !loadError">
            <i class="el-icon-loading is-primary-blue"></i>
            <span>正在加载中...</span>
          </div>
          <div v-if="loadError">
            <i class="el-icon-error is-pink"></i>
            <span>图片获取失败！</span>
          </div>
          <img v-if="QrCodeSrc && visible" v-show="loaded" :src="QrCodeSrc" alt="" @error="onImgLoadError" @load="onLoaded">
        </div>
      </template>
      <slot></slot>
    </div>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from './CommonDialogComp';

export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    payInfoData: {
      type: Object,
      default: null,
    },
    payType: { // 充值11  消费传21
      type: String,
      default: '11',
    },
  },
  components: {
    CommonDialogComp,
  },
  computed: {
    visible: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
    QrCodeSrc() {
      if (!this.payInfoData || !this.payInfoData.PayWay) return '';
      return this.payInfoData.PayWay.AllinPay;
    },
  },
  data() {
    return {
      timer: null,
      loaded: false,
      loadError: false,
    };
  },
  methods: {
    onOpen() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.loaded = false;
      this.loadError = false;
    },
    onClosed() {
      clearTimeout(this.timer);
      this.timer = null;
      this.loaded = false;
      this.loadError = false;
    },
    onImgLoadError(e) { // 图片下载出错
      this.loadError = true;
      if (e.type === 'error') {
        this.messageBox.failSingleError(
          '二维码获取失败！',
          '[ 获取不到图片，请检查网络或稍后再试 ]',
        );
      }
    },
    onLoaded() { // 图片下载完成
      if (!this.visible) return;
      this.loaded = true;
      this.getPayStatusByPolling();
    },
    async getPayStatusByPolling() { // 轮询付款状态
      if (!this.visible || !this.payInfoData || !this.payInfoData.PayCode) return;
      const resp = await this.api.getPayResult(this.payInfoData.PayCode, this.payType).catch(() => null); // 充值11 消费21
      if (resp && resp.data.Status === 1000 && resp.data.Data === 'True') {
        this.messageBox.successSingle(
          '付款成功',
          this.handleSuccessPaid,
          this.handleSuccessPaid,
        );
      } else {
        this.timer = setTimeout(() => {
          this.getPayStatusByPolling();
        }, 2000);
      }
    },
    handleSuccessPaid() { // 支付成功处理函数
      this.$emit('success');
      this.visible = false;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-common-comps-qr-code-for-payment-comp-dialog-comp-wrap {
  .el-dialog__body {
    padding-top: 18px;
    .qr-code-content {
      height: 458px;
      font-size: 12px;
      color: #585858;
      text-align: center;
      .img-box {
        height: 240px;
        display: flex;
        justify-content: center;
        > div {
          width: 220px;
          height: 220px;
          background-color: #f8f8f8;
          border-radius: 4px;
          color: #989898;
          display: flex;
          justify-content: center;
          align-items: center;
          line-height: 24px;
          i {
            font-size: 20px;
            margin-right: 3px;
          }
        }
        padding-bottom: 30px;
      }
    }
  }
  .dialog-footer {
    display: none;
  }
}
</style>
