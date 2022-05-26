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
      default: () => ([]),
    },
  },
  data() {
    return {
      widthObj: {
        w1: 80,
        w2: 100,
        w3: 70,
        w4: 70,
        w5: 70,
        w6: 70,
        w7: 110,
        w8: 55,
        w9: 75,
        w10: 65,
        w11: 65,
        w12: 65,
        w13: 55,
        w14: 110,
        w15: 138,
      },
      titleList: [
        '订单号',
        '产品名称',
        '尺寸',
        '物料',
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
  box-sizing: border-box;
  padding-bottom: 15px;
  border: 1px solid #eee;
  position: relative;
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
