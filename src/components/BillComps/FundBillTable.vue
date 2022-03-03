<template>
  <section>
    <el-table stripe border :data="dataList" style="width: 100%" class="ft-14-table">
      <!--  :max-height="h" :height="h" -->
      <el-table-column prop="BillID" label="流水号" width="220" show-overflow-tooltip></el-table-column>
      <el-table-column :label="BillTypeTitle" width="150" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.Amount }}{{BillTypeUnit}}</template>
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
import { BillTypeEnums } from '@/assets/js/ClassType/Summary/ConditionForBillList';

export default {
  props: {
    dataList: {
      type: Array,
      default: () => [],
    },
    curBillType: {
      type: Number,
      default: BillTypeEnums.FundCash.ID,
    },
  },
  data() {
    return {
      h: 0,
    };
  },
  computed: {
    BillTypeTitle() {
      if (this.curBillType === BillTypeEnums.FundCash.ID) return '金额';
      return '数量';
    },
    BillTypeUnit() {
      if (this.curBillType === BillTypeEnums.FundCash.ID) return '元';
      return '个';
    },
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
