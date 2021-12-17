<template>
  <div>
    <div class="header">
      <div class="back-button" @click="goBack()">
        <b-icon-chevron-left scale="1.3" shift-h="-5" />
      </div>
      <div class="search-input-box" @click="openSearchPage()">
        <b-icon-search scale=".8" />
        <input type="text" placeholder="Piatti, ingredienti, ristoranti.." />
      </div>
      <!-- <p @click="showLocationPicker()">
          <b-icon-geo-alt class="mr-2" />
          {{userLocation.address.village || userLocation.address.city || userLocation.address.town}}
      </p>-->
      <div class="filters-box">
        <div @click="showFiltersBox()">
          <b-icon-sliders scale="1.2" />
          <span class="filters-size" v-if="selectedFiltersSize > 0">{{selectedFiltersSize}}</span>
        </div>
        <div @click="showLocationPicker()" class="location-active" v-if="userLocation">
          <b-icon-geo-alt-fill class="mr-2" />
          {{getUserLocationString()}}
        </div>
        <template v-for="filter in quickFilters">
          <div
            @click="toggleSelectedFilter(filter)"
            :key="filter.label"
            :class="{ active : filter.alternatives ? selectedFilters[filter.code].length : selectedFilters[filter.code]}"
          >
            {{filter.label}}
            <b-icon-caret-down-fill variant="secondary" v-if="filter.alternatives" />
          </div>
        </template>
      </div>
      <div class="what-box" v-if="selectedWhat.length">
        <template v-for="what in selectedWhat">
          <div :key="what" @click="removeWhat(what)">
            <!-- {{$t("explore_shortcuts." + what)}} -->
            {{what}}
            <b-icon-x />
          </div>
        </template>
      </div>

      <!-- <div class="selected-filters-box" v-if="userLocation">
        <div @click="showLocationPicker()">
          <b-icon-geo-alt-fill class="mr-2" />
          {{userLocation.address.village || userLocation.address.city || userLocation.address.town}}
        </div>
      </div>-->
      <div class="slider" v-if="loadingContent">
        <div class="line"></div>
        <div class="subline inc"></div>
        <div class="subline dec"></div>
      </div>
      <div class="new-position-banner" v-if="showNewPositionBanner && hiddenList">Cerca qui</div>
    </div>
    <location-picker ref="locationpicker" @locationChanged="getUserLocation()" />
    <search-what-picker ref="searchwhatpicker" @addWhat="addWhat" />
    <div class="content" v-if="!loading">
      <div class="map-view">
        <l-map
          ref="map"
          v-if="showMap"
          :zoom="zoom"
          :center="center"
          :options="mapOptions"
          @update:center="centerUpdate"
          @update:zoom="zoomUpdate"
          :zoom-control="false"
          @click="mapCLick()"
          @move="mapPositionChange"
        >
          <l-tile-layer :url="url" :attribution="attribution" />
          <template v-for="marker in markers">
            <!-- <l-marker
              :lat-lng="marker.coords"
              :icon="currentPreview && currentPreview == marker.foodServiceId ? markerRedIcon : markerIcon"
              :key="marker.name"
              @click="showRestPreview(marker)"
            >{{marker.name}}</l-marker>-->
            <l-marker :key="marker.name" :lat-lng="marker.coords" @click="showRestPreview(marker)">
              <l-icon :icon-anchor="staticAnchor" class-name="custom-marker">
                <div>
                  <!-- <img
                    :src="currentPreview && currentPreview == marker.foodServiceId ? require('@/assets/icons/marker_red.png') : require('@/assets/icons/marker.png')"
                  />-->
                  <transition name="fade">
                    <img
                      v-if="currentPreview && currentPreview == marker.foodServiceId"
                      :src="require('@/assets/icons/marker_red.png')"
                    />
                    <img v-else :src="require('@/assets/icons/marker.png')" />
                  </transition>
                  <transition name="fade">
                    <p
                      class="label"
                      v-if="currentZoom >= 13 && (!currentPreview || currentPreview !== marker.foodServiceId)"
                    >{{ marker.name }}</p>
                  </transition>
                </div>
              </l-icon>
            </l-marker>
          </template>
        </l-map>
        <div class="map-actions-box">
          <div class="list-link" v-if="hiddenList" @click="showList()">
            <b-icon-list />Mostra lista
          </div>
          <transition name="fade">
            <div
              ref="restspreviewlist"
              class="rests-preview"
              v-if="selectedFoodService && hiddenList"
              @scroll="handleScrollRestsPreview"
            >
              <!-- <div>Uno</div>
              <div>Due</div>
              <div>Tre</div>-->

              <div
                class="rest-card"
                @click="showFoodServicePage(selectedFoodService.id)"
                :data-restid="selectedFoodService.id"
              >
                <div>
                  <img :src="getRestImage(selectedFoodService)" />
                </div>
                <label>{{selectedFoodService.name}}</label>
                <p class="info">
                  <span v-if="selectedFoodService.type">{{getTrad(selectedFoodService.type.name)}}</span>
                  <b-icon-dot />
                  <span>Pizza, Italiano</span>
                  <br />
                  <span>€€</span>
                  <b-icon-dot />
                  <span>1.5 km</span>
                </p>
              </div>
              <template v-for="foodService in foodServices">
                <div
                  class="rest-card"
                  :key="foodService.id"
                  @click="showFoodServicePage(foodService.id)"
                  v-if="foodService.id !== selectedFoodService.id"
                  :data-restid="foodService.id"
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
            </div>
          </transition>
        </div>
      </div>
      <div class="list-view" :class="{ hidden : hiddenList }" ref="listview">
        <div class="map-link" @touchstart="hideList()" @mousedown="hideList()"></div>
        <div class="list">
          <div class="list-handler">
            <div />
          </div>
          <template v-if="loadingContent">
            <div class="loading-content">
              <div v-for="i in 3" :key="i">
                <b-skeleton width="100%" height="20vh"></b-skeleton>
                <b-skeleton width="100%" height="5vh"></b-skeleton>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="rests-list">
              <template v-for="foodService in foodServices">
                <div
                  class="rest-card"
                  :key="foodService.id"
                  @click="showFoodServicePage(foodService.id)"
                >
                  <div>
                    <img :src="getRestImage(foodService)" />
                    <div class="image-slider">
                      <template v-for="i in 5">
                        <div :key="i">
                          <img :src="getRestImage(foodService)" />
                        </div>
                      </template>
                    </div>
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
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="food-service-content" v-if="foodServiceIdToShow">
      <food-service-page @hide="hideFoodServicePage()" v-if="foodServiceIdToShow" />
    </div>
    <div class="filters-content" v-if="showFilters">
      <filters-content
        @hide="hideFilters()"
        @resetFilters="resetSelectedFilters()"
        :selectedFilters="selectedFilters"
        @onChangeSelectedFilters="onChangeSelectedFilters"
      />
    </div>
    <mobile-modal
      v-if="selectedFilter && selectedFilter.alternatives && !selectedFilter.selectedAlternative"
      @hide="selectedFilter = null"
      showclosebutton
    >
      <template #title>{{selectedFilter.label}}</template>
      <template #content>
        <div class="badge-selector-box">
          <!-- <span
            @click="toggleAlternative(alternative)"
            :class="{ selected : selectedFilter && selectedFilter.selectedAlternatives && selectedFilter.selectedAlternatives.includes(alternative) }"
            v-for="alternative in selectedFilter.alternatives"
            :key="alternative"
          >{{alternative}}</span>-->
          <span
            @click="toggleAlternative(alternative)"
            :class="{ selected : selectedFilters[selectedFilter.code] && selectedFilters[selectedFilter.code].find(x => x.id ? (alternative.id ? x.id === alternative.id : x.id === alternative) : (alternative.id ? x === alternative.id : x === alternative))/* && selectedFilters[selectedFilter.code].includes(alternative) */ }"
            v-for="alternative in selectedFilter.alternatives"
            :key="alternative"
          >{{alternative}}</span>
        </div>
      </template>
    </mobile-modal>
  </div>
