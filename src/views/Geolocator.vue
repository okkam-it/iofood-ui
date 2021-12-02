<template>
  <div class="home">
    <div class="centered-content">
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
</style>
