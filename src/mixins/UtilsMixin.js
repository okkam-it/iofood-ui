export default {
  methods: {
    getTrad(data) {
      /* var mainLang = this.$store.state.fs.foodService
        ? this.$store.state.fs.foodService.preferredLanguage
        : "it"; */
      var mainLang = "it";
      var trad = data.find(x => x.language === mainLang);
      if (trad) {
        return trad.value;
      }
      return data[0] ? data[0].value : "";
    }
  }
};
