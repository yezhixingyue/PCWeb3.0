import Vue from 'vue';
// import Element from 'element-ui';
import App from './App.vue';
import router from './router';
import store from './store';
import api from './api/index';
import '@/assets/js/utils/dialogDrag';
import '@/assets/js/utils/filter';
import './assets/css/common.scss';
import './assets/css/summary.scss';
import './assets/css/iconfont/iconfont.css';
import './assets/js/utils/message';
import utils from './assets/js/utils/utils';
import './assets/js/filters/filters';
import './assets/js/utils/loadElement';
import validateCheck from './assets/js/validator/validateCheck';

Vue.config.productionTip = false;
Vue.prototype.validateCheck = validateCheck;
Vue.prototype.api = api;
Vue.prototype.utils = utils;

// Vue.use(Element);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

// function browserRedirect() {
//   // console.log('browserRedirect');
//   const sUserAgent = navigator.userAgent.toLowerCase();
//   if (/ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/.test(sUserAgent)) {
//     // 跳转移动端页面
//     window.location.href = 'http://www.mpzj.cn:8156/M/';
//   } else {
//     let token = sessionStorage.getItem('token');
//     if (!token) token = localStorage.getItem('token');
//     if (!token) {
//       router.replace('/login');
//     }
//   }
// }
// browserRedirect();
