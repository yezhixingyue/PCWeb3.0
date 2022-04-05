<template>
  <div class="mp-common-payment-price-display-comp-wrap" v-if="PreCreateData">
    <div class="price-box">
      <div class="price-left">
        <p class="b">在线支付：</p>
        <p class="gray">货到付款：</p>
        <p class="final-price gray">当前可用余额：</p>
        <!-- <p class="gray" v-if="FundBeanNumber > 0">使用印豆：</p>
        <p class="gray" v-if="MinimumCost !== FullPayout">支付方式：</p> -->
      </div>
      <div class="price-right">
        <p class="is-pink is-bold">¥ <i class="is-font-16">{{onLineAmount}}</i><i class="is-font-13">元</i></p>
        <p class="is-pink">¥ {{PayOnDelivery}}<i class="is-font-12">元</i></p>
        <p class="last">¥{{FundBalance}}<i class="is-font-12">元</i></p>
        <!-- <p v-if="FundBeanNumber > 0" class="bean check">
          <el-checkbox v-model="UseBeanChecked">使用{{FundBeanNumber}}个印豆抵扣{{deductAmountFromBeanNumber}}元</el-checkbox>
        </p>
        <p v-if="MinimumCost !== FullPayout" class="check">
          <el-checkbox v-model="PayInFull">在线支付全款</el-checkbox>
        </p> -->
      </div>
    </div>
    <p v-if="MinimumCost !== FullPayout" class="check">
      <label class="t" @click="PayInFull = !PayInFull">支付全款</label>
      <el-checkbox v-model="PayInFull" />
    </p>
    <p v-if="FundBeanNumber > 0" class="bean check">
      <label class="t" @click="UseBeanChecked = !UseBeanChecked">使用 {{FundBeanNumber}} 个印豆抵扣 {{deductAmountFromBeanNumber}} 元</label>
      <el-checkbox v-model="UseBeanChecked" />
    </p>
  </div>
</template>

<script>
export default {
  name: 'PaymentPriceDisplayComp',
  props: {
    PreCreateData: {
      type: Object,
      default: null,
    },
    value: {
      type: Boolean,
      default: false,
    },
    UsePrintBean: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    PayInFull: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
    MinimumCost() {
      return this.PreCreateData ? +(this.PreCreateData.MinimumCost.toFixed(2)) : '';
    },
    FullPayout() {
      return this.PreCreateData ? +(this.PreCreateData.FullPayout.toFixed(2)) : '';
    },
    NeedPaidAmount() {
      if (!this.value) return this.MinimumCost;
      return this.FullPayout;
    },
    onLineAmount() {
      const BeanAmount = this.UsePrintBean ? this.deductAmountFromBeanNumber : 0;
      return +((this.NeedPaidAmount - BeanAmount).toFixed(2));
    },
    PayOnDelivery() {
      const price = this.PreCreateData ? +(this.PreCreateData.PayOnDelivery.toFixed(2)) : '';
      if (!this.value) return price;
      return 0;
    },
    FundBalance() {
      return this.PreCreateData ? +(this.PreCreateData.FundBalance.toFixed(2)) : '';
    },
    FundBeanNumber() { // 印豆数量
      const total = this.PreCreateData && this.PreCreateData.FundBeanNumber ? this.PreCreateData.FundBeanNumber : 0;
      const rate = this.PreCreateData && this.PreCreateData.PrintBeanExchangeRate ? this.PreCreateData.PrintBeanExchangeRate : 0;
      if (total && rate) {
        const totalAmount = total * rate;
        if (totalAmount <= this.NeedPaidAmount) {
          if ((totalAmount * 100) % 1 === 0) {
            return total;
          }
          return Math.round((Math.floor(totalAmount * 100) / 100) / rate);
        }
        return Math.round(this.NeedPaidAmount / rate);
      }
      return 0;
    },
    deductAmountFromBeanNumber() { // 印豆可抵扣金额
      if (this.FundBeanNumber > 0 && this.PreCreateData && typeof this.PreCreateData.PrintBeanExchangeRate === 'number') {
        return +((this.FundBeanNumber * this.PreCreateData.PrintBeanExchangeRate).toFixed(2));
      }
      return 0;
    },
    UseBeanChecked: {
      get() {
        return this.UsePrintBean;
      },
      set(val) {
        this.$emit('update:UsePrintBean', val);
      },
    },
  },
};
</script>
<style lang='scss'>
.mp-common-payment-price-display-comp-wrap {
  // height: 180px;
  text-align: right;
  padding-bottom: 8px;
  > .price-box {
    // height: 100%;
    overflow: hidden;
    display: inline-block;
    > div {
      padding: 10px 0;
      padding-top: 5px;
      > p {
        line-height: 26px;
        font-size: 12px;
        &.final-price {
          margin-bottom: 4px;
        }
        &.check {
          text-align: left;
          &.bean {
            .el-checkbox__label {
              font-size: 12px;
            }
          }
        }
        &.b {
          color: #444;
          font-size: 14px;
          margin-right: -2px;
        }
      }
      &.price-left {
        float: left;
        margin-right: 6px;
        color: #888;
      }
      &.price-right {
        float: right;
        > p {
          min-width: 100px;
          font-size: 13px;
          &.last {
            margin-bottom: 4px;
          }
          &.is-pink {
            font-size: 14px;
          }
        }
      }
    }
  }
  > .check {
    font-size: 12px;
    color: #444;
    margin-bottom: 6px;
    .el-checkbox {
      margin-left: 8px;
    }
    > .t {
      user-select: none;
      cursor: pointer;
    }
  }
}
</style>
