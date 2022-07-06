<template>
  <header class="mp-pc-invoice-search-list-page-header-comp-wrap">
    <p class="page-title">
      <span class="blue-v-line is-bold is-black">发票查询</span>
    </p>
    <div class="f">
      <SingleSelector class="t" useEmpty v-model="localInvoiceType" :optionList='InvoiceTypeEnumList'
       :defaultProps="{label: 'Name',value: 'ID'}" title="发票类型" />
      <SingleSelector useEmpty v-model="localInvoiceStatus" :optionList='localInvoiceStatusEnumList' :defaultProps="{label: 'Name',value: 'ID'}" title="发票状态" />
    </div>
    <div class="s">
      <LineDateSelectorComp
        :changePropsFunc='setCondition'
        :requestFunc='getList'
        :isFull="false"
        :typeList="[['DateType', ''], ['InvoiceApplyTime', 'First'], ['InvoiceApplyTime', 'Second']]"
        :dateValue='condition4SearchList.DateType'
        :initDate='condition4SearchList.InvoiceApplyTime'
        :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
        label="申请时间"
        :dateList="dateList"
        dateType="daterange"
      />
      <SearchInputComp
        title="申请单号"
        placeholder="请输入申请单号"
        :typeList="[['KeyWords', '']]"
        :requestFunc="getList"
        :changePropsFunc="setCondition"
        :word="condition4SearchList.KeyWords"
        @reset="clearCondition"
        :searchWatchKey="InvoiceSearchDataList"
      />
    </div>
    <p class="gap"></p>
  </header>
</template>

<script>
import { mapState } from 'vuex';
import SingleSelector from '../../common/Selector/SingleSelector.vue';
import LineDateSelectorComp from '../../common/Selector/LineDateSelectorComp.vue';
import SearchInputComp from '../../common/Selector/SearchInputComp.vue';
import { InvoiceTypeEnumList, InvoiceStatusEnumList, InvoiceStatusEnums } from '../../../packages/InvoiceComps/enums';

export default {
  components: {
    SingleSelector,
    LineDateSelectorComp,
    SearchInputComp,
  },
  data() {
    return {
      InvoiceTypeEnumList,
      dateList: [{ label: '全部', value: 'all' }, { label: '本月', value: 'curMonth' }, { label: '上月', value: 'lastMonth' }],
      localInvoiceStatusEnumList: InvoiceStatusEnumList.filter(it => it.ID !== InvoiceStatusEnums.canceled.ID),
    };
  },
  computed: {
    ...mapState('invoice', ['condition4SearchList', 'InvoiceSearchDataList']),
    localInvoiceType: { // 发票类型
      get() {
        return this.condition4SearchList.InvoiceType;
      },
      set(val) {
        if (this.condition4SearchList.InvoiceType === val) return;
        this.setCondition([['InvoiceType'], val]);
        this.getList();
      },
    },
    localInvoiceStatus: { // 发票状态
      get() {
        return this.condition4SearchList.InvoiceStatus;
      },
      set(val) {
        if (this.condition4SearchList.InvoiceStatus === val) return;
        this.setCondition([['InvoiceStatus'], val]);
        this.getList();
      },
    },
    UserDefinedTimeIsActive() {
      return this.condition4SearchList.DateType === ''
          && !!this.condition4SearchList.InvoiceApplyTime.First
          && !!this.condition4SearchList.InvoiceApplyTime.Second;
    },
  },
  methods: {
    getList() {
      this.$nextTick(() => {
        this.$store.dispatch('invoice/getInvoiceSearchDataList');
      });
    },
    setCondition([[key1, key2], value]) {
      this.$store.commit('invoice/setCondition4SearchList', [[key1, key2], value]);
    },
    clearCondition() {
      this.$store.commit('invoice/clearCondition4SearchList');
    },
  },
};
</script>
<style lang="scss">
.mp-pc-invoice-search-list-page-header-comp-wrap {
  > .page-title {
    padding-bottom: 30px;
    height: 18px;
    > .blue-v-line {
      margin-right: 25px;
      line-height: 16px;
    }
  }
  > .f {
    margin-bottom: 15px;
    .mp-pc-common-comps-select-comp-wrap {
      margin-right: 40px;
      > header {
        line-height: 32px;
      }
      > .el-select {
        height: 32px;
        .el-input__inner {
          height: 32px;
          line-height: 32px;
        }
      }
      & + .mp-pc-common-comps-select-comp-wrap {
        margin-right: 0;
      }
      &.t {
        width: 244px;
        > div {
          width: 168px;
           > div.el-input > input {
            width: 168px;
           }
        }
      }
    }
  }
  > .s {
    > .mp-line-date-selector-wrap {
      min-width: 520px;
      // vertical-align: top;
      > .box {
        width: 463px;
      }
    }
    > .mp-common-comps-search-box {
      vertical-align: 26px;
    }
  }
  > .gap {
    height: 12px;
    width: 100%;
    background: #f5f5f5;
  }
}
</style>
