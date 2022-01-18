<template>
  <ul :class="{'place-price-result': true, showExpressCost: showExpressCost, noPeriod: !ProducePeriod}" v-if="ProductQuotationResult">
    <!-- 价格信息 -->
    <li class="price">
      <!-- 价格 -->
      <div>
        <template v-if="!showExpressCost">{{ ProductQuotationResult.OriginalCost > Cost ? "官网上传优惠价：" : "成交价："}}</template>
        <template v-else> 总价：</template>
        <i class="is-pink is-bold is-font-20">{{ +Cost.toFixed(2) }}</i>
        <i class="is-pink is-font-13" style="margin-right: 8px; margin-left:3px">元</i>
        <span
          class="is-font-13 is-gray"
          style="margin-right:5px"
          v-if="
            (ProductQuotationResult.ExpressCost || ProductQuotationResult.ExpressCost === 0)
            && showExpressCost
          "
          >(<i class="is-font-12">含运费：{{ ProductQuotationResult.ExpressCost }}元</i>)</span
        >
      </div>
      <!-- 其余详情信息 -->
      <div
        class="show-info"
        v-if="
          ProductQuotationResult.OriginalCost > Cost ||
          selectedCoupon ||
          ProducePeriod ||
          showExpressCost ||
          ProductQuotationResult.Weight
        "
      >
        <span style="margin-right: 2px">(</span>
        <span>原价：<i>{{ ProductQuotationResult.OriginalCost }}元</i></span>
        <span v-if="promotePrice > 0">活动：<i class="is-pink">{{ "-" + promotePrice }}元</i></span>
        <span v-if="coupon >= 0">
          <template>优惠券：</template>
          <i v-if="selectedCoupon && coupon" class="is-pink">{{`${coupon > 0 ? '-' : ''}${Math.abs(coupon)}`}}元</i>
          <i v-else-if="!selectedCoupon || coupon === 0">{{ coupon }}元</i>
        </span>
        <span v-if="ProductQuotationResult.Weight > 0">
          <template>重量：</template>
          <i>{{ ProductQuotationResult.Weight }}kg</i>
        </span>
        <span class="mg-left"> )</span>
      </div>
    </li>
    <!-- 工期信息 -->
    <li class="ProducePeriod" v-if="ProducePeriod">
      <div class="is-pink is-font-13 is-bold">
        <span style="margin-right:0px">{{ ProducePeriod | getPayTime }}，</span>
        <span>{{ ProducePeriod | getDoneTime }}</span>
      </div>
      <div v-if="!ProducePeriod.IncludeDiliveryTime || ProducePeriod.Tips" class="tip">
        <span class="is-pink is-font-12 perod-tip" style="margin-right:0;" :title="ProducePeriod.Tips || ''">
          <template>(</template>
          <template v-if="!ProducePeriod.IncludeDiliveryTime">配送时间视快递物流速度</template>
          <template v-if="!ProducePeriod.IncludeDiliveryTime && ProducePeriod.Tips">，</template>
          <template v-if="ProducePeriod.Tips" >{{ProducePeriod.Tips}}</template>
          <template>)</template>
        </span>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  props: ['ProductQuotationResult', 'selectedCoupon', 'showExpressCost'],
  computed: {
    Cost() {
      if (!this.ProductQuotationResult) return '';
      // eslint-disable-next-line max-len
      const _cost = this.showExpressCost
        ? this.ProductQuotationResult.CurrentCost
          + this.ProductQuotationResult.ExpressCost
        : this.ProductQuotationResult.CurrentCost;
      if (!this.selectedCoupon) return _cost;
      if (
        this.ProductQuotationResult.CurrentCost
        >= this.selectedCoupon.MinPayAmount
      ) {
        const num = +(
          this.ProductQuotationResult.CurrentCost - this.selectedCoupon.Amount
        ).toFixed(2);
        return num > 0 ? num : 0;
      }
      return _cost;
    },
    // 活动价格
    promotePrice() {
      if (!this.ProductQuotationResult) return '';
      return +(
        this.ProductQuotationResult.OriginalCost
        - this.ProductQuotationResult.CurrentCost
      ).toFixed(2);
    },
    coupon() {
      if (!this.ProductQuotationResult) return 0;
      if (!this.selectedCoupon) return 0;
      if (
        this.ProductQuotationResult.CurrentCost
        >= this.selectedCoupon.MinPayAmount
      ) {
        return this.selectedCoupon.Amount;
      }
      return 0;
    },
    couponConditionText() {
      if (!this.ProductQuotationResult) return '( 点击 计算价格 查看是否可使用 )';
      if (!this.coupon) return '(尚未满足使用条件)';
      return '';
    },
    ProducePeriod() {
      if (this.ProductQuotationResult) return this.ProductQuotationResult.ProducePeriod;
      return null;
    },
  },
};
</script>

<style lang='scss' scoped>
ul.place-price-result {
  display: inline-block;
  // margin-right: 6px;
  line-height: 0;
  white-space: normal;
  // height: 72px;
  width: 555px;
  vertical-align: top;
  &.showExpressCost {
    width: 520px;
  }
  // &.noPeriod {
  //   > li {
  //     min-height: 40px;
  //   }
  // }
  > li {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    > div {
      display: inline-block;
      white-space: normal;
      line-height: 24px;
      color: #888;
      > span {
        margin-right: 10px;
        &.mg-left {
          margin-left: -8px;
          margin-right: 2px;
        }
      }
      &.show-info {
        font-size: 13px;
        flex-wrap: nowrap !important;
        > span {
          white-space: nowrap;
        }
      }
    }
    &.ProducePeriod {
      > div {
        line-height: 20px;
        color: #ff3769;
        max-width: 100%;
        text-overflow: ellipsis;
        > span {
          // display: inline-block;
          // text-overflow: ellipsis;
          // overflow: hidden;
          // vertical-align: middle;
          // max-width: 100%;
          line-height: 18px;
          white-space: normal;
        }
      }
    }
    &.price {
      // min-height: 36px;
      padding-top: 5px;
      padding-bottom: 8px;
    }
  }
  .perod-tip {
    white-space: nowrap;
    max-width: 568px;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 14px;
  }
}
</style>
