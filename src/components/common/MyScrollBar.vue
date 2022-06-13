<template>
  <div class="mp-common-local-scroll-bar-comp-wrap" v-if="el" @click="reset"
   :class="{visible: innerWidth < outWidth}" @dragstart.stop.prevent>
    <i
      class="el-icon-caret-left"
      :class="{active: left > 0}"
      @click="setScrollByDistance(-40)"
      @mousedown="onIconMousedown(-40)"
      @mouseup="onIconMouseLeave"
      @mouseleave="onIconMouseLeave"></i>
    <div ref="oWrap" @click.self.stop="onWrapClick">
      <span :style="`width:${innerWidth}px;left:${left}px`" :class="{active:isMoving}" @mousedown="onMouseDown" @dragstart.prevent></span>
    </div>
    <i
     class="el-icon-caret-right"
     :class="{active: left < outWidth - innerWidth}"
     @click="setScrollByDistance(40)"
     @mousedown="onIconMousedown(40)"
     @mouseup="onIconMouseLeave"
     @mouseleave="onIconMouseLeave"></i>
  </div>
</template>

<script>
export default {
  props: {
    el: {
      type: Element,
      default: null,
    },
  },
  data() {
    return {
      outWidth: 0,
      innerWidth: 0,
      left: 0,
      rate: 1,
      startX: 0,
      maxLeft: 0,
      isMoving: false,
      originScrollWidth: 0,
      originOffsetWidth: 0,
      timer: null,
    };
  },
  methods: {
    reset() {
      if (!this.el || !this.$refs.oWrap) return;
      this.originScrollWidth = this.el.scrollWidth;
      this.originOffsetWidth = this.el.offsetWidth;
      this.rate = this.originOffsetWidth / this.originScrollWidth;
      this.outWidth = this.$refs.oWrap.offsetWidth;
      this.innerWidth = this.outWidth * this.rate;
      this.maxLeft = this.outWidth - this.innerWidth;
      this.setLeftValue(this.el.scrollLeft * this.rate);
      this.el.removeEventListener('scroll', this.handleTargetScroll);
      this.el.addEventListener('scroll', this.handleTargetScroll);
    },
    setLeftValue(val) {
      let temp = val;
      if (temp <= 0) {
        temp = 0;
      }
      if (temp >= this.maxLeft) {
        temp = this.maxLeft;
      }
      this.left = temp;
    },
    onMouseDown(e) {
      this.startX = e.x;
      this.isMoving = true;
      document.body.addEventListener('mousemove', this.onMouseMove);
      document.body.addEventListener('mouseup', this.onMouseUp);
      document.body.style.userSelect = 'none';
    },
    onMouseMove(e) {
      const d = e.x - this.startX;
      this.setLeftValue(this.left + d);
      this.startX = e.x;
      this.el.scrollLeft = (this.left / this.outWidth) * this.originScrollWidth;
    },
    onMouseUp() {
      // 清除事件
      document.body.removeEventListener('mousemove', this.onMouseMove);
      document.body.removeEventListener('mouseup', this.onMouseUp);
      document.body.style.userSelect = 'auto';
      this.isMoving = false;
      this.startX = 0;
    },
    handleTargetScroll(e) {
      this.$emit('scrollToStart', e.target.scrollLeft <= 0);
      this.$emit('scrollToEnd', e.target.scrollLeft + this.originOffsetWidth >= this.originScrollWidth);
      if (this.isMoving) return;
      this.setLeftValue(e.target.scrollLeft * this.rate);
    },
    setScrollByDistance(d, duration = 150) {
      if (this.left + d <= -40 || this.left + d >= this.maxLeft + 40) return;
      this.$utils.animateScroll(this.left, d + this.left, (e) => {
        this.setLeftValue(e);
        this.el.scrollLeft = (this.left / this.outWidth) * this.originScrollWidth;
      }, null, duration);
    },
    onIconMousedown(d) {
      this.timer = setInterval(() => {
        this.setScrollByDistance(d);
      }, 150);
    },
    onIconMouseLeave() {
      clearInterval(this.timer);
      this.timer = null;
    },
    onWrapClick(e) {
      if (!this.innerWidth || !this.outWidth || !e.offsetX) return;
      if (e.offsetX < this.left) {
        // 到起点
        this.setScrollByDistance(-this.left, 100);
      } else if (e.offsetX > this.innerWidth + this.left) {
        // 到终点
        this.setScrollByDistance(this.maxLeft - this.left, 100);
      }
    },
  },
  mounted() {
    this.reset();
  },
  beforeDestroy() {
    document.body.removeEventListener('mousemove', this.onMouseMove);
    document.body.removeEventListener('mouseup', this.onMouseUp);
    this.el.removeEventListener('scroll', this.handleTargetScroll);
    this.onIconMouseLeave();
  },
};
</script>
<style lang='scss'>
.mp-common-local-scroll-bar-comp-wrap {
  width: 100%;
  height: 16px;
  background: #f1f1f1;
  > i {
    display: inline-block;
    width: 18px;
    height: 18px;
    vertical-align: top;
    font-size: 12px;
    line-height: 18px;
    text-align: center;
    color: #a8a8a8;
    margin-top: -1px;
    background: #f1f1f1;
    border-radius: 1px;
    overflow: hidden;
    user-select: none;
    &.active {
      cursor: pointer;
      color: #333;
      transition: 0.05s ease-in-out;
      &:hover {
        background: #ddd;
      }
      &:active {
        color: #fff;
        background: #787878;
      }
    }
  }
  > div {
    width: calc(100% - 36px);
    height: 100%;
    position: relative;
    display: inline-block;
    vertical-align: top;
    > span {
      position: absolute;
      top: 0;
      width: 100px;
      height: 14px;
      background: #c1c1c1;
      transition: background 0.05s ease-in-out;
      &:hover {
        background: #a8a8a8;
      }
      &.active {
        background: #787878;
      }
    }
  }
  visibility: hidden;
  &.visible {
    visibility: visible;
  }
}
</style>
