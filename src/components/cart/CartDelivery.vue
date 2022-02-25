<template>
  <div class="cart-delivery" v-if="showCart">
    <div class="cart">
      <div class="header" @click="hide()">
        <b-icon-cart scale="1.4" />
        <!-- <p class="cart-size">{{$store.getters.cartSize}}</p> -->
        <p>
          <strong v-if="!showCart">Completa ordine</strong>
          <b-icon-x v-else scale="2" />
        </p>
        <p class="tot-price" v-if="!showCart">{{cartTotalPrice}}€</p>
      </div>
      <b-collapse v-model="showCart">
        <div class="body">
          <div class="delivery-label">
            <span>Ordina su WhatsApp e paga alla consegna</span>
          </div>
          <div class="delivery-selector">
            <!-- <b-form-group>
              <b-form-radio-group
                v-model="deliveryOption"
                :options="$store.getters.deliveryTypes"
                size="lg"
              ></b-form-radio-group>
            </b-form-group>-->
            <div class="delivery-type-selector">
              <template v-for="opt in $store.getters.deliveryTypes">
                <span
                  :key="opt.text"
                  :class="{ active : opt.value === deliveryOption}"
                  @click="deliveryOption = opt.value"
                >
                  <!-- <input v-model="deliveryOption" :key="opt.text" type="radio" :value="opt.value" /> -->
                  {{opt.text}}
                </span>
              </template>
            </div>

            <div class="address-box" v-if="deliveryOption==1">
              <input
                id="target-tooltip-address"
                placeholder="Indirizzo di consegna"
                v-model="deliveryAddress"
                @input="deliveryAddressChange"
                :class="{missing : addressState}"
              />
            </div>
            <div class="address-box" v-if="deliveryOption==1">
              <input
                id="target-tooltip-address"
                placeholder="Nome sul citofono"
                v-model="deliveryIntercomName"
                @input="deliveryIntercomNameChange"
              />
            </div>
            <div class="payment-box" v-if="deliveryOption==1">
              <!-- <b-form-group>
                <b-form-checkbox v-model="deliveryPaymentCard">
                  <b-icon-credit-card />
                  <span>Richiedi pagamento alla consegna con carta o bancomat</span>
                </b-form-checkbox>                
              </b-form-group>-->
              <label class="switch">
                <input v-model="deliveryPaymentCard" type="checkbox" />
                <span class="slider"></span>
              </label>

              <b-icon-credit-card />
              <span>Richiedi pagamento alla consegna con carta o bancomat</span>
            </div>
          </div>
          <div class="time-selector" @click="showHourPicker()">
            <span v-if="deliveryOption===0">Ritiro:</span>
            <span v-else>Consegna:</span>
            <span class="time">
              <template v-if="deliveryTime">alle {{deliveryTime}}</template>
              <template v-else>
                Prima possibile
                <b-icon-pencil-fill scale=".8" />
              </template>
            </span>
            <!-- <select /> -->
            <!-- <vue-timepicker
              id="target-tooltip-hour"
              v-model="deliveryTime"
              :minute-interval="15"
              :hour-range="[[startHourRange, endHourRange]]"
              close-on-complete
              hour-label="ore"
              minute-label="minuti"
              @change="deliveryTimeChange()"
              :class="{missing : timeDeliveryState}"
            ></vue-timepicker>-->
          </div>
          <p class="list-title">Articoli</p>
          <ul v-if="cartSize">
            <li v-for="(item, index) in cartItems" :key="index">
              <b-row>
                <b-col cols="1">
                  <span class="quantity-text">{{item.quantity}}x</span>
                </b-col>
                <b-col cols="11">
                  <div class="sub-item-box">
                    <b-row>
                      <b-col cols="8">{{item.item.name}}</b-col>
                      <b-col cols="2">
                        <span class="light-text">{{(item.item.price * item.quantity).toFixed(2)}}€</span>
                      </b-col>
                      <b-col cols="1">
                        <div class="btnTrash" @click="removeItem(item.item.id, index)">
                          <b-icon-trash scale="1" />
                        </div>
                      </b-col>
                      <!-- <b-col cols="10">
                        <input
                          placeholder="Note"
                          :value="note"
                          @input="updateNote(item.item.id, $event, index)"
                        />
                      </b-col>-->
                    </b-row>
                  </div>
                  <!-- <div v-for="(note, index) in item.notes" :key="index" class="sub-item-box">
                    <b-row>
                      <b-col cols="8">{{item.item.name}}</b-col>
                      <b-col cols="2">
                        <span class="light-text">{{item.item.price.toFixed(2)}}€</span>
                      </b-col>
                      <b-col cols="1">
                        <div class="btnTrash" @click="removeItem(item.item.id, index)">
                          <b-icon-trash scale="1" />
                        </div>
                      </b-col>
                      <b-col cols="10">
                        <input
                          placeholder="Note"
                          :value="note"
                          @input="updateNote(item.item.id, $event, index)"
                        />
                      </b-col>
                    </b-row>
                  </div>-->
                </b-col>
              </b-row>
            </li>
          </ul>
          <div v-else class="void-cart">
            <p>Nessun articolo selezionato</p>
          </div>
          <div class="btn-send-order">
            <div class="total">
              <strong>Totale</strong>
              <span>{{cartTotalPrice}}€</span>
            </div>
            <button
              class="button"
              :class="{disabled: !cartSize}"
              @click="sendOrder()"
            >Invia ordine su WhatsApp</button>
          </div>
        </div>
      </b-collapse>
      <b-tooltip
        triggers="manual"
        ref="tooltiphour"
        target="target-tooltip-hour"
        placement="bottom"
        title="Inserisci un orario"
      />
      <b-tooltip
        triggers="manual"
        ref="tooltipaddress"
        target="target-tooltip-address"
        placement="top"
        title="Inserisci un indirizzo di consegna"
      />
    </div>
    <mobile-modal v-if="hourPicker" @hide="hourPicker = false">
      <template #content>
        <div class="hour-picker">
          <div @click="deliveryTimeType = 0">
            <b-icon-clock />Prima possibile
            <input type="radio" v-model="deliveryTimeType" :value="0" />
          </div>
          <div @click="deliveryTimeType = 1">
            <b-icon-clock-history />Programma per dopo
            <input type="radio" @click.stop v-model="deliveryTimeType" :value="1" />
            <div v-if="deliveryTimeType == 1">
              <!-- <span v-if="deliveryTimeTemp">{{deliveryTimeTemp}}</span> -->
              <select v-model="deliveryTimeTemp">
                <option v-for="(opt, k) in hourOptions" :key="k" :value="opt">{{opt}}</option>
              </select>
            </div>
          </div>
          <div>
            <button class="primary">Conferma</button>
          </div>
        </div>
      </template>
    </mobile-modal>
  </div>
