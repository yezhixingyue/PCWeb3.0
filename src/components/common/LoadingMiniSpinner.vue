<template>
  <section class="spinner-loading-mini-wrap">
    <div class="el-loading-spinner">
      <svg viewBox="25 25 50 50" class="circular">
        <circle cx="50" cy="50" r="20" fill="none" class="path" />
      </svg>
      <span>{{title}}</span>
    </div>
  </section>
</template>

<script>
// import { Loading } from 'element-ui';

export default {
  props: {
    title: {
      type: String,
      default: '正在加载中，请稍候.....',
    },
  },
};
</script>

<style lang='scss'>
// @import "@/assets/css/common/var.scss";
section.spinner-loading-mini-wrap {
  display: inline-block;
  height: 30px;
//   position: relative;
  .el-loading-spinner {
    width: auto;
    height: 100%;
    margin-top: 0;
    top: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: 10px;
    // color: $--color-text-regular;
    > .circular {
      height: 21px;
      width: 21px;
      > .path {
        stroke-width: 4px;
        stroke: #428dfa;
      }
    }
    > span {
        white-space: nowrap;
        height: 30px;
        display: inline-block;
        margin-left: 10px;
        line-height: 30px;
        // letter-spacing: 1px;
         vertical-align: middle;
    }
  }
}
</style>
