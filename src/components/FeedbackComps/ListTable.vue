<template>
  <el-table stripe border :data="dataList" style="width: 100%" class="ft-14-table">
      <!--  :max-height="h" :height="h" -->
      <el-table-column prop="Order.OrderID" label="订单号" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="产品名称" prop="Order.ProductName" width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="产品类型" width="120" prop="Order.SecondLevelName" show-overflow-tooltip>
        <!-- <span slot-scope="scope" :class="{'is-pink': scope.row.Type === 21, 'is-success': scope.row.Type === 11}"
         >{{ scope.row.Type | formatTransactionType }}</span> -->
      </el-table-column>
      <el-table-column label="售后原因" width="260" show-overflow-tooltip>
        <template slot-scope="scope">{{getApplyText(scope.row.QuestionList)}}</template>
      </el-table-column>
      <el-table-column label="诉求意向" width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.AppealType | formatAppealType }}</template>
      </el-table-column>
      <el-table-column label="申请时间" show-overflow-tooltip width="150">
        <template slot-scope="scope">{{ scope.row.CreateTime | format2MiddleLangTypeDate }}</template>
      </el-table-column>
      <el-table-column prop="Content" label="进度" show-overflow-tooltip width="119">
        <div slot-scope="scope">
          <span :class="getStatusClass(scope.row.Status)">{{ scope.row.Status | formatFeedbackProgress }}
          </span>
          <!-- <el-tooltip effect="dark" :content="scope.row.RejectReason" placement="top"
           v-if="(scope.row.Status === 3 && scope.row.RejectReason)">
            <i class="el-icon-question"></i>
          </el-tooltip> -->
        </div>
      </el-table-column>
      <el-table-column label="操作" width="160" show-overflow-tooltip>
        <div class="is-font-12 btn-wrap" slot-scope="scope">
          <!-- <span class="span-title-blue"
            v-if="scope.row.Status !== 0">编辑</span> -->
          <span class="span-title-blue" @click="onDetailClick(scope.row)" style="margin-right: 8px">查看详情</span>
          <span class="span-title-pink" v-if="scope.row.Status === 0" @click="onCancleClick(scope.row)">取消</span>
          <span class="is-cancel" :style="{paddingLeft:'6px', paddingRight:'6px'}" v-else>取消</span>
        </div>
      </el-table-column>
    </el-table>
</template>

<script>
export default {
  props: {
    dataList: {
      type: Array,
      default: () => [],
    },
    dataNumber: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    getStatusClass(status) {
      let str = '';
      switch (status) {
        case 0:
          str = 'is-black';
          break;
        case 1:
          str = 'is-cyan';
          break;
        case 2:
          str = 'is-success';
          break;
        case 3:
          str = 'is-pink';
          break;
        case 255:
          str = 'is-gray';
          break;
        default:
          break;
      }
      return str;
    },
    getApplyText(list) { // 获取售后原因
      const _arr = list.map(it => it.Title);
      return _arr.join('、');
    },
    onDetailClick(data) {
      this.$store.commit('summary/setListData', this.dataList);
      this.$store.commit('summary/setListDataNumber', this.dataNumber);
      this.$store.commit('summary/setEditFeedbackData', data);
      const { OrderID, Content } = data.Order;
      this.$router.push({ name: 'feedback', params: { id: OrderID, desc: Content, type: 'detail' } });
    },
    async handleCancel(ID) {
      const res = await this.api.getAfterSalesCancle(ID);
      if (res.data.Status === 1000) {
        this.messageBox.successSingle({
          title: '取消成功',
          successFunc: () => {
            this.$emit('handleCancel', ID);
          },
        });
      }
    },
    onCancleClick({ ID, Order, Status }) {
      if (Status !== 0) return;
      this.messageBox.warnCancelBox({
        title: '确定取消该反馈申请吗?',
        msg: `订单号：[ ${Order.OrderID} ]`,
        successFunc: () => {
          this.handleCancel(ID);
        },
      });
    },
  },
};
</script>

<style>

</style>
