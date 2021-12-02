<template>
  <div class="filter-box">
    <label>
      {{title}}
      <span
        class="selected-badge"
        v-if="selectedFilters && selectedFilters.length > 0"
      >{{selectedFilters.length}}</span>
    </label>
    <div>
      <ul>
        <li v-for="option in options.slice(0, this.maxListItems)" :key="option.id || option">
          <template v-if="option.id">
            <span
              :class="{ active : selectedFilters.find(x => x.id === option.id)}"
              @click="toggleArrayItem(option, selectedFilters)"
            >{{getOptionName(option.name)}}</span>
          </template>
          <template v-else>
            <span
              :class="{ active : selectedFilters.includes(option)}"
              @click="toggleArrayItem(option, selectedFilters)"
            >{{option}}</span>
          </template>
        </li>
      </ul>
      <p
        class="expand-collapse-button"
        @click="showMore = true"
        v-if="options.length > maxListItems"
      >
        Mostra di più
        <b-icon-caret-down-fill />
      </p>
      <template v-if="options.length > maxListItems">
        <mobile-modal v-if="showMore" @hide="showMore = false">
          <template #title>
            {{title}}
            <div class="close-modal" @click="showMore = false">
              <b-icon-x scale="2.2" />
            </div>
            <!-- <div v-if="options.length > 10">
              <div class="search-input-box">
                <input v-model="searchString" type="text" placeholder="Cerca.." />
              </div>
            </div>-->
          </template>
          <template #content>
            <div>
              <ul>
                <li v-for="option in filteredOptions" :key="option.id || option">
                  <template v-if="option.id">
                    <span
                      :class="{ active : selectedFilters.find(x => x.id === option.id)}"
                      @click="toggleArrayItem(option, selectedFilters)"
                    >{{getOptionName(option.name)}}</span>
                  </template>
                  <template v-else>
                    <span
                      :class="{ active : selectedFilters.includes(option)}"
                      @click="toggleArrayItem(option, selectedFilters)"
                    >{{option}}</span>
                  </template>
                </li>
              </ul>
            </div>
          </template>
        </mobile-modal>
      </template>
    </div>
  </div>
</template>

<script>
import MobileModal from "@/components/mobile-modal/MobileModal";
export default {
  name: "FilterMultiOption",
  components: {
    MobileModal
  },
  data() {
    return {
      maxListItems: 3,
      showMore: false,
      searchString: ""
    };
  },
  props: {
    options: {
      type: Array
    },
    selectedFilters: {
      type: Array
    },
    title: {
      type: String
    }
  },
  computed: {
    filteredOptions() {
      if (this.searchString.length) {
        return this.options.filter(val =>
          val.name
            ? val.name.includes(this.searchString)
            : val.includes(this.searchString)
        );
      }
      return this.options;
    }
  },
  methods: {
    getOptionName(name) {
      if (typeof name === "string" || name instanceof String) {
        return name;
      }
      return this.getTrad(name);
    },
    filterElements(filtered, full) {
      if (filtered && filtered.length > 0 && filtered.length < full.length) {
        return full;
      }
      var max = full.length;
      return full.slice(0, this.maxListItems <= max ? this.maxListItems : max);
    },
    toggleArrayItem(data, array) {
      var index = array.findIndex(x => (x.id ? x.id === data.id : x === data));
      if (index > -1) {
        array.splice(index, 1);
      } else {
        array.push(data);
      }
    }
  }
};
</script>

<style scoped>
.filter-box {
  padding: 1vh 5vw;
  border-bottom: 1px solid #e6e6e6;
  padding-bottom: 2vh;
}

.filter-box label {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 8px;
}

.filter-box > div {
  color: #4d4d4d;
  font-size: 16px;
  padding-top: 5px;
  min-height: 40px;
  overflow: hidden;
}
ul {
  padding-left: 0;
  list-style-type: none;
}

ul li {
  width: 100%;
  padding: 0.5vh 0;
}

ul li input {
  display: inline-block;
  width: 20px;
  margin-right: 15px;
}

.filter-box span {
  border: 2px solid #ccc;
  border-radius: 30px;
  padding: 6px 15px;
  margin-right: 5px;
  font-size: 14px;
  display: inline-block;
  margin-bottom: 3px;
}

.filter-box span.active {
  background-color: var(--light-primary-color);
  border-color: var(--primary-color);
}

.filter-box > div.range {
}

.filter-box > div.range input {
  display: inline-block;
  width: calc(100% - 120px);
  margin-right: 15px;
  vertical-align: middle;
}

.filter-box > div.range span {
  display: inline-block;
  width: 100px;
  vertical-align: middle;
  color: #4d4d4d;
  text-align: center;
}

.filter-box .expand-collapse-button {
  color: #4d4d4d;
  font-weight: bold;
  font-size: 14px;
}

span.selected-badge {
  background-color: #4d4d4d;
  border-color: #4d4d4d;
  margin-left: 10px;
  padding: 6px 15px;
  font-size: 14px;
  color: #fff;
  border-radius: 30px;
  padding: 4px 12px;
  font-size: 12px;
}

.search-input-box {
  margin-top: 10px;
}

.close-modal {
  float: right;
  margin-right: 10px;
}
</style>
