import Vue from 'vue';
import VueRouter from 'vue-router';
import Cookie from '@/assets/js/Cookie';
import { useCookie } from '@/assets/js/setup';
import CommonViewPage from '../views/Common/CommonViewPage.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: '/placeOrder',
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  // },
  {
    path: '/login',
    name: 'login',
    meta: {
      y: 0,
      title: '注册登录 - 郑州名片之家电子商务有限公司',
    },
    component: () => import('../views/Login/loginPage.vue'),
  },
  {
    path: '/findPassword',
    name: 'FindPassword',
    meta: {
      y: 0,
      title: '找回密码 - 郑州名片之家电子商务有限公司',
    },
    component: () => import('../views/Login/FindPasswordPage.vue'),
  },
  {
    path: '/common',
    name: 'common',
    component: () => import('../views/Common/CommonPage.vue'),
    redirect: 'placeOrder',
    children: [
      {
        path: '/placeOrder',
        name: 'placeOrder',
        meta: {
          requiresAuth: true,
          y: 0,
          title: '报价下单 - 郑州名片之家电子商务有限公司',
        },
        component: () => import('../views/PlaceOrder/PlaceOrderPage.vue'),
      },
      {
        path: '/OrderPreCreate',
        name: 'OrderPreCreate',
        meta: {
          requiresAuth: true,
          y: 0,
          title: '订单提交 - 郑州名片之家电子商务有限公司',
        },
        component: () => import('../views/PlaceOrder/OrderPreCreatePage.vue'),
      },
      {
        path: '/shopping',
        name: 'shopping',
        component: CommonViewPage,
        redirect: '/shopping/car',
        children: [
          {
            path: '/shopping/car',
            name: 'shoppingCar',
            meta: {
              requiresAuth: true,
              y: 0,
              title: '我的购物车 - 郑州名片之家电子商务有限公司',
            },
            component: () => import('../views/ShoppingCar/ShoppingCarPage.vue'),
          },
          {
            path: '/shopping/detail',
            name: 'shoppingCarDetail',
            meta: {
              requiresAuth: true,
              y: 0,
              title: '购物车产品详情 - 郑州名片之家电子商务有限公司',
            },
            component: () => import('../views/ShoppingCar/ShoppingCarDetailPage.vue'),
          },
          {
            path: '/shopping/submit',
            name: 'shoppingCar/submit',
            meta: {
              requiresAuth: true,
              y: 0,
              title: '购物车订单提交 - 郑州名片之家电子商务有限公司',
            },
            component: () => import('../views/ShoppingCar/ShoppingCarSubmitPage.vue'),
          },
        ],
      },
      {
        path: '/order',
        name: 'order',
        component: CommonViewPage,
        redirect: '/order/list',
        meta: {
          requiresAuth: true,
          y: 0,
          title: '我的订单 - 郑州名片之家电子商务有限公司',
        },
        children: [
          {
            path: '/order/list',
            name: 'orderList',
            meta: {
              requiresAuth: true,
              y: 0,
              title: '我的订单列表 - 郑州名片之家电子商务有限公司',
              // record: true, // 是否记录滚动位置
            },
            component: () => import('../views/OrderPages/OrderListPage.vue'),
          },
          {
            path: '/order/detail',
            name: 'orderDetail',
            meta: {
              requiresAuth: true,
              y: 0,
              title: '我的订单详情 - 郑州名片之家电子商务有限公司',
            },
            component: () => import('../views/OrderPages/OrderDetailPage.vue'),
          },
        ],
      },
      {
        path: '/unpay',
        name: 'unpay',
        component: CommonViewPage,
        redirect: '/unpay/list',
        meta: {
          requiresAuth: true,
          y: 0,
          title: '未付款单 - 郑州名片之家电子商务有限公司',
        },
        children: [
          {
            path: '/unpay/list',
            name: 'unpayList',
            meta: {
              requiresAuth: true,
              y: 0,
              title: '未付款单 - 郑州名片之家电子商务有限公司',
            },
            component: () => import('../views/UnpayList/UnpayListPage.vue'),
          },
          // {
          //   path: '/order/detail',
          //   name: 'orderDetail',
          //   meta: {
          //     requiresAuth: true,
          //     y: 0,
          //     title: '未付款单详情',
          //   },
          //   component: () => import('../views/OrderPages/OrderDetailPage.vue'),
          // },
          {
            path: '/unpay/detail',
            name: 'unpayOrderDetail',
            meta: {
              requiresAuth: true,
              y: 0,
              title: '产品详情 - 郑州名片之家电子商务有限公司',
            },
            component: () => import('../views/UnpayList/UnpayOrderDetailPage.vue'),
          },
          {
            path: '/unpay/submit',
            name: 'unpayOrderSubmit',
            meta: {
              requiresAuth: true,
              y: 0,
              title: '订单支付 - 郑州名片之家电子商务有限公司',
            },
            component: () => import('../views/UnpayList/UnpayOrderSubmitPage.vue'),
          },
        ],
      },
      {
        path: '/serviceAfterSales',
        name: 'serviceAfterSales',
        meta: {
          requiresAuth: true,
          y: 0,
          title: '售后单列表 - 郑州名片之家电子商务有限公司',
        },
        component: () => import('../views/serviceAfterSales/serviceAfterSalesPage.vue'),
      },
      {
        path: '/bill',
        name: 'bill',
        meta: {
          requiresAuth: true,
          y: 0,
          title: '我的账单 - 郑州名片之家电子商务有限公司',
        },
        component: () => import('../views/Bill/BillPage.vue'),
      },
      {
        path: '/mySetting',
        name: 'mySetting',
        component: () => import('../views/mySettingPages/mySettingCommonPage.vue'),
        redirect: '/mySetting/account',
        children: [
          {
            path: '/mySetting/account',
            name: 'mySettingAccount',
            meta: {
              requiresAuth: true,
              y: 0,
              title: '账户信息 - 郑州名片之家电子商务有限公司',
            },
            component: () => import('../views/mySettingPages/AccountPage.vue'),
          },
          {
            path: '/mySetting/address',
            name: 'mySettingAddress',
            meta: {
              requiresAuth: true,
              y: 0,
              title: '收货地址 - 郑州名片之家电子商务有限公司',
            },
            component: () => import('../views/mySettingPages/AddressPage.vue'),
          },
          {
            path: '/mySetting/couponCenter',
            name: 'mySettingCouponCenter',
            meta: {
              requiresAuth: true,
              y: 0,
              title: '领券中心 - 郑州名片之家电子商务有限公司',
            },
            component: () => import('../views/mySettingPages/CouponCenterPage.vue'),
          },
          {
            path: '/mySetting/myCoupons',
            name: 'mySettingMyCoupons',
            meta: {
              requiresAuth: true,
              y: 0,
              title: '我的优惠券 - 郑州名片之家电子商务有限公司',
            },
            component: () => import('../views/mySettingPages/MyCouponsPage.vue'),
          },
          {
            path: '/mySetting/subAccountManage',
            name: 'subAccountManage',
            meta: {
              requiresAuth: true,
              y: 0,
              title: '子账号管理 - 郑州名片之家电子商务有限公司',
            },
            component: () => import('../views/mySettingPages/SubAccountManagePage.vue'),
          },
          {
            path: '/mySetting/changePwd',
            name: 'mySettingChangePwd',
            meta: {
              requiresAuth: true,
              y: 0,
              title: '修改密码 - 郑州名片之家电子商务有限公司',
            },
            component: () => import('../views/mySettingPages/ChangePwdPage.vue'),
          },
          {
            path: '/mySetting/changeMobile',
            name: 'mySettingChangeMobile',
            meta: {
              requiresAuth: true,
              y: 0,
              title: '修改手机号 - 郑州名片之家电子商务有限公司',
            },
            component: () => import('../views/mySettingPages/ChangeMobilePage.vue'),
          },
          {
            path: '/mySetting/setting',
            name: 'mySettingPage',
            meta: {
              requiresAuth: true,
              y: 0,
              title: '我的设置 - 郑州名片之家电子商务有限公司',
            },
            component: () => import('../views/mySettingPages/SettingPage.vue'),
          },
        ],
      },
      {
        path: '/feedback/:id/:desc/:type',
        name: 'feedback',
        meta: {
          requiresAuth: true,
          y: 0,
          title: '问题反馈提交 - 郑州名片之家电子商务有限公司',
        },
        component: () => import('../views/FeedbackPages/FeedbackAdd.vue'),
      },
      {
        path: '/feedbackList',
        name: 'feedbackList',
        meta: {
          requiresAuth: true,
          y: 0,
          title: '问题反馈列表 - 郑州名片之家电子商务有限公司',
        },
        component: () => import('../views/FeedbackPages/FeedbackList.vue'),
      },
    ],
  },
  {
    path: '/NotFind',
    name: 'NotFind',
    meta: {
      title: '未找到页面',
    },
    component: () => import('../views/Sys/NotFind.vue'),
  },
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return { selector: to.hash };
    }
    return { x: 0, y: 0 };
  },
});

