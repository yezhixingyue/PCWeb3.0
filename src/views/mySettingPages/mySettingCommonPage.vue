<template>
  <section class="mp-pc-my-setting-common-page-wrap">
    <header></header>
    <div class="content">
      <ul class="aside">
        <!-- <router-link tag="li" to="/mySetting/account">企业信息</router-link>
        <router-link tag="li" to="/mySetting/authentication" v-if="this.customerInfo && !this.customerInfo.Account.IsBranch">企业认证</router-link> -->
        <router-link tag="li" to="/MemberCenter" v-if="showMember && customerInfo.IsUpDown">会员中心</router-link>
        <router-link tag="li" to="/mySetting/address">收货地址</router-link>
        <router-link tag="li" to="/mySetting/couponCenter">领券中心</router-link>
        <router-link tag="li" to="/mySetting/certificate">证书管理</router-link>
        <router-link tag="li" to="/mySetting/myCoupons">我的优惠券</router-link>
        <router-link tag="li" to="/mySetting/subAccountManage">子账号管理</router-link>
        <!-- <router-link tag="li" to="/mySetting/changePwd">修改密码</router-link>
        <router-link tag="li" to="/mySetting/changeMobile">修改手机号</router-link> -->
        <router-link tag="li" to="/mySetting/invoiceMakeup"
          v-if="hasInvoicePermission" :class="{disabled: $route.name==='InvoiceCombineMakeupPage'}">发票开具</router-link>
        <router-link tag="li" to="/mySetting/invoiceSearch"
          v-if="hasInvoicePermission" :class="{disabled: $route.name==='InvoiceSearchDetailPage'}">发票查询</router-link>
        <router-link tag="li" to="/mySetting/accountAndSecurity" :class="{active: [
                  'accountAndSecurity',
                  'mySettingAccount',
                  'mySettingAuthentication',
                  'mySettingChangePwd',
                  'mySettingChangeMobile',
                  ].includes($route.name)}">账号与安全</router-link>
        <router-link tag="li" to="/mySetting/setting">其他设置</router-link>
      </ul>
      <div class="right">
        <!-- <keep-alive> -->
          <router-view></router-view>
        <!-- </keep-alive> -->
      </div>
    </div>
    <footer></footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('common', ['customerInfo', 'showMember']),
    _route() {
      return this.$route;
    },
    hasInvoicePermission() {
      return this.customerInfo && this.customerInfo.PermissionInfo?.ApplyInvoice;
    },
  },
};
</script>

<style lang='scss'>
.mp-pc-my-setting-common-page-wrap {
  width: 100%;
  background-color: #fff;
  > .content {
    width: 1200px;
    margin: 0 auto;
    padding-top: 30px;
    min-height: calc(100vh - 160px - 70px);
    > .aside {
      width: 160px;
      display: inline-block;
      vertical-align: top;
      // height: 855px;
      border-right: 1px solid #eee;
      // height: calc(100vh - 160px - 70px - 156px);
      min-height: 410px;
      padding-top: 10px;
      box-sizing: border-box;
      > li {
        height: 40px;
        line-height: 40px;
        padding-left: 38px;
        margin: 13px 0;
        // box-sizing: border-box;
        transition: 0.2s;
        &::after {
          content: '';
          height: 100%;
          width: 3px;
          position: absolute;
          background-color: #428dfa;
          top: 0;
          right: 0;
          opacity: 0;
          transition: 0.2s;
          visibility: hidden;
        }
        &.router-link-active, &.active {
          color: #428dfa;
          font-weight: 700;
          background-color: #e9f0fa;
          position: relative;
          visibility: visible;
          &::after {
            opacity: 1;
          }
        }
        cursor: pointer;
        &:hover {
          color: #428dfa;
          background-color: #e9f0fa;
        }
        &.disabled {
          pointer-events: none;
        }
      }
    }
    > .right {
      width: 960px;
      vertical-align: top;
      display: inline-block;
      padding-left: 80px;
      // height: calc(100vh - 160px - 70px - 156px);
      // min-height: 410px;
      // overflow-y: auto;
    }
  }
  > header, > footer {
    height: 25px;
    width: 100%;
    background-color: rgb(245, 245, 245);
  }
}
</style>
