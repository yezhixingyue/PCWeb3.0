<template>
  <div class="mp-phone-upload-comp-break-point-type-wrap out-btn" @click.stop="onInputClick">
    <div class="self-comp" v-if="isUploadRightNow" @click.stop="onInputClick"
      :class="{hide: showLoading || showProgress, disabled: onlyShow}"
     >
      <input
        type="file"
        :multiple='multiple'
        :accept="accept"
        @change="onChange"
        @click.stop="onInputClick"
        class="upload-inp"
        ref="uploadInp"
        :disabled='onlyShow'
      />
      {{showTitle}}
    </div>
    <div v-else class="el-comp">
      <el-upload
        class="upload-box"
        ref="upload"
        action=''
        :on-remove="handleRemove"
        :file-list="fileList"
        :class="fileList.length > 0 ? '' : 'empty' "
        :limit='1'
        :accept='accept'
        :on-exceed='exceed'
        :on-change='handleElChange'
        drag
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">{{showTitle}}</el-button>
        <div class="upload-tips">
          <span>( 请上传cdr, jpg, jpeg, tiff, tif, rar, zip, pdf等格式的设计文件，JPG文件多面请打压缩包上传 )</span>
        </div>
      </el-upload>
    </div>
    <transition name="el-fade-in">
      <div
        class="loading-box transition-box"
        @click="e => {e.stopPropagation(); return false;}"
        v-show="showLoading || showProgress || showReadMsg"
       >
          <div v-if="showLoading">
            <i class="el-icon-loading"></i>
            <p>文件正在上传中...</p>
          </div>
          <div v-if="showProgress" class="progress-box">
            <p>文件正在上传中... </p>
            <el-progress stroke-linecap="square"
            :text-inside="true" :stroke-width="13" :percentage="percentageNum">
            </el-progress>
          </div>
          <div v-if="showReadMsg">
            <i class="el-icon-loading"></i>
            <p>{{upLoadTitle}}</p>
          </div>
        </div>
      </transition>
  </div>
</template>

<script>

import UploadFileByBreakPoint from '@/assets/js/ClassType/FileTypeClass/UploadFileByBreakPoint';
import massage from '@/assets/js/utils/message';

const sha1 = require('js-sha1');

