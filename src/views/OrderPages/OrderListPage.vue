<template>
  <article class="mp-pc-order-list-page-wrap">
    <section class="header">
      <ul class="header-content">
        <li>
          <SingleSelector v-model="OrderStatus" :optionList='OrderStatusList' title="订单状态" />
          <!-- <ProductSelector
          :changePropsFunc='setCondition4OrderList'
          :requestFunc='getOrderList'
          :ClassID='condition4OrderList.ProductClass.First'
          :TypeID='condition4OrderList.ProductClass.Second'
          :ProductID='condition4OrderList.ProductID'
          :typeList="[['ProductClass', 'First'],['ProductClass', 'Second'],['ProductID', '']]"
         /> -->
         <EpCascader :list="allProductClassify" v-model="EpCascaderProductValue" :showLine="false" />
        </li>
        <li class="second">
          <LineDateSelectorComp
            :changePropsFunc='setCondition4OrderList'
            :requestFunc='getOrderList'
            :isFull="false"
            :typeList="[['DateType', ''], ['Date', 'First'], ['Date', 'Second']]"
            :dateValue='condition4OrderList.DateType'
            :initDate='condition4OrderList.Date'
            :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
            label="下单时间"
            :dateList="dateList"
            dateType="daterange"
          />
          <search-input-comp
            title="关键词"
            placeholder="请输入搜索关键词"
            :typeList="[['KeyWords', '']]"
            :requestFunc="getOrderList"
            :changePropsFunc="setCondition4OrderList"
            :word="condition4OrderList.KeyWords"
            @reset="clearCondition4OrderList"
            :searchWatchKey="OrderList"
          />
        </li>
      </ul>
    </section>
    <section class="content-wrap" v-show="showTable">
      <section class="content">
        <TableComp :OrderList="OrderList" ref="oTable" @changeWidth="handleChangeWidth" :isScrollEnd="isScrollEnd" :class="{loading:loading}" />
        <footer>
          <Count
            :watchPage='condition4OrderList.Page'
            :handlePageChange='handlePageChange'
            :count='OrderListNumber'
            :showCount="showOrderListNumber"
            :pageSize='10'
            :DownLoadConfigObj='DownLoadConfigObj'
            rightContent='个订单'
            class="float"
            >
            <span class="footer-price-box">
              <i class="gray">共计金额：</i>
              <i class="is-pink is-bold is-font-14">￥{{orderTotalAmount}}</i>
              <i class="is-pink is-font-12">元</i>
              <i class="is-cancel is-font-12">(不含已取消订单)</i>
            </span>
          </Count>
        </footer>
        <transition name="el-fade-in-linear">
          <footer  v-show="isFootFixed" class="floating">
            <MyScrollBar v-if="tableDom" :el="tableDom" ref="oBar" @scrollToEnd="handleScrollToEnd" />
            <div>
              <Count
                :watchPage='condition4OrderList.Page'
                :handlePageChange='handlePageChange'
                :count='OrderListNumber'
                :showCount="showOrderListNumber"
                :pageSize='10'
                :DownLoadConfigObj='DownLoadConfigObj'
                rightContent='个订单'
                class="float"
              >
                <span class="footer-price-box">
                  <i class="gray">共计金额：</i>
                  <i class="is-pink is-bold is-font-14">￥{{orderTotalAmount}}</i>
                  <i class="is-pink is-font-12">元</i>
                  <i class="is-cancel is-font-12">(不含已取消订单)</i>
                </span>
              </Count>
            </div>
          </footer>
        </transition>
      </section>
    </section>
    <section class="show-empty-bg" v-show="!showTable">
      <img src="../../assets/images/order-empty.png" alt="">
      <p class="is-gray">{{showDateText}}</p>
    </section>
  </article>
</template>

<script>
// import { debounce } from '@/assets/js/utils/throttle';
import SingleSelector from '@/components/common/Selector/SingleSelector.vue';
import LineDateSelectorComp from '@/components/common/Selector/LineDateSelectorComp.vue';
import Count from '@/components/common/Count.vue';
import SearchInputComp from '@/components/common/Selector/SearchInputComp.vue';
import TableComp from '@/components/OrderListComps/TableComp/index.vue';
import {
  mapState, mapMutations, mapActions, mapGetters,
} from 'vuex';
// import ProductSelector from '../../components/common/Selector/ProductSelectorIndex.vue';
import CommonClassType from '../../store/CommonClassType';
import MyScrollBar from '../../components/common/MyScrollBar.vue';
import EpCascader from '../../packages/EpCascader/index.vue';

