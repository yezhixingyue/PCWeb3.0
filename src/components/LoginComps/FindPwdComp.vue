<template>
  <section class="mp-pc-login-find-pass-comp-wrap">
    <el-steps :active="active">
      <el-step title="验证身份"></el-step>
      <el-step title="重置登录密码"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    <div class="content">
      <!-- 验证码表单 -->
      <el-form
        :model="codeForm"
        status-icon
        :rules="codeRules"
        ref="codeForm"
        label-width="100px"
        key="find-pwd-form-0001"
        v-if="active === 0"
      >
        <el-form-item prop="Mobile" label="手机号码：">
          <el-input placeholder="请输入手机号码" v-model.trim="Mobile"></el-input>
        </el-form-item>
        <el-form-item prop="VertifyCode" class="code-box" label="短信验证码：">
          <el-input placeholder="请输入短信验证码" v-model.trim="VertifyCode"></el-input>
          <span
            class="span-title-blue"
            :class="canGetCode?'':'disabled'"
            @click="getVertifyCode"
          >{{ codeTitle }}</span>
        </el-form-item>
      </el-form>
      <!-- 密码表单 -->
      <el-form
        :model="pwdForm"
        status-icon
        :rules="pwdRules"
        ref="pwdForm"
        label-width="100px"
        key="find-pwd-form-0002"
        v-if="active === 1"
      >
        <el-form-item label="设置新密码：" prop="Password">
          <el-input placeholder="请输入密码" type="password" v-model.trim="pwdForm.Password"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码：" prop="rePassword">
          <el-input placeholder="请再次输入密码" type="password" v-model.trim="pwdForm.rePassword"></el-input>
        </el-form-item>
      </el-form>
      <div class="res-wrap" v-if="active === 2">
        <i class="iconfont icon-wancheng"></i>修改成功
      </div>
    </div>
    <footer v-if="active === 0 || active === 1">
      <el-button type="primary" @click="next">下一步</el-button>
      <span class="span-title-blue" @click="returnLogin">返回登录界面</span>
    </footer>
  </section>
</template>

<script>
import Cookie from '@/assets/js/Cookie';

export default {
  data() {
    const validateMobile = (rule, value, callback) => {
      if (this.validateCheck(value, this.defineRules.Mobile, callback)) callback();
    };
    const validateVertifyCode = (rule, value, callback) => {
      if (
        this.validateCheck(value, this.defineRules.VertifyCodeRules, callback)
      ) callback();
    };

    const validatePassword = (rule, value, callback) => {
      if (this.validateCheck(value, this.defineRules.Password, callback)) {
        if (this.pwdForm.rePassword !== '') this.$refs.pwdForm.validateField('rePassword');
        callback();
      }
    };
    const validateRePassword = (rule, value, callback) => {
      if (this.validateCheck(value, this.defineRules.Password, callback)) {
        if (this.pwdForm.rePassword !== this.pwdForm.Password) callback(new Error('两次密码输入不一致'));
        else callback();
      }
    };
    return {
      codeRules: {
        Mobile: [{ validator: validateMobile, trigger: 'blur' }],
        VertifyCode: [{ validator: validateVertifyCode, trigger: 'blur' }],
      },
      pwdRules: {
        Password: [{ validator: validatePassword, trigger: 'blur' }],
        rePassword: [{ validator: validateRePassword, trigger: 'blur' }],
      },
      active: 0,
      codeForm: {
        Mobile: '',
        VertifyCode: '',
      },
      pwdForm: {
        Password: '',
        rePassword: '',
      },
      codeTitle: '获取短信验证码',
      timer: null,
      canGetCode: true,
      firstRes: null,
      defineRules: {
        Mobile: [
          { strategy: 'isNotEmpty', errorMsg: '请输入手机号!' },
          { strategy: 'shouldLength:11', errorMsg: '请输入11位手机号码' },
          { strategy: 'isPhone', errorMsg: '手机号码格式不正确' },
        ],
        Password: [
          { strategy: 'isNotEmpty', errorMsg: '请输入密码!' },
          { strategy: 'minLength:6', errorMsg: '密码最小长度为6位' },
          { strategy: 'maxLength:16', errorMsg: '密码最大长度为16位' },
        ],
        nameRules: [{ strategy: 'isNotEmpty', errorMsg: '请输入企业简称' }],
        VertifyCodeRules: [
          { strategy: 'isNotEmpty', errorMsg: '请输入短信验证码' },
          { strategy: 'shouldLength:6', errorMsg: '短信验证码长度为6位' },
        ],
      },
    };
  },
  computed: {
    Mobile: {
      get() {
        return this.codeForm.Mobile;
      },
      set(newVal) {
        this.codeForm.Mobile = newVal.replace(/[^\d.]/g, '');
      },
    },
    VertifyCode: {
      get() {
        return this.codeForm.VertifyCode;
      },
      set(newVal) {
        this.codeForm.VertifyCode = newVal.replace(/[^\d.]/g, '');
      },
    },
  },
  methods: {
    next() {
      if (this.active === 0) {
        this.$refs.codeForm.validate(async (valid) => {
          if (valid) {
            // 成功
            const { Mobile, VertifyCode } = this.codeForm;
            const _obj = { Mobile, VertifyCode };
            const res = await this.api.getCheckCode(_obj);
            if (res.data.Status === 1000) {
              this.firstRes = res.data.Data;
              this.active += 1;
            }
          }
          return false;
        });
      }
      if (this.active === 1) {
        this.$refs.pwdForm.validate(async (valid) => {
          if (valid) {
            // 成功
            const { Password, rePassword } = this.pwdForm;
            const RePassword = rePassword;
            const _obj = { ...this.firstRes, Password, RePassword };
            const res = await this.api.getResetPassword(_obj);
            if (res.data.Status === 1000) {
              this.active += 1;
            }
          }
          return false;
        });
      }
    },
    async getVertifyCode() {
      if (!this.canGetCode) return;
      if (
        this.validateCheck(this.Mobile, this.defineRules.Mobile, (msg) => {
          this.messageBox.failSingle({ msg });
        })
      ) {
        // can
        const res = await this.api.getSmsCode(this.Mobile, 1);
        if (res.data.Status === 1000) {
          this.changeCodeTitleAtSecond();
        }
      }
    },
    changeCodeTitleAtSecond() {
      let _second = 60;
      this.canGetCode = false;
      this.codeTitle = `${_second}秒后重新获取`;
      if (this.timer) clearInterval(this.timer);
      this.timer = setInterval(() => {
        _second -= 1;
        this.codeTitle = `${_second}秒后重新获取`;
        if (_second === 0) {
          this.codeTitle = '重新获取验证码';
          clearInterval(this.timer);
          this.canGetCode = true;
        }
      }, 1000);
    },
    returnLogin() {
      sessionStorage.removeItem('token');
      localStorage.removeItem('token');
      Cookie.removeCookie('token');
      this.$router.replace('/login');
    },
  },
};
</script>

