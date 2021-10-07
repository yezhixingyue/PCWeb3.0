/* eslint-disable max-len */
// const mode = process.env.VUE_APP_BASE_URL && process.env.VUE_APP_BASE_URL === 'test-production' ? 'test' : process.env.NODE_ENV;
const mode = process.env.VUE_APP_BASE_URL || process.env.NODE_ENV;
/**
 * 生产 ---- 测试环境
 */
let _homeUrl = 'http://192.168.1.92:8030/';
let _domain = '';
let _imgUrl = 'http://192.168.1.92:8055/';
let _productJumpUrl = 'http://192.168.1.92:8030/';
let _agreementID = '60';
let _statementID = '61';
let _baseUrl = '/';
let _rightOpenUrl = '';

// if (mode === 'test-production-8050') {
//   _homeUrl = 'http://192.168.1.92:8050/';
//   _productJumpUrl = 'http://192.168.1.92:8050/';
//   _rightOpenUrl = '';
// }

/**
 * 生产 ---- 正式环境
 */
if (mode === 'production') {
  _homeUrl = 'https://www.mpzj.cn/';
  _domain = 'mpzj.cn';
  _imgUrl = 'https://order.mpzj.cn:8157/';
  _productJumpUrl = 'https://www.mpzj.cn/';
  _agreementID = '4';
  _statementID = '3';
  _baseUrl = '/';
  _rightOpenUrl = 'https://order.mpzj.cn/'; // 正确打开地址 如果不是将会自动跳转至该地址
}

/**
 * 测试 ---- 开发环境 --- 端口8055
 */
if (mode === 'development') {
  _homeUrl = 'http://192.168.3.85:3000/'; // 和测试官网保持相同
  _domain = '';
  // _imgUrl = 'http://192.168.1.92:8055/'; // 和测试生产环境保持相同 故此处不再修改 -- 开发环境 反向代理接口使用该地址
  _productJumpUrl = 'http://192.168.3.85:3000/';
  // _agreementID = '60'; // 和测试生产环境保持相同 故此处不再修改
  // _statementID = '61'; // 和测试生产环境保持相同 故此处不再修改
  _baseUrl = '/';
  // _rightOpenUrl = 'http://192.168.3.85:8055/';
}

export const homeUrl = _homeUrl; // 网站地址
export const domain = _domain; // 保存cookie时的所属域名
// export const useCookie = process.env.NODE_ENV !== 'development'; // 使用cookie模式
export const useCookie = true; // 使用cookie模式
export const imgUrl = _imgUrl; // 图片引用地址
export const productJumpUrl = _productJumpUrl; // 官网地址 产品跳转地址 和 第一个相同
export const agreementID = _agreementID; // 用户协议文章ID
export const statementID = _statementID; // 权责声明文章ID
export const baseUrl = _baseUrl; // 接口请求地址
export const rightOpenUrl = _rightOpenUrl; // 如果登录接口不是通过域名登录的话 在打开登录页面时自动跳转该地址； -- 正确打开地址
export const amapAppkey = 'd1de441473f06000bd61463102442b1e';

export default {
  homeUrl,
  domain,
  useCookie,
  imgUrl,
  baseUrl,
  productJumpUrl,
  agreementID,
  statementID,
  rightOpenUrl,
  amapAppkey,
};