</template>

<script>
import LocationPicker from "@/components/LocationPicker";
import SearchWhatPicker from "@/components/SearchWhatPicker";
import { latLng, icon } from "leaflet";
import { LMap, LTileLayer, LMarker, /* LTooltip,*/ LIcon } from "vue2-leaflet";
import FoodServicePage from "@/components/FoodServicePage";
import FiltersContent from "@/components/FiltersContent";
import MobileModal from "@/components/mobile-modal/MobileModal";
// import restsData from '../assets/rests.json';
import "leaflet/dist/leaflet.css";
export default {
  name: "Results",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    // LTooltip,
    LIcon,
    LocationPicker,
    FoodServicePage,
    FiltersContent,
    MobileModal,
    SearchWhatPicker
  },
  data() {
    return {
      zoom: 13,
      currentZoom: 13,
      // center: latLng(47.41322, -1.219482),
      center: null,
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      mapOptions: {
        zoomSnap: 0.5,
        zoomControl: false
      },
      showMap: true,
      hiddenList: false,
      userLocation: null,
      loading: true,
      loadingContent: true,
      markers: [],
      markerIcon: icon({
        iconRetinaUrl: require("@/assets/icons/marker.png"),
        iconUrl: require("@/assets/icons/marker.png"),
        iconSize: [31, 40],
        iconAnchor: [15, 35]
        //shadowUrl: require('@/assets/images/tte_logo.png')
      }),
      markerRedIcon: icon({
        iconRetinaUrl: require("@/assets/icons/marker_red.png"),
        iconUrl: require("@/assets/icons/marker_red.png"),
        iconSize: [31, 40],
        // iconAnchor: [23, 47]
        iconAnchor: [15, 35]
        //shadowUrl: require('@/assets/images/tte_logo.png')
      }),
      staticAnchor: [16, 37],
      selectedFoodService: null,
      showNewPositionBanner: false,
      foodServices: [],
      currentPreview: null,
      foodServiceIdToShow: null,
      showFilters: false,
      quickFilters: [
        {
          label: "Aperti ora",
          code: "opennow"
        },
        {
          label: "Prezzo",
          code: "price",
          alternatives: ["€", "€€", "€€€"]
        },
        {
          label: "Asporto",
          code: "takeaway"
        },
        {
          label: "Consegna a domicilio",
          code: "delivery"
        }
      ],
      selectedFilters: this.initSelectedFilters(),
      selectedFilter: null,
      selectedWhat: [],
      hidingFsPage: false
    };
  },
  beforeRouteLeave(to, from, next) {
    if (this.$refs.searchwhatpicker && this.$refs.searchwhatpicker.isOpen()) {
      this.$refs.searchwhatpicker.hide();
      next(false);
    } else if (this.$refs.locationpicker && this.$refs.locationpicker.isOpen()) {
      this.$refs.locationpicker.hide();
      next(false);
    } else {
      next();
    }
  },
  computed: {
    selectedFiltersSize() {
      var size = 0;
      if (this.selectedFilters) {
        Object.values(this.selectedFilters).forEach(value => {
          // console.log(value);
          if (Array.isArray(value)) {
            // variable is a boolean
            size += value.length;
          } else {
            if (typeof value == "boolean") {
              if (value) {
                size++;
              }
            } else {
              size++;
            }
          }
          /* if (typeof value == "boolean") {
            // variable is a boolean
            if (value) {
              size++;
            }
          } else {
            size += value.length;
          } */
        });
      }
      // console.log(size);
      return size - 2;
    }
  },
  mounted() {
    /* var whatFilter = this.$route.query.what;
    if (whatFilter && whatFilter !== "allfs") {
      if (this.checkNotFilter(whatFilter)) {
        this.selectedFilters[whatFilter] = true;
      } else {
        this.selectedWhat.push(whatFilter);
      }
    } */

    var filters = this.$route.query;
    if (filters) {
      for (let filter in filters) {
        if (filter === "what") {
          // this.selectedWhat.push(filters[filter]);
          var what = filters[filter];
          if (Array.isArray(what)) {
            this.selectedWhat = what;
          } else {
            this.selectedWhat = [what];
          }
        } else if (filter in this.selectedFilters) {
          if (Array.isArray(this.selectedFilters[filter])) {
            for (let val of filters[filter]) {
              if (this.isNumeric(val)) {
                this.selectedFilters[filter].push(parseInt(val));
              } else {
                this.selectedFilters[filter].push(val);
              }
            }
            // this.selectedFilters[filter] = filters[filter];
            // this.selectedFilters[filter] = filters[filter].split(",");
            // console.log("is array")
            // console.log(filters[filter]);
            /* for (let val of filters[filter]) {
              this.selectedFilters[filter].push(val);
              console.log(val);
            } */
            // this.selectedFilters[filter].push(filters[filter]);
          } else {
            var val = filters[filter];
            if (this.isNumeric(val)) {
              this.selectedFilters[filter] = parseInt(val);
            } else {
              this.selectedFilters[filter] = val;
            }
          }
        }
      }
    }
    // console.log(filters);

    this.getUserLocation();
    // this.$refs.myMap.mapObject.invalidateSize();
    setTimeout(() => {
      this.$refs.listview.scrollTop = window.innerHeight / 2.5;
    }, 200);

    this.loadFoodServices();

    this.checkRouteState(this.$route);
    // this.buildMarkers();
  },
  methods: {
    isNumeric(val) {
      return /^-?\d+$/.test(val);
    },
    checkNotFilter(whatFilter) {
      if (whatFilter in this.selectedFilters) {
        return true;
      }
      return false;
    },
    /* updateMarkerLabels() {
      for (var marker of this.markers) {
        this.checkLabelVisibility(marker);
      }
    },
    checkLabelVisibility(currentMarker) {
      var show = true;
      var zoom = this.$refs.map.mapObject.getZoom();
      // var targetV = 2 + (zoom / 100);

      for (var marker of this.markers) {
        if (marker.foodServiceId !== currentMarker.foodServiceId) {
          var value = this.calcCrow(
            marker.coords.lat,
            marker.coords.lng,
            currentMarker.coords.lat,
            currentMarker.coords.lng
          );
           var targetV = value * (zoom / 100);
          console.log(targetV);

          if (targetV < 0.09) {
            return false;
          }
        }
      }
      return show;
      // return true;
    }, */
    getUserLocationString() {
      if (!this.userLocation) {
        return "";
      }
      var stringLoc =
        this.userLocation.address.village ||
        this.userLocation.address.city ||
        this.userLocation.address.town;

      return this.truncate(stringLoc, 8);
    },
    truncate(str, n) {
      return str.length > n ? str.substr(0, n - 1) + ".." : str;
    },
    openSearchPage() {
      this.$refs.searchwhatpicker.show();
    },
    addWhat(what) {
      if (!this.selectedWhat.includes(what)) {
        this.selectedWhat.push(what);
      }
    },
    removeWhat(what) {
      var index = this.selectedWhat.findIndex(x => x === what);
      if (index > -1) {
        this.selectedWhat.splice(index, 1);
      }
      const query = Object.assign({}, this.$route.query);
      delete query.what;
      this.$router.replace({ query });
    },
    resetSelectedFilters() {
      // console.log(this.selectedFilters.opennow);
      this.selectedFilters = this.initSelectedFilters();
      // console.log(this.selectedFilters.opennow);
      // console.log(JSON.stringify(this.selectedFilters));
    },
    initSelectedFilters() {
      return {
        opennow: false,
        orderby: "Distanza",
        delivery: false,
        takeaway: false,
        payments: [],
        distance: 5,
        price: [],
        context: [],
        allergens: [],
        fsType: [],
        services: [],
        mealVouchers: [],
        cuisine: [],
        offerVariety: false,
        situations: [],
        foodRestrictions: [],
        nutritionalFacts: [],
        pois: []
      };
    },
    onChangeSelectedFilters(filters) {
      this.selectedFilters = filters;
      // console.log("change");
    },
    toggleAlternative(alternative) {
      this.toggleArrayItem(
        alternative,
        this.selectedFilters[this.selectedFilter.code]
      );
      /* if (!this.selectedFilter.selectedAlternatives) {
        this.$set(this.selectedFilter, "selectedAlternatives", []);
        this.selectedFilter.selectedAlternatives.push(alternative);
      } else {
        var index = this.selectedFilter.selectedAlternatives.findIndex(
          x => x === alternative
        );
        if (index > -1) {
          this.selectedFilter.selectedAlternatives.splice(index, 1);
        } else {
          this.selectedFilter.selectedAlternatives.push(alternative);
        }
      } */
    },
    showFiltersBox() {
      this.$router.push({ name: "ResultsFilters" });
    },
    handleScrollRestsPreview(e) {
      var scrollPos = e.target.scrollLeft;
      var scrollWidth = e.target.scrollWidth - e.target.clientWidth;
      var steps = scrollWidth / this.foodServices.length;
      // this.scrollPos = scrollWidth;
      var step = parseInt((e.target.offsetWidth + scrollPos) / steps) - 1;
      // console.log(step);
      // this.currentPreview = this.foodServices[step - 1];
      // console.log(this.currentPreview ? this.currentPreview.name : "null");

      // console.log(e.target.offsetWidth);
      // console.log(step);
      var child = e.target.children[step];
      if (child) {
        this.currentPreview = child.dataset.restid;
        /* this.currentPreview = this.foodServices.find(
          x => x.id === child.dataset.restid
        ); */
      }
      // console.log(e.target);
      // console.log(child ? child.dataset.restid : "null");
    },
    getRestImage(foodService) {
      return require("@/assets/pics-demo/" + foodService.coverImage);
    },
    loadFoodServices() {
      this.axios
        .get("/rests.json")
        .then(response => {
          this.foodServices = response.data;
          this.buildMarkers();
          this.loadingContent = false;
          // console.log(JSON.stringify(response.data));
        })
        .catch(error => {
          console.log(error);
        });
    },
    mapPositionChange() {
      let newCenter = this.$refs.map.mapObject.getCenter();
      let oldCenter = this.center;
      if (
        this.calcCrow(
          newCenter.lat,
          newCenter.lng,
          oldCenter.lat,
          oldCenter.lng
        ) > 2
      ) {
        this.showNewPositionBanner = true;
      } else {
        this.showNewPositionBanner = false;
      }
      /* console.log(
        this.calcCrow(
          newCenter.lat,
          newCenter.lng,
          oldCenter.lat,
          oldCenter.lng
        )
      ); */
    },
    calcCrow(nlat1, nlon1, olat2, olon2) {
      var R = 6371; // km
      var dLat = this.toRad(olat2 - nlat1);
      var dLon = this.toRad(olon2 - nlon1);
      var lat1 = this.toRad(nlat1);
      var lat2 = this.toRad(olat2);

      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) *
          Math.sin(dLon / 2) *
          Math.cos(lat1) *
          Math.cos(lat2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      return d;
    },
    toRad(Value) {
      return (Value * Math.PI) / 180;
    },
    mapCLick() {
      // alert("click");
      this.selectedFoodService = null;
      this.currentPreview = null;
    },
    showRestPreview(marker) {
      this.selectedFoodService = this.foodServices.find(
        x => x.id === marker.foodServiceId
      );
      this.currentPreview = marker.foodServiceId;
      setTimeout(() => {
        if (this.$refs.restspreviewlist) {
          this.$refs.restspreviewlist.scrollLeft = 0;
        }
      }, 150);
    },
    buildMarkers() {
      var markers = [];
      for (var foodService of this.foodServices) {
        markers.push({
          name: foodService.name,
          foodServiceId: foodService.id,
          coords: latLng(foodService.coords.lat, foodService.coords.lng)
        });
      }
      this.markers = markers;
    },
    hideList() {
      this.$refs.listview.scrollTop = 0;
      setTimeout(() => {
        this.hiddenList = true;
      }, 500);
    },
    showLocationPicker() {
      this.$refs.locationpicker.show();
    },
    showFoodServicePage(id) {
      // this.$router.push({ name: "FoodService" });
      // this.foodServiceIdToShow = 12;
      this.$router.push({
        name: "FoodServiceResult",
        params: { id }
      });
    },
    hideFoodServicePage() {
      console.log("backk");
      this.hidingFsPage = true;
      this.$router.go(-1);
      // this.foodServiceIdToShow = null;
      // this.$router.go(-1);
      // this.$router.go(-1);
      // this.$router.replace({ name: "Results" });
      /* console.log(this.$route.query);
      this.$router.replace({
        name: "Results",
        params: this.$route.params,
        query: this.$route.query
      }); */

      // this.$router.go(-1);
      /* while (this.$route.name !== "Results") {
        setTimeout(() => {
          this.$router.go(-1);
        }, 100);
      } */
      // this.$router.go(-1);
      /* var historyLen = window.history.length;
      for (let r in historyLen) {
        console.log(r);
        this.$router.go(-1);
        if (this.$route.name === "Results") {
          break;
        }
      } */
      // this.$router.back();
    },
    hideFilters() {
      this.$router.go(-1);
    },
    getUserLocation() {
      this.userLocation = this.$store.getters[
        "geolocationModule/lastUserLocation"
      ];
      this.center = latLng(
        this.userLocation.latitude,
        this.userLocation.longitude
      );
      this.loading = false;
      // console.log(JSON.stringify(userLocation));
      /* this.userLocation = this.$store.getters[
        "geolocationModule/lastUserLocation"
      ]; */
    },
    showList() {
      this.hiddenList = false;
      this.selectedFoodService = null;
      this.currentPreview = null;
      this.$nextTick(() => {
        this.$refs.listview.scrollTop = window.innerHeight / 2.5;
      });
    },
    goBack() {
      this.$router.go(-1);
    },
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
      // this.updateMarkerLabels();
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    checkRouteState(to) {
      // console.log(to.name);
      if (to.name === "FoodServiceResult" && to.params.id) {
        this.foodServiceIdToShow = to.params.id;
      } else if (to.name === "ResultsFilters") {
        this.showFilters = true;
      } else {
        this.foodServiceIdToShow = null;
        this.showFilters = false;
      }
    },
    toggleSelectedFilter(filter) {
      this.selectedFilter = filter;
      if (this.selectedFilter && !this.selectedFilter.alternatives) {
        this.selectedFilters[this.selectedFilter.code] = !this.selectedFilters[
          this.selectedFilter.code
        ];
      }
    },
    toggleArrayItem(data, array) {
      var index = array.findIndex(x => (x.id ? x.id === data.id : x === data));
      if (index > -1) {
        array.splice(index, 1);
      } else {
        array.push(data);
      }
    },
    updateQueryParams() {
      // const query = Object.assign({}, this.$route.query);
      var query = {};
      // let filters = [];
      for (let qp in this.selectedFilters) {
        var filter = this.selectedFilters[qp];
        if ((Array.isArray(filter) && filter.length) || filter) {
          query[qp] = filter;
          // filters.push({qp: filter });
          /* if (typeof filter == "boolean") {
            filters.push(qp);
          } else if (Array.isArray(filter) && filter.length) {
            filters.push(qp);
          } */
        } else {
          if (query[qp]) {
            delete query[qp];
          }
        }
      }

      query["what"] = this.selectedWhat;

      // query.filters = filters.join(",");

      // this.addParamsToLocation(query);
      this.$router.replace({ query });

      /* const query = Object.assign({}, this.$route.query);
      delete query.what;
      this.$router.replace({ query }); */
    }
    /* addParamsToLocation(params) {
      history.pushState(
        {},
        null,
        this.$route.path +
          "?" +
          Object.keys(params)
            .map(key => {
              return (
                encodeURIComponent(key) + "=" + encodeURIComponent(params[key])
              );
            })
            .join("&")
      );
    } */
  },
  watch: {
    $route(to) {
      this.checkRouteState(to);

      if (this.hidingFsPage) {
        if (to.name !== "Results") {
          this.$router.back();
        } else {
          this.hidingFsPage = false;
        }
      }
    },
    selectedWhat() {
      this.updateQueryParams();
    },
    selectedFilters: {
      handler: function() {
        this.foodServices = [];
        this.markers = [];
        this.selectedFilter = null;
        this.currentPreview = null;
        this.loadingContent = true;
        if (this.$route.hash && this.$route.hash === "#mobilemodal") {
          this.$router.go(-1);
        }
        setTimeout(() => {
          this.$nextTick(() => {
            this.updateQueryParams();
            this.loadFoodServices();
          });
        }, 100);
      },
      deep: true
    }
  }
  /* selectedWhat: {
    handler: function() {
      this.loadFoodServices();
    },
    deep: true
  } */
  /* beforeRouteEnter(to, from, next) {
    console.log("we");
    if (to.name === "FoodServiceResult") {
      this.foodServiceIdToShow = to.params.id;
    }
    console.log("we");
    next();
  } */
};
</script>

