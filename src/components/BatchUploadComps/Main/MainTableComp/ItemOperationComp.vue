<template>
  <ul v-if="itemData" class="mp-c-batch-upload-page-main-table-operation-item-comp-wrap">
    <li @click="onUploadClick">
      <span class="label blue-span" :class="{disabled: itemData.orderStatus==='success'}">下单</span>
    </li>
    <li @click="onDetailClick">
      <span class="label blue-span">详情</span>
    </li>
    <li @click="onRemoveClick">
      <span class="label del" :class="{disabled: itemData.uploadStatus === 'uploading'}">删除</span>
    </li>
  </ul>
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
      if (this.isError && this.isHovering && this.itemData.result.HavePrice) {
        if (this.itemData.error === '文件找不到') {
          return '文件找不到，请删除该行并重新选择文件上传';
        }
        return `${this.itemData.error ? `错误原因：${this.itemData.error}；\r\n` : ''}点击重新下单`;
      }
      return '';
    },
  },
  data() {
    return {
      isHovering: false,
    };
  },
  methods: {
    onUploadClick() {
      if (this.itemData.orderStatus === 'success') return;
      this.$emit('upload', this.itemData);
    },
    onDetailClick() {
      this.$emit('detail', this.itemData);
    },
    onRemoveClick() {
      if (this.itemData.uploadStatus === 'uploading') return;
      this.$emit('remove', this.itemData);
    },
  },
};
</script>
<style lang='scss'>
.mp-c-batch-upload-page-main-table-operation-item-comp-wrap {
  text-align: center;
  > li {
    display: inline-block;
    margin: 0 5px;
    line-height: 18px;
    img {
      margin-right: 6px;
    }
    span.label {
      display: inline-block;
      min-width: 3em;
      transition: color 0.05s;
      user-select: none;
      cursor: pointer;
      &.del {
        color: #ff3769;
        &:hover {
          color: #ff90ac;
          &:active {
            color: #e42a2a;
          }
        }
      }
      &.disabled {
        color: #cbcbcb !important;
        cursor: not-allowed;
        pointer-events: none;
      }
    }
  }
}
</style>
