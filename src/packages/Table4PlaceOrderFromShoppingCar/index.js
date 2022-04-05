// 导入组件，组件必须声明 name
import Table4PlaceOrderFromShoppingCar from './src/index.vue';

// 为组件提供 install 安装方法，供按需引入
Table4PlaceOrderFromShoppingCar.install = (Vue) => {
  Vue.component(Table4PlaceOrderFromShoppingCar.name, Table4PlaceOrderFromShoppingCar);
};

// 导出组件
export default Table4PlaceOrderFromShoppingCar;
