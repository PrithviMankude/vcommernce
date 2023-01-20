import {
  ADD_TO_CART_BEGIN,
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_FAIL,
} from '../constants';

const cartItemsInLocalStorage = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : [];

console.log('In reducerCart:', cartItemsInLocalStorage);

const initialState = {
  cartItems: cartItemsInLocalStorage,
  itemsCount: cartItemsInLocalStorage
    ? cartItemsInLocalStorage.reduce(
        (quantity, item) => Number(item.quantity) + quantity,
        0
      )
    : 0,
  cartSubTotal: cartItemsInLocalStorage
    ? cartItemsInLocalStorage.reduce(
        (price, item) => price + item.price * item.quantity,
        0
      )
    : 0,
  isLoading: false,
  showAlert: false,
  showAlertText: '',

  /*cartItems: cartItemsInLocalStorage,
  itemsCount: cartItemsInLocalStorage
    ? cartItemsInLocalStorage.reduce(
        (quantity, item) => Number(item.quantity) + quantity,
        0
      )
    : 0,
  cartSubTotal: cartItemsInLocalStorage
    ? cartItemsInLocalStorage.reduce(
        (price, item) => price + item.price * item.quantity,
        0
      )
    : 0,
    */
};

//console.log('Cart Reducer :', initialState);

const CART_INITIAL_STATE = {
  cartItems: cartItemsInLocalStorage,
  itemsCount: cartItemsInLocalStorage
    ? cartItemsInLocalStorage.reduce(
        (quantity, item) => Number(item.quantity) + quantity,
        0
      )
    : 0,
  cartSubtotal:cartItemsInLocalStorage
    ? cartItemsInLocalStorage.reduce(
        (price, item) => price + item.price * item.quantity,
        0
      )
    : 0,
};

const cartReducer = (state = CART_INITIAL_STATE, action) => {
  console.log(state);
  const { type, payload } = action;
  switch (type) {
    case ADD_TO_CART_BEGIN:
      return {
        ...state,
        isLoading: true,
      };

    case ADD_TO_CART_SUCCESS:
      const productBeingAddedToCart = action.payload;

      const productAlreadyExistsInState = state.cartItems.find(
        (x) => x.productID === productBeingAddedToCart.productID
      );

      const currentState = { ...state };

      if (productAlreadyExistsInState) {
        currentState.itemsCount = 0;
        currentState.cartSubtotal = 0;
        currentState.cartItems = state.cartItems.map((x) => {
          if (x.productID === productAlreadyExistsInState.productID) {
            currentState.itemsCount += Number(productBeingAddedToCart.quantity);
            const sum =
              Number(productBeingAddedToCart.quantity) *
              Number(productBeingAddedToCart.price);
            currentState.cartSubtotal += sum;
          } else {
            currentState.itemsCount += Number(x.quantity);
            const sum = Number(x.quantity) * Number(x.price);
            currentState.cartSubtotal += sum;
          }
          return x.productID === productAlreadyExistsInState.productID
            ? productBeingAddedToCart
            : x;
        });
      } else {
        currentState.itemsCount += Number(productBeingAddedToCart.quantity);
        const sum =
          Number(productBeingAddedToCart.quantity) *
          Number(productBeingAddedToCart.price);
        currentState.cartSubtotal += sum;
        currentState.cartItems = [...state.cartItems, productBeingAddedToCart];
      }

      return currentState;

    /*
      const productBeingAddedToCart = payload;
      const productAlreadyExists = state.cartItems.find(
        (x) => x.productID === productBeingAddedToCart.productID
      );
      const currentState = { ...state };
      if (productAlreadyExists) {
        currentState.itemsCount = 0;
        currentState.cartSubTotal = 0;
        currentState.cartItems = state.cartItems.map((x) => {
          if (x.productID === productAlreadyExists.productID) {
            currentState.itemsCount += Number(productBeingAddedToCart.quantity);
            const sum =
              Number(productBeingAddedToCart.quantity) *
              Number(productBeingAddedToCart.price);
            currentState.cartSubTotal += sum;
          } else {
            currentState.itemsCount = Number(x.quantity);
            const sum = Number(x.quantity) * Number(x.price);
            currentState.cartSubTotal += sum;
          }
          return x.productID === productAlreadyExists.productID
            ? productBeingAddedToCart
            : x;
        });
      } else {
        currentState.itemsCount = Number(productBeingAddedToCart.quantity);
        const sum =
          Number(productBeingAddedToCart.quantity) *
          Number(productBeingAddedToCart.price);
        currentState.cartSubTotal += sum;
        currentState.cartItems = [...state.cartItems, productBeingAddedToCart];
      }
      currentState.isLoading = false;

      return currentState;

    case ADD_TO_CART_FAIL:
      return {
        isLoading: false,
        showAlert: true,
        showAlertText: payload,
      };
      */

    default:
      return state;
  }
};

export { cartReducer };
