import EditProductPageComponent from './components/EditProductPageComponent';
import axios from 'axios';
import { useSelector } from 'react-redux';

const fetchProduct = async (productId) => {
  try {
    const { data } = await axios.get(`/api/products/get-one/${productId}`);
    return data;
  } catch (err) {
    throw new Error(err.response.data);
  }
};

const updateProduct = async (productId, formInputs) => {
  try {
    console.log('In update PUT request');
    const { data } = await axios.put(`/api/products/admin/${productId}`, {
      ...formInputs,
    });
    console.log('Data:', data);
    return data;
  } catch (err) {
    throw new Error(err.response.data);
  }
};

const AdminEditProductPage = () => {
  const { categories } = useSelector((state) => state.category);

  return (
    <EditProductPageComponent
      categories={categories}
      fetchProduct={fetchProduct}
      updateProduct={updateProduct}
    />
  );
};

export default AdminEditProductPage;
