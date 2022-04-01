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
        <div>
          <div v-for="allergen in pfp.allergens" :key="allergen" class="allergen-item">
            <img
              class="allergen-icon"
              :key="allergen"
              :src="require('@/assets/allergens/' + allergen.toUpperCase() + '.png')"
            />
            {{$t('allergen.' + allergen)}}
          </div>
        </div>
      </template>
      <div class="nut-val-box" v-if="showNutritionalValues" :key="'gender_' + gender">
        <label>
          Valori nutrizionali
          <span>(Su base giornaliera)</span>
        </label>
        <div class="gender-selector">
          <span>
            <template v-if="gender === 0">
              <img :src="gen_m_active" class="active" />
              <img :src="gen_f" @click="$store.dispatch('userModule/setGenderFemale');" />
            </template>
            <template v-else>
              <img :src="gen_m" @click="$store.dispatch('userModule/setGenderMale');" />
              <img :src="gen_f_active" class="active" />
            </template>
          </span>
        </div>
        <!-- <div>
          <donut-chart title="Calorie" sub1="500" sub2="di 1500" :value="30" />
        </div>
        <div>
          <donut-chart title="Carboidrati" sub1="24.2g" sub2="di 25g" :value="90" />
        </div>
        <div>
          <donut-chart title="Grassi" sub1="164g" sub2="di 150g" :value="65" />
        </div>
        <div>
          <donut-chart title="Proteine" sub1="92g" sub2="di 81g" :value="130" />
        </div>-->
        <div v-if="nutritionalValues.energyKcal || nutritionalValues.energyKcal == 0">
          <donut-chart
            title="Calorie"
            :sub1="String(nutritionalValues.energyKcal.toFixed(2))"
            :sub2="'di ' + String(kcalDaily)"
            :value="calcDailyPercent(nutritionalValues.energyKcal, kcalDaily)"
          />
        </div>
        <div v-if="nutritionalValues.carbohydrate || nutritionalValues.carbohydrate == 0">
          <donut-chart
            title="Carboidrati"
            :sub1="String(nutritionalValues.carbohydrate.toFixed(2) + 'g')"
            :sub2="'di ' + String(carbDaily)+ 'g'"
            :value="calcDailyPercent(nutritionalValues.carbohydrate, carbDaily)"
          />
        </div>
        <div v-if="nutritionalValues.fat || nutritionalValues.fat == 0">
          <donut-chart
            title="Grassi"
            :sub1="String(nutritionalValues.fat.toFixed(2) + 'g')"
            :sub2="'di ' + String(fatDaily)+ 'g'"
            :value="calcDailyPercent(nutritionalValues.fat, fatDaily)"
          />
        </div>
        <div v-if="nutritionalValues.proteins || nutritionalValues.proteins == 0">
          <donut-chart
            title="Proteine"
            :sub1="String(nutritionalValues.proteins.toFixed(2) + 'g')"
            :sub2="'di ' + String(protDaily)+ 'g'"
            :value="calcDailyPercent(nutritionalValues.proteins, protDaily)"
          />
        </div>
      </div>

      <div class="balanced-meal-box" v-if="dietary && Object.keys(dietary).length">
        <label>Combinazioni per un pasto equilibrato</label>
        <div class="gender-selector">
          <span>
            <template v-if="gender === 0">
              <img :src="gen_m_active" class="active" />
              <img :src="gen_f" @click="$store.dispatch('userModule/setGenderFemale');" />
            </template>
            <template v-else>
              <img :src="gen_m" @click="$store.dispatch('userModule/setGenderMale');" />
              <img :src="gen_f_active" class="active" />
            </template>
          </span>
        </div>
        <div class="combination" v-for="(pfps, k) in dietary" :key="k">
          <!-- <p>{{getTrad(pfp.name)}}</p> -->
          <p>{{$t("dietary." + k)}}</p>
          <p v-for="pfp in pfps" :key="pfp.id">
            <b-icon-arrow90deg-down rotate="-90" shift-v="3" />
            {{getTrad(pfp.name)}}
          </p>
        </div>
        <!-- <div class="combination">
          <p>{{getTrad(pfp.name)}}</p>
          <p>
            <b-icon-arrow90deg-down rotate="-90" shift-v="4" />Nome piatto
          </p>
        </div>
        <div class="combination">
          <p>{{getTrad(pfp.name)}}</p>
          <p>
            <b-icon-arrow90deg-down rotate="-90" shift-v="4" />Nome piatto 2
          </p>
        </div>-->
      </div>

      <!-- <button @click="hide()">Chiudi</button> -->
    </div>
  </div>
</template>

