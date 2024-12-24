<template>
  <div class="mp-pc-sys-order-list-page-order-detail-page-wrap-file-preview-comp-img-box">
    <el-image
      style="width: 100%; height: 100%"
      :src="src"
      lazy
      ref="imgRef"
      :preview-src-list="item.success ? previewSrcList : undefined"
      :fit="item.success ? 'contain' : 'cover'"
      :class="item.success ? 'border' : ''"
      />
    <div class="mask" v-if="item.success" @click="onclick">
      <span><i class="icon-fangdajing iconfont"></i>查看大图</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    src: {
      type: String,
      required: true,
    },
    previewSrcList: {
      type: Array,
      required: true,
    },
  },
  methods: {
    onclick() {
      if (this.$refs.imgRef && this.$refs.imgRef.$el) {
        const img = this.$refs.imgRef.$el.querySelector('img');
        if (img) img.click();
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-pc-sys-order-list-page-order-detail-page-wrap-file-preview-comp-img-box {
  display: inline-block;
  vertical-align: top;
  border-radius: 4px;
  text-align: center;

  .el-image.border img.el-image__inner {
    width: unset;
    height: unset;
    max-width: 100%;
    max-height: 100%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid #eee;
    box-sizing: border-box;
  }

  position: relative;
  .mask {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    user-select: none;
    opacity: 0;
    transition: opacity 0.1s ease-in-out;
    user-select: none;
    cursor: pointer;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient( 180deg, rgba(255,255,255,0) 0%, #010917 73%, #000000 100%);
      background: linear-gradient( 180deg, rgba(255,255,255,0) 0%, rgba(1,9,23,0.6) 70%, #000000 100%);
      opacity: 0.4;
    }

    > span {
      position: absolute;
      width: 74px;
      height: 28px;
      color: #fff;
      left: calc(50% - 37px);
      top: calc(50% - 14px);
      box-sizing: border-box;
      line-height: 26px;
      text-align: center;
      border: 1px solid #fff;
      font-size: 12px;
      border-radius: 4px 4px 4px 4px;
      background-color: rgba($color: #000000, $alpha: 0.5);

      i {
        font-size: 12px;
        margin-right: 4px;
      }
    }
  }

  &:hover .mask {
    opacity: 1;
  }
}
</style>
