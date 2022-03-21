/* eslint-disable max-len */
// const mode = process.env.VUE_APP_BASE_URL && process.env.VUE_APP_BASE_URL === 'test-production' ? 'test' : process.env.NODE_ENV;
const mode = process.env.VUE_APP_BASE_URL || process.env.NODE_ENV;
/**
 * 开发 ---- 测试环境
 */
let _homeUrl = 'http://192.168.1.92:3066/'; // 官网跳转地址
let _domain = '';
let _imgUrl = 'http://192.168.3.68:8050/'; // 图片和接口地址
let _agreementID = '60';
let _statementID = '61';
let _beanHelpID = '60';

/**
 * 开发 ---- 测试环境
 */
if (mode === 'test-production-8050') {
  _imgUrl = 'http://192.168.1.92:8050/'; // 图片和接口地址
}

/**
 * 开发 ---- 生产环境
 */
if (mode === 'test-production-8088') {
  _homeUrl = 'http://www.ybz888.com/';
  _imgUrl = 'http://erp.ybz888.com/';
  _agreementID = '4';
  _statementID = '3';
  _beanHelpID = '3';
}

/**
 * 正式 ---- 生产环境
 */
if (mode === 'production') {
  _homeUrl = 'http://www.ybz888.com/';
  _domain = 'ybz888.com';
  _imgUrl = 'http://erp.ybz888.com/';
  _agreementID = '4';
  _statementID = '3';
  _beanHelpID = '3';
}

export const homeUrl = _homeUrl; // 网站地址
export const domain = _domain; // 保存cookie时的所属域名
// export const useCookie = process.env.NODE_ENV !== 'development'; // 使用cookie模式
export const useCookie = true; // 使用cookie模式
export const imgUrl = _imgUrl; // 图片引用地址
export const agreementID = _agreementID; // 用户协议文章ID
export const statementID = _statementID; // 权责声明文章ID
export const beanHelpID = _beanHelpID;
export const amapAppkey = 'd1de441473f06000bd61463102442b1e';

export default {
  homeUrl,
  domain,
  useCookie,
  imgUrl,
  agreementID,
  statementID,
  beanHelpID,
  amapAppkey,
};
