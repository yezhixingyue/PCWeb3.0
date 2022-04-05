// 导入组件，组件必须声明 name
import RetractableDisplayComp from './src/index.vue';

// 为组件提供 install 安装方法，供按需引入
RetractableDisplayComp.install = (Vue) => {
  Vue.component(RetractableDisplayComp.name, RetractableDisplayComp);
};

// 导出组件
export default RetractableDisplayComp;
