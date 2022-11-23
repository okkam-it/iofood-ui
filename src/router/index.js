import Vue from "vue";
import VueRouter from "vue-router";

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
  if (to.query.previewMode && to.query.previewMode === "mobile") {
    return next();
  }

  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    if (to.name === "Web") {
      let nextUrl = to.query.nextUrl;
      if (nextUrl) {
        return next(nextUrl);
      } else {
        return next({ name: "Explore" });
      }
    } /* else {
      next();
    } */
  } else {

    if (to.name !== "Web" && to.name !== "FoodServiceMenuWeb") {
      // return next({ name: "Web" });
      return next({
        name: "Web",
        query: {
          nextUrl: to.fullPath
        }
      });
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
      if (to.name !== "FoodServiceResult") {
        checkGeolocation(next);
      }
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
    path: "restaurant/:id/delivery/:menuid?",
    name: "FoodServiceMenuDelivery",
    component: load("FoodServiceMenuDelivery")
  },
  {
    path: "web",
    name: "Web",
    component: load("Web")
  },
  {
    path: "restaurant/:id/web",
    name: "FoodServiceMenuWeb",
    component: load("FoodServiceMenuWeb")
  }

];

function load(component) {
  return () => import(`@/views/${component}.vue`);
}





const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [

    {

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


      },

      children: routes
    }
  ]
});

import i18n from "@/locales/i18n";
router.beforeEach((to, from, next) => {
  if (from.name == "Explore" && to.name == "Root") {
    router.go(-1);
  }

  let locale = localStorage.getItem("locale");
  if (locale) {
    i18n.locale = locale;
  }
  next();
});


export default router;
