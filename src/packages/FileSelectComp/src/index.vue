<template>
  <FileSelectBtn
    class="mp-c-batch-upload-page-file-select-comp-wrap"
    :accept="accept"
    multiple
    :disabled='disabled'
    :func="handleFileSelect"
    title="选择文件"
    :selectTitle='selectTitle'
    ref="onFileSelector"
  />
</template>

<script>
import FileSelectBtn from './FileSelectBtn';

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    accept: {
      required: true,
    },
    selectTitle: {
      type: String,
      default: '',
    },
  },
  components: {
    FileSelectBtn,
  },
  methods: {
    handleFileSelect(files, e) {
      const fileList = [...files];
      if (e && e.target) e.target.value = '';
      this.$emit('change', fileList);
    },
  },
};
</script>
<style lang='scss'>
.mp-c-batch-upload-page-file-select-comp-wrap {
  width: 120px;
  height: 32px;
  margin: 0;
  line-height: 32px;
  font-size: 13px;
  input {
    width: 100%;
  }
}
</style>
