<template>
  <el-dialog
    :visible.sync="isShow2PayDialog"
    width="550px"
    custom-class="dialog-to-pay-box"
    center
    :before-close="handleClose"
    v-dialogDrag
  >
    <section v-if="curPayInfo2Code">
      <header>
        <div class="img-box">
          <img
            v-show="showImg"
            :src="imgSrc"
            @error="onError"
            @load="onLoad"
            alt
           />
          <div v-if="!showImg" class="payImg-loading-box">
            <i class="el-icon-loading"></i>
            <i>正在加载中</i>
          </div>
        </div>
        <p>
          <!-- <span>客户：{{curToPayList[0].CustomerName}} </span>
          <span class="is-gray"> （{{curToPayList[0].CustomerNo}}）</span> -->
        </p>
        <p class="gray">[ 请使用微信/支付宝扫一扫，扫描二维码支付 ]</p>
      </header>
      <footer class="mp-pay-price-wrap">
        <div class="left">
          <p>
            <span>扫码支付:</span>
          </p>
          <p>
            <span>已扣余额:</span>
          </p>
          <p>
            <span>货到付款:</span>
          </p>
          <p>
            <span>订单总金额:</span>
          </p>
        </div>
        <div class="right" v-if="curPayInfo2Code">
          <p>
            <span class="should-pay is-pink">
              <i>￥</i>
              {{numToFixed(curPayInfo2Code.Amount, 2)}}元
            </span>
          </p>
          <p>
            <span>
              <i>￥</i>
              {{numToFixed(curPayInfo2Code.BalanceAmount, 2)}}元
            </span>
          </p>
          <p>
            <span>
              <i>￥</i>
              {{numToFixed(curPayInfo2Code.PayOnDelivery, 2)}}元
            </span>
          </p>
          <p>
            <span>
              <i>￥</i>
              {{numToFixed(curPayInfo2Code.TotalAmount, 2)}}元
            </span>
          </p>
        </div>
      </footer>
    </section>
    <LoadingComp v-else />
    <span slot="footer" class="dialog-footer">
      <el-button @click.native="handleClose()">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  mapState, mapMutations, mapActions,
} from 'vuex';
import LoadingComp from '@/components/common/LoadingComp.vue';

export default {
  props: {
    needClear: {
      type: Boolean,
      default: true,
    },
    pageType: {
      type: String,
      default: 'placeOrderPage',
    },
  },
  components: {
    LoadingComp,
  },
  data() {
    return {
      dialogVisible: false,
      showImg: false,
      timer: null,
      count: 0,
    };
  },
  computed: {
    ...mapState('Quotation', ['isShow2PayDialog', 'curPayInfo2Code']),
    imgSrc() {
      if (!this.curPayInfo2Code || !this.curPayInfo2Code.PayWay || !this.curPayInfo2Code.PayWay.AllinPay) return '';
      return this.curPayInfo2Code.PayWay.AllinPay;
    },
    listener4GetPayStatus() { // 监听数据变化以启动支付状态轮询
      return this.showImg && this.isShow2PayDialog;
    },
  },
  methods: {
    ...mapActions('Quotation', ['getPayResult']),
    // eslint-disable-next-line max-len
    ...mapMutations('Quotation', ['setIsShow2PayDialog', 'setCurPayInfo2Code', 'setPaySuccessOrderDataStatus']),
    handleClose() {
      // 关闭前清除img元素src地址
      if (this.needClear) this.showImg = false;
      if (this.needClear) this.setCurPayInfo2Code(null);
      this.setIsShow2PayDialog(false);
      clearTimeout(this.timer);
      this.timer = null;
    },
    onLoad() {
      // 图片下载完成
      this.showImg = true;
      // if (this.isShow2PayDialog) this.getPayStatus();
    },
    onError(e) {
      // 图片下载出错
      if (e.type === 'error' && this.isShow2PayDialog) {
        const msg = this.$route.name === 'unpayOrderSubmit' ? '[ 获取二维码失败，请刷新重试 ]' : '[ 抱歉，获取二维码失败，订单已生成，请到未付款单中查看及支付 ]';
        this.messageBox.failSingleError({
          msg,
          title: '图片获取失败',
        });
      }
    },
    handleSuccessPay() {
      // 轮询到付款成功后的处理函数
      if (this.pageType === 'placeOrderPage') this.setPaySuccessOrderDataStatus();
      else if (this.pageType === 'shoppingCarPage' || this.pageType === 'unpayPage') {
        if (this.pageType === 'shoppingCarPage') this.$router.push('/shopping/car');
        else if (this.pageType === 'unpayPage') this.$router.push('/unpay/list');
        this.$store.commit('shoppingCar/setCurShoppingCarDetailData', null);
        this.$store.commit('shoppingCar/setCurShoppingCarDataBeforeFirstPlace', null);
        this.$store.commit('shoppingCar/setCurShoppingCarData4FirstPlace', null);
      }
      this.$store.dispatch('common/getCustomerFundBalance');
      this.setCurPayInfo2Code(null);
      this.handleClose();
    },
    async getPayStatus() {
      // 轮询付款状态
      if (!this.isShow2PayDialog) return;
      let key = false;
      await this.getPayResult((status) => {
        if (status === 'True') key = true;
      });
      if (key) {
        this.messageBox.successSingle({
          title: '付款成功',
          successFunc: () => this.handleSuccessPay(),
        });
      } else {
        this.timer = setTimeout(() => {
          this.getPayStatus();
        }, 2800);
      }
    },
    numToFixed(num, count) {
      // 转换数字格式
      if (!num && num !== 0) return '';
      return num.toFixed(count);
    },
  },
  watch: {
    listener4GetPayStatus(newVal) {
      if (newVal) this.getPayStatus();
    },
  },
  mounted() {
    this.setCurPayInfo2Code(null);
  },
};
</script>

