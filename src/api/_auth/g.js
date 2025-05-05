/* eslint-disable no-bitwise */
/* eslint-disable no-undef */
import api from '../index';

function timestampToUint8Array(timestamp, littleEndian) {
  const uint8Array = new Uint8Array(8);
  const high = Math.floor(timestamp / 0x100000000);
  const low = timestamp % 0x100000000;

  if (littleEndian) {
    // 小端字节序处理低 32 位
    for (let i = 0; i < 4; i += 1) {
      uint8Array[i] = (low >> (i * 8)) & 0xff;
    }
    // 小端字节序处理高 32 位
    for (let j = 4; j < 8; j += 1) {
      uint8Array[j] = (high >> ((j - 4) * 8)) & 0xff;
    }
  } else {
    // 大端字节序处理高 32 位
    for (let k = 0; k < 4; k += 1) {
      uint8Array[k] = (high >> ((3 - k) * 8)) & 0xff;
    }
    // 大端字节序处理低 32 位
    for (let l = 4; l < 8; l += 1) {
      uint8Array[l] = (low >> ((7 - l) * 8)) & 0xff;
    }
  }

  return uint8Array;
}

let diff = 0;
const _getTimestamp = async () => {
  if (diff) {
    return diff + Date.now();
  }

  const _fetchTimestamp = async () => {
    const res = await api.getTimestamp().catch(() => null);
    if (res && res.data.Status === 1000) {
      return Number(res.data.Data);
    }
    return null;
  };

  const timestamp = await _fetchTimestamp();
  if (timestamp) {
    diff = timestamp - Date.now();
    return diff + Date.now();
  }

  return Date.now();
};

const getTimestamp = async () => timestampToUint8Array(await _getTimestamp(), true);

export default getTimestamp;
