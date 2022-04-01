<template>
    <div class="mp-pc-pre-create-order-list-item-wrap shopping-car">
      <div class="product-item-header">
        <div class="product-item-header-left">
          <span class="product-item-header-amount-box gray is-font-14">产品金额：<i class="is-pink"
            >{{data.ProductPrice}}元</i></span>
          <span class="freight-box"> <i class="gray">运费：</i>{{data.Freight}}元</span>
          <span v-if="expressText" class="express-text">{{expressText}}</span>
          <span class="add-detail" v-if="addObj" :title="addTitle">
            <i class="gray">配送地址：</i>{{addObj.First}}
            <i class="gray"> {{addObj.Second}}</i></span>
        </div>
        <div class="product-item-header-right" @click="handleCollapse">
          <div :class="isActive ? 'active' : ''"></div>
        </div>
      </div>
      <ul class="mp-group-collapse-for-shop"> <!-- 子列表部分 -->
        <li
          class="product-item-content has-transition"
          v-show="isActive"
          v-for="(item, i) in data.OrderList"
          :class="i === data.OrderList.length - 1 ? 'hide-border-item' : ''"
          :key="item.OrderID + i"
        >
          <div :style="wStyles[0]" class="is-twelve" :title="item | getFullName">{{item | getFullName}}</div>
          <div :style="wStyles[1]" :title="item | formarProductAmount">{{item | formarProductAmount}}</div>
          <div :style="wStyles[2]">{{item.Funds.OriginalPrice | formatNumber}}元</div>
          <div :style="wStyles[3]">{{item.Funds.CouponAmount ? `-${item.Funds.CouponAmount}` : item.Funds.CouponAmount}}元</div>
          <div :style="wStyles[4]">{{item.Funds.FinalPrice | formatNumber}}元</div> <!-- 成交价 -->
          <div :style="wStyles[5]">{{item.Funds.Deposit | formatNumber}}元</div> <!-- 定金 -->
          <div :style="wStyles[6]" class="is-font-12 is-pink" style="text-align:left"
           >{{item.ProducePeriod | getPayTime}}{{item.ProducePeriod | getDoneTime}}</div> <!-- 工期 -->
          <div :style="wStyles[7]" class="is-font-12 gray">
            <span :title="item.Content || ''">{{item.Content || '无'}}</span>
          </div>
        </li>
      </ul>
    </div>
</template>

<script>
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
    subExpressList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
  },
  computed: {
    wStyles() {
      return Object.values(this.widthObj).map((item) => `width: ${item}px`);
    },
    expressText() {
      if (this.subExpressList.length > 0 && (this.data?.Address?.Express?.Second || this.data.Address.Express.Second === 0)) {
        const t = this.subExpressList.find(it => it.ID === this.data.Address.Express.Second);
        return t ? t.Name : '';
      }
      return '';
    },
    addObj() {
      if (!this.data?.Address?.Address) return null;
      const {
        AddressDetail, Consignee, Mobile, ExpressArea,
      } = this.data.Address.Address;
      const { RegionalName, CityName, CountyName } = ExpressArea;
      const _obj = {};
      _obj.First = `${RegionalName}${CityName}${CountyName}${AddressDetail}`;
      _obj.Second = `（${Consignee} ${Mobile}）`;
      return _obj;
    },
    addTitle() {
      if (this.addObj) {
        const { First, Second } = this.addObj;
        return `${First}${First && Second ? '\r\n' : ''}${Second}`;
      }
      return '';
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
  },
};
</script>

<style lang='scss'>
.mp-pc-pre-create-order-list-item-wrap {
  padding-top: 20px;
  font-size: 12px;
  box-sizing: border-box;
  &.shopping-car {
    margin: 0;
    border: 1px solid #eee;
    border-top: none;
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
          flex: none;
        }
        &.freight-box {
          margin-right: 10px;
          font-size: 14px;
          min-width: 9em;
          flex: none;
        }
        &.express-text {
          margin-right: 12px;
          flex: none;
        }
        &.add-detail {
          max-width: 720px;
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
      user-select: none;
      > div {
        height: 12px;
        width: 7px;
        position: absolute;
        top: 50%;
        left: 50%;
        transition: 0.05s linear !important;
        transform: translate(-50%, -50%) rotate(90deg);
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
