<template>
  <el-form :model="regForm" :rules="rules" ref="regForm" label-width="0px">
    <el-form-item prop="Name">
      <el-input placeholder="请输入企业简称" clearable v-model.trim="regForm.Name">
          <i slot="prefix" class="iconfont icon-yonghu"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="Mobile">
      <el-input placeholder="请输入手机号码" clearable v-model.trim="Mobile">
          <i slot="prefix" class="iconfont icon-shouji"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="Password">
      <el-input placeholder="请输入密码" type="password" clearable v-model.trim="regForm.Password">
          <i slot="prefix" class="iconfont icon-mima"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="rePassword">
      <el-input placeholder="请再次输入密码" type="password" clearable v-model.trim="regForm.rePassword">
          <i slot="prefix" class="iconfont icon-mima"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="VertifyImgCode" class="code-box img-code-box">
      <el-input placeholder="请输入验证码" v-model.trim="VertifyImgCode">
          <i slot="prefix" class="iconfont icon-xinxi"></i>
          <img slot="suffix" v-if='!imgLoading' @click="getImgCode" :src="imgSrc" alt="图片校验码">
          <i slot="suffix" v-else >加载中...</i>
          <!-- <i
           class="span-title-blue" :class="canGetCode?'':'disabled'" @click="getVertifyCode">{{ codeTitle }}</i> -->
      </el-input>
    </el-form-item>
    <el-form-item prop="VertifyCode" class="code-box">
      <el-input placeholder="请输入短信验证码" v-model.trim="VertifyCode">
          <i slot="prefix" class="iconfont icon-xinxi"></i>
          <i slot="suffix"
           class="span-title-blue" :class="canGetCode?'':'disabled'" @click="getVertifyCode">{{ codeTitle }}</i>
      </el-input>
    </el-form-item>
    <el-form-item prop="agreement" class="agreement">
      <el-checkbox label="" v-model="regForm.agreement">阅读并同意</el-checkbox>
      <i @click="onAgreementViewClick">《承接印品协议书》</i>
      <i style="margin: 0">、</i>
      <i style="margin: 0" @click="onUserAgreementViewClick">《用户协议》</i>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('regForm')" :disabled="!canGoToReg">注册</el-button>
      <p><span class="span-title-blue" @click="() => this.$emit('changePanel', 'first')">已有账号请登录</span></p>
    </el-form-item>
  </el-form>
</template>

<script>
import Cookie from '../../assets/js/Cookie';