export default {
  components: {
    SingleSelector,
    // ProductSelector,
    LineDateSelectorComp,
    SearchInputComp,
    Count,
    TableComp,
    MyScrollBar,
    EpCascader,
  },
  data() {
    return {
      isFootFixed: false,
      // eslint-disable-next-line max-len
      dateList: [{ label: '近7天订单', value: 'last7Date' }, { label: '今天', value: 'today' }, { label: '昨天', value: 'yesterday' }, { label: '前天', value: 'beforeyesterday' }, { label: '本月', value: 'curMonth' }, { label: '上月', value: 'lastMonth' }],
      tableDom: null,
      isScrollEnd: false,
    };
  },
  computed: {
    ...mapState('common', ['OrderStatusList', 'ScrollInfo']),
    ...mapState('order', ['condition4OrderList', 'OrderList', 'OrderListNumber', 'orderTotalAmount', 'showOrderListNumber', 'loading']),
    ...mapGetters('Quotation', ['allProductClassify']),
    scrollChange() {
      return this.ScrollInfo.scrollTop + this.ScrollInfo.scrollHeight + this.ScrollInfo.offsetHeight;
    },
    DownLoadConfigObj() {
      return {
        condition: this.condition,
        count: this.OrderListNumber,
        fileDefaultName: '名片之家订单列表',
        fileDate: this.condition4OrderList.Date,
        downFunc: data => this.api.getCustomerOrderList4Excel(data),
      };
    },
    condition() {
      if (!this.condition4OrderList) return {};
      let _t = JSON.parse(JSON.stringify(this.condition4OrderList));
      CommonClassType.setDate(_t);
      _t = CommonClassType.filter(_t);
      if (_t.Date) {
        _t.PlaceDate = _t.Date;
        delete _t.Date;
      }
      return _t;
    },
    OrderStatus: {
      get() {
        return this.condition4OrderList.Status;
      },
      set(newVal) {
        // // console.log(newVal);
        this.$store.commit('order/setCondition4OrderList', [['Status', ''], newVal]);
        this.$store.dispatch('order/getOrderList');
      },
    },
    showDateText() {
      if (this.condition4OrderList && this.condition4OrderList.DateType !== 'all') {
        if (this.condition4OrderList.DateType) {
          const t = this.dateList.find(it => it.value === this.condition4OrderList.DateType);
          if (t) return `${t.label}暂无订单，快去下单吧...`;
          return '当前暂无订单，快去下单吧...';
        }
        if (this.condition4OrderList.Date.First && this.condition4OrderList.Date.Second) {
          return '所选期间暂无订单，快去下单吧...';
        }
        return '当前暂无订单，快去下单吧...';
      }
      return '当前暂无订单，快去下单吧...';
    },
    UserDefinedTimeIsActive() {
      return this.condition4OrderList.DateType === ''
          && !!this.condition4OrderList.Date.First
          && !!this.condition4OrderList.Date.Second;
    },
    showTable() {
      return this.OrderList.length > 0 || this.OrderListNumber > 0;
    },
    EpCascaderProductValue: {
      get() {
        const list = [
          this.condition4OrderList.ProductClass.First,
          this.condition4OrderList.ProductClass.Second,
          this.condition4OrderList.ProductID,
        ];
        return list.filter(it => it || it === 0);
      },
      set(ids) {
        const [_First, _Second, _ProductID] = ids;
        const First = _First || _First === 0 ? _First : '';
        const Second = _Second || _Second === 0 ? _Second : '';
        const ProductID = _ProductID || _ProductID === 0 ? _ProductID : '';
        this.setCondition4OrderList([['ProductClass', 'First'], First]);
        this.setCondition4OrderList([['ProductClass', 'Second'], Second]);
        this.setCondition4OrderList([['ProductID', ''], ProductID]);
        this.getOrderList();
      },
    },
  },
  methods: {
    ...mapMutations('order', ['setCondition4OrderList', 'clearCondition4OrderList']),
    ...mapActions('order', ['getOrderList']),
    handlePageChange(page) {
      this.$store.dispatch('order/getOrderList', page);
    },
    handleScroll(oEl) {
      if (!oEl) return;
      const { scrollTop, scrollHeight, offsetHeight } = oEl;
      this.$store.commit('common/setScrollInfo', { scrollTop, scrollHeight, offsetHeight });
    },
    handleChangeWidth() {
      if (this.$refs.oBar) {
        this.$refs.oBar.reset();
      }
    },
    handleScrollToEnd(boolean) {
      console.log('scrollToEnd', boolean);
      this.isScrollEnd = boolean;
    },
  },
  watch: {
    OrderList() {
      this.$nextTick(() => {
        this.oApp.scrollTop = 0;
        this.handleScroll(this.oApp);
      });
    },
    scrollChange: {
      handler() {
        const { scrollTop, scrollHeight, offsetHeight } = this.ScrollInfo;
        const difference = scrollHeight - offsetHeight;
        if (difference - 175 - scrollTop > 0) this.isFootFixed = true;
        else this.isFootFixed = false;
      },
      immediate: true,
    },
    isFootFixed(val) {
      if (!val) return;
      this.$nextTick(() => {
        if (!this.tableDom && this.$refs.oTable && this.showTable) {
          const dom = this.$refs.oTable.$el.getElementsByClassName('mp-pc-order-list-page-table-comp-wrap normal')[0];
          if (dom) this.tableDom = dom;
        }
        if (this.$refs.oBar && this.$refs.oBar.innerWidth === 0) {
          this.handleChangeWidth();
        }
      });
    },
    showTable: {
      handler(val) {
        if (!val || this.tableDom || !this.$refs.oTable) return;
        const dom = this.$refs.oTable.$el.getElementsByClassName('mp-pc-order-list-page-table-comp-wrap normal')[0];
        if (dom) this.tableDom = dom;
      },
      immediate: true,
    },
  },
  mounted() {
    this.$store.dispatch('order/getOrderList');
    this.oApp = document.getElementById('app');
    this.$nextTick(() => {
      this.handleScroll(this.oApp);
    });
  },
  beforeDestroy() {
    this.$store.commit('order/setShouldGetNewListData', true);
  },
};
</script>

