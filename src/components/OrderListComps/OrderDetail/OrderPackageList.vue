<template>
  <section class="mp-pc-order-detail-page-package-list-comp-wrap">
    <header class="section-title">包裹列表</header>
    <div class="content" v-if="localPackageListData.BackPackageInfos">
      <!-- 普通单 -->
      <el-table v-if="localPackageListData.ExpressBillType === 0" :data="localPackageListData.BackPackageInfos"
      border style="width: 100%" :max-height="OrderID ? '' : 530"
       :span-method="objectSpanMethod">
        <el-table-column label="运单号" :min-width="OrderID ? 180 : 140" show-overflow-tooltip>
          <span v-if="scope.row && scope.row.Logistics && scope.row.Logistics.BillNo" class="gray" slot-scope="scope"
            >{{scope.row.Logistics.BillNo}}
            <span v-if="scope.row.Logistics.BillNo && localPackageListData.PackageBills.filter(it => it.ExpressBillType === 1).map(it => it.BillNo).length">
              、
            </span>
            <template v-if="localPackageListData.PackageBills.filter(it => it.ExpressBillType === 1).map(it => it.BillNo).length">
              、
              {{localPackageListData.PackageBills.filter(it => it.ExpressBillType === 1).map(it => it.BillNo).join('、')}}
            </template>
          </span>
          <span v-else class="gray is-font-12">暂未生成</span>
        </el-table-column>
        <el-table-column label="数量" :min-width="OrderID ? 140 : 92" show-overflow-tooltip>
          <span class="gray" slot-scope="scope">{{scope.row.ProductAmount}} {{localPackageListData.Order.Unit}}</span>
        </el-table-column>
        <el-table-column label="配送" :min-width="OrderID ? 180 : 92" show-overflow-tooltip>
          <span class="gray" slot-scope="scope">{{ scope.row.Logistics && scope.row.Logistics.ExpressName }}</span>
        </el-table-column>
        <el-table-column label="配送进度" :min-width="OrderID ? 120 :80" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.Status | formatStatus4PackageList}}</template>
        </el-table-column>
        <el-table-column label="配送代收" :min-width="OrderID ? 140 : 80" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.UnPaidAmount | formatNumber}}元</template>
        </el-table-column>
        <el-table-column label="操作" :min-width="OrderID ? 140 : 80">
          <template slot-scope="scope">
            <span class="span-title-blue is-font-12"
             v-if="scope.row && scope.row.Logistics && scope.row.Logistics.BillNo" @click="onExpressClick(scope.row)">配送进度</span>
            <span v-else> -- </span>
          </template>
        </el-table-column>
        <el-table-column label="" :min-width="OrderID ? 239 : 158" class-name='total-col' show-overflow-tooltip>
          <template slot-scope="scope">
            <span>配送共代收：<i class="is-pink num">{{ scope.row && totalUnPaidAmount}}</i><i class="is-pink">元</i></span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 字母单部分 -->
      <el-table v-else :data="localPackageListData.PackageBills"
      border style="width: 100%" :max-height="OrderID ? '' : 530"
       :span-method="objectSpanMethod2" v-show="localPackageListData.PackageBills.length > 0 || OrderID">
        <el-table-column label="运单号" :min-width="OrderID ? 180 : 140" show-overflow-tooltip>
          <span v-if="scope.row.BillNo" class="gray" slot-scope="scope"
            >{{scope.row.BillNo}}</span>
          <span v-else class="gray is-font-12">{{scope.row.BillNo}}</span>
        </el-table-column>
        <el-table-column label="运单包裹数量" :min-width="OrderID ? 130 :90" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-popover
              placement="top"
              trigger="hover"
              :content="scope.row.ChildBillNo.length ? scope.row.ChildBillNo.join('、') : scope.row.BillNo">
              <span slot="reference">{{scope.row.PackageCount}}个</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="数量" :min-width="OrderID ? 120 : 72" show-overflow-tooltip>
          <span class="gray" slot-scope>{{localPackageListData.Order.ProductAmount}}{{localPackageListData.Order.Unit}}</span>
        </el-table-column>
        <el-table-column label="配送" :min-width="OrderID ? 180 : 92" show-overflow-tooltip>
          <span class="gray" slot-scope="scope">
            <template v-if="scope.row.Logistics">
              {{ scope.row.Logistics && scope.row.Logistics.ExpressName }}
            </template>
            <template v-else>
              {{scope.row.ExpressName}}
            </template>
          </span>
        </el-table-column>
        <el-table-column label="配送进度" :min-width="OrderID ? 120 :80" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.Status | formatStatus4PackageList}}</template>
        </el-table-column>
        <el-table-column label="配送代收" :min-width="OrderID ? 140 : 80" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.UnPaidAmount | formatNumber}}元</template>
        </el-table-column>
        <el-table-column label="操作" :min-width="OrderID ? 140 : 80">
          <template slot-scope="scope">
            <template v-if="scope.row.Logistics">
              <span class="span-title-blue is-font-12" @click="onExpressClick(scope.row)">配送进度</span>
            </template>
            <template v-else>
              <span class="span-title-blue is-font-12" @click="onExpressClick(
              {ID:localPackageListData.BackPackageInfos[0].ID,
              Logistics:{ID:scope.row.ID}}
            )">配送进度</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="" :min-width="OrderID ? 239 : 158" class-name='total-col' show-overflow-tooltip>
          <template slot-scope="scope">
            <span>配送共代收：<i class="is-pink num">{{ scope.row && totalUnPaidAmount2}}</i><i class="is-pink">元</i></span>
          </template>
        </el-table-column>
      </el-table>
      <p v-show="!(localPackageListData.BackPackageInfos.length > 0 || localPackageListData.PackageBills.length > 0 || OrderID)
       && !isListloading" class="empty">
        <span>订单</span>
        <span class="is-bold">发货后</span>
        <span>此处将会显示发货包裹列表</span>
      </p>
    </div>
    <el-dialog
      :visible="visible"
      v-if="visible"
      top='18vh'
      title="配送进度"
      width="680px"
      destroy-on-close
      :before-close='handleBeforeDiaClose'
      append-to-body
      custom-class="mp-order-detail-express-detail-list-dialog-comp--wrap"
    >
      <ul class="order-list-express-progress-wrap" v-loading='loading' element-loading-text="正在加载中...">
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
import { format2LangTypeDateFunc } from '@/assets/js/utils/ConvertTimeFormat';

