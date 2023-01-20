import ProductListPageComponent from './component/ProductListPageComponent.js';
import axios from 'axios';

const ProductListPage = () => {
  const getProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      return data;
    } catch (err) {
      throw new Error(err.response.data);
    }
  };

  return <ProductListPageComponent getProducts={getProducts} />;
};

export default ProductListPage;
