// 导入组件，组件必须声明 name
import OrderDetailPriceBox from './src/index.vue';

// 为组件提供 install 安装方法，供按需引入
OrderDetailPriceBox.install = (Vue) => {
  Vue.component(OrderDetailPriceBox.name, OrderDetailPriceBox);
};

// 导出组件
export default OrderDetailPriceBox;
