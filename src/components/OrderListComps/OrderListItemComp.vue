<template>
    <div class="mp-pc-order-list-page-table-item-comp-wrap">
      <div class="product-item-header">
        <div class="product-item-header-left">
          <span class="product-item-header-amount-box gray is-font-14">产品金额：<i class="is-pink"
            >{{totalOriginalPrice}}元</i></span>
          <span class="freight-box"> <i class="gray">运费：</i>{{totalFreight}}元</span>
          <span class="add-detail">
            <i class="express-box">{{data[0].Express}}</i>
            <i class="gray">配送地址：</i>{{getAddress(data[0].Package.Address.Address).First}}
            <!-- <i class="gray"> {{getAddress(data.Address.Address).Second}}</i> -->
          </span>
        </div>
        <div class="product-item-header-right" @click="handleCollapse">
          <div :class="isActive ? 'active' : ''"></div>
        </div>
      </div>
      <TransitionGroupCollapse4ShopCar tag="ul" class="mp-group-collapse-for-shop"> <!-- 子列表部分 -->
        <li
          class="product-item-content has-transition"
          v-show="isActive"
          v-for="(item, i) in data"
          :class="i === data.length - 1 ? 'hide-border-item' : ''"
          :key="item.OrderID"
        >
          <div :style="wStyles[0]" class="is-twelve">{{item.OrderID}}</div>
          <div :style="wStyles[1]">
            <el-tooltip popper-class="table-item" :enterable='false'
              :content="item.OutPlate" placement="top-start">
              <span>{{item.OutPlate}}</span>
            </el-tooltip>
          </div>
          <div :style="wStyles[2]">
            <el-tooltip popper-class="table-item" :enterable='false'
              :content="item.ProductName" placement="top-start">
              <span>{{item.ProductName}}</span>
            </el-tooltip>
          </div>
          <div :style="wStyles[3]">
            <el-tooltip popper-class="table-item" :enterable='false'
              :content="getSize(item.SizeList)" placement="top-start">
              <span>{{getSize(item.SizeList)}}</span>
            </el-tooltip>
          </div>
          <div :style="wStyles[4]">
            <el-tooltip popper-class="table-item" :enterable='false'
              :content="getCraft(item.CraftList)" placement="top-start">
              <span>{{getCraft(item.CraftList)}}</span>
            </el-tooltip>
          </div>
          <div :style="wStyles[5]">
            <el-tooltip popper-class="table-item" :enterable='false'
              :content="item.ProductAmount + item.Unit + item.KindCount + '款'" placement="top-start">
              <span>{{item.ProductAmount + item.Unit + item.KindCount + '款'}}</span>
            </el-tooltip>
          </div>
          <div :style="wStyles[6]" class="is-font-12 gray">
            <el-tooltip popper-class="table-item" :enterable='false'
              :content="item.Content" placement="top-start">
              <span>{{item.Content}}</span>
            </el-tooltip>
          </div>
          <div :style="wStyles[7]" class="is-twelve">
            <i v-if="item.Funds.CouponAmount>0">-</i>{{item.Funds.CouponAmount}}元</div>
          <div :style="wStyles[8]">{{item.Funds.FinalPrice}}元</div>
          <div :style="wStyles[9]">{{item.Funds.HavePaid}}元</div>
          <div :style="wStyles[10]">{{item.Funds.Unpaid}}元</div>
          <div :style="wStyles[11]">{{item.Funds.Refund}}元</div>
          <div :style="wStyles[12]" :class="{
            'is-font-13': 1,
            'yellow-color': 1,
            'is-gray': [254, 255, 35].includes(item.Status),
            'is-success': item.Status === 200,
          }">{{item.Status | formatStatus}}</div>
          <div :style="wStyles[13]" class="is-font-12 gray">{{item.PayTime | format2MiddleLangTypeDate}}</div>
          <div :style="wStyles[14]" class="is-font-12 gray btn-wrap">
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
      type: Array,
      default: () => ([]),
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
    wStyles() {
      return Object.values(this.widthObj).map((item) => `width: ${item}px`);
    },
    totalOriginalPrice() {
      let _amount = 0;
      // eslint-disable-next-line no-return-assign
      this.data.forEach(it => (_amount += it.Funds.FinalPrice));
      return +(_amount.toFixed(2));
    },
    totalFreight() {
      let _freight = 0;
      // eslint-disable-next-line no-return-assign
      // this.data.forEach(it => (_freight += it.Funds.Freight));
      if (this.data[0] && this.data[0].Package) _freight = this.data[0].Package.Freight;
      return +(_freight.toFixed(2));
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
    getSize(SizeList) {
      const _list = [];
      SizeList.forEach(it => {
        _list.push(it.Name.replace('毫米', 'mm'));
      });
      const _obj = {};
      _list.forEach(it => {
        if (!_obj[it]) _obj[it] = 0;
        else _obj[it] += 1;
      });
      return Object.keys(_obj).join('、');
    },
    getCraft(CraftList) {
      const _list = [];
      CraftList.forEach(it => {
        _list.push(it.Name.replace('毫米', 'mm'));
      });
      return _list.join('、');
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
      this.$store.commit('order/setCurOrderDetailData', data);
      this.$router.push('/order/detail');
    },
    goToFeedback(item) {
      const { OrderID, Content } = item;
      this.$router.push({ name: 'feedback', params: { id: OrderID, desc: Content, type: 'add' } });
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
      const res = await this.api.getOrderCancle(OrderID);
      if (res.data.Status === 1000) {
        this.messageBox.successSingle({
          title: '取消成功',
          successFunc: () => {
            this.$store.commit('order/handleCancelOrder', OrderID);
            this.$store.dispatch('common/getCustomerFundBalance');
          },
        });
      }
    },
  },
};
</script>

<style lang='scss'>
.mp-pc-order-list-page-table-item-comp-wrap {
  margin-top: 20px;
  // margin-bottom: 20px;
  font-size: 12px;
  // border-top: 1px solid #eee;
  // border-bottom: 1px solid #eee;
  // border-bottom: none;
  box-sizing: border-box;

  .product-item-header {
    background-color: rgb(248, 248, 248);
    display: flex;
    justify-content: space-between;
    border-top: 1px solid rgba($color: #000000, $alpha: 0);
    border-bottom: 1px solid #eee;
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
          margin-right: 50px;
          font-size: 14px;
        }
        &.add-detail {
          max-width: 800px;
        }
        > i.express-box {
          margin-right: 32px;
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
        transition: 0.3s !important;
        transform: translate(-50%, -50%) rotate(0deg);
        background: url("../../assets/images/right-arrow.png") center
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
      padding-right: 6px;
      box-sizing: border-box;
      flex: none;
      font-size: 12px;
      color: #585858;
      line-height: 30px;
      padding-top: 20px;
      height: 100%;
      box-sizing: border-box;
      display: inline-block\0;
      &.yellow-color {
        color: #f4a307;
      }
      // &.btn-wrap {
      //   // > .span-title-blue {
      //   //   // margin-right: 6px;
      //   // }
      // }
    }
  }
}
</style>
