/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
/* eslint-disable max-len */
import _0x381413 from '@/store';
import { md5 } from 'js-md5';
import _0x2d8c6b from 'base64-js';
import _0x516ecc from './g';
import { delay } from '../../assets/js/utils/utils';
import _0x58b744 from './k';

const _0x5de5 = ['ignoreMobile', 'charCodeAt', 'customerInfo', 'fromCharCode', 'common']; const _0x41e3 = function (_0x5de592, _0x41e33a) { _0x5de592 -= 0x0; const _0x5aa6ac = _0x5de5[_0x5de592]; return _0x5aa6ac; }; const string2Uint8Array = _0x482eb9 => { const _0x62918f = encodeURIComponent(_0x482eb9).replace(/%([0-9A-F]{2})/g, (_0x5f0ca5, _0x32b733) => String[_0x41e3('0x3')](`0x${_0x32b733}`)); const _0x1d5cca = new Uint8Array(_0x62918f.length); for (let _0x4aaa6f = 0x0; _0x4aaa6f < _0x62918f.length; _0x4aaa6f += 0x1) { _0x1d5cca[_0x4aaa6f] = _0x62918f[_0x41e3('0x1')](_0x4aaa6f); } return _0x1d5cca; }; const getAuthString = async (_0xd7544f, _0x544f1c) => { if (!_0x544f1c[_0x41e3('0x0')] && !_0x381413.state[_0x41e3('0x4')].customerInfo) { await delay(0x3e8); return getAuthString(_0xd7544f, _0x544f1c); } const _0x1c6cf3 = _0x58b744(); const _0x1afed9 = await _0x516ecc(_0x544f1c); const _0x2eccc7 = _0x544f1c[_0x41e3('0x0')] ? '' : _0x381413.state[_0x41e3('0x4')][_0x41e3('0x2')].Account.Mobile; const _0x2add96 = string2Uint8Array(_0x2eccc7 + (_0xd7544f || '') + _0x1c6cf3); const _0x718fef = new Uint8Array([..._0x1afed9, ..._0x2add96]); const _0x4fb566 = new Uint8Array([...md5.array(_0x718fef), ...string2Uint8Array(';'), ..._0x1afed9]); return _0x2d8c6b.fromByteArray(_0x4fb566); };
export default getAuthString;
