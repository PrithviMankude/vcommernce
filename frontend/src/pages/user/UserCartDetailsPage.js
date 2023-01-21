import UserCartDetailsPageComponent from './components/UserCartDetailsPageComponemt';

import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart } from '../../redux/actions/cartActions';

const UserCartDetailsPage = () => {
  const dispatch = useDispatch();

  const addToCartHandler = async (productID, count) => {
    dispatch(addToCart(productID, count));
  };

  const removeFromCartHandler = async (productID, quantity, price) => {
    if (window.confirm('Are you sure to remove the product ? ')) {
      dispatch(removeFromCart(productID, quantity, price));
    }
  };

  const cartItems = useSelector((state) => state.cart.cartItems);
  const itemsCount = useSelector((state) => state.cart.itemsCount);
  const cartSubtotal = useSelector((state) => state.cart.cartSubtotal);

  return (
    <UserCartDetailsPageComponent
      cartItems={cartItems}
      itemsCount={itemsCount}
      cartSubtotal={cartSubtotal}
    />
  );
};

export default UserCartDetailsPage;
