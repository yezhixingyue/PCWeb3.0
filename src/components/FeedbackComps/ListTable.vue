<template>
  <el-table stripe border :data="dataList" style="width: 100%" class="ft-14-table">
      <!--  :max-height="h" :height="h" -->
      <el-table-column prop="Order.OrderID" label="订单编号" width="133" show-overflow-tooltip></el-table-column>
      <el-table-column label="下单时间" prop="Order.ProductName" width="137" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="订单状态" width="137" prop="Order.SecondLevelName" show-overflow-tooltip>
        <!-- <span slot-scope="scope" :class="{'is-pink': scope.row.Type === 21, 'is-success': scope.row.Type === 11}"
         >{{ scope.row.Type | formatTransactionType }}</span> -->
         <template slot-scope="scope">{{ scope.row.Order.ClassList | getClassName }}</template>
      </el-table-column>
      <el-table-column label="商品名称" width="138" show-overflow-tooltip>
        <template slot-scope="scope">{{getApplyText(scope.row.QuestionList)}}</template>
      </el-table-column>
      <el-table-column label="文件内容" width="138" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.AppealType | formatAppealType }}</template>
      </el-table-column>
      <el-table-column label="数量" show-overflow-tooltip width="109">
        <template slot-scope="scope">{{ scope.row.CreateTime | format2MiddleLangTypeDate }}</template>
      </el-table-column>
      <el-table-column prop="Content" label="尺寸" show-overflow-tooltip width="109">
        <div slot-scope="scope">
          <span :class="getStatusClass(scope.row.Status)">{{ scope.row.Status | formatFeedbackProgress }}
          </span>
        </div>
      </el-table-column>
      <el-table-column prop="Content" label="工艺" show-overflow-tooltip width="108">
        <div slot-scope="scope">
          <span :class="getStatusClass(scope.row.Status)">{{ scope.row.Status | formatFeedbackProgress }}
          </span>
        </div>
      </el-table-column>
      <el-table-column label="操作" width="190" show-overflow-tooltip>
        <div class="is-font-12 btn-wrap">
          <span class="span-title-blue" style="margin-right: 8px">待处理</span>
          <span class="span-title-pink">查看</span>
          <span class="is-cancel">申请售后</span>
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
  filters: {
    getClassName(ClassList) {
      const t = ClassList.find(it => it.Type === 2);
      if (t) {
        const f = t.FirstLevel && t.FirstLevel.Name ? `${t.FirstLevel.Name}` : '';
        const s = t.SecondLevel && t.SecondLevel.Name ? `${t.SecondLevel.Name}` : '';
        const n = `${f}${f && s ? '-' : ''}${s}`;
        if (n) return n;
      }
      return '';
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
      this.$router.push({ name: 'feedback', params: { id: OrderID, desc: Content || '无', type: 'detail' } });
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
