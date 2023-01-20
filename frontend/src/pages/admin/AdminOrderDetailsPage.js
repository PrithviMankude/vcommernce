import OrderDetailsPageComponent from './components/OrderDetailsPageComponent';
import axios from 'axios';

const getOrder = async (id) => {
  try {
    const { data } = await axios.get('/api/orders/user/' + id);
    return data;
  } catch (err) {
    throw new Error(err.response.data);
  }
};

const markAsDelivered = async (id) => {
  try {
    const { data } = await axios.put('/api/orders/delivered/' + id);
    if (data) {
      return data;
    }
  } catch (error) {
    throw new Error(error.response.data);
  }
};

const AdminOrderDetailsPage = () => {
  return (
    <OrderDetailsPageComponent
      getOrder={getOrder}
      markAsDelivered={markAsDelivered}
    />
  );
};

export default AdminOrderDetailsPage;
