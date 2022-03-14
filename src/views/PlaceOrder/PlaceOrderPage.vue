<template>
  <section class="mp-pc-place-order-page-wrap">
    <header>
      <PlaceOrderProductClassifyComp />
    </header>
    <div class="notice-box" :class="{hasContent: NoticeList.length > 0}">
      <template v-if="NoticeList.length > 0">
        <i></i>
        <a :href="it.Url" target="_blank" v-for="(it, i) in NoticeList" :key="i" :style="`max-width:${NoticeList.length > 1 ? '' : 1180}px`">{{it.Title}}</a>
      </template>
    </div>
    <div class="content">
      <div v-if='initPageText' class="empty">
        <div>
          <img src="@/assets/images/order-success.png" alt="">
        </div>
        <p class="success-ctrl is-font-13" v-show="$route.query.id">
          <span style="margin-right:10px" class="is-gray">{{initPageText}}</span>
          <span class="blue-span" @click="closeSuccessState">  ＜ 返回当前产品</span>
        </p>
      </div>
      <QuotationContent v-else-if="curProductInfo2Quotation" :placeData='curProductInfo2Quotation' />
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
    ...mapState('common', ['customerInfo', 'NoticeList']),
  },
  data() {
    return {
      initLoading: false,
    };
  },
  methods: {
    async handlePathDataFetch() {
      this.$store.commit('Quotation/setInitPageText', '');
      const productID = this.$route.query.id;
      // console.log(this.curProductInfo2Quotation);
      if (!productID) {
        if (this.curProductInfo2Quotation && this.curProductInfo2Quotation.ID) {
          this.$router.replace(`?id=${this.curProductInfo2Quotation.ID}`);
        }
        return;
      }
      if (this.curProductInfo2Quotation && this.curProductInfo2Quotation.ID && this.curProductInfo2Quotation.ID === productID) return;
      this.initLoading = true;
      const detailData = await this.$store.dispatch('Quotation/getProductDetail', [{ closeloading: true }, productID]);
      if (detailData) {
        this.$store.commit('Quotation/setCurProductInfo', detailData);
      }
      this.$store.commit('Quotation/setSelectedCoupon', null);
      this.initLoading = false;
    },
    closeSuccessState() {
      this.$store.commit('Quotation/setCurProductInfo2Quotation', this.curProductInfo2Quotation);
      this.$store.commit('Quotation/setInitPageText', '');
    },
  },
  mounted() {
    this.handlePathDataFetch();
    if (!this.customerInfo || this.customerInfo.AuthStatus === 2) return;
    this.messageBox.warnCancelBox({
      title: '企业信息未完善',
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
      margin-top: 220px;
      font-size: 18px;
      color: #585858;
      padding-right: 150px;
      > .iconfont {
        font-size: 30px;
        margin-right: 12px;
        vertical-align: -10%;
      }
      .success-ctrl {
        padding-top: 20px;
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
  > .notice-box {
    padding: 15px 0;
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;
    line-height: 22px;
    display: flex;
    > a {
      display: inline-block;
      flex: 0 1 auto;
      height: 22px;
      font-size: 12px;
      vertical-align: top;
      margin-right: 10px;
      color: #f4a307;
      background-color: rgba($color: #f4a307, $alpha: 0.08);
      border-radius: 11px;
      padding: 0 16px;
      cursor: pointer;
      max-width: 500px;
      max-width: 380px\9\0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      &:hover {
        text-decoration: underline;
      }
    }
    > i {
      display: inline-block;
      flex: none;
      margin: 0 6px;
      height: 22px;
      width: 16px;
      vertical-align: top;
      background: url('../../assets/images/horn2.png') no-repeat center center/100% 13px;
    }
    &.hasContent {
      padding: 9px 0;
    }
  }
}
</style>
