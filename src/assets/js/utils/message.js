/* eslint-disable max-len */
import { MessageBox } from 'element-ui';
import Vue from 'vue';

/**
 * 警告提示框 --- 不含内容，只有标题 单按钮
 *
 * @param {*} msg
 * @param {*} successFunc
 * @param {*} failFunc
 */
function failSingle({ msg, successFunc, failFunc }) {
  MessageBox({
    showClose: true,
    confirmButtonText: '确定',
    title: msg,
    customClass: 'mp-order-del-pop-reverse-warn-null',
  }).then(() => successFunc && successFunc()).catch(() => failFunc && failFunc());
}

/**
 * 失败提示框 --- 有标题和内容 单按钮
 *
 * @param {string} [title='出错啦 ！']
 * @param {*} msg
 * @param {*} successFunc
 * @param {*} failFunc
 */
function failSingleError({
  title = '出错啦 ！', msg, successFunc, failFunc, beforeClose,
}) {
  // // console.log(title);
  MessageBox({
    showClose: true,
    message: msg,
    type: 'fail ',
    confirmButtonText: '确定',
    title,
    beforeClose: (action, instance, done) => {
      if (beforeClose) beforeClose();
      done();
    },
    customClass: 'mp-order-del-pop-reverse-fail',
  }).then(() => successFunc && successFunc()).catch(() => failFunc && failFunc());
}

/**
 * 警告提示框 --- 有标题和内容 单按钮
 *
 * @param {*} msg
 * @param {*} successFunc
 * @param {*} failFunc
 * @param {string} [title='注意']
 * @param {string} [text='关闭']
 */
function warnSingleError({
  msg, successFunc, failFunc, title = '注意', text = '确定',
}) {
  MessageBox({
    showClose: true,
    message: msg,
    type: 'warning',
    confirmButtonText: text,
    title,
    customClass: 'mp-order-del-pop-reverse-warn',
  }).then(() => successFunc && successFunc()).catch(() => failFunc && failFunc());
}

/**
 * 警告提示框 --- 有标题和内容 双按钮   用于取消或删除  如订单列表取消
 *
 * @param {string} [title='确定取消此订单吗 ?']
 * @param {*} msg
 * @param {*} successFunc
 * @param {*} failFunc
 */
function warnCancelBox({
  title = '确定取消此订单吗 ?', msg, successFunc, failFunc, confirmButtonText = '确定', cancelButtonText = '取消',
}) {
  MessageBox({
    showClose: true,
    message: msg,
    type: 'success ',
    confirmButtonText,
    title,
    customClass: 'mp-order-del-pop-reverse-warn',
    showCancelButton: true,
    cancelButtonText,
  }).then(() => successFunc && successFunc()).catch(() => failFunc && failFunc());
}

/**
 * 警告提示框 --- 有标题, 无内容 双按钮   用于图片删除等
 *
 * @param {*} title
 * @param {*} successFunc
 * @param {*} failFunc
 */
function warnCancelNullMsg({ title, successFunc, failFunc }) {
  MessageBox({
    showClose: true,
    confirmButtonText: '确定',
    showCancelButton: true,
    cancelButtonText: '取消',
    title,
    customClass: 'mp-order-del-pop-reverse-warn-null',
  }).then(() => successFunc && successFunc()).catch(() => failFunc && failFunc());
}

/**
 * 成功提示框 --- 不含内容，只有标题 单按钮 -- 后加msg 添加有内容
 *
 * @param {*} title
 * @param {*} successFunc
 * @param {*} failFunc
 * @param {boolean} [canCloseOnPressEscape=true]
 */
function successSingle({
  title, successFunc, failFunc, canCloseOnPressEscape = true, msg = '',
}) {
  MessageBox({
    showClose: true,
    confirmButtonText: '确定',
    title,
    message: msg,
    closeOnPressEscape: canCloseOnPressEscape,
    customClass: 'mp-order-del-pop-success',
  // eslint-disable-next-line no-nested-ternary
  }).then(() => successFunc && successFunc()).catch(() => (failFunc ? failFunc() : successFunc ? successFunc() : ''));
}

/**
 * 警告提示框 --- 有标题, 无内容 双按钮   用于图片删除等 小文字 可换行
 *
 * @param {*} title
 * @param {*} successFunc
 * @param {*} failFunc
 */
function warnCancelMsgSM({ title, successFunc, failFunc }) {
  MessageBox({
    showClose: true,
    confirmButtonText: '确定',
    showCancelButton: true,
    cancelButtonText: '取消',
    // dangerouslyUseHTMLString: true,
    title,
    customClass: 'mp-del-pop-reverse-warn-wrap-sm',
  // eslint-disable-next-line no-nested-ternary
  }).then(() => successFunc && successFunc()).catch(() => (failFunc ? failFunc() : successFunc ? successFunc() : ''));
}

/**
 * 处理使用isLoading状态时的错误处理回调函数
 *
 * @param {*} error
 * @param {*} successFunc
 * @param {*} failFunc
 */
// eslint-disable-next-line object-curly-newline
function handleLoadingError({ error, successFunc, failFunc, title }) {
  let msg = error;
  if (error.response && error.response.data && error.response.data.Message) {
    msg = error.response.data.Message;
  } else if (msg.message) {
    msg = msg.message;
  }
  // // console.log(title);
  failSingleError({
    title, msg, successFunc, failFunc,
  });
}

const obj = {
  failSingle,
  failSingleError,
  warnSingleError,
  warnCancelBox,
  warnCancelNullMsg,
  successSingle,
  warnCancelMsgSM,
  handleLoadingError,
};

Vue.prototype.messageBox = obj;

export default obj;
