const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const userRoutes = require('./userRoutes');
const orderRoutes = require('./orderRoutes');

app.get('/get-token', (req, res) => {
  try {
    const accessToken = req.cookies['access_token'];
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    return res
      .status(200)
      .json({ token: decoded.name, isAdmin: decoded.isAdmin });
  } catch (error) {
    res.status(401).send('Unauthorized, Invalid token');
  }
});

app.get('/logout', (req, res) => {
  return res
    .clearCookie('access_token')
    .status(200)
    .send('access token cleared');
});

app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/users', userRoutes);
app.use('/orders', orderRoutes);

module.exports = app;
