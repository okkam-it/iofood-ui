<template>
  <div>
    <div class="header"><b-icon-x scale="2.2" @click="hide()" />Filtra</div>
    <div class="content">
      <filter-base-option
        :selectedFilter.sync="filters.openNow"
        :option="'openNow'"
        title="Orario"
      />

      <filter-base-option
        :selectedFilter.sync="filters.takeaway"
        :option="'takeaway'"
        title="Asporto/Domicilio"
      />

      <filter-base-option
        :selectedFilter.sync="filters.delivery"
        :option="'delivery'"
      />

      <filter-multi-option
        :selectedFilters.sync="filters.price"
        :options="prices"
        title="Prezzo"
        subtitle="Si riferisce al prezzo medio dei piatti"
      />

      <filter-multi-option
        :selectedFilters.sync="filters.cuisines"
        :options="cuisines"
        :filtersAvailable="filtersAvailable.cuisines"
        title="Tipo di cucina"
        :class="{
          disabled:
            filtersAvailable.cuisines === undefined ||
            !filtersAvailable.cuisines.length,
        }"
      />

      <filter-multi-option
        :selectedFilters.sync="filters.moments"
        :options="situations"
        :filtersAvailable="filtersAvailable.moments"
        title="Momenti della giornata"
        :class="{
          disabled:
            filtersAvailable.moments === undefined ||
            !filtersAvailable.moments.length,
        }"
      />

      <filter-multi-option
        :selectedFilters.sync="filters.allergens"
        :options="allergens"
        title="Allergeni"
      />

      <filter-multi-option
        :selectedFilters.sync="filters.foodRestrictions"
        :filtersAvailable="filtersAvailable.foodRestrictions"
        :options="foodRestrictions"
        title="Scelte alimentari"
        :class="{
          disabled:
            filtersAvailable.foodRestrictions === undefined ||
            !filtersAvailable.foodRestrictions.length,
        }"
      />

      <filter-multi-option
        :selectedFilters.sync="filters.nutritionalAspects"
        :filtersAvailable="filtersAvailable.nutritionalAspects"
        :options="nutritionalFacts"
        title="Aspetti nutrizionali"
        :class="{
          disabled:
            filtersAvailable.nutritionalAspects === undefined ||
            !filtersAvailable.nutritionalAspects.length,
        }"
      />

      <filter-base-option
        :selectedFilter.sync="filters.variety"
        :option="'offerVariety'"
        title="Varietà dell'offerta"
      />

      <filter-multi-option
        :selectedFilters.sync="filters.facilities"
        :filtersAvailable="filtersAvailable.facilities"
        :options="facilities"
        title="Servizi"
        :class="{
          disabled:
            filtersAvailable.facilities === undefined ||
            !filtersAvailable.facilities.length,
        }"
      />

      <filter-slider-option
        :selectedFilter.sync="filters.geoDistance"
        title="Distance"
        min="1000"
        max="20000"
        step="1000"
      />

      <filter-multi-option
        :selectedFilters.sync="filters.type"
        :filtersAvailable="filtersAvailable.foodServiceTypes"
        :options="foodServiceTypes"
        title="Tipo di locale"
        :class="{
          disabled:
            filtersAvailable.foodServiceTypes === undefined ||
            !filtersAvailable.foodServiceTypes.length,
        }"
      />

      <filter-multi-option
        :selectedFilters.sync="filters.digitalPayments"
        :filtersAvailable="filtersAvailable.digitalPayments"
        :options="payments"
        title="Pagamenti digitali"
        :class="{
          disabled:
            filtersAvailable.digitalPayments === undefined ||
            !filtersAvailable.digitalPayments.length,
        }"
      />

      <filter-multi-option
        :selectedFilters.sync="filters.mealVouchers"
        :filtersAvailable="filtersAvailable.mealVouchers"
        :options="mealVouchers"
        title="Buoni pasto"
        :class="{
          disabled:
            filtersAvailable.mealVouchers === undefined ||
            !filtersAvailable.mealVouchers.length,
        }"
      />

      <filter-multi-option
        :selectedFilters.sync="filters.occasions"
        :filtersAvailable="filtersAvailable.occasions"
        :options="contexts"
        title="Occasione"
        :class="{
          disabled:
            filtersAvailable.occasions === undefined ||
            !filtersAvailable.occasions.length,
        }"
      />
    </div>
    <div class="footer">
      <div>
        <button class="transparent" @click="resetFilters()">
          Cancella filtri <span v-if="filtersLen > 0">({{ filtersLen }})</span>
        </button>
      </div>
      <div>
        <button class="primary" @click="showResults()">Mostra risultati</button>
      </div>
    </div>
  </div>
</template>

