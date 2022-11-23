<template>
  <div>
    <div
      class="install-banner"
      v-if="deferredPrompt && showBanner && routeToShow.includes($route.name)"
    >
      <div>
        <!-- <p>Clicca qui per installare subito myfood!</p> -->

        <span class="close-button" @click="showBanner = false"
          ><b-icon-x scale="2"
        /></span>
        <img :src="logo" />
        <button class="transparent" @click="install">Installa app</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "InstallBanner",
  components: {},
  data() {
    return {
      deferredPrompt: null,
      logo: require("@/assets/myfood-logo-large-dark.png"),
      showBanner: true,
      routeToShow: ["Explore"],
    };
  },
  created() {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e;
    });
    window.addEventListener("appinstalled", () => {
      this.deferredPrompt = null;
    });
  },
  methods: {
    async dismiss() {
      this.deferredPrompt = null;
    },
    async install() {
      this.deferredPrompt.prompt();
    },
  },
};
</script>

<style scoped>
.install-banner {
  position: relative;
  border-bottom: 1px solid rgba(25, 25, 25, 0.1);
  background-color: #f2f2f2;
  z-index: 1000;
}

.install-banner > div {
  padding: 20px 20px;
  text-align: left;
}

.install-banner button {
  color: #fff;
  background-color: var(--primary-color) !important;
  font-weight: bold;
  border: 1px solid var(--primary-color);
  border-radius: 10px;
  padding: 8px 15px;
  float: right;
}

.install-banner img {
  height: 40px;
}

.install-banner .close-button {
  margin-right: 20px;
  color: #ccc;
}
</style>
