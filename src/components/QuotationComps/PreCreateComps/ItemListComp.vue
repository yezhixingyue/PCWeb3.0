<template>
  <div class="mp-pc-pre-create-order-list-item-wrap">
    <div class="product-item-header">
      <div class="product-item-header-left">
        <span class="product-item-header-amount-box gray is-font-14">产品金额：<i class="is-pink"
          >{{data.OrderList[0].FinalPrice}}元</i></span>
        <span class="freight-box"> <i class="gray">运费：</i>{{data.Freight}}元</span>
        <span class="add-detail"><i class="gray">配送地址：</i>{{getAddress(data.Address.Address)}}</span>
      </div>
      <div class="product-item-header-right" @click="handleCollapse">
        <div :class="isActive ? 'active' : ''"></div>
      </div>
    </div>
    <TransitionGroupCollapse tag="ul" class="has-transition"> <!-- 子列表部分 -->
      <li
        class="product-item-content has-transition"
        key='product-item-content-1'
        v-show="isActive"
      >
        <div :style="wStyles[0]" class="is-twelve">{{getProductName(data.OrderList[0])}}</div>
        <div :style="wStyles[1]">{{getProductCount(obj2GetProductPrice.ProductParams)}}</div>
        <div :style="wStyles[2]">{{data.OrderList[0].OriginalPrice}}元</div>
        <div :style="wStyles[3]">{{ selectedCoupon ? selectedCoupon.Amount : 0}}元</div>
        <div :style="wStyles[4]">{{data.OrderList[0].FinalPrice}}元</div> <!-- 成交价 -->
        <div :style="wStyles[5]">{{data.OrderList[0].DepositAmount}}元</div> <!-- 定金 -->
        <div :style="wStyles[6]" class="is-font-12 is-pink">{{data.OrderList[0].ProducePeriod | getPayTime}}
          {{data.OrderList[0].ProducePeriod | getDoneTime}}</div> <!-- 工期 -->
        <div :style="wStyles[7]" class="is-font-12 gray">{{curFileContent}}</div>
      </li>
    </TransitionGroupCollapse>
  </div>
</template>

<script>
import TransitionGroupCollapse from '@/components/common/TransitionGroupCollapse.vue';
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
    TransitionGroupCollapse,
  },
  computed: {
    ...mapState('Quotation', ['obj2GetProductPrice', 'selectedCoupon', 'curFileContent']),
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
    getProductCount({ ProductAmount, Unit, KindCount }) {
      return `${ProductAmount}${Unit}${KindCount}款`;
    },
    // eslint-disable-next-line object-curly-newline
    getAddress({ AddressDetail, Consignee, Mobile, ExpressArea }) {
      const { RegionalName, CityName, CountyName } = ExpressArea;
      return `${RegionalName}${CityName}${CountyName}${AddressDetail} (${Consignee} ${Mobile})`;
    },
  },
};
</script>

<style lang='scss'>
.mp-pc-pre-create-order-list-item-wrap {
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 12px;
  border: 1px solid #eee;
  // overflow: hidden;
  // border-bottom: none;
  box-sizing: border-box;

  .product-item-header {
    background-color: rgb(248, 248, 248);
    display: flex;
    justify-content: space-between;
    .product-item-header-left {
      height: 36px;
      line-height: 35px;
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
      display: inline-block\0;
      cursor: pointer;
      > div {
        height: 12px;
        width: 7px;
        position: absolute;
        top: 50%;
        left: 50%;
        transition: 0.25s !important;
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
      height: 35px;
      width: 2px;
      background-color: #428dfa;
    }
  }
  .product-item-content {
    height: 70px;
    // line-height: 44px;
    white-space: nowrap;
    display: flex;
    border-bottom: none;
    // padding: 13px 0;
    // border-top: 1px solid #eee;
    &:hover > div {
      background-color: #ebf7ff;
    }
    > div {
      white-space: nowrap;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
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