<style scoped>
.header {
  padding: 10px 10px;
  padding-bottom: 7px;
  font-size: 15px;
  position: fixed;
  top: 0;
  z-index: 10001;
  background-color: #fff;
  width: 100%;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19);
}

.header p {
  margin-bottom: 10px;
  padding-left: 5px;
  font-weight: bold;
}

.header p > .b-icon {
  margin-right: 5px;
}

.search-input-box {
  width: calc(100% - 40px);
  border: none;
  position: relative;
  display: inline-block;
}

.search-input-box input {
  pointer-events: none;
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

.map-view {
  height: calc(100vh - 73px);
  width: 100vw;
  /* margin-top: 73px; */
  margin-top: 73px;
  position: relative;
}

/* .map-view > div {
  height: 100vh;
  overflow: auto;
} */

.list-view {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 1000;
  overflow: scroll;
  scroll-behavior: smooth;
}

.list-view.hidden {
  display: none;
}

.list-view .list-handler {
  text-align: center;
  padding-top: 8px;
}

.list-view .list-handler > div {
  width: 40px;
  height: 6px;
  background-color: #ccc;
  border-radius: 15px;
  margin: 0 auto;
}

.list-view > div.list {
  min-height: 500px;
  background-color: #fff;
}

.list-view > div.map-link {
  /* height: 40vh; */
  height: 80vh;
}

.map-view .map-actions-box {
  z-index: 10000;
  position: fixed;
  bottom: 0;
  width: 100%;
  left: 0;
}

.map-view .list-link {
  margin-left: auto;
  margin-right: 10px;
  width: fit-content;
  background-color: #fff;
  padding: 12px 15px;
  border-radius: 10px;
  font-weight: bold;
  margin-bottom: 2vh;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19);
}

