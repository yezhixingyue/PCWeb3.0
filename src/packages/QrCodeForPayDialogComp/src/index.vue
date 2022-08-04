<template>
  <CommonDialogComp
    :width="width"
    :top='top'
    title="扫码支付"
    :visible.sync="visible"
    @cancle="visible = false"
    @open='onOpen'
    @closed='onClosed'
    @close='onClose'
    :class="{'hidden-header': hiddenHeader}"
    class="mp-erp-common-comps-qr-code-for-payment-comp-dialog-comp-wrap">
    <div class="close" v-if="hiddenHeader">
      <i class="el-icon-close" @click="visible = false"></i>
    </div>
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
      <p class="expired-time" v-if="showExpire && ExpiredTimeContent">
        <span>请您在</span>
        <span class="is-pink">{{ExpiredTimeContent}}</span>
        <span>完成支付</span>
      </p>
      <p v-if="showPayDescription" class="pay-description"> <!-- 付款方式描述文字 -->
        <span class="is-gray">【 请使用微信 / 支付宝扫一扫，扫描二维码支付 】</span>
      </p>
      <p class="warning is-pink" v-if="showWarning && payInfoData && payInfoData.Warning">[ {{payInfoData.Warning}} ]</p>
      <p v-if="showAmount && payInfoData" class="amount-box"> <!-- 付款金额信息 -->
        <span>扫码支付：</span>
        <span class="is-pink is-bold">￥{{(+payInfoData.Amount).toFixed(2)}}<i class="is-font-13">元</i></span>
      </p>
      <slot></slot>
      <!-- 支付显示大礼包组合 -->
      <footer class="mp-pay-price-wrap" v-if="payInfoData && showPayGroup">
        <div class="left">
          <p class="f">
            <span>扫码支付:</span>
          </p>
          <p>
            <span>已扣余额:</span>
          </p>
          <p v-if="payInfoData.PaidBeanNumber > 0">
            <span>已扣印豆:</span>
          </p>
          <p>
            <span>货到付款:</span>
          </p>
          <p>
            <span>订单总金额:</span>
          </p>
        </div>
        <div class="right">
          <p class="f">
            <span class="should-pay is-pink">
              <i>￥</i>
              {{payInfoData.Amount | formatNumber}}元
            </span>
          </p>
          <p>
            <span>
              <i>￥</i>
              {{payInfoData.BalanceAmount | formatNumber}}元
            </span>
          </p>
          <p v-if="payInfoData.PaidBeanNumber > 0">
            <span>
              {{payInfoData.PaidBeanNumber}}个
            </span>
          </p>
          <p>
            <span>
              <i>￥</i>
              {{payInfoData.PayOnDelivery | formatNumber}}元
            </span>
          </p>
          <p>
            <span>
              <i>￥</i>
              {{payInfoData.TotalAmount | formatNumber}}元
            </span>
          </p>
        </div>
      </footer>
    </div>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/packages/CommonDialogComp';

