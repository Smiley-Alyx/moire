import { API_BASE_URL } from '@/config';
import axios from 'axios';

export default {
  loadOrderInfo(context, {
    orderId,
    userAccessKey
  }) {
    return new Promise((resolve, reject) => {
      axios
        .get(API_BASE_URL + `/api/orders/` + orderId, {
          params: { userAccessKey }
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
  loadDeliveryData(context) {
    return new Promise((resolve, reject) => {
      axios
        .get(API_BASE_URL + `/api/deliveries`)
        .then((response) => {
          context.commit('setDeliveryData', response.data);
          resolve();
        })
        .catch((err) => {
          console.log(err);
          context.commit('setDeliveryData', null);
          reject();
        });
    });
  },
  loadPayments(context) {
    return new Promise((resolve, reject) => {
      let deliveries = context.state.deliveryData;
      let payments = [];
      deliveries.forEach(deliveryItem => {
        axios
          .get(API_BASE_URL + `/api/payments`, {
            params: {
              deliveryTypeId: deliveryItem.id
            }
          })
          .then(result => payments.push(
            {
              items: result.data,
              deliveryTypeId: deliveryItem.id
            }))
          .catch((err) => {
            console.log(err);
            payments = [];
            reject();
          })
          .then(() => {
            context.commit('setPayments', payments);
          });
      });
      resolve();
    });
  },
};
