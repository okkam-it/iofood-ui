<template>
  <div class="location-picker" v-if="showPicker">
    <div class="header">
      <div class="back-button" @click="hide()">
        <b-icon-chevron-left scale="1.3" shift-h="-5" />
      </div>
      <div class="search-input-box">
        <b-icon-search scale=".8" />
        <input
          ref="searchinput"
          :value="searchString"
          @input="search"
          type="text"
          placeholder="Dove vuoi cercare?"
        />
      </div>
      <hr />
      <div class="content">
        <template v-if="searchString.length">
          <div
            class="item"
            v-for="(pred, k) in predictions"
            :key="'pred-' + k"
            @click="findCoordinates(pred)"
          >
            <b-icon-geo-alt class="mr-2" />
            {{ pred.description }}
          </div>
        </template>
        <template v-else>
          <div class="item" @click="setCurrentLocation()">
            <b-icon-cursor-fill class="mr-3 cursor-icon" scale="1.3" />
            <strong>Cerca nelle vicinanze</strong>
          </div>
          <template v-if="lastCities.length">
            <p class="section-title mt-4">Destinazioni recenti</p>
            <div
              class="item"
              v-for="city in lastCities"
              :key="city.name"
              @click="setLocation(city)"
            >
              <b-icon-geo-alt class="mr-2" />
              {{ city.name }}
            </div>
          </template>
          <template v-else>
            <p class="section-title mt-4">Destinazioni</p>
            <div
              class="item"
              v-for="city in defaultCities"
              :key="city.name"
              @click="setLocation(city)"
            >
              <b-icon-geo-alt class="mr-2" />
              {{ city.name }}
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/helpers/api";
import _ from "lodash";
export default {
  name: "LocationPicker",
  components: {},
  data() {
    return {
      showPicker: false,
      searchString: "",
      lastCities: [],
      defaultCities: [
        { name: "Jesolo", latitude: 45.536591, longitude: 12.63933 },
        { name: "Portogruaro", latitude: 45.775002, longitude: 12.83789 },
      ],
      predictions: [],
    };
  },
  watch: {
    searchString() {
      this.autocompleteLocation();
    },
  },
  methods: {
    isOpen() {
      return this.showPicker;
    },

    search: _.debounce(function (e) {
      this.searchString = e.target.value;
    }, 500),
    autocompleteLocation() {
      var searchString = this.searchString;
      this.axios
        .get(api.GET_AUTOCOMPLETE_PLACE, {
          params: {
            input: searchString,
            type: "geocode",
          },
        })
        .then((response) => {
          this.predictions = response.data.predictions;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    findCoordinates(locData) {
      this.axios
        .get(api.GET_PLACE_COORDS, {
          params: {
            placeId: locData.place_id,
          },
        })
        .then((response) => {
          if (response.data) {
            var location = {
              latitude: response.data.lat,
              longitude: response.data.lng,
              name:
                locData.terms && locData.terms.length
                  ? locData.terms[0].value
                  : locData.structured_formatting.main_text,
            };

            this.$store.dispatch("geolocationModule/setUserLocation", location);
            this.$emit("locationChanged");
            this.searchString = "";
            this.hide();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    setLocation(city) {
      var location = {
        latitude: city.latitude,
        longitude: city.longitude,
        name: city.name,
      };

      this.$store.dispatch("geolocationModule/setUserLocation", location);
      this.$emit("locationChanged");
      this.searchString = "";
      this.hide();
    },
    async setCurrentLocation() {
      try {
        await this.getGeolocation();
        this.$emit("locationChanged");
        this.hide();
      } catch (e) {
        alert(e);
      }
    },
    show() {
      this.showPicker = true;
      setTimeout(() => {
        this.$refs.searchinput.focus();
      }, 100);
    },
    hide() {
      this.showPicker = false;
    },
  },
};
</script>

<style scoped>
.location-picker {
  position: fixed;
  height: 100%;
  width: 100%;
  z-index: 1000000;
  top: 0;
  background-color: #fff;
}

.header {
  padding: 10px 10px;
  font-size: 15px;
}

.header p {
  margin-bottom: 10px;
  padding-left: 5px;
  font-weight: bold;
}

.back-button {
  display: inline-block;
  width: 40px;
  text-align: center;
}

.content {
  padding: 10px 10px;
}

.search-input-box {
  width: calc(100% - 40px);
  border: none;
  position: relative;
  display: inline-block;
}

.search-input-box > input {
  padding: 15px 10px;
  padding-left: 50px;
}

.search-input-box > .b-icon {
  position: absolute;
  top: 13px;
  left: 15px;
  width: 24px;
  height: 24px;
  color: #808080;
}

.section-title {
  font-size: 15px;
  color: #808080;
  margin-bottom: 4px;
}

.item {
  padding: 10px 10px;
  font-weight: bold;
}

.item > .b-icon {
  margin-right: 15px;
}

.cursor-icon {
  color: var(--primary-color);
}
</style>
