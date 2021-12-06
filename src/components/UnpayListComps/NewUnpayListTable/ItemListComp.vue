<template>
    <div class="mp-pc-new-unpay-list-page-table-item-comp-wrap">
      <div class="product-item-header">
        <div class="product-item-header-left">
          <el-checkbox v-model="checked" :disabled='this.data.isCanceled || this.data.isPaid'>
            <span class="product-item-header-amount-box gray is-font-14">付款单号：<i>{{this.data.PayCode}}</i></span>
          </el-checkbox>
          <span class="freight-box"> <i class="gray">产品金额：</i><em class="is-pink">{{totalOriginalPrice}}元</em></span>
          <span class="freight-box"> <i class="gray">运费：</i>{{totalFreight}}元</span>
          <span class="freight-box"> <i class="gray">重量：</i>{{this.data._Weight}}kg</span>
        </div>
        <div class="product-item-header-right" >
          <span class="span-title-blue" @click="handlePayClick" :class="{disabled: this.data.isCanceled || this.data.isPaid}">付款</span>
          <span class="span-title-blue" @click="handleOrderCancel" :class="{disabled: this.data.isCanceled || this.data.isPaid}">取消</span>
          <div :class="isActive ? 'active arrow' : 'arrow'" @click="handleCollapse"></div>
        </div>
      </div>
      <TransitionGroupCollapse4ShopCar tag="ul" class="mp-group-collapse-for-shop"> <!-- 子列表部分 -->
        <li
          class="product-item-content has-transition"
          v-show="isActive"
          v-for="(item, i) in data._OrderList"
          :class="i === data.length - 1 ? 'hide-border-item' : ''"
          :key="item.OrderID"
        >
          <div :style="wStyles[0]"></div>
          <div :style="'width:' + (widthObj.w2 + 20) + 'px' + ';text-align:left;margin-left:-20px;'">
            <el-tooltip popper-class="table-item" :enterable='false'
              :content="item._FullName" placement="top-start">
              <span>{{item._FullName}}</span>
            </el-tooltip>
          </div>
          <div :style="wStyles[2]">
            <el-tooltip popper-class="table-item" :enterable='false'
              :content="getSize(item.SizeList)" placement="top-start">
              <span>{{getSize(item.SizeList)}}</span>
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
              :content="getCraft(item.CraftList)" placement="top-start">
              <span>{{getCraft(item.CraftList)}}</span>
            </el-tooltip>
          </div>
          <div :style="wStyles[5]">{{item.Funds.OriginalPrice}}元</div>
          <div :style="wStyles[6]" class="is-twelve">
            <i v-if="item.Funds.CouponAmount>0">-</i>{{item.Funds.CouponAmount}}元</div>
          <div :style="wStyles[7]">{{item.Funds.FinalPrice}}元</div>
          <div :style="wStyles[8]">{{item.Funds.Deposit}}元</div>
          <div :style="wStyles[9]" class="is-font-12 gray">
            <el-tooltip popper-class="table-item" :enterable='false' v-if="item.Content"
              :content="item.Content" placement="top-start">
              <span>{{item.Content}}</span>
            </el-tooltip>
            <span v-else>无</span>
          </div>
          <div :style="wStyles[10]">{{item.Address.Address.Consignee}}</div>
          <div :style="wStyles[11]">{{item.Address.Address.Mobile}}</div>
          <div :style="wStyles[12]">{{item.Address.ExpressText}}</div>
          <div :style="wStyles[13]" :class="{
            'is-font-13': 1,
            'yellow-color': 1,
            'is-gray': [254, 255, 35].includes(item.Status),
            'is-success': item.Status === 200,
          }">{{item.Status | formatStatus}}</div>
          <div :style="wStyles[14]" class="is-font-12 gray btn-wrap">
            <span class="span-title-blue" @click="goToDetailPage(item)">详情</span>
          </div>
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
    };
  },
  methods: {
    handleCollapse() {
      this.isActive = !this.isActive;
    },
    getSize(SizeList) {
      if (!SizeList) return '无';
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
      if (!CraftList) return '无';
      const _list = [];
      CraftList.forEach(it => {
        _list.push(it.Name.replace('毫米', 'mm'));
      });
      return _list.join('、') || '无';
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
      this.$store.commit('unpayList/setCurUnpayListDetailData', { ...data, Weight: this.data._Weight });
      this.$router.push('/unpay/detail');
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
};
</script>

<style lang='scss'>
.mp-pc-new-unpay-list-page-table-item-comp-wrap {
  margin-top: 20px;
  font-size: 12px;
  box-sizing: border-box;

  .product-item-header {
    background-color: rgb(248, 248, 248);
    display: flex;
    justify-content: space-between;
    border-top: 1px solid rgba($color: #000000, $alpha: 0);
    border-bottom: 1px solid #eee;
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
        &.product-item-header-amount-box {
          margin-right: 35px;
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
      }
      .el-checkbox {
        margin-right: 35px;
        .el-checkbox__label {
          padding-left: 20px;
        }
      }
    }
    .product-item-header-right {
      height: 29px;
      width: 118px;
      margin-right: 12px;
      position: relative;
      flex: none;
      display: inline-block\0;
      cursor: pointer;
      user-select: none;
      > div.arrow {
        height: 32px;
        width: 30px;
        position: absolute;
        top: calc(50% + 3px);
        right: -12px;
        transition: 0.2s !important;
        transform: translate(-50%, -50%) rotate(90deg);
        background: url("../../../assets/images/right-arrow.png") center no-repeat;
        background-size: 7px 10px;
        &.active {
          transform: translate(-50%, -50%) rotate(-90deg);
        }
      }
      > span {
        display: inline-block;
        line-height: 32px;
        font-size: 14px;
        margin-left: 4px;
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
    box-sizing: border-box;
    vertical-align: middle;
    white-space: nowrap;
    display: flex;
    border-bottom: none;
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
      .el-tooltip {
        max-width: 100%;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      &.btn-wrap {
        padding-right: 16px;
        font-size: 14px !important;
      }
    }
  }
}
</style>
