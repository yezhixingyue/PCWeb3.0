/* eslint-disable max-len */
const TerserPlugin = require('terser-webpack-plugin');

// let proxyUrl = 'http://192.168.3.253';
let proxyUrl = 'http://192.168.2.238:8050';
// let proxyUrl = 'http://erp.ybz888.com/';
let publicPath = '';
// 测试开发环境：调用92接口
if (process.env.VUE_APP_BASE_URL && process.env.VUE_APP_BASE_URL === 'test-development') proxyUrl = 'http://192.168.1.92:8050';
// 测试开发环境：调用正式接口
if (process.env.VUE_APP_BASE_URL && process.env.VUE_APP_BASE_URL === 'pro-development') {
  proxyUrl = 'http://erp.ybz888.com';
}
if (process.env.NODE_ENV === 'production' && process.env.VUE_APP_BASE_URL === 'withPcPath') { // 打包测试环境的代码(路径中带/pc/)
  publicPath = '/pc/';
}

module.exports = {
  productionSourceMap: process.env.NODE_ENV === 'development', // 是否打包sourcemap
  outputDir: 'myDist',
  publicPath,
  // publicPath: '',
  devServer: {
    proxy: {
      '/Api/Log/Write': {
        target: 'http://localhost:3005',
        ws: true, // 开启websockets
        changeOrigin: true, // 开启代理
      },
      '/Api': {
        target: proxyUrl,
        // target: 'http://218.28.143.10:8156',
        ws: true, // 开启websockets
        changeOrigin: true, // 开启代理
        proxyTimeout: 10 * 60 * 1000,
        timeout: 10 * 60 * 1000,
      },
    },
  },
  configureWebpack: {
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ecma: undefined,
            warnings: false,
            parse: {},
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ['// console.log'], // 移除console
            },
          },
        }),
      ],
    },
  },
};