</template>

<script>
import MobileModal from "@/components/mobile-modal/MobileModal";
// import api from "@/helpers/api";
export default {
  name: "CartDelivery",
  components: {
    MobileModal
  },
  data() {
    return {
      showCart: false,
      deliveryOption: this.$store.getters.deliveryTypeSelected,
      deliveryTime: this.$store.getters.deliveryTime,
      deliveryAddress: this.$store.getters.deliveryAddress,
      deliveryIntercomName: this.$store.getters.deliveryIntercomName,
      deliveryPaymentCard: this.$store.getters.deliveryPaymentCard,
      addressState: null,
      timeDeliveryState: null,
      hourPicker: false,
      deliveryTimeType: this.$store.getters.deliveryTime ? 1 : 0,
      deliveryTimeTemp: this.$store.getters.deliveryTime,
      hourOptions: this.findFsHourOptions(),
      // fsTimetables: []
    };
  },
  mounted() {
    // this.loadFsTimetables();
  },
  methods: {
    /* loadFsTimetables() {
      this.axios
        .get(api.GET_FOOD_SERVICE_TIMETABLES_BY_ID.replace("{id}", this.fsId))
        .then(response => {
          this.fsTimetables = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    }, */
    findFsHourOptions() {},
    getNextSlot() {},
    show() {
      this.showCart = true;
    },
    hide() {
      this.showCart = false;
    },
    showHourPicker() {
      this.hourPicker = true;
    },
    removeItem(id, index) {
      var payload = {
        id: id,
        index: index
      };
      this.$store.dispatch("removeItem", payload);
    },
    updateNote(id, e, index) {
      var payload = {
        id: id,
        value: e.target.value,
        index: index
      };
      this.$store.dispatch("updateNote", payload);
    },
    deliveryTimeChange() {
      this.$store.dispatch("updateDeliveryTime", this.deliveryTime);
    },
    deliveryAddressChange() {
      this.$store.dispatch("updateDeliveryAddress", this.deliveryAddress);
    },
    deliveryIntercomNameChange() {
      this.$store.dispatch(
        "updateDeliveryIntercomName",
        this.deliveryIntercomName
      );
    },
    sendOrder() {
      if (this.cartSize && this.checkParams()) {
        var order_message = this.$store.getters.orderMessage;
        var dt = this.$store.getters.deliveryTime;
        this.saveNewOrder({
          menuId: this.$route.params.menuid,
          creationDate: new Date(),
          orderType: this.$store.getters.deliveryTypeSelected,
          msgTime: dt.HH + ":" + dt.mm,
          msgAddress: this.$store.getters.deliveryAddress,
          orderItems: JSON.stringify(this.$store.getters.cartItems),
          orderText: encodeURI(order_message)
        });

        this.hide();
        this.$store.dispatch("resetCart");
        this.$nextTick(() => {
          window.open(
            "https://wa.me/39" +
              "3484157464" +
              /* this.restaurant.info.whatsappDelivery + */
              "?text=" +
              encodeURI(order_message),
            "_blank"
          );
          location.reload();
        });
      }
    },
    checkParams() {
      this.timeDeliveryState = null;
      this.addressState = null;
      if (
        this.deliveryOption === 1 &&
        (this.deliveryAddress == null || !this.deliveryAddress.length)
      ) {
        this.addressState = true;
        this.showAddressTooltip();
        return false;
      }

      var d_time = this.$store.getters.deliveryTime;
      if (!d_time || !d_time.HH.length || !d_time.mm.length) {
        this.timeDeliveryState = true;
        this.showHourTooltip();
        return false;
      }
      return true;
    },
    async showAddressTooltip() {
      this.$refs.tooltipaddress.$emit("open");
      setTimeout(() => {
        this.$refs.tooltipaddress.$emit("close");
      }, 2000);
    },
    async showHourTooltip() {
      this.$refs.tooltiphour.$emit("open");
      setTimeout(() => {
        this.$refs.tooltiphour.$emit("close");
      }, 2000);
    }
  },
  watch: {
    deliveryOption() {
      this.$store.dispatch("updateDeliveryTypeSelected", this.deliveryOption);
    },
    deliveryPaymentCard() {
      this.$store.dispatch(
        "updateDeliveryPaymentCard",
        this.deliveryPaymentCard
      );
    },
    deliveryTime() {
      this.checkParams();
    },
    deliveryAddress() {
      this.checkParams();
    },
    deliveryTimeType() {
      if (this.deliveryTimeType) {
        if (!this.deliveryTimeTemp) {
          this.deliveryTimeTemp = "20 - 21";
        }
      } else {
        this.deliveryTimeTemp = null;
      }
    }
  },
  computed: {
    fsId() {
      return this.$route.params.id;
    },
    cartItems() {
      return this.$store.getters.cartItems;
    },
    cartTotalPrice() {
      return this.$store.getters.cartTotalPrice.toFixed(2);
    },
    cartSize() {
      return this.$store.getters.cartSize;
    }
  }
};
</script>

