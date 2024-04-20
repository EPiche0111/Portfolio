import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: '',
    userId: undefined,
    username: '',
    admin: false,
  },
  getters: {
  },
  mutations: {
    setToken(state, tokenStr) {
      state.token = tokenStr || '';
    },
    setUsername(state, name) {
      state.username = name || '';
    },
    setUserId(state, id) {
      state.userId = id;
    },
    setAdmin(state, admin) {
      state.admin = admin;
    },
  },
  actions: {
  },
  modules: {
  },
});
