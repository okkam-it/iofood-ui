<template>
  <div class="food-service-page" @scroll="handleContentScroll">
    <template v-if="foodService">
      <div class="header">
        <div>
          <div class="back-button" @click="hide()">
            <b-icon-chevron-left scale="1.3" shift-h="-2" shift-v="-8" />
          </div>
        </div>
        <template v-if="foodService.coverImage">
          <img :src="foodService.coverImageUrl" />
        </template>
        <template v-else>
          <img :src="require('@/assets/bg_blank.png')" />
        </template>
      </div>
      <div class="sticky-header" v-if="showStickyHeader">
        <div class="back-button" @click="hide()">
          <b-icon-chevron-left scale="1.3" shift-h="-2" shift-v="0" />
        </div>
        <p class="header-rest-name">{{ foodService.name }}</p>
      </div>
      <div class="content">
        <div>
          <h1 class="rest-name">{{ foodService.name }}</h1>
          <div class="info mb-2">
            <span v-if="foodService.type">{{
              getTrad(foodService.type.name)
            }}</span>
            <template v-if="foodService.cuisine && foodService.cuisine.length">
              <b-icon-dot />
              <span>
                {{ printCuisines(foodService.cuisine) }}
              </span>
            </template>
            <template
              v-if="
                foodService.additionalInfo &&
                foodService.additionalInfo.priceRange
              "
            >
              <b-icon-dot /><span>{{
                getPriceRangeIcon(foodService.additionalInfo.priceRange)
              }}</span></template
            >
            <br />
            <template
              v-if="
                foodService.additionalInfo &&
                foodService.additionalInfo.occasions
              "
            >
              <span>
                <span
                  v-for="occasion in foodService.additionalInfo.occasions.split(
                    ','
                  )"
                  :key="'occasion-' + occasion"
                >
                  <b-icon-check scale="1.2" />{{ $t("filters." + occasion) }}
                </span>
              </span>
              <br />
            </template>
            <!-- <b-icon-dot />
            <span>1.5 km</span>-->
            <food-service-opening-label
              :fsId="foodService.id"
              :small="true"
              class="mt-1"
            />
            <div class="openings-box" v-if="openings.length">
              <ul>
                <template v-for="opening in openings">
                  <li :key="opening.id">
                    <template v-if="opening.singleDay">
                      <p v-if="opening.opening">Apertura straordinaria il</p>
                      <p v-else>Chiuso il</p>
                      <strong>{{
                        new Date(opening.fromDate).toLocaleDateString(
                          "default",
                          dateOptions
                        )
                      }}</strong>
                    </template>
                    <template v-else>
                      <p v-if="opening.opening">Apertura straordinaria dal</p>
                      <p v-else>Chiuso dal</p>
                      <strong>{{
                        new Date(opening.fromDate).toLocaleDateString(
                          "default",
                          dateOptions
                        )
                      }}</strong>
                      {{ " al " }}
                      <strong>{{
                        new Date(opening.toDate).toLocaleDateString(
                          "default",
                          dateOptions
                        )
                      }}</strong>
                    </template>
                  </li>
                </template>
              </ul>
            </div>
            <!-- <label class="more-info" @click="showMoreInfo = true">
              Clicca qui per visualizzare orari, indirizzo e altre
              <span>
                informazioni
                <b-icon-chevron-right scale="1.2" />
              </span>
            </label> -->
          </div>
          <!-- <p class="info" v-if="foodService.location">
            <span>
              <b-icon-geo-fill />
              {{address}}
            </span>
          </p>
          <p class="info" v-if="foodService.openings">
            <span>
              <b-icon-clock-fill />
              {{foodService.openings}}
            </span>
          </p>-->

          <div class="actions">
            <div @click="openPhoneCall()">
              <b-icon-telephone-fill scale="1.5" />Chiama
            </div>
            <div @click="openGMaps()">
              <b-icon-cursor-fill scale="1.5" rotate="-45" />Indicazioni
            </div>
            <div @click="openShare()" v-if="sharingEnabled">
              <b-icon-share-fill scale="1.5" />Condividi
            </div>
            <div @click="showMoreInfo = true">
              <b-icon-three-dots scale="1.5" />Info
            </div>
          </div>
          <div class="actions2" v-if="myfoodDelivery || myfoodTableBooking">
            <div>
              <button class="small" v-if="myfoodDelivery">
                <b-icon-basket2 scale="1.5" />Ordina
              </button>
              <button class="small" v-if="myfoodTableBooking">
                <b-icon-calendar2-day scale="1.5" />Prenota
              </button>
            </div>
          </div>

          <div class="separator">
            <div />
          </div>

          <template v-if="loadingMenus">
            <div class="loading-menus-box">
              <b-spinner type="grow"></b-spinner>
            </div>
          </template>
          <template v-else>
            <div class="tabs-header">
              <span
                :class="{ active: selectedTab === 0 }"
                @click="selectedTab = 0"
                >Menu</span
              >
              <span
                :class="{ active: selectedTab === 1 }"
                @click="selectedTab = 1"
                >Foto</span
              >
            </div>
            <template v-if="selectedTab === 0">
              <div class="menus">
                <div class="menus-selector">
                  <span
                    v-for="menu in menus"
                    :key="menu.id"
                    @click="selectedMenu = menu"
                    :class="{
                      active: selectedMenu && selectedMenu.id == menu.id,
                    }"
                    >{{ getTrad(menu.name) }}</span
                  >
                </div>
                <div class="menu-content" v-if="selectedMenu">
                  <div class="gender-selector">
                    <span>
                      Valori nutrizionali per
                      <!-- <b-icon-caret-down-fill class="dd-icon" /> -->
                      <!-- <b-icon-person-fill class="border rounded p-1 active" />
                      <b-icon-person-fill class="border rounded p-1" />-->
                      <template v-if="gender === 0">
                        <img :src="gen_m_active" class="active" />
                        <img
                          :src="gen_f"
                          @click="$store.dispatch('userModule/setGenderFemale')"
                        />
                      </template>
                      <template v-else>
                        <img
                          :src="gen_m"
                          @click="$store.dispatch('userModule/setGenderMale')"
                        />
                        <img :src="gen_f_active" class="active" />
                      </template>
                    </span>
                  </div>
                  <div class="dishes-4you-selector" v-if="suggestedPfps.length">
                    <span
                      >Mostra solo
                      <span class="suggested-badge">
                        <b-icon-star-fill scale=".8" />Scelto per te
                      </span>
                      <label class="switch">
                        <input
                          :checked="dishes4youonly"
                          @input="
                            /* $store.dispatch('userModule/toggleDishes4youonly') */ dishes4youonly =
                              !dishes4youonly
                          "
                          type="checkbox"
                        />
                        <span class="slider"></span> </label
                    ></span>
                  </div>
                  <p class="menu-desc" v-if="selectedMenu.description">
                    {{ getTrad(selectedMenu.description) }}
                  </p>
                  <template v-for="section in selectedMenu.sections">
                    <div
                      v-if="
                        section.preparedFoodProducts.length &&
                        checkSectionHasSuggested(section.preparedFoodProducts)
                      "
                      :key="section.id"
                    >
                      <label class="section-title">{{
                        getTrad(section.name)
                      }}</label>
                      <template v-for="pfp in section.preparedFoodProducts">
                        <div
                          class="pfp-item"
                          :class="{ 'image-layout': pfp.image }"
                          :key="pfp.id"
                          @click="dishToShow = pfp"
                          v-if="
                            !dishes4youonly ||
                            !suggestedPfps.length ||
                            suggestedPfps.includes(String(pfp.id))
                          "
                        >
                          <div class="pfp-image" v-if="pfp.image">
                            <img :src="getImage(pfp)" />
                          </div>
                          <!-- <b-icon-chevron-right class="more-info-icon" /> -->
                          <span
                            class="suggested-badge"
                            v-if="suggestedPfps.includes(String(pfp.id))"
                          >
                            <b-icon-star-fill scale=".8" />Scelto per te
                          </span>
                          <p class="pfp-title">
                            {{ getTrad(pfp.name) }}

                            <!-- <span class="balanced-badge">
                            <span>
                              Equilibrato                              
                              <b-icon-star-fill scale=".8" />
                            </span>
                          </span>-->
                          </p>
                          <!-- <p class="pfp-price" v-if="pfp.price">{{pfp.price.toFixed(2)}} ???</p> -->
                          <pfp-price :pfp="pfp" />
                          <p class="pfp-ingredients">
                            {{ printIngredients(pfp.ingredients) }}
                          </p>
                          <p class="pfp-info">
                            <template v-for="allergen in pfp.allergens">
                              <img
                                class="allergen-icon"
                                :key="allergen"
                                :src="
                                  require('@/assets/allergens/' +
                                    allergen.toUpperCase() +
                                    '.png')
                                "
                              />
                            </template>
                          </p>
                          <pfp-nutritional-values-preview
                            :pfpId="String(pfp.id)"
                            :gender="gender"
                          />
                          <!-- <div class="val-nut-box">                          
                          <span>
                            500
                            <span>Kcal</span>
                          </span>
                          <span>
                            <span>Carb</span>
                            <b-icon-reception2 scale="1.2" />
                          </span>
                          <span>
                            <span>Grassi</span>
                            <b-icon-reception3 scale="1.2" />
                          </span>
                          <span>
                            <span>Prot</span>
                            <b-icon-reception3 scale="1.2" />
                          </span>
                        </div>-->
                        </div>
                      </template>
                      <!-- <hr /> -->
                    </div>
                  </template>
                </div>
              </div>
            </template>
            <template v-else-if="selectedTab === 1">
              <div class="pics-container">
                <div>
                  <template v-for="image in foodService.gallery">
                    <div class="box" :key="image.id">
                      <template v-if="image.demo">
                        <img
                          class="image"
                          :src="require('@/assets/pics-demo/' + image.imageUrl)"
                        />
                      </template>
                      <template v-else>
                        <img
                          class="image"
                          :src="
                            image.otherImages &&
                            image.otherImages.smallThumbnailImage
                              ? image.otherImages.smallThumbnailImage
                              : image.imageUrl
                          "
                        />
                      </template>
                    </div>
                  </template>
                  <!-- <div class="box" style="height:170px;">1</div>
                  <div class="box" style="height:186px;">4</div>
                  <div class="box" style="height:130px;">2</div>
                  <div class="box" style="height:110px;">5</div>
                  <div class="box" style="height:190px;">3</div>
                  <div class="box" style="height:140px;">6</div>-->
                </div>
              </div>
            </template>
          </template>
        </div>
      </div>
    </template>
    <mobile-modal
      v-if="showMoreInfo"
      @hide="showMoreInfo = false"
      showclosebutton
    >
      <template #content>
        <food-service-info-page
          :foodService="foodService"
          :closedNow="closedNow"
        />
      </template>
    </mobile-modal>
    <mobile-modal
      v-if="allergensToShow"
      @hide="allergensToShow = null"
      showclosebutton
    >
      <template #content>
        <div class="allergens-list-modal">
          <div v-for="allergen in allergensToShow" :key="allergen">
            <img
              class="allergen-icon"
              :key="allergen"
              :src="
                require('@/assets/allergens/' + allergen.toUpperCase() + '.png')
              "
            />
            {{ allergen }}
          </div>
        </div>
      </template>
    </mobile-modal>
    <mobile-modal v-if="dishToShow" @hide="dishToShow = false" showclosebutton>
      <template #content>
        <pfp-info-page :pfp="dishToShow" @hide="dishToShow = null" />
      </template>
    </mobile-modal>
  </div>
