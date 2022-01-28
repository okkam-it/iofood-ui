import Vue from "vue";
// import router from "@/router/index.js";
const state = {
  items: [],
  deliveryTime: null,
  deliveryAddress: null,
  deliveryIntercomName: null,
  deliveryTypes: [
    { text: "Asporto", value: 0, disabled: false },
    { text: "Domicilio", value: 1, disabled: false }
  ],
  deliveryTypeSelected: 0,
  deliveryPaymentCard: false,
  menuId: null
};
// getters
const getters = {
  /* cartProducts: (state, getters, rootState) => {
    return state.items.map(({ id, quantity }) => {
      const product = rootState.products.all.find(product => product.id === id);
      return {
        title: product.name,
        price: product.price,
        quantity
      };
    });
  },*/
  deliveryTime: state => {
    return state.deliveryTime;
  },

  deliveryAddress: state => {
    return state.deliveryAddress;
  },

  deliveryIntercomName: state => {
    return state.deliveryIntercomName;
  },

  deliveryPaymentCard: state => {
    return state.deliveryPaymentCard;
  },

  deliveryTypes: state => {
    return state.deliveryTypes;
  },

  deliveryTypeSelected: state => {
    return state.deliveryTypeSelected;
  },

  cartTotalPrice: (state, getters) => {
    return getters.cartItems.reduce((total, item) => {
      return total + item.item.price * item.quantity;
    }, 0);
  },
  itemQuantity: state => id => {
    const product = state.items.find(item => {
      return item.item.id === id;
    });
    if (product) {
      return product.quantity;
    }
    return 0;
  },

  cartSize: state => {
    var size = 0;
    for (var i = 0; i < state.items.length; i++) {
      size += state.items[i].quantity;
    }
    return size;
  },

  cartItems: state => {
    return state.items;
  },

  orderFileMessage: (state /* , getters */) => {
    // return JSON.stringify(state);
    var msg = "*Nuovo ordine da MyFood* ";
    if (state.deliveryTypeSelected === 0) {
      msg +=
        "(ASPORTO)\n\n" +
        "Ritiro ore: *" +
        state.deliveryTime.HH.toString() +
        ":" +
        state.deliveryTime.mm.toString() +
        "*\n\n";
    } else {
      msg += "(DOMICILIO)\n\nIndirizzo: " + state.deliveryAddress + "\n\n";
      if (state.deliveryIntercomName && state.deliveryIntercomName.length) {
        msg += "Nome citofono: " + state.deliveryIntercomName + "\n\n";
      }

      if (state.deliveryPaymentCard) {
        msg += "*Richiesto pagamento con carta di credito/debito*";
        ("\n\n");
      }

      msg +=
        "Consegna ore: " +
        state.deliveryTime.HH +
        ":" +
        state.deliveryTime.mm +
        "\n\n";
    }
    return msg;
  },

  orderMessage: (state, getters) => {
    // return JSON.stringify(state);
    var msg = "*Nuovo ordine da MyFood* ";
    if (state.deliveryTypeSelected === 0) {
      msg +=
        "(ASPORTO)\n\n" +
        "Ritiro ore: *" +
        state.deliveryTime.HH.toString() +
        ":" +
        state.deliveryTime.mm.toString() +
        "*\n\n";
    } else {
      msg += "(DOMICILIO)\n\nIndirizzo: " + state.deliveryAddress + "\n\n";
      if (state.deliveryIntercomName && state.deliveryIntercomName.length) {
        msg += "Nome citofono: " + state.deliveryIntercomName + "\n\n";
      }

      if (state.deliveryPaymentCard) {
        msg += "*Richiesto pagamento con carta di credito/debito* \n\n";
      }

      msg +=
        "Consegna ore: " +
        state.deliveryTime.HH +
        ":" +
        state.deliveryTime.mm +
        "\n\n";
    }

    msg += "Articoli:(" + getters.cartSize + ")\n";
    for (var i = 0; i < state.items.length; i++) {
      var item = state.items[i];
      for (var j = 0; j < item.quantity; j++) {
        msg += "\n --> *" + item.item.name.trim() + "*";
        if (item.item.desc && item.item.desc.length) {
          msg += "\n     " + item.item.desc.trim();
        }
        msg += "\n     " + item.item.price.toFixed(2) + " €";
        if (item.notes[j].length) {
          msg += " _" + item.notes[j].trim() + "_";
        }
      }
      msg += "\n";
    }
    msg +=
      "\n\n Num. articoli: " +
      getters.cartSize +
      "\n *Prezzo totale: " +
      getters.cartTotalPrice.toFixed(2) +
      " €*";

    return msg;
  }
};