<style scoped>
.cart-delivery {
  width: 100vw;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #fff;
  z-index: 10;
}

.cart-delivery .fa {
  font-size: 18px;
}

.cart-delivery .header p {
  margin-bottom: 0;
  float: right;
}

.cart-delivery .header p.tot-price {
  float: none;
  display: inline-block;
  margin-left: 30px;
  font-size: 16px;
}

.cart-delivery .header p.cart-size {
  float: unset;
  position: absolute;
  background-color: #f9f9f9;
  border-radius: 50%;
  padding: 0 7px;
  color: #e33b18;
  font-size: 14px;
  top: 10px;
  left: 30px;
}

.cart-delivery .header {
  padding: 20px 20px;
}

.cart-delivery .header .bi-cart {
  color: #808080;
}

.cart-delivery .body {
  background-color: #f2f2f2;
  width: 100%;
  color: #4d4d4d;
  height: 78vh;
  overflow: scroll;
}

.cart-delivery .body .void-cart {
  text-align: center;
  color: #808080;
  font-size: 14px;
  margin-top: 20px;
}

.cart-delivery .body .sub-item-box {
  margin-bottom: 8px;
}

.cart-delivery .body .sub-item-box .btnTrash {
  width: 30px;
  height: 30px;
  text-align: center;
  padding-top: 3px;
  position: absolute;
  top: 16px;
}

