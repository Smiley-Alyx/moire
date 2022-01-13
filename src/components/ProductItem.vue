<template>
  <li class="catalog__item">
    <router-link
      class="catalog__pic"
      href="#"
      :to="{name: 'product', params: {id: product.id}}"
    >
      <img :src="image" :alt="product.title">
    </router-link>

    <h3 class="catalog__title">
      <router-link :to="{name: 'product', params: {id: product.id}}">
        {{ product.title }}
      </router-link>
    </h3>

    <span class="catalog__price">
      {{ product.price | numberFormat }} ₽
    </span>

    <ColorPicker
      class="colors colors--black"
      :colors="product.colors"
      :currentColor.sync="currentColor"
      :productId="product.id"
    />
  </li>
</template>

<script>
import gotoPage from '@/helpers/gotoPage';
import numberFormat from '@/helpers/numberFormat';
import ColorPicker from '@/components/ColorPicker';

export default {
  data() {
    return {
      currentColor: '',
    };
  },
  filters: {
    numberFormat,
  },
  computed: {
    image() {
      let colorId = this.product.colors.findIndex((color) => {
        return color.id === this.currentColor;
      });
      console.log(this.currentColor);
      console.log(this.product.id);
      console.log(colorId);
      return this.product.colors[colorId].gallery
        ? this.product.colors[colorId].gallery[0].file.url
        : "/img/not_image.png";
    },
  },
  methods: {
    gotoPage,
  },
  created() {
    this.currentColor = this.product.colors[0].id;
  },
  props: [
    'product',
  ],
  components: {
    ColorPicker,
  },
};
</script>
