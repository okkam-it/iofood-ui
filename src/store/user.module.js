const MALE = 0;
const FEMALE = 1;

const state = {
  gender: MALE,
  dishes4youonly: false
};

// import { geolocationMixin } from "@/mixins/GeolocationMixin.js";

export const userModule = {
  namespaced: true,
  state: state,
  mutations: {
    gender(state, payload) {
      state.gender = payload;
    },
    dishes4youonly(state, payload) {
      state.dishes4youonly = payload;
    }
  },
  actions: {
    setGenderMale: context => {
      context.commit("gender", MALE);
    },
    setGenderFemale: context => {
      context.commit("gender", FEMALE);
    },
    toggleDishes4youonly: context => {
      context.commit("dishes4youonly", !context.state.dishes4youonly);
      console.log(context.state.dishes4youonly);
    },
    
  },
  getters: {
    gender: state => {
      return state.gender;
    },
    dishes4youonly: state => {
      return state.dishes4youonly;
    }
  }
};
