<template>
  <!-- <div > -->
    <el-popover
      placement="bottom"
      title="报价失败列表"
      :width="width"
      :offset="offset"
      popper-class="mp-c-batch-upload-page-footer-failed-list-popper-comp-wrap"
      :appendToBody="false"
      trigger="click"
    >
      <ul class="content mp-scroll-wrap">
        <li v-for="(it, i) in failedList" :key="it.error + i">
          <p>
            文件：<span class="">{{ it.file.name }}</span>
          </p>
          <p class="is-pink">失败原因：{{ it.error }}</p>
        </li>
      </ul>
      <div class="mp-c-batch-upload-page-failed-list-comp-wrap" slot="reference">
        <span
          v-show="failedList.length > 0"
          class="is-font-size-12 is-gray"
          >有
          <i class="is-pink is-bold is-font-size-13 is-font-13">{{ failedList.length }}</i>
          个文件报价失败</span
        >
        <span
          v-show="failedList.length > 0"
          class="is-font-size-12 is-pink error span-title-pink red-span"
          >查看错误信息</span
        >
      </div>
    </el-popover>
  <!-- </div> -->
</template>

<script>
export default {
  props: {
    failedList: {
      type: Array,
      default: () => [],
    },
    width: {
      type: String,
      default: '650',
    },
    offset: {
      type: Number,
      default: 88,
    },
  },
};
</script>
<style lang='scss'>
.mp-c-batch-upload-page-failed-list-comp-wrap {
  min-width: 215px;
  position: relative;
  line-height: 26px;
  .span-title-pink {
    display: inline-block;
    margin-left: 5px;
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
    white-space: normal;
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
