<script>
export default {
  functional: true,
  render(h, context) {
    const { slots, props } = context;

    return (
      <transition-group name='mp-group-collapse-for-shop' class={props.className} tag={props.tag} >
        {slots().default}
      </transition-group>
    );
  },
};
</script>

<style lang="scss">
.mp-group-collapse-for-shop-enter,
.mp-group-collapse-for-shop-leave-to {
  opacity: 0 !important;
  height: 0 !important;
}

.mp-group-collapse-for-shop-enter-active,
.mp-group-collapse-for-shop-leave-active {
  transition: all .12s;
}

.mp-group-collapse-for-shop-enter-to,
.mp-group-collapse-for-shop-leave {
  opacity: 1 !important;
  height: 70px !important;
}

</style>
