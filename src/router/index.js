import Vue from "vue";
import VueRouter from "vue-router";
// import Home from "../views/Home.vue";
import Explore from "../views/Explore.vue";
import Geolocator from "../views/Geolocator.vue";
import Search from "../views/Search.vue";
import Results from "../views/Results.vue";
import Web from "../views/Web.vue";
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
      next({ name: "Explore" });
    } else {
      next();
    }
  } else {
    if (to.name === "Web") {
      next();
    } else {
      next({ name: "Web" });
    }
  }
};

const routes = [
  {
    path: "/",
    redirect: { name: "Explore" }
  },
  {
    path: "/explore",
    name: "Explore",
    component: Explore,
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
    path: "/geo",
    name: "Geolocator",
    component: Geolocator
  },
  {
    path: "/search",
    name: "Search",
    component: Search
  },
  {
    path: "/restaurants",
    name: "Results",
    component: Results,
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
    path: "/web",
    name: "Web",
    component: Web
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

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  checkMobile(next, to);
});

export default router;
