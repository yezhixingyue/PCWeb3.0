// 该文件PC端和移动端共用

import api from '@/api';

const localUri = `${window.location.origin}${window.location.pathname.replace(/\/\//, '/').replace(/\/$/, '')}`;

const COMMON_SETTINGS = {
  PcTerminal: 1,
  MobileTerminal: 2,
};

// PC网站相关微信设置数据
const PC_WX_SETTINGS_INFO = {
  appid: 'wx9ad151e90748e34c', // appid wxa6cb88cc884f0f0c
  redirectUri: localUri, // PC端网站扫码后跳转回来的地址
  scope: 'snsapi_login',
  el: 'login_container', // 元素id
  wxLoginJsSrc: 'https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js', // PC端网站需要引入的微信js文件地址
  cssHref: `${localUri}/static/wx_code.css`, // 二维码样式修改css文件 - PC网站使用
};

// 公众号相关微信设置数据
const OFFICIAL_ACCOUNT_WX_SETTINGS_INFO = {
  appid: 'wxa16382188e1e3367',
  redirectUri: localUri,
  scope: 'snsapi_userinfo',
};

const PC_QQ_SETTINGS_INFO = {
  appid: '102086652',
  redirectUri: `${localUri}/OThirdAuth/QQ`,
  AuthPath: '/OThirdAuth/QQ', // QQ授权回调域的pathname属性值 - 即上方非域名部分 - 后面拓展中可能使用pc等前置路径
};

/** 三方平台枚举 */
export const ThirdTypeEnum = {
  wechat: {
    ID: 0,
    Name: '微信',
  },
  QQ: {
    ID: 1,
    Name: 'QQ',
  },
};

/** 客户类型枚举 */
const RoleTypeEnum = {
  customer: {
    ID: 70,
    Name: '客户',
  },
};

/** 类：微信扫码登录相关操作 */
export default class ThirdCodeHandler {
  /* 微信： 下方3个方法为pc网页端所使用
  ----------------------------------------------------------------------- */

  /** 向head中加入必需的js文件 -- 网站使用 */
  static appendScriptLink() {
    const scripts = document.head.getElementsByTagName('script');

    const target = [...scripts].find(s => s.src === PC_WX_SETTINGS_INFO.wxLoginJsSrc);

    if (!target) {
      const script = document.createElement('script');
      script.src = PC_WX_SETTINGS_INFO.wxLoginJsSrc;
      script.charset = 'utf-8';

      document.head.appendChild(script);
    }
  }

