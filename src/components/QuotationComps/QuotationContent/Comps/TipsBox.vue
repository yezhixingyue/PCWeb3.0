<template>
  <div class="mp-quotation-content-tips-box-comp-wrap" @click.stop="">
    <ul v-show="localTipsArr">
      <li class="icon"><i class="el-icon-warning"></i> 温馨提示：</li>
      <li v-for="it in localTipsArr" :key="it">{{it}}</li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('Quotation', ['RiskWarningTipsObj']),
    localTipsArr() {
      if (!this.RiskWarningTipsObj.tips) return '';
      return this.RiskWarningTipsObj.tips.split('#');
    },
  },
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
      padding-left: 96px;
      font-size: 12px;
      color: #F4A307;
      &.icon {
        position: absolute;
        left: -88px;
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
