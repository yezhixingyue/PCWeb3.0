<template>
  <el-dialog
    :visible.sync="localVisible"
    width="850px"
    custom-class="mp-place-order-panel-comp-order-submit-comfirm-dialog-comp-wrap"
    v-dialogDrag
    @open="onOpen"
    :top="top"
    :close-on-click-modal='false'
    :before-close='handleBeforeClose'
     :class="{e: isFullType}"
    @closed="onClosed"
  >
    <header slot="title">
      <span v-if="!isFullType">{{!isSubmitType ? '订单详情' : '订单信息'}}</span>
    </header>
    <main v-if="isFullType">
      <el-tabs
        v-model="activeName"
        class="order-list-tabs-box"
        type="card"
        @tab-click="handleTableClick"
      >
        <el-tab-pane label="订单详情" name="detail" :disabled='loading'>
          <DetailComp class='is-detail' v-loading='loading' element-loading-text="正在加载中..." :OrderDetail='OrderDetailData' />
        </el-tab-pane>
        <el-tab-pane label="包裹列表" name="package" :disabled='loading'>
          <OrderPackageList :PackageDataList='PackageDataList' :isListloading='loading' v-loading='loading' element-loading-text="正在加载中..." />
        </el-tab-pane>
        <el-tab-pane label="查看进度" name="progress" :disabled='loading'>
          <OrderProgress :ProgressData='ProgressData' v-loading='loading' element-loading-text="正在加载中..." />
        </el-tab-pane>
      </el-tabs>
    </main>
    <DetailComp
     v-else
     :class="{'is-detail': !isSubmitType}" v-loading='loading' element-loading-text="正在加载中..."
     :ProductParams='ProductParams'
     :orderInfo='orderInfo'
     :OrderDetail='OrderDetailData'
     :OrderPreData='OrderPreData'
     :isSubmitType='isSubmitType'
     :isCar='isCar'
     />
    <footer>
      <template  v-if="OrderPreData && isSubmitType">
        <TipsBox onlyTips />
        <ul>
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
      </template>
      <div v-else class="detail-footer-box">
        <el-button :disabled="loading" class="close" @click="localVisible = false">关闭</el-button>
        <el-button :disabled="loading" v-if="submitLabel" type="primary" @click="onDetailSubmitClick">{{submitLabel}}</el-button>
      </div>
    </footer>
  </el-dialog>
</template>

