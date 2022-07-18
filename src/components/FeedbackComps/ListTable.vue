<template>
  <div class="tab-p">
    <el-table stripe border :data="dataList" style="width: 100%" class="ft-14-table">
      <!--  :max-height="h" :height="h" -->
      <el-table-column prop="OrderID" label="订单编号" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="下单时间" prop="CreateTime" width="137" show-overflow-tooltip>
        <span slot-scope="scope"
         >{{ scope.row.CreateTime | format2MiddleLangTypeDate}}</span>
      </el-table-column>
      <el-table-column label="订单状态" width="100" prop="OrderStatus" show-overflow-tooltip>
        <div slot-scope="scope" :class="{
            'is-font-13': 1,
            'yellow': 1,
            'is-gray': [254, 255, 35].includes(scope.row.OrderStatus),
            'is-success': scope.row.OrderStatus === 200,
          }">{{scope.row.OrderStatus | formatStatus}}</div>
      </el-table-column>
      <el-table-column prop="ProductName" label="商品名称" width="138" show-overflow-tooltip>
        <template slot-scope="scope">
          <p class="product-name">{{scope.row.ProductName}}</p>
        </template>
      </el-table-column>
      <el-table-column label="文件内容" width="138" show-overflow-tooltip>
        <template slot-scope="scope">
          <p class="content">{{scope.row.Content }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="ProductAmount" label="数量" show-overflow-tooltip width="102">
        <template slot-scope="scope">{{ scope.row.ProductAmount }}{{scope.row.Unit}}{{ scope.row.KindCount }}款</template>
      </el-table-column>
      <el-table-column label="尺寸" show-overflow-tooltip width="109">
        <span slot-scope="scope">
          <span v-if="scope.row.SizeList.length">{{ scope.row.SizeList | formatListItemSize }}</span>
        </span>
      </el-table-column>
      <el-table-column prop="CraftList" label="工艺" show-overflow-tooltip width="108">
        <span slot-scope="scope">
          <span v-if="scope.row.CraftList.length">{{ scope.row.CraftList | formatListItemCraft }}</span>
        </span>
      </el-table-column>
      <el-table-column prop="CraftList" label="售后进度" show-overflow-tooltip width="87">
        <div slot-scope="scope" class="is-font-12 btn-wrap operation-btns">
          <span class="process-state"
            :class="{
                'color-aaa':scope.row.AppealStatus === 255,
              }">{{getAfterSaleStatusText(scope.row.AfterSaleStatus)}}</span>
        </div>
      </el-table-column>
      <el-table-column label="操作" width="180" show-overflow-tooltip>
        <!-- 有没有超过售后期 有没有申请过售后 -->
        <div slot-scope="scope" class="is-font-12 btn-wrap operation-btns">
          <span class="view-more disabled" v-if="scope.row.AfterSaleStatus === null">查看</span>
          <span class="view-more" v-else
            @click="$router.push({ name: 'serviceAfterSalesDetails', query: {data:JSON.stringify(scope.row)} })">查看</span>

          <el-tooltip v-if="scope.row.AppealStatus !== 1"
            effect="dark" :content="getAppealStatusText(scope.row.AppealStatus)" placement="top">
            <span class="view-more disabled">申请售后</span>
          </el-tooltip>
          <span v-else class="view-more" @click="toAfterSale(scope.row)">申请售后</span>

          <span class="view-more disabled" v-if="scope.row.AfterSaleStatus!==0">取消服务单</span>
          <span class="view-more" v-else @click="cancelAfterSale(scope.row.AfterSaleCode)">取消服务单</span>

        </div>
      </el-table-column>
    </el-table>
    <div class="table-line"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

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
  computed: {
    ...mapState('summary', ['condition4FeedbackList']),
  },
  methods: {
    getAfterSaleStatusText(status) {
      let str = '';
      switch (status) {
        case 0:
          str = '待处理';
          break;
        case 10:
          str = '处理中';
          break;
        case 20:
          str = '退款中';
          break;
        case 30:
          str = '处理成功';
          break;
        case 40:
          str = '已驳回';
          break;
        case 255:
          str = '已取消';
          break;
        default:
          break;
      }
      return str;
    },
    getAppealStatusText(status) {
      let str = '';
      switch (status) {
        case 0:
          str = '订单未完成';
          break;
        case 2:
          str = '正在售后';
          break;
        case 3:
          str = '已退全款或全部补印';
          break;
        case 255:
          str = '超出售后期';
          break;
        default:
          break;
      }
      return str;
    },
    toAfterSale(item) {
      if (item.AppealStatus === 0) return;

      this.$router.push({ name: 'feedback', query: { isEdit: 0, data: JSON.stringify(item) } });
    },
    cancelAfterSale(code) {
      // this.messageBox
      this.messageBox.warnCancelBox({
        msg: '您确定取消本次申请吗？',
        title: '操作确认',
        successFunc: () => {
          // 发送取消请求
          this.api.getCancleApply(code).then(res => {
            if (res.data.Status === 1000) {
              this.$emit('updataList');
              // this.$store.dispatch('summary/getListData4Feedback', this.condition4FeedbackList.Page);
            }
          });
        },
      });
    },
  },
};
</script>

<style lang="scss">
.yellow{
  color: #F4A307;
}
.green{
  color: #428DFA;
}
.tab-p{
  .product-name, .content {
    overflow:hidden;
    white-space:nowrap;
    /*文字超出宽度则显示ellipsis省略号*/
    text-overflow:ellipsis;
    width:100%;
  }
}
.operation-btns{
  .view-more{
    // padding: 0 5px;
    margin: 0 5px;
    color: #428DFA;
    cursor:pointer
  }
  .disabled{
    color: #aaa;
    &:hover{
      cursor: not-allowed;
    }
  }
  .process-state{
    width: 52px;
    display: inline-block;
  }
  .view-more:active{
    color: #26BCF9;
  }
  .apply-for-after-sale{
    border-radius: 5px;
    background-color: #428DFA;
    color: #FFFFFF;
    padding: 3px 7px;
    cursor:pointer

  }
  .color-aaa{
    color: #aaa;
  }
}
</style>
