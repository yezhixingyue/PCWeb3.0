<template>
  <section class="mp-pc-sys-order-list-page-order-detail-page-wrap-file-preview-comp module">
    <header>
      <img src="../../../../../assets/images/order-detail/preview.png" alt="">
      <span>文件预览</span>
    </header>

    <main v-loading="Thumbnail.loading">
      <p v-if="Thumbnail.placeholder" class="placeholder">{{ Thumbnail.placeholder }}</p>

      <PicSection title="订单原始文件预览：" :list="Thumbnail.beforeList" v-if="Thumbnail.beforeList.length > 0" @more="onMoreClick" />

      <PicSection title="订单审稿后文件预览：" :list="Thumbnail.afterList" v-if="Thumbnail.afterList.length > 0" @more="onMoreClick" />

      <MorePicListDialog v-if="hasMore" :visible.sync="visible" :title="title" :list="list"  />
    </main>
  </section>
</template>

<script>
import PicSection from './PicSection.vue';
import MorePicListDialog from './MorePicListDialog.vue';

export default {
  components: {
    PicSection,
    MorePicListDialog,
  },
  props: {
    Thumbnail: {
      type: Object,
      default: null,
    },
  },
  computed: {
    hasMore() {
      if (this.Thumbnail) {
        const { beforeList, afterList } = this.Thumbnail;

        return beforeList.length > 3 || afterList.length > 3;
      }

      return false;
    },
  },
  data() {
    return {
      title: '',
      list: [],
      visible: false,
    };
  },
  methods: {
    onMoreClick(title, list) {
      this.title = title;
      this.list = list;
      this.visible = true;
    },
  },
};
</script>
<style lang='scss'>
.mp-pc-sys-order-list-page-order-detail-page-wrap-file-preview-comp {
  margin-top: 10px;
  height: 377px;

  // *:not(.el-image-viewer__wrapper i) {
  //   font-size: 12px !important;
  // }
  font-size: 12px;

  > main {
    height: 331px;
    .placeholder {
      line-height: 28px;
      color: #888;
      text-align: center;
      padding-top: 10px;
      font-size: 14px;
      font-weight: bold;
    }
  }
}
</style>
