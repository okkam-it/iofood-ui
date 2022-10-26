import i18n from "@/locales/i18n";
export default {
  methods: {
    getTrad(data) {
      /* var mainLang = this.$store.state.fs.foodService
        ? this.$store.state.fs.foodService.preferredLanguage
        : "it"; */
      var mainLang = i18n.locale || process.env.VUE_APP_I18N_FALLBACK_LOCALE;
      var trad = data.find(x => x.language === mainLang);
      if (trad) {
        return trad.value;
      }
      return data[0] ? data[0].value : "";
    },
    setNutritionalDailyLimits() {
      this.kcalDaily = this.gender === 0 ? 2250 : 1800;
      this.carbDaily = this.gender === 0 ? 300 : 250;
      this.fatDaily = this.gender === 0 ? 70 : 55;
      this.protDaily = this.gender === 0 ? 80 : 68;
    },
    getPriceRangeIcon(range) {
      if (range ===  1) {
        return "€";
      } else if (range === 2) {
        return "€€";
      } else if (range === 3){
        return "€€€";
      }
      return "";
    }
  }
};
