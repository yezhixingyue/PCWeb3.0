<template>
  <RetractableDisplayComp
    class="mp-pc-shopping-car-create-order-list-wrap"
    :isScrollStyle="false"
    :widthObj="widthObj"
    :onWidthChange="onWidthChange"
    :titleList="titleList"
    :class="{'is-mini': isMini}"
  >
    <template v-if="orderData">
      <ul>
        <li v-for="(data, i) in orderData.PackageList" :key="data.ID"
          :class="i === orderData.PackageList.length - 1 ? 'hide-border' : ''" >
          <ItemListComp :data="data" :widthObj="widthObj" :subExpressList='subExpressList'
          />
        </li>
      </ul>
    </template>
    <div class="no-data-show is-gray" v-else>暂无数据</div>
  </RetractableDisplayComp>
</template>

<script>
import RetractableDisplayComp from '../../RetractableDisplayComp';
import ItemListComp from './ItemListComp.vue';

export default {
  name: 'Table4PlaceOrderFromShoppingCar',
  components: {
    ItemListComp,
    RetractableDisplayComp,
  },
  props: {
    orderData: {
      type: Object,
      default: () => ({}),
    },
    isMini: {
      type: Boolean,
      default: false,
    },
    subExpressList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      widthObj: {
        w1: this.isMini ? 180 : 230,
        w2: this.isMini ? 100 : 100,
        w3: this.isMini ? 70 : 80,
        w4: this.isMini ? 60 : 70,
        w5: this.isMini ? 70 : 80,
        w6: this.isMini ? 65 : 80,
        w7: this.isMini ? 170 : 235,
        w8: this.isMini ? 140 : 322,
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
  box-sizing: border-box;
  padding-bottom: 15px;
  > header {
    height: 40px;
    border: 1px solid #eee;
    background-color: rgb(248, 248, 248);
    box-sizing: border-box;
    border-bottom: none;
    > div {
      line-height: 38px;
      height: 100%;
      background-color: rgb(248, 248, 248);
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
    overflow-x: hidden;
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
  &.is-mini {
    padding: 0;
    > header {
      height: 32px;
      border: none;
      padding: 0 14px;
      background-color: #79adfa;
      border: 1px solid #79adfa;
      box-sizing: border-box;
      border-top: none;
      border-bottom: none;
      > div {
        line-height: 32px;
        color: #fff;
        background-color: #79adfa;
      }
    }
    > main {
      border: none;
      padding: 0 14px;
      height: auto;
      margin: 0;
      overflow: hidden;
      > ul {
        > li {
          > .mp-pc-pre-create-order-list-item-wrap {
            border: none;
            padding-top: 14px;
            > .product-item-header {
              &::before {
                display: none;
              }
              > .product-item-header-left {
                height: 30px;
                line-height: 30px;
                .product-item-header-amount-box, .freight-box {
                  font-size: 12px !important;
                }
              }
              border: 1px solid #eee;
            }
            > ul {
              .product-item-content {
                border: 1px solid #eee;
                box-sizing: border-box;
                border-top: none;
                height: 50px;
                > div {
                  font-size: 12px;
                  padding: 10px 0;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
