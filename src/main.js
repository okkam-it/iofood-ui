import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import i18n from "./locales/i18n";

Vue.config.productionTip = false;

import axios from "axios";
import VueAxios from "vue-axios";
Vue.use(VueAxios, axios);

import geolocationMixin from "./mixins/GeolocationMixin";
Vue.mixin(geolocationMixin);

import UtilsMixin from "./mixins/UtilsMixin";
Vue.mixin(UtilsMixin);

/* import VueI18n from 'vue-i18n'
Vue.use(VueI18n) */

import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
