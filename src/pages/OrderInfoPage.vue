<template>
  <main
    class="content container"
    v-if="loading"
  >
    <LoaderInfo title="Получение информации"/>
  </main>
  <main class="content container" v-else>
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'main' }">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'cart' }">
            Корзина
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Оформление заказа
          </a>
        </li>
      </ul>

      <h1
        class="content__title"
        v-if="orderInfo"
      >
        Заказ оформлен <span>№ {{ orderInfo.id }}</span>
      </h1>
    </div>

    <section class="cart">
      <form
        class="cart__form form"
        action="#"
        method="POST"
      >
        <div class="cart__field">
          <p class="cart__message">
            Благодарим за выбор нашего магазина. На&nbsp;Вашу почту придет письмо с&nbsp;деталями
            заказа.
            Наши менеджеры свяжутся с&nbsp;Вами в&nbsp;течение часа для уточнения деталей доставки.
          </p>

          <ul class="dictionary"
              v-if="orderInfo"
          >
            <li class="dictionary__item">
              <span class="dictionary__key">
                Получатель
              </span>
              <span class="dictionary__value">
                {{ orderInfo.name }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Адрес доставки
              </span>
              <span class="dictionary__value">
                {{ orderInfo.address }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Телефон
              </span>
              <span class="dictionary__value">
                {{ orderInfo.phone }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Email
              </span>
              <span class="dictionary__value">
                {{ orderInfo.email }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Способ оплаты
              </span>
              <span class="dictionary__value">
                картой при получении
              </span>
            </li>
          </ul>
        </div>

        <div class="cart__block">
          <ul
            class="cart__orders"
            v-if="orderPositionsCount"
          >
            <CartProductInfo
              v-for="item in orderProducts"
              :cartItem="item"
              :key="item.id"
            />
          </ul>
          <div
            class="cart__total"
            v-if="orderPositionsCount"
          >
            <p>Доставка: <b>500 ₽</b></p>
            <p>Итого: <b>{{ orderPositionsCount }}</b> {{ infoString }} на сумму
              <b>{{ orderTotalPrice | numberFormat }} ₽</b></p>
          </div>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import LoaderInfo from '@/components/LoaderInfo';
import CartProductInfo from '@/components/CartProductInfo';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import numberFormat from '@/helpers/numberFormat';
import declension from '@/helpers/declension';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

export default {
  data() {
    return {
      loading: false,
    };
  },
  components: {
    CartProductInfo,
    LoaderInfo,
  },
  filters: {
    numberFormat
  },
  computed: {
    ...mapGetters('order', {
      orderInfo: 'getOrderInfo',
      orderProducts: 'orderProducts'
    }),
    ...mapGetters('cart', ['getUserAccessKey']),
    orderPositionsCount() {
      return this.orderProducts ? this.orderProducts.length : 0;
    },
    infoString() {
      return declension([
        'товар',
        'товара',
        'товаров',
      ], this.orderPositionsCount);
    },
    orderTotalPrice() {
      return this.orderProducts.reduce(
        (acc, item) => {
          return acc + item.positionCost;
        }, 0
      );
    }
  },
  methods: {
    ...mapActions('order', [
      'loadDeliveryData',
      'loadPayments'
    ]),
    ...mapMutations('cart', ['resetCart']),
    ...mapMutations('order', ['updateOrderInfo']),
    delivery_price(id) {
      let delivery = this.deliveries.find(del => {
        return del.id === id;
      });
      if (delivery) {
        return delivery.price === '0' ? 'бесплатно' : delivery.price + ' ₽';
      }
    },
    order() {
      this.loading = true;
      this.formError = {};
      this.formErrorMessage = '';
      axios
        .post(API_BASE_URL + `/api/orders`, {
          ...this.formData
        }, {
          params: {
            userAccessKey: this.getUserAccessKey
          }
        })
        .then(response => {
          this.resetCart();
          this.formData = {};
          this.formData.deliveryTypeId = 0;
          this.formData.paymentTypeId = 0;
          this.updateOrderInfo(response.data);
          this.$router.push({
            name: 'orderInfo',
            params: { id: response.data.id }
          });
        })
        .catch(error => {
          this.formErrorMessage = error.response.data.error.message;
          this.formError = error.response.data.error.request || {};
        })
        .then(() => this.loading = false);
    },
  },
  watch: {
    currentPayments() {
      if (!this.formData.paymentTypeId && this.currentPayments) {
        this.formData.paymentTypeId = this.currentPayments[0].id;
      }
    },
    'formData.deliveryTypeId': {
      deep: true,
      handler(value) {
        if (value && this.currentPayments[0]) {
          this.formData.paymentTypeId = this.currentPayments[0].id;
        } else {
          this.formData.paymentTypeId = null;
        }
      }
    }
  },
  async created() {
    await this.loadDeliveryData();
    await this.loadPayments();
    this.formData.deliveryTypeId = this.deliveries[0].id;
  },
};
</script>
