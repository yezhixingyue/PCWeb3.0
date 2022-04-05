// 导入组件，组件必须声明 name
import FileSelectComp from './src/index.vue';

// 为组件提供 install 安装方法，供按需引入
FileSelectComp.install = (Vue) => {
  Vue.component(FileSelectComp.name, FileSelectComp);
};

// 导出组件
export default FileSelectComp;
