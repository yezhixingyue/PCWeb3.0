<template>
    <div class="mp-pc-pre-create-order-list-item-wrap shopping-car">
      <div class="product-item-header">
        <div class="product-item-header-left">
          <span class="product-item-header-amount-box gray is-font-14">产品金额：<i class="is-pink"
            >{{data.ProductPrice}}元</i></span>
          <span class="freight-box"> <i class="gray">运费：</i>{{data.Freight}}元</span>
          <span class="add-detail">
            <i class="gray">配送地址：</i>{{getAddress(data.Address.Address).First}}
            <i class="gray"> {{getAddress(data.Address.Address).Second}}</i></span>
        </div>
        <div class="product-item-header-right" @click="handleCollapse">
          <div :class="isActive ? 'active' : ''"></div>
        </div>
      </div>
      <TransitionGroupCollapse4ShopCar tag="ul" class="mp-group-collapse-for-shop"> <!-- 子列表部分 -->
        <li
          class="product-item-content has-transition"
          v-show="isActive"
          v-for="(item, i) in data.OrderList"
          :class="i === data.OrderList.length - 1 ? 'hide-border-item' : ''"
          :key="item.OrderID"
        >
          <div :style="wStyles[0]" class="is-twelve">{{getProductName(item)}}</div>
          <div :style="wStyles[1]">{{getProductCount(item.OrderID)}}</div>
          <div :style="wStyles[2]">{{item.OriginalPrice}}元</div>
          <div :style="wStyles[3]">{{ getCoupon(item.OrderID)}}</div>
          <div :style="wStyles[4]">{{item.FinalPrice}}元</div> <!-- 成交价 -->
          <div :style="wStyles[5]">{{item.DepositAmount}}元</div> <!-- 定金 -->
          <div :style="wStyles[6]" class="is-font-12 is-pink">{{item.ProducePeriod | getPayTime}}
          {{item.ProducePeriod | getDoneTime}}</div> <!-- 工期 -->
          <div :style="wStyles[7]" class="is-font-12 gray">{{getContent(item.OrderID)}}</div>
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
  },
  components: {
    // Test,
    TransitionGroupCollapse4ShopCar,
  },
  computed: {
    ...mapState('shoppingCar', ['curShoppingCarDataBeforeFirstPlace']),
    // ...mapState('common', ['Permission']),
    wStyles() {
      return Object.values(this.widthObj).map((item) => `width: ${item}px`);
    },
  },
  data() {
    return {
      isActive: true,
    };
  },
  methods: {
    handleCollapse() {
      this.isActive = !this.isActive;
    },
    getProductName({ FirstLevelName, SecondLevelName, ProductName }) {
      return `${FirstLevelName}-${SecondLevelName}-${ProductName}`;
    },
    getProductCount(OrderID) {
      if (!this.curShoppingCarDataBeforeFirstPlace) return '';
      const _t = this.curShoppingCarDataBeforeFirstPlace.find(it => it.OrderID === OrderID);
      if (!_t) return '';
      const { ProductAmount, KindCount, Attributes } = _t.ProductParams;
      const { Unit } = Attributes;
      return `${ProductAmount}${Unit}${KindCount}款`;
    },
    getCoupon(OrderID) {
      if (!this.curShoppingCarDataBeforeFirstPlace) return '';
      const _t = this.curShoppingCarDataBeforeFirstPlace.find(it => it.OrderID === OrderID);
      if (!_t) return '';
      const { CouponAmount } = _t.Funds;
      if (CouponAmount > 0) return `-${CouponAmount}元`;
      return '0元';
    },
    getContent(OrderID) {
      if (!this.curShoppingCarDataBeforeFirstPlace) return '';
      const _t = this.curShoppingCarDataBeforeFirstPlace.find(it => it.OrderID === OrderID);
      if (!_t) return '';
      const { Content } = _t;
      if (Content) return Content;
      return '';
    },
    // eslint-disable-next-line object-curly-newline
    getAddress({ AddressDetail, Consignee, Mobile, ExpressArea }) {
      const { RegionalName, CityName, CountyName } = ExpressArea;
      const _obj = {};
      _obj.First = `${RegionalName}${CityName}${CountyName}${AddressDetail}`;
      _obj.Second = `（${Consignee} ${Mobile}）`;
      return _obj;
    },
  },
};
</script>

<style lang='scss'>
.mp-pc-pre-create-order-list-item-wrap {
  padding-top: 20px;
  // padding-bottom: 20px;
  font-size: 12px;
  // border-top: 1px solid #eee;
  // border-bottom: 1px solid #eee;
  // border-bottom: none;
  box-sizing: border-box;
  &.shopping-car {
    margin: 0;
    // .product-item-header {
    //   // border-top: none;
    // }
    border: 1px solid #eee;
    border-top: none;
    // border-bottom: none;
  }

  .product-item-header {
    background-color: rgb(248, 248, 248);
    display: flex;
    justify-content: space-between;
    border-top: 1px solid rgba($color: #000000, $alpha: 0);
    border-bottom: 1px solid #eee;
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
        }
        &.freight-box {
          margin-right: 50px;
          font-size: 14px;
        }
        &.add-detail {
          max-width: 800px;
        }
      }
    }
    .product-item-header-right {
      height: 29px;
      width: 25px;
      margin-right: 22px;
      position: relative;
      flex: none;
      cursor: pointer;
      display: inline-block\0;
      > div {
        height: 12px;
        width: 7px;
        position: absolute;
        top: 50%;
        left: 50%;
        transition: 0.25s linear !important;
        transform: translate(-50%, -50%) rotate(0deg);
        background: url("../../../assets/images/right-arrow.png") center
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
    height: 70px;
    // padding: 13px 0;
    box-sizing: border-box;
    vertical-align: middle;
    white-space: nowrap;
    display: flex;
    border-bottom: none;
    // border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    &:last-of-type {
      border-bottom: none;
    }
    &:hover > div {
      background-color: #ebf7ff;
    }
    > div {
      white-space: nowrap;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
      // padding: 20px 0;
      transition: 0.2s;
      padding-right: 6px;
      box-sizing: border-box;
      flex: none;
      font-size: 14px;
      color: #585858;
      line-height: 30px;
      padding: 20px 0;
      display: inline-block\0;
    }
  }
}
</style>
