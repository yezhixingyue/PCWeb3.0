<template>
  <section class="mp-pc-place-order-product-classify-comp-wrap">
    <header @mouseleave="onMouseLeave" @mouseenter="onMouseEnter(-1)">
      <div class="product-menu-box float">
        <ul class="header">
          <li v-if="allProductClassify.length === 0" class="loading-box">
            <div class="is-font-12 is-gray"><img src="@/assets/images/loading.gif" alt="">加载中</div>
          </li>
          <template v-else>
            <li
              v-for="(it,i) in allProductClassify"
              :key="it.ID"
              @mouseenter.stop="onMouseEnter(i)"
              :class="{
                item: true,
                active: i === index && isOpen,
                selected: curProductClass && it.ID === curProductClass.FirstLevel.ID
              }"
            >
              <span>{{it.ClassName}}</span>
            </li>
          </template>
        </ul>
        <div class="upload-batch" v-if="showUploadBreakBtn">
          <span class="blue-span" @click="onBatchUploadClick">
            <img src="@/assets/images/batch-upload.png" alt="">批量上传</span>
        </div>
      </div>
    </header>
    <el-popover
      placement="top"
      width="100%"
      transition="el-zoom-in-top"
      popper-class='mp-classify-pop'
      v-model="isOpen">
      <div
          class="content"
          @mouseleave="onMouseLeave"
          @mouseenter="onMouseEnter(null)"
        >
          <ul v-if="curMenus" class="mp-scroll-wrap" :class="isOpen?'active':''">
            <li v-for="item in curMenus.children" :key="item.ID" class="float">
              <span class="title float">{{item.ClassName}} <i class="iconfont icon-iconfontyoujiantou"></i> </span>
              <div class="products">
                <el-link :underline="false"
                  v-for="sub in item.children"
                  :key="sub.ID"
                  @click="selectProduct(sub)"
                  :class="curProduct && curProduct.ID === sub.ID ? 'active' : ''"
                  >{{sub.ShowName}}</el-link>
              </div>
            </li>
          </ul>
        </div>
    </el-popover>

    <transition name="el-fade-in-linear">
      <div  v-show="(curMenus || !isComHeader) && (isOpen || showClassify)" class="mark transition-box" :class="isComHeader?'isComHeader':''"></div>
    </transition>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  data() {
    return {
      isOpen: false,
      timer: null,
      timer2: null, // 进入时的定时器
      index: null,
      hasCollectList: [],
      tempCollectList: [],
      canCollectList: [],
    };
  },
  props: {
    isComHeader: {
      type: Boolean,
      default: false,
    },
    showClassify: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState('Quotation', ['productNames', 'curProduct', 'curProductClass']),
    ...mapGetters('Quotation', ['allProductClassify']),
    ...mapState('common', ['customerInfo']),
    curMenus() {
      if (!this.index && this.index !== 0) return null;
      if (this.allProductClassify.length === 0) return null;
      return this.allProductClassify[this.index] || null;
    },
    showUploadBreakBtn() {
      if (this.customerInfo && this.customerInfo.PermissionInfo && this.customerInfo.PermissionInfo.BatchUpload) {
        return true;
      }
      return false;
    },
  },
  methods: {
    onMouseEnter(i) {
      if (i === -1 && !this.isComHeader && !this.isOpen) return;
      if ((i || i === 0) && i !== -1) this.index = i;
      if (this.isComHeader) {
        this.$emit('handleMouseEnter');
      }
      if (!this.isOpen) {
        this.timer2 = setTimeout(() => {
          this.isOpen = true;
          this.timer2 = null;
        }, 100);
      }
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    },
    onMouseLeave(type) {
      if (type === -1 && !this.isComHeader) return;
      if (this.isComHeader) {
        this.$emit('handleMouseLeave');
      }
      this.timer = setTimeout(() => {
        if (this.isOpen) this.isOpen = false;
      }, 100);
      if (this.timer2) {
        clearTimeout(this.timer2);
        this.timer2 = null;
      }
    },
    selectProduct(sub) {
      clearTimeout(this.timer);
      this.timer = null;
      if (this.isComHeader) {
        this.$emit('handleMouseLeave');
        this.$router.push('/placeOrder');
      } else {
        this.isOpen = false;
      }
      if (this.curProduct && this.curProduct.ID === sub.ID && !this.isComHeader) return;
      this.$store.commit('Quotation/setCurProductInfo', sub);
      this.$store.dispatch('Quotation/getProductDetail');
      this.$store.commit('Quotation/setSelectedCoupon', null);
    },
    onBatchUploadClick() { // 跳转至批量上传页面
      this.$router.push('/BatchUpload');
      this.onMouseLeave();
    },
  },
  watch: {
    showClassify(newVal) {
      if (newVal) {
        this.isOpen = true;
        if (!this.index) this.index = 0;
      } else {
        this.isOpen = false;
      }
    },
  },
};
</script>

