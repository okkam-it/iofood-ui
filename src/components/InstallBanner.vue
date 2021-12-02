<template>
  <div class="install-banner" v-if="deferredPrompt">
    <div>
      <p>Clicca qui per installare subito myfood!</p>
      <button class="transparent" @click="install">Installa app</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "InstallBanner",
  components: {},
  data() {
    return {
      deferredPrompt: null
    };
  },
  created() {
    window.addEventListener("beforeinstallprompt", e => {
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
    }
  }
};
</script>

<style scoped>
.install-banner {
  padding: 10px 10px;
  opacity: 0.7;
  position: relative;
}

.install-banner > div {
  background-color: var(--primary-color);
  color: #fff;
  border-radius: 15px;
  padding: 20px 20px;
  text-align: center;
  border: 2px solid var(--dark-primary-color);
  /* box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19); */
}

button {
  color: #fff;
  font-weight: bold;
  opacity: 1;
  width: 100%;
  border: 1px solid #fff;
  border-radius: 20px;
}
</style>
