<template>
  <section class="mp-pc-bean-purchase-history-list-page-wrap">
    <header>
      <div class="header-content">
        <SingleSelector
          title='充值状态'
          v-model="listClassData.condition.Status"
          :optionList='BillTypeList'
          :defaultProps="{label: 'Name',value: 'ID',}"
          @change="getDataList(1)"
        />
        <LineDateSelectorComp
          :changePropsFunc='setCondition'
          :requestFunc='getDataList'
          :isFull="false"
          :typeList="[['DateType', ''], ['CreateDate', 'First'], ['CreateDate', 'Second']]"
          :dateValue='listClassData.condition.DateType'
          :initDate='listClassData.condition.CreateDate'
          :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
          label="创建时间"
          :dateList="dateList"
          dateType="daterange"
        />
      </div>
    </header>
    <main class="content-wrap">
      <div class="content">
        <!-- <p class="blue-v-line is-bold is-black">印豆购买记录</p> -->
        <BeanPurchaseHistoryTable :dataList='listClassData.dataList' :loading='listClassData.loading' @pay="onItemPayClick" @cancle="onItemCancelClick"/>
        <QrCodeForPayDialogComp
          v-model="visible"
          :payInfoData="curBuyItemData"
          @success='handlePaidSuccess'
          showExpire
          dynamic
          showPayDescription
          showAmount
          hiddenHeader
          width='530px'
          top='18vh'
          successTitle='充值成功，请查看印豆余额'
         >
          <div class="bean-pay-detail-box" v-if="curBuyItemData">
            <p>
              <label>充值总数量：</label>
              <span>{{curBuyItemData.Number}}个</span>
            </p>
          </div>
        </QrCodeForPayDialogComp>
      </div>
    </main>
    <footer>
      <Count
        :watchPage='listClassData.condition.Page'
        :handlePageChange='getDataList'
        :count='listClassData.dataListNumber'
        :pageSize='listClassData.condition.PageSize'
        class="float"
      />
    </footer>
  </section>
</template>

<script>
import BeanPurchaseHistoryListClass from '../../assets/js/ClassType/BeanPurchaseHistory/BeanPurchaseHistoryListClass';
import { BillBoughtStatusEnumList, BillBoughtStatusEnums } from '../../assets/js/ClassType/BeanPurchaseHistory/ConditionForPurchaseHistory';
import SingleSelector from '../../components/common/Selector/SingleSelector.vue';
import LineDateSelectorComp from '../../components/common/Selector/LineDateSelectorComp.vue';
import BeanPurchaseHistoryTable from '../../components/BuyBeanComps/BeanPurchaseHistoryTable.vue';
import QrCodeForPayDialogComp from '../../packages/QrCodeForPayDialogComp';
import Count from '../../components/common/Count.vue';

export default {
  components: {
    SingleSelector,
    LineDateSelectorComp,
    BeanPurchaseHistoryTable,
    QrCodeForPayDialogComp,
    Count,
  },
  data() {
    return {
      listClassData: new BeanPurchaseHistoryListClass(),
      BillTypeList: [{ ID: '', Name: '不限' }, ...BillBoughtStatusEnumList],
      dateList: [
        { label: '全部', value: 'all' },
        { label: '今天', value: 'today' },
        { label: '昨天', value: 'yesterday' },
        { label: '前天', value: 'beforeyesterday' },
        { label: '本月', value: 'curMonth' },
        { label: '上月', value: 'lastMonth' },
      ],
      visible: false,
      curBuyItemData: null,
    };
  },
  computed: {
    UserDefinedTimeIsActive() {
      return this.listClassData.condition.DateType === ''
          && !!this.listClassData.condition.CreateDate.First
          && !!this.listClassData.condition.CreateDate.Second;
    },
  },
  methods: {
    setCondition(data) {
      this.listClassData.setCondition(data);
    },
    getDataList(Page = 1) {
      this.listClassData.getDataList(Page);
    },
    onItemPayClick(item) {
      if (!item) return;
      this.curBuyItemData = item;
      this.visible = true;
    },
    handlePaidSuccess() { // 完成扫码支付
      // 重新获取账号余额及印豆信息
      this.curBuyItemData.Status = BillBoughtStatusEnums.HavePay.ID;
      this.$store.dispatch('common/getCustomerFundBalance');
    },
    async onItemCancelClick(item) {
      if (!item || !item.PayCode) return; // PayCode
      const resp = await this.api.getPrintBeanRechargeCancle(item.PayCode).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        this.messageBox.successSingle({
          title: '取消成功',
          successFunc: () => {
            const _item = item;
            _item.Status = BillBoughtStatusEnums.Cancled.ID;
          },
        });
      }
    },
  },
  mounted() {
    this.getDataList();
  },
};
</script>
<style lang='scss'>
.mp-pc-bean-purchase-history-list-page-wrap {
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
        &.mp-line-date-selector-wrap > .box {
          width: 710px;
        }
      }
    }
  }
  > main.content-wrap {
    margin-top: 22px;
    width: 100%;
    background-color: #fff;
    min-height: calc(100vh - 320px);
    > .content {
      width: 1200px;
      margin: 0 auto;
      padding-top: 25px;
      // > div {
      //   margin-top: 19px;
      //   height: 55px;
      // }
      // > section {
      //   min-height: calc(100vh - 135px - 45px - 193px);
      // }
      > .em {
        text-align: center;
        width: 100%;
        height: calc(100vh - 280px);
        box-sizing: border-box;
        padding-top: calc(50vh - 200px);
        overflow: hidden;
        > p {
          color: #989898;
          margin-top: 15px;
        }
      }
      .qr-code-content {
        height: 400px;
        .bean-pay-detail-box {
          padding-top: 30px;
        }
      }
      > p {
        margin-bottom: 18px;
        margin-top: -10px;
      }
      td.remark-col {
        > div.cell {
          color: #888;
          font-size: 12px;
        }
      }
    }
  }
  > footer {
    height: 45px;
    padding: 15px 0;
    background-color: #fff;
    padding-top: 19px;
    margin-bottom: 15px;
    .count-wrap {
      width: 1200px;
      margin: 0 auto;
    }
  }
}
</style>
