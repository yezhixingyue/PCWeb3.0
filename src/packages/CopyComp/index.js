// 导入组件，组件必须声明 name
import CopyComp from './src/index.vue';

// 为组件提供 install 安装方法，供按需引入
CopyComp.install = (Vue) => {
  Vue.component(CopyComp.name, CopyComp);
};

// 导出组件
export default CopyComp;
