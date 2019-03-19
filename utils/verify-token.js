import jwt from 'jsonwebtoken';
import {
  JWT_CONFIG
} from '../config/'

export default function verifyToken(req, res, next) {
  var token = req.headers['x-access-token'];
  if (!token)
    return res.status(403).send({
      auth: false,
      message: 'No token provided.'
    })
  jwt.verify(token, JWT_CONFIG.secret, function (err, decoded) {
    if (err)
      return res.status(401).send({
        auth: false,
        message: 'Failed to authenticate token.'
      })
    // if everything good, save to request for use in other routes
    req.userId = decoded.id
    next()
  });
}