<style lang='scss'>
.mp-pc-order-list-page-wrap {
  width: 100%;
  > section {
    width: 100%;
    background-color: #fff;
    margin-bottom: 22px;
    > .header-content {
      margin: 0 auto;
      width: 1200px;
      padding: 25px 0 0px;
      border-top: 1px dashed #eee;
      > li {
        > section {
          vertical-align: top;
        }
        > .mp-pc-order-product-select-wrap {
          vertical-align: top;
          padding-top: 1px;
          padding-left: 12px;
        }
        &.second {
          padding-top: 28px;
          .mp-line-date-selector-wrap {
            min-width: 750px;
            > .box {
              width: 650px;
              &::after {
                display: none;
              }
            }
          }
          .mp-common-comps-search-box {
            vertical-align: 25px;
            margin-left: 26px;
            // margin-right: -10px;
          }
        }
      }
    }
    &.content-wrap {
      margin-bottom: 10px;
      // min-height: calc(100vh - 135px - 170px - 38px);
      min-height: calc(100vh - 135px - 170px);
      // text-align: center;
      > .content {
        margin: 0 auto;
        padding-top: 25px;
        width: 1200px;
        > footer {
          height: 55px;
          padding-top: 19px;
          > div {
            width: 1200px;
            margin: 0 auto;
          }
          &.floating {
            position: fixed;
            height: 78px;
            bottom: 0;
            left: 0;
            background-color: #fff;
            z-index: 10;
            padding-top: 8px;
            right: 0px;
            box-shadow: 0px 0px 14px 7px rgba(136, 136, 136, 0.3);
            > div {
              width: 1200px;
              margin: 0 auto;
              position: relative;
              left: -8px;
              &.mp-common-local-scroll-bar-comp-wrap {
                margin-bottom: 10px;
              }
            }
          }
        }
      }
    }
    &.show-empty-bg {
      background-color: rgb(245, 245, 245);
      text-align: center;
      // padding-top: 65px;
      padding-top: 80px\9\0;
      height: calc(100vh - 130px - 195px);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      > p {
        margin-top: 15px;
      }
      > img {
        height: 266px;
        width: 545px;
        user-select: none;
      }
    }
  }
  .footer-price-box {
    position: absolute;
    left: 0;
    font-size: 13px;
  }
}
</style>
