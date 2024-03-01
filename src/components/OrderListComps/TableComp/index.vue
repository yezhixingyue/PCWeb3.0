<template>
  <div
    class="mp-pc-order-list-table-containner-wrap"
    :class="{ end: isScrollEnd }"
  >
    <Table4OrderList
      :orderData="OrderList"
      :widthObj="widthObj"
      :titleList="titleList"
      :curHoverOrderID="curHoverOrderID"
      @changeWidth="onWidthChange"
      @itemHover="handleItemHover"
      @itemHoverLeave="handleItemHoverLeave"
    />
    <Table4OrderList
      :orderData="OrderList"
      :widthObj="widthObj"
      :titleList="titleList"
      :curHoverOrderID="curHoverOrderID"
      @changeWidth="onWidthChange"
      @itemHover="handleItemHover"
      @itemHoverLeave="handleItemHoverLeave"
      fixedLeft
      :style="`width:${widthObj.w1}px`"
    />
    <Table4OrderList
      :orderData="OrderList"
      :widthObj="widthObj"
      :titleList="titleList"
      :curHoverOrderID="curHoverOrderID"
      @changeWidth="onWidthChange"
      @itemHover="handleItemHover"
      @itemHoverLeave="handleItemHoverLeave"
      fixedRight
      :style="`width:${widthObj.w16 + 2}px`"
      @detail="onDetailClick"
    />
    <SubmitConfirmDialog
      :visible.sync="detailVisible"
      isFullType
      :OrderID="curOrderID4Detail"
    />
  </div>
</template>

<script>
import SubmitConfirmDialog from '@/components/QuotationComps/PlaceOrderComps/OrderSubmitComp/SubmitConfirmDialog/index.vue';
import Table4OrderList from './Table4OrderList.vue';

export default {
  props: {
    OrderList: {
      type: Array,
      default: () => [],
    },
    isScrollEnd: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Table4OrderList,
    SubmitConfirmDialog,
  },
  data() {
    return {
      widthObj: {
        w1: 100,
        w2: 150,
        w3: 120,
        w4: 120,
        w5: 160,
        w6: 105,
        w7: 105,
        w8: 110,
        w9: 55,
        w10: 65,
        w11: 75,
        w12: 65,
        w13: 65,
        w14: 55,
        w15: 110,
        w16: 150,
      },
      titleList: [
        '订单号',
        '产品名称',
        '平台单号',
        '尺寸',
        '物料',
        '工艺',
        '数量',
        '文件内容',
        '状态',
        '成交价',
        '优惠券',
        '已付',
        '未付',
        '退款',
        '付款时间',
        '操作',
      ],
      detailVisible: false,
      curOrderID4Detail: null,
      curHoverOrderID: null,
    };
  },
  methods: {
    onWidthChange([newW, w]) {
      this.widthObj[w] = newW;
      this.$nextTick(() => {
        this.$emit('changeWidth');
      });
    },
    onDetailClick(id) {
      this.curOrderID4Detail = id;
      this.detailVisible = true;
    },
    handleItemHover(OrderID) {
      this.curHoverOrderID = OrderID;
    },
    handleItemHoverLeave() {
      this.curHoverOrderID = null;
    },
  },
};
</script>
<style lang='scss'>
.mp-pc-order-list-table-containner-wrap {
  position: relative;
  overflow: hidden;
  > .mp-pc-order-list-page-table-comp-wrap {
    header .mp-table-drag-cell {
      &.f,
      &.l {
        visibility: hidden;
      }
    }
    &.fixedLeft,
    &.fixedRight {
      position: absolute;
      // top: 0;
      z-index: 9;
      bottom: 17px;
      padding-top: 17px;
      border-color: rgba($color: #000000, $alpha: 0);
      .product-item-content {
        border-color: rgba($color: #000000, $alpha: 0);
        > div {
          background: #fff;
        }
        &.hover > div , &:hover > div {
          background-color: #ebf7ff;
        }
      }
    }
    &.fixedLeft {
      width: 83px;
      overflow: visible;
      left: 0;
      z-index: 8;
      > main {
        overflow: visible;
      }
      .product-item-header-right {
        display: none;
      }
      header .mp-table-drag-cell {
        &.f {
          visibility: visible;
          &::after {
            display: none;
          }
        }
      }
    }
    &.fixedRight {
      right: 0;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.12);
      .product-item-header.visible {
        &::before {
          opacity: 0;
        }
      }
      header .mp-table-drag-cell {
        &.l {
          visibility: visible;
          &::after {
            display: none;
          }
        }
      }
    }
  }
  &.end > .mp-pc-order-list-page-table-comp-wrap.fixedRight {
    box-shadow: none;
  }
  transition: opacity 0.08s ease-in-out;
  &.loading {
    opacity: 0.2;
  }
}
</style>
