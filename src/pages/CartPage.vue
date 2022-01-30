<template>
  <main
    class="content container"
    v-if="cartLoading"
  >
    <LoaderInfo title="Загрузка корзины"/>
  </main>

  <main
    class="content container"
    v-else-if="cartLoadingError"
  >
    <LoaderErrorInfo title='Ошибка при загрузке корзины...' v-on:reload="reload"/>
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
          <a class="breadcrumbs__link">
            Корзина
          </a>
        </li>
      </ul>

      <h1 class="content__title">
        Корзина
      </h1>
      <span class="content__info">
        {{ cartCount }}
      </span>
    </div>

    <section class="cart">
      <form
        class="cart__form form"
        action="#"
        method="POST"
      >
        <div class="cart__field">
          <ul class="cart__list">
            <CartItem
              v-for="item in products"
              :key="item.productId"
              :item="item"
            />
          </ul>
        </div>

        <div class="cart__block">
          <p class="cart__desc">
            Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе
          </p>
          <p class="cart__price">
            Итого: <span>{{ totalPrice | numberFormat }} ₽</span>
          </p>

          <router-link
            tag="button"
            class="cart__button button button--primery"
            type="submit"
            :to="{name: 'order'}"
          >
            Оформить заказ
          </router-link>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import { mapGetters, mapActions} from 'vuex';
import CartItem from '@/components/CartItem.vue';
import LoaderInfo from '@/components/LoaderInfo';
import LoaderErrorInfo from '@/components/LoaderErrorInfo';
import numberFormat from '@/helpers/numberFormat';
import declension from '@/helpers/declension';

export default {
  filters: {
    numberFormat,
  },
  components: {
    CartItem,
    LoaderInfo,
    LoaderErrorInfo,
  },
  computed: {
    ...mapGetters("cart", {
      products: 'cartDetailProducts',
      totalPrice: 'cartTotalPrice',
      cartPositionsCount: 'cartPositionsCount',
      cartLoading: 'getCartLoading',
      cartLoadingError: 'getCartLoadingError'
    }),
    cartCount() {
      return this.cartPositionsCount + ' ' + declension([
        'товар',
        'товара',
        'товаров',
      ], this.cartPositionsCount);
    }
  },
  methods: {
    ...mapActions(['loadCart']),
    reload() {
      this.loadCart()
    }
  },
};
</script>
