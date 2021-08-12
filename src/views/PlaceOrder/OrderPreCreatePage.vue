<template>
  <article class="mp-pc-order-pre-create-page-comp-wrap">
    <section>
      <header class="gray">
        <span @click="onReturnClick"><i class="el-icon-arrow-left is-font-24 is-cancel"></i> 返回下单</span>
      </header>
      <div class="main">
        <Table4UnPayList />
      </div>
      <footer v-if="PreCreateData">
        <p>
          <span>总共 <i class="is-pink">1</i>个订单 </span>
          <span> （产品总额：<i>¥{{PreCreateData.ProductPrice}}</i>，
                    总运费：<i>¥{{PreCreateData.Freight}}</i>，
                    优惠券：<i :class="selectedCoupon ? 'is-pink' : ''">
                      {{ selectedCoupon ? `-¥${selectedCoupon.Amount}` : 0}}</i> ）</span>
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
              <p class="final-price">¥ {{PreCreateData.FundBalance | numToFixed2}}</p>
            </div>
          </div>
        </div>
        <div class="btn-wrap">
          <UploadComp4BreakPoint
            :shouldUpload='obj2GetProductPrice ? !obj2GetProductPrice.ProductParams.IsSpotGoods : true'
            ref='UploadComp4BreakPoint' title='' isUploadRightNow onlyShow :successFunc="subMitPlaceOrder" />
          <el-button type="danger" @click="handleSubmit">提交订单</el-button>
        </div>
        <div class="keep-data-check-box">
          <el-checkbox v-model="keepDataChecked">保留下单面板数据</el-checkbox>
          <p>如果选中保留订单参数，则在提交订单并支付成功后，下单面板产品参数部分的数据不清空，保留已选择和已填写的数据</p>
        </div>
        <Dialog2Pay :needClear='false' />
      </footer>
    </section>
  </article>
</template>

<script>
import { mapState } from 'vuex';
import Table4UnPayList from '@/components/QuotationComps/PreCreateComps/Table4UnPayList.vue';
import UploadComp4BreakPoint from '@/components/common/UploadComp/UploadComp4BreakPoint.vue';
import Dialog2Pay from '@/components/QuotationComps/PreCreateComps/Dialog2Pay.vue';

export default {
  components: {
    Table4UnPayList,
    UploadComp4BreakPoint,
    Dialog2Pay,
  },
  computed: {
    // eslint-disable-next-line max-len
    ...mapState('Quotation', ['orderFile4PreCreateData', 'PreCreateData', 'selectedCoupon', 'curPayInfo2Code', 'obj2GetProductPrice']),
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
    data2Listener() {
      return (!this.PreCreateData); // !this.orderFile4PreCreateData) ||
    },
    keepDataChecked: {
      get() {
        return !!this.iskeeping;
      },
      set(newVal) {
        localStorage.setItem('isOrderDataKeeping', newVal);
        this.iskeeping = newVal;
      },
    },
  },
  data() {
    return {
      isFullPayout: false,
      iskeeping: false,
    };
  },
  methods: {
    onReturnClick() {
      this.$router.replace('/placeOrder');
      this.$store.commit('Quotation/setCurPayInfo2Code', null);
      this.$store.commit('Quotation/setIsFullPayoutDisabled', false);
    },
    handleSubmit() {
      if (this.curPayInfo2Code) this.$store.commit('Quotation/setIsShow2PayDialog', true);
      else this.$refs.UploadComp4BreakPoint.upLoadSingleFile(this.orderFile4PreCreateData);
    },
    subMitPlaceOrder({ compiledName, FileSize }) {
      this.$store.commit('Quotation/setIsShow2PayDialog', true);
      const cb = () => {
        this.$store.dispatch('common/getCustomerFundBalance');
      };
      const isSpotGoods = this.obj2GetProductPrice ? this.obj2GetProductPrice.ProductParams.IsSpotGoods : false;
      // eslint-disable-next-line object-curly-newline
      const _obj = { FilePath: compiledName, PayInFull: this.checked, cb, isSpotGoods, FileSize };
      this.$store.dispatch('Quotation/placeOrderFromPreCreate', _obj).catch((...args) => {
        const error = args[0];
        // console.log(error);
        this.messageBox.handleLoadingError({
          title: '下单失败',
          error,
          successFunc: () => this.$store.commit('Quotation/setIsShow2PayDialog', false),
        });
      });
    },
  },
  watch: {
    data2Listener(newVal) {
      if (newVal) {
        this.$router.replace('/placeOrder');
        this.$store.commit('Quotation/setCurPayInfo2Code', null);
      }
    },
  },
  mounted() {
    if (this.data2Listener) {
      this.$router.replace('/placeOrder');
      this.$store.commit('Quotation/setCurPayInfo2Code', null);
    }
    const _bool = localStorage.getItem('isOrderDataKeeping');
    // // console.log(_bool);
    if (_bool === 'true') this.iskeeping = true;
  },
};
</script>

<style lang='scss'>
.mp-pc-order-pre-create-page-comp-wrap {
  width: 100%;
  margin-bottom: 25px;
  min-height: calc(100vh - 130px - 30px);
  background-color: #fff;
  > section {
    width: 1200px;
    margin: 0 auto;
    border-top: 1px dashed #eee;
    > header {
      padding-top: 8px;
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
    > .main {
      min-height: calc(100vh - 135px - 144px - 346px - 25px);
    }
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
                &.final-price {
                  margin-top: 5px;
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
          width: 140px;
          font-size: 16px;
          padding: 0;
          line-height: 40px;
        }
      }
      > .keep-data-check-box {
        text-align: right;
        margin-top: 15px;
        margin-right: 1px;
        .el-checkbox {
          font-size: 15px;
          .el-checkbox__label {
            color: #585858;
          }
        }
        > p {
          font-size: 12px;
          color: #888;
          line-height: 28px;
        }
      }
    }
  }
}
</style>
