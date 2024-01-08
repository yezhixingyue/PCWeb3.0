<template>
  <article class="my-setting-account-and-security-page-wrap">
    <!-- 认证信息 -->
    <section style="color: #341450;">
      <header class="blue-v-line is-bold is-black">认证信息</header>
      <main>
        <!-- 企业信息 -->
        <div class="item-box qiyeinfo">
          <h4 class="title">企业信息</h4>
          <div class="mt-30">每月可修改 <i class="is-pink">1</i> 次</div>
          <div class="mt-12 underline text-menu" @click="(e) => onclick(e, '/mySetting/account')">前往查看>></div>
        </div>

        <!-- 企业认证 -->
        <div class="item-box qiyeauth" v-if="customerInfo && !customerInfo.Account.IsBranch">
          <h4 class="title">
            <span>企业认证</span>
            <span class="auth-status" v-if="curAuthInfo" :class="curAuthInfo.Color">{{ curAuthInfo.Name }}</span>
          </h4>
          <div class="mt-30">当前认证企业:</div>
          <div class="mt-12 qiye-name text-menu" v-if="authCompanyInfo" :title="authCompanyInfo.CompanyName"
            @click="(e) => onclick(e, '/mySetting/authentication')">
            <img src="@/assets/images/AccountAndSecurity/v.png" alt="">
            <span class="underline">{{ authCompanyInfo.CompanyName }}</span>
          </div>
        </div>
      </main>
    </section>

    <!-- 账号绑定 -->
    <section style="color: #022233;">
      <header class="blue-v-line is-bold is-black">账号绑定</header>
      <main>
        <!-- 修改手机号 -->
        <div class="item-box changemobile">
          <h4 class="title">修改手机号</h4>
          <div class="mt-18 mid">{{ mobile }}</div>
          <div class="mt-16">
            <button class="cyan" @click="(e) => onclick(e, '/mySetting/changeMobile')">修改号码>></button>
          </div>
        </div>

        <!-- 微信账号 -->
        <div class="item-box bindwechat">
          <h4 class="title">微信账号</h4>
          <div class="mt-18 mid" :title="wechatBindInfo ? wechatBindInfo.NickName : ''">{{wechatBindInfo ? wechatBindInfo.NickName : ''}}</div>
          <div class="mt-16">
            <button class="cyan" @click="e => onclick(e, 'wechat')">{{wechatBindInfo ? '解除绑定' : '扫码绑定'}}</button>
          </div>
        </div>

        <!-- QQ账号 -->
        <div class="item-box bindqq">
          <h4 class="title">QQ账号</h4>
          <div class="mt-18 mid" :title="qqBindInfo ? qqBindInfo.NickName : ''">{{qqBindInfo ? qqBindInfo.NickName : ''}}</div>
          <div class="mt-16">
            <button class="cyan" @click="e => onclick(e, 'qq')">{{qqBindInfo ? '解除绑定' : '扫码绑定'}}</button>
          </div>
        </div>
      </main>
    </section>

    <!-- 密码安全 -->
    <section style="color: #5D1D00">
      <header class="blue-v-line is-bold is-black">密码安全</header>
      <main>
        <!-- 修改手机号 -->
        <div class="item-box changepwd">
          <h4 class="title">修改密码</h4>
          <div class="mt-54">
            <button class="plain-orange" @click="(e) => onclick(e, '/mySetting/changePwd')">前往修改>></button>
          </div>
        </div>
      </main>
    </section>

    <!-- 三方解绑弹窗 -->
    <ThirdUnbindDialog :visible.sync="visible" :ThirdType="ThirdType" />

    <!-- 微信绑定弹窗 -->
    <WechatBindDialog v-if="!wechatBindInfo" :visible.sync="wxBindVisible" />
  </article>
</template>

<script>
import { mapState } from 'vuex';
import ThirdCodeHandler, { ThirdTypeEnum } from '@/assets/js/ClassType/ThirdCodeHandler';
import WechatBindDialog from '@/components/MySettingComps/WechatBindDialog.vue';
import AuthStatusHandler from './js/AuthStatusHandler';
import ThirdUnbindDialog from './components/ThirdUnbindDialog.vue';

