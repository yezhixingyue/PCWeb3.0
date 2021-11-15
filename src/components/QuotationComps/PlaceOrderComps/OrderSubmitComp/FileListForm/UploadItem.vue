<template>
  <el-form-item v-if="FileInfo" :rules="[{ validator: itemValidator, trigger: 'change' }]" :prop="`${FileInfo.ID}`"
      class="mp-pc-order-submit-upload-item-comp-wrap" :class="{disabled: disabled}">
    <el-upload
      :class="{ em: fileList.length === 0, single: fileList.length === 1, 'mp-upload': 1 }"
      drag
      :on-remove="handleRemove"
      :auto-upload='false'
      :file-list="fileList"
      :on-change="onFileChange"
      action=""
      :limit="1000"
      :accept="accept"
      :multiple="multiple"
      :disabled='disabled'
      :http-request="handleHttpRequest"
      ref="upload"
    >
      <div class="header">
        <i>+</i>
        <span class="title">添加{{ FileInfo.Name}}</span>
        <span class="tips">
          <i>（</i>
          <template v-if="required"><i class="is-pink">必传，</i></template>
          <template v-else>非必传，</template>
          <template v-if="multiple">可上传多个，</template>
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
import FileTypeClass from '@/assets/js/ClassType/FileTypeClass';

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
    maxSize: {
      type: Number,
      default: 1024,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      fileList: [],
      // maxSize: 50,
      timer: null, // 上传定时器，获取状态使用
      uploadResultList: [],
    };
  },
  computed: {
    multiple() {
      if (this.FileInfo) return this.FileInfo.AllowMultiple;
      return false;
    },
    accept() {
      if (this.FileInfo) {
        if (this.FileInfo.FormatString) {
          return this.FileInfo.FormatString.split(',').map(it => (it ? `.${it}` : '')).filter(it => it).join(',');
        }
        const str = this.FileInfo.TypeList.map(({ Name }) => Name.split('/')
          .map(it => (it === '*' ? it : `.${it}`))
          .join(','))
          .filter((it) => it)
          .join(',');
        return str.includes('*') ? '*' : str;
      }
      return '.cdr,.jpg,.jpeg,.tiff,.tif,.rar,.zip,.pdf, .7z';
    },
  },
  methods: {
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    onFileChange(file, fileList) {
      if (!this.multiple) {
        this.fileList = [fileList[fileList.length - 1]];
      } else {
        this.fileList = fileList;
      }
      if (this.FileInfo.IsPrintFile && file.status === 'ready') this.$emit('fillFileContent', file.name.substring(0, file.name.lastIndexOf('.')));
    },
    itemValidator(rule, value, callback) { // 校验
      if (this.fileList.length === 0 && this.required) {
        callback(new Error(this.FileInfo.FailTips || `[ ${this.FileInfo.Name} ] 为必传文件`));
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
    async handleHttpRequest(data) {
      const {
        file, onError, onProgress, onSuccess,
      } = data;

      onProgress({ percent: 1 }); //   进度条起始

      // 1. 解析文件名称
      let err;
      const name = await FileTypeClass.getUniqueFileName(file, this.FileInfo.ID).catch((error) => {
        err = error;
      });
      if (err) { // 解析失败
        this.$notify.error({
          title: `${file.name}上传失败`,
          message: err,
        });
        onError(new Error(err));
        return;
      }
      onProgress({ percent: 2 }); //   进度条起始

      // 2. 获取到文件及唯一文件名称后，开始执行上传
      const onUploadProgressFunc = progress => {
        if (this.utils.getValueIsOrNotNumber(progress)) onProgress({ percent: progress >= 2 ? progress : 2 });
      };

      const res = await FileTypeClass.UploadFileByBreakPoint(file, name, onUploadProgressFunc, 100);
      if (res && res.status) { // 上传成功
        onSuccess();
        this.uploadResultList.push({ // 添加对象，包含：文件大小FileSize、文件解析名称FilePath、文件名称FileName
          FileSize: file.size,
          FilePath: name,
          UniqueName: name,
          FileName: file.name,
          uid: file.uid,
        });
      } else { // 上传失败
        this.$notify.error({
          title: `${file.name}上传失败`,
          message: res.error.message || '请检查文件或重试!',
        });
        onError(new Error(res.error.message || '文件上传失败'));
      }
    },
    submit() { // 提交 判断是否有文件需要上传（非必传文件时），如果没有则直接返回结果
      return new Promise((resolve) => {
        if (this.fileList.length === 0) {
          const temp = {
            ID: this.FileInfo.ID,
            List: [],
          };
          resolve(temp);
          return;
        }
        this.$refs.upload.submit();
        this.timer = setInterval(() => {
          const list = this.fileList.map(it => it.status);
          const t = list.find(it => it === 'uploading');
          if (!t) {
            clearInterval(this.timer);
            this.timer = null;
            const failItem = list.find(it => it === 'fail');
            if (failItem) { // 如果存在上传失败的 -- 待测
              resolve(false);
            } else {
              const temp = {
                ID: this.FileInfo.ID,
                List: [...this.uploadResultList],
              };
              resolve(temp);
            }
          }
        }, 1000);
      });
    },
    clearFiles() {
      this.$refs.upload.clearFiles();
    },
  },
  watch: {
    fileList(newVal, oldVal) { // 去重及筛选格式不符合的文件
      this.$emit('validateField', `${this.FileInfo.ID}`); // 发生变动时进行重新校验
      // uploadResultList 跟随其一起变动
      if (this.uploadResultList.length > 0) {
        const list = newVal.filter(it => it.status === 'success').map(it => it.uid);
        this.uploadResultList = this.uploadResultList.filter(it => list.includes(it.uid));
      }
      // 去重
      if (newVal.length < oldVal.length) return;
      const arr = [];
      this.fileList.forEach(_file => {
        const i = arr.findIndex(_it => _it.size === _file.size && _it.name === _file.name && _it.raw.type === _file.raw.type);
        if (i === -1) arr.push(_file);
      });
      let isRepeat = false;
      let isNotMatch = false;
      if (this.fileList.length > arr.length) isRepeat = true;

      // 去除格式不符合文件
      const list = arr.filter(_file => {
        if (this.accept === '*') return true;
        const extname = this.utils.extname(_file.name);
        return this.accept.includes(extname);
      });
      if (list.length < arr.length) isNotMatch = true;

      // 汇总
      if (isRepeat || isNotMatch) {
        let message;
        let title;
        if (isRepeat) {
          message = '已去除重复文件';
          title = '文件重复';
        }
        if (isNotMatch) {
          message = '已去除格式不符合文件';
          title = '文件格式不符';
        }
        if (isRepeat && isNotMatch) {
          message = '已去除重复及格式不符合文件';
          title = '部分文件重复且格式不符';
        }
        this.$notify.error({
          title,
          message,
        });
        this.fileList = list;
      }
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
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
        transition: border-color 0.08s;
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
        width: 405px;
        margin-right: 10px;
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
          &.is-error {
            .iconfont {
              font-size: 12px;
              margin-right: 4px;
            }
          }
        }
        .el-progress__text {
          color: #428dfa;
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
        min-width: 405px;
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
  &.disabled .mp-upload {
    > .el-upload {
      .el-upload-dragger {
        border-color: rgba($color: #000000, $alpha: 0) !important;
        background-color: #f8f8f8 !important;
      }
    }
    &.em {
      > .el-upload .el-upload-dragger {
        border-color: #eee !important;
      }
    }
  }
}
</style>
