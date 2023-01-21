const Order = require('../models/OrderModel');
const Product = require('../models/ProductModel');
const ObjectId = require('mongodb').ObjectId;

const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: ObjectId(req.user._id) });
    res.status(200).send(orders);
  } catch (err) {
    next(err);
  }
};

const getOrder = async (req, res, next) => {
  try {
    console.log(req.params.id);
    const order = await Order.findById(req.params.id)
      .populate('user', '-password -isAdmin -_id -__v -createdAt -updatedAt')
      .orFail();

    res.send(order);
  } catch (err) {
    next(err);
  }
};

const createOrder = async (req, res, next) => {
  try {
    const { orderTotal, cartItems, paymentMethod } = req.body;
    if (!orderTotal || !cartItems || !paymentMethod) {
      return res.status(400).send('All fields are required');
    }

    let ids = cartItems.map((item) => {
      return item.productId;
    });

    let qty = cartItems.map((item) => {
      return Number(item.quantity);
    });

    /* For fetching the sales only */
    const product = await Product.find({ _id: { $in: ids } }).then(
      (products) => {
        products.forEach(function (product, idx) {
          product.sales = qty[idx];
          product.save();
        });
      }
    );

    const order = new Order({
      user: ObjectId(req.user._id),
      orderTotal: orderTotal,
      cartItems: cartItems,
      paymentMethod: paymentMethod,
    });

    const createdOrder = await order.save();

    res.status(201).send(createdOrder);
  } catch (err) {
    next(err);
  }
};

const updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).orFail();

    order.isPaid = true;
    order.paidAt = Date.now();
    const updatedOrder = await order.save();
    res.send(updatedOrder);
  } catch (err) {
    next(err);
  }
};

const updateOrderToDelivered = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).orFail();
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.send(updatedOrder);
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('user', '-password')
      .sort({ paymentMethod: 'desc' });
    res.send(orders);
  } catch (err) {
    next(err);
  }
};

const getOrderForAnalysis = async (req, res, next) => {
  try {
    const start = new Date(req.params.date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(req.params.date);
    end.setHours(23, 59, 59, 999);
    const order = await Order.find({
      createdAt: { $gte: start, $lte: end },
    }).sort({ createdAt: 'asc' });
    res.send(order);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserOrders,
  getOrder,
  createOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
  getOrderForAnalysis,
};
