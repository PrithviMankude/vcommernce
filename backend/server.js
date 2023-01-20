const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const apiRoutes = require('./routes/apiRoutes');
const connectDb = require('./config/db');

app.use(express.json());
app.use(fileUpload());
app.use(cookieParser());

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.json({ msg: 'API Running...' });
});

//Mongo Connection
connectDb();

/****************************/
//Error Handling MW

app.use((error, req, res, next) => {
  console.error(error);
  next(error);
});

app.use((error, req, res, next) => {
  res.status(500).json({
    message: error.message,
    stack: error.stack,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
