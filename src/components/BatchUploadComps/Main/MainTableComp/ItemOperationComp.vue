<template>
  <ul v-if="itemData" class="mp-c-batch-upload-page-main-table-operation-item-comp-wrap">
    <li class="f" :class="{c: itemData.orderStatus==='success'}">
      <el-progress :percentage="itemData.percentage" :text-inside="true" v-if="itemData.uploadStatus === 'uploading'" :stroke-width='4'></el-progress>
      <div v-else class="i" @mouseenter="onmouseenter" @mouseleave="onmouseleave">
        <span class="label blue-span" :class="{
          'is-pink': isError,
          'is-success': itemData.orderStatus==='success',
        }" @click="onUploadClick" :title="tipsTitle">{{label}}</span>
      </div>
    </li>
    <li @click="onDetailClick">
      <span class="label blue-span">详情</span>
    </li>
    <li @click="onRemoveClick" :class="{disabled: itemData.uploadStatus === 'uploading'}">
      <span class="label del">删除</span>
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
    label() {
      // if (this.isError && this.isHovering && this.itemData.result.HavePrice && this.itemData.result.HaveFreight === true) return '重新下单';
      if (this.itemData && this.itemData.result?.HavePrice === false) return '无报价';
      if (this.itemData && this.itemData.result?.HaveFreight === false) return '运费计算失败';
      if (this.itemData && this.itemData.isParsing === true) return this.itemData.parseStatus === 'parsing' ? '正在读取文件...' : '文件读取完成';
      let text = '';
      if (this.itemData && this.itemData.uploadStatus && this.itemData.orderStatus) {
        switch (this.itemData.uploadStatus) {
          case 'ready':
            text = '下单';
            break;
          case 'fail':
            text = '上传失败';
            break;
          case 'success':
            text = '上传成功';
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
    isError() {
      if (!this.itemData) return false;
      return this.itemData.uploadStatus === 'fail' || this.itemData.orderStatus === 'fail'
       || !this.itemData.result.HavePrice || !this.itemData.result.HavePrice;
    },
    tipsTitle() {
      if (this.isError && this.isHovering && this.itemData.result.HavePrice && this.itemData.result.HaveFreight === true) {
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
      if (this.label === '下单成功') return;
      this.$emit('upload', this.itemData);
    },
    onDetailClick() {
      this.$emit('detail', this.itemData);
    },
    onRemoveClick() {
      if (this.itemData.uploadStatus === 'uploading') return;
      this.$emit('remove', this.itemData);
    },
    onmouseenter() {
      if (!this.isError) return;
      this.isHovering = true;
    },
    onmouseleave() {
      this.isHovering = false;
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
      text-align: right;
      // color: #989898;
      transition: color 0.05s;
      user-select: none;
      cursor: pointer;
      &.del {
        color: #ff3769;
        // text-align: center;
        width: 3em;
        margin-right: 1em;
        &:hover {
          color: #ff90ac;
          &:active {
            color: #e42a2a;
          }
        }
      }
    }
    &.f {
      width: 128px;
      .el-progress {
        margin-right: 13px;
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
      .i {
        padding-right: 4px;
        text-align: right;
      }
    }
    // &:hover {
    //   span.label {
    //     color: #585858;
    //   }
    // }
    &.disabled {
      span.label {
        color: #cbcbcb !important;
      }
      cursor: not-allowed;
    }
    &.c {
      // span.label {
      //   color: #a2a2a2 !important;
      // }
      cursor: unset;
    }
  }
}
</style>
