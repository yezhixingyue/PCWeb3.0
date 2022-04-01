<template>
  <div class="mp-common-comps-order-detail-price-box-comp-wrap">
    <div>
      <span class="label">原价：</span>
      <span class="text">{{OriginalPrice | formatNumber}}元</span>
    </div>
    <div>
      <span class="label w">成交价：</span>
      <span class="text is-origin is-font-15 is-bold">{{FinalPrice | formatNumber}}<i class="is-font-14">元</i></span>
    </div>
    <div>
      <span class="label">已付：</span>
      <span class="text" :class="{paid: PaidBeanAmount > 0}">{{havePaid | formatNumber}}元</span>
      <span class="remark" v-if="PaidBeanAmount > 0">（ <i class="freight">印豆抵扣{{PaidBeanAmount | formatNumber}}元</i> ）</span>
    </div>
    <div>
      <span class="label">退款：</span>
      <span class="text">{{Refund | formatNumber}}元</span>
    </div>
    <!-- <div v-if="PromoteAmount || PromoteAmount > 0">
      <span class="label">活动：</span>
      <span class="text" :class="{'is-pink': !!PromoteAmount}">{{ PromoteAmount ? `${PromoteAmount > 0 ? '-' : ''}${Math.abs(PromoteAmount)}` : 0}}元</span>
    </div> -->
    <div v-if="!CouponAmount || CouponAmount > 0">
      <span class="label w">优惠券：</span>
      <span class="text" :class="{'is-pink': !!CouponAmount}">{{ CouponAmount ? `${CouponAmount > 0 ? '-' : ''}${Math.abs(CouponAmount)}` : 0}}元</span>
    </div>
    <div>
      <span class="label">未付：</span>
      <span class="text">{{Unpaid | formatNumber}}元</span>
    </div>
    <div v-if="Reduced && Reduced > 0">
      <span class="label">售后优惠：</span>
      <span class="text">{{Reduced | formatNumber}}元</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderDetailPriceBox',
  props: {
    OrderData: {
      type: Object,
      default: null,
    },
  },
  filters: {
    formatNumber(num) {
      return +((+num).toFixed(2));
    },
  },
  computed: {
    OriginalPrice() {
      return this.OrderData ? this.OrderData.Funds.OriginalPrice : 0;
    },
    FinalPrice() {
      return this.OrderData ? this.OrderData.Funds.FinalPrice : 0;
    },
    havePaid() {
      return this.OrderData ? this.OrderData.Funds.HavePaid : 0;
    },
    PaidBeanAmount() {
      return this.OrderData ? this.OrderData.Funds.PaidBeanAmount : 0;
    },
    Refund() {
      return this.OrderData ? this.OrderData.Funds.Refund : 0;
    },
    Unpaid() {
      return this.OrderData ? this.OrderData.Funds.Unpaid : 0;
    },
    CouponAmount() {
      return this.OrderData ? this.OrderData.Funds.CouponAmount : 0;
    },
    Reduced() {
      return this.OrderData ? this.OrderData.Funds.Reduced : 0;
    },
    // PromoteAmount() {
    //   return +(this.OriginalPrice - this.FinalPrice - this.CouponAmount).toFixed(2);
    // },
  },
};
</script>
<style lang='scss'>
.mp-common-comps-order-detail-price-box-comp-wrap {
  padding-top: 18px;
  box-sizing: border-box;
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  align-content: center;
  height: 90px !important;
  border-top: 1px dashed #eee;
  > div {
    display: inline-block;
    line-height: 24px;
    margin-right: 12px;
    > span.label {
      color: #585858;
      float: left;
      margin-right: 2px;
      font-size: 12px;
      min-width: 3em;
      text-align: right;
      &.w {
        width: 56px;
        text-align: left;
      }
    }
    > span.text {
      color: #585858;
      overflow: hidden;
      min-height: 22px;
      min-width: 60px;
      display: inline-block;
      &.paid {
        min-width: 24px;
      }
    }
    > span.remark {
      font-size: 12px;
      display: inline;
      vertical-align: top;
      > i.freight {
        margin-right: 0px;
        color: #989898;
      }
    }
  }
}
</style>
