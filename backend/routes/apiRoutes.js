const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const userRoutes = require('./userRoutes');
const orderRoutes = require('./orderRoutes');
const paymentRoutes = require('./payment');

console.log('In API routes server file');

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
  console.log('Logout server called');
  return res
    .clearCookie('access_token')
    .status(200)
    .send('access token cleared');
});

app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/users', userRoutes);
app.use('/orders', orderRoutes);
app.use('/payments', paymentRoutes);

app.get('/', (req, res) => {
  res.send('In /api route');
});

module.exports = app;
