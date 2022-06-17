import graphService from './modules/graph';

import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

axios.defaults.baseURL = `${process.env.VUE_APP_PATH}/api/`;
axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
    console.error(error);
    return Promise.reject(error);
});

export default new Vuex.Store({
  modules: {
    graphService,
  }
})
