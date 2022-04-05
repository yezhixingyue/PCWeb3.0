<template>
  <span
    class="upload-btn"
    :class="{
      'is-dragover': dragover,
      disabled: disabled,
      'pc': projectType === 'pc',
    }"
    :title="selectTitle"
    @drop.prevent="onDrop"
    @dragover.prevent="onDragover"
    @dragleave.prevent="dragover = false"
   >
    <input
      type="file"
      ref="oInp"
      :multiple='multiple'
      :accept="accept"
      @change="change"
    />
    {{localTitle}}
  </span>
</template>

<script>
import { projectType } from '@/assets/js/setup';

export default { // 上传图片按钮
  props: {
    /**
     * 按钮内显示的文字
     */
    title: {
      type: String,
      default: '上传问题照片',
    },
    /**
     * 上传选择文件后的处理函数
     */
    func: {
      type: Function,
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
      default: 'image/*',
      // default: '.png,.jpeg,.gif,.jpg,.bmp',
      // default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    selectTitle: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      imgs: [],
      dragover: false,
      projectType,
    };
  },
  computed: {
    localTitle() {
      if (this.dragover) return '释放文件';
      return this.title;
    },
  },
  methods: {
    change(e) {
      if (!e || !this.func) return;
      const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
      this.handleFileEmit(files, e);
    },
    handleRemove() {
      this.$nextTick(() => {
        this.$refs.oInp.value = '';
      });
    },
    handleFileEmit(files, e) {
      if (this.multiple) { // 多文件上传
        this.func(files, e);
      } else { // 单文件上传
        this.func(files[0], e);
      }
    },
    onDragover() {
      if (!this.disabled) {
        this.dragover = true;
      }
    },
    onDrop(e) {
      if (this.disabled) return;
      const { accept } = this;
      this.dragover = false;
      if (!accept) {
        this.handleFileEmit(e.dataTransfer.files, e);
        return;
      }
      const files = [].slice.call(e.dataTransfer.files).filter(file => {
        const { type, name } = file;
        const extension = name.indexOf('.') > -1
          ? `.${name.split('.').pop()}`
          : '';
        const baseType = type.replace(/\/.*$/, '');
        return accept.split(',')
          .map(it => it.trim())
          .filter(it => it)
          .some(acceptedType => {
            if (/\..+$/.test(acceptedType)) {
              return extension === acceptedType;
            }
            if (/\/\*$/.test(acceptedType)) {
              return baseType === acceptedType.replace(/\/\*$/, '');
            }
            // eslint-disable-next-line no-useless-escape
            if (/^[^\/]+\/[^\/]+$/.test(acceptedType)) {
              return type === acceptedType;
            }
            return false;
          });
      });
      const diffLength = e.dataTransfer.files.length - files.length;
      if (diffLength > 0) {
        if (files.length > 0) this.$message.error(`已筛掉不符合格式的文件${diffLength}个`);
        else this.$message.error('文件格式不符合，请重新选择');
        // this.messageBox.failSingleError('', )
      }
      this.handleFileEmit(files, e);
    },
  },

};
</script>

<style lang='scss'>
.upload-btn {
  width: 100px;
  height: 25px;
  background-color: #26bcfa;
  border: none;
  outline: none;
  font-size: 12px;
  border-radius: 2px;
  margin-right: 15px;
  margin-top: 25px;
  user-select: none;
  display: inline-block;
  position: relative;
  color: #fff !important;
  text-align: center;
  line-height: 25px;
  > input {
    opacity: 0;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
  }
  &.pc {
    background-color: #428dfa;
  }
  &:hover {
    background-color: #009ef9;
  }
  &:active {
    background-color: #35dff9;
  }
  &.is-dragover {
    background-color: #35dff9;
    cursor: context-menu;
  }
  &.disabled {
    background-color: #a1c6fd;
    cursor: not-allowed;
    > input {
      width: 0 !important;
      display: none;
    }
  }
}
</style>
