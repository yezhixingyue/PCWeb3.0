<template>
  <div :style="widthStyle" class="mp-table-drag-cell"
    @mousedown="onMousedown"
    :class="{isCheck: isCheck}"
    ref="moveDiv"
  >
    <el-checkbox v-model="checked" v-if="isCheck" :indeterminate="indeterminate" :disabled='checkDisabled'>{{title}}</el-checkbox>
    <template v-else>{{title}}</template>
  </div>
</template>

<script>
import { throttle } from '../../utils';

export default {
  props: {
    /**
     * 传入的宽度值，指定当前元素的宽度
     */
    width: {
      type: Number,
      default: 0,
    },
    /**
     * 传入的方法，当宽度发生变化时执行该方法
     */
    onWidthChange: {
      type: Function,
      default: null,
    },
    /**
     * 传入的标题
     */
    title: {
      type: String,
      default: '',
    },
    indeterminate: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Boolean,
      default: false,
    },
    isCheck: {
      type: Boolean,
      default: false,
    },
    checkDisabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    widthStyle() {
      return `width: ${this.width}px`;
    },
    checked: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
  data() {
    return {
      flags: false,
      oDIv: undefined,
      oldX: 0,
      oldWidth: 0,
      distence: 0,
    };
  },
  methods: {
    onMousedown(event) {
      if (this.flags) return;
      if (!this.oDIv && !this.$refs.moveDiv) return;
      this.oDIv = this.$refs.moveDiv;
      if (event.offsetX > this.oDIv.offsetWidth - 15) {
        this.flags = true;
        this.oDIv.oldX = event.clientX;
        this.oDIv.oldWidth = this.oDIv.offsetWidth;
        this.oldX = event.clientX;
        this.oldWidth = this.oDIv.offsetWidth;
        this.oDIv.style.cursor = 'col-resize';
      }
    },
    onMousemove(event) {
      if (!this.oDIv && !this.$refs.moveDiv) return;
      if (this.oDIv === undefined) this.oDIv = this.$refs.moveDiv;
      if (event.offsetX > this.oDIv.offsetWidth - 15) this.oDIv.style.cursor = 'col-resize';
      else this.oDIv.style.cursor = 'default';
      if (!this.flags) return;
      this.oDIv.style.cursor = 'default';
      if (this.oDIv.oldWidth + (event.clientX - this.oDIv.oldX) > 30) {
        this.distence = event.clientX - this.oDIv.oldX;
        this.oLine.style.display = 'flex';
        this.oLine.style.left = `${event.clientX}px`;
        this.oLine.style.top = `${this.oDIv.getBoundingClientRect().top}px`;
        if (event.target.offsetParent) {
          this.oLine.style.height = `${event.target.offsetParent.offsetHeight}px`;
        }
      }
      this.oDIv.style.cursor = 'col-resize';
    },
    onMouseup() {
      if (!this.oDIv && !this.$refs.moveDiv) return;
      if (this.oDIv === undefined) this.oDIv = this.$refs.moveDiv;
      if (this.flags) {
        this.flags = false;
        this.oDIv.style.cursor = 'default';
        this.oLine.style.display = 'none';
        this.oDIv.width = this.oDIv.oldWidth + this.distence;
        if (this.onWidthChange) this.onWidthChange(this.oDIv.width);
      }
    },
  },
  mounted() {
    this._tempFunc = e => throttle(this.onMousemove(e), 30);
    document.addEventListener('mousemove', this._tempFunc);
    document.addEventListener('mouseup', this.onMouseup);
    this.oLine = document.querySelector('.my-define-table-line');
  },
  beforeDestroy() {
    document.removeEventListener('mousemove', this._tempFunc);
    document.removeEventListener('mouseup', this.onMouseup);
  },
};
</script>

<style lang='scss'>
.mp-table-drag-cell {
  height: 30px;
  background-color: #f8f8f8;
  color: #39588a;
  line-height: 30px;
  font-size: 14px;
  text-align: center;
  position: relative;
  user-select: none;
  white-space: nowrap;
  overflow: hidden;
  padding-right: 6px;
  box-sizing: border-box;
  display: inline-block\0;
  white-space: \0;
  &::after {
    content: '';
    width: 1px;
    height: 12px;
    background-color: rgb(230, 230, 230);
    position: absolute;
    right: 6px;
    top: 50%;
    transform: translateY(-50%);
  }
  .el-checkbox {
    padding-left: 4px;
  }
  .el-checkbox__label {
    padding-left: 6px;
    color: #39588a;
  }
}
</style>
