<template>
  <div>
    <div class="header">
      <b-icon-x scale="2.2" @click="hide()" />Filtra
    </div>
    <div class="content">
      <!-- HIDDEN -->
      <!-- <filter-single-option
        :selectedFilter.sync="filters.orderby"
        :options="orderBy"
        title="Ordina per"
      />-->
      <!-- END HIDDEN -->

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
      <filter-base-option :selectedFilter.sync="filters.delivery" :option="'delivery'" />

      <!-- <filter-multi-option
        :selectedFilters.sync="filters.price"
        :options="prices"
        title="Prezzo"
      />-->

      <filter-single-option
        :selectedFilter.sync="filters.priceRange"
        :options="prices"
        title="Prezzo"
        optional
      />

      <!-- <filter-multi-option
        :selectedFilters.sync="filters.price"
        :options="prices"
        title="Prezzo"
      />-->

      <filter-multi-option
        :selectedFilters.sync="filters.cuisines"
        :options="cuisines"
        title="Tipo di cucina"
      />

      <filter-multi-option
        :selectedFilters.sync="filters.moments"
        :options="situations"
        title="Momenti della giornata"
      />

      <filter-multi-option
        :selectedFilters.sync="filters.allergens"
        :options="allergens"
        title="Allergeni"
      />

      <filter-multi-option
        :selectedFilters.sync="filters.foodRestrictions"
        :options="foodRestrictions"
        title="Scelte alimentari"
      />

      <filter-multi-option
        :selectedFilters.sync="filters.nutritionalAspects"
        :options="nutritionalFacts"
        title="Aspetti nutrizionali"
      />

      <filter-base-option
        :selectedFilter.sync="filters.variety"
        :option="'offerVariety'"
        title="Varietà dell'offerta"
      />

      <filter-multi-option
        :selectedFilters.sync="filters.facilities"
        :options="facilities"
        title="Servizi"
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
        :options="foodServiceTypes"
        title="Tipo di locale"
      />

      <filter-multi-option
        :selectedFilters.sync="filters.digitalPayments"
        :options="payments"
        title="Pagamenti digitali"
      />

      <filter-multi-option
        :selectedFilters.sync="filters.mealVouchers"
        :options="mealVouchers"
        title="Buoni pasto"
      />

      <filter-multi-option
        :selectedFilters.sync="filters.occasions"
        :options="contexts"
        title="Occasione"
      />
    </div>
    <div class="footer">
      <div>
        <button class="transparent" @click="resetFilters()">Cancella filtri</button>
      </div>
      <div>
        <button class="primary" @click="showResults()">Mostra risultati</button>
      </div>
    </div>
  </div>
</template>

