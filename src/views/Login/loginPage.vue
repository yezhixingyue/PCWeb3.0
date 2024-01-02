<template>
  <div class="mp-pc-login-page-wrap">
    <section>
      <header>
        <div class="header-content float">
          <a :href="homeUrl" target="_blank">
            <img src="../../assets/images/logo-white.png" alt="" />
          </a>
          <ul>
            <li>
              <a :href="homeUrl" target="_blank">首页</a>
            </li>
            <li>
              <a :href="`${homeUrl}about.html`" target="_blank">关于我们</a>
            </li>
          </ul>
        </div>
      </header>
      <div class="content">
        <div
          class="panel"
          v-loading="panelLoading"
          :element-loading-text="loadingText"
        >
          <el-tabs v-model="activeName" stretch>
            <el-tab-pane label="用户登录" name="first"></el-tab-pane>
            <el-tab-pane label="新用户注册" name="second"></el-tab-pane>
          </el-tabs>
          <div class="panel-content">
            <div class="hi">
              <span v-if="authData && !authData.Token">
                {{ authData.NickName }} ，您尚未绑定名片之家账号，现在{{ activeName === 'first' ? '登录' : '注册' }}完成绑定，即可使用{{ ThirdTypeName }}扫码登录
              </span>
            </div>
            <keep-alive>
              <LoginComp
                v-if="activeName === 'first'"
                @setPanelLoading="setPanelLoading"
                @changePanel="setActiveName"
                @setAuthData="setAuthData"
                @wxLogin="onWxLoginClick(true)"
                :ThirdAuthList="ThirdAuthList"
              />
            </keep-alive>
            <keep-alive>
              <RegisterComp
                v-if="activeName === 'second'"
                @setAgreeView="setAgreeView"
                @setUserAgreeView='setUserAgreeView'
                @setPanelLoading="setPanelLoading"
                @changePanel="setActiveName"
                @setAuthData="setAuthData"
                :ThirdAuthList="ThirdAuthList"
              />
            </keep-alive>
          </div>
          <WxLoginComp v-if="isWxLogin" @close="onWxLoginClick(false)" showClose  />
        </div>
      </div>
      <LegalAgreementDialog v-model="agreementvisible" />
      <UserAgreement v-model="userAgreementvisible" />
    </section>
  </div>
</template>

<script>

import RegisterComp from '@/components/LoginComps/RegisterComp.vue';
import LegalAgreementDialog from '@/components/common/AgreementComps/LegalAgreementDialog.vue';
import UserAgreement from '@/components/common/AgreementComps/UserAgreement.vue';
import { homeUrl } from '@/assets/js/setup';
import { ThirdTypeEnum } from '@/assets/js/ClassType/ThirdCodeHandler';
import { getNameFromListByIDs } from '@/assets/js/utils/utils';
import getEnumList from '@/assets/js/utils/getEnumList';
import WxLoginComp from '../../components/LoginComps/WxLoginComp.vue';
import LoginComp from '../../components/LoginComps/LoginComp.vue';

export default {
  components: {
    LoginComp,
    RegisterComp,
    LegalAgreementDialog,
    UserAgreement,
    WxLoginComp,
  },
  data() {
    return {
      activeName: 'first',
      panelLoading: false,
      loadingText: '',
      agreementvisible: false,
      userAgreementvisible: false,
      homeUrl,
      isWxLogin: false,
      authData: null,
    };
  },
  computed: {
    /** 转换authData为ThirdAuthList 用于登录和注册提交 */
    ThirdAuthList() {
      if (!this.authData) return null;

      return [this.authData];
    },
    ThirdTypeName() {
      if (this.authData) {
        const { ThirdType } = this.authData;
        const ThirdTypeEnumList = getEnumList(ThirdTypeEnum);
        return getNameFromListByIDs(ThirdType, ThirdTypeEnumList);
      }

      return '';
    },
  },
  methods: {
    setActiveName(val) {
      if (['first', 'second'].includes(val)) this.activeName = val;
    },
    setPanelLoading([bool, text]) {
      this.panelLoading = bool;
      this.loadingText = text;
    },
    setAgreeView() {
      this.agreementvisible = true;
    },
    setUserAgreeView() {
      this.userAgreementvisible = true;
    },
    onWxLoginClick(bool) {
      this.isWxLogin = bool;
    },
    setAuthData(data) {
      this.authData = data;
    },
  },
};
</script>

