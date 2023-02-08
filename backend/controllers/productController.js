const Product = require('../models/ProductModel');
const recordsPerPage = require('../config/pagination');
const imageValidate = require('../utils/imageValidate');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

//Improve
//Use lodash library, reduce variables
const getProducts = async (req, res, next) => {
  try {
    //filter by price and rating
    let query = {};
    let queryCondition = false;

    let priceQueryCondition = {};
    if (req.query.price) {
      queryCondition = true;
      priceQueryCondition = { price: { $lte: Number(req.query.price) } };
    }

    let ratingQueryCondition = {};
    if (req.query.rating) {
      queryCondition = true;
      ratingQueryCondition = { rating: { $in: req.query.rating.split(',') } };
    }

    //Query products based on category (search bar dropdown). Category is dynamic. /api/products/category/Name
    //Categories can be like Computers/Laptops/Sony etc.. so we need additional ops and match the string starting
    let categoryQueryCondition = {};
    const categoryName = req.params.categoryName || '';
    if (categoryName) {
      queryCondition = true;
      let a = categoryName.replaceAll(',', '/');
      var regEx = new RegExp('^' + a);
      categoryQueryCondition = { category: regEx };
    }

    //Products can also be choosen by category on the sidebar, the inputs will be coming through query(not URL params)
    ///api/products?category=<Name>
    if (req.query.category) {
      queryCondition = true;
      let a = req.query.category.split(',').map((item) => {
        if (item) return new RegExp('^' + item);
      });

      categoryQueryCondition = {
        category: { $in: a },
      };
    }

    /*********************Query through attributes */

    let attrsQueryCondition = [];

    if (req.query.attrs) {
      // attrs=RAM-1TB-2TB-4TB,color-blue-red
      // [ 'RAM-1TB-4TB', 'color-blue', '' ]
      attrsQueryCondition = req.query.attrs.split(',').reduce((acc, item) => {
        if (item) {
          let a = item.split('-');
          let values = [...a];
          values.shift(); // removes first item
          let a1 = {
            attrs: { $elemMatch: { key: a[0], value: { $in: values } } },
          };
          acc.push(a1);
          // console.dir(acc, { depth: null })
          return acc;
        } else return acc;
      }, []);
      //   console.dir(attrsQueryCondition, { depth: null });
      queryCondition = true;
    }

    /****************************************** */

    //From the frontend
    const pageNum = Number(req.query.pageNum) || 1;

    //sort
    let sort = {};
    const sortOption = req.query.sort || '';
    if (sortOption) {
      let sortOpt = sortOption.split('_');
      sort = { [sortOpt[0]]: Number(sortOpt[1]) };
    }

    /***********************************/

    /* Here two searches will be implemented
    1. Search from search tab
    2. Search from search bar after selecting a category
    Both will be coming in as req.params and handles as /:<name> in routes
    */
    //Search Query-- searches the product name and description using text search. Is case insensative
    const searchQuery = req.params.searchQuery || '';

    let searchQueryCondition = {};
    let select = {};
    if (searchQuery) {
      queryCondition = true;
      searchQueryCondition = { $text: { $search: searchQuery } };

      //tells the accuracy of the search query
      select = {
        score: { $meta: 'textScore' },
      };
      //sort based on the accuracy of the search
      sort = {
        score: { $meta: 'textScore' },
      };
    }

    //Build the query object for filtering
    if (queryCondition) {
      query = {
        $and: [
          priceQueryCondition,
          ratingQueryCondition,
          categoryQueryCondition,
          searchQueryCondition,
          ...attrsQueryCondition,
        ],
      };
    }

    /************/

    /******************************** */
    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
      .select(select)
      .skip(recordsPerPage * (pageNum - 1))
      .sort(sort)
      .limit(recordsPerPage);
    res.json({
      products,
      pageNum,
      paginationLinksNumber: Math.ceil(totalProducts / recordsPerPage),
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  //Will populate the reviews too, it will be useful later as it ahs to be done at some point
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews')
      .orFail();
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const getBestsellers = async (req, res, next) => {
  try {
    const products = await Product.aggregate([
      { $sort: { category: 1, sales: -1 } },
      {
        $group: { _id: '$category', doc_with_max_sales: { $first: '$$ROOT' } },
      },
      { $replaceWith: '$doc_with_max_sales' },
      { $match: { sales: { $gt: 0 } } },
      { $project: { _id: 1, name: 1, images: 1, category: 1, description: 1 } },
      { $limit: 3 },
    ]);
    res.json(products);
  } catch (err) {
    next(err);
  }
};

const adminGetProducts = async (req, res, next) => {
  try {
    const products = await Product.find({})
      .sort({ category: 1 })
      .select('name price category');
    return res.json(products);
  } catch (error) {
    next(error);
  }
};

const adminDeleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).orFail();
    await product.remove();
    res.json({ message: 'Product Removed' });
  } catch (error) {
    next(error);
  }
};

const adminCreateProduct = async (req, res, next) => {
  try {
    const product = new Product();
    const { name, description, price, count, category, attributesTable } =
      req.body;

    product.name = name;
    product.description = description;
    product.price = price;
    product.count = count;
    product.category = category;
    if (attributesTable.length > 0) {
      attributesTable.map((item, idx) => {
        product.attrs.push(item);
      });
    }

    await product.save();

    res.json({
      message: 'Product Created',
      productId: product._id,
    });
  } catch (error) {
    next(error);
  }
};

//Improve- array copying, attrs should be added to the existing set not overwrite it
const adminUpdateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).orFail();
    const { name, description, price, count, category, attributesTable } =
      req.body;

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.priceQueryCondition;
    product.count = count || product.count;
    product.category = category || product.category;
    if (attributesTable.length > 0) {
      product.attrs = [];
      attributesTable.map((item) => {
        product.attrs.push(item);
      });
    } else {
      product.attrs = [];
    }
    await product.save();
    res.json({ msg: 'Product updated' });
  } catch (error) {
    next(error);
  }
};

