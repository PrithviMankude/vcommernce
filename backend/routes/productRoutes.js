const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getBestsellers,
  adminGetProducts,
  adminDeleteProduct,
  adminCreateProduct,
  adminUpdateProduct,
  adminUpload,
  adminDeleteProductImage,
} = require('../controllers/productController');

const {
  verifyIsLoggedIn,
  verifyIsAdmin,
} = require('../middleware/verifyAuthToken');

//base URL: /api/products

router.get('/', getProducts);
router.get('/category/:categoryName', getProducts);
router.get('/category/:categoryName/search/:searchQuery', getProducts);
router.get('/search/:searchQuery', getProducts);
router.get('/bestsellers', getBestsellers);
//This has to be last
router.get('/get-one/:id', getProductById);

//admin routes
//No common route handler for admin routes, so using it as a MW to force all the routes to check
router.use(verifyIsLoggedIn);
router.use(verifyIsAdmin);
router.get('/admin', adminGetProducts);
router.delete('/admin/:id', adminDeleteProduct);
router.put('/admin/:id', adminUpdateProduct);
router.delete('/admin/image/:imagePath/:productId', adminDeleteProductImage);
router.post('/admin/upload', adminUpload);
router.post('/admin', adminCreateProduct);

module.exports = router;
