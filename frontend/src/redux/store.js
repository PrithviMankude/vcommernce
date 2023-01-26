import { applyMiddleware } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';

import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers/index';

/*********************************/

import { combineReducers } from '@reduxjs/toolkit';

import { userReducer } from './reducers/userReducer';
import { cartReducer } from './reducers/cartReducer';
import { categoryReducer } from './reducers/categoryReducer';

const reducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  category: categoryReducer,
});

const cartItemsInLocalStorage = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : [];

const initialState = {};

const middleware = [thunk];
const store = configureStore(
  { reducer: reducer },
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
