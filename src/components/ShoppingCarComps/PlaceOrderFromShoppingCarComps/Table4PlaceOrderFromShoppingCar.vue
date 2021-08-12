<template>
  <RetractableDisplayComp
    class="mp-pc-shopping-car-create-order-list-wrap"
    :isScrollStyle="false"
    :widthObj="widthObj"
    :onWidthChange="onWidthChange"
    :titleList="titleList"
  >
    <template v-if="orderData">
      <ul>
        <li v-for="(data, i) in orderData.PackageList" :key="data.ID"
          :class="i === orderData.PackageList.length - 1 ? 'hide-border' : ''" >
          <ItemListComp :data="data" :widthObj="widthObj"
          />
        </li>
      </ul>
    </template>
    <div class="no-data-show is-gray" v-else>暂无数据</div>
  </RetractableDisplayComp>
</template>

<script>
import RetractableDisplayComp from '@/components/common/RetractableDisplayComp/Index.vue';
import ItemListComp from './ItemListComp.vue';

export default {
  components: {
    ItemListComp,
    RetractableDisplayComp,
  },
  props: {
    orderData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      widthObj: {
        w1: 230,
        w2: 100,
        w3: 80,
        w4: 70,
        w5: 80,
        w6: 80,
        w7: 235,
        w8: 322,
      },
      titleList: [
        '产品',
        '数量',
        '原价',
        '优惠券',
        '成交价',
        '定金',
        '工期',
        '文件内容',
      ],
      curSelectedList: [],
      unPayTableData: [],
    };
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
      this.widthObj[w] = newW;
    },
  },
};
</script>

<style lang='scss'>
.mp-pc-shopping-car-create-order-list-wrap {
  height: 100%;
  // padding-top: 8px;
  box-sizing: border-box;
  // min-height: 360px;
  padding-bottom: 15px;
  // border: 1px solid #eee;
  > header {
    height: 40px;
    border: 1px solid #eee;
    // border-bottom: 1px solid #eee;
    background-color: rgb(248, 248, 248);
    box-sizing: border-box;
    border-bottom: none;
    // border-top: none;
    > div {
      line-height: 38px;
      height: 100%;
      background-color: rgb(248, 248, 248);
      // &:first-of-type {
      //   text-align: left;
      //   padding-left: 118px;
      //   box-sizing: border-box;
      // }
      // border-top: 1px solid #eee;
      // border-bottom: 1px solid #eee;
    }
  }
  .no-data-show {
    text-align: center;
    font-size: 13px;
    margin-top: 6vh;
    margin-bottom: 6vh;
  }
  > main {
    height: calc(100% - 36px);
    // border-left: 1px solid #eee;
    // border-right: 1px solid #eee;
    overflow-x: hidden;
    // border-bottom: 1px solid #eee;
    border-top: 1px solid #eee;
    min-height: calc(100vh - 135px - 144px - 346px - 25px);
    margin-bottom: 20px;
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
