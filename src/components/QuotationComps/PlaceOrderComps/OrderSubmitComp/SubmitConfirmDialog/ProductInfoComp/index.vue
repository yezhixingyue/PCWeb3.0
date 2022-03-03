<template>
  <PanelItemComp v-if="(ProductParams && curProductInfo2Quotation && OrderPreData) || OrderDetail" class="mp-order-detail-product-info-display-comp">
    <template #img>
      <img src="@/assets/images/product-info.png" alt="">
    </template>
    <ul class="content mp-scroll-wrap">
      <template v-if="!OrderDetail">
        <li v-for="(item, i) in DetailDisplayDataList" :key="item.Name">
          <DisplayItem :ShowData='item' :showBorder='i > 0' />
        </li>
      </template>
      <li v-else>
        <DisplayItem :ShowData='ProductShowData' />
        <DisplayItem v-for="(it, i) in PartShowDataList" :ShowData='it' :key="it.Name" :class="{border: i > 0}" showBorder />
      </li>
    </ul>
    <div class="footer price-box">
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
    OrderDetail: {
      type: Object,
      default: null,
    },
    isSubmitType: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    PanelItemComp,
    DisplayItem,
  },
  computed: {
    ...mapState('Quotation', ['selectedCoupon']),
    Weight() {
      if (this.OrderDetail) {
        return this.OrderDetail.Weight || this.OrderDetail.Weight === 0 ? this.OrderDetail.Weight : '';
      }
      if (this.OrderPreData && this.OrderPreData.PackageList && this.OrderPreData.PackageList[0]) {
        return this.OrderPreData.PackageList[0].Weight || '';
      }
      return '';
    },
    OrderData() {
      if (this.OrderDetail) return this.OrderDetail;
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
    // PromoteAmount() {
    //   return +(this.OriginalPrice - this.FinalPrice - this.CouponAmount).toFixed(2);
    // },
    Freight() {
      if (!this.OrderDetail) return this.OrderPreData.Freight;
      return this.OrderDetail.Funds.Freight;
    },
    PartList() {
      if (!this.OrderDetail) return [];
      if (!this.OrderDetail.ProductParams) return [];
      return this.OrderDetail.ProductParams.PartList;
    },
    PartShowDataList() {
      const arr = [];
      this.PartList.forEach(it => {
        if (Array.isArray(it.List)) {
          it.List.forEach((part, index) => {
            const ContentList = ShowProductDetail.getDisplayContentFromPartDataByDetailData(it.Attributes.DisplayOrderList, part);
            const Name = it.List.length > 1 && index > 0 ? `${it.Attributes.Name}${index + 1}` : it.Attributes.Name;
            const temp = {
              Name,
              Type: 'Part',
              ContentList: ContentList || [],
            };
            arr.push(temp);
          });
        }
      });
      return arr;
    },
    ProductShowData() {
      if (this.OrderDetail?.ProductParams?.Attributes?.DisplayOrderList && this.OrderDetail.ProductParams.Attributes.DisplayOrderList.length > 0) {
        return {
          Name: this.OrderDetail.ProductParams.Attributes.DisplayName,
          ContentList: ShowProductDetail.getDisplayContentFromPartDataByDetailData(
            this.OrderDetail.ProductParams.Attributes.DisplayOrderList, this.OrderDetail.ProductParams,
          ),
          Type: 'product',
        };
      }
      return {
        Name: this.OrderDetail?.ProductParams?.Attributes?.DisplayName || '产品名称',
        ContentList: [],
        Type: 'product',
      };
    },
  },
  data() {
    return {
      DetailDisplayDataList: [],
    };
  },
  methods: {
    getProductDetailShowDataList() {
      // OrderDetail
      if (!this.isSubmitType) return;
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
  }
}

</style>
