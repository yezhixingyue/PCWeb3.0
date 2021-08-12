<template>
  <section class="mp-pc-order-detail-page-package-list-comp-wrap">
    <header class="section-title">包裹列表</header>
    <div class="content">
      <el-table :data="packageListData" border style="width: 100%" :span-method="objectSpanMethod">
        <el-table-column label="运单号" width="180">
          <span v-if="scope.row && scope.row.Logistics && scope.row.Logistics.BillNo" class="gray" slot-scope="scope"
            >{{scope.row.Logistics.BillNo}}</span>
          <span v-else class="gray is-font-12">暂未生成</span>
        </el-table-column>
        <el-table-column label="数量" width="140">
          <span class="gray" slot-scope="scope">{{scope.row.ProductAmount + Unit}}</span>
        </el-table-column>
        <el-table-column label="配送" width="180">
          <span class="gray" slot-scope="scope">{{ scope.row && Express}}</span>
        </el-table-column>
        <el-table-column label="配送进度" width="120">
          <template slot-scope="scope">{{ scope.row.Status | formatStatus4PackageList}}</template>
        </el-table-column>
        <el-table-column label="配送代收" width="140">
          <template slot-scope="scope">{{+(scope.row.UnPaidAmount && scope.row.UnPaidAmount.toFixed(2))}}元</template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <span class="span-title-blue is-font-12" @click="onExpressClick(scope.row)">配送进度</span>
          </template>
        </el-table-column>
        <el-table-column label="" width="239" class-name='total-col'>
          <template slot-scope="scope">
            <span>配送共代收：<i class="is-font-16 is-pink">{{ scope.row && totalUnPaidAmount}}元</i></span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :visible="visible"
      v-if="visible"
      top='18vh'
      title="配送进度"
      width="750px"
      v-dialogDrag
      destroy-on-close
      :before-close='handleBeforeDiaClose'
      custom-class="mp-express-detail-wrap"
    >
      <ul class="order-list-express-progress-wrap" v-loading='loading'>
        <template v-if="list.length > 0">
          <MiniProgressItem v-for="(item,i) in list" :key='item.Status + "-" + i' :data='item' />
        </template>
        <li v-else-if='!loading' class="no-info-box">
          暂无信息
        </li>
      </ul>
      <div class="footer">
        <el-button @click="handleBeforeDiaClose">关闭</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import MiniProgressItem from '@/components/common/MiniProgressItem.vue';

export default {
  props: {
    OrderID: {
      type: Number,
      default: 0,
    },
    Unit: {
      type: String,
      default: '',
    },
    Express: {
      type: String,
      default: '',
    },
  },
  components: {
    MiniProgressItem,
  },
  data() {
    return {
      packageListData: null,
      visible: false,
      dataList: [],
      curPackageID: '',
      loading: false,
    };
  },
  computed: {
    totalUnPaidAmount() {
      if (!this.packageListData || this.packageListData.length === 0) return 0;
      let _amount = 0;
      this.packageListData.forEach(it => {
        if (it.UnPaidAmount) _amount += it.UnPaidAmount;
      });
      return +(_amount.toFixed(2));
    },
    list() {
      if (!this.dataList) return [];
      const arr = [];
      this.dataList.forEach((it, i) => {
        const obj = {};
        if (it.Operator) obj.operator = it.Operator;
        obj.showLine = true;
        if (i === 0) obj.showLine = false;
        if (i === this.dataList.length - 1) obj.isNewest = true;
        if (it.Description) obj.expressDetail = it.Description;
        if (it.OperateTime) {
          const [year, afterTime] = it.OperateTime.split('T');
          obj.afterTime = afterTime;
          obj.year = year;
        }
        arr.push(obj);
      });
      const newArr = arr.map((item, index) => {
        const temp = item;
        if (index < arr.length - 1 && temp.year === arr[index + 1].year) temp.year = '';
        return temp;
      }).reverse();
      return newArr;
    },
  },
  methods: {
    // eslint-disable-next-line consistent-return
    objectSpanMethod({ rowIndex, columnIndex }) {
      if (columnIndex === 6) {
        if (rowIndex === 0) {
          return {
            rowspan: this.packageListData.length,
            colspan: 1,
          };
        }
        return {
          rowspan: 0,
          colspan: 0,
        };
      }
    },
    async getExpressDetail(id) {
      if (!id || id === this.curPackageID) return;
      this.dataList = [];
      let key = true;
      this.loading = true;
      const res = await this.api.getPackageProgress(id).catch(() => { key = false; });
      this.loading = false;
      if (key && res && res.data.Status === 1000) {
        this.dataList = res.data.Data;
        this.curPackageID = id;
      }
    },
    onExpressClick({ ID }) {
      this.visible = true;
      this.getExpressDetail(ID);
    },
    handleBeforeDiaClose() {
      this.visible = false;
    },
  },
  async mounted() {
    if (!this.OrderID) return;
    // this.$emit('setPackDataCompleted', false);
    const res = await this.api.getOrderPackageList(this.OrderID);
    this.$emit('setPackDataCompleted', true);
    if (res.data.Status === 1000) {
      const _list = [...res.data.Data];
      this.packageListData = _list;
    }
  },
};
</script>

<style lang='scss'>
.mp-pc-order-detail-page-package-list-comp-wrap {
  > .content {
    padding: 30px 40px 45px 20px;
    .el-table {
      .el-table__body-wrapper .el-table__body tbody tr td {
        padding: 10px 0;
        border-top: 1px solid #eee;
        > .cell {
          font-size: 13px;
        }
        &.total-col {
          border-left: 1px solid #eee;
          background-color: #fff !important;
        }
      }
      .has-gutter > tr > th.is-leaf {
        border: none;
        > .cell {
          color: #585858;
        }
      }
    }
  }
  .mp-express-detail-wrap {
    color: red;
    > .el-dialog__header {
      height: 45px;
      box-sizing: border-box;
      padding: 14px 10px;
      padding-left: 23px;
      margin: 0 10px;
      border-bottom: 1px solid #eee;
      > .el-dialog__title {
        font-size: 14px;
        color: #888;
        line-height: 16px;
        height: 16px;
        padding-left: 16px;
      }
      > .el-dialog__headerbtn {
        top: 8px;
        font-size: 20px;
      }
      position: relative;
      &::before {
        content: '';
        position: absolute;
        height: 20px;
        width: 18px;
        // background-color: #428dfa;
        background: url(../../../assets/images/express.png) no-repeat center center/100% 100%;
        left: 10px;
        top: 13px;
      }
    }
    > .el-dialog__body {
      // min-height: 340px;
      .order-list-express-progress-wrap {
        min-height: 260px;
        max-height: 420px;
        overflow: auto;
        .el-loading-spinner {
          top: 30%;
        }
        .no-info-box {
          text-align: center;
          padding-top: 75px;
          color: #888;
          font-size: 13px;
        }
      }
      .footer {
        text-align: center;
        margin-top: 40px;
        > button {
          width: 110px;
          height: 35px;
          padding: 0;
          color: #428dfa;
          border-color: #428dfa;
        }
      }
    }
  }
}
</style>