const adminUpload = async (req, res, next) => {
  if (req.query.cloudinary === 'true') {
    try {
      let product = await Product.findById(req.query.productId).orFail();
      product.images.push({ path: req.body.url });
      await product.save();
    } catch (err) {
      next(err);
    }

    return;
  }
  try {
    const uploadDirectory = path.resolve(
      __dirname,
      '../../frontend/',
      'public',
      'images',
      'products'
    );

    let product = await Product.findById(req.query.productId).orFail();

    console.log(req.query.productId);

    if (!req.files || !!req.files.images === false) {
      res.status(400).send('No files were uploaded');
    }

    const validateResult = imageValidate(req.files.images);
    if (validateResult.error) {
      return res.status(400).send(validateResult.error);
    }

    let imagesTable = [];
    if (Array.isArray(req.files.images)) {
      imagesTable = req.files.images;
    } else {
      imagesTable.push(req.files.images);
    }

    for (let image of imagesTable) {
      //uuid for random string generation which will be used as the filename instead of user provided
      var fileName = uuidv4() + path.extname(image.name);
      var uploadPath = uploadDirectory + '/' + fileName;

      //save the path of the images in the db
      product.images.push({ path: '/images/products/' + fileName });

      image.mv(uploadPath, function (err) {
        if (err) {
          return res.status(500).send(err);
        }
      });
    }
    await product.save();

    return res.send('File Uploaded!');
  } catch (error) {
    next(error);
  }
};

const adminDeleteProductImage = async (req, res, next) => {
  const imagePath = decodeURIComponent(req.params.imagePath);
  if (req.query.cloudinary === 'true') {
    try {
      await Product.findOneAndUpdate(
        { _id: req.params.productId },
        { $pull: { images: { path: imagePath } } }
      ).orFail();

      return res.end();
    } catch (err) {
      next(err);
    }
    return;
  }

  try {
    const finalPath = path.resolve('../frontend/public') + imagePath;

    fs.unlink(finalPath, (err) => {
      if (err) {
        res.status(500).send(err);
      }
    });

    await Product.findOneAndUpdate(
      { _id: req.params.productId },
      { $pull: { images: { path: imagePath } } }
    ).orFail();

    return res.end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  getBestsellers,
  adminGetProducts,
  adminDeleteProduct,
  adminCreateProduct,
  adminUpdateProduct,
  adminUpload,
  adminDeleteProductImage,
};
