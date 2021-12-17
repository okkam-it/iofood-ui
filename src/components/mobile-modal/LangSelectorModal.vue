<template>
  <mobile-modal v-if="showModal" @hide="hide">
    <template #content>
      <div>
        <ul>
          <li v-for="lang in langs" :key="lang" @click="selectLang(lang)">
            <img :src="require('@/assets/flag/' + lang + '_r2.png')" />
            {{$t('langs.' + lang)}}
          </li>
        </ul>
      </div>
    </template>
  </mobile-modal>
</template>

<script>
import MobileModal from "@/components/mobile-modal/MobileModal";
export default {
  name: "LangSelectorModal",
  components: {
    MobileModal
  },
  data() {
    return {
      showModal: false,
      langs: ["it", "en", "de"]
    };
  },
  methods: {
    show() {
      this.showModal = true;
    },
    hide() {
      if (this.$route.hash && this.$route.hash === "#mobilemodal") {
        this.$router.go(-1);
      }
      this.showModal = false;
    },
    selectLang(locale) {
      if (this.$i18n.locale !== locale) {
        this.$i18n.locale = locale;
        localStorage.setItem("locale", locale);
        /* let routeParams = this.$route.params;
        routeParams.locale = locale;
        this.$router.replace({
          name: this.$route.name,
          params: routeParams
        }); */
      }
      this.hide();

      // this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
ul {
  list-style-type: none;
  padding-left: 0;
  padding: 0 15px;
}

ul li {
  border-bottom: 1px solid #f2f2f2;
  padding: 10px 5px;
}

img {
  height: 30px;
  margin-right: 10px;
}
</style>
