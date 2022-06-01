<template>
  <RetractableDisplayComp
    class="mp-pc-order-list-page-table-comp-wrap"
    :isScrollStyle="false"
    :widthObj="widthObj"
    :onWidthChange="onWidthChange"
    :titleList="titleList"
    :isSingleLast="fixedRight"
    :isSingleFirst="fixedLeft"
    :class="{
      fixedLeft: fixedLeft,
      fixedRight: fixedRight,
      normal: !fixedLeft && !fixedRight,
    }"
  >
    <template v-if="orderData && orderData.length > 0">
      <ul>
        <li
          v-for="(data, i) in orderData"
          :key="data.ID + '' + i"
          :class="{ [data.ID]: 1, 'hide-border': i === orderData.length - 1 }"
        >
          <ItemListComp
            :data="data"
            :widthObj="widthObj"
            :fixedLeft="fixedLeft"
            :fixedRight="fixedRight"
            :curHoverOrderID="curHoverOrderID"
            @detail="onDetailClick"
            @itemHover="handleItemHover"
            @itemHoverLeave="handleItemHoverLeave"
          />
        </li>
      </ul>
    </template>
    <div class="no-data-show is-gray" v-else-if="!fixedLeft && !fixedRight">
      暂无数据
    </div>
  </RetractableDisplayComp>
</template>

<script>
import RetractableDisplayComp from '@/packages/RetractableDisplayComp';
import ItemListComp from './OrderListItemComp.vue';

export default {
  components: {
    ItemListComp,
    RetractableDisplayComp,
  },
  props: {
    orderData: {
      type: Array,
      default: () => [],
    },
    fixedLeft: {
      type: Boolean,
      default: false,
    },
    fixedRight: {
      type: Boolean,
      default: false,
    },
    widthObj: {
      type: Object,
      default: () => ({}),
    },
    curHoverOrderID: {
      type: Number,
      default: null,
    },
    titleList: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    itemWidthObj() {
      const { w7 } = this.widthObj;
      const w72 = w7 + 6;
      return { ...this.widthObj, w7: w72 };
    },
  },
  methods: {
    onWidthChange(newW, w) {
      this.$emit('changeWidth', [newW, w]);
    },
    onDetailClick(id) {
      this.$emit('detail', id);
    },
    handleItemHover(OrderID) {
      this.$emit('itemHover', OrderID);
    },
    handleItemHoverLeave(OrderID) {
      this.$emit('itemHoverLeave', OrderID);
    },
  },
};
</script>

<style lang='scss'>
.mp-pc-order-list-page-table-comp-wrap {
  height: 100%;
  box-sizing: border-box;
  padding-bottom: 15px;
  border: 1px solid #eee;
  // position: relative;
  // display: inline-block;
  // max-width: calc(100% - 100px);
  // min-width: 1200px;
  // max-width: 1200px;
  > header {
    height: 40px;
    background-color: rgb(248, 248, 248);
    box-sizing: border-box;
    border-top: none;
    > div {
      line-height: 38px;
      height: 100%;
      background-color: rgb(248, 248, 248);
    }
  }
  .no-data-show {
    font-size: 12px;
    text-align: center;
    display: block;
    position: absolute;
    left: calc(50% - 24px);
    top: calc(50% - 9px);
  }
  > main {
    min-height: calc(100vh - 135px - 175px - 205px);
    overflow-x: hidden;
    border-top: 1px solid #eee;
    > div {
      margin-bottom: 0;
    }
    .hide-border {
      .hide-border-item {
        border-bottom: none;
      }
    }
  }
}
</style>
