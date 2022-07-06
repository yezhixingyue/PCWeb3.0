<template>
  <footer class="mp-pc-invoice-make-up-list-page-footer-comp-wrap">
    <Count
      :watchPage='condition4InvoiceMakeupList.Page'
      :handlePageChange='handlePageChange'
      :count='InvoiceMakeupOrderNumber'
      :pageSize='condition4InvoiceMakeupList.PageSize'
      rightContent='个订单'
      :class="{min:showMinWidth}"
      v-show="InvoiceMakeupOrderNumber > 0"
      >
      <el-checkbox
        v-model="localCheckCurPage"
        :indeterminate="curPageIndeterminate"
        :disabled="disabled"
        :class="{one: onlyOnePage}"
        class="check-cur-page"
        title="选中本页">{{onlyOnePage ? '全部' : '本页'}}</el-checkbox>
      <el-checkbox
        v-model="localCheckAll"
        :indeterminate="indeterminate"
        :disabled="disabled"
        v-show="!onlyOnePage"
        class="check-all"
        title="跨分页选中全部">全部</el-checkbox>
      <template #right>
        <el-button type="primary" class="invoice-makeup-btn"  @click="onMergeMakeupClick" :disabled="!canCombineInvoive">合并开票</el-button>
      </template>
    </Count>
  </footer>
</template>

<script>
import { mapState } from 'vuex';
import Count from '../../common/Count.vue';
// import ShowProductBtn from '../../QuotationComps/SMComps/ShowProductBtn.vue';

