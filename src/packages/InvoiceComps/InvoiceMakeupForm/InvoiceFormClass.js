import restoreInitDataByOrigin from '../../../assets/js/utils/reduction';
import { InvoiceTypeEnums, InvoiceTitleEnums } from '../enums';

const withEnterpriseInfohandler = (obj) => {
  if (obj) {
    const {
      RegisteredAddress, RegisteredTelephone, OpeningBank, BankAccount,
    } = obj;
    return RegisteredAddress && RegisteredTelephone && OpeningBank && BankAccount;
  }
  return false;
};

const init = (target, data) => {
  const _target = target;
  restoreInitDataByOrigin(_target, data);
  if (!/^1[3456789]\d{9}$/.test(_target.ReceiverContactWay) && _target.InvoiceType !== InvoiceTypeEnums.special.ID) {
    _target.ReceiverContactWay = '';
  }
  _target.withFullEnterpriseInfo = withEnterpriseInfohandler(_target);
};
export default class InvoiceFormClass {
  InvoiceID = '' // 发票id

  InvoiceType = InvoiceTypeEnums.normal.ID // 发票类型  普票 | 专票

  InvoiceMainBody = InvoiceTitleEnums.personal.ID // 发票抬头  个人 | 企业                       -- 普通有  专票需要筛选掉 -- 可用来判断当前表单的类型（个人普票，企业普通，专票）

  PersonalName = '' // 个人名称                                                                 -- 个人普票使用 必填

  EnterpriseName = '' // 企业名称                                                               -- 企业普票和专票 必填

  CreditCode = '' // 统一社会信用代码  /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/    -- 企业普票和专票 必填

  RegisteredAddress = '' // 注册地址                                                            -- 企业普票和专票 必填

  RegisteredTelephone = '' // 注册电话                                                          -- 企业普票和专票 必填

  OpeningBank = '' // 开户银行名称                                                              -- 企业普票和专票 必填

  BankAccount = '' // 银行账号  有校验和格式限定函数  最大长度23                                   -- 企业普票和专票 必填

  ReceiverContactWay = '' // 收票人手机

  ReceiverMail = '' // 收票人邮箱

  ReceiverName = '' // 收票人姓名

  ReceiverProvinceID = ''

  ReceiverProvinceName = ''

  ReceiverCityID = ''

  ReceiverCityName = ''

  ReceiverCountyID = ''

  ReceiverCountyName = ''

  IsPassBusinessAccount = false // 是否经过公户

  ReceiverAddress = ''

  EnterpriseStatus = '' // 企业开票信息审核状态  审核中|被驳回|审核通过

  withFullEnterpriseInfo = false // 是否全部携带注册地址、注册电话、开户银行、银行账号等4种信息 （ 用于判断审核通过的是否为专票企业信息， true则是）

  constructor(data) {
    init(this, data);
  }

  // 梳理提交信息
  getSubmitInfo(onlyEnterprise = false) {
    let temp = null;

    if (onlyEnterprise) {
      temp = {
        EnterpriseName: this.EnterpriseName,
        CreditCode: this.CreditCode,
        RegisteredAddress: this.RegisteredAddress,
        RegisteredTelephone: this.RegisteredTelephone,
        OpeningBank: this.OpeningBank,
        BankAccount: this.BankAccount,
      };
    } else {
      // 分3类  个人普票|企业普票|专票
      if (this.InvoiceType === InvoiceTypeEnums.normal.ID && this.InvoiceMainBody === InvoiceTitleEnums.personal.ID) { // 个人普票
      // 需要获取到的信息： 个人名称、收票人手机、收票人邮箱
        temp = {
          InvoiceType: this.InvoiceType,
          InvoiceMainBody: this.InvoiceMainBody,
          PersonalName: this.PersonalName,
          ReceiverContactWay: this.ReceiverContactWay,
          ReceiverMail: this.ReceiverMail,
        };
      }

      if (this.InvoiceType === InvoiceTypeEnums.normal.ID && this.InvoiceMainBody === InvoiceTitleEnums.enterprise.ID) { // 企业普票
        temp = {
          InvoiceType: this.InvoiceType,
          InvoiceMainBody: this.InvoiceMainBody,
          EnterpriseName: this.EnterpriseName,
          CreditCode: this.CreditCode,
          RegisteredAddress: this.RegisteredAddress,
          RegisteredTelephone: this.RegisteredTelephone,
          OpeningBank: this.OpeningBank,
          BankAccount: this.BankAccount,
          ReceiverContactWay: this.ReceiverContactWay,
          ReceiverMail: this.ReceiverMail,
        };
      }

      if (this.InvoiceType === InvoiceTypeEnums.special.ID) { // 专票
        temp = {
          InvoiceType: this.InvoiceType,
          EnterpriseName: this.EnterpriseName,
          CreditCode: this.CreditCode,
          RegisteredAddress: this.RegisteredAddress,
          RegisteredTelephone: this.RegisteredTelephone,
          OpeningBank: this.OpeningBank,
          BankAccount: this.BankAccount,
          ReceiverName: this.ReceiverName,
          ReceiverProvinceID: this.ReceiverProvinceID,
          ReceiverProvinceName: this.ReceiverProvinceName,
          ReceiverCityID: this.ReceiverCityID,
          ReceiverCityName: this.ReceiverCityName,
          ReceiverCountyID: this.ReceiverCountyID,
          ReceiverCountyName: this.ReceiverCountyName,
          ReceiverAddress: this.ReceiverAddress,
          ReceiverContactWay: this.ReceiverContactWay,
          InvoiceMainBody: InvoiceTitleEnums.enterprise.ID, // 专票不会有个人类型，所以这里直接写死为企业类型
          IsPassBusinessAccount: this.IsPassBusinessAccount, // 是否过公户
        };
      }

      if (this.InvoiceID || this.InvoiceID === 0) {
        temp.InvoiceID = this.InvoiceID;
      }
    }

    return temp;
  }

  setEnterpriseInfo(data) {
    init(this, data);
  }
}
