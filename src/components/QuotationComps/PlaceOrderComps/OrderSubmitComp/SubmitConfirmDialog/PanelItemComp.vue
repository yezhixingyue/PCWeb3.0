<template>
  <div class="mp-place-order-panel-comp-order-submit-comfirm-dialog-panel-item-comp-wrap">
    <p class="title">
      <slot name="img"></slot>
      <span>{{title}}</span>
    </p>
    <div class="panel-content mp-scroll-wrap">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '产品信息',
    },
  },
};
</script>
<style lang='scss'>
.mp-place-order-panel-comp-order-submit-comfirm-dialog-panel-item-comp-wrap {
  width: 100%;
  height: 100%;
  box-shadow: 0px 3px 10px 0px rgba(88, 88, 88, 0.15);
  border-radius: 5px;
  overflow: hidden;
  > .title {
    height: 40px;
    line-height: 26px;
    padding: 7px 10px;
    position: relative;
    border-bottom: 1px dashed #eee;
    box-sizing: border-box;
    border-radius: 5px;
    &::before {
      content: '';
      position: absolute;
      height: 39px;
      width: 1px;
      background-color: #428dfa;
      top: 1px;
      left: 0;
    }
    > span {
      vertical-align: top;
      color: #333;
      font-weight: 700;
      font-size: 14px;
      margin-left: 7px;
    }
  }
  > .panel-content {
    overflow-y: auto;
    height: calc(100% - 50px);
    padding: 0 18px;
  }
}
</style>
