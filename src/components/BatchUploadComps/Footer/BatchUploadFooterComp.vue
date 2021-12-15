<template>
  <div class="mp-c-batch-upload-page-footer-comp-wrap">
    <div class="l" >
      <el-checkbox v-model="checked" :disabled='checkDisabled' :indeterminate="isIndeterminate">全选</el-checkbox>
      <el-popover
        placement="top-start"
        title="报价失败列表"
        width="528"
        popper-class='mp-c-batch-upload-page-footer-failed-list-popper-comp-wrap'
        :appendToBody='false'
        trigger="click">
        <ul class="content mp-scroll-wrap">
          <li v-for="(it,i) in failedList" :key="it.error + i">
            <p>文件：<span class="">{{it.file.name}}</span></p>
            <p class="is-pink">失败原因：{{it.error}}</p>
          </li>
        </ul>
        <span v-show="failedList.length > 0" slot="reference" class="is-font-size-12 is-gray" title="点击查看列表"
          >共有 <i class="is-pink is-bold is-font-size-13">{{failedList.length}}</i> 个文件报价失败</span>
      </el-popover>
    </div>
    <div class="r">
      <template v-if="showPrice">
        <label>产品费用：</label>
        <span class="ml-35">￥{{productCost || productCost === 0 ? productCost : '--'}}元</span>
        <label>运费：</label>
        <span class="ml-35">￥{{expressCost || expressCost === 0 ? expressCost : '--'}}元</span>
        <label>共计：</label>
        <span class="ml-50 is-bold is-pink">￥{{allCost || allCost === 0 ? allCost : '--'}}元</span>
      </template>
      <span class="blue-span" @click="onClearClick" >清除已上传订单</span>
      <span class="span-title-pink" @click="onRemoveClick" :class="{disabled: multipleSelection.length === 0}">删除选中订单</span>
      <el-button type="primary" @click="onUploadClick" :disabled='multipleSelection.length === 0'>上传选中订单</el-button>
    </div>
  </div>
</template>

<script>
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
    showPrice: { // 是否展示价格
      type: Boolean,
      default: false,
    },
    failedList: { // 失败列表
      type: Array,
      default: () => [],
    },
    isCheckedAll: { // 是否全选
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
  },
  methods: {
    onUploadClick() {
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
      width: 220px;
      .el-checkbox {
        margin-right: 20px;
      }
      > span > .is-gray {
        cursor: pointer;
        transition: color 0.05s;
        user-select: none;
        &:hover {
          color: #585858 !important;
        }
        &:active {
          color: #0a094d !important;
        }
      }
    }
    &.r {
      width: calc(100% - 220px);
      text-align: right;
      font-size: 13px;
      > button {
        font-size: 14px;
        width: 140px;
        height: 40px;
        padding: 0;
        border-radius: 5px;
        margin-left: 27px;
      }
      > span {
        &.ml-35 {
          margin-right: 35px;
          font-size: 14px;
        }
        &.ml-50 {
          margin-right: 50px;
          font-size: 14px;
        }
        &.disabled {
          color: #cbcbcb !important;
        }
        &.blue-span {
          margin-right: 20px;
        }
      }
    }
  }
}
.mp-c-batch-upload-page-footer-failed-list-popper-comp-wrap {
  padding-right: 6px;
  .el-popover__title {
    font-size: 14px;
    color: #585858;
    font-weight: 600;
    &::before {
      content: '';
      display: inline-block;
      width: 3px;
      height: 16px;
      background-color: #26bcf9;
      vertical-align: -2px;
      margin-right: 6px;
    }
  }
  ul.content {
    font-size: 12px;
    max-height: 400px;
    overflow: auto;
    padding-right: 6px;
    > li {
      // border-bottom: 1px solid #eee;
      margin-bottom: 10px;
      // padding-bottom: 2px;
      p {
        color: #585858;
        padding-bottom: 2px;
      }
    }
  }
}
</style>
