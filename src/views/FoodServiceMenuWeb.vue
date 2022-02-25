<template>
  <div class="menus">
    <template v-if="loadingMenus">
      <loader-full-screen text />
    </template>
    <template v-else>
      <div class="menus-selector">
        <span
          v-for="menu in menus"
          :key="menu.id"
          @click="selectedMenu = menu"
          :class="{ active : selectedMenu && selectedMenu.id == menu.id}"
        >{{getTrad(menu.name)}}</span>
      </div>
      <div class="menu-content" v-if="selectedMenu">
        <p class="menu-desc" v-if="selectedMenu.description">{{getTrad(selectedMenu.description)}}</p>
        <template v-for="section in selectedMenu.sections">
          <div v-if="section.preparedFoodProducts.length" :key="section.id">
            <label class="section-title">{{getTrad(section.name)}}</label>
            <div
              class="pfp-item"
              :class="{'image-layout' : pfp.image }"
              v-for="pfp in section.preparedFoodProducts"
              :key="pfp.id"
              @click="dishToShow = pfp"
            >
              <div class="pfp-image" v-if="pfp.image">
                <img :src="getImage(pfp)" />
              </div>
              <!-- <b-icon-chevron-right class="more-info-icon" /> -->
              <p class="pfp-title">{{getTrad(pfp.name)}}</p>
              <!-- <p class="pfp-price" v-if="pfp.price">{{pfp.price.toFixed(2)}} €</p> -->
              <pfp-price :pfp="pfp" />
              <p class="pfp-ingredients">{{printIngredients(pfp.ingredients)}}</p>
              <pfp-modifiers :pfp="pfp" />
              <p class="pfp-info">
                <template v-for="allergen in pfp.allergens">
                  <img
                    class="allergen-icon"
                    @click.stop="allergensToShow = pfp.allergens"
                    :key="allergen"
                    :src="require('@/assets/allergens/' + allergen.toUpperCase() + '.png')"
                  />
                </template>
              </p>
              <div class="val-nut-box">
                <span>
                  <span>Kcal</span>
                  <b-icon-reception4 scale="1.2" class="red" />
                </span>
                <span>
                  <span>Carboidrati</span>
                  <b-icon-reception2 scale="1.2" class="lightgreen" />
                </span>
                <span>
                  <span>Grassi</span>
                  <b-icon-reception3 scale="1.2" class="yellow" />
                </span>
                <span>
                  <span>Proteine</span>
                  <b-icon-reception4 scale="1.2" class="green" />
                </span>
              </div>
            </div>
            <!-- <hr /> -->
          </div>
        </template>
      </div>
    </template>
    <lang-selector-modal ref="langselectormodal" />
  </div>
</template>

<script>
import api from "@/helpers/api";
// import MobileModal from "@/components/mobile-modal/MobileModal";
// import PfpInfoPage from "@/components/PfpInfoPage";
import PfpModifiers from "@/components/foodservicemenutable/PfpModifiers";
import PfpPrice from "@/components/foodservicemenutable/PfpPrice";
import LoaderFullScreen from "@/components/LoaderFullScreen";
import LangSelectorModal from "@/components/mobile-modal/LangSelectorModal";
export default {
  name: "FoodServicePage",
  components: {
    // MobileModal,
    LoaderFullScreen,
    // PfpInfoPage,
    PfpModifiers,
    PfpPrice,
    LangSelectorModal
  },
  data() {
    return {
      foodService: null,
      selectedMenu: null,
      menus: [],
      loadingMenus: true,
      dishToShow: null
      /* showStickyHeader: false,
      allergensToShow: null,
      dishToShow: null,
      showMenuSelector: false,
      logo: require("@/assets/myfood-logo-large-dark.png"),
      activeSection: null,
      sectionsPosition: null */
    };
  },
  methods: {
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
            console.log(menu.type);
            if (!menu.type || menu.type !== "DELIVERY") {
              menus.push(menu);
            }
          }
          this.menus = menus;
          if (menus.length) {
            this.selectedMenu = menus[0];
          }

          this.loadingMenus = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    printIngredients(ingredients) {
      var ingredientsString = [];
      for (let ing of ingredients) {
        ingredientsString.push(this.getTrad(ing.name));
      }
      return ingredientsString.join(", ");
    }
    /* showLangSelector() {
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
      var elmnt = document.getElementById("menu-content-box");
      elmnt.scrollTop = 0;
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

      let el = document.getElementById("section-button-" + this.activeSection);
      if (el) {
        var rect = el.getBoundingClientRect();

        let isInViewport =
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <=
            (window.innerHeight ||
              document.documentElement
                .clientHeight) &&
          rect.right <=
            (window.innerWidth ||
              document.documentElement.clientWidth);

        if (!isInViewport) {
          var leftPos = el.offsetLeft;
          // document.getElementById("menu-sections-buttons-box").scrollLeft = leftPos - 10;
          document.getElementById("menu-sections-buttons-box").scrollTo({
            top: 0,
            left: leftPos - 10,
            behavior: "smooth"
          });
        }
      }     

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
        // }
      }      

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
    }
    /* showMenuSelector() {
      if (
        !this.showMenuSelector &&
        this.$route.hash &&
        this.$route.hash === "#mobilemodal"
      ) {
        this.$router.go(-1);
      }
    } */
  },
  mounted() {
    this.loadingMenus = true;

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
.menus {
  padding: 2vh 5vw;
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
  margin: 0 3vw;
  color: #808080;
  font-weight: bold;
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
}

div.actions2 button .b-icon {
  margin-right: 10px;
}

.val-nut-box {
  font-size: 13px;
  text-align: left;
  margin-top: -1vh;
  margin-bottom: 1vh;
  opacity: 0.7;
}

.val-nut-box > span {
  margin-right: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
  padding: 2px 3px;
}
.val-nut-box > span > span {
  margin-right: 5px;
}

.val-nut-box > span > .b-icon.green {
  color: #209c05;
}

.val-nut-box > span > .b-icon.lightgreen {
  color: #85e62c;
}

.val-nut-box > span > .b-icon.yellow {
  color: #f2ce02;
}

.val-nut-box > span > .b-icon.red {
  color: #ff0a0a;
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
</style>