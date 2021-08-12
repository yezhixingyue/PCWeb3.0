<template>
  <aside class="mp-pc-order-detail-page-aside-comp-wrap">
    <p><span @click="handleJump('header')" :class="activeText==='header'?'active':''">订单概括</span></p>
    <p><span @click="handleJump('progress')" :class="activeText==='progress'?'active':''">订单跟踪</span></p>
    <p><span @click="handleJump('package')" :class="activeText==='package'?'active':''">包裹列表</span></p>
    <p><span @click="handleJump('detail')" :class="activeText==='detail'?'active':''">产品详情</span></p>
  </aside>
</template>

<script>
import { debounce } from '@/assets/js/utils/throttle';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      elesTopInfo: {
        oHeaderTop: 0,
        oProgressTop: 0,
        oPackageTop: 0,
        oDetailTop: 0,
      },
      activeText: 'header', // progress | package | detail
      distance: 130,
    };
  },
  computed: {
    ...mapState('common', ['ScrollInfo']),
    scrollTop() {
      return this.ScrollInfo.scrollTop;
    },
  },
  watch: {
    scrollTop() {
      const { scrollTop } = this.ScrollInfo;
      const _top = scrollTop + this.distance;
      if (_top > this.elesTopInfo.oPackageTop) {
        this.activeText = 'detail';
      } else if (_top > this.elesTopInfo.oProgressTop) {
        this.activeText = 'package';
      } else if (_top > this.elesTopInfo.oHeaderTop) {
        this.activeText = 'progress';
      } else {
        this.activeText = 'header';
      }
    },
  },
  methods: {
    handleScroll(oEl) {
      if (!oEl) return;
      const { scrollTop, scrollHeight, offsetHeight } = oEl;
      this.$store.commit('common/setScrollInfo', { scrollTop, scrollHeight, offsetHeight });
    },
    handleJump(text) {
      if (this.activeText === text) return;
      let _dis = 0;
      switch (text) {
        case 'header':
          _dis = this.elesTopInfo.oHeaderTop - 145;
          break;
        case 'progress':
          _dis = this.elesTopInfo.oProgressTop - 145;
          break;
        case 'package':
          _dis = this.elesTopInfo.oPackageTop - 145;
          break;
        case 'detail':
          _dis = this.elesTopInfo.oDetailTop - 145;
          break;
        default:
          break;
      }
      this.activeText = text;
      this.utils.animateScroll(this.oApp.scrollTop, _dis, num => {
        this.oApp.scrollTop = num;
      });
    },
    getElementPosition(elem) {
      let _el = elem;
      let x = 0;
      let y = 0;
      while (_el.offsetParent !== null) {
        x += _el.offsetLeft;
        y += _el.offsetTop;
        _el = _el.offsetParent;
      }
      return { x, y };
    },
    getElesInfo() {
      const oHeader = document.querySelector('.mp-pc-order-detail-page-header-wrap');
      const oProgress = document.querySelector('.mp-pc-order-detail-page-progress-comp-wrap');
      const oPackage = document.querySelector('.mp-pc-order-detail-page-package-list-comp-wrap');
      // eslint-disable-next-line max-len
      const oDetail = document.querySelector('.mp-pc-order-list-page-order-detail-page-wrap .mp-pc-order-detail-common-comp-wrap');
      const oHeaderTop = this.getElementPosition(oHeader).y;
      const oProgressTop = this.getElementPosition(oProgress).y;
      const oPackageTop = this.getElementPosition(oPackage).y;
      const oDetailTop = this.getElementPosition(oDetail).y;
      this.elesTopInfo = {
        oHeaderTop, oProgressTop, oPackageTop, oDetailTop,
      };
    },
  },
  mounted() {
    this.oApp = document.getElementById('app');
    this.$nextTick(() => {
      window.onresize = debounce(this.getElesInfo, 30);
      this.getElesInfo();
    });
  },
  beforeDestroy() {
    window.onresize = null;
  },
};
</script>

<style lang='scss'>
.mp-pc-order-detail-page-aside-comp-wrap {
  position: fixed;
  top: 180px;
  left: calc(50% + 630px);
  width: 85px;
  height: 200px;
  border-left: 1px solid #e5e5e5;
  text-align: right;
  > p {
    height: 30px;
    padding: 10px 0;
    line-height: 30px;
    > span {
      color: #888;
      transition: color 0.25s;
      display: inline-block;
      height: 100%;
      width: 85px;
      position: relative;
      user-select: none;
      &::before {
        content: '';
        position: absolute;
        width: 3px;
        height: 100%;
        background-color: rgb(245, 245, 245);
        top: 0;
        left: 0;
        transition: 0.25s;
      }
      &.active {
        color: #428dfa;
        // border-left: 3px solid #428dfa;
        &::before {
          background-color:  #428dfa;
        }
      }
      cursor: pointer;
    }
  }
  @media screen and (max-width: 1420px) {
    left: calc(50% + 603px);
  }
}
</style>