// actions
const actions = {
  addItem(context, product) {
    if (product) {
      let cartItems = context.state.items.filter(
        item => item.item.id === product.id
      );
      if (cartItems && cartItems.length) {
        for (var item of cartItems) {
          console.log(JSON.stringify(product));

          let itemToCompare = JSON.parse(JSON.stringify(item.item));
          delete itemToCompare.quantity;
          console.log(JSON.stringify(itemToCompare));
          if (JSON.stringify(itemToCompare) === JSON.stringify(product)) {
            context.commit("incrementItemQuantity", item);
            console.log("wee");
            return;
          }
        }
      }
      context.commit("pushProduct", product);

      console.log(JSON.stringify(context.state.items));

      /* if (!cartItems) {
        context.commit("pushProduct", product);
      } else {
        context.commit("incrementItemQuantity", cartItem);
      } */
    }
  },
  removeItem(context, payload) {
    // context.commit("resetCart");
    var id = payload.index;
    console.log("index: " + id);
    if (id > -1) {
      context.commit("removeProduct", id);
      /* let cartItems = context.state.items.filter(
        item => item.item.id === id
      );
      if (cartItems && cartItems.length) {
        for (var item of cartItems) {
          let itemToCompare = JSON.parse(JSON.stringify(item.item));
          delete itemToCompare.quantity;
          if (JSON.stringify(itemToCompare) === JSON.stringify(payload)) {

          }
        }
      } */
      /* const cartItem = context.state.items.find(item => item.item.id === id);
      if (cartItem) {
        if (cartItem.quantity === 1) {
          context.commit("removeProduct", id);
        } else {
          context.commit("decrementItemQuantity", payload);
        }
      } */
    }
  },
  updateNote(context, payload) {
    context.commit("updateNote", payload);
  },
  updateDeliveryTime(context, payload) {
    context.commit("updateDeliveryTime", payload);
  },
  updateMenuId(context, payload) {
    context.commit("updateMenuId", payload);
  },
  updateDeliveryAddress(context, payload) {
    context.commit("updateDeliveryAddress", payload);
  },
  updateDeliveryIntercomName(context, payload) {
    context.commit("updateDeliveryIntercomName", payload);
  },
  updateDeliveryPaymentCard(context, payload) {
    context.commit("updateDeliveryPaymentCard", payload);
  },
  updateDeliveryTypeSelected(context, payload) {
    context.commit("updateDeliveryTypeSelected", payload);
  },
  disableDeliveryType(context, payload) {
    context.commit("disableDeliveryType", payload);
  },
  resetCart(context) {
    context.commit("resetCart");
  }
};

// mutations
const mutations = {
  pushProduct(state, item) {
    state.items.push({
      item,
      quantity: 1,
      // notes: [""]
    });
  },
  incrementItemQuantity(state, cartItem) {
    // const cartItem = state.items.find(item => item.id === id);
    cartItem.quantity++;
    /* if (!cartItem.notes) {
      cartItem.notes = [];
    }
    cartItem.notes.push(""); */
  },
  removeProduct(state, id) {
    console.log("remove: " + id);
    state.items.splice(id, 1);
    /* state.items = state.items.filter(function(item) {
      return item.item.id !== id;
    }); */
  },
  decrementItemQuantity(state, payload) {
    const cartItem = state.items.find(item => item.item.id === payload.id);
    cartItem.quantity--;
    if (payload.index !== null) {
      cartItem.notes.splice(payload.index, 1);
    } else {
      cartItem.notes.pop();
    }
  },
  updateNote(state, payload) {
    const cartItem = state.items.find(item => item.item.id === payload.id);
    if (cartItem) {
      Vue.set(cartItem.notes, payload.index, payload.value);
    }
  },
  updateDeliveryTime(state, payload) {
    state.deliveryTime = payload;
  },
  updateMenuId(state, payload) {
    if (state.menuId && payload != state.menuId) {
      state.items = [];
      state.deliveryTime = null;
      state.deliveryAddress = null;
      state.deliveryTypeSelected = 0;
    }
    state.menuId = payload;
  },
  updateDeliveryAddress(state, payload) {
    state.deliveryAddress = payload;
  },
  updateDeliveryIntercomName(state, payload) {
    state.deliveryIntercomName = payload;
  },
  updateDeliveryPaymentCard(state, payload) {
    state.deliveryPaymentCard = payload;
  },
  updateDeliveryTypeSelected(state, payload) {
    state.deliveryTypeSelected = payload;
  },
  disableDeliveryType(state, payload) {
    if (payload == 0) {
      state.deliveryTypes[0].disabled = true;
      state.deliveryTypes[1].disabled = false;
    } else if (payload == 1) {
      state.deliveryTypes[0].disabled = false;
      state.deliveryTypes[1].disabled = true;
    } else {
      state.deliveryTypes[0].disabled = false;
      state.deliveryTypes[1].disabled = false;
    }
  },
  resetCart(state) {
    state.items = [];
    state.deliveryTime = null;
    state.deliveryAddress = null;
    state.deliveryTypeSelected = 0;
    state.deliveryIntercomName = null;
    state.deliveryPaymentCard = false;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