<script>
import TipsBox from '@/components/QuotationComps/QuotationContent/Comps/TipsBox';
import OrderProgress from '@/components/OrderListComps/OrderDetail/OrderProgress.vue';
import OrderPackageList from '@/components/OrderListComps/OrderDetail/OrderPackageList.vue';
import DetailComp from './DetailComp.vue';

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
    OrderDetail: {
      type: Object,
      default: null,
    },
    top: {
      type: String,
      default: '70px',
    },
    submitLabel: {
      type: String,
      default: '',
    },
    isCar: {
      type: Boolean,
      default: false,
    },
    isSubmitType: {
      type: Boolean,
      default: false,
    },
    isFullType: { // 全状态弹窗
      type: Boolean,
      default: false,
    },
    OrderID: {
      type: Number,
      default: null,
    },
  },
  components: {
    TipsBox,
    DetailComp,
    OrderProgress,
    OrderPackageList,
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
      const price = this.OrderPreData ? +(this.OrderPreData.PayOnDelivery.toFixed(2)) : '';
      if (!this.PayInFull) return price;
      return 0;
    },
    FundBalance() {
      return this.OrderPreData ? this.OrderPreData.FundBalance : '';
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
    orderInfo() {
      if (
        this.OrderPreData
        && this.requestObj
        && this.requestObj.List
        && this.requestObj.List.length > 0
      ) {
        const { Content, OutPlate } = this.requestObj.List[0];
        let ProducePeriod = null;
        let Weight = null;
        if (
          this.OrderPreData
          && Array.isArray(this.OrderPreData.PackageList)
          && this.OrderPreData.PackageList.length > 0
          && this.OrderPreData.PackageList[0].OrderList
          && this.OrderPreData.PackageList[0].OrderList.length > 0
        ) {
          const t = this.OrderPreData.PackageList[0].OrderList[0];
          if (t.ProducePeriod) ProducePeriod = t.ProducePeriod;
          if (t.Weight) Weight = t.Weight;
        }
        return {
          FileCount: this.FileCount,
          FileContent: Content,
          OutPlateNo: OutPlate && OutPlate.Second ? OutPlate.Second : '',
          ProducePeriod,
          Weight,
        };
      }
      return null;
    },
    OrderDetailData() { // 综合详情数据
      return this.OrderDetail || this.localDetailData;
    },
    curOrderID() {
      return this.OrderID || (this.OrderDetail ? this.OrderDetail.OrderID : '');
    },
  },
  data() {
    return {
      PayInFull: false,
      localDetailData: null,
      loading: false,
      activeName: '',
      ProgressData: null,
      PackageDataList: null,
    };
  },
  methods: {
    onOpen() {
      this.$store.dispatch('common/getExpressList');
      this.getLocalDetailData();
      if (this.isFullType) this.activeName = 'detail';
    },
    onClosed() {
      this.localDetailData = null;
      this.ProgressData = null;
      this.PackageDataList = null;
    },
    handleBeforeClose(done) {
      if (!this.loading) done();
    },
    onSubmit() {
      this.$emit('submit', { ...this.requestObj, PayInFull: this.PayInFull });
    },
    onDetailSubmitClick() {
      this.$emit('submit');
    },
    async getLocalDetailData() { // 获取订单数据
      if (!this.OrderID || this.localDetailData) return;
      this.localDetailData = null;
      this.loading = true;
      const resp = await this.api.getOrderDetail(this.OrderID, true).catch(() => null);
      this.loading = false;
      if (resp && resp.data.Status === 1000) {
        this.localDetailData = resp.data.Data;
      } else if (!this.isFullType) {
        this.localVisible = false;
      }
    },
    async getProgressData() { // 获取进度条数据
      if (!this.curOrderID || this.ProgressData) return;
      this.ProgressData = null;
      this.loading = true;
      const res = await this.api.getOrderProgress(this.curOrderID, true).catch(() => null);
      this.loading = false;
      if (res && res.data.Status === 1000) {
        this.ProgressData = res.data.Data.filter(it => it.FinishPercent !== 0 || it.ShowFocus).reverse();
      }
    },
    async getLocalPackageData() { // 获取包裹列表数据
      if (!this.curOrderID || this.PackageDataList) return;
      this.PackageDataList = null;
      this.loading = true;
      const res = await this.api.getOrderPackageList(this.curOrderID, true).catch(() => null);
      this.loading = false;
      if (res && res.data.Status === 1000) {
        const _list = [...res.data.Data];
        this.PackageDataList = _list;
      }
    },
    handleTableClick() {
      switch (this.activeName) {
        case 'progress':
          this.getProgressData();
          break;
        case 'detail':
          this.getLocalDetailData();
          break;
        case 'package':
          this.getLocalPackageData();
          break;
        default:
          break;
      }
    },
  },
};
</script>
<style lang='scss'>
.el-dialog__wrapper {
  > .mp-place-order-panel-comp-order-submit-comfirm-dialog-comp-wrap {
    display: table;
    border-radius: 5px;
    margin-bottom: 10px;
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
      main.mp-common-detail-comp-wrap {
        height: 490px;
        text-align: center;
        display: block;
        > div {
          display: inline-block;
          vertical-align: top;
          text-align: left;
          &.left {
            width: 480px;
            height: 100%;
          }
          &.right {
            width: 300px;
            margin-left: 20px;
            margin-left: 10px\0;
            > div {
              &.express {
                height: 200px;
              }
              &.order {
                height: 270px;
                margin-top: 20px;
                // margin-top: 15px\0;
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
                height: 350px;
                overflow-y: auto;
              }
              > div.footer {
                height: 75px;
              }
            }
          }
        }
        &.is-detail {
          height: 590px;
          > div .mp-place-order-panel-comp-order-submit-comfirm-dialog-panel-item-comp-wrap .panel-content > ul.content {
            height: 410px;
            margin-bottom: 10px;
          }
          > div.right > div {
            &.express {
              height: 235px;
            }
            &.order {
              height: 335px;
            }
          }
        }
      }
      > main {
        .order-list-tabs-box {
          .el-tabs__header {
            // margin: 0 20px;
            margin-right: 20px;
            user-select: none;
            margin-bottom: 0;
            .el-tabs__item {
              background-color: #f5f5f5;
              border-color: #e6e6e6;
              color: #444444;
              height: 36px;
              line-height: 36px;
              width: 120px;
              text-align: center;
              box-sizing: border-box;
              &.is-active {
                border-bottom: none;
                background-color: #ffffff;
                color: #428dfa;
                position: relative;
                border-radius: 0%;
                &::before {
                  content: "";
                  display: block;
                  height: 3px;
                  width: calc(100% + 2px);
                  background-color: #428dfa;
                  position: absolute;
                  top: -1px;
                  left: -1px;
                  border-radius: 1.5px;
                  z-index: 99;
                }
              }
            }
          }
          .el-tabs__content {
            padding: 28px 0 12px;
            height: 590px;
            width: 810px;
            .mp-common-detail-comp-wrap.is-detail {
              > .left {
                width: 480px;
              }
              > .right {
                width: 300px;
              }
            }
            .mp-pc-order-detail-page-progress-comp-wrap {
              > header {
                display: none;
              }
              > ul.content {
                padding-left: 80px;
                max-height: 510px;
                height: 510px;
                padding-bottom: 0;
              }
            }
            .mp-pc-order-detail-page-package-list-comp-wrap {
              width: 740px;
              > header {
                display: none;
              }
              > .content {
                padding: 20px 8px;
                padding-top: 10px;
                height: 530px;
                .el-table__header .cell {
                  font-size: 13px;
                }
                .el-table__body .cell {
                  font-size: 12px;
                  .num {
                    font-size: 14px;
                  }
                }
              }
            }
          }
          &::after {
            width: 20px;
            height: 1px;
            content: "";
            position: absolute;
            background-color: #e6e6e6;
            top: 56px;
            left: 0px;
            z-index: 99;
          }
        }
      }
      > footer {
        text-align: right;
        margin-top: 8px;
        padding-right: 10px;
        > .mp-quotation-content-tips-box-comp-wrap {
          width: 790px;
          margin-left: 8px;
          max-height: 60px;
          overflow-y: auto;
          padding-top: 0px;
          padding-bottom: 13px;
          > .tips {
            margin: 0;
            > li {
              color: #f4a107;
            }
          }
        }
        > ul {
          padding-right: 2px;
          padding-bottom: 13px;
          > li {
            padding: 3px 0;
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
        button {
          height: 35px;
          width: 120px;
          line-height: 33px;
          padding: 0;
          margin-left: 45px;
          & + button {
            margin-left: 45px;
          }
        }
        .detail-footer-box {
          text-align: right;
          padding-top: 25px;
          padding-right: 1px;
          height: 35px;
          button{
            &.close {
              color: #428dfa;
              border-color: #428dfa;
            }
            margin-left: 30px;
          }
        }
      }
      .el-loading-spinner {
        top: 43%;
        .circular {
          width: 30px;
          height: 30px;
        }
        p {
          font-size: 13px;
          margin-top: 8px;
        }
      }
      .single-row {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        .text {
          text-overflow: ellipsis;
        }
      }
    }
  }
  &.e {
    > .el-dialog {
      > .el-dialog__header > header {
        height: 20px;
        padding: 0;
        border: none;
      }
      > .el-dialog__body {
        padding-top: 0;
      }
    }
  }
}
</style>
