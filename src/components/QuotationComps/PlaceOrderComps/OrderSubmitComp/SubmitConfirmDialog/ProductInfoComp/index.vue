<template>
  <PanelItemComp v-if="(ProductParams && curProductInfo2Quotation && OrderPreData) || OrderDetail" class="mp-order-detail-product-info-display-comp">
    <template #img>
      <img src="@/assets/images/product-info.png" alt="">
    </template>
    <ul class="content mp-scroll-wrap">
      <!-- 订单提交 -->
      <template v-if="!OrderDetail">
        <li v-for="(item, i) in DetailDisplayDataList" :key="item.Name">
          <OrderDetailDisplayItem :ShowData='item' :showBorder='i > 0' />
        </li>
      </template>
      <!-- 订单详情 -->
      <li v-else>
        <OrderDetailDisplayItem :ShowData='ProductShowData' />
        <OrderDetailDisplayItem v-for="(it, i) in PartShowDataList" :ShowData='it' :key="it.Name" :class="{border: i > 0}" showBorder />
      </li>
    </ul>
    <OrderDetailPriceBox :OrderData='OrderData' />
  </PanelItemComp>
</template>

<script>
import { mapState } from 'vuex';
import ShowProductDetail from '@/store/Quotation/ShowProductDetail';
import OrderDetailDisplayItem from '@/packages/OrderDetailDisplayItem';
import OrderDetailPriceBox from '@/packages/OrderDetailPriceBox';
import PanelItemComp from '../PanelItemComp.vue';

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
    OrderDetailDisplayItem,
    OrderDetailPriceBox,
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
      let Name = this.OrderDetail?.ProductParams?.Attributes?.DisplayName || '产品名称';
      if (Array.isArray(this.OrderDetail?.ProductParams?.Attributes?.ClassList)) {
        const t = this.OrderDetail.ProductParams.Attributes.ClassList.find(it => it.Type === 2);
        if (t && t.FirstLevel?.Name) {
          Name = `${t.FirstLevel.Name}-${Name}`;
        }
      }
      if (this.OrderDetail?.ProductParams?.Attributes?.DisplayOrderList && this.OrderDetail.ProductParams.Attributes.DisplayOrderList.length > 0) {
        return {
          Name,
          ContentList: ShowProductDetail.getDisplayContentFromPartDataByDetailData(
            this.OrderDetail.ProductParams.Attributes.DisplayOrderList, this.OrderDetail.ProductParams,
          ),
          Type: 'product',
        };
      }
      return {
        Name,
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
