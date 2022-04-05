<template>
  <div class="mp-retractable-display-comp-wrap" :class="isScrollStyle? 'mp-scroll-wrap': '' ">
    <header> <!-- 顶部标题列表 -->
      <Header
        v-for="(item,i) in titleList" :key="item + '-' + i"
        :onWidthChange='(newWidth) => onWidthChange(newWidth, widthKeyList[i])'
        :width='widthValueList[i]' :title="item"
        :isCheck='i === 0 && isCheck ? true : false'
        v-model="checked"
        :checkDisabled='checkDisabled'
        :indeterminate='indeterminate'
       />
    </header>
    <main :class="isScrollStyle? 'mp-scroll-wrap': '' " :style="minWidth">
      <slot></slot>  <!-- 主体内容显示区，插槽，使用时由外部传入 -->
    </main>
    <footer class="my-define-table-line"></footer>
  </div>
</template>

<script>
import Header from './Header.vue';

export default {
  name: 'RetractableDisplayComp',
  components: {
    Header,
  },
  props: { // 主体的宽高 及内容区的宽高 由外部来控制
    /**
     * 需要传入标题列表，用于表格头部展示标题信息
     */
    titleList: {
      type: Array,
      default: () => [],
    },
    /**
     * 需要传入每个标题元素的初始宽度
     */
    widthObj: {
      type: Object,
      default: () => ({}),
    },
    /**
     * 需要传入宽度变化后的处理函数
     */
    onWidthChange: {
      type: Function,
      default: null,
    },
    /**
     * 是否修改滚动条样式
     */
    isScrollStyle: {
      type: Boolean,
      default: true,
    },
    isCheck: {
      type: Boolean,
      default: false,
    },
    indeterminate: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Boolean,
      default: false,
    },
    checkDisabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    minWidth() {
      let num = 0;
      Object.values(this.widthObj).forEach((item) => { num += item; });
      return `minWidth: ${num - 8}px`;
    },
    widthKeyList() {
      if (!this.widthObj) return [];
      return Object.keys(this.widthObj);
    },
    widthValueList() {
      if (!this.widthObj) return [];
      return Object.values(this.widthObj);
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
  mounted() {
    const length1 = this.titleList.length;
    const length2 = Object.keys(this.widthObj).length;
    if (length1 !== length2) {
      throw new Error("the length of titleList is not equal to the count of widthObj's props");
    }
  },
};
</script>

<style lang='scss'>
.mp-retractable-display-comp-wrap {
  overflow-x: auto;
  overflow-y: hidden;
  position: relative;
  // overflow:overlay;
  > header {
    background-color: #f8f8f8;
    display: flex;
    white-space: nowrap;
    > div {
      flex: none;
    }
  }
  > main {
    overflow-y: auto;
    overflow:overlay;
    overflow-x: hidden;
  }
  > footer.my-define-table-line {
    // height: 120px;
    width: 1px;
    position: fixed;
    // background-color: #e6e6e6;
    border-left: 1px dashed #ddd;
    left: 100px;
    top: 200px;
    // bottom: 0;
    display: none;
  }
}

</style>
