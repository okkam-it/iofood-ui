<template>
  <div class="pfp-box">
    <div class="pfp-image" v-if="pfp.image">
      <img :src="getImage(pfp)" />
    </div>
    <p class="title">{{getTrad(pfp.name)}}</p>
    <hr />
    <p class="desc" v-if="getTrad(pfp.description)">{{getTrad(pfp.description)}}</p>
    <div class="info-box">
      <p class="pfp-price" v-if="pfp.price">{{pfp.price.toFixed(2)}} €</p>
      <template v-if="pfp.ingredients && pfp.ingredients.length">
        <label>Ingredienti</label>
        <div>
          <p class="pfp-ingredients">{{printIngredients()}}</p>
        </div>
      </template>
      <template v-if="modifiers && modifiers.length">
        <label>Opzioni</label>
        <div>
          <p class="pfp-modifiers">...</p>
        </div>
      </template>
      <template v-if="pfp.allergens && pfp.allergens.length">
      <label>Allergeni</label>
      <div>
        <div v-for="allergen in pfp.allergens" :key="allergen" class="allergen-item">
          <img
            class="allergen-icon"
            :key="allergen"
            :src="require('@/assets/allergens/' + allergen.toUpperCase() + '.png')"
          />
          {{allergen}}
        </div>
      </div>
      </template>
      <!-- <label>Valori nutrizionali</label>
      <div></div> -->

      <!-- <button @click="hide()">Chiudi</button> -->
    </div>
  </div>
</template>

<script>
import api from "@/helpers/api";
export default {
  name: "PfpInfoPage",
  components: {},
  data() {
    return {
      modifiers: []
    };
  },
  props: {
    pfp: {
      type: Object
    }
  },
  mounted() {
    // this.loadModifiers();
  },
  methods: {
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
          this.modifiers = response.data;
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
  padding-bottom: 2vh;
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

.allergen-item {
  margin-bottom: 5px;
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
  font-size: 14px;
}

.pfp-price {
  margin-bottom: 4px;
  color: #4d4d4d;
  font-size: 16px;
}

button {
  width: 100%;
  box-shadow: none;
  background-color: #f2f2f2;
  border-radius: 30px;
  color: #4d4d4d;
}
</style>
