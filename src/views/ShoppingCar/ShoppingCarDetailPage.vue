<template>
  <section class="mp-pc-shopping-car-detail-page-wrap" v-if="curShoppingCarDetailData">
    <header class="gray">
      <span @click="onReturnClick"><i class="el-icon-arrow-left is-font-24 is-cancel"></i> 返回购物车列表</span>
    </header>
    <ul class="content">
      <li>
        <OrderCommonSummary :showData='info4OrderSummary' />
      </li>
      <li>
        <OrderDetailCommonComp :orderDetail='curShoppingCarDetailData'>
          <div class="price-wrap">
            <div class="price-box"  v-if="curShoppingCarDetailData">
              <div class="price-left">
                <p>产品原价：</p>
                <p>优惠券：</p>
                <p class="final-price">成交价<i class="is-font-12 gray"></i>：</p>
                <p>定金：</p>
                <p>运费：</p>
              </div>
              <div class="price-right">
                  <p>¥ {{curShoppingCarDetailData.Funds.OriginalPrice}}</p>
                  <p :class="curShoppingCarDetailData.Funds.CouponAmount
                     && curShoppingCarDetailData.Funds.CouponAmount > 0 ? 'is-pink' : ''">
                    <template v-show='curShoppingCarDetailData.Funds.CouponAmount'
                      >{{(curShoppingCarDetailData.Funds.CouponAmount
                        ? '-¥ ' + curShoppingCarDetailData.Funds.CouponAmount : '¥ ' + 0)}}</template>
                  </p>
                  <p class="final-price is-pink">¥ <i class="is-font-18 is-bold"
                    >{{curShoppingCarDetailData.Funds.FinalPrice}}</i></p>
                  <p>¥ {{curShoppingCarDetailData.Funds.Deposit}}</p>
                  <p>¥ {{curShoppingCarDetailData.Funds.Freight}}</p>
              </div>
            </div>
          </div>
          <p class="btn-wrap">
            <span class="span-title-blue" @click="onReturnClick">
              <i class="iconfont icon-left-double-arrow"></i> 返回列表</span>
            <el-button type="danger" @click="handleSubmit">下单</el-button>
          </p>
        </OrderDetailCommonComp>
      </li>
    </ul>
  </section>
</template>

<script>
import { mapState } from 'vuex';

import OrderCommonSummary from '@/components/common/OrderCommonComps/OrderCommonSummary.vue';
import OrderDetailCommonComp from '@/components/common/OrderCommonComps/OrderDetailCommonComp.vue';

export default {
  components: {
    OrderCommonSummary,
    OrderDetailCommonComp,
  },
  computed: {
    ...mapState('shoppingCar', ['curShoppingCarDetailData']),
    info4OrderSummary() {
      return {
        OutPlate: this.curShoppingCarDetailData.OutPlate ? this.curShoppingCarDetailData.OutPlate.Second : '',
        Address: this.curShoppingCarDetailData.Address,
        Content: this.curShoppingCarDetailData.Content,
        FilePath: this.curShoppingCarDetailData.FilePath,
        ProducePeriod: this.curShoppingCarDetailData.ProducePeriod,
        Weight: this.curShoppingCarDetailData.Weight,
      };
    },
  },
  methods: {
    onReturnClick(e) {
      // console.log('onReturnClick');
      // console.log(e.target);
      e.target.blur();
      this.$router.replace('/shopping/car');
      // this.$store.commit('Quotation/setIsFullPayoutDisabled', false);
    },
    async handleSubmit() {
      // eslint-disable-next-line max-len
      const res = await this.$store.dispatch('shoppingCar/getOrderPreCreateFromShoppingCar', [this.curShoppingCarDetailData]);
      if (res) this.$router.push('/shopping/submit');
    },
  },
  mounted() {
    if (!this.curShoppingCarDetailData) this.$router.replace('/shopping/car');
  },
  destroyed() {
    // console.log('destroyed');
  },
};
</script>

<style lang='scss'>
.mp-pc-shopping-car-detail-page-wrap {
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
