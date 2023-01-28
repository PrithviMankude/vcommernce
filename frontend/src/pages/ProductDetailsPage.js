import ProductDetailsPageComponent from './component/ProductDetailsPageComponent';
import { addToCart } from '../redux/actions/cartActions';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const getProductDetails = async (id) => {
  const { data } = await axios.get(`/api/products/get-one/${id}`);
  console.log(data);
  return data;
};

const writeReviewApiRequest = async (productId, formInputs) => {
  const { data } = await axios.post(`/api/users/review/${productId}`, {
    ...formInputs,
  });
  return data;
};

const ProductDetailsPage = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);

  const addToCartHandler = async ({ id, quantity }) => {
    dispatch(addToCart(id, quantity));
  };

  return (
    <ProductDetailsPageComponent
      addToCartHandler={addToCartHandler}
      getProductDetails={getProductDetails}
      writeReviewApiRequest={writeReviewApiRequest}
      userInfo={userInfo}
    />
  );
};

export default ProductDetailsPage;
