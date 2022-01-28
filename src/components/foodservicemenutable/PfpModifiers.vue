<template>
  <div v-if="modifiers && modifiers.length">
    <!-- <label>Opzioni</label> -->
    <div class="modifiers-box">
      <span v-for="modifier in modifiers" :key="modifier.id">
        <b-icon-ui-checks />
        {{getTrad(modifier.name)}}
      </span>
    </div>
  </div>
</template>

<script>
import api from "@/helpers/api";
export default {
  name: "PfpModifiers",
  components: {},
  data() {
    return {
      modifiers: null
    };
  },
  props: {
    pfp: {
      type: Object
    }
  },
  mounted() {
    this.loadModifiers();
  },
  methods: {
    loadModifiers() {
      this.axios
        .get(api.GET_PFP_MODIFIERS.replace("{id}", this.pfp.id))
        .then(response => {
          this.modifiers = response.data.filter(x => x.classification !== "PRICE");
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style scoped>
.modifiers-box {
  margin-top: 5px;
}

.modifiers-box > span {
  background-color: #e6e6e6;
  border-radius: 15px;
  padding: 5px 15px;
  margin-right: 2px;
  font-size: 14px;
}

.modifiers-box > span .b-icon {
  margin-right: 2px;
  color: #808080;
}
</style>
