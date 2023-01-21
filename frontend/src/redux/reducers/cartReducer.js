import {
  ADD_TO_CART_BEGIN,
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_FAIL,
  REMOVE_FROM_CART,
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
};

const CART_INITIAL_STATE = {
  cartItems: cartItemsInLocalStorage,
  itemsCount: cartItemsInLocalStorage
    ? cartItemsInLocalStorage.reduce(
        (quantity, item) => Number(item.quantity) + quantity,
        0
      )
    : 0,
  cartSubtotal: cartItemsInLocalStorage
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
    case REMOVE_FROM_CART:
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (x) => x.productID !== action.payload.productID
        ),
        itemsCount: state.itemsCount - action.payload.quantity,
        cartSubtotal:
          state.cartSubtotal - action.payload.quantity * action.payload.price,
      };

    default:
      return state;
  }
};

export { cartReducer };
