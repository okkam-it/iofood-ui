<template>
  <div>
    <search-what-picker
      ref="searchwhatpicker"
      @addWhat="addWhat"
      :fixed="true"
      @hide="hide()"
    />
  </div>
</template>

<script>
import SearchWhatPicker from "@/components/SearchWhatPicker";
export default {
  name: "Search",
  components: {
    SearchWhatPicker,
  },
  data() {
    return {};
  },
  methods: {
    addWhat(what) {
      var query = {};

      query["what"] = [what.name || what];

      this.$router.push({
        name: "Results",
        query,
      });
    },
    hide() {
      this.$router.go(-1);
    },
  },
  mounted() {},
};
</script>

<style scoped>
</style>
