<template>
  <li
    v-if="itemData"
    class="mp-pc-bean-buy-list-page-bean-list-single-item-comp-wrap"
    :class="{'sell-out': isSellOut, 'can-buy': !isSellOut}"
    :style="`background: url(${itemData._bgImg}) no-repeat center center/cover;`"
    @click='onBuyClick'
    >
    <img v-if="isSellOut" src="@/assets/images/bean-sell-out.png" alt="">
    <h2>
      <label>印豆：</label>
      <span class="is-bold">{{itemData.BeanNumber}}个</span>
    </h2>
    <p>
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
      if (this.itemData) {
        return this.itemData.EverydayBuyMaxNumber === 0;
      }
      return false;
    },
  },
  methods: {
    onBuyClick() {
      if (this.isSellOut) return;
      this.$emit('buy', this.itemData);
    },
  },
};
</script>
<style lang='scss'>
.mp-pc-bean-buy-list-page-bean-list-single-item-comp-wrap {
  width: 380px;
  height: 200px;
  box-sizing: border-box;
  border-radius: 4px;
  overflow: hidden;
  display: inline-block;
  margin-right: 30px;
  margin-bottom: 40px;
  color: #6F4437;
  padding: 20px 30px;
  position: relative;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  > img {
    position: absolute;
    right: 13px;
    top: 15px;
  }
  > h2 {
    padding: 25px 0;
    font-size: 24px;
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
  &.can-buy{
    &:hover {
      // box-shadow: 0 2px 12px 0 rgba($color: #000000, $alpha: 0.1);
      transform: scale(1.03);
    }
  }
  &.sell-out {
    opacity: 0.45;
    cursor: not-allowed;
    // pointer-events: none;
  }
}
</style>
