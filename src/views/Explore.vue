<template>
  <div>
    <!-- Explore
    <p>{{userLocation}}</p>-->
    <!-- <template v-if="loading">
      <div class="loading-box">
        <div class="loading-header">
          <div>
            <b-skeleton width="40vw" height="4vh"></b-skeleton>
            <b-skeleton width="100%" height="8vh"></b-skeleton>
          </div>
        </div>
        <div class="loading-badges">
          <div v-for="i in 8" :key="i">
            <b-skeleton width="30vw" height="5vh"></b-skeleton>
          </div>
        </div>
        <div class="loading-content">
          <div v-for="i in 3" :key="i">
            <b-skeleton width="50vw" height="5vh"></b-skeleton>
            <b-skeleton width="100%" height="20vh"></b-skeleton>
          </div>
        </div>
      </div>
    </template>
    <template v-else>-->
    <div class="header">
      <template v-if="!loadingHeader">
        <p v-if="userLocation" @click="showLocationPicker()">
          <b-icon-geo-alt-fill scale="1.3" class="geo-icon" />
          {{userLocation.address.village || userLocation.address.city || userLocation.address.town}}
        </p>
        <div class="search-input-box" @click="searchClick()">
          <b-icon-search scale=".8" />
          <input type="text" placeholder="Piatti, ingredienti, ristoranti.." />
        </div>
      </template>
      <div class="loading-header" v-else>
        <div>
          <b-skeleton width="40vw" height="4vh"></b-skeleton>
          <b-skeleton width="100%" height="8vh"></b-skeleton>
        </div>
      </div>
    </div>
    <div class="content" :class="{ disabled : foodServiceIdToShow }">
      <transition-group name="fade">
        <template v-if="!loadingContent">
          <install-banner key="banner-loader" />
          <!-- <div @click="goToResults()">Risultati</div> -->
          <div class="categories-shortcuts-box" key="shortcuts-loaders">
            <div @click="goToResults()">
              <b-img :src="require('@/assets/food_icons/restaurant.png')" />
              {{$t("explore_shortcuts.allfs")}}
            </div>
            <div
              v-for="categoryShortcut in categoriesShortcuts"
              :key="categoryShortcut"
              @click="goToResults(categoryShortcut)"
            >
              <b-img
                :src="require('@/assets/food_icons/' + categoryShortcut.toLowerCase() + '.png')"
              />
              {{$t("explore_shortcuts." + categoryShortcut)}}
            </div>
          </div>
          <template v-for="category in categoriesPreviews">
            <div class="rests-category" :key="category.title">
              <label>
                {{$t("explore_shortcuts." + category.title)}}
                <span
                  class="show-all-button"
                  @click="goToResults(category.title)"
                >
                  Vedi tutti
                  <b-icon-arrow-right />
                </span>
              </label>
              <div>
                <template v-for="foodService in category.foodServices">
                  <div
                    class="rest-card"
                    @click="showFoodServicePage(foodService.id)"
                    :key="foodService.id"
                  >
                    <div>
                      <img :src="getRestImage(foodService)" />
                    </div>
                    <label>{{foodService.name}}</label>
                    <p class="info">
                      <span v-if="foodService.type">{{getTrad(foodService.type.name)}}</span>
                      <b-icon-dot />
                      <span>Pizza, Italiano</span>
                      <br />
                      <span>€€</span>
                      <b-icon-dot />
                      <span>1.5 km</span>
                    </p>
                  </div>
                </template>
                <div class="show-all-card" @click="goToResults(category.title)">
                  <p>
                    <span>
                      Vedi tutti
                      <b-icon-arrow-right />
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </template>
        </template>
        <template v-else>
          <div key="content-loaders">
            <div class="loading-badges">
              <div v-for="i in 8" :key="i">
                <b-skeleton width="30vw" height="5vh"></b-skeleton>
              </div>
            </div>
            <div class="loading-content">
              <div v-for="i in 3" :key="i">
                <b-skeleton width="50vw" height="5vh"></b-skeleton>
                <b-skeleton width="100%" height="20vh"></b-skeleton>
              </div>
            </div>
          </div>
        </template>
      </transition-group>
    </div>
    <!-- </template> -->
    <location-picker ref="locationpicker" @locationChanged="getUserLocation()" />
    <div class="food-service-content" v-if="foodServiceIdToShow">
      <food-service-page @hide="hideFoodServicePage()" v-if="foodServiceIdToShow" />
    </div>
  </div>
</template>

