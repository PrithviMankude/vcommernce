import CreateProductPageComponent from './components/CreateProductPageComponent';
import axios from 'axios';

const createProduct = async (formInputs) => {
  const { data } = await axios.post('/api/products/admin', { ...formInputs });
  return data;
};

const upLoadImage = async (images, productId) => {
  const formData = new FormData();
  Array.from(images).forEach((image) => {
    formData.append('images', image);
  });
  await axios.post(
    '/api/products/admin/upload?productId=' + productId,
    formData
  );
};

const uploadImagesCloudinary = async (images, productId) => {
  const url = 'https://api.cloudinary.com/v1_1/dsnccybfa/image/upload';
  const formData = new FormData();
  for (let i = 0; i < images.length; i++) {
    let file = images[i];
    formData.append('file', file);
    formData.append('upload_preset', 'wtox3imd');
    fetch(url, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        axios.post(
          '/api/products/admin/upload?cloudinary=true&productId=' + productId,
          data
        );
      });
  }
};

const AdminCreateProductPage = () => {
  return (
    <CreateProductPageComponent
      createProductApiRequest={createProduct}
      uploadImagesApiRequest={upLoadImage}
      uploadImagesCloudinaryApiRequest={uploadImagesCloudinary}
    />
  );
};

export default AdminCreateProductPage;
