<template>
  <li
    v-if="itemData"
    class="mp-pc-bean-buy-list-page-bean-list-single-item-comp-wrap"
    :style="`background: url(${itemData._bgImg}) no-repeat center center/cover;`"
    :class="{
      'sell-out': isSellOut,
      'today-sell-out': isTodaySellOut,
      'can-buy': !isSellOut && !isTodaySellOut,
    }"
    @click='onBuyClick'
    >
    <img v-if="isSellOut" src="@/assets/images/bean-sell-out.png" alt="">
    <img v-if="isTodaySellOut" class="today-out" src="@/assets/images/bean-today-sell-out.png" alt="">
    <h2>
      <label>印豆：</label>
      <span class="is-bold">{{itemData.BeanNumber}}个</span>
    </h2>
    <p class="describe">
      <!-- <label>有效期至：</label> -->
      <span>{{itemData._description}}</span>
    </p>
    <h4>
      <i>￥</i>
      <span>{{itemData.Price}}</span>
    </h4>
  </li>
</template>

<script>
export default {
  props: {
    itemData: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    isSellOut() {
      return this.itemData?.TodayBuyMaxNumber === 0 && !this.itemData?.IsTomorrowBuyable;
    },
    isTodaySellOut() {
      return this.itemData?.TodayBuyMaxNumber === 0 && this.itemData?.IsTomorrowBuyable;
    },
  },
  methods: {
    onBuyClick() {
      if (this.isSellOut || this.isTodaySellOut) return;
      this.$emit('buy', this.itemData);
    },
  },
};
</script>
<style lang='scss'>
.mp-pc-bean-buy-list-page-bean-list-single-item-comp-wrap {
  width: 380px;
  height: 200px;
  border-radius: 4px;
  overflow: hidden;
  display: inline-block;
  margin-right: 30px;
  margin-bottom: 40px;
  transition: 0.2s ease-in-out;
  position: relative;
  cursor: pointer;
  box-sizing: border-box;
  color: #6F4437;
  padding: 20px 30px;
  padding-right: 15px;
  > h2 {
    padding: 25px 0;
    font-size: 24px;
    padding-bottom: 23px;
  }
  > h4 {
    position: absolute;
    width: 110px;
    text-align: center;
    left: 72px;
    height: 40px;
    bottom: 15px;
    line-height: 40px;
    user-select: none;
    font-weight: 700;
    color: #fff;
    > span {
      font-size: 18px;
    }
  }
  > img {
    position: absolute;
    right: 13px;
    top: 15px;
    cursor: not-allowed;
    &.today-out {
      right: -10px;
      top: -3px;
    }
  }
  > p.describe {
    line-height: 18px;
  }
  &.can-buy{
    &:hover {
      // box-shadow: 0 2px 12px 0 rgba($color: #000000, $alpha: 0.1);
      transform: scale(1.03);
    }
  }
  &.sell-out, &.today-sell-out {
    opacity: 0.45;
    cursor: not-allowed;
    // pointer-events: none;
  }
}
</style>
