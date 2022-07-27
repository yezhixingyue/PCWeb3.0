<template>
  <el-scrollbar ref="oWrap">
    <ul>
      <li
         v-for="(it, i) in list"
         :key="i"
         @mouseenter="onmouseenter(it)"
         @click="onClick(it)"
         :class="{
          active: activeIds.includes(it[defaultProps.ID]) || (activeIds.length===0&&it[defaultProps.ID]===''&&withEmpty),
          selected: selectedIds.includes(it[defaultProps.ID])||(selectedIds.length===0&&it[defaultProps.ID]===''&&withEmpty)
        }">
        <i class="el-icon-check"
          v-show="(selectedIds.includes(it[defaultProps.ID]) && selectedIds[selectedIds.length - 1] === it[defaultProps.ID])
           || (selectedIds.length === 0 && it[defaultProps.ID] === ''&&withEmpty)"
         ></i>
        <span class="label">{{it[defaultProps.Name]}}</span>
        <i class="el-icon-arrow-right" v-show="it.children && it.children.length > 0"></i>
      </li>
    </ul>
  </el-scrollbar>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    activeIds: {
      type: Array,
      default: () => [],
    },
    selectedIds: {
      type: Array,
      default: () => [],
    },
    withEmpty: {
      type: Boolean,
      default: false,
    },
    defaultProps: {
      type: Object,
      default: null,
      required: true,
    },
  },
  methods: {
    onmouseenter(it) {
      this.$emit('hoverItem', it);
    },
    onClick(it) {
      this.$emit('itemClick', it);
    },
  },
  mounted() {
    // 创建的时候 根据selected的状态 设置滚动条的高度 -- 让其显示在视野的范围内
    if (!this.$refs.oWrap) return;
    const scrollWrap = this.$refs.oWrap.$el.querySelector('.el-scrollbar__wrap');
    const selected = this.$refs.oWrap.$el.querySelector('ul > li.selected');
    if (!scrollWrap || !selected) return;
    const wrapOffsetHeight = this.$refs.oWrap.$el.offsetHeight;
    const selectedOffsetTop = selected.offsetTop;
    const selectedoffsetHeight = selected.offsetHeight;
    const dis = selectedOffsetTop + selectedoffsetHeight - wrapOffsetHeight;
    if (dis <= 0) return;
    scrollWrap.scrollTop = dis;
  },
};
</script>
<style lang='scss'>
</style>
