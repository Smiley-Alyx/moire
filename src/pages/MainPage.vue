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
          :priceFrom="filterPriceFrom"
          :priceTo="filterPriceTo"
          :categoryId="filterCategory"
          :seasons="filterSeasons"
          :materials="filterMaterials"
          @updateFilter="updateFilter"
        />
        <section class="catalog">
          <div v-if="productsLoading">
            Загрузка товаров
          </div>
          <div v-if="productsLoadingFailed">
            <LoaderErrorInfo
              title="Ошибка при загрузке товаров..."
              v-on:reload="reload"
            />
          </div>
          <ProductList v-if="!productsLoading" :products="products"/>
          <BasePagination
            v-model="page"
            :count="countProducts"
            :per-page="productsPerPage"
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
import LoaderErrorInfo from '@/components/LoaderErrorInfo';
import declension from "@/helpers/declension";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    ProductFilter,
    ProductList,
    BasePagination,
    LoaderErrorInfo,
  },
  computed: {
    page: {
      get() {
        return this.$store.state.catalog.page;
      },
      set(value) {
        this.$store.commit("catalog/setPage", value);
      },
    },
    filterPriceFrom: {
      get() { return this.$store.getters['catalog/getFilterPriceFrom'] },
      set(value) { this.$store.commit("catalog/setFilterPriceFrom", value);},
    },
    filterPriceTo: {
      get() { return this.$store.getters['catalog/getFilterPriceTo'] },
      set(value) { this.$store.commit("catalog/setFilterPriceTo", value);},
    },
    filterCategory: {
      get() { return this.$store.getters['catalog/getFilterCategory'] },
      set(value) { this.$store.commit("catalog/setFilterCategory", value);},
    },
    /*
    filterColors: {
      get() { return this.$store.getters['catalog/getFilterColors'] },
      set(value) { this.$store.commit("catalog/setFilterColors", value);},
    },
    */
    filterSeasons: {
      get() { return this.$store.getters['catalog/getFilterSeasons'] },
      set(value) { this.$store.commit("catalog/setFilterSeasons", value);},
    },
    filterMaterials: {
      get() { return this.$store.getters['catalog/getFilterMaterials'] },
      set(value) { this.$store.commit("catalog/setFilterMaterials", value);},
    },
    ...mapGetters("catalog", {
      productsData: "getProductsData",
      productsLoading: "getProductsLoading",
      productsLoadingFailed: "getProductsLoadingFailed",
      currentPage: "getPage",
      productsPerPage: "getProductsPerPage",
      countProducts: "getCountProducts",
    }),
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
    products() {
      return this.productsData ? this.productsData.items : []
    },
  },
  methods: {
    ...mapActions("catalog", ["loadProducts"]),
    reload() {
      this.loadProducts()
    },
    updateFilter(newFilter) {
      this.filterPriceFrom = newFilter.priceFrom;
      this.filterPriceTo = newFilter.priceTo;
      this.filterCategory = newFilter.categoryId;
      //this.filterColors = newFilter.colors;
      this.filterSeasons = newFilter.seasons;
      this.filterMaterials = newFilter.materials;
      this.loadProducts()
    }
  },
  watch: {
    countProducts() {
      this.page = 1;
    },
    page() {
      this.loadProducts();
    },
  },
  created() {
    this.loadProducts()
  },
};
</script>
