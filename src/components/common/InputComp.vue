<template>
  <div class="mp-pc-common-comps-input-common-comp-wrap">
    <span> <i v-if="required" class="is-pink">*</i> {{title}}：</span>
    <el-input :disabled='disabled' v-model.trim="inpVal" :placeholder="placeholder"></el-input>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    title: {
      type: String,
      default: '企业简称',
    },
    value: {},
    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {},
  },
  computed: {
    inpVal: {
      get() {
        return this.value;
      },
      set(newVal) {
        this.$emit('change', newVal);
      },
    },
  },
};
</script>

<style lang='scss'>
.mp-pc-common-comps-input-common-comp-wrap {
  display: inline-block;
  > span {
    display: block;
    line-height: 44px;
    color: #888;
  }
  > div {
    width: 240px;
    height: 30px;
    > input {
      height: 30px;
      line-height: 26px\0;
      &::placeholder {
        color: #cbcbcb;
      }
    }
  }
}
</style>
