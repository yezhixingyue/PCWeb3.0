<template>
  <CommonChildTempView>
    <section class="mp-pc-sys-order-list-page-order-detail-page-wrap" v-if="localManageData">
      <main>
        <div class="col left">
          <!-- 订单详情 -->
          <OrderDetailModule :OrderDetail='localManageData.OrderDetail' :loading="localManageData.loading" />
        </div>

        <div class="col center">
          <!-- 配送信息 -->
          <ExpressModule :OrderDetail='localManageData.OrderDetail' :BillNoList="localManageData.BillNoList" :loading="localManageData.loading" />

          <!-- 缩略图 -->
          <ThumbnailModule :Thumbnail='localManageData.Thumbnail' v-if="localManageData.Thumbnail && !localManageData.Thumbnail.hidden" />
        </div>

        <div class="col right">
          <!-- 订单进度 -->
          <OrderProgressModule :OrderProgress="localManageData.OrderProgress" @showFundGone="onShowFundGone" />

          <!-- 退款去向 -->
          <RefundDetailDialog :visible.sync="visible" :RefundDetail="OrderRefundDetail" />
        </div>
      </main>

      <footer>
        <el-button class="cancel-btn" @click="goback">返回</el-button>
      </footer>
    </section>
  </CommonChildTempView>
</template>

<script>
import { mapState } from 'vuex';
import CommonChildTempView from '../../Common/CommonChildTempView.vue';
import OrderDetailManageClass from './js/OrderDetailManageClass';
import OrderDetailModule from './components/OrderDetailModule.vue';
import ExpressModule from './components/ExpressModule/ExpressModule.vue';
import ThumbnailModule from './components/ThumbnailModule/ThumbnailModule.vue';
import OrderProgressModule from './components/OrderProgressModule.vue';
import api from '../../../api';
import RefundDetailDialog from './components/RefundDetailDialog/RefundDetailDialog.vue';

// const succesImg = require('../../../assets/images/fund-gone/success.png');
// const ingImg = require('../../../assets/images/fund-gone/ing.png');
// const failImg = require('../../../assets/images/fund-gone/fail.png');

export default {
  components: {
    CommonChildTempView,
    OrderDetailModule,
    ExpressModule,
    ThumbnailModule,
    OrderProgressModule,
    RefundDetailDialog,
  },
  computed: {
    ...mapState('order', { currentRow: 'curOrderDetailData' }),
  },
  data() {
    return {
      localManageData: null,
      visible: false,
      OrderRefundDetail: null,
    };
  },
  methods: {
    goback() {
      this.$router.replace('/order/list');
    },
    async onShowFundGone() { // 显示钱款去向
      const OrderID = this.currentRow?.OrderID;
      if (!OrderID) return;

      const resp = await api.getOrderRefundDetail(OrderID);
      if (resp && resp.data.Status === 1000) {
        this.OrderRefundDetail = resp.data.Data;
        this.visible = true;
      }
    },
  },
  mounted() {
    if (!this.currentRow) {
      this.goback();
      return;
    }

    this.localManageData = new OrderDetailManageClass(this.currentRow);
    this.localManageData.init();
  },
};
</script>
<style lang='scss'>
.mp-pc-sys-order-list-page-order-detail-page-wrap {
  width: 1190px;
  margin: 0 auto;

  > main {
    padding-top: 10px;
    > div.col {
      display: inline-block;
      vertical-align: top;
      height: 100%;

      section.module {
        background-color: #fff;
        border-radius: 4px;

        > header {
          height: 36px;
          // border-radius: 6px;
          // background-color: #428dfa;
          color: #333;
          font-weight: 700;
          font-size: 14px;
          // text-align: center;
          line-height: 36px;
          border-bottom: 1px dashed #eee;
          padding: 0;
          box-sizing: border-box;

          &::before {
            content: '';
            display: inline-block;
            width: 1px;
            height: 100%;
            background-color: #428dfa;
            vertical-align: top;
          }

          img {
            vertical-align: middle;
            vertical-align: -8px;
            margin-right: 10px;
            margin-left: 15px;
          }

        }

        > * {
          padding: 0 20px;
        }
      }

      &.left {
        width: 376px;
      }

      &.center {
        width: 486px;
        margin: 0 10px;
      }

      &.right {
        width: 308px;
      }
    }
  }

  > footer {
    background-color: #fff;
    text-align: center;
    margin-top: 10px;
    padding-top: 20px;
    padding-bottom: 30px;
    border-radius: 4px;
    margin-bottom: 10px;

    button {
      width: 120px;
      border-radius: 5px !important;
    }
  }
}
</style>
