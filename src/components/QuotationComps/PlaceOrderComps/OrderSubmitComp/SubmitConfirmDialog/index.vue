<template>
  <el-dialog
    :visible.sync="localVisible"
    width="760px"
    custom-class="mp-place-order-panel-comp-order-submit-comfirm-dialog-comp-wrap"
    v-dialogDrag
    @open="onOpen"
    top="10vh"
    @closed="onClosed"
  >
    <header slot="title">
      <span>订单信息</span>
    </header>
    <main>
      <div class="left">
        <ProductInfoComp
          v-if="ProductParams"
          :ProductParams="ProductParams"
          :curProductInfo2Quotation="curProductInfo2Quotation"
          :OrderPreData="OrderPreData"
        />
      </div>
      <div class="right">
        <ExpressInfoComp :Address="Address" :ExpressList="ExpressList" />
        <OrderInfoComp :orderInfo="orderInfo" />
      </div>
    </main>
    <footer>
      <ul v-if="OrderPreData">
        <li>
          <span class="label">在线支付：</span>
          <span class="content is-bold is-pink">{{onLineAmount}}<i class="is-font-12">元</i></span>
        </li>
        <li>
          <span class="label">货到付款：</span>
          <span class="content is-pink">{{PayOnDelivery}}<i class="is-font-12">元</i></span>
        </li>
        <li>
          <span class="label">当前可用余额：</span>
          <span class="content">{{FundBalance}}<i class="is-font-12">元</i></span>
        </li>
        <li>
          <template v-if="MinimumCost < FullPayout">
            <span class="label">支付方式：</span>
            <el-checkbox v-model="PayInFull" class="content">在线支付全款</el-checkbox>
          </template>
        </li>
      </ul>
      <span class="blue-span" @click="localVisible = false">取消</span>
      <el-button type="primary" @click="onSubmit">确认提交</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex';
import ProductInfoComp from './ProductInfoComp/index.vue';
import OrderInfoComp from './OrderInfoComp.vue';
import ExpressInfoComp from './ExpressInfoComp';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    OrderPreData: {
      type: Object,
      default: null,
    },
    requestObj: {
      type: Object,
      default: null,
    },
    FileCount: {
      type: Number,
      default: 0,
    },
  },
  components: {
    OrderInfoComp,
    ExpressInfoComp,
    ProductInfoComp,
  },
  computed: {
    ...mapState('common', ['ExpressList']),
    ...mapState('Quotation', ['curProductInfo2Quotation']),
    localVisible: {
      get() {
        return this.visible;
      },
      set(bool) {
        this.$emit('update:visible', bool);
      },
    },
    orderInfo() {
      if (
        this.OrderPreData
        && this.requestObj
        && this.requestObj.List
        && this.requestObj.List.length > 0
      ) {
        const { Content, OutPlate } = this.requestObj.List[0];
        let ProducePeriod = null;
        if (
          this.OrderPreData
          && Array.isArray(this.OrderPreData.PackageList)
          && this.OrderPreData.PackageList.length > 0
          && this.OrderPreData.PackageList[0].OrderList
          && this.OrderPreData.PackageList[0].OrderList.length > 0
        ) {
          if (this.OrderPreData.PackageList[0].OrderList[0].ProducePeriod) {
            ProducePeriod = this.OrderPreData.PackageList[0].OrderList[0].ProducePeriod;
          }
        }
        return {
          FileCount: this.FileCount,
          FileContent: Content,
          OutPlateNo: OutPlate && OutPlate.Second ? OutPlate.Second : '',
          ProducePeriod,
        };
      }
      return null;
    },
    Address() {
      if (
        this.OrderPreData
        && Array.isArray(this.OrderPreData.PackageList)
        && this.OrderPreData.PackageList.length > 0
        && this.OrderPreData.PackageList[0].Address
        && this.OrderPreData.PackageList[0].Address.Address
      ) {
        return this.OrderPreData.PackageList[0].Address;
      }
      return null;
    },
    ProductParams() {
      if (!this.localVisible) return null;
      if (
        this.requestObj
        && this.requestObj.List
        && this.requestObj.List.length > 0
      ) {
        const { ProductParams } = this.requestObj.List[0];
        if (ProductParams) return ProductParams;
      }
      return {};
    },
    MinimumCost() {
      return this.OrderPreData ? +(this.OrderPreData.MinimumCost.toFixed(2)) : '';
    },
    FullPayout() {
      return this.OrderPreData ? +(this.OrderPreData.FullPayout.toFixed(2)) : '';
    },
    ProductPrice() {
      return this.OrderPreData ? this.OrderPreData.ProductPrice : '';
    },
    onLineAmount() {
      if (!this.PayInFull) return this.MinimumCost;
      return this.FullPayout;
    },
    PayOnDelivery() {
      if ((this.ProductPrice || this.ProductPrice === 0) && (this.onLineAmount || this.onLineAmount === 0)) {
        return +((this.ProductPrice - this.onLineAmount).toFixed(2));
      }
      return '';
    },
    FundBalance() {
      return this.OrderPreData ? this.OrderPreData.FundBalance : '';
    },
  },
  data() {
    return {
      PayInFull: false,
    };
  },
  methods: {
    onOpen() {
      console.log('onOpen 初始化渲染数据');
      this.$store.dispatch('common/getExpressList');
    },
    onClosed() {
      console.log('onClosed 还原部分状态');
    },
    onSubmit() {
      this.$emit('submit', { ...this.requestObj, PayInFull: this.PayInFull });
    },
  },
};
</script>
<style lang='scss'>
.el-dialog__wrapper {
  > .mp-place-order-panel-comp-order-submit-comfirm-dialog-comp-wrap {
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
      > button {
        top: 15px;
        font-weight: 100;
      }
    }
    > .el-dialog__body {
      margin-left: 0px;
      margin-right: 0px;
      padding-bottom: 25px;
      margin-left: 15px\0;
      margin-right: 15px\0;
      padding-top: 20px;
      > main {
        height: 490px;
        text-align: center;
        > div {
          display: inline-block;
          vertical-align: top;
          text-align: left;
          &.left {
            width: 380px;
            height: 100%;
          }
          &.right {
            width: 300px;
            margin-left: 20px;
            > div {
              &.express {
                height: 200px;
              }
              &.order {
                height: 270px;
                margin-top: 20px;
              }
            }
          }
          .mp-place-order-panel-comp-order-submit-comfirm-dialog-panel-item-comp-wrap {
            .panel-content {
              ul.display-box {
                padding-top: 8px;
                > li {
                  width: 100%;
                  margin-top: 8px;
                  line-height: 22px;
                  > span.label {
                    color: #888;
                    float: left;
                    margin-right: 2px;
                  }
                  > div.text {
                    color: #585858;
                    font-size: 12px;
                    overflow: hidden;
                    min-height: 22px;
                  }
                }
              }
              > ul.content {
                height: 365px;
                overflow-y: auto;
              }
              > div.footer {
                height: 75px;
              }
            }
          }
        }
      }
      > footer {
        text-align: right;
        margin-top: 20px;
        padding-right: 10px;
        > ul {
          padding-right: 2px;
          padding-bottom: 12px;
          > li {
            padding: 4px 0;
            line-height: 20px;
            > .content {
              min-width: 120px;
              display: inline-block;
              &.is-bold {
                font-size: 18px;
              }
            }
            > .label {
              color: #888;
            }
          }
        }
        > button {
          height: 35px;
          width: 120px;
          line-height: 33px;
          padding: 0;
          margin-left: 45px;
          & + button {
            margin-left: 45px;
          }
        }
      }
    }
  }
}
</style>
