<template>
  <el-dialog
    :visible="visible"
    top='16vh'
    title="包裹列表"
    width="430px"
    destroy-on-close
    :before-close='close'
    append-to-body
    custom-class="mp-order-detail-express-more-list-dialog-comp--wrap"
  >
    <div class="content mp-scroll-wrap">
      <el-table border :data="BillNoList" stripe style="width: 100%">
        <el-table-column prop="BillNo" label="运单号" width="205"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="blue-span" @click="onClick(scope.row)">配送进度</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="footer">
      <el-button @click="close">返回</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    BillNoList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading: false,
      dataList: [],
    };
  },
  methods: {
    close() {
      this.$emit('update:visible', false);
    },
    onClick(item) {
      this.$emit('select', item);
    },
  },
};
</script>
<style lang='scss'>
.mp-order-detail-express-more-list-dialog-comp--wrap {
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
      height: 17px;
      width: 17px;
      // background-color: #428dfa;
      background: url(../../../../../assets/images/order-detail/packages.png) no-repeat center center/100% 100%;
      left: 10px;
      top: 14px;
    }
  }
  > .el-dialog__body {
    padding-top: 20px;
    padding-right: 15px;

    .content {
      padding-right: 12px;
      max-height: 443px;
      overflow: auto;

      .el-table__header-wrapper thead tr th .cell {
        color: #585858;
      }

      .el-table__body-wrapper .el-table__body tbody tr td {
        padding: 11px 0;
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
