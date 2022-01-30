<template>
  <aside class="filter">
    <h2 class="filter__title">Фильтры</h2>

    <form class="filter__form form" action="#" method="get" @submit.prevent="submit">
      <fieldset class="form__block">
        <legend class="form__legend">Цена</legend>
        <label class="form__label form__label--price">
          <input
            class="form__input"
            type="text"
            name="min-price"
            placeholder="0"
            v-model.number="currentPriceFrom"
          >
          <span class="form__value">От</span>
        </label>
        <label class="form__label form__label--price">
          <input
            class="form__input"
            type="text"
            name="max-price"
            placeholder="0"
            v-model.number="currentPriceTo"
          >
          <span class="form__value">До</span>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Категория</legend>
        <label class="form__label form__label--select">
          <select
            class="form__select"
            type="text"
            name="category"
            v-model="currentCategory"
          >
            <option value="0">Все категории</option>
            <option
              :value="category.id"
              v-for="category in categories"
              :key="category.id"
            >{{category.title}}</option>
          </select>
        </label>
      </fieldset>

<!--      <fieldset class="form__block">
        <legend class="form__legend">Цвет</legend>
        <ul class="colors">
          <li class="colors__item" v-for="color in colors" :key="color.id">
            <label class="colors__label">
              <input
                class="colors__radio sr-only"
                type="radio"
                name="color"
                :value="color.id"
                :title="color.title"
                v-model.number="currentColors"
              >
              <span class="colors__value" :style="{ backgroundColor: color.code }" :title="color.title"></span>
            </label>
          </li>
        </ul>
      </fieldset>-->

      <fieldset class="form__block">
        <legend class="form__legend">Материал</legend>
        <ul class="check-list">
          <li class="check-list__item"
              v-for="material in materials"
              :key="material.id"
          >
            <label class="check-list__label">
              <input
                class="check-list__check sr-only"
                type="checkbox"
                name="material"
                :id="material.id"
                :value="material.id"
                v-model.number="currentMaterials"
              >
              <span class="check-list__desc">
                {{ material.title }}
                <span>({{ material.productsCount }})</span>
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Коллекция</legend>
        <ul class="check-list">
          <li class="check-list__item"
              v-for="season in seasons"
              :key="season.id"
          >
            <label class="check-list__label">
              <input
                class="check-list__check sr-only"
                type="checkbox"
                name="collection"
                :id="season.id"
                :value="season.id"
                v-model.number="currentSeasons"
              >
              <span class="check-list__desc">
                  {{ season.title }}
                  <span>({{ season.productsCount }})</span>
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <BaseSubmit
        class="filter__submit button button--primery"
        title="Применить"
        :loader="loading"
      />
      <button
        class="filter__reset button button--second"
        type="button"
        @click="reset"
      >
        Сбросить
      </button>
    </form>
  </aside>
</template>

<script>
import BaseSubmit from '@/components/BaseSubmit';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'ProductFilter',
  components: { BaseSubmit },
  data() {
    return {
      currentPriceFrom: "",
      currentPriceTo: "",
      currentCategory: 0,
      //currentColors: [],
      currentSeasons: [],
      currentMaterials: [],
    }
  },
  props: [
    'priceFrom',
    'priceTo',
    'categoryId'
  ],
  computed: {
    ...mapGetters("catalog", {
      categories: "getProductCategories",
      //colors: "getColors",
      seasons: "getSeasons",
      materials: "getMaterials",
      loading: "getProductsLoading",
    }),
  },
  watch: {
    priceFrom(value) {
      this.currentPriceFrom = value
    },
    priceTo(value) {
      this.currentPriceTo = value
    },
    categoryId(value) {
      this.currentCategory = value
    },
  },
  methods: {
    ...mapActions("catalog", [
      "loadProductCategories",
      //"loadColors",
      "loadSeasons",
      "loadMaterials"
    ]),
    submit() {
      this.$emit("updateFilter", {
        priceFrom : this.currentPriceFrom,
        priceTo : this.currentPriceTo,
        categoryId : this.currentCategory,
        //colors : this.currentColors,
        seasons : this.currentSeasons,
        materials : this.currentMaterials,
      });
    },
    reset() {
      this.$emit("updateFilter", {
        priceFrom : "",
        priceTo : "",
        categoryId : 0,
        //colors : [],
        seasons : [],
        materials : [],
      });
      this.currentSeasons = [];
      this.currentMaterials = [];
    },
  },
  created() {
    this.loadProductCategories();
    //this.loadColors();
    this.loadMaterials();
    this.loadSeasons();
  },
};
</script>