router.beforeEach(async (to, from, next) => {
  let _auth;
  if (useCookie) _auth = Cookie.getCookie('token');
  else _auth = sessionStorage.getItem('token');
  if (!_auth && !useCookie) _auth = localStorage.getItem('token');
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  if (from.name === 'orderList' || from.name === 'feedbackList') {
    const oApp = document.getElementById('app');
    // eslint-disable-next-line no-param-reassign
    from.meta.y = oApp.scrollTop;
  }
  // 判断该路由是否需要登录权限
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (to.name === 'login') {
      if (_auth) next({ path: '/placeOrder' });
      else next();
    } else if (to.name === 'placeOrder' && to.query.token) {
      if (!useCookie) localStorage.setItem('token', to.query.token);
      else Cookie.setItem('token', to.query.token, 24 * 60 * 60); // 该情况将不存在
      next({
        path: '/placeOrder',
        query: { id: to.query.id },
      });
    } else if (to.name === 'placeOrder' && to.query.id && !_auth && !to.query.token) {
      next({
        path: '/login',
        query: { id: to.query.id },
      });
    } else if (_auth) {
      next();
    } else {
      next({
        path: '/login',
        query: { redirect: to.path },
      });
    }
  } else {
    if (_auth && to.name === 'login') {
      next({ path: '/placeOrder' });
      return;
    }
    next();
  }
});

router.afterEach((to, from) => {
  const oApp = document.getElementById('app');
  if ((from.name === 'orderDetail' && to.name === 'orderList')
   || (from.name === 'feedback' && to.name === 'feedbackList')) {
    setTimeout(() => {
      oApp.scrollTop = to.meta.y;
    }, 0);
    return;
  }
  const bodySrcollTop = oApp.scrollTop;
  if (bodySrcollTop !== 0) {
    setTimeout(() => {
      oApp.scrollTop = 0;
    }, 0);
    return;
  }
  const docSrcollTop = document.documentElement.scrollTop;
  if (docSrcollTop !== 0) {
    document.documentElement.scrollTop = 0;
  }
});

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
};

export default router;
