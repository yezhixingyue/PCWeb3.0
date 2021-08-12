<template>
  <section>
    <el-table stripe border :data="dataList" style="width: 100%" class="ft-14-table">
      <!--  :max-height="h" :height="h" -->
      <el-table-column prop="BillID" label="流水号" width="220" show-overflow-tooltip></el-table-column>
      <el-table-column label="金额" width="150" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.Amount }}元</template>
      </el-table-column>
      <el-table-column label="交易类型" width="130" show-overflow-tooltip>
        <span slot-scope="scope" :class="{'is-pink': scope.row.Type === 21, 'is-success': scope.row.Type === 11}"
         >{{ scope.row.Type | formatTransactionType }}</span>
      </el-table-column>
      <el-table-column label="渠道" show-overflow-tooltip width="120">
        <template slot-scope="scope">{{ scope.row.Currency | formatTransactionCurrency }}</template>
      </el-table-column>
      <el-table-column prop="Remark" label="备注" width="240" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="OrderIDString" label="订单号" width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="Content" label="时间" show-overflow-tooltip width="189">
        <span class="gray" slot-scope="scope">{{ scope.row.OperateTime | format2MiddleLangTypeDate }}</span>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
export default {
  props: {
    dataList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      h: 0,
    };
  },
  methods: {
    getHeight() {
      const oBody = document.getElementsByTagName('body')[0];
      return oBody.offsetHeight - 410;
    },
    setHeight() {
      const tempHeight = this.getHeight();
      this.h = tempHeight;
    },
  },
  // mounted() {
  //   this.$nextTick(() => this.setHeight());
  //   window.addEventListener('resize', this.setHeight);
  // },
  // beforeDestroy() {
  //   window.removeEventListener('resize', this.setHeight);
  // },
};
</script>

<style>

</style>
