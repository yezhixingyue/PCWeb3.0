<template>
  <div class="mp-quotation-content-tips-box-comp-wrap mp-scroll-wrap" @click.stop="">
    <ul v-show="localTipsArr" class="tips">
      <li class="icon"><i class="el-icon-warning"></i> 温馨提示：</li>
      <li class="tips-content" v-for="it in localTipsArr" :key="it">{{it}}</li>
    </ul>
    <ul v-if="ProductQuotationResult && ProductQuotationResult.PriceContent && !onlyTips" class="detail">
      <li ref="detailBox">
        <span class="info">{{ProductQuotationResult.PriceContent.trim()}}</span>
        <el-popover
          placement="top"
          popper-class='mp-place-order-copy-poper-box'
          trigger="manual"
          v-if="showCopyBtn && ProductQuotationResult.Content"
          v-model="visible">
          <span>{{copySuccess ? '复制成功' : '复制失败，请手动复制'}}</span>
          <span class="blue-span" slot="reference" @click="handleCopyClick">
            <img src="@/assets/images/copy.png" alt="">
            提取批量下单信息
          </span>
        </el-popover>
        <span class="is-pink" v-if="showCopyBtn && !ProductQuotationResult.Content">
          <!-- <i class="el-icon-warning"></i> -->
          [ 该产品不支持批量下单 ]</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    onlyTips: {
      type: Boolean,
      default: false,
    },
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
  data() {
    return {
      copySuccess: true,
      visible: false,
    };
  },
  methods: {
    handleCopyClick() { // 复制
      const content = this.ProductQuotationResult.Content;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(content).then(() => {
          this.copySuccess = true;
        }).catch(() => {
          this.copySuccess = false;
        }).finally(() => {
          this.visible = true;
          setTimeout(() => {
            this.visible = false;
          }, 1000);
        });
      } else {
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
      span.blue-span {
        white-space: nowrap;
        img {
          vertical-align: -3px;
          margin-right: 2px;
        }
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
.mp-place-order-copy-poper-box {
  min-width: 70px;
  padding: 6px 12px;
  text-align: center;
  font-size: 12px;
}
</style>
