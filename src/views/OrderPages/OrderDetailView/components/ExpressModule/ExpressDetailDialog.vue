<template>
  <el-dialog
    :visible="visible"
    top='18vh'
    title="配送进度"
    width="680px"
    destroy-on-close
    :before-close='close'
    @open="onOpen"
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
      <el-button @click="close">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import MiniProgressItem from '@/components/common/MiniProgressItem.vue';
import { format2LangTypeDateFunc } from '@/assets/js/utils/ConvertTimeFormat';

export default {
  components: {
    MiniProgressItem,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    item: { // { BillNo: string; PackageID: number; ExpressID: string }
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      loading: false,
      dataList: [],
    };
  },
  computed: {
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
  },
  methods: {
    close() {
      this.$emit('update:visible', false);
    },
    async getExpressDetail() {
      this.dataList = [];

      if (!this.item) return;

      this.loading = true;
      const res = await this.api.getPackageProgress(this.item.PackageID, this.item.ExpressID).catch(() => null);
      this.loading = false;

      if (res && res.data.Status === 1000) {
        this.dataList = res.data.Data;
      }
    },
    onOpen() {
      this.getExpressDetail();
    },
  },
};
</script>
<style lang='scss'>
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
      background: url(../../../../../assets/images/express.png) no-repeat center center/100% 100%;
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
      padding-top: 3px;
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
