<template>
    <div class="mp-pc-order-list-page-table-item-comp-wrap">
      <div class="product-item-header" :class="{visible: fixedLeft || fixedRight}"
       :style="`margin-right:${fixedLeft ? -(1198 - Object.values(this.widthObj)[0]) : 0}px`">
        <div class="product-item-header-left" v-if="fixedLeft">
          <span class="product-item-header-amount-box gray is-font-14">产品金额：<i class="is-pink"
            >{{totalOriginalPrice}}元</i></span>
          <span class="freight-box" v-if="OutPlatNo"> <i class="gray">平台单号：</i><em class="is-font-12">{{OutPlatNo}}</em></span>
          <span class="freight-box"> <i class="gray">运费：</i>{{totalFreight}}元</span>
          <span class="add-detail">
            <i class="express-box">{{data.Address.ExpressText}}</i>
            <i class="gray">配送地址：</i>{{localAddressDetail}}
          </span>
        </div>
        <div class="product-item-header-right" @click="handleCollapse">
          <div :class="isActive ? 'active' : ''"></div>
        </div>
        <span style="display:none" class="product-item-header-set-active" @click="handleActive"></span>
      </div>
      <TransitionGroupCollapse4ShopCar tag="ul" class="mp-group-collapse-for-shop"> <!-- 子列表部分 -->
        <li
          class="product-item-content has-transition"
          :class="{hover: curHoverOrderID === item.OrderID, 'hide-border-item': i === data.length - 1}"
          v-show="isActive"
          v-for="(item, i) in data.OrderList"
          :key="item.OrderID"
          @mouseenter="onItemMouseEnter(item.OrderID)"
          @mouseleave="onItemMouseLeave(item.OrderID)"
        >
          <div :style="wStyles[0]" v-if="!fixedRight" :class="{hide: !fixedLeft}">{{item.OrderID}}</div>
          <template v-if="!fixedLeft && !fixedRight">
            <div :style="wStyles[1]">
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
                :content="item.MaterialList | formatListItemMaterial" placement="top-start">
                <span>{{item.MaterialList | formatListItemMaterial}}</span>
              </el-tooltip>
            </div>
            <div :style="wStyles[4]">
              <el-tooltip popper-class="table-item" :enterable='false'
                :content="item.CraftList | formatListItemCraft" placement="top-start">
                <span>{{item.CraftList | formatListItemCraft}}</span>
              </el-tooltip>
            </div>
            <div :style="wStyles[5]">
              <el-tooltip popper-class="table-item" :enterable='false'
                :content="item | formarProductAmount" placement="top-start">
                <span>{{item | formarProductAmount}}</span>
              </el-tooltip>
            </div>
            <div :style="wStyles[6]" class="is-font-12 gray">
              <el-tooltip popper-class="table-item" :enterable='false' v-if="item.Content"
                :content="item.Content" placement="top-start">
                <span>{{item.Content}}</span>
              </el-tooltip>
              <span v-else>无</span>
            </div>
            <div :style="wStyles[7]" :class="{
              'is-font-12': 1,
              'yellow-color': 1,
              'is-gray': [254, 255, 35].includes(item.Status),
              'is-success': item.Status === 200,
            }">{{item.Status | formatStatus}}</div>
            <div :style="wStyles[8]">{{item.Funds.FinalPrice}}元</div>
            <div :style="wStyles[9]">
              <i v-if="item.Funds.CouponAmount>0">-</i>{{item.Funds.CouponAmount}}元</div>
            <div :style="wStyles[10]">{{item.Funds.HavePaid}}元</div>
            <div :style="wStyles[11]">{{item.Funds.Unpaid}}元</div>
            <div :style="wStyles[12]">{{item.Funds.Refund}}元</div>
            <div :style="wStyles[13]" class="is-font-12 gray">{{item.PayTime | format2MiddleLangTypeDate}}</div>
          </template>
          <div :style="wStyles[14]" class="is-font-12 gray btn-wrap" v-if="!fixedLeft" :class="{hide: !fixedRight}">
            <span class="span-title-blue" @click="goToDetailPage(item)">订单详情</span>
            <span class="span-title-blue" @click="goToFeedback(item)"
              v-if="item.AllowAfterSales">售后</span>
            <span class="is-cancel" :style="{paddingLeft:'6px', paddingRight:'6px'}" v-else>售后</span>
            <span class="span-title-pink" @click="handleOrderCancel(item)"
              v-if="[20, 30, 35, 40].includes(item.Status)">取消</span>
            <span class="is-cancel" :style="{paddingLeft:'6px', paddingRight:'6px'}" v-else>取消</span>
          </div>
        </li>
      </TransitionGroupCollapse4ShopCar>
    </div>
</template>

