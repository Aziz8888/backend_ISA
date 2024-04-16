// authMiddleware.js
import jwt from 'jsonwebtoken';

export const checkAuthenticated = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Assumes Bearer token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // If you want to attach the user information to the request object
    req.userData = { userId: decodedToken.userId };

    next();
  } catch (error) {
    res.status(401).json({
      message: 'You are not authenticated!'
    });
  }
};
