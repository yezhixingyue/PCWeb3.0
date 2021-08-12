<template>
  <div class="mp-phone-upload-comp-break-point-type-wrap out-btn" @click.stop="onInputClick">
    <!-- <span class="is-pink" @click="clearFile">清除文件</span> -->
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
      <!-- <span class="gray">印刷文件：</span> -->
      <el-upload
        class="upload-box"
        ref="upload"
        action=''
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        :class="fileList.length > 0 ? '' : 'empty' "
        :limit='1'
        :accept='accept'
        :on-exceed='exceed'
        :on-change='handleElChange'
        drag
        :auto-upload="false">
        <!-- <input
        type="file"
          :multiple='multiple'
          :accept="accept"
          @change="onChange"
          @click.stop="onInputClick"
          class="upload-inp"
          ref="uploadInp"
          :disabled='onlyShow'
        /> -->
        <el-button slot="trigger" size="small" type="primary">{{showTitle}}</el-button>
        <div class="upload-tips">
          <el-popover
            placement="top-start"
            width="564"
            offset='151'
            trigger="hover">
            <section class="mp-file-upload-tips-popover-wrap">
              <header><i></i>文档设计标准</header>
              <ul>
                <li>
                  <p>1．软件版本</p>
                  <span>CDR文件推荐使用X4（如有高版本文件建议转PDF或JPG进行上传）</span>
                </li>
                <li>
                  <p>2．字体与转曲</p>
                  <span>文档需提前进行转曲（栅格化）</span>
                </li>
                <li>
                  <p>3．尺寸出血与边距</p>
                  <span>下单尺寸要与文件成品尺寸保持一致；</span>
                  <span>重要图文信息距边距3mm及以上，出血勿携带裁切脚线</span>
                </li>
                <li>
                  <p>4．分辨率</p>
                  <span>按照印刷最小分辨率要求不小于300dpi</span>
                </li>
                <li>
                  <p>5．特殊效果</p>
                  <span>特殊效果建议转位图处理</span>
                </li>
                <li>
                  <p>6．最小字号及极细线</p>
                  <span>印刷最小字号为5pt，烫金最小字号为7pt；</span>
                  <span>印刷线条最细为0.076mm，烫金最细线条为0.2mm</span>
                </li>
                <li>
                  <p>7．颜色设置</p>
                  <span>印刷文档要求颜色模式为CMYK；</span>
                  <span>四色黑字及四色黑二维码请转成单黑；</span>
                  <span>大面积实地四色黑（C100 M100 Y100 K100）建议使用C30 K100替代</span>
                </li>
              </ul>
            </section>
            <span slot="reference"
             style="margin:4px 0; margin-right: 10px;color:#428dfa; cursor: pointer;
             display:inline-block;height:22px; line-height: 22px">注意事项</span>
          </el-popover>
          <span>( 请上传cdr, jpg, jpeg, tiff, tif, rar, zip, pdf等格式的设计文件，JPG文件多面请打压缩包上传 )</span>
        </div>
        <!-- <el-button  size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
      </el-upload>
    </div>
    <transition name="el-fade-in">
      <div
        class="loading-box transition-box"
        @click="e => {e.stopPropagation(); return false;}"
        v-show="showLoading || showProgress || showReadMsg"
       >
      <!-- <div
            class="loading-box"
            @click="e => {e.stopPropagation(); return false;}"
            v-if="1"
        > -->
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

