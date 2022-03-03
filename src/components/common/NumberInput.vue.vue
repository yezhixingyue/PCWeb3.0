<template>
  <div class="mp-pc-common-comps-number-input-comp-wrap">
    <span class="l" @click="onDecreaseClick" :class="{'is-disabled': (value || value === 0) && typeof max === 'number' && value <= min}">-</span>
    <el-input v-model.number="localValue" :placeholder="placeholder" size="small"></el-input>
    <span class="r" @click="onIncreaseClick" :class="{'is-disabled': (value || value === 0) && typeof max === 'number' && value >= max}">+</span>
  </div>
</template>

<script>
// 不能为负
export default {
  props: {
    placeholder: {
      type: String,
      default: '',
    },
    value: {
      default: '', // Number || String
    },
    min: {
      type: Number,
      default: 0, // 如果设置应不小于0 -- 最大最小值只用于左右两侧的按钮点击状态 本身的值仍需进行校验 （blur方法校验？）
    },
    max: {
      type: Number, // 应大于0
      default: Infinity,
    },
  },
  computed: {
    localValue: {
      get() {
        return this.value;
      },
      set(val) {
        const _val = `${val}`.replaceAll(/\D/g, '');
        this.$emit('input', _val);
      },
    },
  },
  methods: {
    onDecreaseClick() { // 减
      let _val = !this.value ? this.min : +this.localValue - 1;
      if (_val > this.max) _val = this.max;
      if (_val < this.min) _val = this.min;
      if (!(typeof this.min === 'number' && _val < this.min)) {
        this.localValue = _val;
      }
    },
    onIncreaseClick() { // 加
      let _val = !this.value ? this.min || this.min + 1 : +this.localValue + 1;
      if (_val < this.min) _val = this.min;
      if (_val > this.max) _val = this.max;
      if (!(typeof this.max === 'number' && _val > this.max)) {
        this.localValue = _val;
      }
    },
  },
  mounted() {
    if (this.min < 0) {
      console.error('注意: min不能小于0');
    }
    if (this.min > this.max) {
      console.error('注意： min应小于max');
    }
  },
};
</script>
<style lang='scss'>
.mp-pc-common-comps-number-input-comp-wrap {
  display: inline-block;
  width: 100%;
  > span {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 1px solid #e5e5e5;
    text-align: center;
    line-height: 18px;
    user-select: none;
    border-radius: 5px;
    box-sizing: border-box;
    color: #aaa;
    cursor: pointer;
    transition: 0.15s;
    &:hover {
      background-color: #f5f5f5;
    }
    &:active {
      background-color: #eee;
      color: #555;
    }
    &.l {
      margin-right: 10px;
    }
    &.r {
      margin-left: 10px;
    }
    &.is-disabled {
      cursor: not-allowed;
      background-color: #f6f6f6;
      color: #cbcbcb;
    }
  }
  > div.el-input {
    width: calc(100% - 60px);
    > input {
      border-radius: 5px;
      text-align: center;
    }
  }
}
</style>
