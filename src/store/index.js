import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import createPersistedState from "vuex-persistedstate";

import { geolocationModule } from "./geolocation.module";

export default new Vuex.Store({
  modules: {
    geolocationModule
  },
  plugins: [createPersistedState()]
});
