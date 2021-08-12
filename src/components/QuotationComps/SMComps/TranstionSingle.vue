<!--
 * @Describe: 动画组件
 * @FilePath: /src/components/QuotationComps/SMComps/TranstionSingle.vue
-->
<script>
export default {
  functional: true,
  render(h, context) {
    const { slots, props } = context;

    return (
      <transition name="mp-collapse" class={props.className}>
        {slots().default}
      </transition>
    );
  },
};
</script>

<style lang="scss">
.mp-collapse-enter,
.mp-collapse-leave-to {
  transform: translate(0, -30%) !important;
  height: 0 !important;
  opacity: 0;
}

.mp-collapse-enter-active,
.mp-collapse-leave-active {
  transition: all 0.3s;
  z-index: -99 !important;
}

.mp-collapse-enter-to,
.mp-collapse-leave {
  transform: translate(0, 0) !important;
  height: 100% !important;
  opacity: 1;
}
</style>
