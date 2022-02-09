<template>
  <el-dialog
    :visible.sync="localVisible"
    :close-on-click-modal='false'
    top="6vh"
    custom-class="mp-pre-create-order-comfirm-dialog-comp-wrap"
    v-dialogDrag
  >
    <header slot="title">
      <span>提交订单</span>
    </header>
   <main>
     <Table4PlaceOrderFromShoppingCar :orderData='PreCreateData' isMini />
   </main>
   <footer v-if="PreCreateData">
        <p>
          <span>总共 <i class="is-pink">{{orderCount}}</i> 个订单 </span>
          <span class="remark"> （产品总额：<i>¥{{PreCreateData.ProductPrice}}元</i>，
                    总运费：<i>¥{{PreCreateData.Freight}}元</i>，
                    优惠券：<i :class="Coupon ? 'is-pink' : ''">{{ Coupon ? `-¥${Coupon}` : `¥${0}`}}元</i> ）</span>
        </p>
        <div class="price-wrap">
          <div class="price-box">
            <div class="price-left">
              <p>在线支付：</p>
              <p class="gray">货到付款：</p>
              <p class="gray" v-if="PreCreateData.MinimumCost !== PreCreateData.FullPayout">支付方式：</p>
              <p class="final-price gray">当前可用余额：</p>
            </div>
            <div class="price-right">
              <p class="is-pink">¥ <i class="is-font-16 is-bold">{{payNumOnline | formatNumber}}元</i></p>
              <p class="is-pink">¥ {{PayOnDelivery | formatNumber}}元</p>
              <p v-if="PreCreateData.MinimumCost !== PreCreateData.FullPayout">
                <el-checkbox v-model="checked">在线支付全款</el-checkbox>
              </p>
              <p class="last">¥{{PreCreateData.FundBalance | formatNumber}}元</p>
            </div>
          </div>
        </div>
        <div class="btn-wrap">
          <span class="blue-span" @click="localVisible = false">取消</span>
          <el-button type="danger" @click="handleSubmit">提交订单</el-button>
        </div>
      </footer>
  </el-dialog>
</template>

<script>
import Table4PlaceOrderFromShoppingCar from '@/components/ShoppingCarComps/PlaceOrderFromShoppingCarComps/Table4PlaceOrderFromShoppingCar.vue';

export default {
  props: {
    PreCreateData: {
      type: Object,
      default: null,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    OriginList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    Table4PlaceOrderFromShoppingCar,
  },
  data() {
    return {
      isFullPayout: false,
    };
  },
  computed: {
    localVisible: {
      get() {
        return this.visible;
      },
      set(bool) {
        this.$emit('update:visible', bool);
      },
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
      if (!this.OriginList || this.OriginList.length === 0) return 0;
      let _num = 0;
      this.OriginList.forEach(it => {
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
  methods: {
    handleSubmit() {
      this.$emit('submit', { OriginList: this.OriginList, PayInFull: this.checked, PreCreateData: this.PreCreateData });
    },
  },
};
</script>
<style lang='scss'>
.mp-pre-create-order-comfirm-dialog-comp-wrap {
  display: table;
  border-radius: 5px;
  > .el-dialog__header {
    padding: 0;
    > header {
      height: 18px;
      line-height: 20px;
      font-size: 16px;
      border-bottom: 1px solid #eee;
      padding: 15px 12px;
      margin: 0 15px;
    }
  }
  > .el-dialog__body {
    padding: 25px 18px;
    > main {
      position: relative;
      > .mp-retractable-display-comp-wrap {
        max-width: 1120px;
        > main {
          max-height: 480px;
          height: 380px;
          display: block;
          overflow-y: auto;
          overflow-y: overlay;
        }
      }
    }
    > footer {
      padding: 30px 15px 0px;
      font-size: 14px;
      color: #585858;
      > p {
        border-bottom: 1px dashed #eee;
        padding-bottom: 10px;
        color: #888;
        > span > i {
          color: #585858;
        }
        .el-checkbox__label {
          color: #585858;
        }
        > span.remark {
          font-size: 13px;
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
        > button {
          font-size: 15px;
          padding: 0;
          line-height: 36px;
          width: 128px;
          border-radius: 4px;
        }
        > span {
          margin-right: 40px;
        }
      }
    }
  }
}
</style>
