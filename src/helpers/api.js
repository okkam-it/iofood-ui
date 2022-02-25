const ROOT_API = process.env.VUE_APP_ROOT_API;

export default {
  GET_FOOD_SERVICE_BY_ID: ROOT_API + "foodservice/{id}",
  GET_FOOD_SERVICE_INFO_BY_ID: ROOT_API + "foodservice/{id}/info",
  GET_FOOD_SERVICE_LOCATION_BY_ID: ROOT_API + "foodservice/{id}/location",
  GET_FOOD_SERVICE_OPENINGS_BY_ID: ROOT_API + "foodservice/{id}/openings",
  GET_FOOD_SERVICE_TIMETABLES_BY_ID: ROOT_API + "foodservice/{id}/timetables",
  GET_FOOD_SERVICE_CONTACTS_BY_ID: ROOT_API + "foodservice/{id}/contacts",
  GET_FOOD_SERVICE_CUISINE_BY_ID: ROOT_API + "foodservice/{id}/cuisine",
  GET_FOOD_SERVICE_MEALVOUCHERS_BY_ID:
    ROOT_API + "foodservice/{id}/vouchers/list",
  GET_FOOD_SERVICE_PAYMENTS_BY_ID: ROOT_API + "foodservice/{id}/payment/list",
  GET_FOOD_SERVICE_GALLERY_BY_ID: ROOT_API + "foodservice/{id}/gallery",
  GET_ALL_RESTAURANT_MENUS: ROOT_API + "menu",
  GET_INGREDIENT: ROOT_API + "ingredient/find/byid",
  GET_PFP: ROOT_API + "pfp/{id}",
  GET_PFP_MODIFIERS: ROOT_API + "pfp/{id}/modifier",
  GET_PFP_PRICE_MODIFIER: ROOT_API + "pfp/{id}/modifier/price",
  GET_MODIFIER_ALTERNATIVES:
    ROOT_API + "foodservice/{id}/modifier/{modifierId}/alternative",
  GET_AUTOCOMPLETE_PLACE: ROOT_API + "iofood/places/autocomplete",
  GET_PLACE_COORDS: ROOT_API + "iofood/places/coordinates",
  GET_QRCODE: ROOT_API + "iofood/qrcode",
  FIND_FOOD_SERVICES: ROOT_API + "foodservice",
  GET_PFP_DIETARY: ROOT_API + "pfp/{id}/dietary",
  GET_PFP_NUTRITIONAL_VALUES: ROOT_API + "pfp/{id}/nutritional-label/",

  // Filters
  GET_FILTERS_SITUATION: ROOT_API + "iofood/food-service/moments",
  GET_FILTERS_NUTRITIONAL_ASPECTS: ROOT_API + "iofood/pfp/nutritional-aspects",
  GET_FILTERS_ALLERGENS: ROOT_API + "iofood/allergens",
  GET_FILTERS_OCCASIONS: ROOT_API + "iofood/food-service/occasions",
  GET_FILTERS_FOOD_RESTRICTIONS: ROOT_API + "iofood/food-service/food-restrictions",
  GET_FILTERS_FACILITIES: ROOT_API + "iofood/food-service/facilities",
  GET_FILTERS_CUISINES: ROOT_API + "iofood/food-service/cuisines",
  GET_FILTERS_MEAL_VOUCHERS: ROOT_API + "iofood/meal-vouchers",
  GET_FILTERS_FS_TYPES: ROOT_API + "iofood/food-service/types",
  GET_FILTERS_PAYMENTS: ROOT_API + "iofood/food-service/payment-types",
  GET_FILTERS_: ROOT_API + "iofood/food-service/moments",
};