export default {
  props: {
    OrderID: {
      type: Number,
      default: 0,
    },
    PackageDataList: {
      type: Object,
      default: null,
    },
    isListloading: {
      type: Boolean,
      default: false,
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
      if (!this.localPackageListData || this.localPackageListData.BackPackageInfos.length === 0) return 0;
      let _amount = 0;
      this.localPackageListData.BackPackageInfos.forEach(it => {
        if (it.UnPaidAmount) _amount += it.UnPaidAmount;
      });
      return +(_amount.toFixed(2));
    },
    totalUnPaidAmount2() {
      if (!this.localPackageListData || this.localPackageListData.BackPackageInfos.length === 0) return 0;
      let _amount = 0;
      this.localPackageListData.PackageBills.forEach(it => {
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
          const [year, afterTime] = format2LangTypeDateFunc(it.OperateTime).split(' ');
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
    localPackageListData() {
      return this.PackageDataList || this.packageListData || {};
    },
  },
  methods: {
    // eslint-disable-next-line consistent-return
    objectSpanMethod({ rowIndex, columnIndex }) {
      if (columnIndex === 6) {
        if (rowIndex === 0) {
          return {
            rowspan: this.localPackageListData.BackPackageInfos.length,
            colspan: 1,
          };
        }
        return {
          rowspan: 0,
          colspan: 0,
        };
      }
    },
    // eslint-disable-next-line consistent-return
    objectSpanMethod2({ rowIndex, columnIndex }) {
      if (columnIndex === 7) {
        if (rowIndex === 0) {
          return {
            rowspan: this.localPackageListData.PackageBills.length,
            colspan: 1,
          };
        }
        return {
          rowspan: 0,
          colspan: 0,
        };
      }
    },
    async getExpressDetail(id, expressID) {
      if (!id || id === this.curPackageID) return;
      this.dataList = [];
      let key = true;
      this.loading = true;
      const res = await this.api.getPackageProgress(id, expressID).catch(() => { key = false; });
      this.loading = false;
      if (key && res && res.data.Status === 1000) {
        this.dataList = res.data.Data;
        this.curPackageID = id;
      }
    },
    onExpressClick({ ID, Logistics }) {
      this.visible = true;
      this.getExpressDetail(ID, Logistics.ID);
    },
    handleBeforeDiaClose() {
      this.visible = false;
    },
  },
  async mounted() {
    if (!this.OrderID) return;
    const res = await this.api.getOrderPackages(this.OrderID);
    this.$emit('setPackDataCompleted', true);
    if (res.data.Status === 1000) {
      const _list = res.data.Data;
      this.packageListData = _list;
    }
  },
};
</script>

<style lang='scss'>
.mp-pc-order-detail-page-package-list-comp-wrap {
  > .content {
    padding: 30px 40px 45px 20px;
    position: relative;
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
    > .empty {
      text-align: center;
      font-size: 14px;
      position: absolute;
      top: 48%;
      width: 100%;
      .is-bold {
        margin: 0 3px;
        font-size: 16px;
      }
    }
  }
}
.mp-order-detail-express-detail-list-dialog-comp--wrap {
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
      .left-title-wrap {
        width: 200px;
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
    .el-loading-spinner {
      .circular {
        width: 30px;
        height: 30px;
      }
    }
  }
}
</style>
