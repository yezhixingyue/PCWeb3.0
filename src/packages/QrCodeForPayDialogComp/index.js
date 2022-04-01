// 导入组件，组件必须声明 name
import QrCodeForPayDialogComp from './src/index.vue';

// 为组件提供 install 安装方法，供按需引入
QrCodeForPayDialogComp.install = (Vue) => {
  Vue.component(QrCodeForPayDialogComp.name, QrCodeForPayDialogComp);
};

// 导出组件
export default QrCodeForPayDialogComp;
