<template>
  <div>
    <!-- Explore
    <p>{{userLocation}}</p>-->

    <template v-if="userLocation">
      <div class="header">
        <div class="back-button" @click="back()">
          <b-icon-chevron-left scale="1.3" shift-h="-5" />
        </div>
        <div class="search-input-box">
          <b-icon-search scale=".8" />
          <input
            ref="searchinput"
            :value="searchString"
            @input="e => searchString = e.target.value"
            type="text"
            placeholder="Piatti, ingredienti, ristoranti.."
          />
        </div>
        <!-- <p @click="showLocationPicker()">
          <b-icon-geo-alt class="mr-2" />
          {{userLocation.address.village || userLocation.address.city || userLocation.address.town}}
        </p>-->
      </div>
      <div class="content">
        <template v-if="searchString.length > 1">Suggerimenti</template>
        <template v-else>
          <div class="selected-filters-box">
            <div @click="showLocationPicker()">
              <b-icon-geo-alt class="mr-2" />
              {{userLocation.address.village || userLocation.address.city || userLocation.address.town}}
            </div>
          </div>
          <p class="section-title">Occasione</p>
          <div class="contexts-box">
            <div v-for="context in contexts" :key="context">
              <div
                @click="selectContext(context)"
                :class="{active : selectedContext.includes(context)}"
              >{{context}}</div>
            </div>
          </div>
        </template>
      </div>
      <div class="footer" @click="goToResults()">Cerca</div>
    </template>
    <location-picker ref="locationpicker" @locationChanged="getUserLocation()"/>
  </div>
</template>

<script>
import LocationPicker from "@/components/LocationPicker";
export default {
  name: "Explore",
  components: {
    LocationPicker
  },
  data() {
    return {
      userLocation: null,
      searchString: "",
      contexts: [
        "Uscita in coppia",
        "Uscita in gruppo",
        "In pausa pranzo",
        "In vacanza",
        "Incontri d’affari/per lavoro",
        "Eventi aziendali",
        "Occasioni speciali ",
        "Cerimonie",
        "Compleanni",
        "In famiglia",
        "In famiglia con bambini",
        "Per studenti",
        "Partita di calcio"
      ],
      selectedContext: []
    };
  },
  methods: {
    selectContext(context) {
      var index = this.selectedContext.findIndex(x => x === context);
      if (index > -1) {
        this.selectedContext.splice(index, 1);
      } else {
        this.selectedContext.push(context);
      }
      /* if (this.contexts.includes(context)) {
        this.selectedContext
      } else {
        this.selectedContext.push(context);
      } */
    },
    goToResults() {
      this.$router.push({ name: "Results" });
    },
    back() {
      this.$router.go(-1);
    },
    showLocationPicker() {
      this.$refs.locationpicker.show();
    },
    searchClick() {
      console.log("search");
    },
    getUserLocation() {
      this.userLocation = this.$store.getters[
        "geolocationModule/lastUserLocation"
      ];
      // console.log(JSON.stringify(userLocation));
      /* this.userLocation = this.$store.getters[
        "geolocationModule/lastUserLocation"
      ]; */
    }
  },
  mounted() {
    this.getUserLocation();
    /* this.$nextTick(() => {
     
    }); */
    setTimeout(() => {
      this.$refs.searchinput.focus();
    }, 100);
  }
};
</script>

<style scoped>
.header {
  padding: 10px 10px;
  font-size: 15px;
}

.header p {
  margin-bottom: 10px;
  padding-left: 5px;
  font-weight: bold;
}

.header p > .b-icon {
  margin-right: 5px;
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

.back-button {
  display: inline-block;
  width: 40px;
  text-align: center;
}

.footer {
  background-color: var(--primary-color);
  color: #fff;
  font-weight: bold;
  text-align: center;
  padding: 15px 10px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  font-size: 18px;
}

.section-title {
  font-size: 15px;
  color: #808080;
  margin-bottom: 4px;
}

.contexts-box {
  display: flex;
  flex-wrap: wrap;
}

.contexts-box > div {
  /* width: calc(50% - 8px);
  display: inline-block; */

  width: calc(50%);
  text-align: center;
  padding: 2px 2px;
}

.contexts-box > div > div {
  background-color: #f9f9f9;
  width: 100%;
  height: 100%;
  font-size: 14px;
  padding: 15px 0;
  color: #4d4d4d;
  font-weight: bold;
  border: 1px solid #f9f9f9;
}

.contexts-box > div > div.active {
  color: var(--primary-color);
  /* background-color: var(--primary-color);
  color: #fff;
  opacity: 0.7; */
  border-color: var(--primary-color);
  
}

.selected-filters-box {
  margin-bottom: 10px;
}

.selected-filters-box > div {
  display: inline-block;
  color: var(--primary-color);
  background-color: #f2f2f2;
  font-weight: bold;
  border-radius: 15px;
  font-size: 14px;
  padding: 3px 10px;
}
</style>
