/* eslint-disable import/prefer-default-export */
/**
 * 处理element-ui图片组件预览点击弹窗空白部分关闭图片预览功能
 * @param {*} targetNode 监控目标
 * @returns
 */
export function useElImgPreviewMaskClick2Close(targetNode) {
  if (!targetNode) return;

  const callback = (mutationsList) => {
    if (mutationsList.length > 5) return;
    mutationsList.forEach(mutation => {
      if (mutation.type === 'childList'
        && mutation.target && mutation.target.classList && mutation.target.classList.contains('el-image')
        && mutation.previousSibling && mutation.previousSibling.classList && mutation.previousSibling.classList.contains('el-image-viewer__wrapper')) {
        const maskWrap = mutation.previousSibling;
        const oMask = maskWrap.querySelector('.el-image-viewer__mask');
        const oCloseBtn = maskWrap.querySelector('.el-image-viewer__btn.el-image-viewer__close');
        if (oMask && oCloseBtn) {
          oMask.addEventListener('click', (e) => {
            if (e.target === oMask) {
              oCloseBtn.click();
            }
          });
        }
      }
    });
  };

  const observer = new MutationObserver(callback);

  const config = {
    childList: true,
    subtree: true,
  };

  observer.observe(targetNode, config);
}
