<template>
  <section class="mp-mpzj-order-feedback-list-page-wrap">
    <header>
      <ul>
        <li class="top">
          <span style="display:flex">
            <SingleSelector v-model="OrderStatus" :optionList='OrderStatusList' title="订单状态" />
            <ProductSelector
              :changePropsFunc='setCondition4Feedback'
              :requestFunc='getListData4Feedback'
              :ClassID='condition4FeedbackList.Product.ClassID'
              :TypeID='condition4FeedbackList.Product.TypeID'
              :ProductID='condition4FeedbackList.Product.ProductID'
              :typeList="[['Product', 'ClassID'],['Product', 'TypeID'],['Product', 'ProductID']]"
            />
          </span>
          <LookOverAfterSale></LookOverAfterSale>
        </li>
        <li class="bottom" style="margin-top:2px">
          <LineDateSelectorComp
            :changePropsFunc='setCondition4Feedback'
            :requestFunc='getListData4Feedback'
            :isFull="false"
            :typeList="[['DateType', ''], ['Date', 'First'], ['Date', 'Second']]"
            :dateValue='condition4FeedbackList.DateType'
            :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
            label="下单时间"
            :dateList="dateList"
            :initDate='condition4FeedbackList.Date'
            dateType="date"
          />
          <search-input-comp
            title="关键词"
            placeholder="请输入搜索关键词"
            :resetWords="'清空所有筛选项条件'"
            :typeList="[['KeyWords', '']]"
            :requestFunc="getListData4Feedback"
            :changePropsFunc="setCondition4Feedback"
            :word="condition4FeedbackList.KeyWords"
            @reset="clearCondition4Feedback"
            :searchWatchKey="FeedbackList"
          />
        </li>
      </ul>
      <p></p>
    </header>
    <section class="content" v-if="FeedbackList.length">
      <div class="tables">
        <ListTable v-for="FeedbackItem in FeedbackList" :key="FeedbackItem.OrderID" :dataList='[FeedbackItem]' />
      </div>
      <!-- <ListTable :dataList='list' /> -->
      <footer>
        <Count
          :watchPage='condition4FeedbackList.Page'
          :handlePageChange='handlePageChange'
          :count='FeedbackDataNumber'
          :pageSize='12'
          class="float"
         />
          <!-- :DownLoadConfigObj='DownLoadConfigObj' -->
      </footer>
      <transition name="el-fade-in-linear">
        <footer  v-show="isFootFixed" class="floating">
          <Count
            :watchPage='condition4FeedbackList.Page'
            :handlePageChange='handlePageChange'
            :count='FeedbackDataNumber'
            :pageSize='12'
            class="float"
          />
            <!-- :DownLoadConfigObj='DownLoadConfigObj' -->
        </footer>
      </transition>
    </section>
    <div class="show-empty-bg" v-else>
      <img src="../../assets/images/order-empty.png" alt="">
      <p>暂无售后申请信息
        <router-link tag="span" :to="{path: '/placeOrder'}">
          去下单<i class="el-icon-arrow-right"></i>
        </router-link>
      </p>
    </div>
  </section>
</template>

<script>
import ListTable from '@/components/FeedbackComps/ListTable.vue';
import SingleSelector from '@/components/common/Selector/SingleSelector.vue';
import ProductSelector from '@/components/common/Selector/ProductSelectorIndex.vue';
import LookOverAfterSale from '@/components/ServiceAfterSales/LookOverAfterSale.vue';
import LineDateSelectorComp from '@/components/common/Selector/LineDateSelectorComp.vue';
import SearchInputComp from '@/components/common/Selector/SearchInputComp.vue';
import { mapState, mapMutations, mapActions } from 'vuex';
import Count from '@/components/common/Count.vue';
import CommonClassType from '../../store/CommonClassType';

