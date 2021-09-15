<template>
  <el-form ref="ruleForm" label-width="0" :model="{}">
    <UploadItem
      v-for="it in FileList"
      :key="it.key"
      v-show="it.display"
      :required="it.IsRequired"
      :FileInfo="it.File"
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
  },
};
</script>
<style lang='scss'>
</style>
