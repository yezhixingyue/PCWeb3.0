/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
/* eslint-disable max-len */
import store from '@/store';
import { md5 } from 'js-md5';
import base64 from 'base64-js';
import _getTimestamp from './_g';
import { delay } from '../../assets/js/utils/utils';
import k from './_k';

const _0x9769 = ['fromCharCode', 'common', 'charCodeAt', 'Account', 'customerInfo', 'length']; const _0x323e = function (_0x976948, _0x323ea9) { _0x976948 -= 0x0; const _0x5ea0dd = _0x9769[_0x976948]; return _0x5ea0dd; }; const string2Uint8Array = _0xbc29cf => { const _0x13a825 = encodeURIComponent(_0xbc29cf).replace(/%([0-9A-F]{2})/g, (_0x369b12, _0x4b6b54) => String[_0x323e('0x0')](`0x${_0x4b6b54}`)); const _0x41e287 = new Uint8Array(_0x13a825[_0x323e('0x5')]); for (let _0x195652 = 0x0; _0x195652 < _0x13a825[_0x323e('0x5')]; _0x195652 += 0x1) { _0x41e287[_0x195652] = _0x13a825[_0x323e('0x2')](_0x195652); } return _0x41e287; }; const getAuthString = async (_0x29e6cf, _0x11bd9e = ![]) => { if (!_0x11bd9e && !store.state[_0x323e('0x1')][_0x323e('0x4')]) { await delay(0x3e8); return getAuthString(_0x29e6cf); } const _0x4cd8ae = k(); const _0x5c769d = await _getTimestamp(); const _0x36a45b = _0x11bd9e ? '' : store.state[_0x323e('0x1')].customerInfo[_0x323e('0x3')].Mobile; const _0xde6fb8 = string2Uint8Array(_0x36a45b + (_0x29e6cf || '') + _0x4cd8ae); const _0x351aea = new Uint8Array([..._0x5c769d, ..._0xde6fb8]); const _0x48a79e = new Uint8Array([...md5.array(_0x351aea), ...string2Uint8Array(';'), ..._0x5c769d]); return base64.fromByteArray(_0x48a79e); };
export default getAuthString;