export default {
  name: 'QrCodeForPayDialogComp',
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
    showExpire: { // 是否展示到期付款时间
      type: Boolean,
      default: false,
    },
    dynamic: { // 是否动态刷新付款时间
      type: Boolean,
      default: false,
    },
    showPayDescription: { // 是否展示付款方式描述文字
      type: Boolean,
      default: false,
    },
    showAmount: { // 是否展示付款金额信息
      type: Boolean,
      default: false,
    },
    showWarning: { // 是否展示警告信息
      type: Boolean,
      default: false,
    },
    hiddenHeader: { // 是否隐藏弹窗标题
      type: Boolean,
      default: false,
    },
    showPayGroup: { // 是否显示支付价格组合
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: '600px',
    },
    top: {
      type: String,
      default: '13vh',
    },
    successTitle: {
      type: String,
      default: '付款成功',
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
      if (!this.payInfoData || ((!this.payInfoData.PayWay || !this.payInfoData.PayWay.AllinPay) && !this.payInfoData.PayQRCode)) return '';
      return this.payInfoData.PayWay ? this.payInfoData.PayWay.AllinPay : this.payInfoData.PayQRCode;
    },
  },
  data() {
    return {
      timer: null,
      loaded: false,
      loadError: false,
      ExpiredTimeContent: '',
      timer4Expired: null,
      isPaidSuccess: false,
    };
  },
  methods: {
    onOpen() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      if (this.timer4Expired) {
        clearTimeout(this.timer4Expired);
        this.timer4Expired = null;
      }
      this.loaded = false;
      this.loadError = false;
      this.isPaidSuccess = false;
      this.ExpiredTimeContent = '';
      this.handleExpiredTimeSet();
    },
    onClosed() {
      clearTimeout(this.timer);
      this.timer = null;
      clearTimeout(this.timer4Expired);
      this.timer4Expired = null;
      this.loaded = false;
      this.loadError = false;
      this.ExpiredTimeContent = '';
      this.isPaidSuccess = false;
    },
    onClose() {
      this.$emit('close', this.isPaidSuccess);
    },
    onImgLoadError(e) { // 图片下载出错
      this.loadError = true;
      if (e.type === 'error') {
        this.messageBox.failSingleError({
          title: '二维码获取失败！',
          msg: '[ 获取不到图片，请检查网络或稍后再试 ]',
        });
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
        this.messageBox.successSingle({
          title: this.successTitle,
          successFunc: this.handleSuccessPaid,
          failFunc: this.handleSuccessPaid,
        });
      } else {
        this.timer = setTimeout(() => {
          this.getPayStatusByPolling();
        }, 2000);
      }
    },
    handleSuccessPaid() { // 支付成功处理函数
      this.$emit('success');
      this.isPaidSuccess = true;
      this.visible = false;
    },
    setExpiredTime() { // 设置付款时间 或 倒计时 时间
      if (!this.showExpire || !this.payInfoData || !this.payInfoData.ExpiredTime) return;
      const date = new Date(this.payInfoData.ExpiredTime);
      const targetYear = date.getFullYear();
      const targetMonth = date.getMonth();
      const targetDay = date.getDate();
      const targetHour = date.getHours();
      const targetMinute = date.getMinutes();
      const curYear = new Date().getFullYear();
      const curMonth = new Date().getMonth();
      const curDay = new Date().getDate();
      if (targetYear !== curYear || targetMonth !== curMonth || targetDay !== curDay) {
        this.ExpiredTimeContent = `${targetYear}-${targetMonth}-${targetDay}日${targetHour}:${targetMinute}前`;
        return;
      }
      const msDifference = date.getTime() - Date.now();
      const oneHourMsCount = 60 * 60 * 1000; // 1个小时拥有的毫秒时间
      if (msDifference < 2 * oneHourMsCount) { // 两个小时内 显示时分秒
        const hourDifferenceNum = Math.floor(msDifference / oneHourMsCount);
        const oneMinuteMsCount = 60 * 1000;
        const minuteDifferenceNum = Math.floor((msDifference - oneHourMsCount * hourDifferenceNum) / oneMinuteMsCount);
        const secondDifferenceNum = Math.floor((msDifference - oneHourMsCount * hourDifferenceNum - minuteDifferenceNum * oneMinuteMsCount) / 1000);
        const _hour = hourDifferenceNum > 0 ? `${hourDifferenceNum}小时` : '';
        const _minute = `0${minuteDifferenceNum}分`.slice(-3);
        const _second = `0${secondDifferenceNum}秒`.slice(-3);
        this.ExpiredTimeContent = `${_hour}${_minute}${_second}内`;
        return;
      }
      this.ExpiredTimeContent = `今天${targetHour}:${targetMinute}前`;
    },
    handleExpiredTimeSet() { // 设置到期时间
      if (!this.showExpire || !this.payInfoData || !this.payInfoData.ExpiredTime) return;
      this.setExpiredTime();
      if (this.dynamic) {
        this.timer4Expired = setInterval(() => {
          this.setExpiredTime();
        }, 1000);
      }
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
        padding-bottom: 25px;
      }
      > .expired-time {
        color: #888;
        margin-top: -15px;
        padding-bottom: 4px;
        > .is-pink {
          margin: 0 5px;
        }
      }
      > .warning {
        padding-top: 15px;
        margin-bottom: -10px;
      }
      > .pay-description {
        padding-top: 10px;
      }
      > .amount-box {
        padding-top: 25px;
        > .is-pink {
          font-size: 16px;
          display: inline-block;
          vertical-align: -1px;
          min-width: 73px;
        }
      }
      > footer.mp-pay-price-wrap {
        // display: flex;
        // justify-content: center;
        font-size: 12px;
        margin-top: 28px;
        > .left {
          width: 6em;
          text-align: right;
          margin-right: 10px;
          margin-left: -10px;
          display: inline-block;
        }
        > .right {
          margin-top: -3px;
          text-align: right;
          display: inline-block;
        }
        p {
          font-size: 12px;
          width: 100%;
          .should-pay {
            font-size: 16px;
            font-weight: 600;
            i {
              width: 14px;
              display: inline-block;
            }
          }
          span {
            white-space: nowrap;
          }
          padding-bottom: 15px;
          &.f {
            padding-bottom: 20px;
          }
        }
      }
    }
  }
  .dialog-footer {
    display: none;
  }
  &.hidden-header {
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding-top: 35px;
      position: relative;
      > div.close {
        position: absolute;
        right: 12px;
        top: 11px;
        font-size: 16px;
        > i {
          cursor: pointer;
          &:hover {
            color: #428dfa;
          }
        }
      }
    }
  }
}
</style>
