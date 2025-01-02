<template>
  <div class="mp-common-image-viewer-comp">
    <el-image-viewer
      v-if="showViewer"
      :on-close="onClose"
      :url-list="PreviewSrc"
    />
  </div>
</template>

<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer';

export default {
  components: {
    ElImageViewer,
  },
  props: {
    showViewer: {
      type: Boolean,
      default: false,
    },
    PreviewSrc: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    onClose() {
      this.$emit('update:showViewer', false);
    },
  },
  data() {
    return {
    };
  },
  watch: {
    showViewer(val) {
      if (val) {
        setTimeout(() => {
          const model = document.querySelector('.mp-common-image-viewer-comp .el-image-viewer__mask');
          model.addEventListener('click', this.onClose);
        }, 10);
      }
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-common-image-viewer-comp {
  .el-image-viewer__close{
    color: #fff;
    width: 40px;
    height: 40px;
    font-size: 24px;
    color: #fff;
    background-color: #606266;
    border-radius: 50%;
    opacity: .8;
    i{
      border-radius: 50%;
    }
  }
}
</style>
