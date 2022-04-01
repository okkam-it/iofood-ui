<template>
  <div class="val-nut-box" v-if="nutritionalValues && nutritionalValues.energyKcal > 0">
    <span>
      {{nutritionalValues.energyKcal.toFixed(0)}}
      <span>Kcal</span>
    </span>
    <span>
      <span>Carb</span>
      <b-icon-reception1 scale="1.2" v-if="carbPercent < 25" />
      <b-icon-reception2 scale="1.2" v-else-if="carbPercent < 50" />
      <b-icon-reception3 scale="1.2" v-else-if="carbPercent < 75" />
      <b-icon-reception4 scale="1.2" v-else />
    </span>
    <span>
      <span>Grassi</span>
      <b-icon-reception1 scale="1.2" v-if="fatPercent < 25" />
      <b-icon-reception2 scale="1.2" v-else-if="fatPercent < 50" />
      <b-icon-reception3 scale="1.2" v-else-if="fatPercent < 75" />
      <b-icon-reception4 scale="1.2" v-else />
    </span>
    <span>
      <span>Prot</span>
      <b-icon-reception1 scale="1.2" v-if="protPercent < 25" />
      <b-icon-reception2 scale="1.2" v-else-if="protPercent < 50" />
      <b-icon-reception3 scale="1.2" v-else-if="protPercent < 75" />
      <b-icon-reception4 scale="1.2" v-else />
    </span>
    <div class="badges">
      <span v-for="badge of badges" :key="badge">{{$t("dietary." + badge)}}</span>
    </div>
  </div>
</template>

<script>
import api from "@/helpers/api";
export default {
  name: "NutritionalValuesPreview",
  components: {},
  data() {
    return {
      badges: [],
      nutritionalValues: null,
      kcalDaily: 0,
      carbDaily: 0,
      fatDaily: 0,
      protDaily: 0,
      badgeToShow: [
        "vegetarian",
        "milkEggVegetarian",
        "milkVegetarian",
        "fishVegetarian",
        "eggVegetarian",
        "vegan",
        "glutenFree",
        "lactoseFree",
        "healthy",
        "lowFats",
        "hypocaloric",
        "integral",
        "sugarFree",
        "healthyForLunch",
        "healthyForDinner"
      ],
      adaptFor: {
        adaptForEquilibratedDinner: {
          male: "adaptForMaleEquilibratedDinner",
          female: "adaptForFemaleEquilibratedDinner"
        },
        adaptForEquilibratedLunch: {
          male: "adaptForMaleEquilibratedLunch",
          female: "adaptForFemaleEquilibratedLunch"
        },
        adaptForHypocaloricDinner: {
          male: "adaptForMaleHypocaloricDinner",
          female: "adaptForFemaleHypocaloricDinner"
        },
        adaptForHypocaloricLunch: {
          male: "adaptForMaleHypocaloricLunch",
          female: "adaptForFemaleHypocaloricLunch"
        }
      }
    };
  },
  props: {
    pfpId: {
      type: String
    },
    gender: {
      type: Number
    }
  },
  watch: {
    gender() {
      this.setNutritionalDailyLimits();
      this.loadDietary();
    }
  },
  computed: {
    carbPercent() {
      return this.calcDailyPercent(
        this.nutritionalValues.carbohydrate,
        this.carbDaily
      );
    },
    fatPercent() {
      return this.calcDailyPercent(this.nutritionalValues.fat, this.fatDaily);
    },
    protPercent() {
      return this.calcDailyPercent(
        this.nutritionalValues.proteins,
        this.protDaily
      );
    }
  },
  methods: {
    calcDailyPercent(val, limit) {
      return (val * 100) / limit;
    },
    loadDietary() {
      this.axios
        .get(api.GET_PFP_DIETARY.replace("{id}", this.pfpId))
        .then(response => {
          if (response.data) {
            var badges = [];
            for (let badge of this.badgeToShow) {
              let val = response.data[badge];
              if (val) {
                badges.push(badge);
              }
            }

            for (let key in this.adaptFor) {
              let gender = this.gender ? "female" : "male";
              let genderKey = this.adaptFor[key][gender];
              let val = response.data[genderKey];
              if (!val) {
                val = response.data[key];
                if (val) badges.push(key);
              } else {
                if (val) badges.push(genderKey);
              }
            }

            this.badges = badges;
            // console.log(JSON.stringify(this.dietary));
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    loadNutritionalValues() {
      this.setNutritionalDailyLimits();
      this.axios
        .get(api.GET_PFP_NUTRITIONAL_VALUES.replace("{id}", this.pfpId))
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
    }
  },
  mounted() {
    this.loadDietary();
    this.loadNutritionalValues();
  }
};
</script>

<style scoped>
.val-nut-box {
  font-size: 15px;
  text-align: left;
  margin-top: -1vh;
  margin-bottom: 2vh;
  opacity: 0.7;
}

/* .val-nut-box > span {
  margin-right: 5px;
  border-radius: 5px;
  padding: 2px 3px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19);
}
.val-nut-box > span > span {
  margin-right: 5px;
}

.val-nut-box > span > .b-icon {
  color: var(--info-color);
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
} */

/* .val-nut-box > div {
  margin: 0 5px;
  width: calc(25% - 10px);
  display: inline-block;
  text-align: center;
}

.val-nut-box > div .progress {
  height: 2px;
}

.val-nut-box > div label {
  
}

.val-nut-box > div span {  
  font-weight: normal;
  font-size: 12px;
} */

.val-nut-box > span {
  background-color: #fff;
  /* border: 1px solid #ccc;
  border-radius: 30px; */
  padding: 2px 5px;
  font-size: 13px;
  margin-right: 3px;
  opacity: 0.8;
}

.val-nut-box > span:first-child {
  font-weight: bold;
  opacity: 1;
  font-size: 14px;
  /* border: 1px solid var(--info-color);
  border-radius: 30px;
  background-color: var(--info-color);
  color: #fff; */
  color: var(--info-color);
}

.val-nut-box > span > span {
  margin-right: 5px;
}
.val-nut-box > span:first-child > span {
  margin-left: 2px;
  margin-right: 0;
}

.val-nut-box > span > .b-icon {
  color: #808080;
}

.badges {
  overflow: auto;
  -ms-overflow-style: none; /* for Internet Explorer, Edge */
  scrollbar-width: none; /* for Firefox */
}

.badges::-webkit-scrollbar {
  display: none; /* for Chrome, Safari, and Opera */
}

.badges > span {
  font-size: 13px;
  background-color: var(--info-color);
  margin: 0 1px;
  padding: 3px 5px;
  border-radius: 5px;
  color: #fff;
  opacity: 0.7;
  white-space: nowrap;
}
</style>