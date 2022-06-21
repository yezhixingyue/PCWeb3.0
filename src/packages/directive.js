import Vue from 'vue';

const onClick = (e) => {
  if (e.target.readOnly) e.target.readOnly = false;
};

const onBlur = (e) => {
  e.target.readOnly = true;
};

const onKeyup = (e) => {
  if (e.keyCode === 9) {
    if (e.target.readOnly) {
      e.target.readOnly = false;
      e.target.focus();
    }
  }
};

const getInputDom = (el) => {
  if (!el) return null;
  let target;
  if (el.tagName === 'INPUT') {
    target = el;
  } else {
    const doms = el.getElementsByTagName('input');
    if (doms.length === 1) {
      [target] = doms;
    }
  }
  return target;
};

const temp = {
  bind(el) {
    const oInp = getInputDom(el);
    if (!oInp) return;
    oInp.setAttribute('autocomplete', 'new-password');
    oInp.readOnly = true;
    oInp.addEventListener('blur', onBlur);
    oInp.addEventListener('click', onClick);
    oInp.addEventListener('keyup', onKeyup);
  },
  unbind(el) {
    const oInp = getInputDom(el);
    if (!oInp) return;
    oInp.removeEventListener('blur', onBlur);
    oInp.removeEventListener('click', onClick);
    oInp.removeEventListener('keyup', onKeyup);
  },
};

Vue.directive('banAutoComplete', temp);
