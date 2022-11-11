<template>
  <div>
    <template v-if="foodService">
      <div class="map">
        <l-map
          ref="map"
          :zoom="zoom"
          :center="center"
          :options="mapOptions"
          :zoom-control="false"
          @click="mapCLick()"
        >
          <l-tile-layer :url="url" :attribution="attribution" />

          <l-marker :lat-lng="center" :icon="markerRedIcon"></l-marker>
        </l-map>
      </div>
      <div class="info-box">
        <p v-if="address">
          <b-icon-geo-fill />
          {{ address }}
        </p>
        <p v-if="phoneNumber">
          <b-icon-phone />
          {{ phoneNumber }}
        </p>
        <!-- <p v-if="timetables">
          <b-icon-clock-fill />
          {{timetables}}
        </p>-->
      </div>
      <hr />
      <div v-if="timetables" class="info-box">
        <label>Orari</label>
        <!-- <div>{{JSON.stringify(timetables)}}</div> -->
        <div class="openings-box">
          <ul>
            <template v-for="opening in openings">
              <li :key="opening.id">
                <template v-if="opening.singleDay">
                  <p v-if="opening.opening">Apertura straordinaria il</p>
                  <p v-else>Chiuso il</p>
                  <strong>{{
                    new Date(opening.fromDate).toLocaleDateString(
                      "default",
                      dateOptions
                    )
                  }}</strong>
                </template>
                <template v-else>
                  <p v-if="opening.opening">Apertura straordinaria dal</p>
                  <p v-else>Chiuso dal</p>
                  <strong>{{
                    new Date(opening.fromDate).toLocaleDateString(
                      "default",
                      dateOptions
                    )
                  }}</strong>
                  {{ " al " }}
                  <strong>{{
                    new Date(opening.toDate).toLocaleDateString(
                      "default",
                      dateOptions
                    )
                  }}</strong>
                </template>
              </li>
            </template>
          </ul>
        </div>
        <div>
          <ul>
            <li
              class="hour-item"
              v-for="(values, day) in timetables"
              :key="day"
              :class="{ today: day === todayName }"
            >
              <div>
                {{ $t("day." + day) }}
                <b-icon-circle-fill
                  scale=".5"
                  v-if="day === todayName"
                  :class="{ closednow: closedNow }"
                />
              </div>
              <div>
                <p v-for="value in values" :key="value.id">
                  {{ value.fromHour + "-" + value.toHour }}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div
        v-if="
          (activeServices && activeServices.length) ||
          foodService.info.delivery ||
          foodService.info.takeaway
        "
        class="info-box"
      >
        <label>Servizi</label>
        <div>
          <ul>
            <template v-if="activeServices && activeServices.length">
              <template v-for="service in activeServices">
                <li :key="service">
                  <b-icon-check scale="1.5" />
                  {{ $t("service." + service) }}
                </li>
              </template>
            </template>
            <li v-if="foodService.info.delivery">
              <b-icon-check scale="1.5" />
              {{ $t("service.delivery") }}
            </li>
            <li v-if="foodService.info.takeaway">
              <b-icon-check scale="1.5" />
              {{ $t("service.takeaway") }}
            </li>
          </ul>
        </div>
      </div>
      <div
        v-if="foodService.payments && foodService.payments.length"
        class="info-box"
      >
        <label>Pagamenti digitali</label>
        <div>
          <ul>
            <template v-for="payment in foodService.payments">
              <li :key="'payment-' + payment.id">
                <b-icon-check scale="1.5" />
                {{ $t("filters." + payment) }}
              </li>
            </template>
          </ul>
        </div>
      </div>
      <div
        v-if="foodService.mealvouchers && foodService.mealvouchers.length"
        class="info-box"
      >
        <label>Buoni pasto</label>
        <div>
          <ul>
            <template v-for="mealvoucher in foodService.mealvouchers">
              <li :key="'mealvoucher-' + mealvoucher.id">
                <b-icon-check scale="1.5" />
                {{ mealvoucher.name }}
              </li>
            </template>
          </ul>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { latLng, icon } from "leaflet";
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";
export default {
  name: "FoodServiceInfoPage",
  components: {
    LMap,
    LTileLayer,
    LMarker,
  },
  data() {
    return {
      zoom: 15,
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      mapOptions: {
        zoomSnap: 0.5,
        zoomControl: false,
      },
      markerRedIcon: icon({
        iconRetinaUrl: require("@/assets/icons/marker_red.png"),
        iconUrl: require("@/assets/icons/marker_red.png"),
        iconSize: [31, 40],
        // iconAnchor: [23, 47]
        iconAnchor: [15, 35],
        //shadowUrl: require('@/assets/images/tte_logo.png')
      }),
      services: [
        "bookingRequest",
        "groupTable",
        "kidsPlayground",
        "outdoorTables",
        "petsAllowed",
        "privateParking",
        "privateRoom",
        "smokingRoom",
        "wheelchairAccessible",
        "wifi",
      ],
      dateOptions: { day: "numeric", month: "long", year: "numeric" },
    };
  },
  computed: {
    todayName() {
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
      // var dayName = days[d.getDay()];
      return days[d.getDay()].toLowerCase();
    },
    center() {
      if (this.foodService && this.foodService.location) {
        return latLng(
          this.foodService.location.latitude,
          this.foodService.location.longitude
        );
      }
      return null;
    },
    address() {
      var fs = this.foodService;
      if (fs && fs.location) {
        var loc = fs.location;
        return loc.address + ", " + loc.city;
      }
      return null;
    },
    activeServices() {
      var services = [];
      if (this.foodService.info) {
        for (let service of this.services) {
          if (this.foodService.info[service]) {
            services.push(service);
          }
        }
      }
      return services;
    },
    openings() {
      return this.foodService.openings;
    },
    timetables() {
      var timetables = this.foodService.timetables;
      if (!timetables || !timetables.length) {
        return null;
      }
      // console.log(JSON.stringify(timetables));
      /* var days = {
        { code: "sunday", hours: [] },
        { code: "monday", hours: [] },
        { code: "tuesday", hours: [] },
        { code: "wednesday", hours: [] },
        { code: "thursday", hours: [] },
        { code: "friday", hours: [] },
        { code: "saturday", hours: [] }
      }; */
      var days = {
        sunday: [],
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
      };

      for (let timetable of timetables) {
        days[timetable.day.toLowerCase()].push(timetable);
      }

      Object.values(days).forEach((vals) => {
        vals.sort((a, b) => {
          let from1 = a.fromHour.split(":")[0];
          let from2 = b.fromHour.split(":")[0];
          if (from1 === from2) {
            from1 = a.fromHour.split(":")[1];
            from2 = b.fromHour.split(":")[1];
            return parseInt(from2) > parseInt(from1) ? -1 : 1;
          } else {
            return parseInt(from2) > parseInt(from1) ? -1 : 1;
          }
        });
      });

      return days;
    },
    phoneNumber() {
      if (
        this.foodService &&
        this.foodService.contacts &&
        this.foodService.contacts.phoneNumber
      ) {
        return this.foodService.contacts.phoneNumber;
      }
      return null;
    },
  },
  props: {
    foodService: {
      type: Object,
    },
    closedNow: {
      type: Boolean,
    },
  },
  methods: {
    mapCLick() {},
  },
};
</script>

<style scoped>
.map {
  width: 100%;
  height: 20vh;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 2vh;
}

label {
  font-weight: bold;
  font-size: 16px;
}

.info-box {
  font-size: 16px;
}

.info-box p {
  margin-bottom: 3px;
}

.info-box .b-icon {
  color: var(--primary-color);
  opacity: 0.8;
  margin-right: 5px;
}

ul {
  list-style-type: none;
  padding-left: 0;
}

.hour-item {
  display: flex;
  margin-bottom: 1vh;
  font-size: 14px;
}

.hour-item.today {
  font-weight: bold;
}

.hour-item p {
  margin-bottom: 0px;
}

.hour-item > div {
  width: 50%;
  display: inline-block;
}

.hour-item .b-icon.closednow {
  color: var(--danger-color);
  opacity: 0.8;
}

.openings-box li {
  border: 1px solid var(--warning-color);
  padding: 10px 10px;
  border-radius: 10px;
  margin-bottom: 5px;
  margin-top: 5px;
  font-size: 14px;
}

.openings-box li strong {
  font-size: 15px;
}
</style>
