import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import createPersistedState from "vuex-persistedstate";

import { geolocationModule } from "./geolocation.module";
import deliveryCart from "./deliverycart.module";
import { userModule } from "./user.module";

export default new Vuex.Store({
  modules: {
    geolocationModule,
    userModule,
    deliveryCart: deliveryCart
  },
  plugins: [createPersistedState()]
});