export default { // 上传图片按钮
  props: {
    /**
     * 按钮内显示的文字
     */
    title: {
      type: String,
      default: '选择文件',
    },
    /**
     * 上传选择文件成功后的处理函数
     */
    successFunc: {
      type: Function,
      default: () => {},
    },
    /**
     * 上传选择文件失败后的处理函数
     */
    failFunc: {
      type: Function,
      default: () => {},
    },
    /**
     * 是否开启多选
     */
    multiple: {
      type: Boolean,
      default: false,
    },
    /**
     * 规定上传文件类型
     */
    accept: {
      type: String,
      // default: 'image/png,image/jpeg,image/gif,image/jpg,image/bmp',
      default: '.cdr,.jpg,.jpeg,.tiff,.tif,.rar,.zip,.pdf, .7z',
      // default: '.png,.jpeg,.gif,.jpg,.bmp',
      // default: '',
    },
    /**
     * 是否在选中文件后立即开始上传
     */
    isUploadRightNow: {
      type: Boolean,
      default: false,
    },
    validateFunc: {}, // 验证函数
    msgTitle: {
      type: String,
      default: '验证失败',
    },
    /**
     * 是否只用于状态显示 不能点击上传  通过ref调用上传方法
     */
    onlyShow: {
      type: Boolean,
      default: false,
    },
    shouldUpload: { // 是否需要上传文件
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      upLoadTitle: '',
      percentage: 0,
      showProgress: false,
      showLoading: false,
      showReadMsg: false,
      fileName: '',
      files: null,
      fileList: [],
    };
  },
  computed: {
    showTitle() {
      if (!this.upLoadTitle) return this.title;
      return this.upLoadTitle;
    },
    percentageNum() {
      return +(+this.percentage).toFixed(1);
    },
  },
  methods: {
    onChange(data) {
      if (!this.isUploadRightNow) {
        if (!this.multiple) {
          this.files = data.target.files;
        }
        return;
      }
      if (!this.multiple) { // 单个产品上传
        this.upLoadSingleFile(data.target.files[0]);
      } else if (this.multiple) { // 多产品上传
        // 暂未编写该功能
      }
    },
    upLoadSingleFile(file) {
      if (!file && this.shouldUpload) return;
      if (!this.shouldUpload) {
        this.successFunc({});
        return;
      }
      this.upLoadTitle = '文件读取中（ 文件大小影响读取时间 ）...';
      this.showReadMsg = true;
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onerror = () => {
        this.messageBox.failSingleError({ title: '文件解析错误！', msg: '请检查文件并重新上传' });
        this.upLoadTitle = '文件读取失败';
        this.showReadMsg = false;
        const oInput = document.querySelector('.mp-phone-upload-comp-break-point-type-wrap > input');
        if (oInput) oInput.value = '';
      };
      reader.onloadend = async () => {
        if (!(reader.result)) return;
        const ext = this.utils.extname(file.name);
        const _name = `${sha1(reader.result)}.${ext}`; // 文件名称, 文件唯一标识
        this.upLoadTitle = '解析完成,开始上传';
        this.fileName = file.name;
        if (file.size > 5 * 1024 * 1024) { // 文件大于5M显示进度条  客户端设置20M
          this.showProgress = true;
        } else {
          this.showLoading = true;
        }
        this.showReadMsg = false;
        this.upLoadTitle = '';
        const onUploadProgressFunc = progress => {
          // eslint-disable-next-line no-restricted-globals
          if (!isNaN(progress)) this.percentage = progress;
        };
        if (file && _name) {
          const key = await UploadFileByBreakPoint(file, _name, onUploadProgressFunc, 100);
          if (key && key.status === true) {
            // 上传成功
            this.successFunc({ compiledName: _name, initialName: this.fileName, FileSize: file.size });
          } else {
            // 上传失败
            massage.failSingleError({ title: '文件上传失败', msg: '请检查或重试!', failFunc: this.failFunc });
          }
          if (this.showProgress) this.showProgress = false;
          if (this.showLoading) this.showLoading = false;
          this.upLoadTitle = '';
          const oInput = document.querySelector('.mp-phone-upload-comp-break-point-type-wrap > div > input.upload-inp');
          if (oInput) oInput.value = '';
          this.percentage = 0;
        }
      };
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    handleElChange(file, fileList) {
      this.fileList = fileList;
      this.$emit('fillFileContent', file.name.substring(0, file.name.lastIndexOf('.')));
    },
    delay(storeObj, duration) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, duration);
      });
    },
    exceed(fileList) {
      const file = fileList[0];
      this.fileList[0].raw = file;
      this.fileList[0].name = file.name;
      this.$emit('fillFileContent', file.name.substring(0, file.name.lastIndexOf('.')));
    },
    async handleElUpload() {
      if (!this.shouldUpload) { // 如果不需要上传文件
        const msg = await this.validateFunc();
        if (typeof msg === 'string') {
          massage.failSingleError({ title: `${this.msgTitle}失败`, msg });
          return;
        }
        if (msg === true) this.successFunc({});
        return;
      }
      await this.delay(0);
      const msg = await this.validateFunc();
      if (typeof msg === 'string') {
        massage.failSingleError({ title: `${this.msgTitle}失败`, msg });
        return;
      }
      if (msg === true) {
        if (this.fileList.length === 0) {
          massage.failSingleError({ title: `${this.msgTitle}失败`, msg: '请选择订单文件!', failFunc: this.failFunc });
          return;
        }
        const file = this.fileList[0].raw;
        this.upLoadSingleFile(file);
      }
    },
    async saveFile2Store() {
      if (!this.shouldUpload) { // 如果不需要上传文件
        const msg = await this.validateFunc();
        if (typeof msg === 'string') {
          massage.failSingleError({ title: `${this.msgTitle}失败`, msg });
          return;
        }
        if (msg === true) this.successFunc({});
        return;
      }
      await this.delay(0);
      const msg = await this.validateFunc();
      if (typeof msg === 'string') {
        massage.failSingleError({ title: `${this.msgTitle}失败`, msg });
        return;
      }
      if (msg === true) {
        if (this.fileList.length === 0) {
          massage.failSingleError({ title: `${this.msgTitle}失败`, msg: '请选择订单文件!', failFunc: this.failFunc });
          return;
        }
        const file = this.fileList[0].raw;
        this.$emit('saveFile2Store', file);
        this.successFunc({ compiledName: '', initialName: this.fileName });
      }
    },
    // eslint-disable-next-line consistent-return
    onInputClick(e) {
      if (this.onlyShow) {
        e.stopPropagation();
        return false;
      }
    },
  },
  mounted() {
    // 下面代码用于兼容ie9;
    const oInpFile = document.querySelector('.upload-box .el-upload__input');
    if (!oInpFile) return;
    oInpFile.onchange = e => {
      if (!e.target.files) {
        this.messageBox.failSingleError({
          title: '文件获取错误',
          msg: '当前浏览器版本不支持文件上传，请更换或升级浏览器尝试',
        });
      }
    };
  },
};
</script>

