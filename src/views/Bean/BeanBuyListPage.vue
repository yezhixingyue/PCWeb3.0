<template>
  <div class="mp-pc-bean-buy-list-page-wrap">
    <section>
      <header>
        <span class="blue-v-line is-bold is-black">充值印豆</span>
        <span class="record">( <i @click="goToHistoryPage" class="blue-span">查看充值记录</i> )</span>
        <span class='is-origin is-font-12' style="margin-left:20px"><i class='el-icon-info is-font-13'></i> {{PrintBeanExchangeNumber}}个印豆可抵扣1元人民币</span>
      </header>
      <main>
        <ul :class="{op: showOpacity}">
          <!-- 印豆列表 -->
          <BeanItemComp v-for="it in BeanDataList" :key='it.ID' :itemData='it' @buy="onBeanBuyClick" />
        </ul>
        <!-- 空状态 -->
        <div class="em" v-if="BeanListClassData.BeanList.length === 0 && !BeanListClassData.loading">
          <img src="@/assets/images/empty.png" alt="">
          <p>暂无数据</p>
        </div>
        <BeanBuyDialog
         :visible.sync='visible'
         :curBuyItemData='curBuyItemData'
         :PrintBeanExchangeNumber='PrintBeanExchangeNumber'
         @submit='beanItemBuyHandler'
        />
        <QrCodeForPayDialogComp
          v-model="QrCodeVisible"
          :payInfoData="payInfoData"
          @success='handlePaidSuccess'
          @close='handleQrCodeClosed'
          showExpire
          dynamic
          showPayDescription
          showAmount
          hiddenHeader
          showWarning
          width='550px'
          top='18vh'
          successTitle='充值成功'
         >
          <div class="bean-pay-detail-box" v-if="payInfoData && curBuyItemData">
            <p>
              <label>每份数量：</label>
              <span>{{curBuyItemData.BeanNumber}}个</span>
            </p>
            <p>
              <label>充值份数：</label>
              <span>{{buyBeanNumber}}份</span>
            </p>
            <p>
              <label>充值单价：</label>
              <span>{{curBuyItemData.Price}}元</span>
            </p>
          </div>
        </QrCodeForPayDialogComp>
      </main>
      <footer>
        <Count
          :watchPage='BeanListClassData.Condition.Page'
          :handlePageChange='handlePageChange'
          :count='BeanListClassData.BeanListNumber'
          :pageSize='BeanListClassData.Condition.PageSize'
        />
      </footer>
    </section>
  </div>
</template>

<script>
import BeanBuyDialog from '../../components/BuyBeanComps/BeanBuyDialog.vue';
import BeanItemComp from '../../components/BuyBeanComps/BeanItemComp.vue';
import BeanListClassType from '../../assets/js/ClassType/BeanListClass/BeanListClassType';
import Count from '../../components/common/Count.vue';
import QrCodeForPayDialogComp from '../../packages/QrCodeForPayDialogComp';
import { PrintBeanExchangeRate } from '../../assets/js/setup';

export default {
  components: {
    BeanBuyDialog,
    Count,
    BeanItemComp,
    QrCodeForPayDialogComp,
  },
  data() {
    return {
      visible: false,
      BeanListClassData: new BeanListClassType(),
      curBuyItemData: null,
      QrCodeVisible: false,
      payInfoData: null,
      buyBeanNumber: 0,
      showOpacity: false,
    };
  },
  computed: {
    BeanDataList() {
      if (this.BeanListClassData && this.BeanListClassData.BeanList.length > 0) {
        const { Page, PageSize } = this.BeanListClassData.Condition;
        const index = (Page - 1) * PageSize;
        const length = Page * PageSize;
        return this.BeanListClassData.BeanList.slice(index, length);
      }
      return [];
    },
    PrintBeanExchangeNumber() {
      return Math.round(1 / PrintBeanExchangeRate);
    },
  },
  methods: {
    onBeanBuyClick(e) {
      this.curBuyItemData = e;
      this.visible = true;
    },
    async beanItemBuyHandler(e) { // 提交付款
      const resp = await this.api.getShopPrintBeanBuy(e).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        this.$store.dispatch('common/getCustomerFundBalance');
        this.buyBeanNumber = e.Number;
        if (!resp.data.Data) {
          const cb = () => {
            this.handleQrCodeClosed();
            this.visible = false;
          };
          this.messageBox.successSingle({
            title: '充值成功',
            successFunc: cb,
            failFunc: cb,
          });
          return;
        }
        this.payInfoData = resp.data.Data;
        this.visible = false;
        this.QrCodeVisible = true;
      }
    },
    handlePaidSuccess() { // 完成扫码支付
      // 对印豆项目进行修改 -- 已在前面进行修改
      // 重新获取账号余额及印豆信息
      this.$store.dispatch('common/getCustomerFundBalance');
    },
    handleQrCodeClosed() {
      if (typeof this.curBuyItemData.TodayBuyMaxNumber === 'number') {
        this.curBuyItemData.TodayBuyMaxNumber -= this.buyBeanNumber; // 修改印豆可购买数据
      }
    },
    handlePageChange(Page) { // 跳转页码
      const oApp = document.getElementById('app');
      if (oApp) oApp.scrollTop = 0;
      // this.showOpacity = true;
      this.BeanListClassData.Condition.Page = Page || 1;
      // setTimeout(() => {
      //   this.showOpacity = false;
      // }, 50);
    },
    goToHistoryPage() { // 前往印豆购买记录页面
      this.$router.push('/beanPurchaseHistory');
    },
  },
  mounted() {
    this.BeanListClassData.getBeanList();
  },
};
</script>
<style lang='scss'>
.mp-pc-bean-buy-list-page-wrap {
  margin: 25px 0;
  background: #fff;
  > section {
    width: 1200px;
    margin: 0 auto;
    min-height: calc(100vh - 115px - 50px);
    min-height: calc(100vh - 115px - 65px)\9\0;
    display: flex;
    flex-direction: column;
    > header {
      flex: none;
      padding: 30px 0;
      > span {
        &.record {
          margin-left: 6px;
        }
      }
    }
    > main {
      flex: 1;
      min-height: 500px\9\0;
      width: 100%;
      > div.em {
        text-align: center;
        padding-top: 120px;
        > p {
          color: #989898;
          margin-top: 15px;
        }
      }
      > ul {
        margin-right: -30px;
        transition: opacity 0.1s ease-in-out;
        &.op {
          opacity: 0.05;
        }
      }
      > .mp-erp-common-comps-qr-code-for-payment-comp-dialog-comp-wrap {
        .bean-pay-detail-box {
          padding-top: 30px;
          > p {
            width: 100%;
            text-align: left;
            font-size: 14px;
            color: #585858;
            padding-bottom: 12px;
            > label {
              display: inline-block;
              vertical-align: top;
              text-align: right;
              width: 260px;
            }
            > span {
              display: inline-block;
              vertical-align: top;
              min-width: 60px;
              text-align: center;
            }
          }
        }
        .el-dialog__footer {
          display: none;
        }
      }
    }
    > footer {
      flex: none;
      height: 30px;
      text-align: center;
      padding-top: 20px;
      padding-bottom: 50px;
    }
  }
}
</style>
