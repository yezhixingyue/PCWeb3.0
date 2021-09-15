<template>
  <el-form-item v-if="FileInfo" :rules="[{ validator: itemValidator, trigger: 'change' }]" :prop="`${FileInfo.ID}`"
      class="mp-pc-order-submit-upload-item-comp-wrap">
    <el-upload
      :class="{ em: fileList.length === 0, single: fileList.length === 1, 'mp-upload': 1 }"
      drag
      :auto-upload="false"
      :on-remove="handleRemove"
      :file-list="fileList"
      :on-change="onFileChange"
      :on-exceed="handleExceed"
      action=""
      :accept="accept"
      :limit="!multiple ? 1 : 1000"
      :multiple="multiple"
    >
      <div class="header">
        <i>+</i>
        <span class="title"
          >添加{{ FileInfo.Name
          }}<i v-if="required || multiple" class="is-pink is-font-12"
            >（
            <template v-if="required">必传</template>
            <template v-if="required && multiple">、</template>
            <template v-if="multiple">可上传多个</template>
            ）</i
          ></span
        >
        <span class="tips">
          <i>（</i>
          <em :title="FileInfo.Remark.length > 40 ? FileInfo.Remark : ''">
            {{ FileInfo.Remark }}
          </em>
          <i>）</i>
        </span>
      </div>
    </el-upload>
  </el-form-item>
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
      // fileList: [],
      maxSize: 50,
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
          const t = this.FileTypeList.find((_it) => _it.ID === ID);
          if (t) {
            return t.Name.split('/')
              .map((it) => `.${it}`)
              .join(',');
          }
          return null;
        })
          .filter((it) => it)
          .join(',');
      }
      return '.cdr,.jpg,.jpeg,.tiff,.tif,.rar,.zip,.pdf, .7z';
    },
    fileList: {
      get() {
        if (this.FileInfo) {
          return this.FileInfo.FileList;
        }
        return [];
      },
      set(val) {
        this.$nextTick(() => {
          this.$store.commit('Quotation/setItemFlieList', [
            val,
            this.FileInfo.ID,
          ]);
          this.$emit('validateField', `${this.FileInfo.ID}`);
        });
      },
    },
  },
  methods: {
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    onFileChange(file, fileList) {
      this.fileList = fileList;
      if (this.FileInfo.IsPrintFile) this.$emit('fillFileContent', file.name.substring(0, file.name.lastIndexOf('.')));
    },
    handleExceed(fileList) { // limit超出触发事件 -- 仅单选时生效
      if (!this.multiple) {
        // 不是多选时才替换
        const file = fileList[0];
        const temp = [
          {
            ...this.fileList[0],
            raw: file,
            name: file.name,
            size: file.size,
          },
        ];
        this.fileList = temp;
        if (this.FileInfo.IsPrintFile) this.$emit('fillFileContent', file.name.substring(0, file.name.lastIndexOf('.')));
      }
    },
    itemValidator(rule, value, callback) { // 校验
      if (this.fileList.length === 0 && this.required) {
        callback(new Error(`[ ${this.FileInfo.Name} ] 为必传文件`));
        return;
      }
      if (this.fileList.length > 0) {
        const total = this.fileList.map(it => it.size).reduce((prev, next) => prev + next, 0);
        if (total > this.maxSize * 1024 * 1024) {
          callback(new Error(`[ ${this.FileInfo.Name} ] ${this.multiple ? '总' : ''}文件大小超出了最大限制${this.maxSize}M`));
          return;
        }
      }
      callback();
    },
  },
};
</script>
<style lang='scss'>
.mp-pc-order-submit-upload-item-comp-wrap {
  margin-bottom: 30px;
  .mp-upload {
    width: 850px;
    border: 1px dashed #eee;
    border-radius: 5px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    > .el-upload {
      width: 100%;
      overflow: hidden;
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
      background-color: #fbfbfb;
      padding: 9px 10px;
      overflow: hidden;
      line-height: 16px;
      transition: 0.15s ease-in-out;
      transition: 0;
      > li {
        margin-top: 0;
        display: inline-block;
        width: 415px;
        box-sizing: border-box;
        padding-left: 10px;
        line-height: 24px;
        transition: 0.15s ease-in-out;
        transition: 0;
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
    &.single,
    &.em {
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
  .el-form-item__error {
    padding-left: 6px;
  }
  // &.is-error {
    // .mp-upload {
      // border-color: #ff3769;
      // &:hover {
      //   border-color: #eee;
      // }
      // &.em {
      //   border-color: rgba($color: #000000, $alpha: 0);
        // > .el-upload {
        //   .el-upload-dragger {
        //     border-color: #ff3769;
        //     &:hover {
        //       border-color: #428dfa;
        //     }
        //   }
        // }
      // }
    // }
  // }
}
</style>
