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
    }
  }
};
