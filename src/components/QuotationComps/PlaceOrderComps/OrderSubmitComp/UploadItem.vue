<template>
  <el-upload
    class="mp-pc-order-submit-upload-item-comp-wrap"
    :class="fileList.length === 0 ? 'em' : ''"
    drag
    :auto-upload="false"
    :on-remove="handleRemove"
    :file-list="fileList"
    action=""
    multiple>
    <div class="header">
      <i>+</i>
      <span class="title">添加印刷文件</span>
      <span class="tips">
        （<em> 只能上传jpg/png文件，且不超过500kb </em>）
      </span>
    </div>
  </el-upload>
</template>

<script>
export default {
  data() {
    return {
      fileList: [],
    };
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // this.$refs.upload.submit();
    // accept  文件类型
    // limit 最大数量限制
  },
};
</script>
<style lang='scss'>
.mp-pc-order-submit-upload-item-comp-wrap {
  width: 850px;
  border: 1px dashed #eee;
  border-radius: 5px;
  > .el-upload {
    width: 100%;
    .el-upload-dragger {
      width: 850px;
      border-color: rgba($color: #000000, $alpha: 0);
      height: 55px;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      .header {
        text-align: left;
        height: 55px;
        line-height: 54px;
        > i {
          display: inline-block;
          width: 20px;
          height: 20px;
          background-color: #428dfa;
          color: #fff;
          border-radius: 50%;
          line-height: 18px;
          text-align: center;
          font-size: 17px;
          font-weight: 100;
          margin-right: 8px;
          margin-left: 22px;
        }
        > span {
          &.title {
            color: #428dfa;
            margin-right: 4px;
          }
          &.tips {
            color: #999;
            font-size: 12px;
          }
        }
        &:active {
          > span.title {
            color: #1662d3;
          }
          > i {
            background-color: #1662d3;
          }
        }
      }
      &:hover {
        background-color: rgba(32, 159, 255, 0.06);
        border-color: #428dfa;
      }
      &.is-dragover {
        border-color: #428dfa;
      }
    }
  }
  > ul.el-upload-list {
    background-color: #FBFBFB;
    padding: 10px;
    > li {
      margin-top: 0;
      display: inline-block;
      width: 415px;
      > a.el-upload-list__item-name {
        font-size: 12px;
        color: #aaa;
        > i {
          font-size: 14px;
        }
      }
    }
  }
  &.em {
    > ul.el-upload-list {
      padding: 0;
    }
  }
}
</style>
