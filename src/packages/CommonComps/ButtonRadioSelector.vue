<template>
  <div class="mp-common-comps-button-radio-selector-comp-wrap" :class="{[shape]: shape}">
    <span
      v-for="it in list"
      :key="it.ID"
      :class="{active: it.ID === value}"
      @click="onClick(it)"
     >
      {{it.Name}}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    value: {

    },
    list: {
      type: Array,
      default: () => [],
    },
    shape: {
      type: String,
      default: 'circle', // circle | square
    },
  },
  methods: {
    onClick(it) {
      this.$emit('input', it.ID);
    },
  },
};
</script>
<style lang='scss'>
.mp-common-comps-button-radio-selector-comp-wrap {
  > span {
    display: inline-block;
    height: 30px;
    box-sizing: border-box;
    border: 1px solid #428dfa;
    // color: #999;
    color: #428dfa;
    transition: 0.13s ease-in-out;
    padding: 0 16px;
    line-height: 28px;
    border-radius: 15px;
    cursor: pointer;
    min-width: 120px;
    text-align: center;
    & + span {
      margin-left: 30px;
    }
    &:hover {
      background: lighten(#428dfa, 32);
    }
    &.active {
      color: #fff;
      background-color: #428dfa;
    }
  }
  &.square {
    > span {
      border-radius: 5px;
    }
  }
}
</style>
