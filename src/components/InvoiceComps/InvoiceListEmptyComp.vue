<template>
  <div class="mp-pc-invoice-list-is-empty-comp-wrap" :class="{loading: loading}">
    <img src="../../assets/images/order-empty.png" alt="">
    <p>暂无{{title}}，快去下单吧</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '发票申请信息',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style lang='scss'>
.mp-pc-invoice-list-is-empty-comp-wrap {
  text-align: center;
  width: 100%;
  padding: 80px 0;
  > p {
    margin-top: 16px;
    color: #989898;
  }
  &.loading {
    opacity: 0;
  }
}
</style>
