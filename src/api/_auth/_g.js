/* eslint-disable no-bitwise */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import _0x25d616 from '../index';

const _0x5c5a = ['getTimestamp', 'now', 'data']; const _0x451c = function (_0x5c5a3a, _0x451c95) { _0x5c5a3a -= 0x0; const _0x514a9d = _0x5c5a[_0x5c5a3a]; return _0x514a9d; }; function timestampToUint8Array(_0x327a52, _0x298aac) { const _0xde01e = new Uint8Array(0x8); const _0x43c062 = Math.floor(_0x327a52 / 0x100000000); const _0x25d94c = _0x327a52 % 0x100000000; if (_0x298aac) { for (let _0x4b9a09 = 0x0; _0x4b9a09 < 0x4; _0x4b9a09 += 0x1) { _0xde01e[_0x4b9a09] = _0x25d94c >> _0x4b9a09 * 0x8 & 0xff; } for (let _0x341a4f = 0x4; _0x341a4f < 0x8; _0x341a4f += 0x1) { _0xde01e[_0x341a4f] = _0x43c062 >> (_0x341a4f - 0x4) * 0x8 & 0xff; } } else { for (let _0x5a5a4a = 0x0; _0x5a5a4a < 0x4; _0x5a5a4a += 0x1) { _0xde01e[_0x5a5a4a] = _0x43c062 >> (0x3 - _0x5a5a4a) * 0x8 & 0xff; } for (let _0x5089be = 0x4; _0x5089be < 0x8; _0x5089be += 0x1) { _0xde01e[_0x5089be] = _0x25d94c >> (0x7 - _0x5089be) * 0x8 & 0xff; } } return _0xde01e; }let diff = 0x0; let serverTimestamp = 0x0; let getServerTimestampTime = 0x0; const _getTimestamp = async () => { if (diff) { return diff + Date.now(); } const _0x26d5d2 = async () => { const _0x57d41a = await _0x25d616[_0x451c('0x0')]().catch(() => null); if (_0x57d41a && _0x57d41a[_0x451c('0x2')].Status === 0x3e8) { return Number(_0x57d41a[_0x451c('0x2')].Data); } return null; }; const _0x532eef = await _0x26d5d2(); if (_0x532eef) { serverTimestamp = _0x532eef; getServerTimestampTime = Date.now(); diff = _0x532eef - getServerTimestampTime; return diff + Date.now(); } return Date[_0x451c('0x1')](); }; const getTimestamp = async () => { const _0x45c7a3 = await _getTimestamp(); return { timestampUint8Array: timestampToUint8Array(_0x45c7a3, !![]), timeContent: `${Date.now()}-${_0x45c7a3}-${serverTimestamp}-${getServerTimestampTime}-${diff}` }; };

export default getTimestamp;
