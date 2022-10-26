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
let _invoiceID = '80';

/**
 * 开发 ---- 测试环境
 */
if (mode === 'test-development' || mode === 'withPcPath') {
  _imgUrl = `${testProtocol}://192.168.1.92:8050/`; // 图片和接口地址
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
  _invoiceID = '80';
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
  _invoiceID = '37';
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
export const invoiceID = _invoiceID;
export const amapAppkey = '5133382d95bf0ad64b941ae71d8ae861'; // 2.0 版本时 修改此参数需要同步更新对应密钥！！！
export const securityJsCode = ''; // 高德key对应的密钥，前台不要配置（采用高德推荐的安全模式），后台配置（减少维护复杂度）
export const aMapServiceHost = ''; // 高德代理服务器地址 默认为空：自动识别当前域名 【 设置时不应包含http协议（自动识别），如：order.ybz888.com 】
export const projectType = 'pc';
export const PrintBeanExchangeRate = 0.1; // 印豆对人民币比率 1个印豆可抵扣0.1元人民币

export default {
  homeUrl,
  domain,
  useCookie,
  imgUrl,
  baseUrl,
  invoiceID,
  agreementID,
  statementID,
  beanHelpID,
  amapAppkey,
  aMapServiceHost,
  PrintBeanExchangeRate,
};
