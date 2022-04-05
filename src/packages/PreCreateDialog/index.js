// 导入组件，组件必须声明 name
import PreCreateDialog from './src/index.vue';

// 为组件提供 install 安装方法，供按需引入
PreCreateDialog.install = (Vue) => {
  Vue.component(PreCreateDialog.name, PreCreateDialog);
};

// 导出组件
export default PreCreateDialog;
