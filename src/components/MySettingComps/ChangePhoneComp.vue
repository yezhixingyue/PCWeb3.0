<template>
  <section class="mp-pc-my-setting-page-change-phone-comp-wrap">
    <el-steps :active="active">
       <!-- align-center -->
      <el-step title="验证身份"></el-step>
      <el-step title="修改手机号"></el-step>
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
        v-if="active === 0 && customerInfo"
      >
        <!-- <el-form-item prop="Mobile" label="手机号码：">
          <el-input placeholder="请输入手机号码" v-model.trim="Mobile"></el-input>
        </el-form-item> -->
        <div class="before-phone-wrap">
          <span class="title">手机号码： </span>
          <span>{{formatMobile(customerInfo.Account.Mobile)}}</span>
        </div>
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
        :model="newMobileForm"
        status-icon
        :rules="newMobileRules"
        ref="newMobileForm"
        label-width="100px"
        key="find-pwd-form-0002"
        v-if="active === 1"
      >
        <el-form-item label="新手机号：" prop="newMobile">
          <el-input placeholder="请输入新手机号" v-model.trim="newMobileForm.newMobile"></el-input>
        </el-form-item>
        <el-form-item prop="VertifyCode" class="code-box" label="短信验证码：">
          <el-input placeholder="请输入短信验证码" v-model.trim="VertifyCode2"></el-input>
          <span
            class="span-title-blue"
            :class="canGetCode2?'':'disabled'"
            @click="getVertifyCode2"
          >{{ codeTitle2 }}</span>
        </el-form-item>
      </el-form>
      <div class="res-wrap" v-if="active === 2">
        <i class="iconfont icon-wancheng"></i>修改成功
      </div>
    </div>
    <footer v-if="active === 0 || active === 1">
      <el-button type="primary" @click="next">下一步</el-button>
      <!-- <span class="span-title-blue" @click="() => this.$router.replace('/login')">返回登录界面</span> -->
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';

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

    return {
      codeRules: {
        // Mobile: [{ validator: validateMobile, trigger: 'blur' }],
        VertifyCode: [{ validator: validateVertifyCode, trigger: 'blur' }],
      },
      newMobileRules: {
        newMobile: [{ validator: validateMobile, trigger: 'blur' }],
        VertifyCode: [{ validator: validateVertifyCode, trigger: 'blur' }],
      },
      active: 0,
      codeForm: {
        Mobile: '',
        VertifyCode: '',
      },
      newMobileForm: {
        newMobile: '',
        VertifyCode: '',
      },
      codeTitle: '获取短信验证码',
      codeTitle2: '获取短信验证码',
      timer: null,
      canGetCode: true,
      canGetCode2: true,
      firstRes: null,
      defineRules: {
        Mobile: [
          { strategy: 'isNotEmpty', errorMsg: '请输入手机号!' },
          { strategy: 'shouldLength:11', errorMsg: '请输入11位手机号码' },
          { strategy: 'isPhone', errorMsg: '手机号码格式不正确' },
        ],
        VertifyCodeRules: [
          { strategy: 'isNotEmpty', errorMsg: '请输入短信验证码' },
          { strategy: 'shouldLength:6', errorMsg: '短信验证码长度为6位' },
        ],
      },
    };
  },
  computed: {
    ...mapState('common', ['customerInfo']),
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
        this.codeForm.VertifyCode = newVal.replace(/[^\d]/g, '');
      },
    },
    VertifyCode2: {
      get() {
        return this.newMobileForm.VertifyCode;
      },
      set(newVal) {
        this.newMobileForm.VertifyCode = newVal.replace(/[^\d]/g, '');
      },
    },
  },
  watch: {
    customerInfo() {
      // // console.log(newVal, 'customerInfo');
    },
  },
  methods: {
    next() {
      if (this.active === 0) {
        this.$refs.codeForm.validate(async (valid) => {
          if (valid) {
            // 成功
            const { VertifyCode } = this.codeForm;
            // const { Mobile } = this.customerInfo;
            const _obj = { VertifyCode };
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
        this.$refs.newMobileForm.validate(async (valid) => {
          if (valid) {
            // 成功
            const { newMobile, VertifyCode } = this.newMobileForm;
            const Mobile = newMobile;
            const { Sign, TimeStamp, UserID } = this.firstRes;
            const _obj = {
              Sign, TimeStamp, UserID, Mobile, VertifyCode, Terminal: 1,
            };
            const res = await this.api.getCustomerChangeMobile(_obj);
            if (res.data.Status === 1000) {
              this.active += 1;
              this.$store.commit('common/changeCustomerPhone', newMobile);
              // this.$store.dispatch('common/getCustomerDetail');
            }
          }
          return false;
        });
      }
    },
    async getVertifyCode() {
      if (!this.canGetCode) return;
      const res = await this.api.getSmsCode(null, 2);
      if (res.data.Status === 1000) {
        this.changeCodeTitleAtSecond();
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
    async getVertifyCode2() {
      if (!this.canGetCode2) return;
      const res = await this.api.getSmsCode(this.newMobileForm.newMobile, 3);
      if (res.data.Status === 1000) {
        this.changeCodeTitleAtSecond2();
      }
    },
    changeCodeTitleAtSecond2() {
      let _second = 60;
      this.canGetCode2 = false;
      this.codeTitle2 = `${_second}秒后重新获取`;
      if (this.timer) clearInterval(this.timer);
      this.timer = setInterval(() => {
        _second -= 1;
        this.codeTitle2 = `${_second}秒后重新获取`;
        if (_second === 0) {
          this.codeTitle2 = '重新获取验证码';
          clearInterval(this.timer);
          this.canGetCode2 = true;
        }
      }, 1000);
    },
    formatMobile(mobile) {
      if (!mobile || mobile.length !== 11) return '';
      const _arr = mobile.split('');
      const _arr1 = _arr.map((it, i) => {
        if (i > 2 && i < 7) return '*';
        return it;
      });
      return _arr1.join('');
    },
  },
};
</script>

<style lang='scss'>
.mp-pc-my-setting-page-change-phone-comp-wrap {
  width: 100%;
  margin: 0 auto;
  > .el-steps {
    width: 620px;
    // margin: 0 auto;
    margin-left: 110px;
    margin-top: 84px;
    > .el-step {
      font-size: 14px;
      color: #cbcbcb;
      .el-step__icon {
        border-color: #cbcbcb;
        border-width: 1px;
        width: 30px;
        height: 30px;
        line-height: 28px\9\0;
        text-align: center\0;
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
        margin-left: 50px;
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
        width: 280px;
        .el-step__main {
          .el-step__title {
            margin-left: -12px;
          }
        }
      }
      &:nth-of-type(2) {
        position: relative;
        width: 280px;
        .el-step__main {
          .el-step__title {
            margin-left: -18px;
          }
        }
      }
      &:last-of-type {
        .el-step__main {
          .el-step__title {
            margin-left: 2px;
          }
        }
      }
    }
  }
  .content {
    height: 282px;
    // padding: 132px 370px 0;
    padding-top: 127px;
    padding-left: 250px;
    box-sizing: border-box;
    > .el-form {
      .el-form-item__content {
        line-height: 35px;
        .el-input {
          width: 170px;
          margin-right: 20px;
          > input {
            &::placeholder {
              color: #cbcbcb;
            }
            height: 35px;
            line-height: 35px;
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
      > .before-phone-wrap {
        margin-bottom: 35px;
        > .title {
          width: 94px;
          display: inline-block;
          text-align: right;
          padding-right: 6ox;
          margin-right: 10px;
        }
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
      // text-align: center;
      margin-left: 120px;
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
    padding-right: 85px;
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
