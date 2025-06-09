/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
/* eslint-disable max-len */
import _0x580883 from '@/store';
import { md5 } from 'js-md5';
import _0x38d7f5 from 'base64-js';
import _0x47f7ec from './_g';
import { delay } from '../../assets/js/utils/utils';
import _0x3bc84f from './_k';

const _0x5ba8 = ['customerInfo', 'fromCharCode', 'charCodeAt', 'state', 'array', 'Mobile', 'replace']; const _0x26b8 = function (_0x5ba85a, _0x26b890) { _0x5ba85a -= 0x0; const _0x1d06cd = _0x5ba8[_0x5ba85a]; return _0x1d06cd; }; const string2Uint8Array = _0x38a4be => { const _0x2ccb51 = encodeURIComponent(_0x38a4be)[_0x26b8('0x6')](/%([0-9A-F]{2})/g, (_0x22c5e1, _0x37a90a) => String[_0x26b8('0x1')](`0x${_0x37a90a}`)); const _0xd4db0a = new Uint8Array(_0x2ccb51.length); for (let _0x2b4a55 = 0x0; _0x2b4a55 < _0x2ccb51.length; _0x2b4a55 += 0x1) { _0xd4db0a[_0x2b4a55] = _0x2ccb51[_0x26b8('0x2')](_0x2b4a55); } return _0xd4db0a; }; const getAuthString = async (_0x498d02, _0x130796) => { if (!_0x130796.ignoreMobile && !_0x580883[_0x26b8('0x3')].common[_0x26b8('0x0')]) { await delay(0x3e8); return getAuthString(_0x498d02, _0x130796); } const _0x10370b = _0x3bc84f(); const { timestampUint8Array, timeContent } = await _0x47f7ec(); const _0x5edec3 = _0x130796.ignoreMobile ? '' : _0x580883[_0x26b8('0x3')].common[_0x26b8('0x0')].Account[_0x26b8('0x5')]; const _0x1642e1 = string2Uint8Array(_0x5edec3 + (_0x498d02 || '') + _0x10370b); const _0x276bc9 = new Uint8Array([...timestampUint8Array, ..._0x1642e1]); const _0x4b9a98 = new Uint8Array([...md5[_0x26b8('0x4')](_0x276bc9), ...string2Uint8Array(';'), ...timestampUint8Array]); return { authStr: _0x38d7f5.fromByteArray(_0x4b9a98), timeContent }; };

export default getAuthString;
