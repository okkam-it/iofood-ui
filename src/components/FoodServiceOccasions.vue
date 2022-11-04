<template>
  <span>
    <template v-for="occasion of occasions">
      <span v-if="validOccasions.includes(occasion)" :key="occasion + '_icon'">
        <img
          class="occasion-icon"
          :src="require('@/assets/occasions_icons/' + occasion + '.png')"
        /> </span
    ></template>
  </span>
</template>

<script>
export default {
  name: "FoodServiceOccasions",
  components: {},
  data() {
    return {
      validOccasions: [
        "COUPLE_OUTING",
        "GROUP_OUTING",
        "BUSINESS_MEETING",
        "CORPORATE_EVENT",
        "CEREMONIES",
        "BIRTHDAY",
        "FAMILY",
        "FAMILY_WITH_KIDS",
        "STUDENTS",
      ],
    };
  },
  props: {
    occasions: {
      type: Array,
    },
  },
  mounted() {},
  methods: {},
};
</script>

<style scoped>
.occasion-icon {
  margin: 0 4px;
  opacity: 0.5 !important;
  height: 20px !important;
  object-fit: contain;
}
</style>
