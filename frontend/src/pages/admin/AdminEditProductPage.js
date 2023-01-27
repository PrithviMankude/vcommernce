import EditProductPageComponent from './components/EditProductPageComponent';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { saveAttributesToCategory } from '../../redux/actions/categoriesActions';

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
  const reduxDispatch = useDispatch();

  const imageDeleteHandler = async (imagePath, productId) => {
    let encoded = encodeURIComponent(imagePath);
    await axios.delete(`/api/products/admin/image/${encoded}/${productId}`);
  };
  const uploadImageHandler = async (images, productId) => {
    const formData = new FormData();
    Array.from(images).forEach((image) => {
      formData.append('images', image);
    });
    console.log('FormData: ', formData);
    await axios.post(
      '/api/products/admin/upload?productId=' + productId,
      formData
    );
  };

  return (
    <EditProductPageComponent
      categories={categories}
      fetchProduct={fetchProduct}
      updateProduct={updateProduct}
      saveAttributeToCatDoc={saveAttributesToCategory}
      reduxDispatch={reduxDispatch}
      imageDeleteHandler={imageDeleteHandler}
      uploadHandler={uploadImageHandler}
    />
  );
};

export default AdminEditProductPage;
