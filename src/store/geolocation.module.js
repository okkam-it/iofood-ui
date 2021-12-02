const state = {
  lastUserLocation: null
};

// import { geolocationMixin } from "@/mixins/GeolocationMixin.js";

export const geolocationModule = {
  namespaced: true,
  state: state,
  mutations: {
    UserLocation(state, payload) {
      state.lastUserLocation = payload;
    }
  },
  actions: {
    setUserLocation: (context, loc) => {
      context.commit("UserLocation", loc);
    }
  },
  getters: {
    lastUserLocation: state => {
      /* if (!state.lastUserLocation) {
        await geolocationMixin.getGeolocation();
      } */
      return state.lastUserLocation;
    }
  }
};