export default {
  props: {
    isSelectAll: {
      type: Boolean,
      default: false,
    },
    IsAllowInvoice: {
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
    curPageList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    Count,
    // ShowProductBtn,
  },
  computed: {
    ...mapState('invoice', ['InvoiceMakeupOrderNumber', 'condition4InvoiceMakeupList', 'InvoiceMakeupOrderList']),
    ...mapState('common', ['customerInfo']),
    localCheckCurPage: {
      get() {
        if (this.InvoiceMakeupOrderNumber === 0 || this.disabled) {
          return false;
        }
        if (this.localCheckAll) {
          return true;
        }
        const ids = this.InvoiceMakeupOrderList.map(it => it.OrderID);
        if (this.isSelectAll) {
          // 看invalidList
          return !ids.some(id => this.invalidList.includes(id));
        }
        // 看validList
        return !ids.some(id => !this.validList.includes(id));
      },
      set(val) {
        this.$emit('selectByPage', val);
      },
    },
    curPageIndeterminate() {
      if (this.localCheckCurPage || this.disabled) return false;
      const ids = this.InvoiceMakeupOrderList.map(it => it.OrderID);
      if (this.isSelectAll) {
        return ids.some(id => !this.invalidList.includes(id));
      }
      return ids.some(id => this.validList.includes(id));
    },
    localCheckAll: {
      get() {
        if (this.InvoiceMakeupOrderNumber === 0 || this.disabled) {
          return false;
        }
        return (this.isSelectAll && this.invalidList.length === 0) || (this.validList.length === this.InvoiceMakeupOrderNumber && !this.isSelectAll);
      },
      set(val) {
        if (this.isSelectAll === val) {
          this.$emit('update:isSelectAll', null);
          this.$nextTick(() => {
            this.$emit('update:isSelectAll', val);
          });
          return;
        }
        this.$emit('update:isSelectAll', val);
      },
    },
    indeterminate() {
      if (!this.localCheckAll && this.InvoiceMakeupOrderNumber > 0 && !this.disabled) {
        return (this.isSelectAll && this.invalidList.length > 0 && this.invalidList.length < this.InvoiceMakeupOrderNumber)
         || (this.validList.length < this.InvoiceMakeupOrderNumber && this.validList.length > 0 && !this.isSelectAll);
      }
      return false;
    },
    disabled() {
      return !this.IsAllowInvoice || this.InvoiceMakeupOrderNumber === 0 || this.InvoiceMakeupOrderList.length === 0;
    },
    showMinWidth() {
      const allPageCount = Math.ceil(this.InvoiceMakeupOrderNumber / this.condition4InvoiceMakeupList.PageSize);
      if (allPageCount >= 10000) return true;
      return this.condition4InvoiceMakeupList.Page > 100 && this.condition4InvoiceMakeupList.Page < allPageCount - 2;
    },
    onlyOnePage() {
      const allPageCount = Math.ceil(this.InvoiceMakeupOrderNumber / this.condition4InvoiceMakeupList.PageSize);
      return allPageCount === 1;
    },
    canCombineInvoive() {
      if (!this.customerInfo || !this.customerInfo.PermissionInfo?.ApplyInvoice) { // 无权限
        return false;
      }
      if (this.disabled) return false;
      if (!this.isSelectAll && this.validList.length === 0) {
        return false;
      }
      if (this.isSelectAll && this.invalidList.length === this.InvoiceMakeupOrderNumber) {
        return false;
      }
      return true;
    },
  },
  data() {
    return {
      isShowSuccessMsg: false,
      isShowWarningMsg: false,
    };
  },
  methods: {
    handlePageChange(page) {
      this.$store.dispatch('invoice/getInvoiceMakeupOrderList', [page, true]);
    },
    onMergeMakeupClick() {
      const num = 10000;
      if (this.InvoiceMakeupOrderNumber > num) {
        this.messageBox.failSingleError({
          title: '开票失败',
          msg: `当前选中订单数量已超出最大数量${num},请缩小开票范围`,
        });
        return;
      }
      this.$emit('margeMakeup');
    },
    handleClick(bool) {
      if (this.disabled) return;
      if (bool && this.isShowSuccessMsg) return;
      if (!bool && this.isShowWarningMsg) return;
      if (this.localCheckAll === bool) {
        this.localCheckAll = null;
        this.$nextTick(() => {
          this.localCheckAll = bool;
        });
      } else {
        this.localCheckAll = bool;
      }
      this.isShowSuccessMsg = bool;
      this.isShowWarningMsg = !bool;
      this.$message({
        message: bool ? '已全部选中' : '已取消全部选中',
        type: bool ? 'success' : 'warning',
        onClose: () => {
          if (bool) {
            this.isShowSuccessMsg = false;
          } else {
            this.isShowWarningMsg = false;
          }
        },
        duration: 1000,
      });
    },
  },
};
</script>
<style lang='scss'>
.mp-pc-invoice-make-up-list-page-footer-comp-wrap {
  min-height: 55px;
  margin-top: 30px;
  margin-bottom: 20px;
  .count-wrap {
    padding-left: 0;
    line-height: 44px;
    text-align: left;
    padding-right: 0;
    height: unset;
    height: auto;
    .el-checkbox {
      position: absolute;
      left: 0px;
      line-height: 44px;
      .el-checkbox__label {
        font-size: 13px;
        color: #428dfa;
        padding-left: 5px;
      }
      &.check-all {
        left: 60px;
      }
      &.one {
        left: 16px;
      }
    }
    .mp-pagination-wrap {
      vertical-align: top;
      margin-left: -4px;
      padding-left: 125px;
      min-width: 535px;
      text-align: right;
      .el-pagination {
        padding-left: 0;
        // padding-right: 0;
        text-align: center;
      }
    }
    .count {
      position: relative;
      display: inline-block;
      right: 0;
      margin: 0 10px;
      min-width: 154px;
      // top: 1px;
      margin-right: 20px;
    }
    .invoice-makeup-btn {
      width: 120px;
    }
    .btns {
      line-height: 28px;
      width: 150px;
      display: inline-block;
      font-size: 12px;
      text-align: left;
      > span {
        & + span {
          margin-left: 12px;
        }
      }
    }
    &.min {
      .mp-pagination-wrap {
        min-width: 556px;
      }
      .invoice-makeup-btn {
        width: 96px;
      }
    }
  }
}
.in-tip {
  padding: 3.5px 8px 5px;
  letter-spacing: 0.5px;
  color: #f4a307;
  // border-color: #585858 !important;
}
</style>
