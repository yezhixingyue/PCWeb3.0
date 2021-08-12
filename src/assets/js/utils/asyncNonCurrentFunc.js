async function handleAsyncFunc(func, res, index, list) {
  if (index >= list.length) return;
  const _s = await func(list[index]);
  res.push(_s);
  const i = index + 1;
  await handleAsyncFunc(func, res, i, list);
}

/**
 * @description: 用于非并发方式处理数组组成的异步函数， 和上面函数为一体
 * @param {type}
 * @return {type}
 */
export default async function asyncNonCurrentFunc(func, list) {
  if (!list || list.length === 0) return [];
  const res = [];
  await handleAsyncFunc(func, res, 0, list);
  return res;
}
