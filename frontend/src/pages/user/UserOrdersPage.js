import UserOrdersPageComponent from './components/UserOrdersPageComponent';
import { Row, Col, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UserOrdersPage = () => {
  const getOrders = async () => {
    try {
      const { data } = await axios.get('/api/orders');
      console.log(data);
      return data;
    } catch (err) {
      throw new Error(err.response.data);
    }
  };

  return <UserOrdersPageComponent getOrders={getOrders} />;
};

export default UserOrdersPage;
