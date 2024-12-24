<template>
  <section class="mp-pc-sys-order-list-page-order-detail-page-wrap-file-preview-comp-pic-section">
    <header>
      <span>{{ title }}</span>
    </header>
    <main>
      <div class="img-list">
        <ImgItemBox v-for="it in fragmentSrcList" :key="it.bigSrc + it.src" :src="it.src" :item="it" :previewSrcList="previewFragmentSrcList" class="img-box" />
      </div>
    </main>
    <footer>
      <span class="blue-span" v-if="list.length > 3" @click="onMoreClick">更多图片>></span>
    </footer>
  </section>
</template>

<script>
import ImgItemBox from './ImgItemBox.vue';

export default {
  components: {
    ImgItemBox,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    list: {
      type: Array,
      default: () => [], // { src: string, bigSrc: string, FilePath: string, success: boolean, }
    },
  },
  computed: {
    fragmentSrcList() {
      return this.list.slice(0, 3);
    },
    previewFragmentSrcList() {
      return this.fragmentSrcList.filter(it => it.success).map(it => it.src);
    },
  },
  methods: {
    onMoreClick() {
      this.$emit('more', this.title.replace('：', ''), this.list);
    },
  },
};
</script>
<style lang='scss'>
.mp-pc-sys-order-list-page-order-detail-page-wrap-file-preview-comp-pic-section {
  > header {
    margin: 10px 0;
    color: #444;
    position: relative;
    user-select: none;

    > span {
      display: inline-block;
      background-color: #fff;
      position: relative;
    }

    &::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      height: 1px;
      top: 50%;
      // background-color: #E8F1FE;
      border-bottom: 1px dashed #E8F1FE;
      box-sizing: border-box;
    }
  }

  > main {
    .img-list {
      height: 98px;

      .img-box {
        width: 138px;
        height: 98px;
        margin-right: 15px;

        &:last-of-type {
          margin-right: 0;
        }
      }
    }
  }

  > footer {
    text-align: right;
    height: 16px;
    padding: 10px 0;
  }
}
</style>
