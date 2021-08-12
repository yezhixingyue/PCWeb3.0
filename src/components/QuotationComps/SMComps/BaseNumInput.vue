<!--
 * @Describe: 数字类型Input框  报价模块使用
 * @FilePath: /src/components/QuotationComps/SMComps/BaseNumInput.vue
-->

<template>
  <div class="mp-duotation-sm-comps-num-input-wrap">
    <input
      class="is-focus-blue"
      :type="type"
      v-model.trim="inpVal"
      :disabled="disabled"
      @focus="onFocus"
      :placeholder="placeholder"
    />
    <!-- <span class="is-red" v-show="!errorInfo">{{ errorInfo }}</span> -->
  </div>
</template>

<script>
export default {
  props: {
    value: {},
    disabled: {
      type: Boolean,
      default: false,
    },
    errorInfo: {
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'number',
    },
  },
  computed: {
    inpVal: {
      get() {
        return this.value;
      },
      set(newVal) {
        // console.log('mount init num-input-wrap----!');
        this.$emit('input', newVal);
      },
    },
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    onFocus(e) {
      // // console.log(e, e.currentTarget);
      // e.currentTarget.select();
      e.currentTarget.select();
      // return false;
    },
  },
};
</script>

<style lang="scss">
// @import "@/assets/css/Common/var.scss";
.mp-duotation-sm-comps-num-input-wrap {
  > input {
    outline: none;
    // border: 1px solid $--border-color-2;
    display: inline-block;
    width: 100%;
    height: 30px;
    border-radius: 5px;
    padding: 0 8px;
    box-sizing: border-box;
    // user-select: none;
    &::placeholder {
      font-size: 13px;
    }
    &:disabled {
      background-color: rgb(245, 247, 250);
      opacity: 0.5;
    }
  }
  > span {
    font-size: 12px;
  }
  display: inline-block;
  width: 100%;
  position: relative;
}
</style>
