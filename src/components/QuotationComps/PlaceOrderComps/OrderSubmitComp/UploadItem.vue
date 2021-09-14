<template>
  <el-upload
    v-if="FileInfo"
    class="mp-pc-order-submit-upload-item-comp-wrap"
    :class="{em: fileList.length === 0, single: fileList.length === 1}"
    drag
    :auto-upload="false"
    :on-remove="handleRemove"
    :file-list="fileList"
    :on-change='onFileChange'
    :on-exceed='handleExceed'
    action=""
    :accept='accept'
    :limit="!multiple ? 1 : undefined"
    :multiple='multiple'>
    <div class="header">
      <i>+</i>
      <span class="title">添加{{FileInfo.Name}}<i v-if="required" class="is-pink is-font-12">（必传）</i></span>
      <span class="tips">
        <i>（</i>
        <em> {{FileInfo.Remark}} </em>
        <i>）</i>
      </span>
    </div>
  </el-upload>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    required: {
      type: Boolean,
      default: false,
    },
    FileInfo: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      fileList: [],
    };
  },
  computed: {
    ...mapState('Quotation', ['FileTypeList']),
    multiple() {
      if (this.FileInfo) return this.FileInfo.AllowMultiple;
      return false;
    },
    accept() {
      if (this.FileInfo) {
        return this.FileInfo.TypeList.map(({ ID }) => {
          const t = this.FileTypeList.find(_it => _it.ID === ID);
          if (t) {
            return t.Name.split('/').map(it => `.${it}`).join(',');
          }
          return null;
        }).filter(it => it).join(',');
      }
      return '.cdr,.jpg,.jpeg,.tiff,.tif,.rar,.zip,.pdf, .7z';
    },
  },
  methods: {
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    onFileChange(file, fileList) {
      console.log(file, 'change');
      this.fileList = fileList;
    },
    handleExceed(fileList) {
      console.log(this.fileList, fileList, 'exceed');
      const file = fileList[0];
      this.fileList[0].raw = file;
      this.fileList[0].name = file.name;
      this.fileList[0].size = file.size;
    },
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
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: flex;
        align-items: center;
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
          margin-right: 10px;
          margin-left: 22px;
          flex: none;
          position: relative;
          top: -1px;
        }
        > span {
          &.title {
            color: #428dfa;
            margin-right: 4px;
            flex: none;
          }
          &.tips {
            color: #999;
            font-size: 12px;
            white-space: nowrap;
            overflow: hidden;
            display: flex;
            > em {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              flex: 1 1 auto;
              padding: 0 1px;
            }
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
      box-sizing: border-box;
      padding-left: 10px;
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
    border-color: rgba($color: #000000, $alpha: 0);
    > ul.el-upload-list {
      padding: 0;
    }
    > .el-upload {
      .el-upload-dragger {
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
        border-color: #eee;
      }
    }
  }
  &.single, &.em {
    > ul.el-upload-list > li {
      max-width: 830px;
      width: auto;
    }
    > .el-upload {
      .el-upload-dragger {
        &:hover {
          background-color: rgba(32, 159, 255, 0.06);
          border-color: #428dfa;
        }
        &.is-dragover {
          border-color: #428dfa;
        }
      }
    }
  }
}
</style>