  /** 等待一定时长，返回promise */
  static delay(duration = 100) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, duration);
    });
  }

  /** 创建登录对象 -- 后续或可添加加载状态 目前情况也可根据loginObj来判断 - 在外部处理 -- 网站使用 -- state应传递对应页面路由的name属性，以便于后续处理 */
  static async createWxLoginInstance(state) {
    if (!window.WxLogin) {
      await ThirdCodeHandler.delay(20);
      return ThirdCodeHandler.createWxLoginInstance(state);
    }

    const { redirectUri } = PC_WX_SETTINGS_INFO;

    return new window.WxLogin({
      self_redirect: false,
      id: PC_WX_SETTINGS_INFO.el,
      appid: PC_WX_SETTINGS_INFO.appid,
      scope: PC_WX_SETTINGS_INFO.scope,
      redirect_uri: encodeURIComponent(redirectUri),
      state,
      href: PC_WX_SETTINGS_INFO.cssHref,
    });
  }

  /* 微信： 下方方法为移动网页端所使用
  ----------------------------------------------------------------------- */
  /** 公众号获取用户信息授权 */
  static getAuthOnOfficialAccount(state = 'login') {
    const { appid, redirectUri, scope } = OFFICIAL_ACCOUNT_WX_SETTINGS_INFO;

    const _state = `${state}${ThirdTypeEnum.wechat.ID}`;

    // eslint-disable-next-line max-len
    const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${_state}#wechat_redirect`;

    window.location.href = url;
  }

  /* QQ登录： 下方方法为pc网页端所使用
  ----------------------------------------------------------------------- */
  static onLoginByQQClick(route) {
    if (!route) return;

    const { appid, redirectUri, AuthPath } = PC_QQ_SETTINGS_INFO;

    const _query = route.query || {};
    _query.routePath = route.path;
    _query.ThirdType = ThirdTypeEnum.QQ.ID;
    _query.AuthPath = AuthPath;

    const state = Object.entries(_query)
      .map(([key, val]) => (val ? `${key}=${val}` : null))
      .filter(it => it)
      .join('?');

    const url = `https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=${appid}&redirect_uri=${redirectUri}&state=${state}`;

    window.location.href = url;
  }

  /* 路径search解析 返回对象或null
  ----------------- */
  static parsingSearch(searchString) {
    let _params = {};

    try {
      const _arr = searchString
        .replace('?', '')
        .replace(/\?/g, '&')
        .split('&');

      _arr.forEach(str => {
        const [key, value] = str.split('=');
        _params[key] = value;
      });
    } catch (error) {
      _params = null;
    }

    return _params;
  }

  /** 解析url获取code及state，如果无则返回null */
  static getCodeFromLocation(searchString) {
    let _searchString = searchString;

    if (!_searchString && window && window.location && window.location.search) {
      _searchString = window.location.search;
    }

    if (!_searchString) return null;

    const _params = ThirdCodeHandler.parsingSearch(_searchString);

    if (!_params || Object.prototype.toString.call(_params) !== '[object Object]') {
      return null;
    }

    const { code, state } = _params;

    if (!code || !state) return null;

    if (/\d+$/.test(state)) {
      // eslint-disable-next-line prefer-destructuring
      _params.ThirdType = state.match(/\d+$/)[0];
      _params.state = state.replace(/\d+$/, '');
    }

    return _params;
  }

  /** 在router的beforeEach中的相关处理，会返回处理结果 -- 处理微信授权回调页面的相关处理，此处进行任务分配，区分登录和绑定，进行相应跳转，在对应页面中进行下一步的处理 */
  static handleRouterBeforeEach(to, next) {
    // 处理微信跳转回来的code获取 -- 后续提取到WxCodeHandler静态方法中
    const wxPathParams = ThirdCodeHandler.getCodeFromLocation();

    if (wxPathParams) {
      // 如果有则进行进一步处理
      const { code, state } = wxPathParams;
      if (code && state) {
        const query = { ...to.query, ...wxPathParams };

        const _search = window.location.search;

        try {
          window.history.replaceState({}, '', window.location.href.replace(_search, ''));
          next({
            name: state,
            query,
          });
        } catch (error) {
          const _href = window.location.href.replace(_search, '') + _search;

          window.location.href = _href;
        }

        return true;
      }
    }

    return false;
  }

  /** 登录授权 - 登录页面使用 */
  static async authByThirdCode(query, isMobile = false) {
    if (!query) return null;

    const { ThirdType, code } = query;

    if (!ThirdType || !code) return null;

    const temp = {
      Terminal: isMobile ? COMMON_SETTINGS.MobileTerminal : COMMON_SETTINGS.PcTerminal,
      RoleType: RoleTypeEnum.customer.ID,
      Code: code,
      ThirdType: Number(ThirdType),
    };

    if (temp.ThirdType === ThirdTypeEnum.QQ.ID) {
      temp.RedirectUri = PC_QQ_SETTINGS_INFO.redirectUri;
    }

    const resp = await api.getThirdLoginOAuth(temp).catch(() => null);

    const _query = { ...query };
    delete _query.state;
    delete _query.code;
    delete _query.ThirdType;

    const result = { query: _query, authData: null };

    if (resp && resp.data.Status === 1000) {
      // 授权成功
      result.authData = resp.data.Data;
    }

    return result;
  }

  /** 个人设置中绑定三方信息 */
  static async bindByThirdCode(query, callback, isMobile = false) {
    if (!query) return;
    const result = await ThirdCodeHandler.authByThirdCode(query, isMobile);
    if (!result) return;

    if (!result.authData) {
      callback(false, result);
      return;
    }

    const resp = await api.getThirdLoginBind(result.authData).catch(() => null);

    if (resp && resp.data.Status === 1000) {
      callback(true, result);
      return;
    }

    callback(false, result);
  }

  /** 三方信息解绑 */
  static async setThirdUnbind(callback, ThirdType) {
    const resp = await api.getThirdLoginUnBind(ThirdType).catch(() => null);

    if (resp && resp.data.Status === 1000) {
      const data = { ThirdType };
      callback(data);
    }
  }

  /** 获取三方已绑定信息 */
  static getThirdBindInfo(customerInfo, ThirdType) {
    if (
      customerInfo
      && customerInfo.Account
      && Array.isArray(customerInfo.Account.ThirdAuthList)
      && customerInfo.Account.ThirdAuthList.length > 0
    ) {
      const t = customerInfo.Account.ThirdAuthList.find(it => it.ThirdType === ThirdType);

      return t || null;
    }

    return null;
  }
}