export default {
  components: {
    Count,
    ListTable,
    SingleSelector,
    ProductSelector,
    LookOverAfterSale,
    SearchInputComp,
    LineDateSelectorComp,
  },
  data() {
    return {
      isFootFixed: false,
      // OrderStatus: '',
      // eslint-disable-next-line max-len
      dateList: [{ label: '全部', value: 'all' }, { label: '今天', value: 'today' }, { label: '昨天', value: 'yesterday' }, { label: '本月', value: 'curMonth' }, { label: '上月', value: 'lastMonth' }],
    };
  },
  computed: {
    // ...mapState('common', ['OrderStatusList', 'ScrollInfo']),
    ...mapState('common', ['FeedbackProgress', 'OrderStatusList', 'ScrollInfo']),
    // eslint-disable-next-line max-len
    ...mapState('summary', ['RejectReasonList', 'listData', 'needFetchListData', 'listDataNumber', 'condition4FeedbackList', 'FeedbackList', 'FeedbackDataNumber']),
    // QuestionList() {
    //   return [{ ID: '', Title: '不限' }, ...this.RejectReasonList];
    // },
    // StatusList() {
    //   return [{ value: '', label: '不限' }, ...this.FeedbackProgress];
    // },
    UserDefinedTimeIsActive() {
      return this.condition4FeedbackList.DateType === ''
          && !!this.condition4FeedbackList.Date.First
          && !!this.condition4FeedbackList.Date.Second;
    },
    // watchConditionPartChange() {
    //   return `${this.condition4FeedbackList.Status}${this.condition4FeedbackList.QuestionID}`;
    // },
    QuestionID: {
      get() {
        return this.condition4FeedbackList.QuestionID;
      },
      set(val) {
        this.$store.commit('summary/setCondition4Feedback', [['QuestionID', ''], val]);
      },
    },
    OrderStatus: {
      get() {
        return this.condition4FeedbackList.Status;
      },
      set(newVal) {
        this.$store.commit('summary/setCondition4Feedback', [['Status', ''], newVal]);
        this.$store.dispatch('summary/getListData4Feedback');
      },
    },
    // FeedbackStatus: {
    //   get() {
    //     return this.condition4FeedbackList.Status;
    //   },
    //   set(val) {
    //     this.$store.commit('summary/setCondition4Feedback', [['Status', ''], val]);
    //   },
    // },
    condition() {
      if (!this.condition4FeedbackList) return {};
      let _t = JSON.parse(JSON.stringify(this.condition4FeedbackList));
      CommonClassType.setDate(_t);
      _t = CommonClassType.filter(_t);
      if (_t.Date) {
        _t.CreateTime = _t.Date;
        delete _t.Date;
      }
      return _t;
    },
    scrollChange() { // 滚动条
      return this.ScrollInfo.scrollTop + this.ScrollInfo.scrollHeight + this.ScrollInfo.offsetHeight;
    },
    DownLoadConfigObj() {
      return {
        condition: this.condition,
        count: this.FeedbackDataNumber,
        fileDefaultName: '名片之家售后单',
        fileDate: this.condition4FeedbackList,
        downFunc: data => this.api.getServiceListData2Excel(data),
      };
    },
  },
  methods: {
    ...mapMutations('summary', ['setCondition4Feedback', 'clearCondition4Feedback']),
    ...mapActions('summary', ['getListData4Feedback']),

    handlePageChange(page) {
      this.$store.dispatch('summary/getListData4Feedback', page);
    },
    setPathFromCondition(newVal) {
      const keys = Object.keys(newVal);
      const obj = newVal;
      const arr = keys.filter(key => {
        if (key === 'PageSize') return false;
        if (key !== 'Date') return obj[key] || obj[key] === 0;
        return obj.Date.First && obj.Date.Second && !obj.DateType;
      }).map(key => {
        if (key !== 'Date') return `${key}=${obj[key]}`;
        return `First=${obj.Date.First}&Second=${obj.Date.Second}`;
      });
      const _path = arr.join('&');
      this.$router.push(`?${_path}`);
    },
    initConditionFromPath() {
      const _obj = { ...this.$route.query };
      if (_obj.First && _obj.Second) {
        _obj.Date = {
          First: _obj.First,
          Second: _obj.Second,
        };
        delete _obj.First;
        delete _obj.Second;
        _obj.DateType = '';
      }
      if (_obj.Page) _obj.Page = +_obj.Page;
      if (_obj.Status) _obj.Status = +_obj.Status;
      if (_obj.QuestionID) _obj.QuestionID = +_obj.QuestionID;
      if (_obj.PageSize) _obj.PageSize = +_obj.PageSize;
      const condition = { ...this.condition4FeedbackList, ..._obj };
      this.$store.commit('summary/setFullCondition4Feedback', condition);
    },
    handleScroll(oEl) {
      if (!oEl) return;
      const { scrollTop, scrollHeight, offsetHeight } = oEl;
      this.$store.commit('common/setScrollInfo', { scrollTop, scrollHeight, offsetHeight });
    },
  },
  watch: {
    FeedbackList() {
      this.$nextTick(() => {
        this.handleScroll(this.oApp);
      });
    },
    condition4FeedbackList: {
      handler(newVal) {
        if (!newVal) return;
        this.setPathFromCondition(newVal);
      },
      deep: true,
    },
    scrollChange() { // 滚动条
      const { scrollTop, scrollHeight, offsetHeight } = this.ScrollInfo;
      const difference = scrollHeight - offsetHeight;
      if (difference - 165 - scrollTop > 0) this.isFootFixed = true;
      else this.isFootFixed = false;
    },
  },

  // created() {
  //   this.initConditionFromPath();
  //   if (!(this.listData && !this.needFetchListData)) {
  //     } else {
  //       this.$store.commit('summary/setFeedbackList', [this.listData, this.listDataNumber]);
  //   }
  //   this.$store.commit('summary/clearCondition4Feedback');
  // },
  mounted() {
    this.$store.dispatch('summary/getListData4Feedback', this.condition4FeedbackList.Page);
    this.oApp = document.getElementById('app');
    this.$nextTick(() => {
      this.handleScroll(this.oApp);
    });
  },
  beforeDestroy() {
    this.$store.commit('summary/setNeedFetchListData', true);
  },
};
</script>