export default {
  components: {
    ThirdUnbindDialog,
    WechatBindDialog,
  },
  computed: {
    ...mapState('common', ['customerInfo']),
    ...mapState('Authentication', ['authCompanyInfo']),
    mobile() {
      if (!this.customerInfo) return '';
      return this.$utils.formatMobile(this.customerInfo.Account.Mobile);
    },
    wechatBindInfo() {
      return ThirdCodeHandler.getThirdBindInfo(this.customerInfo, ThirdTypeEnum.wechat.ID);
    },
    qqBindInfo() {
      return ThirdCodeHandler.getThirdBindInfo(this.customerInfo, ThirdTypeEnum.QQ.ID);
    },
    curAuthInfo() {
      return this.authCompanyInfo ? AuthStatusHandler.getAuthInfo(this.authCompanyInfo.Status) : null;
    },
  },
  data() {
    return {
      visible: false,
      ThirdType: -1, // ThirdTypeEnum
      wxBindVisible: false,
    };
  },
  methods: {
    handleWxBind() {
      this.ThirdType = ThirdTypeEnum.wechat.ID;

      if (this.wechatBindInfo) { // 解绑微信
        this.visible = true;
        return;
      }

      // 微信绑定
      this.wxBindVisible = true;
    },
    handleQQBind() {
      this.ThirdType = ThirdTypeEnum.QQ.ID;

      if (this.qqBindInfo) { // 解绑QQ
        this.visible = true;
        return;
      }

      // QQ绑定
      ThirdCodeHandler.onLoginByQQClick(this.$route);
    },
    onclick(e, type) {
      e.target.blur();

      switch (type) {
        case 'wechat': // 微信绑定或解绑
          this.handleWxBind();
          break;

        case 'qq':
          this.handleQQBind();
          break;

        default: // 跳转页面 ?
          if (type) this.$router.push({ path: type });
          break;
      }
    },
    handleBindSuccess(bool, result) {
      if (result.query) {
        this.$router.replace({ query: result.query });
      }
      const cb = () => {
        if (bool) {
          this.$store.commit('common/handleThirdBind', { isBind: true, info: result.authData });
        }
      };

      if (bool) this.messageBox.successSingle({ title: '绑定成功', successFunc: cb, failFunc: cb });
      else cb();
    },
    getAuthCompanyInfo() {
      if (this.customerInfo && !this.customerInfo.Account.IsBranch && !this.authCompanyInfo) this.$store.dispatch('Authentication/getAuthCompanyInfo');
    },
  },
  watch: {
    customerInfo: {
      handler(newVal, oldVal) {
        if (newVal && !oldVal) this.getAuthCompanyInfo();
      },
    },
  },
  mounted() {
    ThirdCodeHandler.bindByThirdCode(this.$route.query, this.handleBindSuccess); // 处理微信等三方绑定
    this.getAuthCompanyInfo();
  },
};
</script>
<style lang='scss'>
.my-setting-account-and-security-page-wrap {
  > section {
    padding-bottom: 30px;
    > main {
      padding-top: 20px;

      .item-box {
        width: 260px;
        height: 140px;
        box-sizing: border-box;
        padding: 20px;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        line-height: 20px;
        font-size: 14px;
        display: inline-block;
        vertical-align: top;
        background-color: #eee;
        border-radius: 8px;

        h4.title {
          font-weight: 700;
          font-size: 16px;
        }

        .qiye-name {
          img {
            width: 20px;
            height: 20px;
          }
          .underline {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 193px;
            margin-left: 5px;
          }
        }

        .mid {
          height: 20px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-indent: 4px;
        }

        & + .item-box {
          margin-left: 58px;
        }

        &.qiyeinfo {
          background-image: url('../../../assets/images/AccountAndSecurity/qiyeinfo.png');
        }
        &.qiyeauth {
          background-image: url('../../../assets/images/AccountAndSecurity/qiyeauth.png');
        }
        &.changemobile {
          background-image: url('../../../assets/images/AccountAndSecurity/changemobile.png');
        }
        &.bindwechat {
          background-image: url('../../../assets/images/AccountAndSecurity/bindwechat.png');
        }
        &.bindqq {
          background-image: url('../../../assets/images/AccountAndSecurity/bindqq.png');
        }
        &.changepwd {
          background-image: url('../../../assets/images/AccountAndSecurity/changepwd.png');
        }
      }

      .auth-status {
        font-size: 11px;
        font-weight: 400;
        height: 19px;
        box-sizing: border-box;
        padding: 0 8px;
        line-height: 17px;
        display: inline-block;
        vertical-align: top;
        margin-left: 10px;
        border-radius: 10px;
        border: 1px solid #000;

        &.pink {
          color: #ff3769;
          border-color: #ff3769;
          background-color: lighten($color: #ff3769, $amount: 45);
        }
        &.orange {
          color: #F4A307;
          border-color: #F4A307;
          background-color: lighten($color: #F4A307, $amount: 45);
        }
        &.green {
          color: #52C41A;
          border-color: #52C41A;
          background-color: lighten($color: #52C41A, $amount: 45);
          background-color: #CFFFB8;
        }
        &.red {
          color: #f00;
          border-color: #f00;
          background-color: lighten($color: #f00, $amount: 45);
        }
      }
    }
  }

  button {
    outline: none;
    border: none;
    line-height: 24px;
    border: 1px solid #fff;
    box-sizing: border-box;
    font-size: 14px;
    padding: 0 12px;
    border-radius: 4px;
    cursor: pointer;
    transition: 0.1s ease-in-out;
    transition-property: background-color border-color;

    &.cyan {
      background-color: #00A7B4;
      border-color: #00A7B4;
      color: white;
      &:hover {
        background-color: lighten(#00A7B4, 4);
        border-color: lighten(#00A7B4, 4);
      }
      &:active {
        background-color: darken(#00A7B4, 4);
        border-color: darken(#00A7B4, 4);
      }
    }
    &.plain-orange {
      background-color: #fff;
      border-color: #5D1D00;
      color: #5D1D00;

      &:hover {
        background-color: lighten(#5D1D00, 75);
      }
      &:active {
        background-color: lighten(#5D1D00, 70);
      }
    }
  }

  .underline {
    position: relative;
    display: inline-block;
    padding-right: 2px;

    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 1px;
      background-color: #341450;
      bottom: 1px;
      left: 0;
    }
  }

  .text-menu {
    cursor: pointer;
    transition: opacity 0.1s ease-in-out;

    &:hover {
      opacity: 0.8;
    }
    &:active {
      opacity: 1;
    }
  }
}
</style>