<style lang='scss'>
.mp-pc-login-find-pass-comp-wrap {
  width: 1200px;
  margin: 0 auto;
  > .el-steps {
    width: 808px;
    margin: 0 auto;
    > .el-step {
      font-size: 14px;
      color: #cbcbcb;
      .el-step__icon {
        border-color: #cbcbcb;
        border-width: 1px;
        width: 30px;
        height: 30px;
        text-align: center\0;
        line-height: 28px\9\0;
        > div {
          font-weight: 400;
          font-size: 18px;
          color: #cbcbcb;
        }
      }
      .el-step__line {
        background-color: #e5e5e5;
        height: 4px;
        margin-right: 24px !important;
        margin-left: 24px;
        top: 12px;
      }
      .el-step__head {
        color: #cbcbcb;
        border-color: #e5e5e5;
      }
      .el-step__main {
        padding-top: 10px;
        .el-step__title {
          color: #cbcbcb;
          font-size: 14px;
          font-weight: 400;
          &.is-process {
            color: #428dfa;
          }
        }
      }
      .is-process {
        .el-step__icon {
          background-color: #428dfa;
          border-color: #428dfa;
          > .el-step__icon-inner {
            color: #fff;
          }
        }
      }
      &:first-of-type {
        width: 390px\9\0;
        .el-step__line {
          width: 285px;
          margin-left: 40px;
          // margin-right: 60px;
        }
        .el-step__main .el-step__title {
          margin-left: -12px;
        }
      }
      &:nth-of-type(2) {
        position: relative;
        left: -50px;
        width: 385px\9\0;
        .el-step__line {
          width: 380px;
          margin-left: 45px;
        }
        .el-step__main .el-step__title {
          margin-left: -26px;
        }
      }
    }
  }
  .content {
    height: 295px;
    padding: 132px 370px 0;
    box-sizing: border-box;
    > .el-form {
      .el-form-item__content {
        line-height: 35px;
        .el-input {
          width: 220px;
          margin-right: 20px;
          > input {
            &::placeholder {
              color: #cbcbcb;
            }
            height: 35px;
            line-height: 33px;
          }
          .el-input__suffix {
            display: none;
          }
        }
      }
      .el-form-item__label {
        padding-right: 6px;
        line-height: 35px;
      }
    //   .code-box {
    //     .el-form-item__content {
    //       position: relative;
    //       span.span-title-blue {
    //         position: absolute;
    //       }
    //     }
    //   }
    }
    > .res-wrap {
      text-align: center;
      color: #585858;
      font-size: 18px;
      > i {
        margin-right: 15px;
        font-size: 30px;
        color: #80c269;
        vertical-align: bottom;
      }
    }
  }
  > footer {
    text-align: center;
    padding-right: 12px;
    .span-title-blue {
      font-size: 14px;
      margin-left: 25px;
    }
    > button {
      width: 140px;
    }
  }
}
</style>
