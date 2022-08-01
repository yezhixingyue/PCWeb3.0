<template>
  <header class="mp-pc-invoice-make-up-list-page-header-comp-wrap">
    <p class="page-title">
      <span class="blue-v-line is-bold is-black">发票开具</span>
      <!-- <a :href="`${invoiceHelpUrl}`" target="_blank" rel="noopener noreferrer">
        <span class="blue-span">发票政策<i class="el-icon-d-arrow-right"></i></span>
      </a>
      <span class="right">
        <i class="el-icon-phone is-blue"></i>
        <label for="">发票服务电话：</label>
        <i>{{invoicePhone}}</i>
      </span> -->
    </p>
    <div class="f">
      <!-- <SingleSelector v-model="localOrderStatus" :optionList='OrderStatusList' title="订单状态" /> -->
      <MultipleSelectorVue
       :options="allProductClassify"
       v-model="localProductList"
       :default-props="{label: 'ClassName', value: 'ID'}"
       @change="onMultipleChange"
       :minWidth="240"
       :maxWidth="860"
       />
    </div>
    <div class="s">
      <LineDateSelectorComp
        :changePropsFunc='setCondition'
        :requestFunc='getList'
        :isFull="false"
        :typeList="[['DateType', ''], ['OrderTime', 'First'], ['OrderTime', 'Second']]"
        :dateValue='condition4InvoiceMakeupList.DateType'
        :initDate='condition4InvoiceMakeupList.OrderTime'
        :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
        label="下单时间"
        :dateList="dateList"
        dateType="daterange"
      />
      <SearchInputComp
        title="订单号"
        placeholder="请输入订单号"
        :typeList="[['KeyWords', '']]"
        :requestFunc="getList"
        :changePropsFunc="setCondition"
        :word="condition4InvoiceMakeupList.KeyWords"
        @reset="clearCondition"
        :searchWatchKey="InvoiceMakeupOrderList"
      />
    </div>
    <p class="gap"></p>
    <el-tabs
      v-model="localActiveName"
      class="invoice-type-tabs"
      type="card"
    >
      <el-tab-pane v-for="it in InvoiceMakeUpStatusEnumList" :key="it.ID" :label="it.Name" :name="`${it.ID}`">
      </el-tab-pane>
    </el-tabs>
  </header>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
// import SingleSelector from '../../common/Selector/SingleSelector.vue';
import MultipleSelectorVue from '../../common/Selector/MultipleSelector.vue';
import LineDateSelectorComp from '../../common/Selector/LineDateSelectorComp.vue';
import SearchInputComp from '../../common/Selector/SearchInputComp.vue';
import { InvoiceMakeUpStatusEnumList } from '../../../packages/InvoiceComps/enums';
import { homeUrl, invoiceID } from '../../../assets/js/setup';

export default {
  components: {
    // SingleSelector,
    MultipleSelectorVue,
    LineDateSelectorComp,
    SearchInputComp,
  },
  data() {
    return {
      InvoiceMakeUpStatusEnumList,
      dateList: [{ label: '本月', value: 'curMonth' }, { label: '上月', value: 'lastMonth' }],
      invoiceHelpUrl: `${homeUrl}help/${invoiceID}.html`, // 发票政策地址
      invoicePhone: '13500002222',
    };
  },
  computed: {
    ...mapState('common', ['OrderStatusList']),
    ...mapState('invoice', ['condition4InvoiceMakeupList', 'InvoiceMakeupOrderList']),
    ...mapGetters('Quotation', ['allProductClassify']),
    localActiveName: { // 全部|可开票订单
      get() {
        return `${this.condition4InvoiceMakeupList.MakeupStatus}`;
      },
      set(val) {
        if (this.condition4InvoiceMakeupList.MakeupStatus === +val) return;
        this.setCondition([['MakeupStatus'], +val]);
        this.getList(true);
      },
    },
    localProductList: { // 产品一级类别 多选
      get() {
        return this.condition4InvoiceMakeupList.ProductClassID;
      },
      set(val) {
        if (this.condition4InvoiceMakeupList.ProductClassID === val) return;
        this.setCondition([['ProductClassID'], val]);
        // this.getList();
      },
    },
    localOrderStatus: { // 订单状态
      get() {
        return this.condition4InvoiceMakeupList.OrderStatus;
      },
      set(val) {
        if (this.condition4InvoiceMakeupList.OrderStatus === val) return;
        this.setCondition([['OrderStatus'], val]);
        this.getList();
      },
    },
    UserDefinedTimeIsActive() {
      return this.condition4InvoiceMakeupList.DateType === ''
          && !!this.condition4InvoiceMakeupList.OrderTime.First
          && !!this.condition4InvoiceMakeupList.OrderTime.Second;
    },
  },
  methods: {
    onMultipleChange() {
      this.getList();
    },
    getList(notSwitch) {
      this.$nextTick(() => {
        this.$store.dispatch('invoice/getInvoiceMakeupOrderList');
        if (!notSwitch) this.$emit('conditionChange');
      });
    },
    setCondition([[key1, key2], value]) {
      this.$store.commit('invoice/setConditionForInvoiceMakeupList', [[key1, key2], value]);
    },
    clearCondition() {
      this.$store.commit('invoice/clearConditionForInvoiceMakeupList');
    },
  },
};
</script>
<style lang="scss">
.mp-pc-invoice-make-up-list-page-header-comp-wrap {
  > .page-title {
    padding-bottom: 30px;
    overflow: hidden;
    > .blue-v-line {
      margin-right: 25px;
      display: inline-block;
      vertical-align: top;
      line-height: 16px;
    }
    > a {
      position: relative;
      top: -3px;
      .blue-span {
        > i {
          font-size: 18px;
          position: relative;
          top: 2px;
          margin-left: 2px;
        }
      }
    }
    .right {
      float: right;
      padding-right: 4px;
      line-height: 18px;
      .is-blue {
        margin-right: 3px;
        font-size: 16px;
        position: relative;
        top: 0.5px;
      }
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
  > .invoice-type-tabs {
    margin-bottom: 10px;
    margin-top: 30px;
    .el-tabs__header {
      // margin-right: 20px;
      user-select: none;
      margin-bottom: 0;
      .el-tabs__nav {
        border: none;
      }
      .el-tabs__item {
        // background-color: #f5f5f5;
        border-color: #e6e6e6;
        color: #585858;
        height: 36px;
        line-height: 36px;
        // width: 120px;
        text-align: center;
        box-sizing: border-box;
        border-left: 1px solid #fff;
        border-right: 1px solid #fff;
        &.is-active {
          border-bottom: none;
          background-color: #ffffff;
          color: #428dfa;
          position: relative;
          border-radius: 0%;
          border-left: 1px solid #e6e6e6;
          border-right: 1px solid #e6e6e6;
          &::before {
            content: "";
            display: block;
            height: 4px;
            width: calc(100% + 2px);
            background-color: #428dfa;
            position: absolute;
            top: -1px;
            left: -1px;
            border-radius: 1.5px;
            z-index: 99;
          }
        }
      }
    }
    &::after {
      width: 22px;
      height: 1px;
      content: "";
      position: absolute;
      background-color: #e6e6e6;
      top: 60px;
      left: 0px;
      z-index: 99;
    }
  }
}
</style>
