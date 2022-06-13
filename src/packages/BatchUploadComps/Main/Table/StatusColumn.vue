<template>
  <div v-if="itemData" class="mp-c-batch-upload-page-main-table-status-display-column-comp-wrap">
    <el-progress :percentage="localPercentage" :text-inside="true" v-if="itemData.uploadStatus === 'uploading'" :stroke-width='4'></el-progress>
    <div v-else class="i">
      <span class="label" :class="{
        'is-pink': isError,
        'is-success': itemData.orderStatus==='success',
      }" :title="tipsTitle">{{statusContent}}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    itemData: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    isError() {
      if (!this.itemData) return false;
      return this.itemData.uploadStatus === 'fail' || this.itemData.orderStatus === 'fail' || !this.itemData.result.HavePrice;
    },
    tipsTitle() {
      if (this.isError && this.itemData.result.HavePrice) {
        if (this.itemData.error === '文件找不到') {
          return '文件找不到，请删除该行并重新选择文件上传';
        }
        return this.itemData.error || '';
      }
      return '';
    },
    statusContent() {
      if (this.itemData && this.itemData.result?.HavePrice === false) return '无报价';
      if (this.itemData && this.itemData.isParsing === true) return this.itemData.parseStatus === 'parsing' ? '文件读取中...' : '读取完成';
      let text = '';
      if (this.itemData && this.itemData.uploadStatus && this.itemData.orderStatus) {
        switch (this.itemData.uploadStatus) {
          case 'ready':
            text = '';
            break;
          case 'fail':
            text = '文件上传失败';
            if (this.itemData.error === '文件找不到') text = this.itemData.error;
            break;
          case 'success':
            text = '文件上传成功';
            break;
          default:
            break;
        }
        switch (this.itemData.orderStatus) {
          case 'submitting':
            text = '正在提交';
            break;
          case 'fail':
            text = '下单失败';
            break;
          case 'success':
            text = '下单成功';
            break;
          default:
            break;
        }
      }
      return text;
    },
    localPercentage() {
      if (this.itemData) {
        if (this.itemData.percentage && typeof this.itemData.percentage === 'number') {
          return +this.itemData.percentage.toFixed(1);
        }
        return this.itemData.percentage;
      }
      return '';
    },
  },
};
</script>
<style lang='scss'>
.mp-c-batch-upload-page-main-table-status-display-column-comp-wrap {
  .el-progress {
    margin: 0 6px;
    padding: 3px 0;
    .el-progress-bar__outer {
      overflow: visible;
      .el-progress-bar__innerText {
        margin-top: -14px;
        padding: 3px 5px;
        border-radius: 8px;
        font-size: 12px;
        background-color: #428dfa;
        transform: scale(0.9);
      }
    }
  }
  > .i > .label {
    color: #989898;
  }
}
</style>