<style lang='scss'>
.mp-pc-place-order-product-classify-comp-wrap {
  background-color: #fff;
  width: 100%;
  position: relative;
  > header {
    z-index: 999;
    position: relative;
    background-color: #fff;
    > .product-menu-box {
      height: 60px;
      width: 1200px;
      margin: 0 auto;
      border-top: 1px dashed #eee;
      > .header {
        height: 60px;
        // width: 1200px;
        // margin: 0 auto;
        box-sizing: border-box;
        white-space: nowrap;
        float: left;
        // z-index: 999;
        > li {
          // float: left;
          display: inline-block;
          height: 59px;
          line-height: 59px;
          text-align: center;
          min-width: 80px;
          font-size: 14px;
          position: relative;
          color: #333;
          padding-right: 20px;
          transition: 0.1s;
          > span {
            display: block;
            width: 100%;
            height: 100%;
            user-select: none;
            transition: 0.2s;
          }
          &:last-of-type{
            padding-right: 0px;
          }
          &::after {
              height: 3px;
              content: "";
              width: 80px;
              position: absolute;
              background-color: #428dfa;
              left: 0;
              // left: 0;
              bottom: 0;
              transition: 0.2s;
              opacity: 0;

            }
          &.active {
            color: #428dfa;
            // font-size: 15px;
            > span {
              background-color: rgba($color: #428dfa, $alpha: 0.1);
            }
          }
          &.selected {
            color: #428dfa;
            // font-weight: 600;
            font-size: 15px;
            &::after {
              width: 80px;
              opacity: 1;
            }
          }
          &:hover {
            color: #428dfa;
          }
          &.loading-box {
            > div {
              opacity: 0.5;
              > img {
                vertical-align: text-bottom;
                margin-right: 6px;
              }
            }
          }
        }
        // border-bottom: 1px dashed #eee;
        // border-top: 1px dashed #eee;
      }
      > .upload-batch {
        font-size: 14px;
        float: right;
        height: 30px;
        padding: 15px 5px;
        padding-right: 10px;
        line-height: 30px;
        img {
          vertical-align: -1px;
          margin-right: 8px;
        }
      }
    }
  }
  > section {
    > .content {
      width: 100%;
      margin: 0 auto;
      min-height: 160px;
      position: absolute;
      background-color: #fff;
      display: block;
      z-index: 999;
      transition: 0.2s;
      box-shadow: 0 5px 12px 0 rgba(0,0,0,.1);
      &.active {
        display: block;
      }
      > ul {
        width: 1200px;
        margin: 0 auto;
        padding: 14px 0;
        height: 100%;
        height: 280px;
        overflow-y: auto;
        transition: 0.2s;
        &.active {
          height: 280px;
        }
        > li {
          display: flex;
          > .products {
          //   float: left;
            margin-left: 35px;
            white-space: normal;
            > .el-link {
              color: #888;
              margin: 10px 0;
              margin-right: 25px;
              transition: 0.2s;
              &.active {
                color: #428dfa;
                font-weight: 600;
              }
              &:last-of-type {
                margin-right: 0;
              }
              .el-link--inner {
                font-size: 13px;
                transition: 0.2s;
                &:hover {
                  color: #428dfa;
                }
                > .el-checkbox {
                  margin-right: 6px;
                }
              }
            }
          }
          > .title {
            color: #444;
            font-weight: 600;
            font-size: 14px;
            min-width: 4em;
          //   float: left;
            margin: 10px 0;
            height: 100%;
            flex: none;
            > i {
              font-size: 5px;
              margin-left: 2px;
              transform: scale(0.5);
            }
          }
          line-height: 22px;
        }
      }
      > div {
        width: 1200px;
        margin: 0 auto;
        margin-top: 25px;
        text-align: center;
        margin-bottom: 18px;
        display: block;
        > p {
          > button {
            width: 130px;
            &.submit {
              margin-right: 30px;
              transition: 0.1s;
            }
          }
          &.r {
            text-align: right;
            padding-right: 80px;
          }
        }
      }
    }
  }
  > .mark {
    position: fixed;
    bottom: 0;
    top: 0;
    right: 0;
    left: 0;
    background-color: rgba(0,0,0, 0.4);
    z-index: 888;
    &.isComHeader {
      top: 150px;
    }
  }
  .mp-classify-pop {
    width: 100vw;
    left: 0;
    padding: 0;
    top: 60px;
    box-shadow: none;
    > .content {
      width: 100%;
      margin: 0 auto;
      min-height: 160px;
      position: absolute;
      background-color: #fff;
      display: block;
      z-index: 999;
      transition: 0.2s;
      box-shadow: 0 5px 12px 0 rgba(66,141,250,.1);
      padding-bottom: 36px;
      &.active {
        display: block;
      }
      > ul {
        width: 1200px;
        margin: 0 auto;
        padding: 14px 0;
        height: 100%;
        height: 305px;
        overflow-y: auto;
        transition: 0.2s;
        &.active {
          height: 305px;
        }
        > li {
          display: flex;
          > .products {
            float: right;
            margin-left: 35px;
            float: right\0;
            width: 1050px\0;
            // line-height: 25px\0;
            // line-height: 40px\9\0;
            padding-top: 2px\0;
            padding-top: 10px\9\0;
            // padding-bottom: 8px\9\0;
            text-align: left\0;
            white-space: normal;
            @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
              padding-top: 2px\0;
            }
            > .el-link {
              color: #888;
              margin: 10px 0;
              margin-right: 25px;
              transition: 0.2s;
              &.active {
                color: #428dfa;
                font-weight: 600;
              }
              &:last-of-type {
                margin-right: 0;
              }
              .el-link--inner {
                font-size: 13px;
                transition: 0.2s;
                &:hover {
                  color: #428dfa;
                }
                > .el-checkbox {
                  margin-right: 6px;
                }
              }
            }
          }
          > .title {
            color: #444;
            font-weight: 600;
            font-size: 14px;
            min-width: 4em;
            // max-width: 80px\9\0;
            float: left\0;
            margin: 10px 0;
            height: 100%;
            flex: none;
            > i {
              font-size: 5px;
              margin-left: 2px;
              transform: scale(0.5);
            }
          }
          line-height: 22px;
        }
      }
      > div {
        width: 1200px;
        margin: 0 auto;
        margin-top: 25px;
        text-align: center;
        margin-bottom: 18px;
        display: block;
        > p {
          > button {
            width: 130px;
            &.submit {
              margin-right: 30px;
              transition: 0.1s;
            }
          }
          &.r {
            text-align: right;
            padding-right: 80px;
          }
        }
      }
    }
  }
}
</style>
