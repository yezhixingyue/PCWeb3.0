<template>
  <PanelItemComp v-if="ProductParams && curProductInfo2Quotation && OrderPreData" class="mp-order-detail-product-info-display-comp">
    <template #img>
      <img src="@/assets/images/product-info.png" alt="">
    </template>
    <ul class="content mp-scroll-wrap">
      <li v-for="(item, i) in DetailDisplayDataList" :key="item.Name">
        <DisplayItem :ShowData='item' :showBorder='i > 0' />
      </li>
    </ul>
    <div class="footer price-box">
      <div>
        <span class="label">原价：</span>
        <span class="text">{{OriginalPrice}}元</span>
      </div>
      <div>
        <span class="label">活动：</span>
        <span class="text" :class="{'is-pink': !!PromoteAmount}">{{ PromoteAmount ? `-¥${PromoteAmount}` : 0}}元</span>
      </div>
      <div>
        <span class="label">优惠券：</span>
        <span class="text" :class="{'is-pink': !!CouponAmount}">{{ CouponAmount ? `-¥${CouponAmount}` : 0}}元</span>
      </div>
      <div>
        <span class="label">成交价：</span>
        <span class="text is-pink is-font-14">{{FinalPrice}}元</span>
        <span class="remark">（ <i class="freight">运费：{{OrderPreData.Freight}}元</i>
        <i>重量：{{Weight}}kg</i> ）</span>
      </div>
    </div>
  </PanelItemComp>
</template>

<script>
import { mapState } from 'vuex';
import ShowProductDetail from '@/store/Quotation/ShowProductDetail';
import PanelItemComp from '../PanelItemComp.vue';
import DisplayItem from './DisplayItem';

export default {
  props: {
    ProductParams: {
      type: Object,
      default: null,
    },
    curProductInfo2Quotation: {
      type: Object,
      default: null,
    },
    OrderPreData: {
      type: Object,
      default: null,
    },
  },
  components: {
    PanelItemComp,
    DisplayItem,
  },
  computed: {
    ...mapState('Quotation', ['selectedCoupon']),
    Weight() {
      if (this.OrderPreData && this.OrderPreData.PackageList && this.OrderPreData.PackageList[0]) {
        return this.OrderPreData.PackageList[0].Weight || '';
      }
      return '';
    },
    OrderData() {
      if (this.OrderPreData
       && this.OrderPreData.PackageList
       && this.OrderPreData.PackageList[0]
       && this.OrderPreData.PackageList[0].OrderList
       && this.OrderPreData.PackageList[0].OrderList[0]
       && typeof this.OrderPreData.PackageList[0].OrderList[0] === 'object') {
        return this.OrderPreData.PackageList[0].OrderList[0];
      }
      return null;
    },
    OriginalPrice() {
      return this.OrderData ? this.OrderData.OriginalPrice : '';
    },
    FinalPrice() {
      return this.OrderData ? this.OrderData.FinalPrice : '';
    },
    CouponAmount() {
      return this.OrderData ? this.OrderData.CouponAmount : '';
    },
    PromoteAmount() {
      return this.OrderData ? this.OrderData.PromoteAmount : '';
    },
  },
  data() {
    return {
      DetailDisplayDataList: [],
    };
  },
  methods: {
    getProductDetailShowDataList() {
      const data = ShowProductDetail.getProductDetailShowDataList(this.ProductParams, this.curProductInfo2Quotation);
      if (data) this.DetailDisplayDataList = data;
    },
  },
  mounted() {
    this.getProductDetailShowDataList();
  },
};
</script>
<style lang='scss'>
.mp-order-detail-product-info-display-comp {
  > .panel-content {
    overflow: hidden;
    > .footer.price-box {
      padding-top: 5px;
      display: flex;
      align-items: flex-end;
      flex-wrap: wrap;
      align-content: center;
      > div {
        display: inline-block;
        line-height: 24px;
        margin-right: 28px;
        > span.label {
          color: #888;
          float: left;
          margin-right: 2px;
        }
        > span.text {
          color: #585858;
          font-size: 12px;
          overflow: hidden;
          min-height: 22px;
        }
        > span.remark {
          font-size: 12px;
          > i.freight {
            margin-right: 15px;
          }
        }
      }
    }
  }
}

</style>
