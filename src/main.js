import './public-path';
import Vue from 'vue';
// import Element from 'element-ui';
import Clickoutside from 'element-ui/lib/utils/clickoutside';
import App from './App.vue';
import router from './router';
import store from './store';
import api from './api/index';
import '@/assets/js/utils/dialogDrag';
import '@/assets/js/utils/filter';
import './packages/commonFilters';
import './packages/directive';
import './assets/css/common.scss';
import './assets/css/summary.scss';
import './assets/css/iconfont/iconfont.css';
import './assets/css/iconfont-member/iconfont.css'; // 两个图标 企业认证和会员中心
import './assets/js/utils/message';
import utils from './assets/js/utils/utils';
import './assets/js/filters/filters';
import './assets/js/utils/loadElement';
import validateCheck from './assets/js/validator/validateCheck';

import './api/mock';

Vue.config.productionTip = false;
Vue.prototype.validateCheck = validateCheck;
Vue.prototype.api = api;
Vue.prototype.utils = utils;
Vue.prototype.$utils = utils;

console.log(Clickoutside);

Vue.directive('clickoutside', Clickoutside);
// Vue.use(Element);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

// function browserRedirect() {
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

// let instance = null;
// function render(props = {}) {
//   const { container } = props;

//   instance = new Vue({
//     router,
//     store,
//     render: (h) => h(App),
//   }).$mount(container ? container.querySelector('#app') : '#app');
// }

// // 独立运行时
// if (!window.__POWERED_BY_QIANKUN__) {
//   render();
// }

// export async function bootstrap() {
//   console.log('[vue] vue app bootstraped');
// }
// export async function mount(props) {
//   console.log('[vue] props from main framework', props);
//   render(props);
// }
// export async function unmount() {
//   instance.$destroy();
//   instance.$el.innerHTML = '';
//   instance = null;
// }
