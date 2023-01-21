import CartPageComponent from './component/CartPageComponent';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart } from '../redux/actions/cartActions';

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const cartSubtotal = useSelector((state) => state.cart.cartSubtotal);

  const dispatchToCart = async ({ productID, count }) => {
    dispatch(addToCart(productID, count));
  };

  const dispatchCartRemoveHandler = async (productID, quantity, price) => {
    if (window.confirm('Are you sure to remove the product')) {
      dispatch(removeFromCart(productID, quantity, price));
    }
  };

  return (
    <CartPageComponent
      dispatchToCart={dispatchToCart}
      dispatchCartRemoveHandler={dispatchCartRemoveHandler}
      cartItems={cartItems}
      cartSubtotal={cartSubtotal}
    />
  );
};

export default CartPage;
