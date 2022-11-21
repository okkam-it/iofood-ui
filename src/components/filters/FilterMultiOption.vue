<template>
  <div
    class="filter-box"
    @click="options.length > maxListItems ? (showMore = true) : null"
  >
    <label>
      {{ title }}
      <!-- <span
        class="selected-badge"
        v-if="selectedFilters && selectedFilters.length > 0"
      >{{selectedFilters.length}}</span>-->
    </label>
    <label class="subtitle" v-if="subtitle">{{ subtitle }}</label>
    <template v-if="options.length">
      <div v-if="options.length <= maxListItems">
        <ul>
          <li
            v-for="option in options.slice(0, maxListItems)"
            :key="option.id || option"
          >
            <template v-if="option.id">
              <span
                :class="{ active: isActive(option) }"
                @click="toggleArrayItem(option)"
                >{{ getOptionName(option.name) }}</span
              >
            </template>
            <template v-else>
              <span
                :class="{ active: selectedFilters.includes(option) }"
                @click="toggleArrayItem(option)"
                >{{ $t("filters." + option) }}</span
              >
            </template>
          </li>
        </ul>

        <!-- <p
        class="expand-collapse-button"
        @click="showMore = true"
        v-if="options.length > maxListItems"
      >
        Mostra di più
        <b-icon-caret-down-fill />
      </p>-->
      </div>
      <template v-else>
        <ul v-if="selectedFilters.length">
          <li v-for="option in selectedFilters" :key="option.id || option">
            <span
              :class="{ active: selectedFilters.includes(option) }"
              @click.stop="toggleArrayItem(option)"
              >{{ getSelectedFilterName(option) }}</span
            >
          </li>
          <!-- <li v-for="option in selectedFilters" :key="option.id || option">
          <template v-if="option.id">
            <span
              :class="{ active : selectedFilters.find(x => x.id ? x.id === option.id : x === option.id)}"
              @click.stop="toggleArrayItem(option, selectedFilters)"
            >{{getOptionName(option.name)}}</span>
          </template>
          <template v-else>
            <span
              :class="{ active : selectedFilters.includes(option)}"
              @click.stop="toggleArrayItem(option, selectedFilters)"
            >{{$t("filters." + option)}}</span>
          </template>
        </li>-->
        </ul>
        <div class="show-more-icon">
          <b-icon-chevron-right shift-v="-2" />
        </div>
      </template>

      <template v-if="options.length > maxListItems">
        <mobile-modal
          v-if="showMore"
          @hide="showMore = false"
          showclosebuttontop
        >
          <template #title>
            {{ title }}
            <!-- <div class="close-modal" @click="showMore = false">
            <b-icon-x scale="2.2" />
          </div> -->
            <!-- <div v-if="options.length > 10">
              <div class="search-input-box">
                <input v-model="searchString" type="text" placeholder="Cerca.." />
              </div>
          </div>-->
          </template>
          <template #content>
            <div>
              <ul>
                <template v-for="option in filteredOptions">
                  <li
                    :key="option.id || option"
                    v-if="checkFilterIsAvailable(option)"
                  >
                    <template v-if="option.id">
                      <span
                        :class="{ active: isActive(option) }"
                        @click="toggleArrayItem(option)"
                        >{{ getOptionName(option.name) }}</span
                      >
                    </template>
                    <template v-else>
                      <span
                        :class="{ active: selectedFilters.includes(option) }"
                        @click="toggleArrayItem(option)"
                        >{{ $t("filters." + option) }}</span
                      >
                      <!-- <template v-if="option === 'balanced'">
                    <span class="gender-selector">
                      <b-icon-person-fill class="border rounded p-1 active" />
                      <b-icon-person-fill class="border rounded p-1" />
                    </span>
                  </template>-->
                    </template>
                  </li>
                </template>
              </ul>
            </div>
          </template>
        </mobile-modal>
      </template>
    </template>
  </div>
</template>

<script>
import MobileModal from "@/components/mobile-modal/MobileModal";
export default {
  name: "FilterMultiOption",
  components: {
    MobileModal,
  },
  data() {
    return {
      maxListItems: 3,
      showMore: false,
      searchString: "",
    };
  },
  props: {
    options: {
      type: Array,
    },
    selectedFilters: {
      type: Array,
    },
    title: {
      type: String,
    },
    subtitle: {
      type: String,
    },
    filtersAvailable: {
      type: Array,
    },
  },
  computed: {
    filteredOptions() {
      if (this.searchString.length) {
        return this.options.filter((val) =>
          val.name
            ? val.name.includes(this.searchString)
            : val.includes(this.searchString)
        );
      }
      return this.options;
    },
  },
  methods: {
    checkFilterIsAvailable(option) {
      if (!this.filtersAvailable) {
        return true;
      }
      if (option.id) {
        return this.filtersAvailable.includes(option.id);
      } else {
        return this.filtersAvailable.includes(option);
      }
    },
    getOptionName(name) {
      if (typeof name === "string" || name instanceof String) {
        return name;
      }
      return this.getTrad(name);
    },
    isNumeric(val) {
      return /^-?\d+$/.test(val);
    },
    getSelectedFilterName(option) {
      if (this.isNumeric(option)) {
        var opt = this.options.find((x) => option === x.id);
        if (!opt) {
          return this.$t("filters." + opt);
        }
        if (typeof opt === "string" || opt instanceof String) {
          return this.$t("filters." + opt);
        }
        if (Array.isArray(opt.name)) {
          return this.getTrad(opt.name);
        }
        return opt.name;
      } else {
        return this.$t("filters." + option);
      }
    },
    filterElements(filtered, full) {
      if (filtered && filtered.length > 0 && filtered.length < full.length) {
        return full;
      }
      var max = full.length;
      return full.slice(0, this.maxListItems <= max ? this.maxListItems : max);
    },
    isActive(option) {
      var id = option.code || option.id || option;
      return this.selectedFilters.find((x) => (x.id ? x.id === id : x === id));
    },
    toggleArrayItem(data) {
      var id = data.code || data.id || data;
      var index = this.selectedFilters.findIndex((x) => x === id);
      if (index > -1) {
        this.selectedFilters.splice(index, 1);
      } else {
        if (data.code) {
          this.selectedFilters.push(data.code);
        } else if (data.id) {
          this.selectedFilters.push(data.id);
        } else {
          this.selectedFilters.push(data);
        }
      }
    },
  },
};
</script>

<style scoped>
.filter-box {
  padding: 1.8vh 5vw;
  border-bottom: 1px solid #e6e6e6;
  /* padding-bottom: 2vh; */
  position: relative;
}

.filter-box.disabled {
  opacity: 0.4;
  pointer-events: none;
}

.filter-box label {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 0;
}

.filter-box label.subtitle {
  display: block;
  font-weight: normal;
  font-size: 12px;
  color: rgba(24, 24, 24, 0.5);
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

.show-more-icon {
  /* float: right;
  margin-top: -4px; */
  position: absolute;
  top: 0.9vh;
  right: 5vw;
}
</style>
