<template>
  <el-form ref="ruleForm" label-width="0" :model="{}" @submit.native.prevent>
    <UploadItem
      v-for="it in FileList"
      :key="it.key"
      v-show="it.display"
      :required="it.IsRequired"
      :maxSize='it.MaxSize'
      :FileInfo="it"
      :disabled='disabled'
      :CustomerID='CustomerID'
      ref="UploadItem"
      @validateField="handleValidateField"
      @fillFileContent='fillFileContent'
      :getAllFileList='getAllFileList'
    />
  </el-form>
</template>

<script>
import UploadItem from './UploadItem.vue';

export default {
  props: {
    FileList: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    CustomerID: {
      type: String,
      default: '',
    },
  },
  components: {
    UploadItem,
  },
  data() {
    return {};
  },
  methods: {
    handleValidateField(key) {
      this.$refs.ruleForm.validateField(key);
    },
    validate() {
      return new Promise((resolve) => {
        this.$refs.ruleForm.validate((res, obj) => {
          resolve([res, obj]);
        });
      });
    },
    fillFileContent(e) {
      this.$emit('fillFileContent', e);
    },
    async submitAll() {
      if (this.$refs.UploadItem && this.$refs.UploadItem.length > 0) {
        let uploadErr = false;
        const result = await Promise.all(this.$refs.UploadItem.map(it => it.submit())).catch(() => {
          uploadErr = true;
        });
        if (uploadErr) return false;
        const t = result.find(it => !it);
        if (t) return false;
        return result;
      }
      return [];
    },
    getFileCount() {
      if (this.$refs.UploadItem && this.$refs.UploadItem.length > 0) {
        const nums = this.$refs.UploadItem.map(it => it.fileList.length);
        return nums.reduce((a, b) => a + b, 0);
      }
      return 0;
    },
    clearAllFile() {
      if (this.$refs.UploadItem && this.$refs.UploadItem.length > 0) {
        this.$refs.UploadItem.forEach(it => {
          it.clearFiles();
        });
      }
    },
    getAllFileList() {
      if (!this.$refs.UploadItem) return [];
      const list = this.$refs.UploadItem.map(it => it.getSelectedFileList());
      return list;
    },
  },
  watch: {
    FileList() {
      this.$nextTick(() => {
        // this.validate();
        this.$refs.ruleForm.clearValidate();
      });
    },
  },
};
</script>
<style lang='scss'>
</style>
