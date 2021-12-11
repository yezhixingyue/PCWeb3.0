<template>
    <div class="mp-pc-new-unpay-list-page-table-item-comp-wrap" ref="oItemWrap">
      <div class="product-item-header">
        <div class="product-item-header-left">
          <el-checkbox v-model="checked" :disabled='this.data.isCanceled || this.data.isPaid'>
            <span class="product-item-header-amount-box gray is-font-14">付款单号：<i>{{this.data.PayCode}}</i></span>
          </el-checkbox>
          <span class="freight-box" style="min-width:150px"> <i class="gray">产品总金额：</i><em class="is-pink">{{totalOriginalPrice}}元</em></span>
          <span class="freight-box"> <i class="gray">总运费：</i>{{totalFreight}}元</span>
          <!-- <span class="freight-box"> <i class="gray">总重量：</i>{{this.data._Weight}}kg</span> -->
        </div>
        <div class="product-item-header-right" >
          <span class="is-gray status" v-if="this.data.isCanceled">已取消</span>
          <span class="is-success status" v-else-if="this.data.isPaid">已付款</span>
          <span class="is-pink status" v-else>未付款</span>
          <span class="span-title-blue" @click="handlePayClick" :class="{disabled: this.data.isCanceled || this.data.isPaid}">付款</span>
          <span class="span-title-blue cancel" @click="handleOrderCancel" :class="{disabled: this.data.isCanceled || this.data.isPaid}">取消</span>
          <div @click="handleCollapse" class="arrow-wrap">
            <span>{{ !isActive ? '展开' : '收起' }}</span>
            <div :class="isActive ? 'active arrow' : 'arrow'">
            </div>
          </div>
        </div>
      </div>
      <TransitionGroupCollapse4ShopCar tag="ul" :className="{'mp-group-collapse-for-shop': true, isClose: !isActive}"
       :h='contentHeight' key="mp-group-collapse-for-shop"> <!-- 子列表部分 -->
        <li
          class="product-item-content has-transition"
          v-show="isActive"
          v-for="(Package, i) in data.PackageList"
          :key="Package.ID"
          :class="i === 0 ? 'f' : ''"
        >
          <ul class="package-header">
            <li class="price">
              <label>产品金额：</label>
              <span class="is-pink">{{Package.ProductPrice | formatNumber}}元</span>
            </li>
            <li class="freight">
              <label>运费：</label>
              <span>{{Package.Freight | formatNumber}}元</span>
              <span> ( {{Package.Weight | formatNumber}}kg )</span>
            </li>
            <li class="express">
              <span>{{Package.Address.ExpressText}}</span>
            </li>
            <li class="address">
              <label>配送地址：</label>
              <span>{{Package.Address.Address.Consignee}}（ {{Package.Address.Address.Mobile}} ） </span>
              <span :title="getAddressDetail(Package.Address.Address)">{{getAddressDetail(Package.Address.Address)}}</span>
            </li>
          </ul>
          <ul class="package-content">
            <li v-for="item in Package.OrderList" :key="item.OrderID">
              <div :style="wStyles[0]"></div>
              <div :style="'width:' + (widthObj.w2 + 20) + 'px' + ';text-align:left;margin-left:-22px;'">
                <el-tooltip popper-class="table-item" :enterable='false'
                  :content="item | getFullName" placement="top-start">
                  <span>{{item | getFullName}}</span>
                </el-tooltip>
              </div>
              <div :style="wStyles[2]">
                <el-tooltip popper-class="table-item" :enterable='false'
                  :content="item.SizeList | formatListItemSize" placement="top-start">
                  <span>{{item.SizeList | formatListItemSize}}</span>
                </el-tooltip>
              </div>
              <div :style="wStyles[3]">
                <el-tooltip popper-class="table-item" :enterable='false'
                  :content="item | formarProductAmount" placement="top-start">
                  <span>{{item | formarProductAmount}}</span>
                </el-tooltip>
              </div>
              <div :style="wStyles[4]">
                <el-tooltip popper-class="table-item" :enterable='false'
                  :content="item.CraftList | formatListItemCraft" placement="top-start">
                  <span>{{item.CraftList | formatListItemCraft}}</span>
                </el-tooltip>
              </div>
              <div :style="wStyles[5]">{{item.Funds.OriginalPrice}}元</div>
              <div :style="wStyles[6]" class="is-twelve">
                <i v-if="item.Funds.CouponAmount>0">-</i>{{item.Funds.CouponAmount}}元</div>
              <div :style="wStyles[7]">{{item.Funds.FinalPrice}}元</div>
              <div :style="wStyles[8]">{{item.Funds.Deposit}}元</div>
              <div :style="wStyles[9]">{{Package.OutPlate ? Package.OutPlate.Second : ''}}</div>
              <div :style="wStyles[10]" class="is-font-12 gray" style="text-align:left">
                <el-tooltip popper-class="table-item" :enterable='false' v-if="item.Content"
                  :content="item.Content" placement="top-start">
                  <span>{{item.Content}}</span>
                </el-tooltip>
                <span v-else>无</span>
              </div>
              <div :style="wStyles[11]" class="is-font-12 gray btn-wrap">
                <span class="span-title-blue" @click="goToDetailPage(item)">详情</span>
              </div>
            </li>
          </ul>
        </li>
      </TransitionGroupCollapse4ShopCar>
      <CancelDialogBox :visible.sync='cancelVisivle' v-model="cancelObj" @submit="submitCancelOrder" />
    </div>
