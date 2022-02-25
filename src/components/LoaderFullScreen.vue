<template>
  <div class="myfoodloader-container">
    <div v-if="text">
      <div class="boxloader-text" v-if="text">
        <div>
          <img :src="loader_base" />
          <img class="spinner" :src="loader_spinner" :style="speedValue" />
        </div>
        <b-img class="text-img" :src="require('@/assets/myfood-logo-text-dark.png')" />
      </div>
    </div>
    <div class="boxloader" :style="box_size" v-else>
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
    speed: {
      type: Number,
      default: 2
    },
    text: {
      type: Boolean,
      default: false
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
  -webkit-transform: translate(-50%, -48%);
  transform: translate(-50%, -48%);
}

div.boxloader img {
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

.boxloader-text {
  width: max-content;
  height: auto;
  position: absolute;
  margin: auto;
  left: 50%;
  top: 45%;
  -webkit-transform: translate(-50%, -45%);
  transform: translate(-50%, -45%);
}

.boxloader-text > img {
  width: 40vw;
  margin-left: 10px;
}

.boxloader-text > * {
  display: inline-block;
}

.boxloader-text > div {
  position: relative;
  width: 20vw;
}

.boxloader-text > div img {
  position: absolute;
  width: 100%;
  top: -40px;
  left: 0;
}
</style>
