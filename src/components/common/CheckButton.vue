<template>
  <ul class="check-button">
    <li v-for="(item, index) in checkList"
    :key="index"
    :class="isAction(ValueKey?item[ValueKey]:index)?'action':''"
    @click="onChange(ValueKey?item[ValueKey]:index)">{{item[LabelKey]}}</li>
  </ul>
</template>
<script>
export default {
  props: {
    checkList: { // 选项数据
      type: Array,
      default: () => [{ a: 'a', b: 'b' }, { a: 'c', b: 'd' }],
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
      checkKey: [],
    };
  },
  computed: {
    isAction() {
      return (key) => this.checkKey.findIndex((it) => it === key) + 1;
    },
  },
  methods: {
    onChange(key) {
      console.log(this.checkList);
      if (this.checkKey.findIndex((it) => it === key) === -1) {
        this.checkKey.push(key);
      } else {
        this.checkKey.splice(this.checkKey.findIndex((it) => it === key), 1);
      }
      this.$emit('CheckChange', this.checkKey);
    },
  },
};
</script>
<style lang="scss">
  .check-button{
    >li:hover{
      cursor:pointer
    }
  }
</style>
