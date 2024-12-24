<template>
  <el-dialog
    :visible="visible"
    top='16vh'
    :title="title"
    width="740px"
    destroy-on-close
    :before-close='close'
    append-to-body
    :close-on-press-escape="false"
    custom-class="mp-order-detail-thumb-more-list-dialog-comp--wrap"
  >
    <div class="content mp-scroll-wrap">
      <template v-if="visible">
        <ImgItemBox v-for="it in list" :key="it.bigSrc + it.src" :src="it.bigSrc||it.src" :item="it" :previewSrcList="previewSrcList" class="img-box" />
      </template>
    </div>
    <div class="footer">
      <el-button @click="close">返回</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ImgItemBox from './ImgItemBox.vue';

export default {
  components: {
    ImgItemBox,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    list: {
      type: Array,
      default: () => [], // { src: string, bigSrc: string, FilePath: string, success: boolean, }
    },
  },
  computed: {
    previewSrcList() {
      return this.list.filter(it => it.success).map(it => it.src);
    },
  },
  methods: {
    close() {
      this.$emit('update:visible', false);
    },
  },
};
</script>
<style lang='scss'>
.mp-order-detail-thumb-more-list-dialog-comp--wrap {
  color: red;
  > .el-dialog__header {
    height: 45px;
    box-sizing: border-box;
    padding: 14px 10px;
    padding-left: 23px;
    margin: 0 10px;
    border-bottom: 1px solid #eee;
    > .el-dialog__title {
      font-size: 14px;
      color: #888;
      line-height: 16px;
      height: 16px;
      padding-left: 16px;
    }
    > .el-dialog__headerbtn {
      top: 8px;
      font-size: 20px;
    }
    position: relative;
    &::before {
      content: '';
      position: absolute;
      height: 14px;
      width: 15px;
      // background-color: #428dfa;
      background: url(../../../../../assets/images/order-detail/more-preview.png) no-repeat center center/100% 100%;
      left: 12px;
      top: 16px;
    }
  }
  > .el-dialog__body {
    padding-top: 20px;
    padding-right: 15px;
    padding-left: 25px;

    .content {
      height: 492px;
      overflow: auto;
      .img-box {
        width: 215px;
        height: 154px;
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }

    .footer {
      text-align: center;
      margin-top: 40px;
      > button {
        width: 110px;
        height: 35px;
        padding: 0;
        color: #428dfa;
        border-color: #428dfa;
      }
    }
    .el-loading-spinner {
      .circular {
        width: 30px;
        height: 30px;
      }
    }
  }
}
</style>