<script>
import TransitionGroupCollapse4ShopCar from '@/components/common/TransitionGroupCollapse4ShopCar.vue';
import { mapState } from 'vuex';

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
    fixedLeft: {
      type: Boolean,
      default: false,
    },
    fixedRight: {
      type: Boolean,
      default: false,
    },
    curHoverOrderID: {
      type: Number,
      default: null,
    },
  },
  components: {
    // Test,
    TransitionGroupCollapse4ShopCar,
  },
  computed: {
    ...mapState('shoppingCar', ['curShoppingCarDataBeforeFirstPlace']),
    wStyles() {
      return Object.values(this.widthObj).map((item) => `width: ${item}px`);
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
  },
  data() {
    return {
      isActive: true,
      curOrderID4Detail: null,
    };
  },
  methods: {
    handleCollapse() {
      const oWraps = document.getElementsByClassName(`${this.data.ID}`);
      console.log(oWraps);
      if (oWraps.length > 0) {
        oWraps.forEach(oWrap => {
          const tDom = oWrap.getElementsByClassName('product-item-header-set-active')[0];
          // console.log(tDom);
          tDom.click();
        });
      }
    },
    handleActive() {
      this.isActive = !this.isActive;
    },
    // eslint-disable-next-line object-curly-newline
    getAddress({ AddressDetail, Consignee, Mobile, ExpressArea }) {
      const { RegionalName, CityName, CountyName } = ExpressArea;
      const _obj = {};
      _obj.First = `${RegionalName}${CityName}${CountyName}${AddressDetail}`;
      _obj.Second = `（${Consignee} ${Mobile}）`;
      return _obj;
    },
    goToDetailPage(data) {
      if (!data) return;
      // this.$store.commit('order/setCurOrderDetailData', { ...data, OutPlate: this.data.OutPlate, Address: this.data.Address });
      // this.$router.push('/order/detail');
      this.$emit('detail', data.OrderID);
    },
    goToFeedback(item) {
      this.$router.push({ name: 'feedback', query: { data: JSON.stringify(item) } });
    },
    handleOrderCancel({ OrderID }) {
      this.messageBox.warnCancelBox({
        title: '确定取消该订单吗?',
        msg: `订单号：[ ${OrderID} ]`,
        successFunc: () => {
          this.cancelOrder(OrderID);
        },
      });
    },
    async cancelOrder(OrderID) {
      const res = await this.api.getOrderCancle(OrderID).catch(() => null);
      if (res && res.data.Status === 1000) {
        this.messageBox.successSingle({
          title: '取消成功',
          successFunc: () => {
            this.$store.commit('order/handleCancelOrder', [OrderID, this.data.ID]);
            this.$store.dispatch('common/getCustomerFundBalance');
          },
        });
      }
    },
    onItemMouseEnter(OrderID) {
      this.$emit('itemHover', OrderID);
    },
    onItemMouseLeave(OrderID) {
      this.$emit('itemHoverLeave', OrderID);
    },
  },
};
</script>

<style lang='scss'>
.mp-pc-order-list-page-table-item-comp-wrap {
  margin-top: 20px;
  font-size: 12px;
  box-sizing: border-box;

  .product-item-header {
    background-color: rgb(248, 248, 248);
    display: flex;
    justify-content: space-between;
    border-top: 1px solid rgba($color: #000000, $alpha: 0);
    border-bottom: 1px solid #eee;
    visibility: hidden;
    &.visible {
      visibility: visible;
    }
    // width: 1150px;
    .product-item-header-left {
      height: 36px;
      line-height: 36px;
      padding-left: 30px;
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
        &.product-item-header-amount-box {
          margin-right: 25px;
          > i {
            display: inline-block;
            min-width: 60px;
            text-align: left;
          }
        }
        &.freight-box {
          margin-right: 40px;
          font-size: 14px;
        }
        &.add-detail {
          max-width: 550px;
        }
        > i.express-box {
          margin-right: 32px;
        }
      }
    }
    .product-item-header-right {
      height: 35px;
      width: 25px;
      margin-right: 22px;
      position: relative;
      flex: none;
      display: inline-block\0;
      cursor: pointer;
      user-select: none;
      > div {
        height: 12px;
        width: 12px;
        position: absolute;
        top: 50%;
        left: 50%;
        transition: 0.05s !important;
        transform: translate(-50%, -50%) rotate(90deg);
        background: url("../../../assets/images/r.png") center
          no-repeat;
        background-size: 100% 100%;
        &.active {
          transform: translate(-50%, -50%) rotate(-90deg);
        }
      }
    }
    &::before {
      content: '';
      display: inline-block;
      height: 36px;
      width: 3px;
      background-color: #428dfa;
    }
  }
  .product-item-content {
    height: 40px;
    // padding: 13px 0;
    box-sizing: border-box;
    vertical-align: middle;
    white-space: nowrap;
    display: flex;
    border-bottom: none;
    // border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    &.hover > div, &:hover > div {
      background-color: #ebf7ff;
    }
    > div {
      white-space: nowrap;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
      // padding: 20px 0;
      padding-right: 6px;
      box-sizing: border-box;
      flex: none;
      font-size: 12px;
      color: #585858;
      line-height: 30px;
      padding-top: 5px;
      height: 100%;
      box-sizing: border-box;
      display: inline-block\0;
      // transition: width 0.1s ease-in-out;
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
        > span {
          margin: 0 1px;
        }
      }
      visibility: visible;
      &.hide {
        visibility: hidden;
      }
    }
  }
}
</style>