.map-view .list-link > .b-icon {
  margin-right: 5px;
}

.filters-box {
  margin-top: 2vh;
  display: flex;
  overflow: auto;
  -ms-overflow-style: none; /* for Internet Explorer, Edge */
  scrollbar-width: none; /* for Firefox */
}

.filters-box::-webkit-scrollbar {
  display: none;
}

.filters-box > div {
  display: inline-block;
  /* background-color: var(--primary-color); */
  border: 1px solid #ccc;
  color: #4d4d4d;
  font-weight: bold;
  border-radius: 25px;
  font-size: 14px;
  padding: 8px 10px;
  margin-right: 5px;
  margin-bottom: 3px;
  flex-shrink: 0;
}

.filters-box > div:first-child {
  position: sticky;
  left: 0;
  background-color: #fff;
}

.filters-box > div.active {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background-color: var(--light-primary-color);
}

/* .filters-box > div.location .b-icon {
  color: var(--primary-color);
} */

.filters-box > div:first-child {
  padding-left: 15px;
  padding-right: 15px;
}

.selected-filters-box {
  margin-top: 1vh;
}

.selected-filters-box > div {
  display: inline-block;
  background-color: var(--primary-color);
  color: #fff;
  font-weight: bold;
  border-radius: 15px;
  font-size: 14px;
  padding: 5px 10px;
  margin-right: 5px;
}

