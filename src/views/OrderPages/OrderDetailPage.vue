<template>
  <section class="mp-pc-order-list-page-order-detail-page-wrap" v-if="curOrderDetailData">
    <header class="gray">
      <span @click="onReturnClick"><i class="el-icon-arrow-left is-font-24 is-cancel"></i> 返回我的订单列表</span>
    </header>
    <ul class="content">
      <li>
        <OrderDetailHeader :info4OrderSummary='info4OrderSummary' :afterPay='true' />
      </li>
      <li>
        <OrderProgress @setProgressDataCompleted='setProgressDataCompleted' :OrderID='this.curOrderDetailData.OrderID'/>
      </li>
      <li>
        <OrderPackageList :OrderID='this.curOrderDetailData.OrderID' :Unit='this.curOrderDetailData.Unit'
        @setPackDataCompleted='setPackDataCompleted'
        :Express='this.curOrderDetailData.Express' />
      </li>
      <li class="last-item">
        <OrderDetailCommonComp @setDetailDataCompleted='setDetailDataCompleted' :orderDetail='curOrderDetailData'>
          <div class="price-wrap">
            <div class="price-box"  v-if="curOrderDetailData">
              <div class="price-left">
                <p>原价：</p>
                <p>优惠券：</p>
                <p>活动：</p>
                <p class="final-price">成交价<i class="is-font-12 gray"></i>：</p>
                <p>已付：</p>
                <p>未付：</p>
                <p>退款：</p>
              </div>
              <div class="price-right">
                  <p>¥ {{curOrderDetailData.Funds.OriginalPrice}}</p>
                  <p :class="curOrderDetailData.Funds.CouponAmount
                     && curOrderDetailData.Funds.CouponAmount > 0 ? 'is-pink' : ''">
                    <template>
                      <i v-if='curOrderDetailData.Funds.CouponAmount && curOrderDetailData.Funds.CouponAmount>0'>-</i>
                      ¥ {{(curOrderDetailData.Funds.CouponAmount ? curOrderDetailData.Funds.CouponAmount : 0)}}
                    </template>
                  </p>
                  <p :class="promotePrice > 0 ? 'is-pink' : ''">
                    <template>
                      <i v-if='promotePrice && promotePrice>0'>-</i>¥ {{(promotePrice ? promotePrice : 0)}}
                    </template>
                  </p>
                  <p class="final-price is-pink">¥ <i class="is-font-18 is-bold"
                    >{{curOrderDetailData.Funds.FinalPrice}}</i></p>
                  <p>¥ {{curOrderDetailData.Funds.HavePaid}}</p>
                  <p>¥ {{curOrderDetailData.Funds.Unpaid}}</p>
                  <p>¥ {{curOrderDetailData.Funds.Refund}}</p>
              </div>
            </div>
          </div>
        </OrderDetailCommonComp>
      </li>
    </ul>
    <AsideIndexComp ref="AsideIndexComp" />
  </section>
</template>

<script>
import { mapState } from 'vuex';

import OrderDetailHeader from '@/components/OrderListComps/OrderDetail/OrderDetailHeader.vue';
import OrderProgress from '@/components/OrderListComps/OrderDetail/OrderProgress.vue';
import OrderPackageList from '@/components/OrderListComps/OrderDetail/OrderPackageList.vue';
import OrderDetailCommonComp from '@/components/common/OrderCommonComps/OrderDetailCommonComp.vue';
import AsideIndexComp from '@/components/OrderListComps/OrderDetail/AsideIndexComp.vue';