.cart-delivery .body .list-title {
  margin-bottom: 0;
  padding-left: 10px;
  font-size: 14px;
  font-weight: bold;
}

.cart-delivery .body ul {
  list-style: none;
  padding: 0;
  padding-bottom: 90px;
}

.cart-delivery .body ul li {
  padding: 5px 10px;
  background-color: #fff;
  border-bottom: 1px solid #ccc;
  margin-bottom: 5px;
  position: relative;
}

.cart-delivery .body ul li input {
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 0 5px;
  border-radius: 2px;
  margin-top: 2px;
}
.cart-delivery .body .btn-send-order {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  padding: 10px 10px;
  margin: 0 auto;
  font-size: 18px;
  background-color: #fff;
  -webkit-box-shadow: 0px 5px 13px -1px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 5px 13px -1px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 5px 13px -1px rgba(0, 0, 0, 0.75);
}

.cart-delivery .body .btn-send-order .total {
  margin-bottom: 10px;
  padding: 0 15px;
}

.cart-delivery .body .btn-send-order .total span {
  float: right;
}

.cart-delivery .body .btn-send-order .button {
  background-color: rgba(112, 201, 79, 1);
  cursor: pointer;
  color: #fff;
  text-align: center;
  border-radius: 5px;
  font-weight: bold;
  padding: 10px 10px;
  width: 100%;
  border: none;
}

.cart-delivery .body .btn-send-order .button.disabled {
  background-color: #ccc;
}

.cart-delivery .body .delivery-label {
  text-align: center;
  padding-top: 10px;
  font-size: 14px;
  margin-bottom: -10px;
  color: #808080;
}

.cart-delivery .body .delivery-selector {
  padding-top: 20px;
}

.cart-delivery .body .delivery-selector .form-group {
  text-align: center;
}

.cart-delivery .body .delivery-selector .address-box {
  background-color: #fff;
  padding: 15px 15px;
  padding-bottom: 5px;
  text-align: center;
}

.cart-delivery .body .delivery-selector .address-box input {
  width: 100%;
  padding: 0 15px;
  min-height: 40px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 2px;
}

.cart-delivery .body .delivery-selector .payment-box {
  background-color: #fff;
  padding: 15px 15px;
  padding-bottom: 5px;
  text-align: left;
}

.cart-delivery .body .delivery-selector .payment-box input {
  margin-right: 8px;
}

.cart-delivery .body .delivery-selector .payment-box .form-group {
  text-align: left;
  color: #666666;
}

.cart-delivery .body .delivery-selector .payment-box span {
  font-size: 14px;
  margin-left: 5px;
}

.cart-delivery .body .time-selector {
  background-color: #fff;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
  padding: 10px 15px;
  height: 56px;
}

.cart-delivery .body .time-selector > span {
  vertical-align: middle;
  line-height: 2.1;
}
.cart-delivery .body .time-selector span.time {
  color: var(--primary-color);
  font-weight: bold;
  font-size: 16px;
  margin-left: 15px;
}

.cart-delivery .body .time-selector span.time .b-icon {
  margin-left: 3px;
}

input {
  display: inline-block;
  width: auto;
  border-radius: 5px;
}

.cart-delivery .delivery-type-selector {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 15px;
  font-weight: bold;
}

.cart-delivery .delivery-type-selector > span {
  width: 50%;
  padding: 8px 15px;
  background-color: #e6e6e6;
}

.cart-delivery .delivery-type-selector > span.active {
  background-color: var(--primary-color);
  color: #fff;
  opacity: 0.8;
}

.cart-delivery .delivery-type-selector > span:first-child {
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
  text-align: right;
}

.cart-delivery .delivery-type-selector > span:last-child {
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  text-align: left;
}

.switch {
  position: relative;
  display: inline-block;
  width: 45px;
  height: 24px;
  margin-right: 10px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(16px);
  -ms-transform: translateX(16px);
  transform: translateX(16px);
}

.quantity-text {
  color: rgba(112, 201, 79, 1);
  font-weight: bold;
}

.hour-picker input {
  margin-top: 4px;
  float: right;
}

.hour-picker > div {
  margin-top: 1vh;
  font-size: 16px;
}

.hour-picker > div .b-icon {
  margin-right: 10px;
  color: #ccc;
}

.hour-picker button {
  width: 100%;
  border-radius: 5px;
  margin-top: 1vh;
  opacity: 0.8;
}
</style>
