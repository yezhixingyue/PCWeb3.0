<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-if="ruleForm"
    :label-width="labelWidth" class="mp-invoice-make-up-rule-Form-wrap" @submit.native.prevent size="small">
    <p class="blue-v-line invoice-form-section-title" :style="`width:${labelWidth}`" v-if="!onlyEnterprise">发票类型</p>
    <el-form-item label="发票类型：" prop="InvoiceType" v-if="!onlyEnterprise">
      <ButtonRadioSelectorVue v-model="localType" :list="InvoiceTypeEnumList" class="type" shape="square" />
    </el-form-item>
    <p class="tip is-origin" v-if="!onlyEnterprise">
      {{
         isSpecial
        ? '一个账号只能关联一个企业发票资质，请务必确保相关信息的真实准确性。'
        : '电子普通发票与纸质发票具有同等法律效力，可支持报销入账、商品售后凭证。'
      }}
    </p>
    <p class="blue-v-line invoice-form-section-title" :style="`width:${labelWidth}`" v-if="(!notThrough || !isSpecial) && !onlyEnterprise">开票信息</p>
    <el-form-item label="抬头类型：" prop="InvoiceMainBody" v-if="!isSpecial && !onlyEnterprise">
      <ButtonRadioSelectorVue v-model="localTitle" :list="InvoiceTitleEnumList" />
    </el-form-item>
    <p class="tip is-origin" v-if="isEnterprise && !notThrough && !fetchEnterpriseDataError && !onlyEnterprise">一个账号只能关联一个企业发票资质，请务必确保相关信息的真实准确性。</p>

    <el-form-item label="抬头名称：" prop="PersonalName" v-if="isPersonal && !onlyEnterprise">
      <el-input v-model.trim="ruleForm.PersonalName" placeholder="请填写 “个人” 或您的姓名" maxlength="20"></el-input>
    </el-form-item>
    <el-form-item label="抬头名称：" prop="EnterpriseName" v-if="(!isPersonal && !notThrough && !fetchEnterpriseDataError) || onlyEnterprise">
      <span class="info" v-if="isThrough && !onlyEnterprise">{{ruleForm.EnterpriseName}}</span>
      <el-input v-else v-model.trim="ruleForm.EnterpriseName" placeholder="请填写抬头名称" maxlength="60"></el-input>
    </el-form-item>
    <el-form-item label="统一社会信用代码：" prop="CreditCode" v-if="(!isPersonal && !notThrough && !fetchEnterpriseDataError) || onlyEnterprise">
      <span class="info" v-if="isThrough && !onlyEnterprise">{{ruleForm.CreditCode}}</span>
      <el-input v-else v-model.trim="ruleForm.CreditCode" placeholder="请填写统一社会信用代码/纳税人识别号" maxlength="18"></el-input>
    </el-form-item>
    <el-form-item label="注册地址：" prop="RegisteredAddress" v-if="(!isPersonal && !notThrough && !fetchEnterpriseDataError) || onlyEnterprise">
      <span class="info" v-if="isThrough && !onlyEnterprise && ruleForm.withFullEnterpriseInfo">{{ruleForm.RegisteredAddress}}</span>
      <el-input v-else v-model.trim="ruleForm.RegisteredAddress" placeholder="请填写企业注册地址" maxlength="100"></el-input>
    </el-form-item>
    <el-form-item label="注册电话：" prop="RegisteredTelephone" v-if="(!isPersonal && !notThrough && !fetchEnterpriseDataError) || onlyEnterprise">
      <span class="info" v-if="isThrough && !onlyEnterprise && ruleForm.withFullEnterpriseInfo">{{ruleForm.RegisteredTelephone}}</span>
      <el-input v-else v-model.trim="ruleForm.RegisteredTelephone" placeholder="请填写企业注册电话" maxlength="20"></el-input>
    </el-form-item>
    <el-form-item label="开户银行：" prop="OpeningBank" v-if="(!isPersonal && !notThrough && !fetchEnterpriseDataError) || onlyEnterprise">
      <span class="info" v-if="isThrough && !onlyEnterprise && ruleForm.withFullEnterpriseInfo">{{ruleForm.OpeningBank}}</span>
      <el-input v-else v-model.trim="ruleForm.OpeningBank" placeholder="请填写企业开户银行" maxlength="50"></el-input>
    </el-form-item>
    <el-form-item label="银行账号：" prop="BankAccount" v-if="(!isPersonal && !notThrough && !fetchEnterpriseDataError) || onlyEnterprise">
      <span class="info" v-if="isThrough && !onlyEnterprise && ruleForm.withFullEnterpriseInfo">{{localBankCard}}</span>
      <el-input v-else v-model.trim="localBankCard" placeholder="请填写银行账号" maxlength="29"></el-input>
    </el-form-item>
    <el-form-item label="收票人手机：" prop="ReceiverContactWay"
      v-if="!isSpecial && (!notThrough || isPersonal) && (!fetchEnterpriseDataError || isPersonal) && !onlyEnterprise">
      <el-input v-model.trim="ruleForm.ReceiverContactWay" placeholder="请填写收票人手机号码" maxlength="11"></el-input>
    </el-form-item>
    <el-form-item label="收票人邮箱：" prop="ReceiverMail"
      v-if="!isSpecial && (!notThrough || isPersonal) && (!fetchEnterpriseDataError || isPersonal) && !onlyEnterprise">
      <el-input v-model.trim="ruleForm.ReceiverMail" placeholder="请填写收票人邮箱" maxlength="255"></el-input>
    </el-form-item>
    <el-form-item label="是否过公户："  v-if="isSpecial && !notThrough && !fetchEnterpriseDataError && !onlyEnterprise">
      <!-- <el-switch  v-model="ruleForm.IsPassBusinessAccount" style="margin: 0 15px;user-select: none;"></el-switch> -->
      <el-radio-group v-model="ruleForm.IsPassBusinessAccount" style="margin: 0 15px;user-select: none;">
        <el-radio :label="false">不过</el-radio>
        <el-radio :label="true">过</el-radio>
      </el-radio-group>
      <span class="tips-box is-pink" v-show="ruleForm.IsPassBusinessAccount">注：选择过公户需要重新走账</span>
    </el-form-item>
    <p class="blue-v-line invoice-form-section-title"
      v-show="isSpecial && !notThrough && !fetchEnterpriseDataError && !onlyEnterprise">
      <span>收票人信息</span>
      <span class="is-pink"> ( 邮寄方式一般为京东快递，运费到付 )</span>
    </p>
    <el-form-item label="收票人姓名：" prop="ReceiverName" v-if="isSpecial && !notThrough && !fetchEnterpriseDataError && !onlyEnterprise">
      <el-input v-model.trim="ruleForm.ReceiverName" placeholder="请填写收票人姓名" maxlength="20"></el-input>
    </el-form-item>
    <el-form-item label="收票人地址：" prop="ReceiverProvinceID" v-if="isSpecial && !notThrough && !fetchEnterpriseDataError && !onlyEnterprise">
      <AreaSelector v-model="localConsigneeAddress" :defaultProps="{
        RegionalIDLabel: 'ReceiverProvinceID',
        RegionalNameLabel: 'ReceiverProvinceName',
        CityIDLabel: 'ReceiverCityID',
        CityNameLabel: 'ReceiverCityName',
        CountyIDLabel: 'ReceiverCountyID',
        CountyNameLabel: 'ReceiverCountyName',
      }" />
    </el-form-item>
    <el-form-item label="" prop="ReceiverAddress" v-if="isSpecial && !notThrough && !fetchEnterpriseDataError && !onlyEnterprise" class="add-detail">
      <el-input v-model.trim="ruleForm.ReceiverAddress" placeholder="请填写收票人地址" maxlength="100"></el-input>
    </el-form-item>
    <el-form-item label="收票人电话：" prop="ReceiverContactWay" v-if="isSpecial && !notThrough && !fetchEnterpriseDataError && !onlyEnterprise">
      <el-input v-model.trim="ruleForm.ReceiverContactWay" placeholder="请填写收票人联系电话或手机号码" maxlength="20"></el-input>
    </el-form-item>
    <el-form-item class="btns" v-if="!onlyEnterprise">
      <p class="no-through-tips" v-if="notThrough && !isPersonal && !fetchEnterpriseDataError">您的企业发票资质{{curStatusText}}，需等资质审核通过，才可再次开具企业发票</p>
      <p class="no-through-tips" v-if="fetchEnterpriseDataError && !isPersonal">企业信息加载失败，请尝试重新切换获取！</p>
      <el-button type="primary" :disabled="fetchEnterpriseDataError" @click="submitForm()">{{notThrough && !isPersonal ? '点击查看' : '提交' }}</el-button>
      <el-button @click="goback">返回</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import ButtonRadioSelectorVue from '../../CommonComps/ButtonRadioSelector.vue';
