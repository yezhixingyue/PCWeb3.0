<template>
  <div class="mp-quotation-content-tips-box-comp-wrap mp-scroll-wrap" @click.stop="">
    <ul v-show="localTipsArr" class="tips">
      <li class="icon"><i class="el-icon-warning"></i> 温馨提示：</li>
      <li class="tips-content" v-for="it in localTipsArr" :key="it">{{it}}</li>
    </ul>
    <ul v-if="ProductQuotationResult && ProductQuotationResult.Content && !onlyTips" class="detail">
      <!-- <li class="icon"><i class="el-icon-warning"></i> 温馨提示：</li>
      <li v-for="it in localTipsArr" :key="it">{{it}}</li> -->
      <li ref="detailBox">
        <span class="info" ref="oDetailContent">{{ProductQuotationResult.Content}}</span>
        <el-popover
          placement="top"
          popper-class='mp-place-order-copy-poper-box'
          trigger="manual"
          v-model="visible">
          <span>{{copySuccess ? '复制成功' : '复制失败，请手动复制'}}</span>
          <span class="blue-span" slot="reference" @click="handleCopyClick">复制订单信息</span>
        </el-popover>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    onlyTips: {
      default: false,
      type: Boolean,
    },
  },
  computed: {
    ...mapState('Quotation', ['RiskWarningTipsObj', 'ProductQuotationResult']),
    localTipsArr() {
      return this.RiskWarningTipsObj.tipsList && this.RiskWarningTipsObj.tipsList.length > 0 ? this.RiskWarningTipsObj.tipsList : null;
    },
  },
  data() {
    return {
      copySuccess: true,
      visible: false,
    };
  },
  methods: {
    handleCopyClick() {
      if (this.$refs.oDetailContent) {
        const content = this.$refs.oDetailContent.innerText;
        const textarea = document.createElement('textarea');
        textarea.style.position = 'fixed';
        textarea.style.top = 0;
        textarea.style.left = 0;
        textarea.style.border = 'none';
        textarea.style.outline = 'none';
        textarea.style.resize = 'none';
        textarea.style.background = 'transparent';
        textarea.style.color = 'transparent';

        textarea.value = content;
        document.body.appendChild(textarea);
        textarea.select();
        try {
          const msg = document.execCommand('copy') ? 'success' : 'fail';
          if (msg === 'success') this.copySuccess = true;
          else this.copySuccess = false;
        } catch (err) {
          this.copySuccess = false;
        }
        this.visible = true;
        document.body.removeChild(textarea);
        setTimeout(() => {
          this.visible = false;
        }, 1000);
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-quotation-content-tips-box-comp-wrap {
  text-align: left;
  width: 850px;
  > ul.tips {
    background-color: rgba($color: #F4A307, $alpha: 0.04);
    border-radius: 5px;
    position: relative;
    padding-bottom: 3px;
    line-height: 16px;
    padding: 3px 0 5px;
    margin-bottom: 10px;
    > li {
      // padding-left: 96px;
      font-size: 12px;
      color: #F4A307;
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
    }
  }
}
.mp-place-order-copy-poper-box {
  min-width: 70px;
  padding: 6px 12px;
  text-align: center;
  font-size: 12px;
}
</style>
