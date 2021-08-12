<template>
  <el-select
   v-model="value"
   class="mp-pc-common-select-comp-wrap"
   :class="mini?'font-12':''"
   :filterable='filterable'
   >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item[defaultProps.label]"
      :value="item[defaultProps.value]">
    </el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    title: {
      default: '不限',
    },
    options: {
      type: Array,
      default: () => [{
        value: '',
        label: '不限',
      }],
    },
    defaultProps: {
      type: Object,
      default: () => ({
        label: 'label',
        value: 'value',
      }),
    },
    mini: {
      type: Boolean,
      default: false,
    },
    filterable: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    value: {
      get() {
        return this.title;
      },
      set(newVal) {
        // // console.log(newVal, this.title);
        if (newVal === this.title) return;
        this.$emit('handleChange', newVal);
      },
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-pc-common-select-comp-wrap {
  height: 25px;

  .el-input {
    > input {
      // border: none;
      // border-bottom: 1px solid gainsboro;
      height: 30px;
      width: 120px;
      margin-top: -1px;
      font-size: 13px;
      color: #585858;
      &::-webkit-input-placeholder {
        color: rgba($color: $--color-text-primary-light, $alpha: 0.5);
      }
      padding: 0 22px 0 13px;
      line-height: 25px;
    }
    &::after {
        content: "";
        position: absolute;
        // background: url('../../assets/images/arrowbottom.png') no-repeat center;
        background-size: 100% 100%;
        height: 9px;
        width: 11px;
        right: 5px;
        top: 5px;
    }
    // > .el-input__suffix {
    //     display: none;
    // }
  }
  &.font-12 {
    .el-input > input {
      font-size: 12px;
    }
  }
}
</style>
