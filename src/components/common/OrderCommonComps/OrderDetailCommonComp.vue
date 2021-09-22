<template>
  <section class="mp-pc-order-detail-common-comp-wrap">
    <header class="section-title">{{title}}</header>
    <div class="main" :class="PartShowDataList.length === 0 ? 'is-merge' : ''">
      <div class="left">
        <DisplayItem :ShowData='ProductShowData' />
      </div>
      <div class="content" v-if="PartShowDataList.length > 0">
        <!-- 产品部件 -->
        <DisplayItem v-for="(it, i) in PartShowDataList" :ShowData='it' :key="it.Name" :class="{border: i > 0}" :showBorder='i > 0' />
      </div>
      <div class="right" :class="PartShowDataList.length > 1?'':'setMP'">
        <slot></slot>
      </div>
    </div>
  </section>
</template>

<script>
import ShowProductDetail from '@/store/Quotation/ShowProductDetail';
import DisplayItem from '@/components/QuotationComps/PlaceOrderComps/OrderSubmitComp/SubmitConfirmDialog/ProductInfoComp/DisplayItem';

export default {
  props: {
    title: {
      type: String,
      default: '产品详情',
    },
    orderDetail: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    DisplayItem,
  },
  computed: {
    PartList() {
      if (!this.orderDetail) return [];
      if (this.pageName === 'orderDetail') {
        if (this.curOrderData) return this.curOrderData.ProductParams.PartList;
        return [];
      }
      if (!this.orderDetail.ProductParams) return [];
      return this.orderDetail.ProductParams.PartList;
    },
    PartShowDataList() {
      const arr = [];
      this.PartList.forEach(it => {
        if (Array.isArray(it.List)) {
          it.List.forEach((part, index) => {
            const ContentList = this.getPartShowList(it.Attributes.DisplayOrderList, part);
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
      if (this.orderDetail?.ProductParams?.Attributes?.DisplayOrderList && this.orderDetail.ProductParams.Attributes.DisplayOrderList.length > 0) {
        return {
          Name: this.orderDetail.ProductParams.Attributes.DisplayName,
          ContentList: this.getPartShowList(this.orderDetail.ProductParams.Attributes.DisplayOrderList, this.orderDetail.ProductParams),
          Type: 'product',
        };
      }
      return null;
    },
  },
  data() {
    return {
      pageName: '',
      curOrderData: null,
    };
  },
  methods: {
    getPartShowList(DisplayOrderList, ProductParams) {
      return ShowProductDetail.getDisplayContentFromPartDataByDetailData(DisplayOrderList, ProductParams);
    },
  },
  async mounted() {
    this.pageName = this.$route.name;
    if (this.pageName === 'unpayOrderDetail') this.pageName = 'orderDetail';
    if (this.pageName !== 'orderDetail') return;
    const res = await this.api.getOrderDetail(this.orderDetail.OrderID);
    this.$emit('setDetailDataCompleted', true);
    if (res.data.Status === 1000) {
      this.curOrderData = res.data.Data;
      this.$store.commit('order/updateOrderDetailData', res.data.Data);
      if (this.$route.name === 'unpayOrderDetail') {
        this.$store.commit('unpayList/updateCurUnpayListDetailData', res.data.Data);
      }
    }
  },
};
</script>

<style lang='scss'>
.mp-pc-order-detail-common-comp-wrap {
  font-size: 14px;
  color: #585858;
  padding-bottom: 35px;
  background-color: #fff;
  > .main {
    padding-top: 22px;
    position: relative;
    overflow: hidden;
    min-height: 360px;
    > .left {
      display: inline-block;
      vertical-align: top;
      width: 420px;
      padding: 30px;
      padding-top: 0px;
      margin-top: -3px;
      box-sizing: border-box;
      .is-font-14.is-bold {
        font-size: 15px !important;
      }
    }
    > .content {
      border-left: 1px solid #eee;
      border-right: 1px solid #eee;
      box-sizing: border-box;
      width: 420px;
      display: inline-block;
      height: 10000px;
      margin-bottom: -9999px;
      > ul {
        margin: 0 30px;
        &.border {
          margin-top: 20px;
          padding-top: 10px;
          &::before {
            width: 320px;
          }
        }
      }
    }
    > .right {
      display: inline-block;
      width: 355px;
      vertical-align: top;
      box-sizing: border-box;

      &.setMP {
        height: 10000px;
        margin-bottom: -9999px;
        border-left: 1px solid #eee;
      }
    }
    .craft-wrap {
      > div {
        float: left;
        // margin-right: 8px;
      }
      > ul {
        overflow: hidden;
        > li {
          margin-bottom: 20px;
          .craft-title {
            min-width: 3em;
            display: inline-block;
          }
        }
      }
    }
    .width-122 {
      width: 122px;
      display: inline-block;
    }
    &.is-merge {
      > .left {
        width: 765px;
        padding-left: 60px;
        padding-top: 30px;
        min-height: 380px;
      }
    }
  }
  .is-opacity0 {
    opacity: 0;
  }
}
</style>
