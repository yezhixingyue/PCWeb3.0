<template>
  <!-- <div> -->
  <span class="upload-btn" :class="{disabled: disabled}" :title="selectTitle">
    <input
      type="file"
      ref="oInp"
      :multiple='multiple'
      :accept="accept"
      @change="onChange"
    />
    {{title}}
  </span>
  <!-- <img :src="url" alt=""> -->
  <!-- </div> -->
</template>

<script>
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
      // url: null,
    };
  },
  methods: {
    onChange(e) {
      if (this.func && !this.multiple) this.func(e.target.files[0], e);
      // 如果没有开启一次上传多张选项，只传递第一张图片返回(也是唯一一张)；
      if (this.func && this.multiple) {
      // 如果开启多张上传，返回整个数组
        this.func(e.target.files, e);
      }
    },
    handleRemove() {
      this.$nextTick(() => {
        this.$refs.oInp.value = '';
      });
    },
  },

};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.upload-btn {
  width: 100px;
  height: 25px;
  background-color: $--color-primary;
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
    width: 100px;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
  }
  &:hover {
    background-color: #009ef9;
  }
  &:active {
    background-color: #35dff9;
  }
  &.disabled {
    background-color: #cbcbcb;
    cursor: not-allowed;
    > input {
      width: 0 !important;
      display: none;
    }
  }
}
</style>