<script>
import FilterMultiOption from "@/components/filters/FilterMultiOption";
import FilterBaseOption from "@/components/filters/FilterBaseOption";
import FilterSliderOption from "@/components/filters/FilterSliderOption";
import api from "@/helpers/api";
export default {
  name: "FiltersContent",
  components: {
    FilterMultiOption,
    FilterBaseOption,
    FilterSliderOption,
  },
  data() {
    return {
      contexts: [],
      facilities: [],
      cuisines: [],
      payments: [],
      prices: ["p1", "p2", "p3"],
      orderBy: ["DISTANCE", "RELEVANCE", "PRICE"],
      foodServiceTypes: [],
      mealVouchers: [],
      foodRestrictions: [],
      nutritionalFacts: [],
      pois: [],
      situations: [],
      allergens: [],
      maxListItems: 3,
      filters: JSON.parse(JSON.stringify(this.selectedFilters)),
      selectedFilter: null,
    };
  },
  props: {
    selectedFilters: {
      type: Object,
    },
    filtersAvailable: {
      type: Object,
    },
  },
  computed: {
    filtersLen() {
      let len = 0;
      for (const [key, value] of Object.entries(this.filters)) {
        if (!["orderby", "relevance", "geoDistance"].includes(key)) {
          if (value && Array.isArray(value)) {
            len += value.length;
          } else if (value) {
            len++;
          }
        }
      }
      return len;
    },
  },
  watch: {
    selectedFilters: {
      handler: function () {
        this.filters = JSON.parse(JSON.stringify(this.selectedFilters));
      },
      deep: true,
    },
    filters: {
      handler: function () {
        this.$emit("temporaryFiltersChanged", this.filters);
      },
      deep: true,
    },
  },
  mounted() {
    this.loadCuisines();
    this.loadPayments();
    this.loadFoodServiceTypes();
    this.loadMealVouchers();
    this.loadContexts();
    this.loadServices();
    this.loadFoodRestrictions();
    this.loadAllergens();
    this.loadNutritionalFacts();
    this.loadSituations();
  },
  methods: {
    loadSituations() {
      this.axios
        .get(api.GET_FILTERS_SITUATION)
        .then((response) => {
          this.situations = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    loadNutritionalFacts() {
      this.axios
        .get(api.GET_FILTERS_NUTRITIONAL_ASPECTS)
        .then((response) => {
          this.nutritionalFacts = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    showResults() {
      this.$nextTick(() => {
        this.$emit("onChangeSelectedFilters", this.filters);
      });
    },
    resetFilters() {
      this.$emit("resetFilters");
    },
    toggleArrayItem(data, array) {
      var index = array.findIndex((x) =>
        x.id ? x.id === data.id : x === data
      );
      if (index > -1) {
        array.splice(index, 1);
      } else {
        array.push(data);
      }
    },
    hide() {
      this.$emit("hide");
    },
    loadAllergens() {
      this.axios
        .get(api.GET_FILTERS_ALLERGENS)
        .then((response) => {
          this.allergens = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    loadContexts() {
      this.axios
        .get(api.GET_FILTERS_OCCASIONS)
        .then((response) => {
          this.contexts = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    loadFoodRestrictions() {
      this.axios
        .get(api.GET_FILTERS_FOOD_RESTRICTIONS)
        .then((response) => {
          this.foodRestrictions = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    loadServices() {
      this.axios
        .get(api.GET_FILTERS_FACILITIES)
        .then((response) => {
          this.facilities = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    loadCuisines() {
      this.axios
        .get(api.GET_FILTERS_CUISINES)
        .then((response) => {
          this.cuisines = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    loadMealVouchers() {
      this.axios
        .get(api.GET_FILTERS_MEAL_VOUCHERS)
        .then((response) => {
          this.mealVouchers = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    loadFoodServiceTypes() {
      this.axios
        .get(api.GET_FILTERS_FS_TYPES)
        .then((response) => {
          this.foodServiceTypes = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    loadPayments() {
      this.axios
        .get(api.GET_FILTERS_PAYMENTS)
        .then((response) => {
          this.payments = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
.header {
  padding: 15px;
  font-weight: bold;
  position: sticky;
  top: 0;
  width: 100%;
  background-color: #fff;
  border-bottom: 1px solid #ccc;
  z-index: 5;
}

.header .b-icon {
  margin-right: 8vw;
  margin-left: 5px;
}

.content {
  padding-bottom: 123px;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 10;
  background-color: #fff;
  border-top: 1px solid #ccc;
  display: table;
  padding: 1vh 0;
}

.footer > div {
  display: table-cell;
  width: 50%;
  text-align: center;
}

.footer button.primary {
  background-color: var(--primary-color);
  font-weight: bold;
  font-size: 14px;
  border-radius: 40px;
  padding: 7px 15px;
}

.footer button.transparent {
  color: var(--primary-color);
  font-weight: bold;
  font-size: 14px;
}
</style>
