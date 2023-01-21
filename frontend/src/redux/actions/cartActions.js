import axios from 'axios';
import {
  ADD_TO_CART_BEGIN,
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_FAIL,
  REMOVE_FROM_CART,
} from '../constants';

const addToCart = (productId, quantity) => async (dispatch, getState) => {
  console.log('In cart actions: productId, quantity', productId, quantity);
  try {
    dispatch({ type: ADD_TO_CART_BEGIN });

    const { data } = await axios.get(`/api/products/get-one/${productId}`);

    console.log('In cartActions:', data);

    dispatch({
      type: ADD_TO_CART_SUCCESS,
      payload: {
        productID: data._id,
        name: data.name,
        price: data.price,
        image: data.images[0] ?? null,
        count: data.count,
        quantity,
      },
    });

    //If we store data here it will be a single obj but we need all the cart Items which is an array in reducer
    localStorage.setItem('cart', JSON.stringify(getState().cart.cartItems));
  } catch (err) {
    let errMsg = '';
    if (err.response.status === 500) {
      errMsg = 'Internal Server Error';
    } else {
      errMsg = err.response.data;
    }

    console.log(errMsg);

    dispatch({ type: ADD_TO_CART_FAIL, payload: errMsg });
  }
};

const removeFromCart =
  (productID, quantity, price) => async (dispatch, getState) => {
    try {
      dispatch({
        type: REMOVE_FROM_CART,
        payload: { productID, quantity, price },
      });
      localStorage.setItem('cart', JSON.stringify(getState().cart.cartItems));
    } catch (err) {
      throw new Error(err.response.data);
    }
  };

export { addToCart, removeFromCart };
