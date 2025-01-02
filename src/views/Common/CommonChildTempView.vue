<template>
  <section class="mp-pc-sys-common-child-temp-page-wrap">
    <div ref="oGuard"></div>
    <hr class="line" :class="showShadow ? 'shadow' : ''">
    <main class="content">
      <slot></slot>
    </main>

    <footer>
      <BlueInfoFooter  />
    </footer>
  </section>
</template>

<script>
import BlueInfoFooter from '@/components/common/BlueInfoFooter.vue';

export default {
  components: {
    BlueInfoFooter,
  },
  data() {
    return {
      intersectionObserver: null,
      showShadow: true,
    };
  },
  methods: {
    useIntersectionObserver() {
      const options = {
        threshold: 1,
      };

      this.intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.target === this.$refs.oGuard) {
            this.showShadow = !entry.isIntersecting;
          }
        });
      }, options);

      this.intersectionObserver.observe(this.$refs.oGuard);
    },
  },
  mounted() {
    this.useIntersectionObserver();
  },
  beforeDestroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  },
};
</script>
<style lang='scss'>
.mp-pc-sys-common-child-temp-page-wrap {
  position: fixed;
  left: 0;
  right: 0;
  top: 124px;
  bottom: 0;
  z-index: 20;
  margin: 0 !important;
  overflow: auto;
  background-color: #f5f5f5 !important;

  &:has(.el-image-viewer__wrapper) {
    z-index: 10000;
  }

  > hr.line {
    margin: 0;
    border: 0;
    width: 100%;
    top: 0;
    position: sticky;
    height: 1px;
    &.shadow {
      box-shadow: 0 1px 1px rgba(0,0,0,.08), 0 2px 6px 0 rgba(0,0,0,.085);
    }
  }

  > main.content {
    width: 1200px;
    margin: 0 auto;
    margin-top: 1px;
    min-height: calc(100vh - 115px - 22px);
    min-height: calc(100vh - 115px - 42px)\0;
  }
}
</style>
