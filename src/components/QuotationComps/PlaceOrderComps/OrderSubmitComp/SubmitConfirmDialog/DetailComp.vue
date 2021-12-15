<template>
  <main class="mp-common-detail-comp-wrap">
    <div class="left">
      <ProductInfoComp
        v-if="ProductParams || OrderDetail"
        :ProductParams="ProductParams"
        :curProductInfo2Quotation="curProductInfo2Quotation"
        :OrderPreData="OrderPreData"
        :OrderDetail='OrderDetail'
        :isSubmitType='isSubmitType'
      />
    </div>
    <div class="right">
      <ExpressInfoComp :Address="Address" :ExpressList="ExpressList" :OutPlateNo='OutPlateNo' />
      <OrderInfoComp :orderInfo="orderInfo" :OrderDetail='OrderDetail' :isCar='isCar' />
    </div>
  </main>
</template>

<script>
import { mapState } from 'vuex';
import ProductInfoComp from './ProductInfoComp/index.vue';
import OrderInfoComp from './OrderInfoComp.vue';
import ExpressInfoComp from './ExpressInfoComp.vue';

export default {
  props: {
    OrderPreData: {
      type: Object,
      default: null,
    },
    OrderDetail: {
      type: Object,
      default: null,
    },
    isCar: {
      type: Boolean,
      default: false,
    },
    isSubmitType: {
      type: Boolean,
      default: false,
    },
    orderInfo: {
      type: Object,
      default: null,
    },
    ProductParams: {
      type: Object,
      default: null,
    },
  },
  components: {
    OrderInfoComp,
    ExpressInfoComp,
    ProductInfoComp,
  },
  computed: {
    ...mapState('common', ['ExpressList']),
    ...mapState('Quotation', ['curProductInfo2Quotation']),
    OutPlateNo() { // 平台单号
      if (this.orderInfo) {
        return this.orderInfo.OutPlate ? `${this.orderInfo.OutPlate}` : '无';
      }
      if (this.OrderDetail && this.OrderDetail.OutPlate && this.OrderDetail.OutPlate.Second) {
        return `${this.OrderDetail.OutPlate.Second}`;
      }
      return '无';
    },
    Address() {
      if (this.OrderDetail && this.OrderDetail.Address) {
        return this.OrderDetail.Address;
      }
      if (
        this.OrderPreData
        && Array.isArray(this.OrderPreData.PackageList)
        && this.OrderPreData.PackageList.length > 0
        && this.OrderPreData.PackageList[0].Address
        && this.OrderPreData.PackageList[0].Address.Address
      ) {
        return this.OrderPreData.PackageList[0].Address;
      }
      return null;
    },
  },
};
</script>
<style lang='scss'>
</style>
