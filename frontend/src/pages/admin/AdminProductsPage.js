import ProductsPageComponent from './components/ProductsPageComponent';
import axios from 'axios';

const fetchProducts = async () => {
  try {
    const { data } = await axios.get('/api/products/admin');
    return data;
  } catch (err) {
    throw new Error(err.response.data);
  }
};

const deleteProduct = async (productId) => {
  try {
    const { data } = await axios.delete(`/api/products/admin/${productId}`);
    return data;
  } catch (err) {
    throw new Error(err.response.data);
  }
};

const AdminProductsPage = () => {
  return (
    <ProductsPageComponent
      fetchProducts={fetchProducts}
      deleteProduct={deleteProduct}
    />
  );
};

export default AdminProductsPage;
