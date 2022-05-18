<template>
  <div class="mp-c-batch-upload-page-footer-comp-wrap">
    <div class="l" >
      <el-checkbox v-model="checked" :disabled='checkDisabled' :indeterminate="isIndeterminate">全选</el-checkbox>
    </div>
    <div class="r">
      <span v-show="count > 0" class="count">共 <i class="is-pink">{{count}}</i> 个订单</span>
      <template v-if="count > 0 && false">
        <!-- <label>产品费用：</label>
        <span class="ml-35">￥{{productCost || productCost === 0 ? productCost : '--'}}元</span>
        <label>运费：</label>
        <span class="ml-35">￥{{expressCost || expressCost === 0 ? expressCost : '--'}}元</span> -->
        <label>共计：</label>
        <span class="ml-50 is-bold is-pink">￥{{allCost || allCost === 0 ? allCost : '--'}}元</span>
      </template>
      <span class="blue-span" @click="onClearClick" >清除已上传订单</span>
      <span class="span-title-pink" @click="onRemoveClick" :class="{disabled: multipleSelection.length === 0}">删除选中订单</span>
      <el-button type="primary" @click="onUploadClick" :disabled='disabled'>上传选中订单</el-button>
    </div>
  </div>
</template>

<script>
import { projectType } from '@/assets/js/setup';

export default {
  props: {
    productCost: {
      default: '',
    },
    expressCost: {
      default: '',
    },
    allCost: {
      default: '',
    },
    isCheckedAll: { // 是否全选
      type: Boolean,
      default: false,
    },
    UseSameAddress: {
      type: Boolean,
      default: false,
    },
    canSelectList: { // 解析成功并可选择的列表
      type: Array,
      default: () => [],
    },
    multipleSelection: { // 当前选中列表
      type: Array,
      default: () => [],
    },
    address: {
      type: Object,
      default: null,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    checked: {
      get() {
        return this.canSelectList.length > 0 && this.multipleSelection.length === this.canSelectList.length;
      },
      set(bool) {
        this.$emit('checkAll', bool);
      },
    },
    checkDisabled() {
      return this.canSelectList.length === 0;
    },
    isIndeterminate() {
      return this.multipleSelection.length > 0 && this.multipleSelection.length < this.canSelectList.length;
    },
    disabled() {
      return this.multipleSelection.length === 0;
    },
    expressDisabled() {
      return this.UseSameAddress && (!this.address
       || (!this.address.Address.Express.First && this.address.Address.Express.First !== 0)
       || (!this.address.Address.Express.Second && this.address.Address.Express.Second !== 0));
    },
  },
  methods: {
    onUploadClick() {
      if (this.expressDisabled) {
        if (projectType === 'pc') {
          this.messageBox.failSingleError({ title: '上传失败', msg: '未设置配送方式' });
        } else {
          this.messageBox.failSingle('未设置配送方式');
        }
        return;
      }
      this.$emit('uploadSelected');
    },
    onRemoveClick() {
      this.$emit('removeSelected');
    },
    onClearClick() {
      this.$emit('clearSuccess');
    },
  },
};
</script>
<style lang='scss'>
.mp-c-batch-upload-page-footer-comp-wrap {
  padding: 0px;
  padding-left: 21px;
  > div {
    display: inline-block;
    &.l {
      width: 305px;
      white-space: nowrap;
      overflow: hidden;
      vertical-align: top;
      height: 24px;
      padding: 8px 0;
      line-height: 24px;
      .el-checkbox {
        margin-right: 15px;
      }
      > span > .is-pink.error {
        cursor: pointer;
        transition: 0.05s;
        user-select: none;
        margin-left: 10px;
        height: 24px;
        display: inline-block;
        &:hover {
          // color: #f74974 !important;
          // text-decoration: underline;
          opacity: 0.8;
        }
        &:active {
          opacity: 1;
          color: #f71515 !important;
        }
      }
    }
    &.r {
      width: calc(100% - 305px);
      text-align: right;
      font-size: 13px;
      > button {
        font-size: 14px;
        width: 140px;
        height: 40px;
        padding: 0;
        border-radius: 5px;
        margin-left: 25px;
      }
      > span {
        &.ml-35 {
          margin-right: 25px;
          font-size: 13px;
        }
        &.ml-50 {
          margin-right: 35px;
          font-size: 14px;
        }
        &.disabled {
          color: #cbcbcb !important;
        }
        &.blue-span {
          margin-right: 16px;
        }
        &.count {
          color: #585858;
          margin-right: 35px;
          i {
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