</template>

<script>
import TransitionGroupCollapse4ShopCar from '@/components/common/TransitionGroupCollapse4ShopCar.vue';
import { mapState } from 'vuex';
import CancelDialogBox from './CancelDialogBox.vue';

export default {
  props: {
    /**
     * 需要传入的宽度对象，用以告诉组件内每个自动伸缩宽度元素的宽度值
     */
    widthObj: {
      type: Object,
      default: () => ({}),
    },
    /**
     * 需要渲染的数据信息
     */
    data: {
      type: Object,
      default: () => ({}),
    },
    /**
     * 是否需要禁用复选框
     */
    isDisabled: {
      type: Boolean,
      default: false,
    },
    /**
     * 当前项对应的客户编码
     */
    CustomerNo: {
      type: String,
    },
    value: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    TransitionGroupCollapse4ShopCar,
    CancelDialogBox,
  },
  computed: {
    ...mapState('shoppingCar', ['curShoppingCarDataBeforeFirstPlace']),
    wStyles() {
      const list = Object.values(this.widthObj);
      return list.map((item, i) => `width: ${item - (i === 0 || i === list.length - 1 ? 16 : 0)}px`);
    },
    totalOriginalPrice() {
      return +(this.data.ProductPrice.toFixed(2));
    },
    totalFreight() {
      return +(this.data.Freight.toFixed(2));
    },
    OutPlatNo() {
      return this.data.OutPlate && this.data.OutPlate.Second ? this.data.OutPlate.Second : '';
    },
    localAddressDetail() {
      if (!this.data || !this.data.Address || !this.data.Address.Address) return '';
      const { RegionalName, CityName, CountyName } = this.data.Address.Address.ExpressArea;
      const AddressDetail = this.data.Address.Address.AddressDetail || '';
      return `${RegionalName}${CityName}${CountyName}${AddressDetail}`;
    },
    checked: {
      get() {
        return this.value.includes(this.data.PayCode);
      },
      set(val) {
        const list = val ? [...this.value, this.data.PayCode] : this.value.filter(it => it !== this.data.PayCode);
        this.$emit('input', list);
      },
    },
  },
  data() {
    return {
      isActive: true,
      cancelVisivle: false,
      cancelObj: null,
      contentHeight: 70,
    };
  },
  methods: {
    handleCollapse() {
      this.isActive = !this.isActive;
    },
    getAddressDetail({ AddressDetail, ExpressArea }) {
      const { RegionalName, CityName, CountyName } = ExpressArea;
      return `${RegionalName}${CityName}${CountyName}${AddressDetail}`;
    },
    goToDetailPage(orderItem) {
      // this.$store.commit('unpayList/setCurUnpayListDetailData', { ...data, Weight: this.data._Weight });
      // this.$router.push('/unpay/detail');
      if (!orderItem || !orderItem.OrderID) return;
      this.$emit('detail', orderItem.OrderID);
    },
    handleOrderCancel() {
      if (!this.data || this.data.isCanceled || this.data.isPaid) return;
      this.cancelObj = {
        PayCode: this.data.PayCode,
        isAddPrepare: true,
      };
      this.cancelVisivle = true;
    },
    async submitCancelOrder() {
      const res = await this.api.getUnpayOrderCancle(this.cancelObj);
      if (res.data.Status === 1000) {
        this.messageBox.successSingle({
          title: '取消成功',
          successFunc: () => {
            this.$store.commit('unpayList/setMultipleOrderDataStatus', { allList: [this.data.PayCode] });
            this.$store.dispatch('common/getCustomerFundBalance');
          },
        });
      }
    },
    handlePayClick() {
      if (!this.data || this.data.isCanceled || this.data.isPaid) return;
      const {
        FullPayout, PayOnlineAmount, PayOnDelivery, BalanceAmount, PayQRCode, PayCode,
      } = this.data;
      this.$store.commit('Quotation/setCurPayInfo2Code', {
        Amount: PayOnlineAmount,
        BalanceAmount,
        PayOnDelivery,
        TotalAmount: FullPayout,
        PayCode,
        PayWay: {
          AllinPay: PayQRCode,
        },
      });
      this.$store.commit('Quotation/setIsShow2PayDialog', true);
    },
  },
  mounted() {
    if (this.$refs.oItemWrap) {
      const oContent = this.$refs.oItemWrap.getElementsByClassName('mp-group-collapse-for-shop')[0];
      if (oContent) {
        this.contentHeight = oContent.offsetHeight;
      }
    }
  },
};
</script>

