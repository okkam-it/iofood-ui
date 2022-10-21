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
          <!-- <input
            ref="searchinput"
            :value="searchString"
            @input="e => searchString = e.target.value"
            type="text"
            placeholder="Piatti, ingredienti, ristoranti.."
          />-->
          <input
            ref="searchinput"
            :value="searchString"
            @input="search"
            type="text"
            placeholder="Pesce, milanese, nome ristorante"
            v-on:keyup.enter="showResult(searchString.trim())"
          />
        </div>
      </div>
      <div class="content">
        <template v-if="searchString.length > 1">
          <ul class="results-box">
            <li v-for="(res, k) in results" :key="k" @click="showResult(res)">
              <b-img v-if="res.id" :src="require('@/assets/food_icons/restaurant.png')" />
              {{res.name}}
            </li>
            <li @click="showResult(searchString.trim())">
              <b-icon-search />Cerca risultati per
              <strong>"{{searchString.trim()}}"</strong>
            </li>
          </ul>
        </template>
        <template v-else>
          <p class="section-title">Suggerimenti</p>
          <div class="tips-content">
            <div v-for="tip in tips" :key="tip.name">
              <div @click="showResult(tip)">
                <b-icon-search />
                {{tip.name}}
              </div>
            </div>
          </div>
        </template>
      </div>
      <!-- <div class="footer" @click="goToResults()">Cerca</div> -->
    </template>
    <!-- <location-picker ref="locationpicker" @locationChanged="getUserLocation()" /> -->
  </div>
</template>

<script>
// import LocationPicker from "@/components/LocationPicker";
export default {
  name: "Explore",
  components: {
    // LocationPicker
  },
  data() {
    return {
      userLocation: null,
      searchString: "",
      /* contexts: [
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
      ], */
      selectedContext: [],
      selectedWhats: [],
      results: [],
      tips: [
        { name: "Pesce" },
        { name: "Pizza" },
        // { name: "Braciola" },
        { name: "Braciola di maiale" },
        { name: "Fiorentina" },
        { name: "Tagliata" },
        // { name: "Bistecca" }
      ],
      items: [
        { name: "Braciola" },
        { name: "Braciola di maiale" },
        { name: "Pesce" },
        { name: "Pizza" },
        { name: "Fiorentina" },
        { name: "Tagliata" },
        { name: "Bistecca" },
        { name: "Ristorante La Braciera", id: 12 },
        { name: "Ristorante Pizzeria Alla Torre", id: 3 },
        { name: "Altamarea Enoteca Bistrot", id: 4 },
        { name: "Bar Ristorantino Tecla alle Gru", id: 5 },
        { name: "Chiosco Skipper", id: 6 },
        { name: "Ošterija Na Planinci", id: 10 }
      ]
    };
  },
  methods: {
    showResult(res) {
      if (res.id) {
        this.$router.replace({
          name: "FoodServiceResult",
          params: { id: res.id }
        });
      } else {
        var query = {};

        // if (this.selectedWhats.length) {
        query["what"] = [res.name || res];
        // }

        this.$router.replace({
          name: "Results",
          query
        });
        /* if (!this.selectedWhats.includes(res.name)) {
          this.selectedWhats.push(res.name);
        } */
        this.searchString = "";
      }
    },
    removeWhat(what) {
      var index = this.selectedWhats.findIndex(x => x === what);
      if (index > -1) {
        this.selectedWhats.splice(index, 1);
      }
    },
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
    search(e) {
      this.searchString = e.target.value;
      if (this.searchString.length <= 2) {
        this.results = [];
      } else {
        this.results = this.items.filter(val =>
          val.name.toLowerCase().includes(this.searchString.toLowerCase())
        );
      }
    },
    goToResults() {
      // this.$router.push({ name: "Results" });

      // let query = {};
      var query = {};

      if (this.selectedContext.length) {
        query["context"] = this.selectedContext;
      }

      if (this.selectedWhats.length) {
        query["what"] = this.selectedWhats;
      }

      this.$router.replace({
        name: "Results",
        query
      });
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
  margin-bottom: 0;
  margin-left: 10px;
  margin-top: 5px;
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

ul.results-box {
  list-style-type: none;
  padding-left: 0;
}

.results-box li {
  font-size: 16px;
  border-bottom: 1px solid #e6e6e6;
  padding: 12px 10px;
}

.results-box li img {
  width: 20px;
  margin-right: 10px;
}

.results-box .b-icon {
  margin-right: 10px;
  color: #ccc;
}

div.what-box {
  display: block;
  border: none;
  padding: 0 0;
  margin-top: 5px;
  margin-bottom: 15px;
  display: flex;
  -ms-overflow-style: none; /* for Internet Explorer, Edge */
  scrollbar-width: none; /* for Firefox */
}

.filters-box::-webkit-scrollbar {
  display: none;
}

div.what-box > div {
  /* color: var(--primary-color); */
  color: #fff;
  display: inline-block;
  background-color: var(--primary-color);
  border: 1px solid var(--primary-color);
  font-weight: bold;
  border-radius: 15px;
  font-size: 14px;
  padding: 5px 10px;
  margin-right: 5px;
  margin-bottom: 3px;
  flex-shrink: 0;
}

.tips-content {
  padding: 2vh 5vw;
  font-size: 16px;
}

.tips-content > div {
  padding: 15px 5vw;
  border-bottom: 1px solid #e6e6e6;
}

.tips-content > div .b-icon {
  margin-right: 10px;
  color: #ccc;
}
</style>