<style lang='scss'>
// @import "@/assets/css/common/var.scss";
.dialog-to-pay-box {
  height: 550px;
  box-sizing: border-box;
  // padding: 5px 0;
  text-align: center;
  border-radius: 5px;
  position: relative;
  .el-dialog__headerbtn {
    top: 8px;
    right: 15px;
    .el-dialog__close {
      // color: $--color-text-secondary;
      font-size: 20px;
      font-weight: 100;
    }
  }
  .el-dialog__body {
    height: 307px;
    padding: 0;
    section {
      text-align: center;
      header {
        font-size: 12px;
        // .hasTimeout {
        //   line-height: 95px;
        //   color: $--color-text-table-pending;
        //   width: 100px;
        //   border: 1px solid $--border-color-light;
        //   border-radius: 3px;
        //   margin: 0 auto;
        //   background-color: rgb(238, 238, 238);
        // }
        div.hasTimeout {
          margin: 15px auto;
        }
        .img-box {
          width: 245px;
          height: 245px;
          margin: 0 auto;
          overflow: hidden;
          > img {
            height: 100%;
            width: 100%;
            object-fit: cover;
          }
          .payImg-loading-box {
            line-height: 36px;
            color: #aaa;
            white-space: normal;
            margin: 20px;
            height: 205px;
            width: 205px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            padding-top: 80px\9\0;
            background-color: rgb(238, 238, 238);
            border-radius: 5px;
            i:first-of-type {
              font-size: 15px;
            }
          }
        }
        > p:first-of-type {
          // color: $--color-text-regular;
          padding-top: 5px;
          padding-bottom: 10px;
        }
        > p:last-of-type {
          // color: $--color-text-table-time;
          padding-bottom: 30px;
        }
      }
      footer.mp-pay-price-wrap {
        display: flex;
        justify-content: center;
        font-size: 12px;
        > .left {
          width: 6em;
          text-align: right;
          margin-right: 10px;
          margin-left: -10px;
          display: inline-block\0;
        }
        > .right {
          margin-top: -3px;
          text-align: right;
          display: inline-block\0;
        }
        p {
          font-size: 12px;
          // color: $--color-text-regular;
          width: 100%;
          padding-bottom: 20px;
          .should-pay {
            font-size: 16px;
            // color: $--color-pink;
            font-weight: 600;
            i {
              width: 14px;
              display: inline-block;
            }
          }
          span {
            white-space: nowrap;
          }
          & + p {
            padding-bottom: 15px;
          }
        }
      }
    }
    .hasTimeout,
    .payImg-loading-box {
      line-height: 36px;
      color: #aaa;
      white-space: normal;
      margin: 20px;
      height: 205px;
      width: 205px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: rgb(238, 238, 238);
      border-radius: 5px;
      i:first-of-type {
        font-size: 15px;
      }
    }
  }

  .el-dialog__footer {
    position: absolute;
    bottom: 4px;
    width: 100%;
    .dialog-footer {
      > button {
        width: 100px;
        height: 30px;
        margin: 0 auto;
        border-radius: 2px;
        padding: 0;
        border-radius: 4px;
        color: #428dfa;
        border-color: #428dfa;
      }
    }
  }
}
</style>
