<template>
  <section class="mp-duration-content-swiper-classify-comp-wrap"
   :class="{'show-scroll': scrollLeft > 0, 'show-end': isEnd}">
    <el-tabs v-model="activeName" type="card" :onTabScroll='onTabScroll' ref="tabs">
      <el-tab-pane
        v-for="item in classiftList"
        :key="item.ProductID"
        :label="item.ProductName"
        :name="item.ProductID">
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  data() {
    return {
      scrollLeft: 0,
      isEnd: false,
    };
  },
  computed: {
    ...mapState('Quotation', ['curProductClass', 'curProductID']),
    ...mapGetters('Quotation', ['allProductClassify']),
    classiftList() {
      if (!this.curProductClass || !this.allProductClassify || this.allProductClassify.length === 0) return [];
      const { First, Second } = this.curProductClass;
      const level1 = this.allProductClassify.find(lv1 => lv1.ID === First);
      if (level1) {
        const level2 = level1.children.find(lv2 => lv2.ID === Second);
        if (level2) return level2.children;
      }
      return [];
    },
    activeName: {
      get() {
        return this.curProductID;
      },
      async set(val) {
        if (val === this.curProductID) return;
        this.handleProductSelected(val);
      },
    },
    curQueryPath() {
      const { id } = this.$route.query;
      return id;
    },
  },
  methods: {
    onTabScroll({ navSize, containerSize, navOffset }) {
      this.scrollLeft = navOffset;
      if (navSize === containerSize + navOffset) this.isEnd = true;
      else this.isEnd = false;
    },
    async handleProductSelected(val) {
      const item = this.classiftList.find(it => it.ProductID === val);
      if (item) {
        this.$store.commit('Quotation/setCurProductInfo', item);
        this.$store.commit('Quotation/setCurProduct', item);
        this.$store.commit('Quotation/setSelectedCoupon', null);
        const key = await this.$store.dispatch('Quotation/getProductDetail', { saveOldData: true });
        if (!key) this.$store.commit('Quotation/clearCurProductInfo2Quotation');
      }
    },
  },
  watch: {
    curQueryPath(newVal) {
      if (!newVal) return;
      this.handleProductSelected(newVal);
      // console.log('curQueryPath -- watch - change', newVal);
    },
  },
};
</script>

<style lang='scss'>
.mp-duration-content-swiper-classify-comp-wrap {
  padding-bottom: 35px;
  padding-right: 32px;

  .el-tabs {
    width: 800px;
  }
  .el-tabs__header {
    margin: 0;
    border-color: #e5e5e5;
    .el-tabs__nav-wrap {
      padding-right: 0px;
      padding-left: 0;
      // margin: 0 20px;
      overflow: unset;
      > span {
        line-height: 18px;
        width: 18px;
        height: 18px;
        right: -38px;
        &.el-tabs__nav-prev {
          display: none;
        }
        > i {
          height: 18px;
          width: 18px;
          position: absolute;
          top: 8px;
          left: 0px;
          background-color: #f5f5f5;
          border-radius: 50%;
          &::before {
            position: absolute;
            left: 3px;
            top: 3px;
          }
        }
      }
    }
    .el-tabs__nav {
      border: none;
    }
    .el-tabs__item {
      height: 35px;
      line-height: 35px;
      border: 1px solid transparent;
      border-bottom: none;
      color: #888;
      padding: 0 16px;
      user-select: none;
      &:hover {
        color: #428dfa;
      }
      &.is-active {
        border-color: #e5e5e5;
        position: relative;
        color: #428dfa;
        &::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 1px;
          background-color: #fff;
        }
        &::before {
          content: '';
          position: absolute;
          left: -1px;
          right: -1px;
          top: -1.5px;
          height: 3px;
          background-color: #428dfa;
        }
      }
    }
  }
  .el-tabs--card > .el-tabs__header .el-tabs__item:first-child {
    border: 1px solid transparent;
    border-bottom: none;
    &.is-active {
      border-color: #e5e5e5;
    }
  }
  &.show-scroll {
    padding-left: 32px;
    .el-tabs__nav-wrap {
      // padding-left: 20px;
      > span {
        &.el-tabs__nav-prev {
          display: block;
          left: -30px;
        }
      }
    }
  }
  &.show-end {
    padding-right: 0px;
    .el-tabs__nav-wrap {
      > span {
        &.el-tabs__nav-next {
          display: none;
        }
      }
    }
  }
}
</style>
