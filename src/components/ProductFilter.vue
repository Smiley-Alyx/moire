<template>
  <aside class="filter">
    <h2 class="filter__title">Фильтры</h2>

    <form class="filter__form form" action="#" method="get" @submit.prevent="submit">
      <fieldset class="form__block">
        <legend class="form__legend">Цена</legend>
        <label class="form__label form__label--price">
          <input class="form__input" type="text" name="min-price" v-model.number="currentPriceFrom">
          <span class="form__value">От</span>
        </label>
        <label class="form__label form__label--price">
          <input class="form__input" type="text" name="max-price" v-model.number="currentPriceTo">
          <span class="form__value">До</span>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Категория</legend>
        <label class="form__label form__label--select">
          <select class="form__select" type="text" name="category" v-model="currentCategoryId">
            <option value="0">Все категории</option>
            <option
              :value="category.id"
              v-for="category in categories"
              :key="category.id"
            >{{category.title}}</option>
          </select>
        </label>
      </fieldset>

      <fieldset class="form__block">
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
                :checked="color.id == currentColorId"
                v-model="currentColors"
              >
              <span class="colors__value" :style="{ backgroundColor: color.code }" :title="color.title"></span>
            </label>
          </li>
        </ul>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Материал</legend>
        <ul class="check-list">
          <li class="check-list__item" v-for="material in materials" :key="material.id">
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
          <li class="check-list__item" v-for="season in seasons" :key="season.id">
            <label class="check-list__label">
              <input
                class="check-list__check sr-only"
                type="checkbox"
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
import axios from "axios";
import {API_BASE_URL} from "../config";

export default {
  components: { BaseSubmit },
  data() {
    return {
      currentCategoryId: 0,
      currentMaterials: [],
      currentSeasons: [],
      currentColorList: [],
      page: 0,
      currentPriceFrom: 0,
      currentPriceTo: 0,

      categoriesData: null,
      materialsData: null,
      seasonsData: null,
      colorsData: null,
    };
  },
  props: [
    'categoryId',
    'materialsList',
    'seasonsList',
    'colorList',
    'priceFrom',
    'priceTo',
  ],
  computed: {
    categories() {
      return this.categoriesData ? this.categoriesData.items : [];
    },
    colors() {
      return this.colorsData ? this.colorsData.items : [];
    },
    materials() {
      return this.materialsData ? this.materialsData.items : [];
    },
    seasons() {
      return this.seasonsData ? this.seasonsData.items : [];
    },
  },
  watch: {
    priceFrom(value) {
      this.currentPriceFrom = value;
    },
    priceTo(value) {
      this.currentPriceTo = value;
    },
    categoryId(value) {
      this.currentCategoryId = value;
    },
    colorList(value) {
      this.currentColorList = value;
    },
    seasonsList(value) {
      this.currentSeasons = value;
    },
    materialsList(value) {
      this.currentMaterials = value;
    },
  },
  methods: {
    submit() {
      this.$emit('update:categoryId', this.currentCategoryId);
      this.$emit('update:materialsList', this.currentMaterials);
      this.$emit('update:seasonsList', this.currentSeasons);
      this.$emit('update:colorList', this.currentColorList);
      this.$emit('update:page', 1);
      this.$emit('update:priceFrom', this.currentPriceFrom);
      this.$emit('update:priceTo', this.currentPriceTo);
    },
    reset() {
      this.$emit('update:categoryId', 0);
      this.$emit('update:materialsList', []);
      this.$emit('update:seasonsList', []);
      this.$emit('update:colorList', []);
      this.$emit('update:page', 1);
      this.$emit('update:priceFrom', 0);
      this.$emit('update:priceTo', 0);
    },
    loadCategories() {
      axios(API_BASE_URL + `/api/productCategories`)
        .then(response => this.categoriesData = response.data);
    },
    loadColors() {
      axios(API_BASE_URL + `/api/colors`)
        .then(response => this.colorsData = response.data);
    },
    loadMaterials() {
      axios(API_BASE_URL + `/api/materials`)
        .then(response => this.materialsData = response.data);
    },
    loadSeasons() {
      axios(API_BASE_URL + `/api/seasons`)
        .then(response => this.seasonsData = response.data);
    },
  },
  created() {
    this.loadCategories();
    this.loadColors();
    this.loadMaterials();
    this.loadSeasons();
  },
};
</script>
