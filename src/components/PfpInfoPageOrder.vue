<template>
  <div class="pfp-box">
    <div class="pfp-image" v-if="pfp.image">
      <img :src="getImage(pfp)" />
    </div>
    <p class="title">{{getTrad(pfp.name)}}</p>
    <hr />
    <p class="desc" v-if="getTrad(pfp.description)">{{getTrad(pfp.description)}}</p>
    <div class="info-box">
      <!-- <p class="pfp-price" v-if="pfp.price">{{pfp.price.toFixed(2)}} €</p> -->
      <pfp-price :pfp="pfp" />
      <template v-if="suggestedBeverage">
        <label>Bevanda consigliata</label>
        <p class="suggested-beverage">
          {{getTrad(suggestedBeverage.name)}}
          <span
            v-if="suggestedBeverage.price"
          >{{suggestedBeverage.price}} €</span>
        </p>
      </template>
      <template v-if="pfp.ingredients && pfp.ingredients.length">
        <label>Ingredienti</label>
        <div>
          <p class="pfp-ingredients">{{printIngredients()}}</p>
        </div>
      </template>
      <template v-if="modifiers && modifiers.length">
        <label>Opzioni sul piatto</label>
        <div class="pfp-modifiers">
          <div v-for="modifier in modifiers" :key="modifier.id">
            {{getTrad(modifier.name)}}:
            <div class="alternative-box">
              <div
                class="alternative"
                v-for="alternative in modifier.alternatives"
                :key="alternative.id"
              >{{getTrad(alternative.name)}}</div>
              <!-- <span
                v-for="alternative in modifier.alternatives"
                :key="alternative.id"
              >{{getTrad(alternative.name)}}</span>-->
            </div>
          </div>
        </div>
      </template>
      <template v-if="pfp.allergens && pfp.allergens.length">
        <label>Allergeni</label>
        <div class="allergens-box">
          <div v-for="allergen in pfp.allergens" :key="allergen">
            <img
              class="allergen-icon"
              :key="allergen"
              :src="require('@/assets/allergens/' + allergen.toUpperCase() + '.png')"
            />
            {{allergen}}
          </div>
        </div>
      </template>
      <div class="add-to-cart-box">
        <div class="size-spinner">
          <span @click="removeItem()">
            <b-icon-dash-circle scale=".8" />
          </span>
          <span>{{quantity}}</span>
          <span @click="addItem()">
            <b-icon-plus-circle scale=".8" />
          </span>
        </div>
        <button class="primary" @click="addItems()">
          Aggiungi
          <b-icon-circle-fill scale=".3" />
          <span class="price">{{pfp.price*quantity}}€</span>
        </button>
      </div>
      <!-- <label>Valori nutrizionali</label>
      <div></div>-->

      <!-- <button @click="hide()">Chiudi</button> -->
    </div>
  </div>
</template>

