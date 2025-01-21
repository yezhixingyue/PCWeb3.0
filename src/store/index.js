import Vue from 'vue';
import Vuex from 'vuex';
import order from './order';
import childViewStore from './childViewStore';
import Authentication from './Authentication';
import common from './common';
import summary from './summary';
import unpayList from './unpayList';
import shoppingCar from './shoppingCar';
import timeSelectModule from './timeSelectModule';
import Quotation from './Quotation/Quotation';
import invoice from './Invoice/invoiceStore';

Vue.use(Vuex);

const store = new Vuex.Store({
  strict: process.env.NODE_ENV === 'development',
  modules: {
    order,
    common,
    invoice,
    summary,
    Quotation,
    unpayList,
    shoppingCar,
    timeSelectModule,
    Authentication,
    childViewStore,
  },
});

export default store;
