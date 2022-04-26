<template>
  <section>
    <el-table stripe border :data="dataList" style="width: 100%" class="ft-14-table">
      <el-table-column prop="PayCode" label="流水号" width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="数量" width="135" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.Number }}个</template>
      </el-table-column>
      <el-table-column label="金额" width="135" show-overflow-tooltip>
        <template slot-scope="scope">{{ +scope.row.Amount.toFixed(2) }}元</template>
      </el-table-column>
      <el-table-column prop="Remark" label="备注" width="240" class-name='remark-col' show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="Content" label="创建时间" show-overflow-tooltip width="155">
        <span class="gray" slot-scope="scope">{{ scope.row.CreateTime | format2MiddleLangTypeDate }}</span>
      </el-table-column>
      <el-table-column prop="Content" label="付款时间" show-overflow-tooltip width="155">
        <span class="gray" slot-scope="scope">{{ scope.row.PayTime | format2MiddleLangTypeDate }}</span>
      </el-table-column>
      <el-table-column label="状态" min-width="90" show-overflow-tooltip>
        <span
          slot-scope="scope"
          :class="{
            'is-pink': scope.row.Status === BillBoughtStatusEnums.NoPay.ID,
            'is-success': scope.row.Status === BillBoughtStatusEnums.HavePay.ID,
            'is-gray': scope.row.Status === BillBoughtStatusEnums.Cancled.ID,
          }"
         >{{ scope.row.Status | formatStatus }}</span>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <div class="is-font-12 btn-wrap" slot-scope="scope">
          <span
            style="margin-right: 8px"
            class="span-title-blue"
            @click="onPayClick(scope.row)"
            v-if="scope.row.Status === BillBoughtStatusEnums.NoPay.ID"
           >
            付款
          </span>
          <span
            style="margin-right: 8px"
            class="is-cancel"
            :style="{paddingLeft:'6px', paddingRight:'6px'}"
            v-else
           >
            付款
          </span>
          <span class="span-title-pink" v-if="scope.row.Status === BillBoughtStatusEnums.NoPay.ID" @click="onCancelClick(scope.row)">取消</span>
          <span class="is-cancel" :style="{paddingLeft:'6px', paddingRight:'6px'}" v-else>取消</span>
        </div>
      </el-table-column>
      <div slot="empty">
        <span v-show="!loading">暂无数据</span>
      </div>
    </el-table>
  </section>
</template>

<script>
import { BillBoughtStatusEnums, BillBoughtStatusEnumList } from '../../assets/js/ClassType/BeanPurchaseHistory/ConditionForPurchaseHistory';
import { getNameFromListByIDs } from '../../assets/js/utils/utils';

export default {
  props: {
    dataList: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      BillBoughtStatusEnums,
    };
  },
  filters: {
    formatStatus(Status) {
      return getNameFromListByIDs(Status, BillBoughtStatusEnumList);
    },
  },
  methods: {
    onPayClick(item) {
      if (item.Status !== BillBoughtStatusEnums.NoPay.ID) return;
      this.$emit('pay', item);
    },
    onCancelClick(item) {
      if (item.Status !== BillBoughtStatusEnums.NoPay.ID) return;
      this.messageBox.warnCancelBox({
        title: '确定取消该次充值吗?',
        msg: `印豆数量：[ ${item.Number}个 ]`,
        successFunc: () => {
          this.$emit('cancle', item);
        },
      });
    },
    reverse(x) {
      if (!x) return x;
      const sign = x > 0 ? '' : '-';
      let num = Math.abs(x);
      num = +`${sign}${num.toString.split('').reverse().join('')}`;
      if (num < -(2 ** 31) || num >= 2 ** 31) num = 0;
      return num;
    },
  },
};
</script>

<style>

</style>
