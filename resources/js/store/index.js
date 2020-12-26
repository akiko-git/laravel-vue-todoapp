import Vue from 'vue';
import Vuex from 'vuex';

import task from './task';
import project from './project';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    task,
    project
  }
});

export default store;