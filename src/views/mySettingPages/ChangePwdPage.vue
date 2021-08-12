<template>
  <section class="mp-pc-my-setting-page-change-pwd-page-wrap">
    <header class="blue-v-line is-bold is-black">修改当前账户密码</header>
    <div class="content">
      <el-form :model="changePwdForm" :rules="rules" ref="changePwdForm" label-width="100px" v-if="beforeChange">
        <el-form-item prop="OldPassword" label="旧密码：">
          <el-input type="password" clearable v-model.trim="changePwdForm.OldPassword">
          </el-input>
        </el-form-item>
        <el-form-item prop="Password" label="新密码：">
          <el-input type="password" clearable v-model.trim="changePwdForm.Password">
          </el-input>
        </el-form-item>
        <el-form-item prop="rePassword"  label="确认新密码：">
          <el-input type="password" clearable v-model.trim="changePwdForm.rePassword">
          </el-input>
        </el-form-item>
        <el-button type="primary" @click="submitForm('changePwdForm')">保存</el-button>
      </el-form>
      <div v-else class="success-box">
        <i class="iconfont icon-wancheng"></i>修改成功
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      if (this.validateCheck(value, this.defineRules.Password1, callback)) {
        if (this.changePwdForm.rePassword !== '') this.$refs.changePwdForm.validateField('rePassword');
        callback();
      }
    };
    const validateRePassword = (rule, value, callback) => {
      if (this.validateCheck(value, this.defineRules.Password2, callback)) {
        if (this.changePwdForm.rePassword !== this.changePwdForm.Password) callback(new Error('两次新密码输入不一致'));
        else callback();
      }
    };
    const validateOldPassword = (rule, value, callback) => {
      if (this.validateCheck(value, this.defineRules.Password3, callback)) callback();
    };
    return {
      rules: {
        Password: [
          { validator: validatePassword, trigger: 'blur' },
        ],
        rePassword: [
          { validator: validateRePassword, trigger: 'blur' },
        ],
        OldPassword: [
          { validator: validateOldPassword, trigger: 'blur' },
        ],
      },
      defineRules: {
        Password1: [
          { strategy: 'isNotEmpty', errorMsg: '请输入新密码!' },
          { strategy: 'minLength:6', errorMsg: '密码最小长度为6位' },
          { strategy: 'maxLength:16', errorMsg: '密码最大长度为16位' },
        ],
        Password2: [
          { strategy: 'isNotEmpty', errorMsg: '请输入确认新密码!' },
          { strategy: 'minLength:6', errorMsg: '密码最小长度为6位' },
          { strategy: 'maxLength:16', errorMsg: '密码最大长度为16位' },
        ],
        Password3: [
          { strategy: 'isNotEmpty', errorMsg: '请输入旧密码!' },
          { strategy: 'minLength:6', errorMsg: '密码最小长度为6位' },
          { strategy: 'maxLength:16', errorMsg: '密码最大长度为16位' },
        ],
      },
      changePwdForm: {
        Password: '',
        rePassword: '',
        OldPassword: '',
      },
      beforeChange: true,
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 成功
          const { OldPassword, Password } = this.changePwdForm;
          const _obj = { OldPassword, Password };
          const res = await this.api.getCustomerChangePassword(_obj);
          if (res.data.Status === 1000) {
            this.beforeChange = false;
          }
        }
        return false;
      });
    },
  },
};
</script>

<style lang='scss'>
.mp-pc-my-setting-page-change-pwd-page-wrap {
  > .content {
    margin-top: 75px;
    margin-left: 210px;
    > .el-form {
      > button {
        width: 140px;
        margin-left: 145px;
        margin-top: 55px;
      }
      > .el-form-item {
        > label {
          color: #888;
        }
        .el-input {
          width: 240px;
          > input {
            height: 35px;
            line-height: 33px\0;
          }
        }
      }
    }
    > .success-box {
      color: #585858;
      font-size: 18px;
      margin-top: 126px;
      margin-left: 105px;
      > i {
        margin-right: 15px;
        font-size: 30px;
        color: #80c269;
        vertical-align: bottom;
      }
    }
  }
}
</style>
