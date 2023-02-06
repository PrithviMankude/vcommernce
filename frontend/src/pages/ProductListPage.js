import ProductListPageComponent from './component/ProductListPageComponent.js';
import { useSelector } from 'react-redux';
import axios from 'axios';

const ProductListPage = () => {
  const categories = useSelector((state) => state.category.categories);

  const getProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      return data;
    } catch (err) {
      throw new Error(err.response.data);
    }
  };

  return (
    <ProductListPageComponent
      getProducts={getProducts}
      categories={categories}
    />
  );
};

export default ProductListPage;
