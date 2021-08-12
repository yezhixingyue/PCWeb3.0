<template>
  <section class="mp-pc-bill-page-wrap">
    <header>
      <div class="header-content">
        <SingleSelector v-model="Type" :optionList='TransactionTypeList' />
        <LineDateSelectorComp
          :changePropsFunc='setCondition4FundBillList'
          :requestFunc='getFundBillList'
          :isFull="false"
          :typeList="[['DateType', ''], ['Date', 'First'], ['Date', 'Second']]"
          :dateValue='condition4FundBillList.DateType'
          :initDate='condition4FundBillList.Date'
          :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
          label="交易时间"
          :dateList="dateList"
          dateType="date"
        />
      </div>
    </header>
    <div class="content-wrap" v-if="FundBillList.length > 0 || FundBillListNumber > 0">
      <!-- FundBillListNumber -->
      <div class="content">
        <FundBillTable :dataList='FundBillList' />
        <Count
          :watchPage='condition4FundBillList.Page'
          :handlePageChange='handlePageChange'
          :count='FundBillListNumber'
          :pageSize='12'
          class="float"
         />
      </div>
    </div>
    <div class="empty" v-else>
      <img src="../../assets/images/order-empty.png" alt="">
      <p>{{showDateText}}</p>
    </div>
  </section>
</template>

<script>
import FundBillTable from '@/components/BillComps//FundBillTable.vue';
import SingleSelector from '@/components/common/Selector/SingleSelector.vue';
import Count from '@/components/common/Count.vue';
import LineDateSelectorComp from '@/components/common/Selector/LineDateSelectorComp.vue';
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  components: {
    Count,
    FundBillTable,
    SingleSelector,
    LineDateSelectorComp,
  },
  computed: {
    ...mapState('common', ['TransactionTypeList']),
    ...mapState('summary', ['condition4FundBillList', 'FundBillList', 'FundBillListNumber']),
    UserDefinedTimeIsActive() {
      return this.condition4FundBillList.DateType === ''
          && !!this.condition4FundBillList.Date.First
          && !!this.condition4FundBillList.Date.Second;
    },
    Type: {
      get() {
        return this.condition4FundBillList.Type;
      },
      set(newVal) {
        // // console.log(newVal);
        this.$store.commit('summary/setCondition4FundBillList', [['Type', ''], newVal]);
        this.$store.dispatch('summary/getFundBillList');
      },
    },
    showDateText() {
      if (this.condition4FundBillList && this.condition4FundBillList.DateType !== 'all') {
        if (this.condition4FundBillList.DateType) {
          const t = this.dateList.find(it => it.value === this.condition4FundBillList.DateType);
          if (t) return `${t.label}暂无账单，快去下单吧...`;
          return '当前暂无账单，快去下单吧...';
        }
        if (this.condition4FundBillList.Date.First && this.condition4FundBillList.Date.Second) {
          return '所选期间暂无账单，快去下单吧...';
        }
        return '当前暂无账单，快去下单吧...';
      }
      return '当前暂无账单，快去下单吧...';
    },
  },
  data() {
    return {
      billValue: '',
      // eslint-disable-next-line max-len
      dateList: [{ label: '全部', value: 'all' }, { label: '今日', value: 'today' }, { label: '昨日', value: 'yesterday' }, { label: '前日', value: 'beforeyesterday' }, { label: '本月', value: 'curMonth' }, { label: '上月', value: 'lastMonth' }],
    };
  },
  methods: {
    ...mapMutations('summary', ['setCondition4FundBillList']),
    ...mapActions('summary', ['getFundBillList']),
    handlePageChange(page) {
      this.$store.dispatch('summary/getFundBillList', page);
    },
  },
  mounted() {
    this.$store.dispatch('summary/getFundBillList');
  },
};
</script>

<style lang='scss'>
.mp-pc-bill-page-wrap {
  > header {
    width: 100%;
    background-color: #fff;
    > .header-content {
      margin: 0 auto;
      width: 1200px;
      padding: 28px 0 0;
      border-top: 1px dashed #eee;
      > section {
        display: inline-block;
        vertical-align: 14px;
        margin-right: 80px;
      }
      > div {
        display: inline-block;
      }
    }
  }
  > .content-wrap {
    margin-top: 22px;
    width: 100%;
    background-color: #fff;
    min-height: calc(100vh - 135px - 100px - 61px);
    > .content {
      width: 1200px;
      margin: 0 auto;
      padding-top: 25px;
      margin-bottom: 15px;
      > div {
        margin-top: 19px;
        height: 55px;
      }
      > section {
        min-height: calc(100vh - 135px - 45px - 193px);
      }
    }
  }
  > .empty {
    text-align: center;
    min-height: calc(100vh - 135px - 94px);
    text-align: center;
    padding-top: 141px\0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    > img {
      height: 266px;
      width: 545px;
      user-select: none;
    }
    > p {
      color: #989898;
      margin-top: 15px;
    }
  }
}
</style>
