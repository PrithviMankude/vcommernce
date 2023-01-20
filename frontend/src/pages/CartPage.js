import CartPageComponent from './component/CartPageComponent';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../redux/actions/cartActions';

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const cartSubtotal = useSelector((state) => state.cart.cartSubtotal);

  const dispatchToCart = async ({ productID, count }) => {
    dispatch(addToCart(productID, count));
  };

  return (
    <CartPageComponent
      dispatchToCart={dispatchToCart}
      cartItems={cartItems}
      cartSubtotal={cartSubtotal}
    />
  );
};

export default CartPage;
