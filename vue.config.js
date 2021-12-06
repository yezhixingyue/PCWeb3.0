/* eslint-disable max-len */
const TerserPlugin = require('terser-webpack-plugin');

let proxyUrl = 'http://192.168.3.68:8050';
if (process.env.VUE_APP_BASE_URL && process.env.VUE_APP_BASE_URL === 'test-development-8078') proxyUrl = 'http://192.168.1.92:8050';
if (process.env.VUE_APP_BASE_URL && process.env.VUE_APP_BASE_URL === 'test-production-8088') proxyUrl = 'http://192.168.1.92:8030';

module.exports = {
  productionSourceMap: process.env.NODE_ENV === 'development', // 是否打包sourcemap
  outputDir: 'myDist',
  publicPath: process.env.NODE_ENV === 'development' ? '' : '/pc/',
  devServer: {
    proxy: {
      '/Api': {
        target: proxyUrl,
        // target: 'http://218.28.143.10:8156',
        ws: true, // 开启websockets
        changeOrigin: true, // 开启代理
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
