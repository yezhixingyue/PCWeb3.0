<template>
  <div class="mp-quotation-content-tips-box-comp-wrap">
    <ul>
      <li class="icon"><i class="el-icon-warning"></i> 注：</li>
      <li>产品数量大于30时，颜色会出现偏差</li>
    </ul>
  </div>
</template>

<script>
export default {
};
</script>
<style lang='scss'>
.mp-quotation-content-tips-box-comp-wrap {
  text-align: left;
  width: 860px;
  > ul {
    background-color: rgba($color: #F4A307, $alpha: 0.04);
    border-radius: 5px;
    position: relative;
    padding-bottom: 3px;
    line-height: 24px;
    > li {
      padding-left: 60px;
      font-size: 12px;
      color: #F4A307;
      &.icon {
        position: absolute;
        left: -52px;
        padding-top: 0px;
        i {
          font-size: 15px;
          margin-right: 4px;
          position: relative;
          top: 1px;
        }
      }
    }
  }
}
</style>
