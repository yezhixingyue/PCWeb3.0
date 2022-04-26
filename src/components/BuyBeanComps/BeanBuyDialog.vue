<template>
  <CommonDialogComp
    width='700px'
    dangerText='立即付款'
    showDanger
    class="mp-pc-bean-buy-list-page-dialog-comp-wrap"
    :showSubmit='false'
    :visible.sync="visible"
    :disabled="loading"
    title='充值印豆'
    @danger="onSubmit"
    @cancle="onCancle"
    @open="onOpen">
    <!-- 弹窗图标 -->
    <!-- <template slot="title">
      <img src="@/assets/images/bean-y.png" alt="">
      <span>充值印豆</span>
    </template> -->
    <div v-if="curBuyItemData" class="content" v-loading='loading'>
      <!-- 信息 -->
      <p class="info">
        <label>每份数量：</label>
        <span>{{curBuyItemData.BeanNumber}}个</span>
        <label>单价：</label>
        <span>{{curBuyItemData.Price}}元</span>
      </p>
      <!-- 购买数量输入 -->
      <div class="num-box">
        <span>充值</span>
        <NumberInput v-model.number="buyNumber" :max='canBuyMaxCount' :min="1" />
        <i>份</i>
        <span class="remark" v-if="hasTodayBuyMaxNumber">( 您今天还可以充值 {{canBuyMaxCount}} 份 )</span>
        <span class="remark" v-else>( 本次可充值 {{canBuyMaxCount}} 份 )</span>
      </div>
      <div class="price">
        <span>价格：</span>
        <span class="is-pink is-font-18" v-show="canBuyMaxCount >= buyNumber">{{totalPrice}}</span>
        <span class="is-pink" v-show="canBuyMaxCount >= buyNumber">元</span>
        <span class="is-pink is-font-18" v-if="canBuyMaxCount < buyNumber">已超出最大充值次数</span>
      </div>
      <div class="balance">
        <el-checkbox v-model="UseBalance" :disabled='UseBalanceDisabled'>使用余额支付</el-checkbox>
      </div>
      <!-- 提示 -->
      <div class="tips-box">
        <span><i class="el-icon-warning"></i>注意：</span>
        <div>
          <span>支付尾款时，不能使用印豆抵扣；</span>
          <span v-if="PrintBeanExchangeNumber">{{PrintBeanExchangeNumber}}个印豆可抵扣1元人民币。</span>
        </div>
      </div>
    </div>
    <template slot="foot-tip">
    </template>
  </CommonDialogComp>
</template>

<script>
import { mapState } from 'vuex';
import CommonDialogComp from '@/packages/CommonDialogComp';
import NumberInput from '../common/NumberInput.vue';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    curBuyItemData: {
      type: Object,
      default: null,
    },
    PrintBeanExchangeNumber: {
      type: Number,
      default: 0,
    },
  },
  components: {
    CommonDialogComp,
    NumberInput,
  },
  data() {
    return {
      buyNumber: 1,
      UseBalance: false,
      loading: false,
    };
  },
  computed: {
    ...mapState('common', ['customerBalance']),
    hasTodayBuyMaxNumber() {
      return this.curBuyItemData && typeof this.curBuyItemData.TodayBuyMaxNumber === 'number';
    },
    canBuyMaxCount() { // 当日可用购买的最大数量
      if (this.hasTodayBuyMaxNumber) {
        return this.curBuyItemData.TodayBuyMaxNumber;
      }
      return 10000;
    },
    totalPrice() {
      if (!this.curBuyItemData) return 0;
      const num = +(this.buyNumber * this.curBuyItemData.Price);
      return +(num.toFixed(2));
    },
    UseBalanceDisabled() {
      return this.totalPrice > this.customerBalance;
    },
  },
  methods: {
    async onOpen() {
      this.buyNumber = 1;
      this.UseBalance = false;
      this.loading = true;
      await this.$store.dispatch('common/getCustomerFundBalance');
      this.loading = false;
    },
    checker() {
      if (this.buyNumber === '') {
        this.messageBox.failSingleError({ title: '充值失败', msg: '请输入充值份数' });
        return false;
      }
      if (!this.utils.getValueIsOrNotNumber(this.buyNumber, true)) {
        this.messageBox.failSingleError({ title: '充值失败', msg: '充值份数不正确，应为整数数字类型' });
        return false;
      }
      if (this.buyNumber <= 0) {
        this.messageBox.failSingleError({ title: '充值失败', msg: '充值份数不正确，最少应充值1份' });
        return false;
      }
      if (this.buyNumber > this.canBuyMaxCount) {
        const msg = `已超出最大可充值份数，${this.hasTodayBuyMaxNumber ? '最多可充值' : '本次最多可充值'} ${this.canBuyMaxCount} 份`;
        this.messageBox.failSingleError({ title: '充值失败', msg });
        return false;
      }
      return true;
    },
    onSubmit() {
      if (!this.curBuyItemData) return;
      if (this.checker()) {
        const temp = {
          Number: this.buyNumber,
          ID: this.curBuyItemData.ID,
          UseBalance: this.UseBalanceDisabled ? false : this.UseBalance,
        };
        this.$emit('submit', temp);
      }
    },
    onCancle() {
      this.$emit('update:visible', false);
    },
  },
  watch: {
    UseBalanceDisabled(newVal, oldVal) {
      if (newVal && !oldVal && this.UseBalance) {
        this.UseBalance = false;
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-pc-bean-buy-list-page-dialog-comp-wrap {
  .el-dialog__body {
    padding-bottom: 15px;
    > .content {
      text-align: left;
      color: #585858;
      padding-top: 15px;
      padding-left: 150px;
      > p.info {
        > span {
          margin-right: 18px;
          &:last-of-type {
            margin-right: 0;
          }
        }
      }
      > div.num-box {
        padding: 20px 0;
        padding-top: 24px;
        > .mp-pc-common-comps-number-input-comp-wrap {
          width: 150px;
          margin-left: 13px;
        }
        > i {
          color: #aaa;
          margin-left: 10px;
        }
        > .remark {
          font-size: 13px;
          color: #989898;
          margin-left: 20px;
        }
      }
      > .price {
        // display: inline-block;
        // margin-left: 16px;
        min-width: 120px;
        margin-bottom: 20px;
        line-height: 28px;
      }
      > div.tips-box {
        margin-top: 45px;
        text-align: left;
        // margin-left: 30px;
        width: 450px;
        letter-spacing:0.5px;
        height: unset;
        height: auto;
        padding: 2px 0 3px 16px;
        > div {
          display: inline-block;
          vertical-align: top;
          line-height: 20px;
          padding: 3px;
          > span {
            display: block;
            &:last-of-type {
              text-indent: -1px;
            }
          }
        }
      }
      .balance {
        // margin-top: -13px;
        padding-bottom: 20px;
        .el-checkbox__label {
          font-size: 13px;
        }
      }
    }
  }
}
</style>
