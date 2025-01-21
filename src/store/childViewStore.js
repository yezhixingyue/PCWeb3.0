/**
 * 该模块主要用于子页面（保留原页面数据类型）相关
 */

export default {
  namespaced: true,
  state: {
    detailPreview: { // 全局图片预览
      showViewer: false,
      previewSrcList: [],
    },
  },
  mutations: {
    setDetailPreview(state, { showViewer, previewSrcList } = {}) {
      state.detailPreview.showViewer = showViewer || false;
      state.detailPreview.previewSrcList = previewSrcList || [];
    },
  },
  actions: {},
};