<style lang='scss'>
.mp-mpzj-order-feedback-list-page-wrap {
  width: 100%;
  // margin-top: 25px;
  background-color: #fff;
  min-height: calc(100vh - 115px - 22px - 50px);
  min-height: calc(100vh - 115px - 42px - 50px) \0;
  > header {
    > ul {
      width: 1200px;
      margin: 0 auto;
      border-top: 1px dashed #eee;
      > li {
        padding: 25px 0 0;
        > .mp-pc-common-comps-select-comp-wrap {
          margin-right: 12px;
        }
        &.top{
          display: flex;
          justify-content: space-between;
          .mp-pc-order-product-select-wrap{
            margin-top: 1px;
            margin-left: 12px;
          }
        }
        &.bottom {
          // padding-top: 24px;
          display: flex;
          // align-items: center;
          .mp-line-date-selector-wrap{
            flex: 1;
            min-width: 625px;
            margin-top: 10px;
            .box{
              width: 550px;
            }
          }
          > .mp-common-comps-search-box {
            margin: 1px 1px 0 0;
          }
          > section {
            vertical-align: 28px;
          }
        }
      }
    }
    > p {
      height: 22px;
      width: 100%;
      background-color: rgb(245, 245, 245);
    }
  }
  > .content {
    width: 1200px;
    margin: 0 auto;
    padding-top: 25px;
    .tables{
      min-height: calc(100vh - 457px);
    }
    .tab-p{
      position: relative;
      .table-line{
        position: absolute;
        top: 1px;
        left: 1px;
        height: 39px;
        background-color: #428DFA;
        width: 2px;
      }
    }
    .el-table{
      margin-top: -1px;
    }
    > footer {
      padding: 20px 0;
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
  > .show-empty-bg {
    background-color: rgb(245, 245, 245);
    text-align: center;
    min-height: calc(100vh - 135px - 158px);
    text-align: center;
    padding-top: 118px\0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    > p {
      margin-top: 15px;
      color: #989898;
      span{
        color: #428dfa;
        margin-left: 20px;
        i{
          margin-left: -1px;
        }
      }
      span:hover{
        cursor: pointer;
      }
    }
    > img {
      height: 266px;
      width: 545px;
      user-select: none;
    }
  }
}
</style>
