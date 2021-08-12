import Vue from 'vue';
import Vuex from 'vuex';
import order from './order';
import common from './common';
import summary from './summary';
import unpayList from './unpayList';
import shoppingCar from './shoppingCar';
import timeSelectModule from './timeSelectModule';
import Quotation from './Quotation/Quotation';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV === 'development',
  modules: {
    order,
    common,
    summary,
    Quotation,
    unpayList,
    shoppingCar,
    timeSelectModule,
  },
});
