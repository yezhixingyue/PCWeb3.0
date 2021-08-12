<template>
  <section class="mp-pc-common-page-header-recharge-comp-wrap">
    <header class="float">
      <span class="blue-v-line is-bold is-black">在线充值</span>
      <ul>
        <li :class="curStep===0?'active':''">
          <span class="iconfont icon-diyibu"></span>
          <span class="text">1. 填写充值金额</span>
        </li>
        <li class="retract-l" :class="curStep===1?'active':''">
          <span class="iconfont icon-dierbu"></span>
          <span class="text">2. 在线充值</span>
        </li>
        <li class="retract-l" :class="curStep===2?'active':''">
          <span class="iconfont icon-disanbu"></span>
          <span class="text">3. 充值完成</span>
        </li>
      </ul>
    </header>
    <ul class="content">
      <li class="step-one" v-if="curStep===0">
        <div class="left">
          <p>
            <i class="iconfont icon-yue"></i>
            <span>当前余额：</span>
          </p>
          <p class="is-pink"><i class="is-bold is-pink is-font-22">{{customerBalance}}</i>元</p>
        </div>
        <div class="right">
          <span>充值金额：</span>
          <el-input placeholder="请输入充值金额" v-model="reChargeVal" @keyup.enter.native="handleRecharge" /><i>元</i>
          <el-button type="danger" @click="handleRecharge">立即充值</el-button>
          <!-- <p v-show="errInfo" class="is-pink">{{errInfo}}</p> -->
        </div>
      </li>
      <li v-if="curStep===1" class="step-two">
        <span @click="onReturnClick"><i class="el-icon-arrow-left is-font-22 is-cancel"></i> 返回填写充值金额</span>
        <el-image :src='codeSrc' @load="onImgLoad" @error="onError"></el-image>
        <p>
          <span class="gray is-font-12">请使用微信或支付宝扫码支付 </span>
          <span class="is-font-16"
           > 扫码支付：<i class="is-font-18 is-pink"> ¥<em class="is-font-26 is-bold"> {{Amount}}</em></i></span>
        </p>
      </li>
      <li v-if="curStep===2" class="step-three">
        <p>
          <span class="iconfont icon-wancheng is-success"></span>
          <span>充值完成</span>
        </p>
      </li>
      <li class="up-box" @click="handleCloseClick">
        <span class="iconfont icon-xiangshangshousuo"></span>
      </li>
    </ul>
  </section>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    showRechange: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState('common', ['customerBalance']),
    reChargeVal: {
      get() {
        return this.reCharge;
      },
      set(newVal) {
        const _str = newVal.replace(/^\./, '0.').replace(/[^\d.]/g, '');
        const _arr = _str.split('');
        let pointLen = 0;
        let pointIndex = 0;
        const _list = _arr.map((it, i) => {
          if (it === '.') {
            pointLen += 1;
            pointIndex = i;
            if (pointLen === 1) return it;
            return null;
          }
          if (pointIndex === 0 || pointIndex >= i - 2) return it;
          return null;
        }).filter(it => it);
        this.reCharge = _list.join('');
      },
    },
  },
  data() {
    return {
      reCharge: '',
      curStep: 0,
      curPayInfo2Code: null,
      codeSrc: '',
      timer: null,
      Amount: 0,
      isShowTips: false, // 是否在弹框显示错误信息
    };
  },
  methods: {
    async handleRecharge() {
      if (this.isShowTips) return;
      if (!this.reCharge) {
        this.isShowTips = true;
        this.messageBox.failSingleError({
          title: '校验错误',
          msg: '请输入充值金额',
          beforeClose: () => { this.isShowTips = false; },
        });
        return;
      }
      if (+this.reCharge === 0) {
        this.isShowTips = true;
        this.messageBox.failSingleError({
          title: '校验错误',
          msg: '充值金额必须大于0',
          beforeClose: () => { this.isShowTips = false; },
        });
        return;
      }
      const _num = +this.reCharge;
      this.Amount = _num.toFixed(2);
      if (`${this.Amount}` === 'NaN') {
        this.isShowTips = true;
        this.messageBox.failSingleError({
          title: '校验错误',
          msg: '金额不正确',
          beforeClose: () => { this.isShowTips = false; },
        });
        return;
      }
      const res = await this.api.getCustomerRecharge({ Amount: this.Amount });
      if (res.data.Status === 1000) {
        this.curStep = 1;
        this.codeSrc = res.data.Data.PayWay.AllinPay;
        this.curPayInfo2Code = res.data.Data;
      }
    },
    initData() {
      this.codeSrc = '';
      this.curStep = 0;
      this.reCharge = '';
      this.curPayInfo2Code = null;
      clearTimeout(this.timer);
      this.timer = null;
    },
    onReturnClick() {
      this.initData();
    },
    onImgLoad() {
      if (this.showRechange) this.getPayStatus();
    },
    onError() {
      // 图片下载出错
      this.messageBox.failSingleError({
        msg: '[ 获取二维码失败，请检查网络或稍后再试 ]',
        title: '图片获取失败',
      });
    },
    async getPayStatus() {
      // 轮询付款状态
      // // console.log(object)
      if (!this.showRechange) return;
      let key = false;
      await this.getPayResult((status) => {
        if (status === 'True') key = true;
      });
      if (key) {
        this.initData();
        this.curStep = 2;
        this.$store.dispatch('common/getCustomerFundBalance');
      } else {
        this.timer = setTimeout(() => {
          this.getPayStatus();
        }, 2800);
      }
    },
    async getPayResult(cb) {
      if (!this.curPayInfo2Code || !this.curPayInfo2Code.PayCode) return;
      const res = await this.api.getPayResult(this.curPayInfo2Code.PayCode, 11);
      if (res.data.Status === 1000) cb(res.data.Data);
    },
    handleCloseClick() {
      this.$emit('handleClose');
    },
    handleBodyClick() {
      // // console.log('handleBodyClick', e.target);
      this.handleCloseClick();
    },
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    showRechange(newVal) {
      // if (newVal && this.curStep === 1) this.getPayStatus();
      this.initData();
    },
  },
  mounted() {
    this.oHeader = document.querySelector('.mp-pc-common-page-header-common-wrap > header');
    this.oFooter = document.querySelector('.mp-pc-common-page-header-common-wrap > footer');
    // // console.log(this.oHeader, 'oBody mounted');
    this.oHeader.addEventListener('click', this.handleBodyClick);
    this.oFooter.addEventListener('click', this.handleBodyClick);
  },
  destroyed() {
    // // console.log(this.oHeader, 'oBody destroyed');
    this.oHeader.removeEventListener('click', this.handleBodyClick);
    this.oFooter.removeEventListener('click', this.handleBodyClick);
  },
};
</script>

