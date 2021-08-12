<template>
  <article class="mp-pc-order-list-page-wrap">
    <section class="header">
      <ul class="header-content">
        <li>
          <SingleSelector v-model="OrderStatus" :optionList='OrderStatusList' title="订单状态" />
          <product-selector
          :changePropsFunc='setCondition4OrderList'
          :requestFunc='getOrderList'
          :ClassID='condition4OrderList.ProductClass.First'
          :TypeID='condition4OrderList.ProductClass.Second'
          :ProductID='condition4OrderList.ProductID'
          :typeList="[['ProductClass', 'First'],['ProductClass', 'Second'],['ProductID', '']]"
         />
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
            dateType="date"
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
    <section class="content-wrap" v-if="computedOrderlist.length > 0 || OrderListNumber > 0">
      <section class="content">
        <Table4OrderList :orderData='computedOrderlist' />
        <footer>
          <Count
            :watchPage='condition4OrderList.Page'
            :handlePageChange='handlePageChange'
            :count='OrderListNumber'
            :pageSize='12'
            :DownLoadConfigObj='DownLoadConfigObj'
            class="float"
            >
            <span class="price-box">
              <i class="gray">共计金额：</i>
              <i class="is-pink is-bold is-font-14">￥{{orderTotalAmount}}</i>
              <i class="is-pink is-font-12">元</i>
              <i class="is-cancel is-font-12">(不含已取消订单)</i>
            </span>
          </Count>
        </footer>
        <transition name="el-fade-in-linear">
          <footer  v-show="isFootFixed" class="floating">
            <div>
              <Count
              :watchPage='condition4OrderList.Page'
              :handlePageChange='handlePageChange'
              :count='OrderListNumber'
              :pageSize='12'
              :DownLoadConfigObj='DownLoadConfigObj'
              class="float"
              >
                <span class="price-box">
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
    <section class="show-empty-bg" v-else>
      <img src="../../assets/images/order-empty.png" alt="">
      <p class="is-gray">{{showDateText}}</p>
    </section>
  </article>
</template>

<script>
// import { debounce } from '@/assets/js/utils/throttle';
import SingleSelector from '@/components/common/Selector/SingleSelector.vue';
import ProductSelector from '@/components/common/Selector/ProductSelectorIndex.vue';
import LineDateSelectorComp from '@/components/common/Selector/LineDateSelectorComp.vue';
import Count from '@/components/common/Count.vue';
import SearchInputComp from '@/components/common/Selector/SearchInputComp.vue';
import Table4OrderList from '@/components/OrderListComps/Table4OrderList.vue';
import {
  mapState, mapGetters, mapMutations, mapActions,
} from 'vuex';
import CommonClassType from '../../store/CommonClassType';

export default {
  components: {
    SingleSelector,
    ProductSelector,
    LineDateSelectorComp,
    SearchInputComp,
    Count,
    Table4OrderList,
  },
  data() {
    return {
      isFootFixed: false,
      // eslint-disable-next-line max-len
      dateList: [{ label: '全部', value: 'all' }, { label: '今日', value: 'today' }, { label: '昨日', value: 'yesterday' }, { label: '本月', value: 'curMonth' }, { label: '上月', value: 'lastMonth' }],
    };
  },
  computed: {
    ...mapState('common', ['OrderStatusList', 'ScrollInfo']),
    ...mapState('order', ['condition4OrderList', 'OrderList', 'OrderListNumber', 'orderTotalAmount']),
    ...mapGetters('order', ['computedOrderlist']),
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
  },
  watch: {
    computedOrderlist() {
      this.$nextTick(() => {
        this.oApp.scrollTop = 0;
        this.handleScroll(this.oApp);
      });
    },
    scrollChange() {
      const { scrollTop, scrollHeight, offsetHeight } = this.ScrollInfo;
      const difference = scrollHeight - offsetHeight;
      if (difference - 165 - scrollTop > 0) this.isFootFixed = true;
      else this.isFootFixed = false;
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
    // height: 120px;
    margin-bottom: 22px;
    // &.header {
    //   // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    // }
    // box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.07);
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
          .mp-line-date-selector-wrap > .box {
            width: 600px;
            &::after {
              display: none;
            }
          }
          .mp-common-comps-search-box {
            vertical-align: 25px;
            margin-left: 64px;
            // margin-right: -10px;
          }
        }
      }
    }
    &.content-wrap {
      margin-bottom: 10px;
      // box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.07);
      min-height: calc(100vh - 135px - 170px - 38px);
      > .content {
        margin: 0 auto;
        width: 1200px;
        padding-top: 25px;
        > footer {
          height: 55px;
          padding-top: 19px;
          &.floating {
            position: fixed;
            bottom: 0;
            left: 0;
            background-color: #fff;
            z-index: 10;
            padding-top: 10px;
            right: 0px;
            box-shadow: 0px 0px 14px 7px rgba(136, 136, 136, 0.3);
            > div {
              width: 1200px;
              margin: 0 auto;
              position: relative;
              left: -8px;
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
  .price-box {
    // float: left;
    position: absolute;
    // margin-left: 100px;
    left: 0;
    font-size: 13px;
  }
}
</style>
