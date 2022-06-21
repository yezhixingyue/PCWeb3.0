<template>
  <section class="mp-invoice-combine-list-table-comp-wrap">
    <header class="blue-v-line is-bold is-black" v-if="!onlyOpenningInfo">开票信息</header>
    <el-table
      :data="list"
      tooltip-effect="dark"
      stripe
      border
      style="width: 100%"
      max-height="450"
      ref="oTable"
      :class="{loading: loading}"
    >
      <el-table-column label="开票类别" prop="CategoryName" :width="onlyOpenningInfo ? '300' : '400'" show-overflow-tooltip></el-table-column>
      <el-table-column label="订单数量" prop="OrderNumber" width="160" v-if="!onlyOpenningInfo" show-overflow-tooltip></el-table-column>
      <el-table-column label="商品数量" width="160" show-overflow-tooltip v-if="!onlyOpenningInfo">
        <template slot-scope="scope">{{ scope.row.ProductNumber }}{{ scope.row.CategoryUnit || "" }}</template>
      </el-table-column>
      <el-table-column label="单位" prop="CategoryUnit" width="160" v-if="onlyOpenningInfo" show-overflow-tooltip></el-table-column>
      <el-table-column label="数量" prop="ProductNumber" width="160" v-if="onlyOpenningInfo" show-overflow-tooltip></el-table-column>
      <el-table-column label="金额" min-width="100" show-overflow-tooltip>
        <span slot-scope="scope" class="is-pink">￥ {{ scope.row.InvoiceAmount || scope.row.InvoiceAmount === 0 ? scope.row.InvoiceAmount : '-' }}</span>
      </el-table-column>
      <div slot="empty">
        <span v-show="!loading">暂无数据</span>
      </div>
    </el-table>
    <footer v-if="!onlyOpenningInfo">
      <span class="is-gray">共计金额：<em class="is-pink">￥ {{total || total === 0 ? total : '-'}} 元</em></span>
    </footer>
  </section>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Array,
      default: () => '',
    },
    total: {
      default: '',
    },
    onlyOpenningInfo: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style lang='scss'>
.mp-invoice-combine-list-table-comp-wrap {
  margin-bottom: 20px;
  > header {
    margin-bottom: 20px;
  }
  .el-table__header-wrapper thead tr th {
    font-size: 14px;
    padding: 8px 0;
  }
  .el-table__body-wrapper {
    .el-table__row {
      .cell {
        font-size: 13px;
      }
    }
  }
  > footer {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
