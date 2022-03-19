/* eslint-disable max-len */
import { MessageBox } from 'element-ui';
import Vue from 'vue';

const msgHandler = (config, msg, center = false) => {
  if (Array.isArray(msg)) {
    const _config = config;
    if (msg.length === 1 && !msg[0].includes('\r\n')) {
      [_config.message] = msg;
    } else {
      _config.dangerouslyUseHTMLString = true;
      let bool = false;
      const content = msg
        .map(it => {
          const alignDirection = /^继续([\d|\D]+)?吗？$/.test(it) || center ? 'center' : 'left';
          let _content = it;
          if (it.includes('\r\n')) {
            let list = it.split('\r\n');
            if (list.length > 2 && /.+：$/.test(list[1])) {
              bool = true;
              _config.customClass += ' widen';
            }
            list = list.map((_it, i) => {
              let style = '';
              if (i > 1 && bool) {
                style = 'text-indent: 2em;';
              }
              return `<div style='${style}'>${_it}</div>`;
            });
            _content = list.join('');
          }
          return `<li style='text-align:${alignDirection};line-height:${bool ? 20 : 18}px;margin-bottom:${bool ? 13 : 8}px'>${_content}</li>`;
        })
        .join('');
      _config.message = `<ul style='display: inline-block'>${content}</ul>`;
    }
  }
};

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
  title = '出错啦 ！', msg, successFunc, failFunc, beforeClose, center,
}) {
  const config = {
    message: msg,
    dangerouslyUseHTMLString: false,
    customClass: 'mp-order-del-pop-reverse-fail',
  };
  msgHandler(config, msg, center);
  MessageBox({
    showClose: true,
    message: config.message,
    type: 'fail',
    confirmButtonText: '确定',
    dangerouslyUseHTMLString: config.dangerouslyUseHTMLString,
    title,
    beforeClose: (action, instance, done) => {
      if (beforeClose) beforeClose();
      done();
    },
    customClass: config.customClass,
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
  const config = {
    message: msg,
    dangerouslyUseHTMLString: false,
    customClass: 'mp-order-del-pop-reverse-warn',
  };
  msgHandler(config, msg);
  MessageBox({
    showClose: true,
    message: config.message,
    type: 'warning',
    confirmButtonText: text,
    dangerouslyUseHTMLString: config.dangerouslyUseHTMLString,
    title,
    customClass: config.customClass,
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
  title = '确定取消此订单吗 ?', msg, successFunc, failFunc, confirmButtonText = '确定', cancelButtonText = '取消', closeOnClickModal = true,
}) {
  const config = {
    message: msg,
    dangerouslyUseHTMLString: false,
    customClass: 'mp-order-del-pop-reverse-warn',
  };
  msgHandler(config, msg);
  MessageBox({
    showClose: true,
    message: config.message,
    type: 'success ',
    confirmButtonText,
    dangerouslyUseHTMLString: config.dangerouslyUseHTMLString,
    title,
    showCancelButton: true,
    closeOnClickModal,
    cancelButtonText,
    customClass: config.customClass,
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
  title, successFunc, failFunc, canCloseOnPressEscape = true, msg = '', confirmButtonText = '确定', cancelButtonText = '关闭', showCancelButton,
}) {
  let customClass = msg ? 'mp-order-del-pop-success hasMsg' : 'mp-order-del-pop-success';
  if (showCancelButton) {
    customClass = `${customClass} two-btns`;
  }
  MessageBox({
    showClose: true,
    confirmButtonText,
    title,
    message: msg,
    closeOnPressEscape: canCloseOnPressEscape,
    customClass,
    showCancelButton,
    cancelButtonText,
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
