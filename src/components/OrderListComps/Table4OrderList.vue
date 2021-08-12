<template>
  <RetractableDisplayComp
    class="mp-pc-order-list-page-table-comp-wrap"
    :isScrollStyle="false"
    :widthObj="widthObj"
    :onWidthChange="onWidthChange"
    :titleList="titleList"
  >
    <template v-if="orderData && orderData.length > 0">
      <ul>
        <li v-for="(data, i) in orderData" :key='"orderlistitem-" + i'
          :class="i === orderData.length - 1 ? 'hide-border' : ''" >
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
import ItemListComp from './OrderListItemComp.vue';

export default {
  components: {
    ItemListComp,
    RetractableDisplayComp,
  },
  props: {
    orderData: {
      type: Array,
      default: () => ([]),
    },
  },
  data() {
    return {
      widthObj: {
        w1: 80,
        w2: 80,
        w3: 80,
        w4: 68,
        w5: 67,
        w6: 80,
        w7: 118,
        w8: 55,
        w9: 75,
        w10: 65,
        w11: 65,
        w12: 65,
        w13: 50,
        w14: 110,
        w15: 140,
      },
      titleList: [
        '订单号',
        '电商单号',
        '产品名称',
        '尺寸',
        '工艺',
        '数量',
        '文件内容',
        '优惠券',
        '成交价',
        '已付',
        '未付',
        '退款',
        '状态',
        '付款时间',
        '操作',
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
.mp-pc-order-list-page-table-comp-wrap {
  height: 100%;
  // padding-top: 8px;
  box-sizing: border-box;
  // min-height: 360px;
  padding-bottom: 15px;
  border: 1px solid #eee;
  position: relative;
  > header {
    height: 40px;
    // border: 1px solid #eee;
    // border-bottom: 1px solid #eee;
    background-color: rgb(248, 248, 248);
    box-sizing: border-box;
    // border-bottom: none;
    border-top: none;
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
    font-size: 12px;
    text-align: center;
    display: block;
    position: absolute;
    left: calc(50% - 24px);
    top: calc(50% - 9px);
  }
  > main {
    min-height: calc(100vh - 135px - 175px - 205px);
    // border-left: 1px solid #eee;
    // border-right: 1px solid #eee;
    overflow-x: hidden;
    // border-bottom: 1px solid #eee;
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
