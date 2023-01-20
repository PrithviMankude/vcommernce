import { applyMiddleware } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';

import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers/index';

/*********************************/

import { combineReducers } from '@reduxjs/toolkit';

import { userReducer } from './reducers/userReducer';
import { cartReducer } from './reducers/cartReducer';
import { deleteThis } from './reducers/delete';

const reducer = combineReducers({
  delete: deleteThis,
  user: userReducer,
  cart: cartReducer,
});

const cartItemsInLocalStorage = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : [];

const initialState = {
  cart: {
    //cartItems: cartItemsInLocalStorage,
    itemsCount: 5,
    cartSubTotal: 5,
  },
};

const middleware = [thunk];
const store = configureStore(
  { reducer: reducer },
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
