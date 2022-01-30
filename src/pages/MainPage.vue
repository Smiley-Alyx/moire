<template>
  <div>
    <main class="content container">
      <div class="content__top content__top--catalog">
        <h1 class="content__title">
          Каталог
        </h1>
        <span class="content__info">
          {{ countProductsString }}
        </span>
      </div>

      <div class="content__catalog">
        <ProductFilter
          :category-id.sync="filterCategoryId"
          :materials-list.sync="filterMaterials"
          :seasons-list.sync="filterSeasons"
          :color-list.sync="filterColors"
          :page.sync="page"
          :price-from.sync="filterPriceFrom"
          :price-to.sync="filterPriceTo"
        />
        <section class="catalog">
          <div v-if="productsLoading">Загрузка товаров...</div>
          <div v-if="productsLoadingFailed">
            Загрузка товаров произошла ошибка!
            <button @click.prevent="loadProducts">Попробовать ещё раз!</button>
          </div>
          <ProductList v-if="!productsLoading" :products="products"/>
          <BasePagination
            v-model="page"
            :count="countProducts"
            :per-page="productPerPage"
          />
        </section>

      </div>
    </main>
  </div>
</template>

<script>
import ProductList from '@/components/ProductList.vue';
import BasePagination from '@/components/BasePagination.vue';
import ProductFilter from '@/components/ProductFilter.vue';
import declension from "@/helpers/declension";
import axios from 'axios';
import {API_BASE_URL} from "../config";

export default {
  components: {
    ProductFilter,
    ProductList,
    BasePagination,
  },
  data() {
    return {
      filterPriceFrom: 0,
      filterPriceTo: 0,
      filterCategoryId: 0,
      filterColors: [],
      filterMaterials: [],
      filterSeasons: [],
      page: 1,
      productPerPage: 6,
      productsData: null,
      productsLoading: false,
      productsLoadingFailed: false,
    };
  },
  computed: {
    products() {
      return this.productsData ? this.productsData.items : [];
    },
    countProducts() {
      return this.productsData
        ? this.productsData.pagination.total
        : 0;
    },
    countProductsString() {
      return (
        this.countProducts +
        " " +
        declension([
          'товар',
          'товара',
          'товаров',
        ], this.countProducts)
      );
    },
  },
  methods: {
    loadProducts() {
      this.productsLoading = true;

      clearTimeout(this.loadProductsTimer);
      this.loadProductsTimer = setTimeout(() => {
        axios
          .get(API_BASE_URL + `/api/products`, {
            params: {
              categoryId: this.filterCategoryId,
              materialIds: this.filterMaterials,
              seasonIds: this.filterSeasons,
              colorIds: this.filterColors,
              page: this.page,
              limit: this.productPerPage,
              minPrice: this.filterPriceFrom,
              maxPrice: this.filterPriceTo,
            }
          })
          .then((response) => {
            this.productsData = response.data;
          })
          .catch(() => {
            this.productsLoadingFailed = true;
          })
          .then(() => {
            this.productsLoading = false;
          });
      }, 0);
    },
  },
  watch: {
    page() {
      this.loadProducts();
    },
    filterPriceFrom() {
      this.loadProducts();
    },
    filterPriceTo() {
      this.loadProducts();
    },
    filterCategoryId() {
      this.loadProducts();
    },
  },
  created() {
    this.loadProducts();
  },
};
</script>
