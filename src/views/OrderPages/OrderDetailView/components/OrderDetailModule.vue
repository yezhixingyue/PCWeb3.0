<template>
  <section class="mp-pc-sys-order-list-page-order-detail-page-wrap-order-detail-comp module" :class="{flex: canUseflex}">
    <header>
      <img src="../../../../assets/images/order-detail/detail.png" alt="">
      <span>订单详情</span>
    </header>

    <main v-loading="loading" >
      <template v-if="OrderDetail">
        <ul class="code-list">
          <li>
            <label>订单编号：</label> <span>{{ OrderDetail.OrderID }}</span>
          </li>
          <li>
            <label>电商编号：</label> <span>{{ OrderDetail.OutPlate && OrderDetail.OutPlate.Second ? OrderDetail.OutPlate.Second : '无' }}</span>
          </li>
        </ul>

        <!-- 订单详情 -->
        <div class="detail">
          <OrderDetailContent :OrderDetail='OrderDetail' class="mp-scroll-wrap" />
        </div>

        <!-- 下单信息 -->
        <ul class="other mp-scroll-wrap">
          <li>
            <label>文件内容：</label>
            <div class="content" v-if="!OrderDetail.Content || OrderDetail.Content.length < 40">{{ OrderDetail.Content }}</div>
            <el-tooltip class="item" v-else effect="dark" :content="OrderDetail.Content" placement="top-start" popper-class="mp-order-detail-content-popper">
              <div class="content">{{ OrderDetail.Content }}</div>
            </el-tooltip>
          </li>
          <li v-if="OrderDetail.FileAuthorMobile">
            <label>传稿人电话：</label> <div>{{ OrderDetail.FileAuthorMobile.trim() }}</div>
          </li>
          <li>
            <label>下单方式：</label> <div>{{ OrderDetail.OrderType === 2 ? '自助上传' : '代客下单' }}（{{OrderDetail.OrderTaker.Value}}）</div>
          </li>
          <li v-if="OrderDetail.Weight">
            <label>理论重量：</label> <div>{{ OrderDetail.Weight }}kg</div>
          </li>
          <li>
            <label>下单时间：</label> <div>{{ OrderDetail.CreateTime | format2MiddleLangTypeDate }}</div>
          </li>
          <li v-if="OrderDetail.PayTime">
            <label>付款时间：</label> <div>{{ OrderDetail.PayTime | format2MiddleLangTypeDate }}</div>
          </li>
          <li v-if="ProducePeriod">
            <label>{{ProducePeriod.IncludeDiliveryTime ? '预计送达：' : '预计发货：'}}</label>
            <div class="is-pink">
              <template v-if="!hiddenPayTime">{{ ProducePeriod | getPayTime }} </template>
              <template>{{ ProducePeriod | getDoneTime(hiddenPayTime) }}</template>
            </div>
          </li>
        </ul>

      </template>
    </main>

    <footer>
      <OrderDetailPriceBox v-if="OrderDetail" :OrderData='OrderDetail' />
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import OrderDetailContent from '@/components/QuotationComps/PlaceOrderComps/OrderSubmitComp/SubmitConfirmDialog/ProductInfoComp/OrderDetailContent.vue';
import OrderDetailPriceBox from '@/packages/OrderDetailPriceBox';

export default {
  props: {
    OrderDetail: {
      type: Object,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    OrderDetailContent,
    OrderDetailPriceBox,
  },
  computed: {
    ...mapState('common', ['canUseflex']),
    ProducePeriod() {
      return !(this.OrderDetail && [200, 254, 255].includes(this.OrderDetail.Status)) && this.OrderDetail.ProducePeriod;
    },
    hiddenPayTime() { // 是否隐藏支付时间，在订单未支付时需显示出来
      return this.OrderDetail && this.OrderDetail.Status !== 10;
    },
  },
};
</script>
<style lang='scss'>
.mp-pc-sys-order-list-page-order-detail-page-wrap-order-detail-comp {
  height: 700px;

  * {
    font-size: 12px !important;
  }

  > header span {
    font-size: 14px !important;
  }

  > main {
    height: 576px;

    > .code-list {
      padding: 11px 0 10px 0;
      border-bottom: 1px dashed #eee;
      box-sizing: border-box;

      li {
        line-height: 28px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        * {
          font-size: 16px !important;
        }

        span {
          font-weight: 700;
        }
      }
    }

    > .detail {
      height: 280px;
      border-bottom: 1px dashed #eee;
      box-sizing: border-box;
      padding: 12px 0 10px 0;
      margin-bottom: 12px;

      > div {
        overflow: auto;
        height: 100%;
      }

      .mp-order-detail-item-comp-wrap > li:first-of-type {
        margin-top: 0;
      }
    }

    > .other {
      height: 190px;
      overflow: scroll;

      > li {
        line-height: 16px;
        padding-bottom: 11px;
        white-space: nowrap;
        overflow: hidden;

        &:last-of-type {
          padding-bottom: 0;
        }

        > label {
          color: #888888;
        }

        > div {
          display: inline-block;
          vertical-align: top;

          &.content {
            white-space: wrap;
            width: 270px;
          }
        }
      }
    }
  }

  > footer {
    height: 96px;
    border-top: 1px dashed #eee;
    padding: 0 !important;
    margin: 0 20px;
    .mp-common-comps-order-detail-price-box-comp-wrap {
      padding-top: 0;
      border: none;
      margin-top: -5px;
      margin-right: -12px;
      > div {
        line-height: 22px;
        > span.label {
          width: unset;
          min-width: 0;
          color: #888888;
        }

        .text {
          color: #888888;
        }
      }
    }
  }

  &.flex > main {
    display: flex;
    flex-direction: column;

    > .code-list {
      flex: none;
    }

    > .detail {
      height: unset;
      flex: 1;
      overflow: hidden;
    }

    > .other {
      flex: none;
      height: unset;
      // overflow: hidden;
      overflow: visible;
      padding-bottom: 6px;

      > li > div.content {
        max-height: 32px;
        overflow: hidden; /* 隐藏超出部分 */
        text-overflow: ellipsis; /* 超出部分用打点表示 */
        white-space: -webkit-box; /* 使用WebKit的换行算法 */
        -webkit-line-clamp: 2; /* 限制在2行 */
        -webkit-box-orient: vertical; /* 垂直排列盒子 */
        display: -webkit-inline-box; /* 使用WebKit的弹性盒子模型布局 */
      }
    }
  }
}

.mp-order-detail-content-popper {
  max-width: 275px;
}
</style>