.new-position-banner {
  position: absolute;
  bottom: -50px;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  width: 100px;
  text-align: center;
  border-radius: 15px;
  padding: 5px 10px;
  font-weight: bold;
  font-size: 14px;
  color: var(--primary-color);
  background-color: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19);
}

.rests-list {
  margin-top: 1vh;
  padding: 1vh 3vw;
  width: 100%;
  overflow: hidden;
}

.rests-list .rest-card {
  width: 100%;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 4vh;
}

.rests-list .rest-card label {
  font-weight: bold;
  font-size: 20px;
  margin-top: 5px;
}

.rests-list .rest-card p.info {
  margin-bottom: 0;
  word-wrap: break-word;
  width: 100%;
  white-space: normal;
  font-size: 14px;
}

.rests-list .rest-card img {
  width: 100%;
  height: 25vh;
  object-fit: cover;
  border-bottom-right-radius: 3px;
  border-bottom-left-radius: 3px;
}

.rests-list .rest-card .image-slider {
  margin-top: 3px;
  display: flex;
  overflow: auto;
  -ms-overflow-style: none; /* for Internet Explorer, Edge */
  scrollbar-width: none; /* for Firefox */
}

.rests-list .rest-card .image-slider::-webkit-scrollbar {
  display: none;
}

.rests-list .rest-card .image-slider > div {
  width: 35vw;
  height: 25vw;
  padding: 3px;
  flex-shrink: 0;
}

