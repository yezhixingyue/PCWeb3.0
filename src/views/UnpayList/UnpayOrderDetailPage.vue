<template>
  <section class="mp-pc-unpay-list-order-detail-page-wrap" v-if="curUnpayListDetailData">
    <header class="gray">
      <span @click="onReturnClick"><i class="el-icon-arrow-left is-font-24 is-cancel"></i> 返回未付款单列表</span>
    </header>
    <ul class="content">
      <li>
        <OrderDetailHeader :info4OrderSummary='info4OrderSummary' />
      </li>
      <li>
        <OrderDetailCommonComp :orderDetail='curUnpayListDetailData'>
          <div class="price-wrap">
            <div class="price-box"  v-if="curUnpayListDetailData">
              <div class="price-left">
                <p>产品原价：</p>
                <p>优惠券：</p>
                <p class="final-price">成交价<i class="is-font-12 gray"></i>：</p>
                <p>定金：</p>
                <p>运费：</p>
              </div>
              <div class="price-right">
                  <p>¥ {{curUnpayListDetailData.Funds.OriginalPrice}}</p>
                  <p :class="curUnpayListDetailData.Funds.CouponAmount
                     && curUnpayListDetailData.Funds.CouponAmount > 0 ? 'is-pink' : ''">
                    <template v-show='curUnpayListDetailData.Funds.CouponAmount'>
                      <template
                       v-if="curUnpayListDetailData.Funds.CouponAmount && curUnpayListDetailData.Funds.CouponAmount > 0"
                       >-</template>¥
                      {{(curUnpayListDetailData.Funds.CouponAmount?curUnpayListDetailData.Funds.CouponAmount:0)}}
                    </template>
                  </p>
                  <p class="final-price is-pink">¥ <i class="is-font-18 is-bold"
                    >{{curUnpayListDetailData.Funds.FinalPrice}}</i></p>
                  <p>¥ {{curUnpayListDetailData.Funds.Deposit}}</p>
                  <p>¥ {{curUnpayListDetailData.Funds.Freight}}</p>
              </div>
            </div>
          </div>
          <p class="btn-wrap">
            <span class="span-title-blue" @click="onReturnClick">
              <i class="iconfont icon-left-double-arrow"></i> 返回列表</span>
            <el-button type="danger" @click="handleSubmit">支付</el-button>
          </p>
        </OrderDetailCommonComp>
      </li>
    </ul>
  </section>
</template>

<script>
import { mapState } from 'vuex';

import OrderDetailHeader from '@/components/OrderListComps/OrderDetail/OrderDetailHeader.vue';
import OrderDetailCommonComp from '@/components/common/OrderCommonComps/OrderDetailCommonComp.vue';

export default {
  components: {
    OrderDetailHeader,
    OrderDetailCommonComp,
  },
  computed: {
    ...mapState('unpayList', ['curUnpayListDetailData']),
    info4OrderSummary() {
      const {
        OutPlate, Content, OrderID, CreateTime, Express, Status, Package, ProducePeriod, Weight,
      } = this.curUnpayListDetailData;
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
        Weight,
      };
    },
  },
  methods: {
    onReturnClick() {
      this.$router.replace('/unpay/list');
      // this.$store.commit('Quotation/setIsFullPayoutDisabled', false);
    },
    async handleSubmit() {
      // eslint-disable-next-line max-len
      const res = await this.$store.dispatch('unpayList/getOrderPreCreateFromUnpayList', [this.curUnpayListDetailData]);
      if (res) this.$router.push('/unpay/submit');
    },
  },
  mounted() {
    if (!this.curUnpayListDetailData) this.$router.replace('/unpay/list');
  },
};
</script>

<style lang='scss'>
.mp-pc-unpay-list-order-detail-page-wrap {
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
      }
      &:active {
        background-color: rgb(208, 208, 208);
      }
    }
  }
  > ul > li {
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
        overflow: hidden;
        display: inline-block;
        margin: 0 auto;
        text-align: right;
        > div {
          padding-top: 48px;
          > p {
            line-height: 33px;
            &.final-price {
              margin-top: 6px;
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
  }
}

</style>
