import ProductDetailsPageComponent from './component/ProductDetailsPageComponent';
import { addToCart } from '../redux/actions/cartActions';
import { useDispatch } from 'react-redux';

const ProductDetailsPage = () => {
  const dispatch = useDispatch();

  const addToCartHandler = async ({ id, quantity }) => {
    dispatch(addToCart(id, quantity));
  };

  return <ProductDetailsPageComponent addToCartHandler={addToCartHandler} />;
};

export default ProductDetailsPage;
