<template>
  <aside
   class="mp-quotation-product-quotation-content-left-aside-product-selector-wrap"
   v-show="allProductClassify.length > 0"
   :style="`top:${top}px;left:${left}px;`"
  >
    <div class="white-space"></div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <ul class="menu-list" :style="`max-height: calc(100vh - ${202 + bottomHeight}px);`">
        <li
          class="menu"
          v-for="it in allProductClassify"
          :key="it.ID"
          :class="{
            lvActive: curLv1ClassID===it.ID,
            active: activeLv1Id===it.ID,
          }">
          <el-popover
            placement="right-start"
            :offset="50"
            :visible-arrow='false'
            :close-delay='0'
            @show='onShow(it)'
            @hide='onHide(it)'
            transition="none"
            :popper-class="activeLv1Id===it.ID ? 'aside-product-selector-popper-wrap active' : 'aside-product-selector-popper-wrap'"
            trigger="hover">
            <ul class="content">
              <li v-for="lv2 in it.children" :key="lv2.ID">
                <div class="label">
                  <span class="title" :style="`min-width:${getFontNumber(it.children)}em`">{{lv2.ClassName}}</span>
                  <i class="iconfont icon-iconfontyoujiantou"></i>
                </div>
                <div class="products">
                  <span
                    v-for="product in lv2.children"
                    :key="product.ID"
                    @click="selectProduct(product)"
                    :class="curProduct && curProduct.ID === product.ID ? 'active' : ''"
                    >{{product.ShowName}}</span>
                </div>
              </li>
            </ul>
            <span class="label" slot="reference">
              <span class="n">
                <span class="content">{{it.ClassName}}
                  <i class="iconfont icon-iconfontyoujiantou"></i>
                </span>
              </span>
            </span>
          </el-popover>
        </li>
        <li class="batch-upload" v-if="showUploadBreakBtn">
          <div @click="onBatchUploadClick">
            <span>批量上传</span>
            <img src="@/assets/images/batch-upload.png" alt="">
          </div>
        </li>
      </ul>
    </el-scrollbar>
    <div class="white-space b"></div>
  </aside>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapState('Quotation', ['productNames', 'curProduct', 'curProductClass']),
    ...mapState('common', ['ScrollInfo', 'NoticeList', 'customerInfo']),
    ...mapGetters('Quotation', ['allProductClassify']),
    curMenus() {
      if (!this.index && this.index !== 0) return null;
      if (this.allProductClassify.length === 0) return null;
      return this.allProductClassify[this.index] || null;
    },
    defaultActive() {
      return '';
    },
    NoticeHeight() {
      return this.NoticeList.length > 0 ? 40 : 20;
    },
    top() {
      const headerHeight = 125;
      return headerHeight + this.distance;
    },
    positionVal() {
      if (this.NoticeList.length === 0) return 'fixed';
      return this.position;
    },
    curLv1ClassID() {
      if (!this.curProductClass || !this.curProductClass.FirstLevel) return '';
      return this.curProductClass.FirstLevel.ID || '';
    },
    showUploadBreakBtn() {
      if (this.customerInfo && this.customerInfo.PermissionInfo && this.customerInfo.PermissionInfo.BatchUpload) {
        return true;
      }
      return false;
    },
  },
  data() {
    return {
      left: 351,
      distance: 20,
      activeLv1Id: '',
      bottomHeight: 0,
    };
  },
  methods: {
    async selectProduct(product) {
      if (this.curProduct && this.curProduct.ID === product.ID) return;
      this.$store.commit('Quotation/setCurProductInfo', product);
      this.$store.commit('Quotation/setSelectedCoupon', null);
      const doms = document.getElementsByClassName('aside-product-selector-popper-wrap');
      [...doms].forEach(it => {
        const _it = it;
        _it.style.display = 'none';
      });
      const key = await this.$store.dispatch('Quotation/getProductDetail', [{ saveOldData: true }]);
      if (!key) {
        this.$store.commit('Quotation/clearCurProductInfo2Quotation');
        this.$store.commit('Quotation/setCurProductInfo', null);
      }
    },
    getFontNumber(list) {
      if (!Array.isArray(list) || list.length === 0) return 4;
      const _list = list.map(it => {
        let len = it.ClassName.length;
        const matchVals = it.ClassName.match(/\d|[A-z]/g);
        if (matchVals && matchVals.length > 0) {
          len -= Math.floor(matchVals.length / 2);
        }
        return len;
      });
      const len = Math.max(..._list);
      return len > 4 ? 4 : len;
    },
    getLeft() {
      const oContent = document.querySelector('.mp-quotation-product-quotation-content-wrap');
      if (oContent && oContent.getBoundingClientRect) {
        const obj = oContent.getBoundingClientRect();
        if (obj) this.left = obj.left;
      } else {
        this.left = 10;
      }
    },
    handleScroll() {
      const { scrollTop, scrollHeight, offsetHeight } = this.ScrollInfo;
      if (offsetHeight > 0) {
        this.bottomHeight = Math.abs(Math.min(scrollHeight - scrollTop - offsetHeight - 160, 0));
      }
      if (this.NoticeList.length === 0) return;
      const d = this.NoticeHeight - scrollTop;
      this.distance = d > 20 ? d : 20;
    },
    onShow(lv1) {
      this.activeLv1Id = lv1.ID;
    },
    onHide(lv1) {
      if (lv1.ID === this.activeLv1Id) this.activeLv1Id = '';
    },
    onBatchUploadClick() { // 跳转至批量上传页面
      this.$router.push('/BatchUpload');
    },
  },
  mounted() {
    this.getLeft();
    window.addEventListener('resize', this.getLeft);
    this.handleScroll();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getLeft);
  },
  watch: {
    ScrollInfo: {
      handler() {
        this.handleScroll();
      },
      deep: true,
      immediate: true,
    },
    curProduct() {
      this.handleScroll();
    },
    NoticeList() {
      setTimeout(() => {
        this.handleScroll();
      }, 5);
    },
  },
};
</script>
<style lang='scss'>
.mp-quotation-product-quotation-content-left-aside-product-selector-wrap {
  position: fixed;
  text-align: left;
  border-radius: 5px;
  display: inline-block;
  width: 260px;
  z-index: 9;
  .menu-list {
    max-height: calc(100vh - 361px);
    width: 244px;
    margin-right: 16px;
    > li {
      padding: 0;
      font-size: 15px;
      line-height: 44px;
      transition: ease-in-out 0.05s;
      span.n {
        display: inline-block;
        vertical-align: top;
        width: 244px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        box-sizing: border-box;
        color: #333;
        transition: ease-in-out 0.05s;
        position: relative;
        margin-right: 16px;
        background: #fff;
        > .content {
          display: block;
          width: 100%;
          height: 100%;
          padding-left: 66px;
          padding-right: 30px;
          box-sizing: border-box;
          border-radius: 5px;
        }
      }
      i.iconfont {
        font-size: 16px;
        color: #fff;
        opacity: 0;
        transition: ease-in-out 0.05s;
        position: absolute;
        right: 5px;
      }
      &.menu {
        span.label {
          width: 260px;
          display: block;
        }
        &.lvActive {
          span.n {
            color: #428dfa;
            > .content {
              position: relative;
              &::after {
                content: '';
                position: absolute;
                height: 14px;
                width: 2px;
                background: #428dfa;
                right: 0;
                top: 16px;
              }
            }
          }
        }
        &.active,&:hover {
          background-color: #428dfa;
          color: #fff;
          span.n > .content {
            color: #fff;
            margin-right: -20px;
            background-color: #428dfa;
          }
          i.iconfont {
            opacity: 1;
          }
        }
      }
      &.batch-upload {
        border-radius: 0;
        background: #fff;
        > div {
          text-align: center;
          padding-right: 4px;
          height: 42px;
          line-height: 38px;
          margin: 0 30px;
          padding-top: 8px;
          border-radius: 3px;
          user-select: none;
          border-top: 1px solid #eee;
          > span {
            margin-right: 33px;
            font-size: 15px;
            color: #428dfa;
          }
          img {
            vertical-align: -2px;
          }
          cursor: pointer;
          transition: ease-in-out 0.05s;
          &:hover {
            opacity: 0.8;
          }
          &:active {
            opacity: 1;
          }
        }
      }
    }
  }
  > .el-scrollbar {
    width: 100%;
    @media screen\0 {
      .scrollbar-wrapper { // E 8 9 10 11下起作用的样式
        margin-bottom: -21px !important;
      }
    }
  }
  > .white-space {
    height: 14px;
    width: 244px;
    background: #fff;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    &.b {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      border-bottom-left-radius: 3px;
      border-bottom-right-radius: 3px;
    }
  }
}
.aside-product-selector-popper-wrap {
  margin-top: -45px !important;
  margin-left: -8px !important;
  box-shadow: 0px 2px 15px 0px rgba(20, 57, 112, 0.25);
  ul.content {
    padding-top: 8px;
    > li {
      white-space: nowrap;
      overflow: hidden;
      margin-bottom: 8px;
      > div {
        display: inline-block;
        vertical-align: top;
        color: #444;
        line-height: 36px;
        &.label {
          font-weight: bold;
          > span {
            display: inline-block;
            vertical-align: top;
            margin-right: 10px;
          }
          margin-right: 30px;
          margin-left: 18px;
          font-size: 14px;
        }
        &.products {
          font-size: 13px;
          white-space: normal;
          width: 730px;
          color: #888;
          @media screen and (max-width: 1100px) {
            width: 650px;
          }
          @media screen and (max-width: 1000px) {
            width: 600px;
          }
          @media screen and (max-width: 900px) {
            width: 500px;
          }
          @media screen and (max-width: 800px) {
            width: 260px;
          }
          > span {
            display: inline-block;
            vertical-align: top;
            margin-right: 24px;
            // min-width: 4em;
            cursor: pointer;
            transition: color 0.05s ease-in-out;
            &:hover {
              color: #428dfa;
            }
            &.active {
              color: #428dfa;
              cursor: text;
              font-weight: 700;
            }
          }
        }
      }
    }
  }
  opacity: 0;
  &.active {
    opacity: 1;
  }
  width: 924px;
  @media screen and (max-width: 1100px) {
    width: 850px;
  }
  @media screen and (max-width: 1000px) {
    width: 750px;
  }
  @media screen and (max-width: 900px) {
    width: 650px;
  }
  @media screen and (max-width: 800px) {
    width: 400px;
  }
}
</style>