<style lang='scss'>
.mp-pc-common-page-header-recharge-comp-wrap {
  margin: 0 auto;
  width: 1200px;
  border-top: 1px dashed #eee;
  > header {
    height: 50px;
    padding-top: 28px;
    border-bottom: 1px solid #eee;
    text-align:justify;
    > ul {
      // display: inline-block;
      float: right;
      > li {
        display: inline-block;
        position: relative;
        &.retract-l {
          margin-left: -6px;
          > .text {
            left: 14px;
          }
        }
        > .iconfont {
          font-size: 25px;
          color: #eee;
          transition: 0.2s;
        }
        > .text {
          position: absolute;
          width: 88px;
          color: #aaa;
          left: 12px;
          font-size: 12px;
          line-height: 24px;
          text-align: center;
          transition: 0.2s;
        }
        &.active {
          > .iconfont {
            color: #428dfa;
          }
          > .text {
            color: #fff;
          }
        }
      }
    }
  }
  > .content {
    position: relative;
    width: 1200px;
    height: 258px;
    > li {
      &.step-one {
        > .left {
          margin-top: 30px;
          display: inline-block;
          width: 310px;
          height: 127px;
          border-right: 1px dashed #eee;
          padding-top: 75px;
          padding-right: 50px;
          > p {
            text-align: right;
            > i.iconfont {
              color: rgb(210, 210, 210);
              margin-right: 10px;
              font-size: 18px;
            }
            &.is-pink {
              margin-top: 20px;
            }
          }
        }
        > .right {
          display: inline-block;
          width: 820px;
          vertical-align: top;
          margin-top: 116px;
          > span {
            margin-left: 48px;
            margin-right: 5px;
          }
          > .el-input {
            width: 300px;
            > input {
              height: 35px;
              line-height: 33px\0;
            }
          }
          > i {
            color: #aaa;
            margin: 0 48px 0 8px;
          }
          > button {
            width: 130px;
          }
        }
      }
      &.step-two {
        position: relative;
        width: 1200px;
        height: 258px;
        text-align: center;
        > span {
          position: absolute;
          left: 0;
          top: 10px;
          color: #888;
          > i {
            vertical-align: -12%;
          }
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 3px;
          &:hover {
            color: #428dfa;
            > i {
              color: #428dfa !important;
            }
          }
        }
        > .el-image {
          width: 230px;
          height: 230px;
        }
        > p {
          position: absolute;
          bottom: -2px;
          left: 450px;
          left: 50%;
          transform: translateX(-50%);
          > span + span {
            margin-left: 12px;
          }
        }
      }
      &.step-three {
        text-align: center;
        > p {
          padding-top: 110px;
          > span {
            &.iconfont {
              font-size: 30px;
              margin-right: 14px;
              vertical-align: -10%;
            }
            font-size: 18px;
          }
        }
      }
      &.up-box {
        position: absolute;
        width: 15px;
        height: 15px;
        padding: 10px;
        cursor: pointer;
        color: #989898;
        font-size: 15px;
        right: 0;
        bottom: -10px;
        border-radius: 50%;
        &:hover {
          color: #585858;
          background-color: #eee;
        }
        &:active {
          color: #333;
          background-color: #ccc;
        }
      }
    }
  }
}
</style>
