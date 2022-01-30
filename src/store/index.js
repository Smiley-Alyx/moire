import Vue from 'vue';
import Vuex from 'vuex';
import catalog from "@/store/modules/catalog";
import product from "@/store/modules/product";
import cart from '@/store/modules/cart';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    catalog,
    product,
    cart,
  },
});
