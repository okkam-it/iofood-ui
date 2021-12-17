<template>
  <div class="food-service-page" @scroll="handleContentScroll">
    <template v-if="loadingMenus">
      <loader-full-screen />
    </template>
    <template v-else-if="foodService">
      <div class="header">
        <template v-if="foodService.coverImage">
          <img :src="foodService.coverImageUrl" />
        </template>
        <template v-else>
          <img :src="require('@/assets/bg_blank.png')" />
        </template>
        <div class="rest-name">
          <p>{{foodService.name}}</p>
        </div>
        <!-- <div class="logo">
          <img :src="logo" />
        </div>-->
      </div>
      <div class="sticky-header" v-if="showStickyHeader && selectedMenu">
        <div class="selector" @click="showMenuSelector = true">
          <div class="menu">
            {{getTrad(selectedMenu.name)}}
            <b-icon-caret-down-fill v-if="menus.length > 1" />
          </div>
          <div class="lang-selector" @click="showLangSelector()">
            <img :src="require('@/assets/flag/' + lang + '_r2.png')" />
          </div>
        </div>
        <div class="menu-sections">
          <template v-for="section in selectedMenu.sections">
            <span
              :key="section.id"
              :class="{ active : activeSection && activeSection === section.id }"
              @click="scrollToSection(section)"
            >{{getTrad(section.name)}}</span>
          </template>
        </div>
      </div>
      <div class="content">
        <div v-if="selectedMenu">
          <div class="selector">
            <div class="menu" @click="showMenuSelector = true">
              {{getTrad(selectedMenu.name)}}
              <b-icon-caret-down-fill v-if="menus.length > 1" />
            </div>
            <div class="lang-selector" @click="showLangSelector()">
              <img :src="require('@/assets/flag/' + lang + '_r2.png')" />
            </div>
          </div>
          <!-- <div class="info mb-2">
            <span v-if="foodService.type">{{getTrad(foodService.type.name)}}</span>
            <b-icon-dot />
            <span>Pizza, Italiano</span>
            <br />
            <span>€€</span>
            <b-icon-dot />
            <span>1.5 km</span>
            <label v-if="closedNow" @click="showMoreInfo = true" class="closed-now">
              <b-icon-clock-fill />Chiuso ora
              <span v-if="openAt">
                - apre alle {{openAt.getHours().toLocaleString("it-IT", {
                minimumIntegerDigits: 2,
                useGrouping: false,
                }) + ":" + openAt.getMinutes().toLocaleString("it-IT", {
                minimumIntegerDigits: 2,
                useGrouping: false,
                })}}
              </span>
            </label>
            <div class="openings-box" v-if="openings.length">
              <ul>
                <template v-for="opening in openings">
                  <li :key="opening.id">
                    <template v-if="opening.singleDay">
                      <p v-if="opening.opening">Apertura straordinaria il</p>
                      <p v-else>Chiuso il</p>
                      <strong>{{new Date(opening.fromDate).toLocaleDateString('default', dateOptions)}}</strong>
                    </template>
                    <template v-else>
                      <p v-if="opening.opening">Apertura straordinaria dal</p>
                      <p v-else>Chiuso dal</p>
                      <strong>{{new Date(opening.fromDate).toLocaleDateString('default', dateOptions)}}</strong>
                      {{" al "}}
                      <strong>{{ new Date(opening.toDate).toLocaleDateString('default', dateOptions)}}</strong>
                    </template>
                  </li>
                </template>
              </ul>
            </div>
            <label class="more-info" @click="showMoreInfo = true">
              Clicca qui per visualizzare orari, indirizzo e altre
              <span>
                informazioni
                <b-icon-chevron-right scale="1.2" />
              </span>
            </label>
          </div>-->
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

          <template v-if="loadingMenus">
            <div class="loading-menus-box">
              <b-spinner type="grow"></b-spinner>
            </div>
          </template>
          <template v-else>
            <div v-if="selectedMenu" class="menu-box">
              <!-- <div class="menu-selector">
       
              </div>-->
              <div class="menu-content" v-if="selectedMenu">
                <!-- <p class="menu-title" v-if="menus.length === 1">{{getTrad(selectedMenu.name)}}</p> -->
                <p
                  class="menu-desc"
                  v-if="selectedMenu.description"
                >{{getTrad(selectedMenu.description)}}</p>
                <template v-for="section in selectedMenu.sections">
                  <div
                    v-if="section.preparedFoodProducts.length"
                    :key="section.id"
                    class="section-box"
                  >
                    <div :id="'section_anchor_' + section.id" class="section_anchor" />
                    <label class="section-title">{{getTrad(section.name)}}</label>
                    <div
                      class="pfp-item"
                      :class="{'image-layout' : pfp.image }"
                      v-for="pfp in section.preparedFoodProducts"
                      :key="pfp.id"
                      @click="dishToShow = pfp"
                    >
                      <div class="pfp-image" v-if="pfp.image">
                        <img :src="pfp.imageUrl" />
                      </div>
                      <!-- <b-icon-chevron-right class="more-info-icon" /> -->
                      <p class="pfp-title">{{getTrad(pfp.name)}}</p>
                      <p class="pfp-price" v-if="pfp.price">{{pfp.price.toFixed(2)}} €</p>
                      <p class="pfp-ingredients">{{printIngredients(pfp.ingredients)}}</p>
                      <p class="pfp-info">
                        <template v-for="allergen in pfp.allergens">
                          <img
                            class="allergen-icon"
                            :key="allergen"
                            :src="require('@/assets/allergens/' + allergen.toUpperCase() + '.png')"
                          />
                        </template>
                      </p>
                    </div>
                    <!-- <hr /> -->
                  </div>
                </template>
              </div>
            </div>
          </template>
        </div>
        <div>
          <div class="footer">
            Powered by
            <img class="logo" :src="logo" />
          </div>
          <mobile-modal v-if="showMenuSelector" @hide="hideMenuSelector()">
            <template #content>
              <div class="menu-selector-modal">
                <label>Seleziona menu</label>
                <ul>
                  <li v-for="menu in menus" :key="menu.id" @click="selectMenu(menu)">
                    <div class="menu-item">{{getTrad(menu.name)}}</div>
                  </li>
                </ul>
              </div>
            </template>
          </mobile-modal>

          <mobile-modal v-if="allergensToShow" @hide="allergensToShow = null" showclosebutton>
            <template #content>
              <div class="allergens-list-modal">
                <div v-for="allergen in allergensToShow" :key="allergen">
                  <img
                    class="allergen-icon"
                    :key="allergen"
                    :src="require('@/assets/allergens/' + allergen.toUpperCase() + '.png')"
                  />
                  {{allergen}}
                </div>
              </div>
            </template>
          </mobile-modal>
          <mobile-modal v-if="dishToShow" @hide="dishToShow = false" showclosebutton>
            <template #content>
              <pfp-info-page :pfp="dishToShow" @hide="dishToShow = null" />
            </template>
          </mobile-modal>
          <lang-selector-modal ref="langselectormodal" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import api from "@/helpers/api";