import AreaSelector from '../../CommonComps/AreaSelector.vue';
import { formatBankCard } from '../utils';
import InvoiceFormClass from './InvoiceFormClass';
import {
  InvoiceTitleEnumList, InvoiceTitleEnums, InvoiceTypeEnums, InvoiceTypeEnumList, EnterpriseCheckStatusEnums,
} from '../enums';

export default { // 企业普票和专票 还有一种形式：已有值的情况下，不允许再输入，使用div；个人普票需填充进输入框中
  props: {
    originReceiverData: {
      type: Object,
      default: null,
    },
    originEnterpriseData: {
      type: Object,
      default: null,
    },
    fetchEnterpriseDataError: {
      type: Boolean,
      default: false,
    },
    onlyEnterprise: {
      type: Boolean,
      default: false,
    },
    editData: {
      type: Object,
      default: null,
    },
  },
  components: {
    ButtonRadioSelectorVue,
    AreaSelector,
  },
  data() {
    const checkBankCard = (rule, value, callback) => { // 公户账号位数及规则凌乱，仅判断长度9-24即符合规则
      if (value !== '') {
        const _val = value.replace(/\s/g, '');
        if (!/^\d{9,24}$/.test(_val)) {
          callback(new Error('银行账号格式不正确'));
          return;
        }
      }
      callback();
    };

    const checkArea = (rule, value, callback) => { // 验证专票收票人地址省市区选择
      const { ReceiverProvinceID, ReceiverCityID, ReceiverCountyID } = this.ruleForm;
      if ((!ReceiverProvinceID && ReceiverProvinceID !== 0) || (!ReceiverCityID && ReceiverCityID !== 0) || (!ReceiverCountyID && ReceiverCountyID !== 0)) {
        callback(new Error('请选择省/市/区'));
        return;
      }
      callback();
    };

    const checkReceiverContactWay = (rule, value, callback) => { // 验证收票人联系方式
      if (!value) {
        callback(new Error(`请填写收票人${this.localType === InvoiceTypeEnums.special.ID ? '电话' : '手机'}`));
        return;
      }
      if (this.localType === InvoiceTypeEnums.special.ID && !/^\d{11}$|^\d{7,12}$|^\d{3,4}-\d{6,8}$/.test(value)) { // 增值税 - 电话
        callback(new Error('电话号码格式不正确'));
        return;
      }
      if (this.localType !== InvoiceTypeEnums.special.ID && !/^1[3456789]\d{9}$/.test(value)) { // 手机
        callback(new Error('手机号码格式不正确'));
        return;
      }
      callback();
    };

    const checkFeildEmpty = (rule, value, callback) => {
      if (this.localType === InvoiceTypeEnums.special.ID && !this.onlyEnterprise && value === '') {
        callback(new Error('请填写信息'));
        return;
      }
      callback();
    };

    const temp = this.editData || this.originReceiverData || {};

    return {
      ruleForm: new InvoiceFormClass({ ...temp }),
      rules: {
        InvoiceType: [
          { required: true, message: '请选择发票类型', trigger: 'input' },
        ],
        InvoiceMainBody: [
          { required: true, message: '请选择抬头类型', trigger: 'input' },
        ],
        PersonalName: [
          { required: true, message: '请填写抬头名称', trigger: 'blur' },
        ],
        EnterpriseName: [
          { required: true, message: '请填写抬头名称', trigger: 'blur' },
        ],
        CreditCode: [
          { required: true, message: '请填写统一社会信用代码/纳税人识别号', trigger: 'blur' },
          { pattern: /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/, message: '统一社会信用代码格式不正确', trigger: 'blur' },
        ],
        RegisteredAddress: [
          { validator: checkFeildEmpty, trigger: 'blur' },
        ],
        RegisteredTelephone: [
          { pattern: /^\d{11}$|^\d{7,12}$|^\d{3,4}-\d{6,8}$/, message: '电话格式不正确', trigger: 'blur' },
        ],
        OpeningBank: [
          { validator: checkFeildEmpty, trigger: 'blur' },
        ],
        BankAccount: [
          { validator: checkBankCard, trigger: 'blur' },
        ],
        ReceiverName: [
          { required: true, message: '请填写收票人姓名', trigger: 'blur' },
        ],
        ReceiverProvinceID: [
          { required: true, message: '请选择省/市/区', trigger: 'blur' },
          { validator: checkArea, trigger: 'change' },
        ],
        ReceiverContactWay: [
          { validator: checkReceiverContactWay, trigger: 'blur' },
          { required: true, message: '', trigger: 'blur' },
        ],
        ReceiverMail: [
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
        ],
        ReceiverAddress: [
          { required: true, message: '请填写收票人具体地址', trigger: 'blur' },
        ],
      },
      InvoiceTitleEnums,
      InvoiceTitleEnumList,
      InvoiceTypeEnumList,
      InvoiceTypeEnums,
    };
  },
  computed: {
    notThrough() { // 已审核但未通过 或者 正在审核中 仅企业普票和专票提交过数据后 且数据未审核过 此值才为true   审核中|被驳回 提示文字中对应显示
      const bool = [EnterpriseCheckStatusEnums.rejected.ID, EnterpriseCheckStatusEnums.checking.ID].includes(this.ruleForm.EnterpriseStatus);
      return bool;
    },
    curStatusText() {
      let str = '';
      switch (this.ruleForm.EnterpriseStatus) {
        case EnterpriseCheckStatusEnums.checking.ID:
          str = '正在审核中';
          break;
        case EnterpriseCheckStatusEnums.rejected.ID:
          str = '被驳回';
          break;
        default:
          break;
      }
      return str;
    },
    isThrough() { // 企业信息已通过审核
      return this.ruleForm.EnterpriseStatus === EnterpriseCheckStatusEnums.passed.ID;
    },
    localBankCard: {
      get() {
        return formatBankCard(this.ruleForm.BankAccount);
      },
      set(val) {
        this.ruleForm.BankAccount = val.replace(/\s/g, '');
      },
    },
    localType: { // 处理普票和专票信息切换
      get() {
        return this.ruleForm.InvoiceType;
      },
      set(val) {
        if (this.ruleForm.InvoiceType === val) return;
        this.ruleForm.InvoiceType = val;
        this.$refs.ruleForm.clearValidate();
        if (!this.isSpecial && !/^1[3456789]\d{9}$/.test(this.ruleForm.ReceiverContactWay)) {
          this.ruleForm.ReceiverContactWay = '';
        }
        if (val === InvoiceTypeEnums.special.ID && (!this.originEnterpriseData || this.fetchEnterpriseDataError)) {
          this.$emit('switchToEnterprise');
        }
        this.handleRulesChangeByTypeSwitch();
      },
    },
    localTitle: {
      get() {
        return this.ruleForm.InvoiceMainBody;
      },
      set(val) {
        if (this.ruleForm.InvoiceMainBody === val) return;
        this.$refs.ruleForm.clearValidate();
        this.ruleForm.InvoiceMainBody = val;
        // 处理个人普票和企业普票信息切换 或着 切换表单
        if (val === InvoiceTitleEnums.enterprise.ID && (!this.originEnterpriseData || this.fetchEnterpriseDataError)) {
          this.$emit('switchToEnterprise');
        }
      },
    },
    localConsigneeAddress: {
      get() {
        return this.ruleForm;
      },
      set(val) {
        if (typeof val === 'object') {
          Object.keys(val).forEach(key => {
            this.ruleForm[key] = val[key];
          });
          this.$refs.ruleForm.validateField('ReceiverProvinceID');
        }
      },
    },
    labelWidth() {
      return '150px';
    },
    isPersonal() { // 是否为个人普票
      if (this.ruleForm) {
        return this.ruleForm.InvoiceMainBody === InvoiceTitleEnums.personal.ID && !this.isSpecial;
      }
      return false;
    },
    isEnterprise() { // 是否为企业普票
      if (this.ruleForm) {
        return this.ruleForm.InvoiceMainBody === InvoiceTitleEnums.enterprise.ID && !this.isSpecial;
      }
      return false;
    },
    isSpecial() { // 是否为专票
      return this.localType === InvoiceTypeEnums.special.ID;
    },
  },
  methods: {
    submitForm() {
      if (this.notThrough && !this.isPersonal && !this.onlyEnterprise) {
        this.$emit('view');
        return;
      }
      if (!this.ruleForm) return;
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 通过验证
          const temp = this.ruleForm.getSubmitInfo(this.onlyEnterprise);
          this.$emit('submit', temp);
        }
      });
    },
    goback() {
      this.$emit('goback');
    },
    clearForm() {
      this.$refs.ruleForm.clearValidate();
    },
    resetFormByEnterpriseData() {
      if (this.originEnterpriseData && typeof this.originEnterpriseData === 'object') {
        this.ruleForm.setEnterpriseInfo(this.originEnterpriseData);
      }
      this.handleRulesChangeByTypeSwitch();
    },
    handleRulesChangeByTypeSwitch() {
      if (this.ruleForm.InvoiceType === InvoiceTypeEnums.special.ID && !this.onlyEnterprise) {
        this.rules.RegisteredAddress.unshift({ required: true, message: '请填写企业注册地址', trigger: 'blur' });
        this.rules.RegisteredTelephone.unshift({ required: true, message: '请填写企业注册电话', trigger: 'blur' });
        this.rules.OpeningBank.unshift({ required: true, message: '请填写企业开户银行名称', trigger: 'blur' });
        this.rules.BankAccount.unshift({ required: true, message: '请填写企业开户银行账号', trigger: 'blur' });
      }
      if (this.ruleForm.InvoiceType !== InvoiceTypeEnums.special.ID) {
        this.rules.RegisteredAddress = this.rules.RegisteredAddress.filter(it => !it.required);
        this.rules.RegisteredTelephone = this.rules.RegisteredTelephone.filter(it => !it.required);
        this.rules.OpeningBank = this.rules.OpeningBank.filter(it => !it.required);
        this.rules.BankAccount = this.rules.BankAccount.filter(it => !it.required);
      }
    },
  },
  watch: {
    originEnterpriseData: {
      handler() {
        this.resetFormByEnterpriseData();
      },
      immediate: true,
    },
  },
};
</script>
<style lang='scss'>
.mp-invoice-make-up-rule-Form-wrap {
  // margin-left: -10px;
  .tip {
    margin-top: -9px;
    margin-bottom: 15px;
    font-size: 12px;
    margin-left: 68px;
  }
  .invoice-form-section-title {
    text-align: left;
    color: #333;
    padding-right: 50px;
    box-sizing: border-box;
    margin-bottom: 25px;
    padding-top: 14px;
    font-weight: 700;
    margin-right: -200px;
    // &::before {
    //   width: 5px;
    // }
    &:last-of-type {
      padding-right: 36px;
    }
    .is-pink {
      // font-weight: 400;
      font-size: 13px;
    }
  }
  .el-form-item__content {
    width: 520px;
    .el-button {
      width: 140px;
      height: 40px;
      margin-top: 15px;
      font-size: 14px;
      // margin-left: 50px;
      & + .el-button {
        margin-left: 50px;
        color: #428dfa;
        border-color: #428dfa;
        &:active {
          color: darken($color: #428dfa, $amount: 15);
          border-color: darken($color: #428dfa, $amount: 15);
        }
      }
    }
    .el-input {
      height: 30px;
      width: 330px;
      .el-input__inner {
        height: 30px;
        line-height: 30px;
        font-size: 13px;
        &::placeholder {
          color: #ddd;
        }
      }
    }
    .type.mp-common-comps-button-radio-selector-comp-wrap {
      > span {
        width: 160px;
      }
    }
    .mp-common-comps-area-selector-comp-wrap {
      width: 400px;
      font-size: 13px;
    }
    span.info {
      margin-left: 16px;
      display: inline-block;
      color: #585858;
      line-height: 20px;
      padding-top: 6px;
      font-size: 13px;
    }
  }
  .btns .el-form-item__content {
    text-align: center;
    .no-through-tips {
      color: #ff3769;
      padding-top: 20px;
      padding-bottom: 25px;
      padding-top: 98px;
      padding-bottom: 20px;
    }
  }
  .add-detail .el-form-item__content .el-input {
    width: 400px;
  }
  &.loading {
    opacity: 0.25;
  }
}
</style>
