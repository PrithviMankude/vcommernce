import OrdersPageComponent from './components/OrdersPageComponent';
import axios from 'axios';

const getOrders = async () => {
  try {
    const { data } = await axios.get('/api/orders/admin');
    return data;
  } catch (err) {
    throw new Error(err.response.data);
  }
};

const AdminOrdersPage = () => {
  return <OrdersPageComponent getOrders={getOrders} />;
};

export default AdminOrdersPage;
