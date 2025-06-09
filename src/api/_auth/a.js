/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
/* eslint-disable max-len */
import store from '@/store';
import { md5 } from 'js-md5';
import base64 from 'base64-js';
import _getTimestamp from './g';
import { delay } from '../../assets/js/utils/utils';
import k from './k';

const string2Uint8Array = (str) => {
  // 将字符串转换为 URI 编码的 UTF-8 格式
  const escaped = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, hex) => String.fromCharCode(`0x${hex}`));

  // 将字符逐个转换为字节
  const bytes = new Uint8Array(escaped.length);
  for (let i = 0; i < escaped.length; i += 1) {
    bytes[i] = escaped.charCodeAt(i);
  }

  return bytes;
};

const getAuthString = async (token, config) => {
  if (!config.ignoreMobile && !store.state.common.customerInfo) {
    await delay(1000);

    return getAuthString(token, config);
  }

  const key = k();

  const timestampUint8Array = await _getTimestamp(config);

  // Base64编码字符串(MD5(时间戳二进制数组+ (手机号码+Token+Key)二进制数组)+";"二进制+时间戳二进制数组)
  const mobile = config.ignoreMobile ? '' : store.state.common.customerInfo.Account.Mobile;

  const strUint8Array = string2Uint8Array(mobile + (token || '') + key);

  const combineUint8Array = new Uint8Array([...timestampUint8Array, ...strUint8Array]);

  const _content = new Uint8Array([...md5.array(combineUint8Array), ...string2Uint8Array(';'), ...timestampUint8Array]);

  return base64.fromByteArray(_content);
};

export default getAuthString;
