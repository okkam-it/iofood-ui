<template>
  <div class="myfoodloader-container">
    <div class="boxloader" v-if="shadow" :style="box_size">
      <img :src="loader_base_s" />
      <img class="spinner" :src="loader_spinner_s" :style="speedValue" />
    </div>
    <div class="boxloader" v-else :style="box_size">
      <img :src="loader_base" />
      <img class="spinner" :src="loader_spinner" :style="speedValue" />
    </div>
  </div>
</template>

<script>
export default {
  name: "MyFoodLoader",

  components: {},
  methods: {},
  data() {
    return {
      loader_base: require("@/assets/myfood_loader/myfoodloader1.png"),
      loader_spinner: require("@/assets/myfood_loader/myfoodloader0.png"),
      loader_base_s: require("@/assets/myfood_loader/myfoodloader1_s.png"),
      loader_spinner_s: require("@/assets/myfood_loader/myfoodloader0_s.png")
    };
  },
  props: {
    size: {
      type: Number,
      default: 120
    },
    shadow: {
      type: Boolean,
      default: false
    },
    speed: {
      type: Number,
      default: 2
    }
  },
  computed: {
    box_size() {
      if (this.size) {
        return "width: " + this.size + "px;" + "height: " + this.size + "px";
      }
      return "";
    },
    speedValue() {
      return "--speed: " + this.speed + "s;";
    }
  }
};
</script>
<style>
:root {
  --speed: 3s;
}
</style>

<style scoped>
.myfoodloader-container {
  width: 100vw;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
}

.boxloader {
  width: 150px;
  height: 150px;
  position: absolute;
  margin: auto;
  position: absolute;
  /*top: 0;
  left: 0;
  bottom: 0;
  right: 0;*/
  left: 50%;
  top: 48%;
  -webkit-transform: translate(-48%, -50%);
  transform: translate(-48%, -50%);
}

div img {
  position: absolute;
  width: 100%;
}
.spinner {
  animation: rotate var(--speed) infinite;
  animation-timing-function: cubic-bezier(1, 0, 0.5, 1);
}

@-webkit-keyframes rotate {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}
</style>