<script>
import LocationPicker from "@/components/LocationPicker";
import InstallBanner from "@/components/InstallBanner";
import FoodServicePage from "@/components/FoodServicePage";
export default {
  name: "Explore",
  components: { LocationPicker, InstallBanner, FoodServicePage },
  data() {
    return {
      userLocation: null,
      // loading: true,
      foodServiceIdToShow: null,
      categoriesShortcuts: ["pizza", "sushi", "poke", "hamburger"],
      categoriesPreviews: [
        { title: "traditional_cuisine", foodServices: [] },
        { title: "happy_hour", foodServices: [] },
        { title: "opennow", foodServices: [] },
        { title: "cheap_fs", foodServices: [] },
        { title: "delivery_takeaway", foodServices: [] }
      ],
      foodServices: [],
      loadingHeader: true,
      loadingContent: true
    };
  },
  watch: {
    $route(to) {
      this.checkRouteState(to);
    }
  },
  methods: {
    loadFoodServices() {
      this.axios
        .get("/rests.json")
        .then(response => {
          this.foodServices = response.data;
          for (var categoryPreview of this.categoriesPreviews) {
            this.$set(
              categoryPreview,
              "foodServices",
              this.foodServices.slice(0, 4)
            );
          }
          this.loadingContent = false;

          // console.log(JSON.stringify(response.data));
        })
        .catch(error => {
          console.log(error);
        });
    },
    getRestImage(foodService) {
      return require("@/assets/pics-demo/" + foodService.coverImage);
    },
    showFoodServicePage(fsId) {
      this.$router.push({ name: "FoodServiceExplore", params: { id: fsId } });
    },
    hideFoodServicePage() {
      this.$router.go(-1);
    },
    goToResults(filter) {
      if (filter) {
        this.$router.push({
          name: "Results",
          query: { what: encodeURIComponent(filter.toLowerCase()) }
        });
      } else {
        this.$router.push({ name: "Results" });
      }
    },
    showLocationPicker() {
      this.$refs.locationpicker.show();
    },
    searchClick() {
      this.$router.push({ name: "Search" });
    },
    async getUserLocation() {
      var loc = this.$store.getters["geolocationModule/lastUserLocation"];
      if (!loc) {
        try {
          loc = await this.getGeolocation();

          // this.location = await this.getLocation();
        } catch (e) {
          alert("Location error");
        }
      }
      console.log(JSON.stringify(loc));
      this.userLocation = loc;
      this.loadingHeader = false;
    },
    checkRouteState(to) {
      // console.log(to.name);
      if (to.name === "FoodServiceExplore" && to.params.id) {
        this.foodServiceIdToShow = to.params.id;
      } else {
        this.foodServiceIdToShow = null;
      }
    }
  },
  mounted() {
    this.getUserLocation();
    this.checkRouteState(this.$route);
    this.loadFoodServices();
  }
};
</script>

<style scoped>
.header {
  padding: 10px 10px;
  padding-top: 2vh;
  font-size: 15px;
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 100;
}

.header p {
  margin-bottom: 10px;
  padding-left: 5px;
  font-weight: bold;
}

.header .geo-icon {
  color: var(--primary-color);
}

.header p > .b-icon {
  margin-right: 5px;
}

.search-input-box {
  width: 100%;
  border: none;
  position: relative;
}

.search-input-box > input {
  padding: 15px 10px;
  padding-left: 50px;
  pointer-events: none;
}

.search-input-box > .b-icon {
  position: absolute;
  top: 13px;
  left: 15px;
  width: 24px;
  height: 24px;
  color: #808080;
}

.categories-shortcuts-box {
  overflow: auto;
  white-space: nowrap;
  padding: 10px 0;
  -ms-overflow-style: none; /* for Internet Explorer, Edge */
  scrollbar-width: none; /* for Firefox */
  margin-top: 0.5vh;
}

.categories-shortcuts-box::-webkit-scrollbar {
  display: none; /* for Chrome, Safari, and Opera */
}

.categories-shortcuts-box > div {
  display: inline-block;
  border-radius: 30px;
  padding: 15px 15px;
  margin: 0 5px;
  font-weight: bold;
  color: #4d4d4d;
  font-size: 16px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19);
}

.categories-shortcuts-box > div:first-child {
  margin-left: 5px;
}

.categories-shortcuts-box > div img {
  height: 20px;
  margin-right: 5px;
  margin-bottom: 3px;
}

.rests-category {
  margin-top: 1vh;
  padding: 1vh 2vw;
  position: relative;
}

.rests-category > label {
  font-size: 20px;
  font-weight: bold;
}

.rests-category > div {
  overflow: auto;
  white-space: nowrap;
  display: flex;
  -ms-overflow-style: none; /* for Internet Explorer, Edge */
  scrollbar-width: none; /* for Firefox */
}

.rests-category > div::-webkit-scrollbar {
  display: none; /* for Chrome, Safari, and Opera */
}

.rests-category .show-all-card {
  width: 55vw;
  height: 21vh;
  padding: 10px 10px;
  display: inline-block;
  border-radius: 5px;
  vertical-align: top;
  text-align: center;
}

.rests-category .show-all-card p {
  margin-top: 9vh;
}

.rests-category .show-all-card p span {
  border-radius: 15px;
  border: 1px solid #ccc;
  padding: 10px 10px;
  font-weight: bold;
}

.rests-category > div .rest-card {
  background-color: #fff;
  width: 55vw;
  /* height: 21vh; */
  padding: 10px 10px;
  display: inline-block;
  border-radius: 5px;
  flex-shrink: 0;
}

.rests-category > div .rest-card > div {
  /* height: 100%; */
  width: 100%;
  border-radius: 15px;
  overflow: hidden;
  /* border-radius: 5px; */
  /* box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19); */
}

.rests-category > div .rest-card label {
  font-weight: bold;
  font-size: 16px;
  margin-top: 5px;
  white-space: break-spaces;
}

.rests-category > div .rest-card p.info {
  margin-bottom: 0;
  word-wrap: break-word;
  width: 100%;
  white-space: normal;
  font-size: 14px;
}

.rests-category > div .rest-card p.info span {
}

.rests-category > div .rest-card > div img {
  width: 100%;
  height: 20vh;
  object-fit: cover;
}

/* .food-service-content {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000000;
  height: 100vh;
  width: 100%;
} */

.show-all-button {
  position: absolute;
  top: 12px;
  right: 15px;
  font-size: 15px;
  color: #808080;
  color: var(--primary-color);
  /* margin-left: 10px; */
  opacity: 0.8;
}

.loading-box {
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}

.loading-header {
  padding: 10px 10px;
}

.loading-badges {
  overflow: hidden;
  display: flex;
  margin: 15px 0;
}

.loading-badges > div {
  margin-left: 10px;
}

.loading-content {
  padding: 10px 10px;
}

.loading-content > div {
  margin-bottom: 4vh;
}

.loading-content > div > div {
  margin-bottom: 2vh;
}

.content.disabled {
  pointer-events: none;
}
</style>