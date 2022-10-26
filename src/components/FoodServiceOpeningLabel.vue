<template>
  <span
    v-if="closedNow"
    @click="showMoreInfo = true"
    class="opening-label closed"
    :class="{ small }"
  >
    <b-icon-clock-fill />Chiuso ora
    <span v-if="openAt">
      - apre alle
      {{
        openAt.getHours().toLocaleString("it-IT", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        }) +
        ":" +
        openAt.getMinutes().toLocaleString("it-IT", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })
      }}
    </span>
  </span>
  <span v-else class="opening-label open" :class="{ small }">
    <b-icon-clock-fill />Aperto ora
  </span>
</template>

<script>
import api from "@/helpers/api";
export default {
  name: "FoodServiceOpeningLabel",
  components: {},
  data() {
    return {
      closedNow: false,
      timetables: null,
      openings: null,
      openAt: null,
    };
  },
  props: {
    fsId: {
      type: Number,
    },
    small: {
      type: Boolean,
    },
  },
  mounted() {
    this.loadFsOpenings();
  },
  methods: {
    loadFsOpenings() {
      var requestTimetables = this.axios.get(
        api.GET_FOOD_SERVICE_TIMETABLES_BY_ID.replace("{id}", this.fsId)
      );
      var requestOpenings = this.axios.get(
        api.GET_FOOD_SERVICE_OPENINGS_BY_ID.replace("{id}", this.fsId)
      );

      this.axios
        .all([requestTimetables, requestOpenings])
        .then(
          this.axios.spread((...responses) => {
            const responseTimetables = responses[0];
            this.timetables = responseTimetables.data;

            const responseOpenings = responses[1];
            this.openings = responseOpenings.data;

            this.checkClosedNow();

            // use/access the results
          })
        )
        .catch((errors) => {
          // react on errors.
          console.log(errors);
        });
    },
    checkClosedNow() {
      let openings = this.openings;
      let timetables = this.timetables;
      // var closedNow = true;

      for (let opening of openings) {
        let fromDate = new Date(opening.fromDate);
        let toDate = opening.singleDay ? null : new Date(opening.fromDate);
        if (opening.hours) {
          fromDate.setHours(
            opening.fromHour.split(":")[0],
            opening.fromHour.split(":")[1],
            0
          );
          toDate.setHours(
            opening.toHour.split(":")[0],
            opening.toHour.split(":")[1],
            0
          );
        } else {
          fromDate.setHours(0, 0, 0, 0);
          toDate.setHours(24, 0, 0, 0);
        }

        if (toDate) {
          if (
            new Date() >= new Date(fromDate) &&
            new Date() <= new Date(toDate)
          ) {
            this.closedNow = true;
            return;
          }
        } else {
          let currentDate = new Date();
          fromDate.setHours(0, 0, 0, 0);
          if (currentDate === fromDate) {
            this.closedNow = true;
            return;
          }
        }
      }

      if (timetables && timetables.length) {
        var days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        var d = new Date();
        var dayName = days[d.getDay()];

        var timetablesToday = timetables.filter(
          (x) => x.day === dayName.toUpperCase()
        );
        if (timetablesToday.length) {
          var currentDate = new Date();
          for (let timetable of timetablesToday) {
            var fromDate = new Date();
            fromDate.setHours(
              timetable.fromHour.split(":")[0],
              timetable.fromHour.split(":")[1],
              0
            );
            var toDate = new Date();
            toDate.setHours(
              timetable.toHour.split(":")[0],
              timetable.toHour.split(":")[1],
              0
            );

            if (toDate < fromDate) {
              toDate.setDate(toDate.getDate() + 1);
            }
            if (currentDate > fromDate && currentDate < toDate) {
              this.closedNow = false;
              return;
            }

            if (
              currentDate < fromDate &&
              (!this.openAt || this.openAt > fromDate)
            ) {
              this.openAt = fromDate;
            }
          }
        } else {
          this.closedNow = false;
          return;
        }

        // TODO
        // console.log(JSON.stringify(timetablesToday));
        // console.log(JSON.stringify(openings));
      } else {
        this.closedNow = false;
        return;
      }

      this.closedNow = true;
    },
  },
};
</script>

<style scoped>
span.opening-label {
  opacity: 0.7;
  display: block;
  font-size: 15px !important;
}

span.opening-label.small {
  font-size: 12px !important;
}

span.opening-label.open .b-icon {
  color: var(--success-color);
}

span.opening-label.closed .b-icon {
  color: var(--danger-color);
}

span.opening-label .b-icon {
  margin-right: 5px;
}
span.opening-label span {
  color: #4d4d4d;
}
</style>
