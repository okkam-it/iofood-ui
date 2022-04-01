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
          :value="searchString"
          @input="search"
          type="text"
          placeholder="Pesce, milanese, nome ristorante"
        />
        <!-- <input
          ref="searchinput"
          v-model="searchString"
          type="text"
          @input="search()"
          placeholder="Cerca piatti, ingredienti, ristoranti.."
        />-->
      </div>
      <hr />
      <div class="content">
        <template v-if="searchString.length">
          <ul class="results-box">
            <li v-for="(res, k ) in results" :key="k" @click="showResult(res)">
              <b-img v-if="res.id" :src="require('@/assets/food_icons/restaurant.png')" />
              {{res.name}}
            </li>
            <li @click="showResult(searchString)">
              <b-icon-search />Cerca risultati per
              <strong>"{{searchString}}"</strong>
            </li>
          </ul>
        </template>
        <template v-else>
          <p class="section-title">Suggerimenti</p>
          <div class="tips-content">
            <div v-for="tip in tips" :key="tip.name">
              <div @click="showResult(tip)">
                <b-icon-search />
                {{tip.name}}
              </div>
            </div>
          </div>
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
      tips: [
        { name: "Pesce" },
        { name: "Pizza" },
        { name: "Braciola" },
        { name: "Braciola di maiale" },
        { name: "Fiorentina" },
        { name: "Tagliata" },
        { name: "Bistecca" }
      ],
      results: [],
      items: [
        { name: "Braciola" },
        { name: "Braciola di maiale" },
        { name: "Pesce" },
        { name: "Pizza" },
        { name: "Fiorentina" },
        { name: "Tagliata" },
        { name: "Bistecca" },
        { name: "Ristorante La Braciera", id: 12 },
        { name: "Ristorante Pizzeria Alla Torre", id: 3 },
        { name: "Altamarea Enoteca Bistrot", id: 4 },
        { name: "Bar Ristorantino Tecla alle Gru", id: 5 },
        { name: "Chiosco Skipper", id: 6 },
        { name: "Ošterija Na Planinci", id: 10 }
      ]
    };
  },
  methods: {
    isOpen() {
      return this.showPicker;
    },
    showResult(res) {
      if (res.id) {
        this.hide();
        this.$router.push({
          name: "FoodServiceResult",
          params: { id: res.id }
        });
      } else {
        this.addWhat(res.name || res);
      }
    },
    search(e) {
      this.searchString = e.target.value;
      if (this.searchString.length <= 2) {
        this.results = [];
      } else {
        this.results = this.items.filter(val =>
          val.name.toLowerCase().includes(this.searchString.toLowerCase())
        );
      }
    },
    addWhat(suggestion) {
      this.$emit("addWhat", suggestion);
      this.hide();
    },
    show() {
      this.showPicker = true;
      this.searchString = "";
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

ul.results-box {
  list-style-type: none;
  padding-left: 0;
}

.results-box li {
  font-size: 16px;
  border-bottom: 1px solid #e6e6e6;
  padding: 12px 10px;
}

.results-box li img {
  width: 20px;
  margin-right: 10px;
}

.tips-content {
  padding: 2vh 5vw;
  font-size: 16px;
}

.tips-content > div {
  padding: 15px 5vw;
  border-bottom: 1px solid #e6e6e6;
}

.tips-content > div .b-icon {
  margin-right: 10px;
  color: #ccc;
}

.results-box .b-icon {
  margin-right: 10px;
  color: #ccc;
}
</style>
