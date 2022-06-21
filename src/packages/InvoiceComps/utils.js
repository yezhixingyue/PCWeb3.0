/**
 * 银行卡号校验 --- 仅用于私户校验 对公账号不遵循该方法 -- 所以系统内不使用该方法校验
 * @param {*} card 需要校验的卡号 -- 应传递字符串格式  数字格式超出长度后会导致js精度丢失
 * @returns boolean
 */
export const verifyBankCard = card => {
  let nums = card.toString().replace(/\s/g, '').split('');// 变为字符串再转数组

  if (nums.length > 19 || nums.length < 15) return false;// 银行卡号长度为15-19

  const lastNum = parseInt(nums[nums.length - 1], 10);// 取出最后一位--校验位
  nums.length -= 1;// 删除最后一个值
  nums = nums.reverse();// 变为数组再颠倒
  let sum = 0;// 总数
  nums.forEach((it, i) => {
    let _num = parseInt(it, 10);
    if (i % 2 === 0) {
      const n = _num * 2;
      _num = n < 10 ? n : (parseInt(n / 10, 10) + (n % 10));
    }
    sum += _num;
  });
  return (sum + lastNum) % 10 === 0;
};

export const formatBankCard = str => {
  const card = str.toString().replace(/\s|\D/g, '');
  const list = card.match(/\d{4}/g) || [];
  const right = card.replace(/\d{4}/g, '');
  if (right) list.push(right);
  return list.join(' ');
};

export default {
  verifyBankCard,
  formatBankCard,
};
