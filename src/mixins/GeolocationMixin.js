export default {
  methods: {
    async getGeolocation() {
      var ctx = this;
      var latitude;
      var longitude;
      return new Promise((resolve, reject) => {
        if (!("geolocation" in navigator)) {

          reject(new Error("Geolocation is not available."));
        }


        navigator.geolocation.getCurrentPosition(
          position => {
            localStorage.setItem("userGeolocationPermission", true);

            latitude = position.coords.latitude;
            longitude = position.coords.longitude;

            this.axios
              .get(
                "https://nominatim.openstreetmap.org/reverse?lat=" +
                latitude +
                "&lon=" +
                +longitude +
                "&format=json"
              )
              .then(response => {
                var location = {
                  latitude: latitude,
                  longitude: longitude,
                  name: response.data.address.city
                };
                ctx.$store.dispatch(
                  "geolocationModule/setUserLocation",
                  location
                );

                resolve(location);
              })
              .catch(error => {
                console.log(error);
                reject(new Error(error));
              });
          },
          err => {
            reject(err);
          }
        );




      });

    },
    async getGeolocationNominatim() {
      try {
        let response = await this.axios.get(
          "https://nominatim.openstreetmap.org/reverse?lat=<value>&lon=<value>"
        );
        this.availabilityMessage = response.data.message;
      } catch (error) {
        this.availabilityMessage = false;
        console.log(error);
      }
    },
    checkGeolocationPositionError(error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          console.error("User denied the request for Geolocation.");
          alert("User denied the request for Geolocation.");
          break;

        case error.POSITION_UNAVAILABLE:
          console.error("Location information is unavailable.");
          alert("Location information is unavailable.");
          break;

        case error.TIMEOUT:
          console.error("The request to get user location timed out.");
          alert("The request to get user location timed out");
          break;

        case error.UNKNOWN_ERROR:
          console.error("An unknown error occurred.");
          alert("An unknown error occurred.");
          break;
      }
    }
  }
};
