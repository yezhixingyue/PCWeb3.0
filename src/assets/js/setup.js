/* eslint-disable max-len */
// const mode = process.env.VUE_APP_BASE_URL && process.env.VUE_APP_BASE_URL === 'test-production' ? 'test' : process.env.NODE_ENV;
const mode = process.env.VUE_APP_BASE_URL || process.env.NODE_ENV;
const testProtocol = 'http'; // 测试环境协议
const prodProtocol = 'https'; // 正式环境协议

/**
 * 开发 ---- 测试环境
 */
let _homeUrl = `${testProtocol}://192.168.1.92:3066/`; // 官网跳转地址
let _domain = '';
let _imgUrl = `${testProtocol}://192.168.3.68:8050/`; // 图片和接口地址
let _agreementID = '60';
let _statementID = '61';
let _beanHelpID = '60';
let _baseUrl;

/**
 * 开发 ---- 测试环境
 */
if (mode === 'test-development' || mode === 'withPcPath') {
  _imgUrl = `${testProtocol}://192.168.1.92:8050/`; // 图片和接口地址
  // _homeUrl = `${prodProtocol}://www.ybz888.com/`;
  // _domain = 'ybz888.com';
  // _imgUrl = `${prodProtocol}://erp.ybz888.com/`;
  // _agreementID = '4';
  // _statementID = '3';
  // _beanHelpID = '37';
}

/**
 * 开发 ---- 生产环境
 */
if (mode === 'pro-development') {
  _homeUrl = `${prodProtocol}://www.ybz888.com/`;
  _imgUrl = `${prodProtocol}://erp.ybz888.com/`;
  _agreementID = '4';
  _statementID = '3';
  _beanHelpID = '3';
}

/**
 * 正式 ---- 测试环境
 */
if (mode === 'test-production') {
  _imgUrl = `${testProtocol}://192.168.1.92:8050/`; // 图片和接口地址
  _baseUrl = `${testProtocol}://192.168.1.92:8050/`;
}

/**
 * 正式 ---- 生产环境
 */
if (mode === 'production') {
  _homeUrl = `${prodProtocol}://www.ybz888.com/`;
  _domain = 'ybz888.com';
  _imgUrl = `${prodProtocol}://erp.ybz888.com/`;
  _agreementID = '4';
  _statementID = '3';
  _beanHelpID = '37';
  _baseUrl = `${prodProtocol}://erp.ybz888.com/`;
}

export const homeUrl = _homeUrl; // 网站地址
export const domain = _domain; // 保存cookie时的所属域名
// export const useCookie = process.env.NODE_ENV !== 'development'; // 使用cookie模式
export const useCookie = true; // 使用cookie模式
export const imgUrl = _imgUrl; // 图片引用地址
export const baseUrl = _baseUrl;
export const agreementID = _agreementID; // 用户协议文章ID
export const statementID = _statementID; // 权责声明文章ID
export const beanHelpID = _beanHelpID;
export const amapAppkey = 'd1de441473f06000bd61463102442b1e';
export const projectType = 'pc';
export const PrintBeanExchangeRate = 0.1; // 印豆对人民币比率 1个印豆可抵扣0.1元人民币

export default {
  homeUrl,
  domain,
  useCookie,
  imgUrl,
  baseUrl,
  agreementID,
  statementID,
  beanHelpID,
  amapAppkey,
  PrintBeanExchangeRate,
};
