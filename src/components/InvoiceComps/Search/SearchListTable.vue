<template>
  <el-table
    :data="list"
    tooltip-effect="dark"
    stripe
    border
    style="width: 100%"
    ref="oTable"
    class="mp-invoice-search-list-table-comp-wrap"
    :class="{loading: loading}"
  >
    <el-table-column label="申请单号" width="85" prop="InvoiceID" show-overflow-tooltip></el-table-column>
    <el-table-column label="开票类别" prop="InvoiceCategoryName" width="110" show-overflow-tooltip></el-table-column>
    <el-table-column label="抬头名称" prop="InvoiceTitle" width="150" show-overflow-tooltip>
      <template slot-scope="scope">{{ scope.row | formatInvoiceTitle }}</template>
    </el-table-column>
    <el-table-column label="开票金额" width="105" show-overflow-tooltip>
      <span class="is-pink" slot-scope="scope">{{ scope.row.InvoiceAmount }}元</span>
    </el-table-column>
    <el-table-column label="申请开票时间" width="140" show-overflow-tooltip>
      <span class="is-gray" slot-scope="scope">{{ scope.row.CreateTime | format2MiddleLangTypeDate }}</span>
    </el-table-column>
    <el-table-column label="处理时间" width="140" show-overflow-tooltip>
      <span class="is-gray" slot-scope="scope">{{ scope.row.OperateTime | format2MiddleLangTypeDate }}</span>
    </el-table-column>
    <el-table-column label="发票状态" show-overflow-tooltip width="100">
      <span
        slot-scope="scope"
        :class="{
          'is-gray': [InvoiceStatusEnums.haveMaked.ID, InvoiceStatusEnums.haveToMail.ID, InvoiceStatusEnums.canceled.ID].includes(scope.row.InvoiceStatus),
          'is-origin': [InvoiceStatusEnums.makingUp.ID].includes(scope.row.InvoiceStatus),
          'is-pink': [InvoiceStatusEnums.rejected.ID].includes(scope.row.InvoiceStatus),
        }"
       >{{ scope.row.InvoiceStatus | formatInvoiceStatus }}</span>
    </el-table-column>
    <el-table-column label="操作" min-width="85" show-overflow-tooltip>
      <template slot-scope="scope">
        <span
          class="blue-span"
          @click="onViewDetailClick(scope.row)"
          >查看</span>
        <!-- <span
          class="blue-span"
          :class="{disabled: [InvoiceStatusEnums.canceled.ID].includes(scope.row.InvoiceStatus)}"
          @click="onExcelClick(scope.row)"
          >订单导出</span> -->
        <DownLoadExcelComp :configObj="getDownLoadConfigObj(scope.row)" link btnText="订单导出" warningTipTitle="确定导出所含订单Excel数据吗?"
         :disabled="[InvoiceStatusEnums.canceled.ID].includes(scope.row.InvoiceStatus)" class="load-btn" />
        <!-- <span
          class="blue-span"
          :class="{disabled: ![InvoiceStatusEnums.pendingCheck.ID, InvoiceStatusEnums.rejected.ID].includes(scope.row.InvoiceStatus)}"
          @click="onCancelClick(scope.row)"
          >取消</span> -->
      </template>
    </el-table-column>
    <div slot="empty">
      <span v-show="!loading">暂无数据</span>
    </div>
  </el-table>
</template>

<script>
import DownLoadExcelComp from '@/components/common/UploadComp/DownLoadExcelComp.vue';
import {
  InvoiceStatusEnumList, InvoiceStatusEnums, InvoiceTypeEnums, InvoiceTitleEnums,
} from '../../../packages/InvoiceComps/enums';

export default {
  components: {
    DownLoadExcelComp,
  },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  filters: {
    formatInvoiceStatus(status) {
      const t = InvoiceStatusEnumList.find(it => it.ID === status);
      return t && t.Name ? t.Name : '';
    },
    formatInvoiceTitle({
      EnterpriseName, PersonalName, InvoiceType, InvoiceMainBody,
    }) {
      if (InvoiceType === InvoiceTypeEnums.normal.ID && InvoiceMainBody === InvoiceTitleEnums.personal.ID) {
        return PersonalName || '';
      }
      return EnterpriseName || '';
    },
  },
  data() {
    return {
      InvoiceStatusEnums,
    };
  },
  methods: {
    onViewDetailClick(item) {
      this.$emit('detail', item);
    },
    onCancelClick(item) {
      if (![InvoiceStatusEnums.pendingCheck.ID, InvoiceStatusEnums.rejected.ID].includes(item.InvoiceStatus)) {
        return;
      }
      this.messageBox.warnCancelBox({
        title: '确定取消该开票申请吗?',
        msg: `取消后记录（${item.InvoiceID}）将会被删除`,
        successFunc: () => {
          this.$emit('cancel', item);
        },
      });
    },
    getDownLoadConfigObj(item) {
      return {
        condition: { invoiceID: item.InvoiceID },
        count: 1,
        fileDefaultName: `发票[${item.InvoiceID}]所含订单列表`,
        // fileDate: this.condition4OrderList.Date,
        downFunc: data => this.api.getInvoiceOrderExportExcel(data),
        maxNumber: 15000,
        tipTitle: '订单',
        withoutSuffixTime: true,
      };
    },
    onExcelClick(item) {
      if ([InvoiceStatusEnums.canceled.ID].includes(item.InvoiceStatus)) {
        return;
      }
      console.log('onExcelClick', item);
    },
  },
};
</script>
<style lang='scss'>
.mp-invoice-search-list-table-comp-wrap {
  margin-bottom: 15px;
  .el-table__header {
    .el-checkbox.is-disabled {
      pointer-events: none;
    }
  }
  .el-table__body {
    .el-table__row {
      td {
        .cell {
          font-size: 13px;
          .blue-span {
          // font-size: 12px;
            & + .blue-span {
              margin-left: 13px;
            }
          }

          .load-btn {
            margin-left: 13px;
          }
        }
      }
    }
  }
  &.loading {
    opacity: 0.25;
  }
}
</style>
