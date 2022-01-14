<template>
  <!-- <div > -->
    <el-popover
      placement="bottom"
      title="报价失败列表"
      width="528"
      :offset="-156"
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
          >共有
          <i class="is-pink is-bold is-font-size-13">{{ failedList.length }}</i>
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
  },
};
</script>
<style lang='scss'>
.mp-c-batch-upload-page-failed-list-comp-wrap {
  min-width: 215px;
  position: relative;
  .span-title-pink {
    display: inline-block;
  }
}
</style>
