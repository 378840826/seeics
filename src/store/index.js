import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import common from './modules/common';
import tags from './modules/tags';
import logs from './modules/logs';
import dict from './modules/dict';
import shop from './modules/shop';
import getters from './getters';

Vue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    shop,
    user,
    common,
    logs,
    tags,
    dict,
  },
  getters,
});

export default store;