export default {
  data() {
    return {
      progressDataCompleted: false,
      packDataCompleted: false,
      detailDataCompleted: false,
    };
  },
  components: {
    OrderDetailHeader,
    OrderProgress,
    OrderPackageList,
    OrderDetailCommonComp,
    AsideIndexComp,
  },
  computed: {
    ...mapState('order', ['curOrderDetailData']),
    info4OrderSummary() {
      const {
        OutPlate, Content, OrderID, CreateTime, Express, Status, Package, ProducePeriod, PayTime, Weight,
      } = this.curOrderDetailData;
      // console.log(Weight, 'Weight');
      const {
        AddressDetail, ExpressArea, Consignee, Mobile,
      } = Package.Address.Address;
      const { RegionalName, CountyName, CityName } = ExpressArea;
      const Address = `${RegionalName}${CityName}${CountyName}${AddressDetail}`;
      return {
        OutPlate,
        Address,
        Content,
        OrderID,
        CreateTime,
        Express,
        Consignee,
        Mobile,
        Status,
        ProducePeriod,
        PayTime,
        Weight,
      };
    },
    promotePrice() {
      return +((this.curOrderDetailData.Funds.DiscountPrice - this.curOrderDetailData.Funds.CouponAmount).toFixed(2));
    },
  },
  methods: {
    onReturnClick() {
      this.$store.commit('order/setShouldGetNewListData', false);
      this.$router.replace('/order/list');
    },
    async handleSubmit() {
      // eslint-disable-next-line max-len
      const res = await this.$store.dispatch('shoppingCar/getOrderPreCreateFromShoppingCar', [this.curOrderDetailData]);
      if (res) this.$router.push('/shopping/submit');
    },
    handleGetDataSuccess() {
      if (this.progressDataCompleted && this.packDataCompleted && this.detailDataCompleted) {
        this.$refs.AsideIndexComp.getElesInfo();
      }
    },
    setProgressDataCompleted(bool) {
      this.progressDataCompleted = bool;
      if (bool) this.handleGetDataSuccess();
      // // console.log(this.$refs.AsideIndexComp);
    },
    setPackDataCompleted(bool) {
      this.packDataCompleted = bool;
      if (bool) this.handleGetDataSuccess();
      // // console.log(this.$refs.AsideIndexComp);
    },
    setDetailDataCompleted(bool) {
      this.detailDataCompleted = bool;
      if (bool) this.handleGetDataSuccess();
      // // console.log(this.$refs.AsideIndexComp);
    },
  },
  mounted() {
    if (!this.curOrderDetailData) this.$router.replace('/order/list');
  },
};
</script>

<style lang='scss'>
.mp-pc-order-list-page-order-detail-page-wrap {
  width: 1200px;
  margin: 0 auto;
  background-color: #fff;
  > header {
    padding: 9px 0;
    line-height: 24px;
    background-color: rgb(245, 245, 245);
    padding-left: 26px;
    user-select: none;
    > span {
      font-size: 14px;
      > i {
        vertical-align: -15%;
      }
      cursor: pointer;
      display: inline-block;
      padding: 4px 15px 4px 8px;
      border-radius: 5px;
      &:hover {
        background-color: rgb(230, 230, 230);
        // box-shadow: 0 0px 1px 1px rgba(38, 188, 249, 0.2);
      }
      &:active {
        background-color: rgb(208, 208, 208);
      }
    }
  }
  > ul {
    margin-bottom: 40px;
    > li {
      position: relative;
      margin-bottom: 15px;
      &::after {
        height: 15px;
        content: '';
        width: 100%;
        position: absolute;
        bottom: -15px;
        left: 0;
        background-color: rgb(245, 245, 245);
      }
      .price-wrap {
        text-align: center;
        > .price-box {
          height: 100%;
          // overflow: hidden;
          display: inline-block;
          margin: 0 auto;
          text-align: right;
          > div {
            padding-top: 48px;
            > p {
              line-height: 32px;
              &.final-price {
                margin-top: 4px;
                height: 32px;
                margin-bottom: 30px;
              }
            }
            &.price-left {
              float: left;
            }
            &.price-right {
              float: right;
              margin-left: 10px;
              > p {
                min-width: 100px;
              }
            }
          }
          position: relative;
          &::after {
            content: '';
            height: 1px;
            width: 240px;
            background-color: #eee;
            position: absolute;
            right: -30px;
            top: 195px;
          }
        }
      }
      .btn-wrap {
        padding-left: 40px;
        padding-top: 64px;
        padding-bottom: 25px;
        > span {
          > i {
            transform: rotate(-90deg);
          }
          margin-right: 25px;
        }
        > button {
          width: 130px;
        }
      }
      &.last-item {
        padding-bottom: 95px;
      }
      // box-shadow: 0 1px 1px rgba(0,0,0,.05), 0 2px 6px 0 rgba(0,0,0,.045);
    }
  }
}

</style>
