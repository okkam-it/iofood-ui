<template>
  <div class="mobile-modal" @click="hide()">
    <div @click.stop>
      <p class="title">
        <slot name="title"></slot>
        <span class="close-button" v-if="showclosebuttontop" @click="hide()"
          ><b-icon-x scale="2.2"></b-icon-x
        ></span>
      </p>
      <div class="contentmodal">
        <slot name="content"></slot>
      </div>
      <div v-if="showclosebutton" class="close-button-box" @click="hide()">
        <button class="transparent">
          <strong>Chiudi</strong>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MobileModal",
  components: {},
  data() {
    return {};
  },
  props: {
    showclosebutton: {
      type: Boolean,
    },
    showclosebuttontop: {
      type: Boolean,
    },
  },
  watch: {
    $route(to) {
      if (!to.hash || to.hash !== "#mobilemodal") {
        this.hide();
      }
      // console.log(to.hash);
      // console.log(this.$route.hash);
      // if (to.)
      // this.hide();
    },
  },
  methods: {
    hide() {
      /* var uri = window.location.toString();

      if (uri.indexOf("#") > 0) {
        var clean_uri = uri.substring(0, uri.indexOf("#"));

        window.history.replaceState({}, document.title, clean_uri);
      } */
      this.$emit("hide");
      this.$nextTick(() => {
        if (this.$route.hash && this.$route.hash === "#mobilemodal") {
          this.$router.back();
          /* this.$router.replace({
            name: this.$route.name,
            params: this.$route.params
          }); */
        }
      });
    },
  },
  mounted() {
    if (!this.$route.path.includes("#mobilemodal")) {
      this.$router.push({
        path: this.$route.path + "#mobilemodal",
      });
    }

    // location.hash = "mobilemodal";
    // location.hash = "mobilemodal";
  },
};
</script>
<style scoped>
.mobile-modal {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  height: 100%;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 10000000;
}

.mobile-modal > div {
  position: absolute;
  bottom: 0;
  width: 100%;
  min-height: 30vh;
  background-color: #fff;
  padding: 15px 15px;
}

.title {
  font-weight: bold;
  font-size: 16px;
}

.title .close-button {
  float: right;
  margin-right: 5px;
}

.badge-selector-box {
  text-align: center;
}

.badge-selector-box > span {
  border: 1px solid #ccc;
  border-radius: 15px;
  padding: 5px 15px;
  margin: 5px;
  display: inline-block;
}

.badge-selector-box > span.selected {
  border-color: var(--primary-color);
  background-color: var(--light-primary-color);
  color: var(--primary-color);
}

.contentmodal {
  padding-top: 5px;
  max-height: 75vh;
  overflow: scroll;
  min-height: 10vh;
}

.close-button-box {
  text-align: right;
  /* margin-top: 20px; */
  border-top: 1px solid #ccc;
  font-size: 16px;
  font-weight: bold;
}
</style>
