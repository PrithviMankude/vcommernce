import UserOrderDetailsPageComponent from './components/UserOrderDetailsPageComponent';
import { useSelector } from 'react-redux';
import axios from 'axios';

const UserOrderDetailsPage = () => {
  const userInfo = useSelector((state) => state.user.userInfo);

  const cartItems = useSelector((state) => state.cart.cartItems);
  const itemsCount = useSelector((state) => state.cart.itemsCount);
  const cartSubtotal = useSelector((state) => state.cart.cartSubtotal);

  const getOrder = async (orderId) => {
    try {
      const { data } = await axios.get('/api/orders/user/' + orderId);
      return data;
    } catch (err) {
      throw new Error(err.response.data);
    }
  };

  const getUser = async () => {
    try {
      const { data } = await axios.get('/api/users/profile/' + userInfo._id);

      return data;
    } catch (err) {
      throw new Error(err.response.data);
    }
  };

  return (
    <UserOrderDetailsPageComponent
      userInfo={userInfo}
      getUser={getUser}
      getOrder={getOrder}
    />
  );
};

export default UserOrderDetailsPage;
