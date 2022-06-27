<template>
  <el-table
    :data="list"
    tooltip-effect="dark"
    stripe
    border
    style="width: 100%"
    ref="oTable"
    class="mp-invoice-makeup-list-table-comp-wrap"
    :class="{loading: loading}"
    :checkAllDisabled="handleAllSelectable"
    @select='onManualSelect'
    @select-all="onManualSelect"
  >
    <el-table-column type="selection" class-name="check-row" width="45" :selectable="handleItemSelectable"></el-table-column>
    <el-table-column label="订单号" width="100" prop="OrderID" show-overflow-tooltip></el-table-column>
    <el-table-column label="开票类型" prop="InvoiceCategoryName" width="100" show-overflow-tooltip></el-table-column>
    <el-table-column label="产品名称" prop="ProductName" width="120" show-overflow-tooltip></el-table-column>
    <el-table-column label="数量" width="100" show-overflow-tooltip>
      <template slot-scope="scope">
        {{ scope.row.Number }}{{ scope.row.Unit || " " }}{{scope.row.KindCount&&scope.row.KindCount>1 ? ` 共${scope.row.KindCount}款` : ''}}
      </template>
    </el-table-column>
    <el-table-column label="成交价" width="85" show-overflow-tooltip>
      <template slot-scope="scope">{{ scope.row.FinalPrice }}元</template>
    </el-table-column>
    <el-table-column label="可开票金额" width="85" show-overflow-tooltip>
      <template slot-scope="scope">{{ scope.row.InvoiceAmount }}元</template>
    </el-table-column>
    <el-table-column label="下单时间" width="125" show-overflow-tooltip>
      <span class="is-gray" slot-scope="scope">{{ scope.row.OrderTime | format2MiddleLangTypeDate }}</span>
    </el-table-column>
    <el-table-column label="订单状态" show-overflow-tooltip width="80">
      <template slot-scope="scope">{{ scope.row.OrderStatus | formatStatus }}</template>
    </el-table-column>
    <el-table-column label="备注" min-width="85" show-overflow-tooltip>
      <span class="is-gray" slot-scope="scope" v-if="!scope.row.IsAllowInvoice">{{ scope.row.NotAllowReason }}</span>
    </el-table-column>
    <div slot="empty">
      <span v-show="!loading">暂无数据</span>
    </div>
  </el-table>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    isSelectAll: {
      type: Boolean,
      default: false,
    },
    validList: {
      type: Array,
      default: () => [],
    },
    invalidList: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    isBackFromMakeup: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onManualSelect(e) {
      const curIds = this.list.map(it => it.OrderID);
      if (!this.isSelectAll) {
        const temp = this.validList.filter(id => !curIds.includes(id));
        const _list = [...temp, ...e.map((it) => it.OrderID)];
        this.$emit('update:validList', _list);
      } else {
        const temp = this.invalidList.filter(id => !curIds.includes(id));
        const _allAllowIds = this.list.filter(it => it.IsAllowInvoice).map(it => it.OrderID);
        const _list = e.map(it => it.OrderID);
        const unSelectIds = _allAllowIds.filter(id => !_list.includes(id));
        this.$emit('update:invalidList', [...temp, ...unSelectIds]);
      }
    },
    handleAllSelectable() {
      return this.list.every((it) => !it.IsAllowInvoice);
    },
    handleItemSelectable(e) {
      return e.IsAllowInvoice;
    },
    async handleDataChange() {
      if (!this.list || this.list.length === 0) return;
      const target = this.isSelectAll ? this.invalidList : this.validList;
      let _list = this.list.filter((it) => (!this.isSelectAll ? target.includes(it.OrderID) : !target.includes(it.OrderID)));
      if (_list.length > 0) {
        const _isStatusChangedIds = _list.filter((it) => !it.IsAllowInvoice).map(it => it.OrderID);
        _list = _list.filter((it) => it.IsAllowInvoice);
        // 查看其中是否有无法开票状态，如果有则筛除掉 并 更新validList和invalidList列表
        if (this.isSelectAll) {
          const canNotSelectIds = this.list.filter(it => !it.IsAllowInvoice).map(it => it.OrderID);
          const len1 = this.invalidList.length;
          const _newList = this.invalidList.filter(id => !canNotSelectIds.includes(id));
          if (len1 > _newList.length) {
            // this.$emit('update:invalidList', _newList);   // 暂不考虑筛除？
          }
        } else if (_isStatusChangedIds.length > 0) {
          this.$emit('update:validList', this.validList.filter((id) => !_isStatusChangedIds.includes(id)));
        }

        if (_list.length > 0 && this.$refs.oTable) {
          await this.$nextTick();
          _list.forEach(row => {
            this.$refs.oTable.toggleRowSelection(row);
          });
        }
      }
    },
  },
  watch: {
    isSelectAll: {
      handler(bool) {
        if (typeof bool !== 'boolean') return;
        console.log('isSelectAll', 1, bool, this.isBackFromMakeup);
        // 当选中全部状态进行切换时，应做如下处理：
        // 1. 清空validList和invalidList列表
        if (this.isBackFromMakeup) {
          this.$emit('update:isBackFromMakeup', false);
        } else {
          this.$emit('update:validList', []);
          this.$emit('update:invalidList', []);
        }
        // 2. this.$refs.oTable执行clearSelection方法； 当切换状态为true时，执行toggleAllSelection方法，进行全部选中（可能需要判断当前列表中,暂不做判断）
        if (this.$refs.oTable) {
          this.$refs.oTable.clearSelection();
          if (bool) {
            this.list.forEach(row => {
              if (row.IsAllowInvoice) this.$refs.oTable.toggleRowSelection(row);
            });
          }
        }
      },
      immediate: false,
    },
    list: {
      handler() { // 列表数据变动时，切换选中项复选框状态
        this.handleDataChange();
      },
    },
  },
};
</script>
<style lang='scss'>
.mp-invoice-makeup-list-table-comp-wrap {
  .el-table__header {
    .el-checkbox.is-disabled {
      pointer-events: none;
    }
  }
  &.loading {
    opacity: 0.25;
  }
}
</style>