import UploadFileByBreakPoint from '@/assets/js/upload/UploadFileByBreakPoint';
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
      // eventFileList: [], //
    };
  },
  computed: {
    showTitle() {
      // if (!this.upLoadTitle || !this.isUploadRightNow) return this.title;
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
      // console.log('upLoadSingleFile');
      if (!file && this.shouldUpload) return;
      if (!this.shouldUpload) {
        this.successFunc({});
        return;
      }
      this.upLoadTitle = '文件读取中（ 文件大小影响读取时间 ）...';
      this.showReadMsg = true;
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      // // console.log(file, 12345);
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
        // this.setReplenishFileUniqueName(`${sha1(reader.result)}.${ext}`);
        // this.setReplenishFile(file);
        const onUploadProgressFunc = progress => {
          // eslint-disable-next-line no-restricted-globals
          if (!isNaN(progress)) this.percentage = progress;
        };
        if (file && _name) {
          const key = await UploadFileByBreakPoint(file, _name, onUploadProgressFunc, 100);
          if (key) {
            // 上传成功
            this.successFunc({ compiledName: _name, initialName: this.fileName, FileSize: file.size });
          } else {
            // 上传失败
            massage.failSingleError({ title: '文件上传失败', msg: '抱歉，文件上传失败，请重试!', failFunc: this.failFunc });
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
    // clearFile() {
    //   // console.log(this.$refs.uploadInp.value)
    // },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      // // console.log(file, fileList);
      this.fileList = fileList;
    },
    handlePreview(file) {
      if (file) {
        // // console.log(file);
      }
    },
    handleElChange(file, fileList) {
      // // console.log(file, fileList);
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
      // // console.log(this.fileList, fileList, arr);
      const file = fileList[0];
      this.fileList[0].raw = file;
      this.fileList[0].name = file.name;
      this.$emit('fillFileContent', file.name.substring(0, file.name.lastIndexOf('.')));
      // this.fileList = fileList;
      // massage.failSingleError({ title: '已上传订单文件', msg: '如需更换，请删除订单文件后重新上传' });
    },
    async handleElUpload() {
      // // console.log('handleElUpload');
      // const oInpFile = document.querySelector('.upload-box .el-upload__input');
      // // console.log(oInpFile.files, 'shouldUpload upload comp', this.shouldUpload);
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
      if (this.fileList.length === 0) {
        massage.failSingleError({ title: `${this.msgTitle}失败`, msg: '请选择订单文件!', failFunc: this.failFunc });
        return;
      }
      const msg = await this.validateFunc();
      if (typeof msg === 'string') {
        massage.failSingleError({ title: `${this.msgTitle}失败`, msg });
        return;
      }
      if (msg === true) {
        // this.$emit('handleMapPosition', () => {
        //   const file = this.fileList[0].raw;
        //   this.upLoadSingleFile(file);
        // });
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
      if (this.fileList.length === 0) {
        massage.failSingleError({ title: `${this.msgTitle}失败`, msg: '请选择订单文件!', failFunc: this.failFunc });
        return;
      }
      const msg = await this.validateFunc();
      if (typeof msg === 'string') {
        massage.failSingleError({ title: `${this.msgTitle}失败`, msg });
        return;
      }
      if (msg === true) {
        // this.$emit('handleMapPosition', () => {
        //   const file = this.fileList[0].raw;
        //   // this.upLoadSingleFile(file);
        //   this.$emit('saveFile2Store', file);
        //   this.successFunc({ compiledName: '', initialName: this.fileName });
        // });
        const file = this.fileList[0].raw;
        // this.upLoadSingleFile(file);
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
    // margin-right: 15px;
    // margin-top: 25px;
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
        // &::before {
        //   content: '请选择订单文件 ( 请上传cdr, jpg, jpeg, tiff, tif, rar, zip, pdf等格式的设计文件，JPG文件多面请打压缩包上传 )';
        //   display: inline-block;
        //   line-height: 35px;
        //   color: #989898;
        //   font-size: 12px;
        //   // display: block;
        //   position: absolute;

        //   left: -6px;
        //   // top: -30px;
        //   width: 0;
        //   top: -12px;
        //   opacity: 0;
        //   // display: block;
        // }
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
        // > .el-upload-list {
        //   width: 600px;
        //   &::before {
        //     top: -12px;
        //     opacity: 1;
        //     width: 55em;
        //     animation: afterAnimate 0.4s;
        //   }
        // }
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
.mp-file-upload-tips-popover-wrap {
  margin: 0 2px;
  > header {
    font-size: 16px;
    padding-left: 10px;
    height: 32px;
    border-bottom: 1px solid #eee;
    padding-top: 3px;
    padding-bottom: 1px;
    > i {
      width: 19px;
      height: 18px;
      vertical-align: text-bottom;
      display: inline-block;
      margin-right: 10px;
      background: url('../../../assets/images/upload-tip.png') no-repeat center center/100% 100%;
    }
  }
  > ul {
    padding-top: 17px;
    padding-left: 10px;
    padding-bottom: 20px;
    > li {
      > p {
        font-size: 12px;
        color: #585858;
        padding: 5px 0;
        line-height: 14px;
      }
      > span {
        display: block;
        color: #888;
        font-size: 12px;
        line-height: 14px;
        padding: 5px 0;
      }
    }
  }
}
</style>
