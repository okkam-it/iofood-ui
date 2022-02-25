const MALE = 0;
const FEMALE = 1;

const state = {
  gender: MALE
};

// import { geolocationMixin } from "@/mixins/GeolocationMixin.js";

export const userModule = {
  namespaced: true,
  state: state,
  mutations: {
    gender(state, payload) {
      state.gender = payload;
    }
  },
  actions: {
    setGenderMale: context => {
      context.commit("gender", MALE);
    },
    setGenderFemale: context => {
      context.commit("gender", FEMALE);
    }
  },
  getters: {
    gender: state => {
      return state.gender;
    }
  }
};
