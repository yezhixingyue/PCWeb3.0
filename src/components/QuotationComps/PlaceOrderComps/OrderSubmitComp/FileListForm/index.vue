<template>
  <el-form ref="ruleForm" label-width="0" :model="{}">
    <UploadItem
      v-for="it in FileList"
      :key="it.key"
      v-show="it.display"
      :required="it.IsRequired"
      :maxSize='it.MaxSize'
      :FileInfo="it.File"
      ref="UploadItem"
      @validateField="handleValidateField"
      @fillFileContent='fillFileContent'
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
    submitAll() {
      if (this.$refs.UploadItem.length > 0) {
        this.$refs.UploadItem.map(it => it.submit());
      }
    },
  },
  watch: {
    FileList(newVal, oldVal) {
      console.log(newVal, oldVal);
      this.$nextTick(() => {
        this.validate();
      });
    },
  },
};
</script>
<style lang='scss'>
</style>
