<template>
  <div v-if="pfp.price || price" class="price-box">
    <!-- <label>Opzioni</label> -->
    <template v-if="pfp.price">{{pfp.price.toFixed(2)}} €</template>
    <template v-else>
      <span
        v-for="alternative in price.alternativePrices"
        :key="alternative.alternativeId"
      >{{alternative.alternativeId}} {{alternative.price}} €</span>
    </template>
  </div>
</template>

<script>
import api from "@/helpers/api";
export default {
  name: "PfpPrice",
  components: {},
  data() {
    return {
      price: null
    };
  },
  props: {
    pfp: {
      type: Object
    }
  },
  mounted() {
    this.loadPrice();
  },
  methods: {
    loadPrice() {
      if (!this.pfp.price) {
        this.axios
          .get(api.GET_PFP_PRICE_MODIFIER.replace("{id}", this.pfp.id))
          .then(response => {
            if (response.data) {
              this.price = response.data;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  }
};
</script>

<style scoped>
.price-box {
  margin-bottom: 3px;
  color: #4d4d4d;
  font-size: 15px;
}

.price-box > span {
  margin-right: 2px;
  font-size: 14px;
}
</style>