</template>

<script>
import api from "@/helpers/api";
import MobileModal from "@/components/mobile-modal/MobileModal";
import FoodServiceInfoPage from "@/components/FoodServiceInfoPage";
import PfpInfoPage from "@/components/PfpInfoPage";
import PfpPrice from "@/components/foodservicemenutable/PfpPrice";
import PfpNutritionalValuesPreview from "@/components/PfpNutritionalValuesPreview";
import FoodServiceOpeningLabel from "@/components/FoodServiceOpeningLabel";

export default {
  name: "FoodServicePage",
  components: {
    MobileModal,
    FoodServiceInfoPage,
    PfpInfoPage,
    PfpPrice,
    PfpNutritionalValuesPreview,
    FoodServiceOpeningLabel,
  },
  data() {
    return {
      foodService: null,
      selectedMenu: null,
      menus: [],
      loadingMenus: true,
      showStickyHeader: false,
      selectedTab: 0,
      showMoreInfo: false,
      allergensToShow: null,
      dishToShow: null,
      dateOptions: { day: "numeric", month: "long", year: "numeric" },
      closedNow: false,
      openAt: null,
      gen_m: require("@/assets/gen_m.png"),
      gen_f: require("@/assets/gen_f.png"),
      gen_m_active: require("@/assets/gen_m_active.png"),
      gen_f_active: require("@/assets/gen_f_active.png"),
      suggestedPfps: [],
      deliveryMenu: null,
      dishes4youonly: false,
    };
  },
  methods: {
    checkSectionHasSuggested(pfps) {
      if (!this.dishes4youonly) {
        return true;
      }
      for (let pfp of pfps) {
        if (this.suggestedPfps.includes(String(pfp.id))) {
          return true;
        }
      }
      return false;
    },
    printCuisines(cuisines) {
      return cuisines.map((e) => this.getTrad(e.name)).join(", ");
    },
    getImage(pfp) {
      if (pfp.otherImages && pfp.otherImages.smallThumbnailImage) {
        return pfp.otherImages.smallThumbnailImage;
      }
      return pfp.imageUrl;
    },
    openGMaps() {
      // window.location.href = marker.url;
      var url = "http://maps.google.com/?q=" + this.address;
      window.open(url, "_blank");
    },
    openPhoneCall() {
      // window.location.href = marker.url;
      var url = "tel:3484157464";
      window.open(url, "_blank");
    },
    openShare() {
      if (navigator.share) {
        // Web Share API is supported
        navigator
          .share({
            title: this.foodService.name,
            url: window.location.href,
          })
          .then(() => {
            console.log("Thanks for sharing!");
          })
          .catch(console.error);
      } else {
        // Fallback
        alert("Not supported");
      }
    },
    handleContentScroll(e) {
      if (this.foodService) {
        var scrollPos = e.target.scrollTop;
        var innerHeight = window.innerHeight;
        var limit = innerHeight * 0.17;
        if (scrollPos > limit) {
          this.showStickyHeader = true;
        } else {
          this.showStickyHeader = false;
        }
      }
    },
    hide() {
      this.$emit("hide");
    },
    printIngredients(ingredients) {
      var ingredientsString = [];
      for (let ing of ingredients) {
        ingredientsString.push(this.getTrad(ing.name));
      }

      return ingredientsString.join(", ");
    },
    loadFoodService() {
      this.axios
        .get(api.GET_FOOD_SERVICE_BY_ID.replace("{id}", this.fsId))
        .then((response) => {
          this.foodService = response.data;
          this.loadFsInfo();
          this.loadFsOpenings();
          this.loadFsContacts();
          this.loadFsPayments();
          this.loadFsLocation();
          this.loadMenus();
          this.loadGallery();
          this.loadCuisine();
          this.loadAdditionalInfo();
          this.loadDeliveryMenu();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    loadAdditionalInfo() {
      this.axios
        .get(
          api.GET_FOOD_SERVICE_ADDITIONAL_INFO_BY_ID.replace("{id}", this.fsId)
        )
        .then((response) => {
          this.$set(this.foodService, "additionalInfo", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    loadCuisine() {
      this.axios
        .get(api.GET_FOOD_SERVICE_CUISINE_BY_ID.replace("{id}", this.fsId))
        .then((response) => {
          this.$set(this.foodService, "cuisine", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    loadDeliveryMenu() {
      this.axios
        .get(api.GET_FOOD_SERVICE_MENU_COLLECTIONS.replace("{id}", this.fsId))
        .then((response) => {
          if (response.data) {
            let deliverycollection = response.data.find(
              (x) => x.type === "DELIVERY"
            );
            if (deliverycollection && deliverycollection.menus.length) {
              this.deliveryMenu = deliverycollection.menus[0];
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    loadGallery() {
      this.axios
        .get(api.GET_FOOD_SERVICE_GALLERY_BY_ID.replace("{id}", this.fsId))
        .then((response) => {
          if (response.data && response.data.length) {
            this.$set(this.foodService, "gallery", response.data);
          } else {
            this.$set(this.foodService, "gallery", [
              {
                id: 0,
                imageUrl: "rist_demo_3.jpeg",
                order: 1,
                demo: true,
              },
              {
                id: 1,
                imageUrl: "rist_demo_5.jpeg",
                order: 2,
                demo: true,
              },
              {
                id: 2,
                imageUrl: "rist_demo_7.jpeg",
                order: 3,
                demo: true,
              },
              {
                id: 3,
                imageUrl: "rist_demo_6.jpeg",
                order: 4,
                demo: true,
              },
              {
                id: 4,
                imageUrl: "rist_demo_4.jpeg",
                order: 5,
                demo: true,
              },
            ]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    loadFsContacts() {
      this.axios
        .get(api.GET_FOOD_SERVICE_CONTACTS_BY_ID.replace("{id}", this.fsId))
        .then((response) => {
          this.$set(this.foodService, "contacts", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    loadFsPayments() {
      this.axios
        .get(api.GET_FOOD_SERVICE_MEALVOUCHERS_BY_ID.replace("{id}", this.fsId))
        .then((response) => {
          this.$set(this.foodService, "mealvouchers", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
      this.axios
        .get(api.GET_FOOD_SERVICE_PAYMENTS_BY_ID.replace("{id}", this.fsId))
        .then((response) => {
          this.$set(this.foodService, "payments", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    loadFsOpenings() {
      var requestTimetables = this.axios.get(
        api.GET_FOOD_SERVICE_TIMETABLES_BY_ID.replace("{id}", this.fsId)
      );
      var requestOpenings = this.axios.get(
        api.GET_FOOD_SERVICE_OPENINGS_BY_ID.replace("{id}", this.fsId)
      );

      this.axios
        .all([requestTimetables, requestOpenings])
        .then(
          this.axios.spread((...responses) => {
            const responseTimetables = responses[0];
            this.$set(this.foodService, "timetables", responseTimetables.data);

            const responseOpenings = responses[1];
            this.$set(this.foodService, "openings", responseOpenings.data);
          })
        )
        .catch((errors) => {
          // react on errors.
          console.log(errors);
        });
    },
    loadFsInfo() {
      this.axios
        .get(api.GET_FOOD_SERVICE_INFO_BY_ID.replace("{id}", this.fsId))
        .then((response) => {
          this.$set(this.foodService, "info", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    loadFsLocation() {
      this.axios
        .get(api.GET_FOOD_SERVICE_LOCATION_BY_ID.replace("{id}", this.fsId))
        .then((response) => {
          this.$set(this.foodService, "location", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    loadMenus() {
      this.axios
        .get(api.GET_ALL_RESTAURANT_MENUS, {
          params: {
            foodServiceId: this.fsId,
          },
        })
        .then((response) => {
          var menus = [];
          for (let menu of response.data) {
            if (menu.active) {
              if (!menu.type || menu.type !== "DELIVERY") {
                menus.push(menu);
              }
            }
          }
          this.menus = menus;
          if (menus.length) {
            this.selectedMenu = menus[0];
          }

          this.loadingMenus = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    checkStickyHeader() {},
  },
  mounted() {
    this.loadingMenus = true;
    this.loadFoodService();
    var suggestedPfps = this.$route.query.suggested;
    if (suggestedPfps) {
      this.suggestedPfps = suggestedPfps.split(",");
    }
  },
  computed: {
    myfoodDelivery() {
      return this.deliveryMenu;
    },
    myfoodTableBooking() {
      return false;
    },
    gender() {
      return this.$store.getters["userModule/gender"];
    },
    sharingEnabled() {
      return navigator.share;
    },
    openings() {
      var openings = [];
      var fsOpenings = this.foodService.openings;
      if (fsOpenings && fsOpenings.length) {
        for (let opening of fsOpenings) {
          if (opening.singleDay) {
            let d = new Date(opening.fromDate);
            d.setDate(d.getDate() - 10);
            if (new Date() >= d && d <= new Date(opening.fromDate)) {
              openings.push(opening);
            }
          } else {
            let d = new Date(opening.fromDate);
            d.setDate(d.getDate() - 10);
            if (
              new Date() >= d ||
              (opening.toDate && new Date(opening.toDate) <= new Date())
            ) {
              openings.push(opening);
            }
          }
        }
      }

      return openings;
    },

    fsId() {
      return this.$route.params.id;
    },
    address() {
      var fs = this.foodService;
      if (fs && fs.location) {
        var loc = fs.location;
        return loc.address + ", " + loc.city;
      }
      return null;
    },
  },
};
</script>

<style scoped>
.food-service-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000000;
  height: 100vh;
  width: 100%;
  background-color: #fff;
  overflow: scroll;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 17vh;
}

.header img {
  object-fit: cover;
  width: 100%;
  height: 17vh;
  position: fixed;
  top: 0;
}

.header > div {
  /* position: sticky;
  top: 0; */
  z-index: 100;
  top: 0;
  position: relative;
}

.header > div .back-button {
  display: inline-block;
  width: 40px;
  height: 40px;
  text-align: center;
  background-color: #fff;
  border-radius: 50%;
  margin-top: 3vh;
  margin-left: 3vw;
}

.sticky-header {
  position: fixed;
  top: 0;
  width: 100%;
  background-color: #fff;
  min-height: 76px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19);
  z-index: 10;
  padding-top: 1.3vh;
}

.sticky-header .header-rest-name {
  margin-left: 15px;
  display: inline-block;
  font-weight: bold;
  font-size: 22px;
  margin-bottom: 0;
  max-width: calc(100% - 80px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}

.sticky-header .back-button {
  display: inline-block;
  text-align: center;
  background-color: #fff;
  border-radius: 50%;
  margin-top: 16px;
  margin-left: 6vw;
}

.content {
  z-index: 1;
  display: block;
  position: relative;
  overflow: scroll;
  margin-top: 15vh;
}

.content > div {
  min-height: 85vh;
  background-color: #fff;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  overflow: hidden;
  padding: 10px 10px;
}

.content .rest-name {
  margin-top: 1vh;
  font-weight: bold;
}

.content .info {
  margin-bottom: 0;
  word-wrap: break-word;
  width: 100%;
  white-space: normal;
  font-size: 14px;
}

.menus-selector {
  overflow: auto;
  white-space: nowrap;
  padding: 10px 0;
  -ms-overflow-style: none; /* for Internet Explorer, Edge */
  scrollbar-width: none; /* for Firefox */
  margin-top: 2vh;
  margin-bottom: 3vh;
}

.menus-selector::-webkit-scrollbar {
  display: none; /* for Chrome, Safari, and Opera */
}

.menus-selector > span {
  margin-right: 10px;
  font-weight: bold;
  background-color: #f2f2f2;
  border-radius: 120px;
  padding: 10px 15px;
}

.menus-selector > span.active {
  background-color: var(--primary-color);
  color: #fff;
}

.section-title {
  font-weight: bold;
  font-size: 25px;
  margin-top: 2vh;
  margin-bottom: 5px;
  /* color: var(--dark-primary-color); */
  display: flex;
  align-items: center;
}

.section-title::after {
  content: "";
  flex: 1;
  margin-left: 1rem;
  height: 0.8px;
  background-color: #e6e6e6;
}

.pfp-item {
  padding: 5px 0.5vw;
  position: relative;
  border-bottom: 1px solid #e6e6e6;
  margin-bottom: 10px;
}

.pfp-item:last-child {
  border-bottom-color: transparent;
}

.pfp-item.image-layout > p {
  max-width: 68vw;
}

.pfp-item .pfp-title {
  font-size: 18px;
  margin-bottom: 0;
  font-weight: bold;
}

.loading-menus-box {
  text-align: center;
  padding-top: 20vh;
}

.loading-menus-box .spinner-grow {
  /* color: var(--primary-color); */
  color: #ccc;
}

.allergen-icon {
  width: 25px;
  margin-right: 3px;
  border-radius: 25px;
  filter: grayscale(80%);
  opacity: 0.5;
  border: 1.1px solid #111;
}

div.actions {
  margin-top: 4vh;
  margin-bottom: 3vh;
  text-align: center;
}

div.actions > div {
  display: inline-block;
  text-align: center;
  font-size: 14px;
  margin: 0 5px;
  color: #808080;
  font-weight: bold;
  min-width: 20%;
}

div.actions > div .b-icon {
  display: block;
  margin: 0 auto;
  color: #ccc;
  margin-bottom: 5px;
}

div.actions2 {
  margin-bottom: 2vh;
}

div.actions2 > div {
  display: flex;
  overflow: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  margin-bottom: 0px;
  padding: 5px 0;
}

div.actions2 > div::-webkit-scrollbar {
  display: none;
}

div.actions2 > div button {
  border-radius: 30px;
  margin: 5px 5px;
  /* color: var(--primary-color);
  border: 2px solid var(--primary-color); */
  /* background-color: rgba(255, 165, 0, .8); */
  background-color: rgba(255, 102, 51, 0.8);
  color: #fff;
  opacity: 1;
  font-weight: bold;
  text-align: center;
  flex-shrink: 0;
  flex: auto;
}

div.actions2 button .b-icon {
  margin-right: 10px;
}

label.more-info {
  font-size: 13px;
  font-weight: bold;
}

label.more-info > span {
  display: block;
}

label.more-info > span .b-icon {
  margin-left: 5px;
}

.tabs-header {
  width: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  margin-top: 4px;
  margin-bottom: 3vh;
  padding: 5px 0;
}

.tabs-header::-webkit-scrollbar {
  display: none;
}

.tabs-header span {
  font-weight: bold;
  font-size: 19px;
  margin: 0 4vw;
  border-bottom: 3px solid transparent;
}

.tabs-header span.active {
  border-bottom: 3px solid var(--primary-color);
}

.pics-container > div {
  margin: 0 auto;
  min-height: 500px;
  width: 100%;
  -moz-column-count: 2;
  -webkit-column-count: 2;
  column-count: 2;
  -moz-column-gap: 10px;
  -webkit-column-gap: 10px;
  column-gap: 0px;
}

.pics-container > div > div.box {
  background-color: #f2f2f2;
  border: 1px solid #fff;
  width: 100%;
  display: inline-block;
  box-sizing: border-box;
  color: #f2f2f2;
  max-height: 30vh;
}

.pics-container > div > div.box > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
}

p.pfp-ingredients {
  margin-bottom: 3px;
  color: #808080;
  font-size: 14px;
}

p.pfp-price {
  margin-bottom: 3px;
  color: #4d4d4d;
  font-size: 15px;
}

.allergens-list-modal {
  padding: 0 15px;
  padding-bottom: 2vh;
}

.allergens-list-modal > div {
  margin-bottom: 1.5vh;
  font-size: 16px;
}

.allergens-list-modal > div img {
  margin-right: 5px;
}

.pfp-image {
  width: 25vw;
  max-height: 25vw;
  overflow: hidden;
  position: absolute;
  right: 0;
  top: 15px;
  border-radius: 10px;
}

.pfp-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.menu-desc {
  word-break: break-word;
}

.openings-box li {
  border: 1px solid var(--warning-color);
  padding: 10px 10px;
  border-radius: 10px;
  margin-bottom: 5px;
  margin-top: 5px;
  font-size: 14px;
}

.openings-box li strong {
  font-size: 15px;
}

.openings-box ul {
  list-style-type: none;
  padding-left: 0;
}

.openings-box p {
  margin-bottom: 0;
}

.balanced-badge {
  margin-left: 5px;
}

.balanced-badge > span {
  font-size: 12px;
  padding: 1px 2px;
  border-radius: 15px;
  background-color: var(--primary-color);
  color: #fff;
  opacity: 0.8;
  border: 1px solid var(--primary-color);
}

.balanced-badge > span .b-icon {
  margin-left: -1px;
  margin-right: 2px;
}

.dishes-4you-selector {
  text-align: right;
  margin-bottom: 20px;
  font-size: 13px;
}

.gender-selector {
  text-align: right;
  margin-bottom: 20px;
  font-size: 13px;
}

.gender-selector > span {
  border-radius: 15px;
  padding: 8px 15px;
}

.gender-selector > span .dd-icon {
  color: #808080;
}

.gender-selector > span .b-icon {
  color: #ccc;
  font-size: 2rem;
  margin-left: 5px;
}

.gender-selector > span .b-icon.active {
  color: var(--info-color);
}

.gender-selector img {
  display: inline-block;
  height: 35px;
  margin-left: 5px;
  border: 2px solid #ccc;
  padding: 6px 12px;
  border-radius: 5px;
}

.gender-selector img.active {
  border-color: var(--info-color);
}

.suggested-badge {
  font-size: 12px;
  font-weight: normal;
  background-color: orange;
  color: #fff;
  border-radius: 5px;
  padding: 2px 8px;
  white-space: nowrap;
}

.suggested-badge .b-icon {
  margin-right: 5px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 45px;
  height: 24px;
  margin-right: 10px;
  margin-left: 15px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(16px);
  -ms-transform: translateX(16px);
  transform: translateX(16px);
}
</style>