<style lang='scss'>
.mp-phone-upload-comp-break-point-type-wrap {
  > div.self-comp {
    min-width: 100px;
    height: 35px;
    background-color: #428dfa;
    border: 1px solid #428dfa;
    outline: none;
    font-size: 12px;
    border-radius: 2px;
    user-select: none;
    display: inline-block;
    position: relative !important;
    color: #fff !important;
    text-align: center;
    line-height: 35px;
    box-shadow: inset 0px 1px 0px rgba(255, 255, 255, 0.3), 0 1px 2px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    &.disabled {
      user-select: none;
      pointer-events: none;
      &::after {
        opacity: 0;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 100%;
        z-index: 9;
        content: '';
        cursor: unset;
      }
    }

    > input {
      opacity: 0;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 100%;
      cursor: pointer;
    }
    &:hover {
      background-color: #009ef9;
      border-color: #009ef9;
    }
    &:active {
      background-color: #35dff9;
      border-color: #35dff9;
    }
    &.hide {
      &:hover {
        background-color: #428dfa;
        border-color: #428dfa;
      }
      &:active {
        background-color: #428dfa;
        border-color: #428dfa;
      }
    }
  }
  > span {
    cursor: pointer;
    margin-right: 35px;
    user-select: none;
    &:active {
      color: #f4a307 !important;
    }
  }
  > div.loading-box {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba($color: #000000, $alpha: 0.7);
    overflow: hidden;
    z-index: 8888;
    > div {
      color: #428dfa;
      position: absolute;
      top: 50%;
      left: 50%;
      font-size: 14px;
      transform: translate(-50%, -135%);
      text-align: center;
      > i {
        font-size: 32px;
        margin-bottom: 10px;
      }
      &.progress-box {
        width: 780px;
        > p {
          text-align: left;
          margin-bottom: 10px;
          font-size: 16px;
          color: #26bcf9;
        }
        .el-progress-bar__inner {
          .el-progress-bar__innerText {
            vertical-align: top;
          }
          width: 0;
        }
      }
    }
  }
  > div.el-comp {
    text-align: left;
    > span {
      line-height: 35px;
      vertical-align: top;
    }
    > .upload-box {
      display: inline-block;
      position: relative;
      width: 860px;
      > .el-upload {
        vertical-align: top;
        margin-right: 20px;
        .el-upload-dragger {
          width: auto;
          height: auto;
          border: none;
          border-radius: 0;
          > .el-button {
            min-width: 100px;
            height: 35px;
            padding: 0 15px;
            line-height: 33px;
            font-size: 13px;
          }
        }
      }
      > .el-upload-list {
        display: inline-block;
        > li {
          margin-top: 5px;
          outline-width: 0;
          transition: none;
          > a {
            text-align: left;
            font-size: 13px;
          }
        }
        .el-upload-list__item-name {
          padding: 0;
          max-width: 620px;
        }
        position: relative;
      }
      > .upload-tips {
        position: absolute;
        left: 120px;
        height: 35px;
        top: 0;
        line-height: 35px;
        font-size: 12px;
        color: #989898;
        opacity: 0;
      }
      &::after {
        content: '';
        display: block;
        clear: both;
      }
      overflow: hidden;
      height: 35px;
      &.empty {
        > .upload-tips {
          opacity: 1;
          animation: afterAnimate 0.4s;
        }
      }
    }
    @keyframes afterAnimate {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    &::after {
      content: '';
      display: block;
      clear: both;
    }
  }
}
</style>
