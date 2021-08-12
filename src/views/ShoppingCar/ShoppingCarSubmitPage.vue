<template>
  <article class="mp-pc-shopping-car-submit-page-wrap">
    <section>
      <header class="return-btn" @click="onReturnClick">
        <span><i class="el-icon-arrow-left is-font-24 is-cancel"></i> 返回上一级</span>
      </header>
      <Table4PlaceOrderFromShoppingCar :orderData='curShoppingCarData4FirstPlace' />
      <footer v-if="PreCreateData">
        <p>
          <span>总共 <i class="is-pink">{{orderCount}}</i>个订单 </span>
          <span> （产品总额：<i>¥{{PreCreateData.ProductPrice}}</i>，
                    总运费：<i>¥{{PreCreateData.Freight}}</i>，
                    优惠券：<i :class="Coupon ? 'is-pink' : ''">{{ Coupon ? `-¥${Coupon}` : 0}}</i> ）</span>
        </p>
        <div class="price-wrap">
          <div class="price-box" v-if="PreCreateData">
            <div class="price-left">
              <p>在线支付：</p>
              <p class="gray">货到付款：</p>
              <p class="gray" v-if="PreCreateData.MinimumCost !== PreCreateData.FullPayout">支付方式：</p>
              <p class="final-price gray">当前可用余额：</p>
            </div>
            <div class="price-right">
              <p class="is-pink">¥ <i class="is-font-20 is-bold">{{payNumOnline | numToFixed2}}</i></p>
              <p class="is-pink">¥ {{PayOnDelivery | numToFixed2}}</p>
              <p v-if="PreCreateData.MinimumCost !== PreCreateData.FullPayout">
                <el-checkbox v-model="checked" :disabled='!!curPayInfo2Code'>在线支付全款</el-checkbox>
              </p>
              <p class="last">¥{{PreCreateData.FundBalance | numToFixed2}}</p>
            </div>
          </div>
        </div>
        <div class="btn-wrap">
          <el-button type="danger" @click="handleSubmit">提交订单</el-button>
        </div>
        <Dialog2Pay pageType='shoppingCarPage' :needClear='false' />
      </footer>
    </section>
  </article>
</template>

<script>
import { mapState } from 'vuex';
// eslint-disable-next-line max-len
import Table4PlaceOrderFromShoppingCar from '@/components/ShoppingCarComps/PlaceOrderFromShoppingCarComps/Table4PlaceOrderFromShoppingCar.vue';
import Dialog2Pay from '@/components/QuotationComps/PreCreateComps/Dialog2Pay.vue';

export default {
  components: {
    Table4PlaceOrderFromShoppingCar,
    Dialog2Pay,
  },
  computed: {
    ...mapState('shoppingCar', ['curShoppingCarData4FirstPlace', 'curShoppingCarDataBeforeFirstPlace']),
    ...mapState('Quotation', ['curPayInfo2Code']),
    PreCreateData() {
      return this.curShoppingCarData4FirstPlace;
    },
    orderCount() {
      if (!this.PreCreateData) return '';
      let _num = 0;
      this.PreCreateData.PackageList.forEach(it => {
        const _len = it.OrderList.length;
        _num += _len;
      });
      return _num;
    },
    Coupon() {
      if (!this.curShoppingCarDataBeforeFirstPlace || this.curShoppingCarDataBeforeFirstPlace.length === 0) return 0;
      let _num = 0;
      this.curShoppingCarDataBeforeFirstPlace.forEach(it => {
        if (it.Coupon) _num += it.Coupon.Amount;
      });
      return _num;
    },
    payNumOnline() {
      if (this.isFullPayout) return this.PreCreateData.FullPayout;
      return this.PreCreateData.MinimumCost;
    },
    PayOnDelivery() {
      if (this.isFullPayout) return 0;
      return this.PreCreateData.PayOnDelivery;
    },
    checked: {
      get() {
        if (this.PreCreateData.MinimumCost !== this.PreCreateData.FullPayout) return this.isFullPayout;
        return true;
      },
      set(key) {
        this.isFullPayout = key;
      },
    },
  },
  data() {
    return {
      isFullPayout: false,
    };
  },
  methods: {
    onReturnClick() {
      this.$router.go(-1);
      this.$store.commit('Quotation/setCurPayInfo2Code', null);
      // // console.log(this.$router, this.$route);
    },
    handleSubmit() {
      // console.log('handleSubmit');
      this.$store.commit('Quotation/setIsShow2PayDialog', true);
      const cb = () => {
        this.$router.push('/shopping/car');
        this.$store.commit('shoppingCar/setCurShoppingCarDetailData', null);
        this.$store.commit('shoppingCar/setCurShoppingCarDataBeforeFirstPlace', null);
        this.$store.commit('shoppingCar/setCurShoppingCarData4FirstPlace', null);
        this.$store.dispatch('common/getCustomerFundBalance');
      };
      if (!this.curPayInfo2Code) {
        const _obj = { PayInFull: this.checked, cb };
        this.$store.dispatch('Quotation/placeOrderFromPreCreate', _obj).catch((...args) => {
          const error = args[0];
          this.messageBox.handleLoadingError({
            title: '提交失败',
            error,
            successFunc: () => this.$store.commit('Quotation/setIsShow2PayDialog', false),
          });
        });
      }
    },
  },
  created() {
    if (!this.curShoppingCarData4FirstPlace) {
      this.$router.replace('/shopping/car');
    }
  },
};
</script>

<style lang='scss'>
.mp-pc-shopping-car-submit-page-wrap {
  width: 100%;
  background-color: #fff;
  > section {
    width: 1200px;
    margin: 0 auto;
    min-height: calc(100vh - 135px - 22px);
    border-top: 1px dashed #eee;
    > footer {
      padding: 30px;
      font-size: 14px;
      color: #585858;
      > p {
        border-bottom: 1px dashed #eee;
        padding-bottom: 15px;
        color: #888;
        > span > i {
          color: #585858;
        }
        .el-checkbox__label {
          color: #585858;
        }
      }
      > .price-wrap {
        height: 180px;
        text-align: right;
        > .price-box {
          height: 100%;
          overflow: hidden;
          display: inline-block;
          > div {
            padding-top: 18px;
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
                &.last {
                  margin-top: 6px;
                }
              }
            }
          }
        }
      }
      > .btn-wrap {
        text-align: right;
        > .mp-phone-upload-comp-break-point-type-wrap{
          display: inline-block;
          vertical-align: bottom;
          height: 40px;
          .self-comp {
            background-color: #fff;
            border-color: #fff;
            box-shadow: none;
            width: 240px;
            min-width: 1px;
            margin-right: 35px;
            white-space: nowrap;
            color: #989898 !important;
            text-align: right;
            > input {
              white-space: nowrap;
              color: #888;
            }
          }
        }
        > button {
          font-size: 16px;
          padding: 0;
          line-height: 40px;
          width: 140px;
        }
      }
    }
  }
}
</style>
