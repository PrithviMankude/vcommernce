import UserCartDetailsPageComponent from './components/UserCartDetailsPageComponemt';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart } from '../../redux/actions/cartActions';
import axios from 'axios';

const UserCartDetailsPage = () => {
  /*
  const dispatch = useDispatch();
  
  const addToCartHandler = async (productID, count) => {
    dispatch(addToCart(productID, count));
  };

  const removeFromCartHandler = async (productID, quantity, price) => {
    if (window.confirm('Are you sure to remove the product ? ')) {
      dispatch(removeFromCart(productID, quantity, price));
    }
  };
  */
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.cartItems);
  const itemsCount = useSelector((state) => state.cart.itemsCount);
  const cartSubtotal = useSelector((state) => state.cart.cartSubtotal);
  const userInfo = useSelector((state) => state.user.userInfo);

  const getUser = async () => {
    try {
      const { data } = await axios.get('/api/users/profile/' + userInfo._id);

      return data;
    } catch (err) {
      throw new Error(err.response.data);
    }
  };

  const createOrder = async (orderData) => {
    try {
      const { data } = await axios.post('/api/orders', { ...orderData });
      if (data) {
        navigate('/user/order-details/' + data._id);
        return data;
      }
    } catch (err) {
      throw new Error(err.response.data);
    }
  };

  return (
    <UserCartDetailsPageComponent
      cartItems={cartItems}
      itemsCount={itemsCount}
      cartSubtotal={cartSubtotal}
      userInfo={userInfo}
      getUser={getUser}
      createOrder={createOrder}
    />
  );
};

export default UserCartDetailsPage;
