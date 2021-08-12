<template>
  <section class="mp-pc-find-password-page-wrap">
    <header class="float">
      <div class="header-content float">
        <div class="header-left is-font-18">
          <img src="../../assets/images/logo-color.png" alt />
          <span>找回密码</span>
        </div>
        <div class="header-right">
          <!-- <i class="iconfont icon-Double-Arrow-L" style="font-size: 30px"></i> -->
          <span class="is-font-14 span-title-blue" @click="onReturnClick">
            <i>&lt;&lt;</i>返回登录界面
          </span>
        </div>
      </div>
    </header>
    <div class="content">
      <FindPwdComp />
    </div>
    <footer>
      <BlueInfoFooter />
    </footer>
  </section>
</template>

<script>
import BlueInfoFooter from '@/components/common/BlueInfoFooter.vue';
import FindPwdComp from '@/components/LoginComps/FindPwdComp.vue';
import Cookie from '@/assets/js/Cookie';

export default {
  components: {
    BlueInfoFooter,
    FindPwdComp,
  },
  methods: {
    onReturnClick() {
      sessionStorage.removeItem('token');
      localStorage.removeItem('token');
      Cookie.removeCookie('token');
      this.$router.replace('/login');
    },
  },
};
</script>

<style lang='scss'>
.mp-pc-find-password-page-wrap {
  height: 100vh;
  width: 100%;
  padding-top: 80px;
  box-sizing: border-box;
  min-height: 800px;
  > header {
    position: fixed;
    height: 80px;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1500;
    background-color: #fff;
    box-shadow: 0px 5px 14px 1px rgba(238, 238, 238, 0.6);
    > .header-content {
      width: 1200px;
      margin: 0 auto;
      > .header-left {
        float: left;
        line-height: 80px;
        > img {
          vertical-align: middle;
          margin-right: 35px;
          width: 142px;
          height: 35px;
        }
        color: #585858;
      }
      > .header-right {
        float: right;
        position: relative;
        height: 80px;
        width: 150px;
        > span {
          position: absolute;
          bottom: 17px;
          width: 100%;
          text-align: right;
          > i {
            margin-right: 8px;
          }
        }
      }
    }
  }
  > .content {
    height: calc(100% - 144px);
    padding-top: 150px;
    box-sizing: border-box;
    background-color: #fff;
  }
}
</style>
