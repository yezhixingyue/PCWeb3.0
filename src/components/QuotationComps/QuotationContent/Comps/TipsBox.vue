<template>
  <div class="mp-quotation-content-tips-box-comp-wrap mp-scroll-wrap" @click.stop="">
    <ul v-show="localTipsArr" class="tips">
      <li class="icon"><i class="el-icon-warning"></i> 温馨提示：</li>
      <li class="tips-content" v-for="it in localTipsArr" :key="it">{{it}}</li>
    </ul>
    <ul v-if="ProductQuotationResult && ProductQuotationResult.PriceContent && !onlyTips" class="detail">
      <li ref="detailBox">
        <span class="info">{{ProductQuotationResult.PriceContent.trim()}}</span>
        <CopyComp v-if="showCopyBtn && ProductQuotationResult.Content" :content="ProductQuotationResult.Content.trim()" />
        <span class="is-pink" v-if="showCopyBtn && !ProductQuotationResult.Content">
          <!-- <i class="el-icon-warning"></i> -->
          [ 该产品不支持批量下单 ]</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import CopyComp from '../../../../packages/CopyComp';

export default {
  props: {
    onlyTips: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    CopyComp,
  },
  computed: {
    ...mapState('Quotation', ['RiskWarningTipsObj', 'ProductQuotationResult']),
    ...mapState('common', ['customerInfo']),
    localTipsArr() {
      return this.RiskWarningTipsObj.tipsList && this.RiskWarningTipsObj.tipsList.length > 0 ? this.RiskWarningTipsObj.tipsList : null;
    },
    showCopyBtn() {
      if (this.customerInfo && this.customerInfo.PermissionInfo && this.customerInfo.PermissionInfo.BatchUpload) {
        return true;
      }
      return false;
    },
  },
};
</script>
<style lang='scss'>
.mp-quotation-content-tips-box-comp-wrap {
  text-align: left;
  width: 850px;
  > ul.tips {
    // background-color: rgba($color: #ff3769, $alpha: 0.04);
    border-radius: 5px;
    position: relative;
    padding-bottom: 3px;
    line-height: 16px;
    padding: 3px 0 5px;
    margin-bottom: 10px;
    > li {
      font-size: 12px;
      // color: #F4A307;
      color: #ff3769;
      padding: 2px 0 2px 96px;
      &.icon {
        position: absolute;
        left: -88px;
        padding-top: 2px;
        i {
          font-size: 15px;
          margin-right: 4px;
          position: relative;
          top: 1px;
        }
      }
      &.tips-content {
        padding-right: 10px;
      }
    }
  }
  > ul.detail {
    color: #989898;
    background-color: #fbfbfb;
    font-size: 12px;
    line-height: 20px;
    border-radius: 5px;
    padding: 10px;
    width: 830px;
    > li {
      > span.info {
        margin-right: 25px;
      }
      span.is-pink {
        font-size: 12px;
        white-space: nowrap;
        i {
          font-size: 14px;
          margin-right: 4px;
          position: relative;
          top: 0.5px;
        }
      }
    }
  }
}
// .mp-place-order-copy-poper-box {
//   min-width: 70px;
//   padding: 6px 12px;
//   text-align: center;
//   font-size: 12px;
// }
</style>
