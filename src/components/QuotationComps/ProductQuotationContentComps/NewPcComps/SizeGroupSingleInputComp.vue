<template>
  <li class="mp-pc-size-group-single-size-comp-wrap">
    <el-input v-model="inpVal" ref="oInp" class="size-box" @focus.stop="onFocus" @blur="onBlur" />
    <span class="gray" @click="onPlaceholderClick"
     :class="inpVal || inpVal === 0 || isFocue ? 'h' : ''">{{sizeData.PropertyName}}</span>
  </li>
</template>

<script>
// import BaseNumInput from '@/components/QuotationComps/SMComps/BaseNumInput.vue';
// import { Toast } from 'vant';

export default {
  props: {
    sizeData: {
      type: Object,
      default: () => ({}),
    },
    maxLen: {
      type: Number,
      default: Infinity,
    },
    index: {
      type: Number,
    },
    value: {},
    sizeInputValueList: {},
  },
  components: {
    // BaseNumInput,
  },
  data() {
    return {
      newVal: '',
      isChanged: false,
      isFocue: false,
    };
  },
  computed: {
    inpVal: {
      get() {
        if (!this.newVal && !this.isChanged) {
          if (
            this.sizeInputValueList.length === 0
            || !this.sizeInputValueList[this.index]
          ) {
            return '';
          }
          return this.sizeInputValueList[this.index].CustomerInputValue;
        }
        return this.newVal;
      },
      set(newVal) {
        // if (newVal.includes('.')) {
        //   this.$refs.oInp.$el.children[0].blur();
        //   this.messageBox.failSingleError({ title: '参数设置不正确', msg: '尺寸必须为整数' });
        //   return;
        // }
        const _v = newVal.replace(/[^\d]/g, '');
        // eslint-disable-next-line radix
        const _str = _v ? parseInt(_v) : _v;
        const _obj = {
          PropertyID: this.sizeData.PropertyID,
          CustomerInputValue: _str,
        };
        this.newVal = _str;
        this.$emit('change', [_obj, this.index]);
        this.isChanged = true;
      },
    },
  },
  methods: {
    onFocus(e) {
      e.target.select();
      this.isFocue = true;
    },
    onBlur() {
      this.isFocue = false;
    },
    onPlaceholderClick() {
      this.$refs.oInp.focus();
    },
  },
};
</script>

<style lang='scss'>
.mp-pc-size-group-single-size-comp-wrap {
  position: relative;
  > span {
    position: absolute;
    white-space: nowrap;
    left: 10px;
    bottom: 10px;
    transition: 0.3s;
    &.h {
      bottom: 30px;
      // transform: scale(0.9);
      font-size: 12px;
    }
  }
}
</style>