import MobileModal from "@/components/mobile-modal/MobileModal";
import PfpInfoPage from "@/components/PfpInfoPage";
import LoaderFullScreen from "@/components/LoaderFullScreen";
import LangSelectorModal from "@/components/mobile-modal/LangSelectorModal";
export default {
  name: "FoodServicePage",
  components: {
    MobileModal,
    LoaderFullScreen,
    PfpInfoPage,
    LangSelectorModal
  },
  data() {
    return {
      foodService: null,
      selectedMenu: null,
      menus: [],
      loadingMenus: true,
      showStickyHeader: false,
      allergensToShow: null,
      dishToShow: null,
      showMenuSelector: false,
      logo: require("@/assets/myfood-logo-large-dark.png"),
      activeSection: null,
      sectionsPosition: null
    };
  },
  methods: {
    showLangSelector() {
      this.$refs.langselectormodal.show();
    },
    scrollToSection(section) {
      var elmnt = document.getElementById("section_anchor_" + section.id);
      elmnt.scrollIntoView({ behavior: "smooth", inline: "nearest" });
    },
    selectMenu(menu) {
      if (this.selectedMenu && this.selectedMenu.id === menu.id) {
        this.showMenuSelector = false;
      } else {
        this.selectedMenu = menu;
      }
    },
    handleContentScroll(e) {
      var scrollPos = e.target.scrollTop;
      var innerHeight = window.innerHeight;
      var limit = innerHeight * 0.17;
      // console.log(scrollPos);
      if (scrollPos > limit) {
        this.showStickyHeader = true;
        // console.log("true;");
      } else {
        this.showStickyHeader = false;
        // console.log("false;");
      }

      var i = 0;
      scrollPos = scrollPos >= 0 ? scrollPos : 0;
      for (let pos of this.sectionsPosition) {
        let isLast = this.sectionsPosition.length === i + 1;
        if (isLast && scrollPos > pos.val) {
          this.activeSection = pos.id;
          break;
        } else if (
          scrollPos > pos.val &&
          scrollPos < this.sectionsPosition[i + 1].val
        ) {
          this.activeSection = pos.id;
          break;
        }
        i++;
      }

      /* for (let [key, value] of Object.entries(sectionsPosition)) {
        if ()
      } */

      // console.log(scrollPos);
    },
    hide() {
      this.$emit("hide");
    },
    printIngredients(ingredients) {
      // var ingredientsIds = [];
      var ingredientsString = [];
      for (let ing of ingredients) {
        // if (ing.showInMenu) {
        // ingredientsString.push(ing.id);
        ingredientsString.push(this.getTrad(ing.name));
        /* let response = await this.axios.get(api.GET_INGREDIENT, {
            params: {
              id: ing.id
            }
          });
          ingredientsString.push(this.getTrad(response.data.name)); */
        // }
      }

      /* let requests = [];

      for (let ingredient of ingredientsIds) {
        requests.push(
          this.axios.get(api.GET_INGREDIENT, {
            params: {
              id: ingredient
            }
          })
        );
      } */

      return ingredientsString.join(", ");
    },
    loadFs() {
      this.axios
        .get(api.GET_FOOD_SERVICE_BY_ID.replace("{id}", this.fsId))
        .then(response => {
          this.foodService = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    loadMenus() {
      this.axios
        .get(api.GET_ALL_RESTAURANT_MENUS, {
          params: {
            foodServiceId: this.fsId
          }
        })
        .then(response => {
          var menus = [];
          for (let menu of response.data) {
            // console.log(menu.id);
            // if (menu.type === "BASE") {
            menus.push(menu);
            // }
          }
          this.menus = menus;
          if (this.menuId) {
            // console.log(this.menuId);
            var menu = menus.find(
              m => parseInt(m.id) === parseInt(this.menuId)
            );
            // console.log(JSON.stringify(menus));
            if (menu) {
              this.selectedMenu = menu;
              if (
                !this.selectedMenu.id ||
                parseInt(this.selectedMenu.id) !== parseInt(this.menuId)
              ) {
                // console.log("go");
                /* console.log(this.$route.menuid);
                console.log(this.menuId); */

                this.$router.replace({
                  name: "FoodServiceMenuTable",
                  params: { menuid: menu.id }
                });
              }

              this.showMenuSelector = false;
            }
            // this.selectedMenu =
          } else {
            if (menus.length === 1) {
              this.selectedMenu = menus[0];
              this.$router.replace({
                name: "FoodServiceMenuTable",
                params: { menuid: menus[0].id }
              });
              this.showMenuSelector = false;
            }
          }

          this.loadingMenus = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    async calculateSectionsPosition() {
      await this.$nextTick();
      var positions = [];
      for (let section of this.selectedMenu.sections) {
        let el = document.getElementById("section_anchor_" + section.id);
        let viewportOffset = el.getBoundingClientRect();
        positions.push({ id: section.id, val: viewportOffset.bottom - 20 });
      }
      this.sectionsPosition = positions;
      console.log(JSON.stringify(positions));
    },
    hideMenuSelector() {
      if (this.selectedMenu) {
        this.showMenuSelector = false;
      }
    },
    contentScrollListener(e) {
      console.log(e.target.scrollTop);
      let scrollPosition = window.scrollY;
      console.log(scrollPosition);
    }
  },
  watch: {
    selectedMenu() {
      if (this.selectedMenu) {
        console.log(this.selectedMenu.id);
        this.showMenuSelector = false;
        if (
          !this.menuId ||
          parseInt(this.selectedMenu.id) !== parseInt(this.menuId)
        ) {
          this.$router.replace({
            name: "FoodServiceMenuTable",
            params: { menuid: this.selectedMenu.id }
          });
        }

        this.calculateSectionsPosition();
      }
    },
    showMenuSelector() {
      if (
        !this.showMenuSelector &&
        this.$route.hash &&
        this.$route.hash === "#mobilemodal"
      ) {
        this.$router.go(-1);
      }
    }
  },
  mounted() {
    this.loadingMenus = true;
    if (!this.menuId) {
      this.showMenuSelector = true;
    }
    // console.log(this.menuId);
    this.loadFs();
    this.loadMenus();
  },
  computed: {
    fsId() {
      return this.$route.params.id;
    },
    menuId() {
      return this.$route.params.menuid;
    },
    lang() {
      return this.$i18n.locale;
    }
  }
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

.header > img {
  object-fit: cover;
  width: 100%;
  height: 18vh;
  position: fixed;
  top: 0;
}

.header .logo img {
  width: 110px;
  object-fit: cover;
}

.rest-name {
  position: absolute;
  top: 5vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: #fff;
  width: 80%;
  border-radius: 40px;
  padding: 10px 15px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  opacity: 0.8;
}

.rest-name p {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0;
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
  padding-bottom: 0;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  overflow: hidden;
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
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  overflow: hidden;
  padding: 10px 10px;
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
  height: 1px;
  background-color: #f2f2f2;
}

.pfp-item {
  padding: 5px 0.5vw;
  position: relative;
}

.pfp-item.image-layout > p {
  max-width: 68vw;
}

.pfp-item .pfp-title {
  font-size: 18px;
  margin-bottom: 0;
  font-weight: bold;
}

.allergen-icon {
  width: 25px;
  margin-right: 3px;
  border-radius: 25px;
  filter: grayscale(80%);
  opacity: 0.5;
  border: 1.1px solid #111;
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
  color: #4d4d4d;
  font-size: 16px;
}

.menu-selector {
  background-color: #fff;
  width: 100%;
  padding: 5px;
  z-index: 1;
  /* position: sticky;
  top: 0; */
  position: fixed;
  bottom: 0;
  left: 0;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19);
}

/* .menu-selector > div.selector {
  border: 2px solid var(--primary-color);
  border-radius: 30px;
  padding: 15px 15px;
  font-size: 18px;
  font-weight: bold;
  opacity: 0.9;
  text-align: center;
}

.menu-selector > div.selector .b-icon { 
} */

div.selector {
  margin-top: 1vh;
  margin-bottom: 2vh;
  padding: 0 5px;
  display: flex;
}

div.selector > .menu {
  border-radius: 10px;
  padding: 10px 15px;
  font-size: 18px;
  font-weight: bold;
  opacity: 0.8;
  text-align: center;
  background-color: #f66969;
  width: calc(100% - 60px);
  margin-right: 10px;
  color: #fff;
  display: inline-block;
}

.lang-selector {
  display: inline-block;
  width: 50px;
  border-radius: 10px;
  padding: 4px 0px;
  font-size: 18px;
  font-weight: bold;
  opacity: 0.8;
  text-align: center;
  background-color: #f2f2f2;
  color: #fff;
  display: inline-block;
  height: 47px;
}

div.selector > .lang-selector img {
  border-radius: 50px;
  width: 28px;
  margin-top: 5px;
  height: 28px;
}

div.menu-sections {
  /* position: absolute;
  bottom: -70px; */
  width: 100%;
  white-space: nowrap;
  overflow: auto;
  padding: 2vh 0;
  z-index: 1;
  /* margin-bottom: 8px; */
  margin-top: -10px;
  -ms-overflow-style: none; /* for Internet Explorer, Edge */
  scrollbar-width: none; /* for Firefox */
}

div.menu-sections::-webkit-scrollbar {
  display: none; /* for Chrome, Safari, and Opera */
}

div.menu-sections > span {
  border-radius: 30px;
  font-size: 15px;
  padding: 8px 10px;
  border: 1px solid #f2f2f2;
  background-color: #f2f2f2;
  margin-left: 5px;
  font-weight: bold;
}

div.menu-sections > span.active {
  border: 1px solid var(--primary-color);
  background-color: var(--primary-color);
  color: #fff;
}

ul {
  list-style-type: none;
  padding-left: 0;
}

.menu-selector-modal label {
  font-size: 15px;
  margin-bottom: 5px;
}

.menu-selector-modal .menu-item {
  background-color: #f66969;
  width: 100%;
  margin-bottom: 1vh;
  padding: 10px 15px;
  color: #fff;
  border-radius: 30px;
  font-weight: bold;
  text-align: center;
  opacity: 0.9;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  text-align: center;
  padding: 6px 10px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19);
  border-top-right-radius: 30px;
  border-top-left-radius: 30px;
}

.footer .logo {
  width: 110px;
  margin-left: 15px;
}

.section-box {
  position: relative;
}

.section_anchor {
  position: absolute;
  top: -150px;
  visibility: hidden;
}
</style>