<style lang='scss'>
.mp-pc-login-page-wrap {
  height: 100vh;
  width: 100%;
  min-height: 660px;
  background-color: rgb(40, 40, 40);
  > section {
    height: 100vh;
    width: 100%;
    min-height: 660px;
    overflow: auto;
    // padding-top: 25px;
    box-sizing: border-box;
    background: url("../../assets/images/login-bg.png") no-repeat center
      center/cover;

    > header {
      height: 80px;
      width: 100%;
      background-color: rgba($color: #000000, $alpha: 0.25);
      // box-shadow: inset 0 0 13px #111;
      > .header-content {
        width: 950px;
        margin: 0 auto;
        > a > img {
          float: left;
          width: 147px;
          height: 32px;
          margin-top: 23px;
        }
        > ul {
          float: right;
          padding-right: 75px;
          > li {
            float: left;
            height: 80px;
            width: 120px;
            > a {
              height: 100%;
              width: 100%;
              color: #fff;
              text-decoration: unset;
              font-size: 16px;
              // font-weight: 600;
              text-align: center;
              display: block;
              line-height: 78px;
              &:hover {
                // background-image: linear-gradient(
                //   to bottom,
                //   #e5efd8, #2260ff, rgba(34,96,255,0),
                //   transition 25%
                // );
                background-image: linear-gradient(
                  to bottom,
                  rgba(34, 96, 255, 0),
                  rgb(88, 88, 88)
                );
                position: relative;
                &::after {
                  height: 5px;
                  width: 100%;
                  background-color: rgb(66, 141, 250);
                  position: absolute;
                  content: "";
                  left: 0;
                  bottom: 0;
                }
              }
            }
          }
        }
      }
    }
    > div.content {
      width: 475px;
      height: calc(100% - 105px);
      margin: 0 auto;
      position: relative;
      > .panel {
        width: 100%;
        min-height: 460px;
        position: absolute;
        top: 50%;
        transform: translateY(-53.7%);
        background-color: #fff;
        border-radius: 5px;
        box-sizing: border-box;
        padding: 0 50px;
        .el-loading-spinner .circular {
          height: 26px;
          width: 26px;
          margin-top: -20px;
          margin-bottom: 10px;
        }
        > .el-tabs {
          > .el-tabs__header {
            .el-tabs__nav-wrap {
              .el-tabs__item {
                height: 80px;
                font-size: 16px;
                padding-top: 28px;
                &.is-active {
                  font-size: 18px;
                }
                // transition: 0.1s;
              }
              .el-tabs__active-bar {
                height: 1px;
                // position: relative;
                &::after {
                  content: "";
                  width: 10px;
                  height: 10px;
                  display: block;
                  position: relative;
                  left: 75px;
                  top: -13px;
                  transform: rotateZ(45deg);
                  background-color: #428dfa;
                }
                &::before {
                  content: "";
                  width: 8px;
                  height: 9px;
                  display: block;
                  position: relative;
                  top: -3px;
                  left: 76px;
                  transform: rotateZ(45deg);
                  background-color: #fff;
                  z-index: 99;
                }
                &:after,
                &:before {
                  opacity: 0\9\0;
                }
              }
              &::after {
                height: 1px;
              }
            }
          }
        }
        .panel-content {
          // padding-top: 40px;

          > .hi {
            min-height: 40px;
            box-sizing: border-box;
            font-size: 13px;
            padding: 0 15px;
            line-height: 19px;
            letter-spacing: 1px;
            padding-bottom: 17px;
            padding-top: 4px;
          }

          .el-form-item {
            .el-form-item__content {
              margin: 0 15px !important;
              > .el-checkbox-group {
                float: left;
                .is-checked .el-checkbox__label {
                  color: #585858;
                }
              }
              > span {
                float: right;
              }
              > button {
                width: 100%;
                // &:hover {
                //   background-color: #366eff;
                // }
                // &:active {
                //   background-color: #2260ff;
                // }
              }
              > p {
                text-align: center;
                margin-top: 16px;
              }
              .el-input__inner {
                padding-left: 55px;
              }
              .el-input__prefix {
                > i {
                  font-size: 18px;
                  color: #cbcbcb;
                }
                left: 11px;
                &::after {
                  content: "";
                  position: absolute;
                  height: 25px;
                  width: 1px;
                  background-color: #e5e5e5;
                  right: -14px;
                  top: 8px;
                }
              }
            }
            margin-bottom: 25px;
            &.rememberPwd-box {
              margin-top: -13px;
              margin-bottom: 39px;
            }
            &.code-box {
              > .el-form-item__content {
                font-size: 13px;

                .el-input__inner {
                  padding-right: 130px;
                }
                .el-input__suffix {
                  width: 120px;
                  text-align: center;
                  pointer-events: auto;
                  &::before {
                    height: 25px;
                    width: 1px;
                    position: absolute;
                    left: -1px;
                    top: 8px;
                    content: "";
                    background-color: #e5e5e5;
                  }
                }
              }
              margin-bottom: 4px;
              &.img-code-box {
                margin-bottom: 29px;
                > .el-form-item__content {
                  .el-input__suffix {
                    width: 138px;
                    height: 38px;
                    margin-top: 1px;
                    margin-right: 1px;
                    text-align: center;
                    // border-left: 1px solid #eee;
                    line-height: 38px;
                    background-color: #eee;
                    border-radius: 4px;
                    overflow: hidden;
                    right: 0;
                    > .el-input__suffix-inner {
                      width: 138px;
                      height: 38px;
                      display: inline-block;
                      line-height: 38px;
                      > img {
                        cursor: pointer;
                      }
                    }
                    &::before {
                      display: none;
                    }
                  }
                }
              }
            }
            &.agreement {
              > .el-form-item__content {
                font-size: 13px;
                .el-checkbox__label {
                  font-size: 13px;
                  color: #585858;
                }
                > i {
                  cursor: pointer;
                  transition: color 0.3s;
                  margin-left: 8px;
                  color: #585858;
                  &:hover {
                    color: #428dfa;
                    text-decoration: underline;
                  }
                }
              }
            }
          }
        }

        .wx-login-content {
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          background-color: #fff;
          z-index: 9;
        }
      }
    }
  }
}
</style>