<script>
// import MobileModal from "@/components/mobile-modal/MobileModal";
import FilterMultiOption from "@/components/filters/FilterMultiOption";
import FilterBaseOption from "@/components/filters/FilterBaseOption";
import FilterSingleOption from "@/components/filters/FilterSingleOption";
import FilterSliderOption from "@/components/filters/FilterSliderOption";
import api from "@/helpers/api";
export default {
  name: "FiltersContent",
  components: {
    // MobileModal,
    FilterMultiOption,
    FilterBaseOption,
    FilterSingleOption,
    FilterSliderOption
  },
  data() {
    return {
      contexts: [],
      facilities: [],
      cuisines: [],
      payments: [],
      prices: [
        { label: "€", value: "€" },
        { label: "€€", value: "€€" },
        { label: "€€€", value: "€€€" }
      ],
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
      selectedFilter: null
    };
  },
  props: {
    selectedFilters: {
      type: Object
    }
  },
  watch: {
    selectedFilters: {
      handler: function() {
        this.filters = JSON.parse(JSON.stringify(this.selectedFilters));
      },
      deep: true
    }
    /* filters: {
      handler: function() {
        this.$emit("onChangeSelectedFilters", this.filters);
      },
      deep: true
    }, */
    /* cuisines() {
      this.filteredCuisines = this.filterElements(
        this.filteredCuisines,
        this.cuisines
      );
    },
    foodServiceTypes() {
      this.filteredFoodServiceTypes = this.filterElements(
        this.filteredFoodServiceTypes,
        this.foodServiceTypes
      );
    },
    contexts() {
      this.filteredContexts = this.filterElements(
        this.filteredContexts,
        this.contexts
      );
    },
    mealVouchers() {
      this.filteredMealVouchers = this.filterElements(
        this.filteredMealVouchers,
        this.mealVouchers
      );
    },
    services() {
      this.filteredServices = this.filterElements(
        this.filteredServices,
        this.services
      );
    },
    allergens() {
      this.filteredAllergens = this.filterElements(
        this.filteredAllergens,
        this.allergens
      );
    } */
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
    this.loadPois();
    this.loadSituations();
  },
  methods: {
    loadSituations() {
      /* this.axios
        .get("/situations.json")
        .then(response => {
          this.situations = response.data;
          // console.log(JSON.stringify(response.data));
        })
        .catch(error => {
          console.log(error);
        }); */
      this.axios
        .get(api.GET_FILTERS_SITUATION)
        .then(response => {
          this.situations = response.data;
          // console.log(JSON.stringify(response.data));
        })
        .catch(error => {
          console.log(error);
        });
    },
    loadPois() {
      /* this.axios
        .get("/pois.json")
        .then(response => {
          this.pois = response.data;
          // console.log(JSON.stringify(response.data));
        })
        .catch(error => {
          console.log(error);
        }); */
    },
    loadNutritionalFacts() {
      /* this.axios
        .get("/nutritional_facts.json")
        .then(response => {
          this.nutritionalFacts = response.data;
          // console.log(JSON.stringify(response.data));
        })
        .catch(error => {
          console.log(error);
        }); */
      this.axios
        .get(api.GET_FILTERS_NUTRITIONAL_ASPECTS)
        .then(response => {
          this.nutritionalFacts = response.data;
          // console.log(JSON.stringify(response.data));
        })
        .catch(error => {
          console.log(error);
        });
    },
    showResults() {
      this.$emit("onChangeSelectedFilters", this.filters);
      this.hide();
    },
    resetFilters() {
      this.$emit("resetFilters");
    },
    toggleArrayItem(data, array) {
      var index = array.findIndex(x => (x.id ? x.id === data.id : x === data));
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
      /* this.axios
        .get("/allergens.json")
        .then(response => {
          this.allergens = response.data;
          // console.log(JSON.stringify(response.data));
        })
        .catch(error => {
          console.log(error);
        }); */
      this.axios
        .get(api.GET_FILTERS_ALLERGENS)
        .then(response => {
          this.allergens = response.data;
          // console.log(JSON.stringify(response.data));
        })
        .catch(error => {
          console.log(error);
        });
    },
    loadContexts() {
      this.axios
        .get(api.GET_FILTERS_OCCASIONS)
        .then(response => {
          this.contexts = response.data;
          // console.log(JSON.stringify(response.data));
        })
        .catch(error => {
          console.log(error);
        });
    },
    loadFoodRestrictions() {
      this.axios
        .get(api.GET_FILTERS_FOOD_RESTRICTIONS)
        .then(response => {
          this.foodRestrictions = response.data;
          // console.log(JSON.stringify(response.data));
        })
        .catch(error => {
          console.log(error);
        });
    },
    loadServices() {
      this.axios
        .get(api.GET_FILTERS_FACILITIES)
        .then(response => {
          this.facilities = response.data;
          // console.log(JSON.stringify(response.data));
        })
        .catch(error => {
          console.log(error);
        });
    },
    loadCuisines() {
      this.axios
        .get(api.GET_FILTERS_CUISINES)
        .then(response => {
          this.cuisines = response.data;
          // console.log(JSON.stringify(response.data));
        })
        .catch(error => {
          console.log(error);
        });
    },
    loadMealVouchers() {
      this.axios
        .get(api.GET_FILTERS_MEAL_VOUCHERS)
        .then(response => {
          this.mealVouchers = response.data;
          // console.log(JSON.stringify(response.data));
        })
        .catch(error => {
          console.log(error);
        });
    },
    loadFoodServiceTypes() {
      this.axios
        .get(api.GET_FILTERS_FS_TYPES)
        .then(response => {
          this.foodServiceTypes = response.data;
          // console.log(JSON.stringify(response.data));
        })
        .catch(error => {
          console.log(error);
        });
    },
    loadPayments() {
      this.axios
        .get(api.GET_FILTERS_PAYMENTS)
        .then(response => {
          this.payments = response.data;
          // console.log(JSON.stringify(response.data));
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

/* ul li {
  display: table;
  width: 100%;
  padding: 1vh 0;
}

ul li > div:first-child {
  display: table-cell;
  width: calc(100% - 50px);
}

ul li > div:last-child {
  display: table-cell;
  width: 50px;
} */
</style>
