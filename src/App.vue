<template>
  <div id="app">
    <install-banner />
    <transition name="fade">
      <landing-page v-if="showLanding" />
      <router-view v-else />
    </transition>
  </div>
</template>

<script>
import LandingPage from "@/views/LandingPage";
import InstallBanner from "@/components/InstallBanner";
export default {
  name: "App",
  components: {
    LandingPage,
    InstallBanner,
  },
  data() {
    return {
      showLanding: true,
    };
  },
  created() {
    this.checkIsPwa();
  },
  methods: {
    checkIsPwa() {
      this.showLanding = true;
      setTimeout(() => {
        this.showLanding = false;
      }, 2500);
    },
  },
};
</script>

<style>
:root {
  --primary-color: #8abf20;
  --light-primary-color: #f5fbe9;
  --dark-primary-color: #4f6d12;
  --warning-color: #ffc107;
  --danger-color: #df4759;
  --info-color: #17a2b8;
  --success-color: #8abf20;
}

@import url("https://fonts.googleapis.com/css?family=Montserrat");
#app {
  font-family: "Montserrat", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  /* padding-top: 2vh; */
}

button {
  background-color: #fff;
  border: none;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19);
  padding: 15px 15px;
  border-radius: 2px;
  cursor: pointer;
  font-size: 15px;
}

button:hover {
  opacity: 0.8;
}

button.primary {
  background-color: var(--primary-color);
  color: #fff !important;
}

button.primary .b-icon {
  color: #fff !important;
}

button.transparent {
  background-color: transparent;
  box-shadow: none;
  opacity: 0.6;
}

.w100 {
  width: 100%;
}

.centered-content {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
}

input {
  border: none;
  background-color: #f2f2f2;
  padding: 10px 10px;
  width: 100%;
  border-radius: 30px;
}

input:focus {
  border: none;
  outline: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

div.separator {
  width: 100%;
  height: 1vh;
  background-color: #f2f2f2;
  position: relative;
}

div.separator > div {
  position: absolute;
  left: -10px;
  right: -10px;
  top: 0;
  height: 1vh;
  background-color: #f2f2f2;
}

.tooltiptarget {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black;
}

.tooltiptarget .tooltiptext {
  visibility: hidden;
  width: auto;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 10px;
  position: absolute;
  z-index: 1;
  bottom: 150%;
  left: 50%;
  margin-left: -60px;
}

.tooltiptarget .tooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: black transparent transparent transparent;
}

.tooltiptarget:hover .tooltiptext {
  visibility: visible;
}
</style>
