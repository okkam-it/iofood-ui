<template>
  <div class="filter-box">
    <label>{{ title }}</label>
    <div>
      <ul>
        <li
          v-for="option in options"
          :key="option.id || option.label || option"
        >
          <template v-if="option.id">
            <span
              :class="{ active: selectedFilter === option }"
              @click="toggleArrayItem(option)"
              >{{ getOptionName(option.name) }}</span
            >
          </template>
          <template v-if="option.label">
            <span
              :class="{
                active: String(selectedFilter) === String(option.value),
              }"
              @click="toggleArrayItem(String(option.value))"
              >{{ getOptionName(option.label) }}</span
            >
          </template>
          <template v-else>
            <span
              :class="{ active: selectedFilter === option }"
              @click="toggleArrayItem(option)"
              >{{ option }}</span
            >
          </template>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "FilterSingleOption",
  components: {},
  data() {
    return {
      maxListItems: 3,
    };
  },
  props: {
    options: {
      type: Array,
    },
    selectedFilter: {
      type: String,
    },
    title: {
      type: String,
    },
    optional: {
      type: Boolean,
    },
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
    toggleArrayItem(data) {
      if (this.optional) {
        if (this.selectedFilter === data) {
          this.$emit("update:selectedFilter", null);
        } else {
          this.$emit("update:selectedFilter", data);
        }
      } else {
        this.$emit("update:selectedFilter", data);
      }
    },
  },
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
</style>