.rests-list .rest-card .image-slider > div img {
  width: 100%;
  height: 100%;
  border-radius: 15px;
}

.rests-preview {
  overflow: auto;
  white-space: nowrap;
  padding-bottom: 3vh;
  -ms-overflow-style: none; /* for Internet Explorer, Edge */
  scrollbar-width: none; /* for Firefox */
}

.rests-preview::-webkit-scrollbar {
  display: none;
}

.rests-preview .rest-card {
  overflow: hidden;
  width: 80vw;
  background-color: #fff;
  min-height: 25vh;
  display: inline-block;
  margin: 0 10px;
  border-radius: 15px;
  padding: 10px 10px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19);
}

.rests-preview .rest-card label {
  font-weight: bold;
  font-size: 18px;
  margin-top: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rests-preview .rest-card p.info {
  margin-bottom: 0;
  word-wrap: break-word;
  width: 100%;
  white-space: normal;
  font-size: 14px;
}

.rests-preview .rest-card img {
  width: 100%;
  height: 16vh;
  object-fit: cover;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
}

.food-service-content {
  /* position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000000;
  height: 100vh;
  width: 100%; */
}

.filters-content {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000000;
  height: 100vh;
  width: 100%;
  overflow: scroll;
  background-color: #fff;
}

.filters-size {
  margin-left: 8px;
  font-weight: bold;
  font-size: 14px;
  color: #fff;
  padding: 3px 7px;
  border-radius: 20px;
  background-color: var(--primary-color);
}

.location-active .b-icon {
  color: var(--primary-color);
}

div.what-box {
  display: block;
  border: none;
  padding: 0 0;
  margin-top: 5px;

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

.loading-content {
  padding: 10px 10px;
}

.loading-content > div {
  margin-bottom: 4vh;
}

.loading-content > div > div {
  margin-bottom: 2vh;
}

.custom-marker > div {
  display: flex;
  align-items: center; /* Vertical center alignment */
}

.custom-marker img {
  width: 30px;
  height: 40px;
  margin-right: 5px;
}

.custom-marker p.label {
  font-weight: bold;
  text-shadow: 1px 1px #fff;
  font-size: 12px;
  line-height: 11px;
}

.custom-marker p.label {
  margin-bottom: 0;
}

.slider {
  position: absolute;
  width: 100%;
  height: 5px;
  overflow-x: hidden;
  left: 0;
  right: 0;
  bottom: 0;
}

.line {
  position: absolute;
  opacity: 0.4;
  background: #fff;
  width: 150%;
  height: 5px;
}

.subline {
  position: absolute;
  background: var(--primary-color);
  height: 5px;
  opacity: 0.8;
}
.inc {
  animation: increase 2s infinite;
}
.dec {
  animation: decrease 2s 0.5s infinite;
}

@keyframes increase {
  from {
    left: -5%;
    width: 5%;
  }
  to {
    left: 130%;
    width: 100%;
  }
}
@keyframes decrease {
  from {
    left: -80%;
    width: 80%;
  }
  to {
    left: 110%;
    width: 10%;
  }
}
</style>
