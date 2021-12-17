<template>
  <div>
    <div class="header">
      <div>
        <template v-if="foodService">
          <img class="logo" :src="logo" />
          <div class="lang">
            <img :src="require('@/assets/flag/it_r.png')" />
          </div>
          <!-- <div>
            <p class="fs-name">{{foodService.name}}</p>
          </div> -->
          <div class="selector" @click="showMenuSelector = true" v-if="menus.length > 1">
            <div class="menu">
              {{getTrad(selectedMenu.name)}}
              <b-icon-caret-down-fill />
            </div>
          </div>
          <div class="menu-sections">
            <template v-for="section in selectedMenu.sections">
              <span
                :key="section.id"
                :class="{ active : section.id === 24 }"
              >{{getTrad(section.name)}}</span>
            </template>
          </div>
        </template>
      </div>
    </div>
    <div v-if="selectedMenu" class="menu-box">
      <!-- <div class="menu-selector">
       
      </div>-->
      <div class="menu-content" v-if="selectedMenu">
        <p class="menu-title" v-if="menus.length === 1">{{getTrad(selectedMenu.name)}}</p>
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
                    @click.stop="allergensToShow = pfp.allergens"
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
    <mobile-modal v-if="showMenuSelector" @hide="hideMenuSelector()">
      <template #content>
        <div class="menu-selector-modal">
          <label>Seleziona menu</label>
          <ul>
            <li v-for="menu in menus" :key="menu.id" @click="selectedMenu = menu">
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
  </div>
</template>

<script>
import MobileModal from "@/components/mobile-modal/MobileModal";
import PfpInfoPage from "@/components/PfpInfoPage";
import api from "@/helpers/api";
export default {
  name: "FoodServiceMenuTable",
  components: {
    MobileModal,
    PfpInfoPage
  },
  data() {
    return {
      selectedMenu: /* this.$route.menuid */ null,
      showMenuSelector: false,
      menus: [],
      allergensToShow: null,
      dishToShow: null,
      foodService: null,
      logo: require("@/assets/myfood-logo-large-dark.png")
    };
  },
  mounted() {
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
    }
    /* categories() {
      var menu = this.selectedMenu;
      if (menu) {
        return menu.sections.map(a => {name: a.name, id: a.id});
      }
      return null;
    } */
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
  methods: {
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
    hideMenuSelector() {
      if (this.selectedMenu) {
        this.showMenuSelector = false;
      }
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
    }
  }
};
</script>

<style scoped>
.header {
  top: 0;
  position: sticky;
  width: 100%;
  background-color: #fff;
  z-index: 1;
  padding: 2vh 3vw;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19);
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
}

.header > div {
  position: relative;
}

.header p {
  margin-bottom: 0;
}

.header .fs-name {
  font-size: 22px;
  text-align: center;
  margin-top: 15px;
  margin-bottom: 0;
}

.header .logo {
  width: 110px;
}

.header .lang {
  float: right;
  margin-top: 2px;
  margin-right: 2vw;
  border: 1px solid #ccc;
  border-radius: 50px;
}

.header .lang img {
  width: 38px;
  height: 32px;
}

.menu-box {
  padding: 2vh 2vw;
}

.menu-content {
  padding: 1vh 2vw;
  margin-top: 5vh;
}

.menu-title {
}

.menu-desc {
  word-break: break-word;
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
  background-color: var(--primary-color);
  width: 100%;
  margin-bottom: 1vh;
  padding: 10px 15px;
  color: #fff;
  border-radius: 5px;
  font-weight: bold;
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

.allergen-icon {
  width: 25px;
  margin-right: 3px;
  border-radius: 25px;
  filter: grayscale(80%);
  opacity: 0.5;
  border: 1.1px solid #111;
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
  margin-top: 2vh;
}

div.selector > .menu {
  border-radius: 30px;
  padding: 10px 15px;
  font-size: 18px;
  font-weight: bold;
  opacity: 0.9;
  text-align: center;
  background-color: #f66969;
  width: 100%;
  color: #fff;
  display: inline-block;
}

div.selector > .lang img {
  border-radius: 50px;
  width: 40px;
  height: 40px;
  border: 1px solid #ccc;
}

div.menu-sections {
  position: absolute;
  bottom: -70px;
  width: 100%;
  white-space: nowrap;
  overflow: auto;
  padding: 2vh 0;
  z-index: 1;
  /* margin-bottom: 8px; */
  margin-top: 1vh;
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
  background-color: #fff;
  margin-right: 5px;
  font-weight: bold;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19);
}

div.menu-sections > span.active {
  border: 1px solid var(--primary-color);
  background-color: var(--primary-color);
  color: #fff;
}
</style>
