<template>
  <div class="content">
    <div class="logo">
      <img :src="logo" />
    </div>
    <div class="pat-box">
      <p>Progetto realizzato grazie al finanziamento di</p>
      <img :src="pat_logo" />
    </div>
  </div>
</template>

<script>
export default {
  name: "LandingPage",
  components: {},
  data() {
    return {
      logo: require("@/assets/myfood-logo-large-dark.png"),
      pat_logo: require("@/assets/pat.png"),
    };
  },
  methods: {},
};
</script>

<style scoped>
.content {
  text-align: center;
  z-index: 1001;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #fff;
}

.content > div.logo {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -40%);
  padding: 15% 0;
}

.content > div.logo img {
  width: 100%;
  object-fit: contain;
}

.pat-box {
  font-size: 14px;
  position: absolute;
  bottom: 10%;
  left: 0;
  width: 100%;
}

.pat-box img {
  height: 80px;
}
</style>