<style lang='scss'>
.mp-pc-new-unpay-list-page-table-item-comp-wrap {
  margin-top: 20px;
  font-size: 12px;
  box-sizing: border-box;

  .product-item-header {
    background-color: #F0F6FF;
    display: flex;
    justify-content: space-between;
    // border-top: 1px solid rgba($color: #000000, $alpha: 0);
    // border-bottom: 1px solid #eee;
    .product-item-header-left {
      height: 36px;
      line-height: 36px;
      padding-left: 14px;
      display: flex;
      overflow: hidden;
      width: calc(100% - 32px);
      width: calc(100% - 82px)\0;
      display: inline-block\0;
      white-space: nowrap\0;
      > span {
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block\0;
        > .is-pink {
          font-size: 14px;
        }
        &.freight-box {
          margin-right: 40px;
          font-size: 14px;
          text-align: left;
        }
      }
      .el-checkbox {
        margin-right: 35px;
        .el-checkbox__label {
          padding-left: 20px;
          .product-item-header-amount-box {
            > i {
              color: #585858;
            }
          }
        }
      }
    }
    .product-item-header-right {
      height: 29px;
      width: 288px;
      margin-right: 12px;
      position: relative;
      flex: none;
      display: inline-block\0;
      cursor: pointer;
      user-select: none;
      > div.arrow-wrap {
        padding-left: 15px;
        display: inline-block;
        text-align: right;
        width: 60px;
        color: #a2a2a2;
        > div.arrow {
          height: 32px;
          width: 30px;
          position: absolute;
          top: calc(50% + 3px);
          right: -12px;
          transition: 0.05s !important;
          transform: translate(-50%, -50%) rotate(90deg);
          background: url("../../../assets/images/right-arrow.png") center no-repeat;
          background-size: 6px 10px;
          &.active {
            transform: translate(-50%, -50%) rotate(-90deg);
          }
        }
      }
      > span {
        display: inline-block;
        line-height: 32px;
        font-size: 14px;
        margin-left: 4px;
        &.status {
          width: 88px;
        }
        &.cancel {
          margin-left: 8px;
        }
      }
    }
    &::before {
      content: '';
      display: inline-block;
      height: 36px;
      width: 3px;
      background-color: #428dfa;
      vertical-align: top;
    }
  }
  > ul {
    padding: 0px 16px;
    padding-top: 15px;
    > li.product-item-content {
      box-sizing: border-box;
      vertical-align: middle;
      white-space: nowrap;
      border-bottom: none;
      margin-top: 15px;
      border: 1px solid #eee;
      > ul.package-header {
        height: 24px;
        padding: 5px 0;
        line-height: 24px;
        background-color: #f8f8f8;
        padding-left: 22px;
        li {
          padding-left: 20px;
          display: inline-block;
          color: #888;
          &.price {
            min-width: 128px;
          }
          &.freight {
            min-width: 120px;
          }
          &.address {
            vertical-align: top;
            max-width: 600px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          &.express {
            min-width: 72px;
          }
        }
      }
      > ul.package-content {
        > li {
          height: 70px;
          border-top: 1px solid #eee;
          box-sizing: border-box;
          &:hover > div {
            background-color: #ebf7ff;
          }
          > div {
            white-space: nowrap;
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: left;
            padding-right: 6px;
            box-sizing: border-box;
            flex: none;
            font-size: 12px;
            color: #585858;
            line-height: 30px;
            padding-top: 20px;
            height: 100%;
            box-sizing: border-box;
            display: inline-block;
            &.yellow-color {
              color: #f4a307;
            }
            .el-tooltip {
              max-width: 100%;
              display: inline-block;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            &.btn-wrap {
              padding-right: 0;
              padding-left: 4px;
              font-size: 14px !important;
            }
            &:last-of-type {
              text-align: center;
            }
          }
        }
      }
      &.f {
        margin-top: 0;
      }
    }
  }
}
</style>
