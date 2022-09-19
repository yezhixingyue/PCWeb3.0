<template>
  <ul :class="{'place-price-result': true, showExpressCost: showExpressCost, noPeriod: !ProducePeriod}" v-if="ProductQuotationResult">
    <!-- 价格信息 -->
    <li class="price">
      <!-- 价格 -->
      <div v-if="!isPrice">
        <template v-if="!showExpressCost">{{ ProductQuotationResult.OriginalCost > ProductPrice ? "官网上传优惠价：" : "成交价："}}</template>
        <template v-else> 总价：</template>
        <i class="is-pink is-bold is-font-20">{{ (showExpressCost ? Cost : ProductPrice) | formatNumber}}</i>
        <i class="is-pink is-font-13" style="margin-right: 8px; margin-left:3px">元</i>
        <span
          class="is-font-13 is-gray"
          style="margin-right:5px"
          v-if="
            (ProductQuotationResult.ExpressCost || ProductQuotationResult.ExpressCost === 0)
            && showExpressCost
          "
          >(<i class="is-font-12">含运费：{{ ProductQuotationResult.ExpressCost | formatNumber }}元</i>)</span
        >
      </div>
      <div v-else class="isprice">
        <template v-if="!showExpressCost || !((ProductQuotationResult.ExpressCost || ProductQuotationResult.ExpressCost === 0))"
         >{{ ProductQuotationResult.OriginalCost > ProductPrice ? "官网上传优惠价：" : "成交价："}}</template>
        <template v-else> 合计：</template>
        <i class="is-pink is-bold is-font-20">{{ (showExpressCost ? Cost : ProductPrice) | formatNumber}}</i>
        <i class="is-pink is-font-13" style="margin-right: 8px; margin-left:3px">元</i>
        <span
          class="aside-price"
          style="margin-right:5px"
          v-if="
            (ProductQuotationResult.ExpressCost || ProductQuotationResult.ExpressCost === 0)
            && showExpressCost
          "
          >( 含货款 <i>{{ProductPrice | formatNumber}}</i> 元， 运费 <i>{{ ProductQuotationResult.ExpressCost | formatNumber }}</i> 元 )</span
        >
      </div>
      <!-- 其余详情信息 -->
      <div
        class="show-info"
        :class="isPrice ? 'isprice' : ''"
        v-if="
          ProductQuotationResult.OriginalCost > ProductPrice ||
          selectedCoupon ||
          showExpressCost ||
          ProductQuotationResult.Weight
        "
      >
        <span style="margin-right: 2px" v-if="!isPrice">(</span>
        <span>原价：<i>
          <template>{{ ProductQuotationResult.OriginalCost + (ProductQuotationResult.ExpressCost||0)  | formatNumber }}元</template>
          <template>（含货款{{ ProductQuotationResult.OriginalCost  | formatNumber }}元</template>
          </i>）</span>
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
        <span class="mg-left"  v-if="!isPrice"> )</span>
      </div>
    </li>
    <!-- 工期信息 -->
    <li class="ProducePeriod" v-if="ProducePeriod">
      <div class="is-pink is-font-13 is-bold">
        <i class="el-icon-time" style="margin-right:5px;font-size:15px;font-weight:600"></i>
        <span style="margin-right:0px">{{ ProducePeriod | getPayTime }}，</span>
        <span style="margin-right:2px">{{ ProducePeriod | getDoneTime }}。</span>
      </div>
      <div v-if="!ProducePeriod.IncludeDiliveryTime || ProducePeriod.Tips" class="tip">
        <span class="is-pink is-font-12 perod-tip" style="margin-right:0;" :title="ProducePeriod.Tips || ''">
          <template v-if="!ProducePeriod.IncludeDiliveryTime">配送时间视快递物流速度。</template>
          <template v-if="ProducePeriod.Tips" >{{ProducePeriod.Tips}}</template>
        </span>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    ProductQuotationResult: {
      type: Object,
      default: null,
    },
    selectedCoupon: {
      type: Object,
      default: null,
    },
    showExpressCost: { // 是否展示运费
      type: Boolean,
      default: false,
    },
    isPrice: { // 是否是报价区域使用
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ProductPrice() { // 产品价格
      if (!this.ProductQuotationResult) return '';
      const _cost = (+this.ProductQuotationResult.CurrentCost).toFixed(2);
      if (!this.selectedCoupon) return _cost;
      if (
        this.ProductQuotationResult.CurrentCost
        >= this.selectedCoupon.MinPayAmount
      ) {
        let num = +(
          this.ProductQuotationResult.CurrentCost - this.selectedCoupon.Amount
        ).toFixed(2);
        num = num > 0 ? num : 0;
        return num;
      }
      return _cost;
    },
    Cost() { // 总价格(含运费)
      if (!this.ProductQuotationResult) return '';
      return (+this.ProductPrice + +this.ProductQuotationResult.ExpressCost).toFixed(2);
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
  line-height: 0;
  white-space: normal;
  width: 555px;
  vertical-align: top;
  &.showExpressCost {
    width: 520px;
  }
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
        &.isprice {
          color: #888;
          font-size: 12px;
          margin-bottom: -6px;
          > span {
            margin-right: 13px;
          }
        }
      }
    }
    &.ProducePeriod {
      margin-top: 2px;
      letter-spacing: 0.5px;
      > div {
        line-height: 21px;
        color: #ff3769;
        max-width: 100%;
        text-overflow: ellipsis;
        > span {
          line-height: 18px;
          white-space: normal;
          &.perod-tip {
            max-width: 568px;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 14px;
          }
        }
        &.is-bold {
          margin-bottom: 2px;
        }
        &.tip {
          line-height: 18px;
        }
      }
    }
    &.price {
      padding-top: 5px;
      padding-bottom: 8px;
      > .isprice {
        color: #585858;
        display: block;
        margin-bottom: 5px;
        .aside-price {
          font-size: 14px;
          margin-left: 8px;
          i {
            font-weight: 700;
            color: #ff3769;
          }
        }
      }
    }
  }
}
</style>
