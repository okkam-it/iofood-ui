<template>
  <div class="home">
    <div class="centered-content">
      <div class="info-box">
        <img :src="require('@/assets/icons/marker.png')" />
        <p>
          <strong>Abilita la geolocalizzazione</strong>
        </p>
        <p>Ci servirà per mostrati i migliori locali vicino a te!</p>
      </div>
      <button class="primary w100" @click="getLocation()">Condividi posizione</button>
      <button class="transparent w100" @click="showLocationPicker()">Non ora</button>
    </div>
    <location-picker ref="locationpicker" @locationChanged="goToExplore()" />
  </div>
</template>

<script>
import LocationPicker from "@/components/LocationPicker";
export default {
  name: "Geolocator",
  components: {
    LocationPicker
  },
  data() {
    return {
      gettingLocation: false
    };
  },
  methods: {
    goToExplore() {
      this.$router.replace({ name: "Explore" });
    },
    showLocationPicker() {
      this.$refs.locationpicker.show();
    },
    async getLocation() {
      this.gettingLocation = true;
      var ctx = this;
      try {
        ctx.gettingLocation = false;
        await ctx.getGeolocation();
        ctx.goToExplore();
        // this.location = await this.getLocation();
      } catch (e) {
        ctx.gettingLocation = false;
        ctx.errorStr = e.message;
      }
      // let pos = await this.getGeolocation();
      /* if (pos) {
        this.goToExplore();
      } */
    }
  }
};
</script>

<style scoped>
button {
  border-radius: 30px;
}

button.transparent {
  font-weight: bold;
}

.info-box {
  text-align: center;
  margin-bottom: 10vh;
}

.info-box p strong {
  font-size: 22px;
  color: initial;
}

.info-box p {
  font-size: 18px;
  color: #808080;
}

.info-box img {
  height: 10vh;
  margin-bottom: 3vh;
}

.centered-content {
  padding: 0 8vw;
}
</style>
