<template>
  <section class="mp-pc-place-order-page-wrap">
    <header>
      <PlaceOrderProductClassifyComp />
    </header>
    <div class="content">
      <QuotationContent v-if="curProductInfo2Quotation" :placeData='curProductInfo2Quotation' />
      <div v-else-if='initPageText && !curProductInfo2Quotation' class="empty">
        <span class="iconfont icon-wancheng is-success"></span>
        <span>{{initPageText}}</span>
      </div>
      <!-- <div v-else class="bg-empty-wrap"></div> -->
      <div v-else-if="initLoading" class="init-loading-box">
        <p><i class="el-icon-loading"></i>请稍候，正在加载中。。。</p>
      </div>
      <div class="show-empty-bg" v-else>
        <img src="../../assets/images/placeorderisempty.png" alt="">
        <p class="is-gray">当前尚未选择产品，请通过上方产品分类选择产品吧...</p>
      </div>
    </div>
  </section>
</template>

<script>
import PlaceOrderProductClassifyComp from '@/components/QuotationComps/PlaceOrderProductClassifyComp.vue';
import QuotationContent from '@/components/QuotationComps/QuotationContent';
import { mapState } from 'vuex';

export default {
  components: {
    PlaceOrderProductClassifyComp,
    QuotationContent,
  },
  computed: {
    ...mapState('Quotation', ['curProductInfo2Quotation', 'initPageText', 'productNames']),
    ...mapState('common', ['customerInfo']),
  },
  data() {
    return {
      initLoading: false,
    };
  },
  methods: {
    async handlePathDataFetch() {
      const productID = this.$route.query.id;
      if (!productID) return;
      this.initLoading = true;
      const detailData = await this.$store.dispatch('Quotation/getProductDetail', [{ closeloading: true }, productID]);
      if (detailData) {
        this.$store.commit('Quotation/setCurProductInfo', detailData);
      }
      this.$store.commit('Quotation/setSelectedCoupon', null);
      this.initLoading = false;
    },
  },
  mounted() {
    this.handlePathDataFetch();
    if (!this.customerInfo || this.customerInfo.AuthStatus === 2) return;
    this.messageBox.warnCancelBox({
      title: '账户信息未完善',
      msg: '您尚有资料未完善，无法享受优惠价格',
      cancelButtonText: '忽略',
      confirmButtonText: '去完善资料',
      successFunc: () => {
        this.$router.push({
          path: '/mySetting/account',
          query: { redirect: 'placeOrder' },
        });
      },
    });
  },
};
</script>

<style lang='scss'>
.mp-pc-place-order-page-wrap {
  > .content {
    > .empty {
      text-align: center;
      margin-top: 168px;
      font-size: 18px;
      color: #585858;
      > .iconfont {
        font-size: 30px;
        margin-right: 12px;
        vertical-align: -10%;
      }
    }
    > .bg-empty-wrap {
      background: url('../../assets/images/placeorderisempty.png') no-repeat center/100% 100%;
      height: 266px;
      width: 545px;
      margin: 80px auto 0;
    }
    .init-loading-box {
      text-align: center;
      margin-top: 220px;
      color: #989898;
      i {
        font-size: 24px;
        margin-right: 10px;
        vertical-align: middle;
      }
      line-height: 24px;
    }
    > .show-empty-bg {
      text-align: center;
      padding-top: 80px\9\0;
      height: calc(100vh - 130px - 93px);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      > p {
        padding-top: 15px;
      }
      > img {
        height: 266px;
        width: 545px;
        user-select: none;
      }
    }
  }
}
</style>
