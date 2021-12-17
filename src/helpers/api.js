const ROOT_API = process.env.VUE_APP_ROOT_API;

export default {
  GET_FOOD_SERVICE_BY_ID: ROOT_API + "foodservice/{id}",
  GET_FOOD_SERVICE_INFO_BY_ID: ROOT_API + "foodservice/{id}/info",
  GET_FOOD_SERVICE_LOCATION_BY_ID: ROOT_API + "foodservice/{id}/location",
  GET_FOOD_SERVICE_OPENINGS_BY_ID: ROOT_API + "foodservice/{id}/openings",
  GET_FOOD_SERVICE_TIMETABLES_BY_ID: ROOT_API + "foodservice/{id}/timetables",
  GET_FOOD_SERVICE_CONTACTS_BY_ID: ROOT_API + "foodservice/{id}/contacts",
  GET_FOOD_SERVICE_MEALVOUCHERS_BY_ID: ROOT_API + "foodservice/{id}/vouchers/list",
  GET_FOOD_SERVICE_PAYMENTS_BY_ID:  ROOT_API + "foodservice/{id}/payment/list",
  GET_FOOD_SERVICE_GALLERY_BY_ID: ROOT_API + "foodservice/{id}/gallery",
  GET_ALL_RESTAURANT_MENUS: ROOT_API + "menu",
  GET_INGREDIENT: ROOT_API + "ingredient/find/byid",
  GET_PFP_MODIFIERS: ROOT_API + "pfp/{id}/modifier",
  GET_AUTOCOMPLETE_PLACE: ROOT_API + "iofood/autocomplete/places/",
};
