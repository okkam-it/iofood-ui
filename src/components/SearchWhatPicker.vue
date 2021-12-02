<template>
  <div class="location-picker" v-if="showPicker">
    <div class="header">
      <div class="back-button" @click="hide()">
        <b-icon-chevron-left scale="1.3" shift-h="-5" />
      </div>
      <div class="search-input-box">
        <b-icon-search scale=".8" />
        <input
          ref="searchinput"
          v-model="searchString"
          type="text"
          placeholder="Cerca piatti, ingredienti.."
        />
      </div>
      <hr />
      <div class="content">
        <template v-if="searchString.length"></template>
        <template v-else>
          <p class="section-title mt-4">Suggerimenti</p>
          <div
            class="item"
            v-for="suggestion in suggestions"
            :key="suggestion"
            @click="addWhat(suggestion)"
          >{{suggestion}}</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchWhatPicker",
  components: {},
  data() {
    return {
      showPicker: false,
      searchString: "",
      suggestions: ["pizza", "sushi"]
    };
  },
  methods: {
    addWhat(suggestion) {
      this.$emit("addWhat", suggestion);
      this.hide();
    },
    show() {
      this.showPicker = true;
      setTimeout(() => {
        this.$refs.searchinput.focus();
      }, 100);
    },
    hide() {
      this.showPicker = false;
    }
  }
};
</script>

<style scoped>
.location-picker {
  position: fixed;
  height: 100%;
  width: 100%;
  z-index: 1000000;
  top: 0;
  background-color: #fff;
}

.header {
  padding: 10px 10px;
  font-size: 15px;
}

.header p {
  margin-bottom: 10px;
  padding-left: 5px;
  font-weight: bold;
}

.back-button {
  display: inline-block;
  width: 40px;
  text-align: center;
}

.content {
  padding: 10px 10px;
}

.search-input-box {
  width: calc(100% - 40px);
  border: none;
  position: relative;
  display: inline-block;
}

.search-input-box > input {
  padding: 15px 10px;
  padding-left: 50px;
}

.search-input-box > .b-icon {
  position: absolute;
  top: 13px;
  left: 15px;
  width: 24px;
  height: 24px;
  color: #808080;
}

.section-title {
  font-size: 15px;
  color: #808080;
  margin-bottom: 4px;
}

.item {
  padding: 10px 10px;
  font-weight: bold;
}

.item > .b-icon {
  margin-right: 15px;
}
</style>
