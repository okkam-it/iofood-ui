<template>
  <div class="content">
    <div class="logo">
      <img :src="logo" />
    </div>
    <p class="title">
      Scannerizza questo qrcode con il tuo smartphone
      <br />per usare myfood!
    </p>
    <div class="images-box">
      <div class="qr-code">
        <img :src="qrcode" v-if="qrcode" />
      </div>
      <div class="arrow">
        <b-icon-arrow-right scale="6" />
      </div>
      <div class="demo">
        <img :src="demo" />
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/helpers/api";
export default {
  name: "Web",
  components: {},
  data() {
    return {
      qrcode: null,
      logo: require("@/assets/myfood-logo-large-dark.png"),
      demo: require("@/assets/demo.png"),
    };
  },
  mounted() {
    this.generateQrCode();
  },
  methods: {
    generateQrCode() {
      var nextUrl = this.$route.query.nextUrl;
      if (!nextUrl) {
        nextUrl = window.location.origin;
      } else {
        nextUrl = window.location.origin + nextUrl;
      }

      this.axios
        .get(api.GET_QRCODE, { params: { url: nextUrl } })
        .then((response) => {
          this.qrcode = "data:image/png;base64," + response.data.imageBytes;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>


<style scoped>
.content {
  text-align: center;
}

.logo {
  position: fixed;
  top: 3vh;
  left: 3vw;
}

.logo img {
  height: 5vh;
  min-height: 50px;
}

.images-box {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: 5vh;
  margin-bottom: 5vh;
}

.arrow {
  margin: 0 4vw;
  color: var(--primary-color);
}

.qr-code {
  text-align: center;
}

.qr-code > * {
  margin: 0 5vw;
}

.qr-code img {
  /* margin: 0 auto */
  /* width: 30vh; */
  height: 30vh;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19);
  border-radius: 15px;
  padding: 8px;
}

.demo {
  text-align: center;
}

.demo > * {
  margin: 0 5vw;
}

.demo img {
  /* margin: 0 auto */
  height: 55vh;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19);
  border-radius: 15px;
  border: 8px solid #4d4d4d;
  object-fit: fill;
}

p.title {
  font-size: 32px;
  font-weight: bold;
  margin-top: 10vh;
}
</style>