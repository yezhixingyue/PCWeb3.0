<!--
 * @Describe: 测试折叠面板组件
 * @FilePath: /src/components/QuotationComps/SMComps/MpCollapseComp.vue
-->
<template>
  <section class="mp-phone-collapse-common-comp-wrap">
    <slot name="header"></slot>
    <transition @enter="enter" @leave="leave" @before-enter="beforeEnter">
      <slot></slot>
    </transition>
    <slot name="will-not-collapse"></slot>
  </section>
</template>

<script>
/* eslint-disable no-param-reassign */
import Velocity from 'velocity-animate';

export default {
  props: {
    h: {
      type: Number,
      default: null,
    },
    duration: {
      type: Number,
      default: 300,
    },
  },
  data() {
    return {
      height: 0,
    };
  },
  methods: {
    beforeEnter(el) {
      el.style.opacity = 0;
      el.style.height = 0;
    },
    enter(el, done) {
      Velocity(
        el,
        { opacity: 1, height: this.h ? this.h : this.height },
        {
          duration: this.duration,
          complete: () => {
            el.style.height = null;
            done();
          },
        },
      );
    },
    leave(el, done) {
      this.height = el.offsetHeight;
      Velocity(
        el,
        { opacity: 0, height: '0px' },
        {
          duration: this.duration,
          complete: done,
        },
      );
    },
  },
};
</script>

<style lang="scss">
.mp-phone-collapse-common-comp-wrap {
  transition: none;
  > .comp-content-wrap {
    transition: none;
  }
}
</style>
