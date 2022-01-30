import {API_BASE_URL} from "@/config";
import axios from 'axios';

export default {
  addProductToCart(context, { productId, colorId, sizeId, quantity }) {
    return axios.post(API_BASE_URL + `/api/baskets/products`,
      { productId, colorId, sizeId, quantity },
      {
        params: { userAccessKey: context.state.userAccessKey }
      })
      .then((response) => {
        context.commit('updateCartProductsData', response.data.items)
        context.commit('syncCartProducts')
      })
  }
}
