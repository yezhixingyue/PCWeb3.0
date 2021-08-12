<template>
  <section class="mp-pc-common-page-header-common-wrap float" :style="oStyles">
    <header>
      <div>
        <img @click="onImgClick" src="../../assets/images/logo.png" alt />
        <!-- <span>会员中心</span> -->
      </div>
      <ul>
        <li>
          <a :href="homeUrl" target="_blank">首页</a>
        </li>
        <li class="active">
          <a>快捷下单</a>
        </li>
        <li>
          <a :href='`${homeUrl}productIntro`' target="_blank">产品介绍</a>
        </li>
        <li>
          <a :href='`${homeUrl}news`' target="_blank">新闻中心</a>
        </li>
        <li>
          <a :href='`${homeUrl}about`' target="_blank">关于我们</a>
        </li>
        <li>
          <a :href='`${homeUrl}help`' target="_blank">帮助中心</a>
        </li>
      </ul>
      <!-- <span v-if="customerInfo"><i></i>{{customerInfo.CustomerName}}</span> -->
    </header>
    <footer :class="showBoxShadow?'show':''">
      <div class="common-header-menus-wrap float">
        <ul class="menu-list float">
          <router-link tag="li"
            to="/placeOrder"
            class="placeorder"
            showClassify
            :class="{
              active: $route.name === 'OrderPreCreate',
              showClassify: showClassify,
            }"
           >
            <!-- <i class="iconfont icon-xiadan"></i> -->
            <div @mouseleave="onMouseLeave" @mouseenter="onMouseEnter">
              <span>下单</span>
            </div>
          </router-link>
          <router-link class="normal-item" tag="li" to="/shopping">
            <!-- <i class="iconfont icon-gouwuche"></i> -->
            <span>购物车</span>
          </router-link>
          <router-link class="normal-item" tag="li" to="/unpay">
            <!-- <i class="iconfont icon-weifukuan"></i> -->
            <span>未付款</span>
          </router-link>
          <router-link class="normal-item" tag="li" to="/order">
            <!-- <i class="iconfont icon-dingdan"></i> -->
            <span>订单</span>
          </router-link>
          <router-link class="normal-item" tag="li" to="/bill">
            <!-- <i class="iconfont icon-zhangdan"></i> -->
            <span>账单</span>
          </router-link>
          <router-link class="normal-item" tag="li" to="/serviceAfterSales">
            <!-- <i class="iconfont icon-shouhoudan"></i> -->
            <span>售后记录</span>
          </router-link>
          <router-link class="normal-item" tag="li" to="/feedbackList" :class="{
              active: $route.name === 'feedback',
            }">
            <!-- <i class="iconfont icon-zhangdan"></i> -->
            <span>售后进度</span>
          </router-link>
        </ul>
        <div class="customer-box" v-if="customerInfo">
          <span>
            <span @click="handleCustomerNameDetail">{{customerInfo.CustomerName}} </span>
            <i class="title"><i class="r-5">/ </i> 余额：</i>
            <i class="price">￥{{customerBalance?customerBalance:0}}</i>
          </span>
          <el-button round @click.stop="setShowRechange">在线充值</el-button>
          <el-dropdown trigger="click" @command='onCommand'>
            <span class="el-dropdown-link">
              {{formatMobile(customerInfo.Account.Mobile)}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" class="mp-pc-my-set-drop-down-wrap">
              <el-dropdown-item
                :class="{active: $route.name === 'mySettingAccount'}"
                command='account' icon="el-icon-user-solid">账户信息</el-dropdown-item>
              <el-dropdown-item
                :class="{active: $route.name === 'mySettingAddress'}"
                command='address' icon="el-icon-location">收货地址</el-dropdown-item>
              <el-dropdown-item
                :class="{active: $route.name === 'mySettingCouponCenter'}"
                command='couponCenter' icon="el-icon-s-goods">领券中心</el-dropdown-item>
              <el-dropdown-item
                :class="{active: $route.name === 'mySettingMyCoupons'}"
                command='myCoupons' icon="el-icon-s-claim">我的优惠券</el-dropdown-item>
              <el-dropdown-item
                :class="{active: $route.name === 'subAccountManage'}"
                command='subAccountManage' icon="el-icon-menu">子账号管理</el-dropdown-item>
              <el-dropdown-item
                :class="{active: $route.name === 'mySettingChangePwd'}"
                command='changePwd' icon="el-icon-s-help">修改密码</el-dropdown-item>
              <el-dropdown-item
                :class="{active: $route.name === 'mySettingChangeMobile'}"
                command='changeMobile' icon="el-icon-s-order">修改手机号</el-dropdown-item>
              <el-dropdown-item
                :class="{active: $route.name === 'mySettingPage'}"
                command='setup' icon="el-icon-s-tools">我的设置</el-dropdown-item>
              <el-dropdown-item command='loginOut'>
                <span class="iconfont icon-tuichudenglu"></span>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </footer>
    <el-drawer
      :visible.sync="showRechange"
      :with-header="false"
      size='350px'
      direction="ttb"
      custom-class="mp-recharge-drawer-wrap"
      :before-close="setShowRechange">
      <div class="recharge-box" :class="showRechange? 'showRechange' : ''">
        <RechargeComp :showRechange='showRechange'  @handleClose='setShowRechangeFalse' />
      </div>
    </el-drawer>
    <PlaceOrderProductClassifyComp isComHeader @handleMouseLeave='onMouseLeave'
      @handleMouseEnter='onMouseEnter' :showClassify='showClassify'
      @mouseleave.native="onMouseLeave" @mouseenter.native="onMouseEnter"
      v-show="!($route.name === 'placeOrder' || !showClassify)" />
    <!-- <div class="recharge-remark" :class="{ show:showRemark, showBg: showRechange }"  @click.self='onRemarkClick'>
      <div class="recharge-box" :class="showRechange? 'showRechange' : ''">
        <RechargeComp :showRechange='showRechange' @handleClose='setShowRechange' />
      </div>
    </div> -->
  </section>
</template>

<script>
import { mapState } from 'vuex';
import { debounce } from '@/assets/js/utils/throttle';
import { Loading } from 'element-ui';
import Cookie from '@/assets/js/Cookie';
import { useCookie, homeUrl } from '@/assets/js/setup';
import PlaceOrderProductClassifyComp from '@/components/QuotationComps/PlaceOrderProductClassifyComp.vue';
import RechargeComp from './RechargeComp.vue';

export default {
  components: {
    RechargeComp,
    PlaceOrderProductClassifyComp,
  },
  computed: {
    ...mapState('common', ['customerInfo', 'customerBalance', 'ScrollInfo']),
    scrollTop() {
      return this.ScrollInfo.scrollTop;
    },
  },
  data() {
    return {
      showRechange: false,
      showRemark: false,
      oStyles: {
        zIndex: 1000,
      },
      showClassify: false,
      timer: null,
      showBoxShadow: false,
      homeUrl,
      isloading: false,
    };
  },
  methods: {
    formatMobile(mobile) {
      if (!mobile || mobile.length !== 11) return '';
      const _arr = mobile.split('');
      const _arr1 = _arr.map((it, i) => {
        if (i > 2 && i < 7) return '.';
        return it;
      });
      return _arr1.join('');
    },
    setShowRechange() {
      this.showRechange = !this.showRechange;
      if (this.showRechange) {
        this.$store.dispatch('common/getCustomerFundBalance');
        this.showRemark = true;
        this.oStyles.zIndex = 3000;
      }
      if (!this.showRechange) {
        this.oStyles.zIndex = 1000;
        setTimeout(() => {
          this.showRemark = false;
        }, 200);
      }
    },
    onRemarkClick() {
      this.setShowRechange();
    },
    setShowRechangeFalse() {
      if (this.showRechange) {
        this.showRechange = !this.showRechange;
        if (!this.showRechange) {
          this.oStyles.zIndex = 1000;
          setTimeout(() => {
            this.showRemark = false;
          }, 200);
        }
      }
    },
    onImgClick() {
      if (this.$route.name !== 'placeOrder') this.$router.push('/placeOrder');
    },
    onMouseEnter() {
      this.showClassify = true;
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    },
    onMouseLeave() {
      this.timer = setTimeout(() => {
        if (this.showClassify) this.showClassify = false;
      }, 80);
    },
    handleScroll(oEl) {
      if (!oEl) return;
      const { scrollTop, scrollHeight, offsetHeight } = oEl;
      this.$store.commit('common/setScrollInfo', { scrollTop, scrollHeight, offsetHeight });
    },
    handleCustomerNameDetail() {
      this.$router.push('/mySetting/account');
    },
    onCommand(command) {
      // console.log(command);
      if (command === 'loginOut') {
        this.messageBox.warnCancelNullMsg({
          title: '确定退出登录吗?',
          successFunc: () => {
            sessionStorage.removeItem('token');
            localStorage.removeItem('token');
            Cookie.removeCookie('token');
            this.$router.replace('/login');
            // 另外再需清除状态
          },
        });
        return;
      }
      let _path = '';
      switch (command) {
        case 'account':
          _path = '/mySetting/account';
          break;
        case 'address':
          _path = '/mySetting/address';
          break;
        case 'couponCenter':
          _path = '/mySetting/couponCenter';
          break;
        case 'myCoupons':
          _path = '/mySetting/myCoupons';
          break;
        case 'subAccountManage':
          _path = '/mySetting/subAccountManage';
          break;
        case 'changePwd':
          _path = '/mySetting/changePwd';
          break;
        case 'changeMobile':
          _path = '/mySetting/changeMobile';
          break;
        case 'setup':
          _path = '/mySetting/setting';
          break;
        default:
          break;
      }
      if (this.$route.path !== _path) this.$router.push(_path);
    },
  },
  watch: {
    customerInfo: {
      handler(newVal) {
        if (useCookie) Cookie.setCookie('customerInfo', JSON.stringify(newVal), 'Session');
        else sessionStorage.setItem('customerInfo', JSON.stringify(newVal));
      },
      deep: true,
    },
    scrollTop(newVal) {
      if (newVal > 0) {
        if (this.showBoxShadow) return;
        this.showBoxShadow = true;
      } else {
        if (!this.showBoxShadow) return;
        this.showBoxShadow = false;
      }
    },
  },
  async mounted() {
    let showLoading = true;
    this.isloading = true;
    if (this.$route.name === 'placeOrder' && this.$route.query.id) showLoading = false;
    const loadingInstance = showLoading ? Loading.service({
      lock: true,
      text: '加载中...',
      spinner: 'el-icon-loading',
      background: 'rgba(255, 255, 255, 0.3)',
      customClass: 'mp-general-loading-box opAnimate',
    }) : null;
    try {
      const bool = await this.$store.dispatch('common/getCustomerFundBalance');
      if (bool) {
        await Promise.all([
          this.$store.dispatch('Quotation/getProductClassify'),
          this.$store.dispatch('common/getCustomerDetail'),
          // this.$store.dispatch('common/getCustomerFundBalance'),
          // this.$store.dispatch('common/getCraftRelationList'),
          this.$store.dispatch('common/getExpressList'),
        ]);
      }
      if (showLoading) loadingInstance.close();
      this.isloading = false;
    } catch (error) {
      if (showLoading) loadingInstance.close();
      this.isloading = false;
    }
    this.oApp = document.getElementById('app');
    const _func = debounce(this.handleScroll, 50);
    if (this.oApp) {
      this.oApp.onscroll = () => _func(this.oApp);
    }
  },
  beforeDestroy() {
    if (this.oApp) this.oApp.onscroll = null;
  },
};
</script>

<style lang='scss'>
.mp-pc-common-page-header-common-wrap {
  user-select: none;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #428dfa;
  width: 100%;
  z-index: 1000;
  > header {
    width: 1200px;
    height: 60px;
    margin: 0 auto;
    position: relative;
    left: -8px;
    > div {
      display: inline-block;
      vertical-align: top;
      height: 100%;
      margin-right: 72.5px;
      > img {
        width: 157px;
        height: 33px;
        margin-top: 15px;
        margin-right: 25px;
        vertical-align: -66%;
        cursor: pointer;
      }
      > span {
        color: #585858;
        font-size: 18px;
      }
    }
    > ul {
      // float: right;
      display: inline-block;
      padding-right: 75px;
      > li {
        float: left;
        height: 60px;
        // width: 120px;
        margin-right: 0 10px;
        > a {
          height: 100%;
          width: 100%;
          padding: 0 25px;
          box-sizing: border-box;
          color: #fff;
          text-decoration: unset;
          text-decoration: none\0;
          font-size: 16px;
          text-align: center;
          display: block;
          line-height: 60px;
          transition: 0.3s;
        //   &::after {
        //     height: 2px;
        //     width: 0%;
        //     transition: 0.25s;
        //     background-color: rgb(66, 141, 250);
        //     position: absolute;
        //     content: "";
        //     left: 50%;
        //     bottom: 16px;
        //     transform: translateX(-50%);
        //   }
        }
        &:hover {
          background-color: #3d69ce;
          box-shadow: inset 0px 1px 3px rgba(0, 0, 0, 0.2), 0px 1px 0px white;
        }
        &.active {
          background-color: #3d69ce;
          // text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
          // box-shadow: inset 0px 1px 3px rgba(0, 0, 0, 0.2), 0px 1px 0px white;
        }
      }
    }
    > span {
      position: absolute;
      right: 0;
      height: 60px;
      color: #fff;
      font-size: 16px;
      padding: 18px 0;
      line-height: 24px;
      box-sizing: border-box;
      max-width: 240px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      > i {
        display: inline-block;
        height: 100%;
        width: 18px;
        vertical-align: top;
        margin-right: 9px;
        background: url(../../assets/images/avator.png) no-repeat center center/18px 21px;
      }
    }
  }
  > footer {
    width: 100%;
    height: 65px;
    overflow: hidden;
    background-color: #fff;
    &.show {
      box-shadow: 0 1px 1px rgba(0,0,0,.05), 0 2px 6px 0 rgba(0,0,0,.045);
    }
    // border: 1px solid #fff;
    position: relative;
    // box-shadow: inset 0px 1px 0px rgba(255, 255, 255, 0.3), 0 1px 2px rgba(0, 0, 0, 0.15);
    > .common-header-menus-wrap {
      width: 1200px;
      margin: 0 auto;
      box-sizing: border-box;
      position: relative;
      left: -8px;
      // height: 69px;
      // border-bottom: 1px dashed #eee;
      > .menu-list {
        float: left;
        > li {
          float: left;
          height: 100%;
          line-height: 15px;
          // width: 105px;
          border-radius: 5px;
          color: #333;
          font-size: 15px;
          text-align: center;
          transition: 0.2s;
          padding: 10px 20px 10px;
          margin-top: 16px;
          margin-bottom: 16px;
          box-sizing: border-box;
          margin-right: 20px;
          cursor: pointer;
          > i {
            font-size: 19px;
            margin-right: 8px;
            vertical-align: bottom;
          }
          &.normal-item {
            &.router-link-active, &.active {
              color: #fff;
              background-color: #428dfa;
              &:hover {
                color: #fff;
              }
            }
            &:hover {
              color: #428dfa;
            }
            &:active {
              color: #428dfa;
              box-shadow: inset 0px 1px 3px rgba(0, 0, 0, 0.2), 0px 1px 0px white;
              text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
            }
          }
          &.placeorder {
            // position: relative;
            padding: 0;
            margin: 0;
            margin-right: 20px;
            height: 70px;
            width: 80px;
            > div {
              height: 35px;
              padding: 16px 0px 16px;
              > span {
                display: inline-block;
                padding: 10px 20px;
                border-radius: 5px;
                transition: 0.2s;
              }
            }
            //  &:hover {
            //    > div > span {
            //     color: #fff;
            //     // background-color: rgba($color: #428dfa, $alpha: 0.8);
            //   }
            //  }
            &.router-link-active, &.active {
              background-color: #fff;
              > div > span {
                color: #fff !important;
                background-color: #428dfa;
              }
            }
            &:active {
              > div > span {
                color: #428dfa;
                // color: #428dfa;
                box-shadow: inset 0px 1px 3px rgba(0, 0, 0, 0.2), 0px 1px 0px white;
                text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
              }
            }
            &.showClassify {
              // background-color: rgb(236, 243, 254);
              // color: #428dfa;
              > div > span {
                color: #428dfa;
                // background-color: #428dfa;
              }
            }
          }
        }
      }
      > div.customer-box {
        float: right;
        color: #888;
        line-height: 65px;
        max-width: 470px;
        text-align: right;
        white-space: nowrap;
        > span {
          font-size: 12px;
          display: inline-block;
          // max-width: 360px;
          overflow: hidden;
          height: 55px;
          vertical-align: top;
          text-align: end;
          overflow-x: auto;
          > span {
            display: inline-block;
            margin-right: 4px;
            max-width: 92px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            vertical-align: -44%;
            cursor: pointer;
            &:hover {
              text-decoration: underline;
            }
          }
          &::-webkit-scrollbar {
            height: 6px;
            // background: #fff;
          }
          &::-webkit-scrollbar-thumb {
            height: 4px;
            background-color: rgba($color: #000000, $alpha: 0.2);
            border-radius: 2px;
            cursor: pointer;
            margin-bottom: 2px;
          }
          > i {
            font-size: 14px;
            height: 55px;
            display: inline-block;
            vertical-align: top;
            &.price {
              // font-weight: 600;
              color: #ff3769;
              font-size: 16px;
            }
            &.title {
              > .r-5 {
                margin-right: 5px;
              }
            }
          }
        }
        > button {
          height: 35px;
          margin: 0 20px 1px;
          padding: 9px 14px;
          background-color: #fff;
          color: #ff3769;
          width: 90px;
          border-color: #ff3769;
          transition: 0.2s;
          &:hover {
            // box-shadow: 0 0 3px #fff;
            // text-shadow: 0 0 1px #fff;
            background-color: #ff3769;
            color: #fff;
          }
          &:active {
            background-color: #e62152;
          }
        }
        // .customer-btn {
        //   font-size: 14px;
        //   > i {
        //     font-size: 15px;
        //     margin-left: 8px;
        //   }
        // }
        > div {
          color: #585858;
          > span {
            cursor: pointer;
            line-height: 30px;
            display: inline-block;
            padding: 0 8px;
            border-radius: 3px;
            outline: none;
            z-index: 3;
            transition: 0.2s;
            // border: 1px solid #428dfa;
            &:hover {
              // background-color: rgba($color: #428dfa, $alpha: 0.3) !important;
              // border-color: #000;
              // background-color:  mix(#428dfa, #000, 90%);;
              color: #333;
              // background-color: #eee;
              box-shadow: 0 0px 2px 1px rgba(66, 141, 250, 0.8);
              // color: mix(#f4a307, #fff, 40%);
              // color: #428dfa;
              > i {
                color: #428dfa;
              }
            }
            &:active {
              color: #428dfa;
              background-color:  rgba(66, 141, 250, 0.1);
            }
          }
        }
      }
    }
  }
  > .recharge-remark {
    position: fixed;
    top: 125px;
    left: 0;
    right: 0;
    bottom: 0;
    height: 0;
    z-index: 666;
    background-color: rgba($color: #000000, $alpha: 0.5);
    opacity: 0;
    transition: opacity 0.2s;
    &.show {
      height: 100%;
    }
    &.showBg {
      opacity: 1;
    }
    > .recharge-box {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 0px;
      background-color: #fff;
      overflow: hidden;
      z-index: -1;
      transition: height .3s cubic-bezier(0.78, 0.14, 0.15, 0.86), opacity .3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
      opacity: 0;
      &.showRechange {
        height: 348px;
        opacity: 1;
        box-shadow: 0 8px 10px -5px rgba(0,0,0,.2), 0 16px 24px 2px rgba(0,0,0,.14), 0 6px 30px 5px rgba(0,0,0,.12);
      }
    }
  }
  .recharge-box {
      // position: absolute;
      // top: 0;
      // left: 0;
      // right: 0;
      // height: 0px;
      background-color: #fff;
      overflow: hidden;
      // z-index: -1;
      // transition: height .3s cubic-bezier(0.78, 0.14, 0.15, 0.86), opacity .3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
      opacity: 0;
      height: 348px;
      opacity: 1;
      &.showRechange {
        height: 348px;
        opacity: 1;
        // box-shadow: 0 8px 10px -5px rgba(0,0,0,.2), 0 16px 24px 2px rgba(0,0,0,.14), 0 6px 30px 5px rgba(0,0,0,.12);
      }
  }
  > .el-drawer__wrapper {
    top: 125px;
    outline: none;
    > div {
      outline: none;
      > div {
        outline: none;
      }
    }
  }
}
.mp-pc-my-set-drop-down-wrap {
  > li {
    font-size: 13px;
    transition: 0.2s;
    margin: 5px 0;
    > i {
      font-size: 16px;
      margin-right: 8px;
      vertical-align: -8%;
    }
    > span {
      font-size: 17px;
      vertical-align: -2%;
      margin-right: 8px;
    }
    &.active {
      color: #428dfa;
      font-weight: 700;
      > i {
        color: #428dfa;
      }
    }
  }
}
</style>