export default {
  data() {
    const validateMobile = (rule, value, callback) => {
      if (this.validateCheck(value, this.defineRules.Mobile, callback)) callback();
    };
    const validatePassword = (rule, value, callback) => {
      if (this.validateCheck(value, this.defineRules.Password, callback)) {
        if (this.regForm.rePassword !== '') this.$refs.regForm.validateField('rePassword');
        callback();
      }
    };
    const validateRePassword = (rule, value, callback) => {
      if (this.validateCheck(value, this.defineRules.Password, callback)) {
        if (this.regForm.rePassword !== this.regForm.Password) callback(new Error('两次密码输入不一致'));
        else callback();
      }
    };
    const validateName = (rule, value, callback) => {
      if (this.validateCheck(value, this.defineRules.nameRules, callback)) callback();
    };
    const validateVertifyCode = (rule, value, callback) => {
      if (this.validateCheck(value, this.defineRules.VertifyCodeRules, callback)) callback();
    };
    const validatAgreement = (rule, value, callback) => {
      // // console.log(value, 'validatAgreement');
      if (value) callback();
      else callback(new Error('请阅读并同意承接印品协议书'));
    };
    return {
      rules: {
        Mobile: [
          { validator: validateMobile, trigger: 'blur' },
        ],
        Password: [
          { validator: validatePassword, trigger: 'blur' },
        ],
        rePassword: [
          { validator: validateRePassword, trigger: 'blur' },
        ],
        Name: [
          { validator: validateName, trigger: 'blur' },
        ],
        VertifyCode: [
          { validator: validateVertifyCode, trigger: 'blur' },
        ],
        VertifyImgCode: [
          { required: true, message: '请输入图片验证码', trigger: 'blur' },
          {
            min: 2, max: 2, message: '请输入2个字符验证码，中间不要输入空格', trigger: 'blur',
          },
        ],
        agreement: [
          { validator: validatAgreement, trigger: 'blur' },
        ],
      },
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
        nameRules: [
          { strategy: 'isNotEmpty', errorMsg: '请输入企业简称' },
          { strategy: 'maxLength:20', errorMsg: '企业简称最大长度为20位' },
          { strategy: 'hasNotSpace', errorMsg: '企业简称不能含有空格' },
          { strategy: 'hasNotRung', errorMsg: '企业简称不能含有-符号' },
        ],
        VertifyCodeRules: [
          { strategy: 'isNotEmpty', errorMsg: '请输入短信验证码' },
          { strategy: 'shouldLength:6', errorMsg: '短信验证码长度为6位' },
        ],
      },
      regForm: {
        Name: '',
        Mobile: '',
        Password: '',
        rePassword: '',
        VertifyCode: '',
        VertifyImgCode: '',
        agreement: false,
      },
      codeTitle: '获取验证码',
      timer: null,
      canGetCode: true,
      imgSrc: '', // 图片验证码地址
      imgLoading: false,
    };
  },
  computed: {
    Mobile: {
      get() {
        return this.regForm.Mobile;
      },
      set(newVal) {
        this.regForm.Mobile = newVal.replace(/[^\d.]/g, '');
      },
    },
    VertifyCode: {
      get() {
        return this.regForm.VertifyCode;
      },
      set(newVal) {
        this.regForm.VertifyCode = newVal.replace(/[^\d.]/g, '');
      },
    },
    VertifyImgCode: {
      get() {
        return this.regForm.VertifyImgCode;
      },
      set(newVal) {
        this.regForm.VertifyImgCode = newVal.replace(/[\s+]/g, '');
      },
    },
    canGoToReg() {
      return this.regForm.Name && this.regForm.Mobile
        && this.regForm.Password && this.regForm.rePassword && this.regForm.VertifyCode && this.regForm.agreement;
    },
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 成功
          const {
            Name, Password, Mobile, VertifyCode,
          } = this.regForm;
          const _obj = {
            CustomerName: Name,
            Password,
            Mobile,
            VertifyCode,
            Terminal: 1,
          };
          this.$emit('setPanelLoading', [true, '正在注册中...']);
          const res = await this.api.getReg(_obj);
          this.$emit('setPanelLoading', [false, '']);
          if (res.data.Status === 1000) {
            this.messageBox.successSingle({
              title: '注册成功,请登录',
              successFunc: () => this.$emit('changePanel', 'first'),
            });
          } else {
            this.getImgCode();
          }
        }
        return false;
      });
    },
    async getVertifyCode() {
      if (!this.canGetCode) return;
      if (this.validateCheck(this.Mobile, this.defineRules.Mobile, msg => {
        this.messageBox.failSingle({ msg });
      })) {
        if (!this.regForm.VertifyImgCode || this.regForm.VertifyImgCode.length !== 2) {
          this.messageBox.failSingle({ msg: '请输入准确图片验证码' });
          return;
        }
        // can
        const res = await this.api.getVerificationCode({
          Mobile: this.Mobile,
          Code: this.regForm.VertifyImgCode,
          Type: 0,
        });
        if (res.data.Status === 1000) {
          this.changeCodeTitleAtSecond();
        } else if (res.data.Status !== 5034) {
          this.getImgCode();
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
          this.getImgCode();
          clearInterval(this.timer);
          this.canGetCode = true;
        }
      }, 1000);
    },
    async getImgCode() {
      const _imgObj = {
        width: 138,
        height: 38,
        fontSize: 20,
        closeLoading: true,
      };
      // this.setShouldShow(false);
      this.imgLoading = true;
      const res = await this.api.getCaptcha(_imgObj);
      this.imgLoading = false;
      if (res.data.Status === 1000) {
        this.imgSrc = res.data.Data.Image;
        this.setImgCodeCookie(res.data.Data);
        // this.$refs.ImgCodeCmp.clearMsg();
      }
    },
    setImgCodeCookie(data) {
      Cookie.setCookie('SessionID', data.SessionID, 600);
    },
    onAgreementViewClick() {
      this.$emit('setAgreeView');
    },
    onUserAgreementViewClick() {
      this.$emit('setUserAgreeView');
    },
  },
  mounted() {
    this.getImgCode();
  },
};
</script>

<style>

</style>
