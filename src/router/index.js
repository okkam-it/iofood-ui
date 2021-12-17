import Vue from "vue";
import VueRouter from "vue-router";
// import Home from "../views/Home.vue";
/* import Explore from "../views/Explore.vue";
import Geolocator from "../views/Geolocator.vue";
import Search from "../views/Search.vue";
import Results from "../views/Results.vue";
import Web from "../views/Web.vue";
import FoodServiceMenuTable from "../views/FoodServiceMenuTable.vue"; */
// import FoodService from "../views/FoodService.vue";
import store from "@/store/index.js";

Vue.use(VueRouter);

let checkGeolocation = async next => {
  let userLocPermission = localStorage.getItem("userGeolocationPermission");
  if (
    !userLocPermission &&
    !store.getters["geolocationModule/lastUserLocation"]
  ) {
    next({ name: "Geolocator" });
  }
  next();
};

let checkMobile = async (next, to) => {
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    if (to.name === "Web") {
      return next({ name: "Explore" });
    } /* else {
      next();
    } */
  } else {
    if (to.name !== "Web") {
      return next({ name: "Web" });
    }
  }
  if (to.name === "Root") {
    return next({ name: "Explore" });
  }
  next();
};

const routes = [
  /* {
    path: "/",
    redirect: { name: "Explore" }
  }, */
  {
    path: "explore",
    name: "Explore",
    component: load("Explore"),
    beforeEnter: (to, from, next) => {
      checkGeolocation(next);
    },
    children: [
      {
        path: "restaurant/:id",
        name: "FoodServiceExplore"
      }
    ]
  },
  {
    path: "geo",
    name: "Geolocator",
    component: load("Geolocator")
  },
  {
    path: "search",
    name: "Search",
    component: load("Search")
  },
  {
    path: "restaurants",
    name: "Results",
    component: load("Results"),
    children: [
      {
        path: "result/:id",
        name: "FoodServiceResult"
      },
      {
        path: "filters",
        name: "ResultsFilters"
      }
    ]
  },
  {
    path: "restaurant/:id/menutable/:menuid?",
    name: "FoodServiceMenuTable",
    component: load("FoodServiceMenuTable")
  },
  {
    path: "web",
    name: "Web",
    component: load("Web")
  }
  /* {
    path: "/restaurant",
    name: "FoodService",
    component: FoodService
  } */

  /* {
    path: '/',
    name: 'Home',
    component: Home
  }, */
];

function load(component) {
  return () => import(`@/views/${component}.vue`);
}

// import { SUPPORTED_LOCALES } from "@/locales/langs";

// Creates regex (en|fr)
/* function getLocaleRegex() {
  let reg = "";
  SUPPORTED_LOCALES.forEach((locale, index) => {
    reg = `${reg}${locale.code}${
      index !== SUPPORTED_LOCALES.length - 1 ? "|" : ""
    }`;
  });
  console.log(reg);
  return `(${reg})`;
} */

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    /* {
      path: "/",
      redirect: { name: "Explore" }
    }, */
    /* {
      // <---------------
      path: "/",
      redirect() {
        return process.env.VUE_APP_I18N_LOCALE;
      }
    }, */
    /* {
      path: "/",
      redirect: { name: "Root" }
    }, */
    {
      // <---------------
      path: "*",
      redirect: { name: "Root" }
    },
    {
      path: `/`,
      name: "Root",
      component: {
        template: "<router-view></router-view>"
      },
      beforeEnter: (to, from, next) => {
        checkMobile(next, to);
        // console.log("beforeEnter");
        /* var locale = to.params.locale;
        console.log(to.name + " loc: " + locale);
        if (!locale) {
          console.log(
            to.name + " - " + process.env.VUE_APP_I18N_FALLBACK_LOCALE
          );
          next();          
          // console.log("no lang");
          // next({ path: "/" + process.env.VUE_APP_I18N_FALLBACK_LOCALE + to.path });
          // next({ path: redirectTo });
          // return next(process.env.VUE_APP_I18N_FALLBACK_LOCALE);
        } else {
          console.log("next");
          checkMobile(next, to);
        } */
      },
      /* beforeEnter: (to, from, next) => {
        // <------------
        const locale = to.params.locale; // 1
        const supported_locales = process.env.VUE_APP_I18N_SUPPORTED_LOCALE.split(
          ","
        ); // 2
        // if (!supported_locales.includes(locale)) return next("it"); // 3
        if (!supported_locales.includes(locale)) {
          i18n.locale = process.env.VUE_APP_I18N_FALLBACK_LOCALE;
          // let params = to.params;
          // params.locale = process.env.VUE_APP_I18N_FALLBACK_LOCALE;
          // return next({ name: to.name, query: params, replace: true });
          return next(process.env.VUE_APP_I18N_FALLBACK_LOCALE);
        }
        if (i18n.locale !== locale) {
          // 4
          i18n.locale = locale;
        }
        return next(); // 5
      }, */
      children: routes
    }
  ]
});

import i18n from "@/locales/i18n";
router.beforeEach((to, from, next) => {
  console.log(to.name);
  let locale = localStorage.getItem("locale");
  if (locale) {
    i18n.locale = locale;
  }
  next();
});
/* router.beforeEach((to, from, next) => {
  console.log(to.name);
  const { locale } = to.params;
  if (!locale) {
    console.log("no lang");
    // next({ path: "/" + process.env.VUE_APP_I18N_FALLBACK_LOCALE + to.path });
    // next({ path: redirectTo });
    // return next(process.env.VUE_APP_I18N_FALLBACK_LOCALE);
  } else {
    checkMobile(next, to);
  }
  
}); */

export default router;
