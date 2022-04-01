// 导入组件，组件必须声明 name
import PaymentPriceDisplayComp from './src/index.vue';

// 为组件提供 install 安装方法，供按需引入
PaymentPriceDisplayComp.install = (Vue) => {
  Vue.component(PaymentPriceDisplayComp.name, PaymentPriceDisplayComp);
};

// 导出组件
export default PaymentPriceDisplayComp;
