import axios from 'axios';
import qs from 'qs';

export default class CancelToken {
  recordCancelTokenList = []

  static getFullUrlByQs(config) {
    const {
      method, url, params, data,
    } = config;
    return [method, url, qs.stringify(params), qs.stringify(data)].join('&');
  }

  setCancelToken(config) {
    const _config = config;
    const fullUrl = CancelToken.getFullUrlByQs(config);
    _config.cancelToken = new axios.CancelToken(c => {
      this.recordCancelTokenList.push({
        [fullUrl]: c,
      });
    });
  }

  removeCancelToken(config) {
    if (!config) return;
    const fullUrl = CancelToken.getFullUrlByQs(config);
    const i = this.recordCancelTokenList.findIndex(it => Object.keys(it)[0] === fullUrl);
    if (i > -1) this.recordCancelTokenList.splice(i, 1);
  }

  cancelAllRequest() {
    if (this.recordCancelTokenList.length > 0) {
      this.recordCancelTokenList.forEach(it => {
        const key = Object.keys(it)[0];
        it[key]();
      });
      this.recordCancelTokenList = [];
    }
  }
}
