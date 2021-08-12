<template>
  <section class="mp-mpzj-order-feedback-list-page-wrap">
    <header>
      <ul>
        <li>
          <SingleSelector
            v-model="QuestionID"
            :optionList='QuestionList'
            title="售后原因"
            :defaultProps="{ label: 'Title', value: 'ID', }"
          />
          <SingleSelector
            v-model="FeedbackStatus"
            :optionList='StatusList'
            title="售后进度"
          />
        </li>
        <li class="bottom">
          <LineDateSelectorComp
            :changePropsFunc='setCondition4Feedback'
            :requestFunc='getListData4Feedback'
            :isFull="false"
            :typeList="[['DateType', ''], ['Date', 'First'], ['Date', 'Second']]"
            :dateValue='condition4FeedbackList.DateType'
            :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
            label="申请时间"
            :dateList="dateList"
            :initDate='condition4FeedbackList.Date'
            dateType="date"
          />
          <search-input-comp
            title="订单号"
            placeholder="请输入订单号"
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
    <section class="content">
      <ListTable :dataList='FeedbackList' :dataNumber='FeedbackDataNumber' @handleCancel='handleCancel' />
      <footer>
        <Count
          :watchPage='condition4FeedbackList.Page'
          :handlePageChange='handlePageChange'
          :count='FeedbackDataNumber'
          :pageSize='12'
          class="float"
         />
      </footer>
    </section>
  </section>
</template>

<script>
import ListTable from '@/components/FeedbackComps/ListTable.vue';
import SingleSelector from '@/components/common/Selector/SingleSelector.vue';
import LineDateSelectorComp from '@/components/common/Selector/LineDateSelectorComp.vue';
import SearchInputComp from '@/components/common/Selector/SearchInputComp.vue';
import { mapState, mapMutations, mapActions } from 'vuex';
import Count from '@/components/common/Count.vue';

export default {
  components: {
    Count,
    ListTable,
    SingleSelector,
    SearchInputComp,
    LineDateSelectorComp,
  },
  data() {
    return {
      // eslint-disable-next-line max-len
      dateList: [{ label: '全部', value: 'all' }, { label: '今日', value: 'today' }, { label: '昨日', value: 'yesterday' }, { label: '前日', value: 'beforeyesterday' }, { label: '本月', value: 'curMonth' }, { label: '上月', value: 'lastMonth' }],
    };
  },
  computed: {
    ...mapState('common', ['FeedbackProgress']),
    // eslint-disable-next-line max-len
    ...mapState('summary', ['RejectReasonList', 'listData', 'needFetchListData', 'listDataNumber', 'condition4FeedbackList', 'FeedbackList', 'FeedbackDataNumber']),
    QuestionList() {
      return [{ ID: '', Title: '不限' }, ...this.RejectReasonList];
    },
    StatusList() {
      return [{ value: '', label: '不限' }, ...this.FeedbackProgress];
    },
    UserDefinedTimeIsActive() {
      return this.condition4FeedbackList.DateType === ''
          && !!this.condition4FeedbackList.Date.First
          && !!this.condition4FeedbackList.Date.Second;
    },
    watchConditionPartChange() {
      return `${this.condition4FeedbackList.Status}${this.condition4FeedbackList.QuestionID}`;
    },
    QuestionID: {
      get() {
        return this.condition4FeedbackList.QuestionID;
      },
      set(val) {
        this.$store.commit('summary/setCondition4Feedback', [['QuestionID', ''], val]);
      },
    },
    FeedbackStatus: {
      get() {
        return this.condition4FeedbackList.Status;
      },
      set(val) {
        this.$store.commit('summary/setCondition4Feedback', [['Status', ''], val]);
      },
    },
  },
  methods: {
    ...mapMutations('summary', ['setCondition4Feedback', 'clearCondition4Feedback']),
    ...mapActions('summary', ['getListData4Feedback']),
    handleCancel(id) {
      if (!id) return;
      this.$store.commit('summary/setListItemCancel4Feedback', id);
    },
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
  },
  watch: {
    watchConditionPartChange() {
      this.$store.dispatch('summary/getListData4Feedback');
    },
    condition4FeedbackList: {
      handler(newVal) {
        if (!newVal) return;
        this.setPathFromCondition(newVal);
      },
      deep: true,
    },
  },
  created() {
    this.initConditionFromPath();
    if (!(this.listData && !this.needFetchListData)) {
      this.$store.dispatch('summary/getListData4Feedback', this.condition4FeedbackList.Page);
    } else {
      this.$store.commit('summary/setFeedbackList', [this.listData, this.listDataNumber]);
    }
    this.$store.dispatch('summary/getRejectReasonList');
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
  min-height: calc(100vh - 115px - 22px);
  min-height: calc(100vh - 115px - 42px) \0;
  > header {
    > ul {
      width: 1200px;
      margin: 0 auto;
      border-top: 1px dashed #eee;
      padding: 25px 0 0;
      > li {
        > .mp-pc-common-comps-select-comp-wrap {
          margin-right: 50px;
        }
        &.bottom {
          padding-top: 24px;
          > .mp-line-date-selector-wrap {
            width: 775px;
            overflow: hidden;
            white-space: nowrap;
          }
          > section {
            vertical-align: 28px;
          }
        }
      }
    }
    > p {
      height: 20px;
      width: 100%;
      background-color: rgb(245, 245, 245);
    }
  }
  > .content {
    width: 1200px;
    margin: 0 auto;
    padding-top: 25px;
    > footer {
      padding: 20px 0;
    }
  }
}
</style>
