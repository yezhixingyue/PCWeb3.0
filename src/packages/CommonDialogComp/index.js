// 导入组件，组件必须声明 name
import CommonDialogComp from './src/index.vue';

// 为组件提供 install 安装方法，供按需引入
CommonDialogComp.install = (Vue) => {
  Vue.component(CommonDialogComp.name, CommonDialogComp);
};

// 导出组件
export default CommonDialogComp;
