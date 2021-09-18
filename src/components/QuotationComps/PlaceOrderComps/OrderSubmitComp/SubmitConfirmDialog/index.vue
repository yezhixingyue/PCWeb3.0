<template>
  <el-dialog
    :visible.sync="localVisible"
    width="760px"
    custom-class="mp-place-order-panel-comp-order-submit-comfirm-dialog-comp-wrap"
    v-dialogDrag
    @open="onOpen"
    @closed="onClosed"
  >
    <header slot="title">
      <span>订单信息</span>
    </header>
    <main>
      <div class="left">
        <ProductInfoComp :ProductParams='ProductParams' :curProductInfo2Quotation='curProductInfo2Quotation' />
      </div>
      <div class="right">
        <ExpressInfoComp :Address='Address' :ExpressList='ExpressList' />
        <OrderInfoComp :orderInfo='orderInfo' />
      </div>
    </main>
    <footer>
      <span class="blue-span" @click="localVisible = false">取消</span>
      <el-button type="primary" @click="onSubmit">确认提交</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex';
import ProductInfoComp from './ProductInfoComp.vue';
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
      if (this.OrderPreData && this.requestObj && this.requestObj.List && this.requestObj.List.length > 0) {
        const { Content, OutPlate } = this.requestObj.List[0];
        let ProducePeriod = null;
        if (this.OrderPreData
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
      if (this.OrderPreData
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
      if (this.requestObj && this.requestObj.List && this.requestObj.List.length > 0) {
        const { ProductParams } = this.requestObj.List[0];
        if (ProductParams) return ProductParams;
      }
      return {};
    },
  },
  data() {
    return {
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
      console.log('onSubmit');
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
              > ul {
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
            }
          }
        }
      }
      > footer {
        text-align: right;
        margin-top: 58px;
        padding-right: 10px;
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
