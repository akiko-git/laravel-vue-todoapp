import Vue from 'vue';
import Vuex from 'vuex';

import auth from './auth';
import error from './error';
import task from './task';
import project from './project';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    auth,
    error,
    task,
    project
  }
});

export default store;