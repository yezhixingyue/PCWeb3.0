<template>
  <span
    class="mp-show-product-btn-wrap van-ellipsis"
    :class="{ active: isActive, disabled: disabled }"
    :title="tips"
  >
    {{ title }}
  </span>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    tips: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss">
.mp-show-product-btn-wrap {
  // min-width: calc(24vw - 14px);
  height: 28px;
  border-radius: 5px;
  border: 1px solid #dbdee3;
  display: inline-block;
  // box-sizing: border-box;
  text-align: center;
  line-height: 31px;
  padding: 0 7px;
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s;
  // color: $--color-text-primary;
  user-select: none;
  &:hover {
    // color: $--color-blue;
    background-color: #ebf7ff;
    border-color: #aaa;
  }
  &.disabled {
    // color: $--color-text-light;
    background-color: #f5f5f5;
    // pointer-events: none;
    cursor: not-allowed;
    color: #cbcbcb !important;
    border-color: #dbdee3 !important;
  }
  &.active {
    border-color: #428dfa;
    color: #428dfa;
  }
  &:active {
    border-color: #428dfa;
    color: #428dfa;
  }
}
// @media screen and (-webkit-min-device-pixel-ratio: 2) {
//   .mp-show-product-btn-wrap {
//     border-width: 0.5px;
//   }
// }
// @media screen and (-webkit-min-device-pixel-ratio: 3) {
//   .mp-show-product-btn-wrap {
//     border-width: 0.333333px;
//   }
// }
</style>
