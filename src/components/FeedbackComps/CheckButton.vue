<template>
  <ul class="check-button">
    <li v-for="(item, index) in checkList"  :key="index">
      <div
      :class="isAction(ValueKey?item[ValueKey]:index)?'action':''"
      @click="onChange(ValueKey?item[ValueKey]:index)">{{item[LabelKey]}}</div>
      <i class="iconfont icon-zhushi" @click="DialogClick(item.Describe)"></i>
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    checkList: { // 选项数据
      type: Array,
      default: () => [],
    },
    ActiveList: {
      type: Array,
      default: () => [],
    },
    ValueKey: { // 返回的列表中数据对应key的值 默认是索引
      type: String,
    },
    LabelKey: {
      type: String,
    },
  },
  data() {
    return {
      checkKey: this.ActiveList,
    };
  },
  computed: {
    isAction() {
      return (key) => this.checkKey.findIndex((it) => it === key) + 1;
    },
  },
  methods: {
    onChange(key) {
      if (this.checkKey.findIndex((it) => it === key) === -1) {
        this.checkKey.push(key);
      } else {
        this.checkKey.splice(this.checkKey.findIndex((it) => it === key), 1);
      }
      this.$emit('CheckChange', this.checkKey);
    },
    clearCheck() {
      this.checkKey = [];
    },
    DialogClick(Describe) {
      this.$emit('DialogClick', Describe);
    },
  },
  watch: {
    ActiveList(newVal) {
      this.checkKey = newVal;
    },
  },
};
</script>
<style lang="scss">
  .check-button{
    >li>div,>li>i:hover{
      cursor:pointer
    }
  }
</style>
