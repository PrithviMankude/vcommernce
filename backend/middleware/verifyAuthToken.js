const jwt = require('jsonwebtoken');

const verifyIsLoggedIn = (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      res.status(403).send('Valid token is required for authentication');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).send('Unauthorized. Invalid token');
    }
  } catch (error) {
    next(error);
  }
};

const verifyIsAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res
      .status(401)
      .send('Unauthorized . Admin privileges required to access this');
  }
};

module.exports = { verifyIsLoggedIn, verifyIsAdmin };