<script>
import api from "@/helpers/api";
import PfpPrice from "@/components/foodservicemenutable/PfpPrice";
export default {
  name: "PfpInfoPage",
  components: {
    PfpPrice
  },
  data() {
    return {
      modifiers: [],
      suggestedBeverage: null,
      quantity: 1
    };
  },
  props: {
    pfp: {
      type: Object
    }
  },
  computed: {
    fsId() {
      return this.$route.params.id;
    }
    /* quantity() {
      return this.$store.getters.itemQuantity(this.pfp.id);
    } */
  },
  mounted() {
    this.loadModifiers();
    this.loadSuggestedBeverage();
  },
  methods: {
    addItem() {
      this.quantity++;
    },
    addItems() {
      var item = {
        id: this.pfp.id,
        name: this.getTrad(this.pfp.name),
        desc: this.getTrad(this.pfp.description),
        price: this.pfp.price
        // quantity: this.quantity
      };
      for (let i = 0; i < this.quantity; i++)  {
        this.$store.dispatch("addItem", item);
      }

      this.hide();
    },
    removeItem() {
      this.quantity--;
      /* var payload = {
        id: this.pfp.id,
        index: null
      };
      this.$store.dispatch("removeItem", payload); */
    },
    loadSuggestedBeverage() {
      if (this.pfp.suggestedBeverage) {
        this.axios
          .get(api.GET_PFP.replace("{id}", this.pfp.suggestedBeverage))
          .then(response => {
            this.suggestedBeverage = response.data;
            // this.loadAlternatives();
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    getImage(pfp) {
      if (pfp.otherImages && pfp.otherImages.smallThumbnailImage) {
        return pfp.otherImages.mediumThumbnailImage;
      }
      return pfp.imageUrl;
    },
    hide() {
      if (this.$route.hash && this.$route.hash === "#mobilemodal") {
        this.$router.go(-1);
      }
      this.$emit("hide");
    },
    loadModifiers() {
      this.axios
        .get(api.GET_PFP_MODIFIERS.replace("{id}", this.pfp.id))
        .then(response => {
          this.modifiers = response.data.filter(
            x => x.classification !== "PRICE"
          );
          for (let modifier of this.modifiers) {
            this.axios
              .get(
                api.GET_MODIFIER_ALTERNATIVES.replace(
                  "{id}",
                  this.fsId
                ).replace("{modifierId}", modifier.id)
              )
              .then(response => {
                this.$set(modifier, "alternatives", response.data);
              })
              .catch(error => {
                console.log(error);
              });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    printIngredients() {
      var ingredientsString = [];

      for (let ing of this.pfp.ingredients) {
        // if (ing.showInMenu) {
        ingredientsString.push(this.getTrad(ing.name));
        // }
      }
      console.log(ingredientsString.join(", "));
      return ingredientsString.join(", ");
    }
  }
};
</script>

<style scoped>
.pfp-box {
  padding-bottom: calc(2vh + 125px);
}

.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 3px;
}

.desc {
  font-size: 15px;
  color: #808080;
}

.pfp-image {
  position: relative;
  margin-bottom: 1vh;
}

.pfp-image img {
  width: 100%;
  max-height: 20vh;
  object-fit: cover;
  border-radius: 15px;
}

label {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 2px;
}

.allergens-box {
  overflow: auto;
  white-space: nowrap;

  -ms-overflow-style: none; /* for Internet Explorer, Edge */
  scrollbar-width: none; /* for Firefox */
}

.allergens-box::-webkit-scrollbar {
  display: none; /* for Chrome, Safari, and Opera */
}

.allergens-box > div {
  display: inline-block;
  margin-right: 5px;
  border: 1px solid #f2f2f2;
  padding: 2px 10px;
  border-radius: 15px;
  background-color: #f2f2f2;
}

.allergen-icon {
  width: 25px;
  margin-right: 3px;
  border-radius: 25px;
  filter: grayscale(80%);
  opacity: 0.5;
  border: 1.1px solid #111;
}

.info-box {
}

.info-box > div {
  margin-bottom: 2vh;
}

.pfp-ingredients {
  margin-bottom: 3px;
  color: #808080;
  font-size: 15px;
}

/* .pfp-price {
  margin-bottom: 4px;
  color: #4d4d4d;
  font-size: 16px;
} */

.price-box {
  font-size: 18px;
  color: #4d4d4d;
}

button {
  width: 100%;
  box-shadow: none;
  border-radius: 30px;
}

.add-to-cart-box {
  position: fixed;
  bottom: -15px;
  width: 100%;
  left: 0;
  background-color: #fff;
  box-shadow: 0 5px 13px -1px rgba(0, 0, 0, 0.75);
  padding: 10px 10px;
}

.add-to-cart-box button {
  font-weight: bold;
}

.add-to-cart-box button .b-icon {
  margin-left: 5px;
  margin-right: 5px;
}

.add-to-cart-box button .price {
  font-weight: bold;
}

.add-to-cart-box .size-spinner {
  font-size: 26px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5vh;
}

.add-to-cart-box .size-spinner > span {
  margin-left: 10%;
  margin-right: 10%;
}

.add-to-cart-box .size-spinner .b-icon {
  color: var(--dark-primary-color);
}

.pfp-modifiers .alternative-box {
  margin-bottom: 8px;
}

.pfp-modifiers .alternative-box div {
  background-color: #f2f2f2;
  margin-right: 2px;
  border-radius: 15px;
  padding: 2px 10px;
  font-size: 15px;
  display: inline-block;
  margin-bottom: 2px;
}

.suggested-beverage > span {
  margin-left: 2px;
}
</style>