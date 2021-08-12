<script>
export default {
  functional: true,
  render(h, context) {
    const { slots, props } = context;

    return (
      <transition-group name='mp-group-collapse' class={props.className} tag={props.tag} >
        {slots().default}
      </transition-group>
    );
  },
};
</script>

<style lang="scss">
.mp-group-collapse-enter,
.mp-group-collapse-leave-to {
  opacity: 0 !important;
  height: 0 !important;
}

.mp-group-collapse-enter-active,
.mp-group-collapse-leave-active {
  transition: all .3s;
}

.mp-group-collapse-enter-to,
.mp-group-collapse-leave {
  opacity: 1 !important;
  height: 44px !important;
}

</style>
