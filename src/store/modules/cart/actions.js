import { API_BASE_URL } from '@/config';
import axios from 'axios';

export default {
  addProductToCart(context, {
    productId,
    colorId,
    sizeId,
    quantity
  }) {
    return axios.post(API_BASE_URL + `/api/baskets/products`,
      {
        productId,
        colorId,
        sizeId,
        quantity
      },
      {
        params: { userAccessKey: context.state.userAccessKey }
      })
      .then((response) => {
        context.commit('updateCartProductsData', response.data.items);
        context.commit('syncCartProducts');
      });
  },
  loadCart(context) {
    context.commit('updateLoadingStatus', {
      loading: true,
      error: false
    });
    axios
      .get(API_BASE_URL + `/api/baskets`, {
        params: { userAccessKey: context.state.userAccessKey }
      })
      .then(response => {
        if (!context.state.userAccessKey) {
          localStorage.setItem('userAccessKey', response.data.user.accessKey);
          context.commit('updateUserAccessKey', response.data.user.accessKey);
        }
        context.commit('updateCartProductsData', response.data.items);
        context.commit('syncCartProducts');
        context.commit('updateLoadingStatus', {
          loading: false,
          error: false
        });
      })
      .catch((err) => {
        console.log(err);
        context.commit('updateLoadingStatus', {
          loading: false,
          error: true
        });
      });
  },
  updateCartProductAmount(context, {
    basketItemId,
    amount
  }) {
    if (amount < 1) return;
    context.commit('updateCartProductAmount', {
      basketItemId,
      amount
    });
    return new Promise((resolve, reject) => {
      axios.put(API_BASE_URL + `/api/baskets/products`,
        {
          basketItemId: basketItemId,
          quantity: amount
        },
        {
          params: { userAccessKey: context.state.userAccessKey }
        })
        .then((response) => {
          context.commit('updateCartProductsData', response.data.items);
          resolve();
        })
        .catch((err) => {
          console.log(err);
          context.commit('syncCartProducts');
          reject();
        });
    });
  },
  removeCartProduct(context, basketItemId) {
    context.commit('deleteCartProduct', basketItemId);
    return new Promise((resolve, reject) => {
      axios.delete(API_BASE_URL + `/api/baskets/products`, {
        params: {
          userAccessKey: context.state.userAccessKey
        },
        data: {
          basketItemId: basketItemId
        }
      })
        .then((response) => {
          context.commit('updateCartProductsData', response.data.items);
          resolve();
        })
        .catch((err) => {
          console.log(err);
          context.commit('syncCartProducts');
          reject();
        });
    });
  },
  loadOrderInfo(context, orderId) {
    return new Promise((resolve, reject) => {
      axios
        .get(API_BASE_URL + `/api/orders` + orderId, {
          params: { userAccessKey: context.state.userAccessKey }
        })
        .then(response => {
          context.commit('updateOrderInfo', response.data);
          resolve();
        })
        .catch((err) => {
          console.log(err);
          reject();
        });
    });
  },
};