<script>
import api from "@/helpers/api";
import PfpPrice from "@/components/foodservicemenutable/PfpPrice";
import DonutChart from "@/components/charts/DonutChart";
export default {
  name: "PfpInfoPage",
  components: {
    PfpPrice,
    DonutChart
  },
  data() {
    return {
      modifiers: [],
      suggestedBeverage: null,
      dietary: null,
      nutritionalValues: null,
      kcalDaily: 0,
      carbDaily: 0,
      fatDaily: 0,
      protDaily: 0,
      gen_m: require("@/assets/gen_m.png"),
      gen_f: require("@/assets/gen_f.png"),
      gen_m_active: require("@/assets/gen_m_active.png"),
      gen_f_active: require("@/assets/gen_f_active.png"),
      adaptFor: {
        adaptForEquilibratedDinnerCombinedWith: {
          male: "adaptForMaleEquilibratedDinnerCombinedWith",
          female: "adaptForFemaleEquilibratedDinnerCombinedWith"
        },
        adaptForEquilibratedLunchCombinedWith: {
          male: "adaptForMaleEquilibratedLunchCombinedWith",
          female: "adaptForFemaleEquilibratedLunchCombinedWith"
        },
        adaptForHypocaloricDinnerCombinedWith: {
          male: "adaptForMaleHypocaloricDinnerCombinedWith",
          female: "adaptForFemaleHypocaloricDinnerCombinedWith"
        },
        adaptForHypocaloricLunchCombinedWith: {
          male: "adaptForMaleHypocaloricLunchCombinedWith",
          female: "adaptForFemaleHypocaloricLunchCombinedWith"
        }
      }
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
    },
    gender() {
      return this.$store.getters["userModule/gender"];
    },
    showNutritionalValues() {
      var nutritionalValues = this.nutritionalValues;
      return (
        nutritionalValues &&
        ((nutritionalValues.energyKcal && nutritionalValues.energyKcal > 0) ||
          (nutritionalValues.carbohydrate && nutritionalValues.carbohydrate > 0) ||
          (nutritionalValues.fat && nutritionalValues.fat > 0) ||
          (nutritionalValues.proteins && nutritionalValues.proteins > 0))
      );
    }
  },
  watch: {
    gender() {
      this.setNutritionalDailyLimits();
      this.loadDietary();
    }
  },
  mounted() {
    this.loadModifiers();
    this.loadSuggestedBeverage();
    this.loadDietary();
    this.loadNutritionalValues();
  },
  methods: {
    calcDailyPercent(val, limit) {
      return (val * 100) / limit;
    },
    loadDietary() {
      this.axios
        .get(api.GET_PFP_DIETARY.replace("{id}", this.pfp.id))
        .then(response => {
          if (response.data) {
            var dietary = {};
            /* for (let key in response.data) {
               let val = response.data[key];
              if (Array.isArray(val) && val.length && key !== "name") {
               dietary[key] = val;
              }
            }  */
            for (let key in this.adaptFor) {
              let gender = this.gender ? "female" : "male";
              let genderKey = this.adaptFor[key][gender];
              let val = response.data[genderKey];
              if (val.length) {
                if (val.length) dietary[genderKey] = val;
              } else {
                val = response.data[key];
                if (val.length) dietary[key] = val;
              }
            }
            this.dietary = dietary;
            // console.log(JSON.stringify(this.dietary));
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    loadNutritionalValues() {
      // load nutritional daily limits
      this.setNutritionalDailyLimits();
      console.log(this.carbDaily);

      this.axios
        .get(api.GET_PFP_NUTRITIONAL_VALUES.replace("{id}", this.pfp.id))
        .then(response => {
          if (response.data) {
            var nutritionalValues = response.data;
            if (
              (nutritionalValues.energyKcal ||
                nutritionalValues.energyKcal == 0) &&
              (nutritionalValues.carbohydrate ||
                nutritionalValues.carbohydrate == 0) &&
              (nutritionalValues.fat || nutritionalValues.fat == 0) &&
              (nutritionalValues.proteins || nutritionalValues.proteins == 0)
            ) {
              this.nutritionalValues = nutritionalValues;
            }

            // console.log(JSON.stringify(this.dietary));
          }
        })
        .catch(error => {
          console.log(error);
        });
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
  background-color: #f2f2f2;
  border-radius: 30px;
  color: #4d4d4d;
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

.nut-val-box {
  margin-top: 20px;
  height: 350px;
}

.nut-val-box > label > span {
  font-size: 13px;
  font-weight: normal;
  margin-left: 5px;
  color: #808080;
}

.nut-val-box ul {
  list-style-type: none;
  padding-left: 0;
}

.nut-val-box ul li {
  font-size: 16px;
  margin-bottom: 1vh;
}

.nut-val-box ul li > label {
  font-weight: normal;
}

.nut-val-box ul li > span {
  float: right;
  font-size: 14px;
}

.balanced-meal-box > div.combination {
  border: 1px solid var(--info-color);
  margin-top: 5px;
  padding: 5px 5px;
  border-radius: 10px;
  background-color: #e8fafc;
}

.balanced-meal-box p {
  color: #4d4d4d;
  font-size: 13px;
  margin-bottom: 2px;
}

.balanced-meal-box p:first-child {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.balanced-meal-box p:last-child {
  color: #4d4d4d;
  font-size: 15px;
  font-weight: bold;
}

.gender-selector {
  text-align: right;
  margin-bottom: 20px;
  font-size: 13px;
}

.gender-selector > span {
  /* border: 1px solid #ccc; */
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
  height: 30px;
  margin-left: 5px;
  border: 2px solid #ccc;
  padding: 2px 8px;
  border-radius: 5px;
}

.gender-selector img.active {
  border-color: var(--info-color);
}
</style>
