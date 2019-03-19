'use strict'
import * as Models from '../models'
import Express from 'express'
import verifyToken from '../../utils/verify-token';
import {
  body,
  validationResult
} from 'express-validator/check'
import bcrypt from 'bcrypt';

const userModel = new Models.UserModel()
const Router = Express.Router()
const SALT_ROUNDS = 10

Router.post('/login', async (req, res, next) => {
  try {
    userModel.findUser(req, res)
  } catch (err) {
    next(err)
  }
})

Router.post('/sign-up', [
  // username must be an email
  body('emailId').isEmail().withMessage('Invalid email address'),
  // password must be at least 5 chars long
  body('password').isLength({
    min: 5
  }).withMessage('Must be at least 5 characters long')
], async (req, res, next) => {
  try {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array()
      });
    }
    bcrypt.hash(req.body.password, SALT_ROUNDS, function (err, hash) {
      req.body.password = hash
      userModel.add(req, res)
    });
  } catch (err) {
    next(err)
  }
})

Router.post('/profile', verifyToken, (req, res) => {
  try {
    userModel.getUserInfo(req, res)
  } catch (err) {
    next(err)
  }
})

Router.put('/forgot-password', (req, res) => {
  try {
    userModel.forgotPassword(req, res)
  } catch (err) {
    next(err)
  }
})

Router.put('/reset-password', verifyToken, [ // password must be at least 5 chars long
  body('password').isLength({
    min: 5
  }).withMessage('Must be at least 5 characters long')
], async (req, res, next) => {
  try {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array()
      });
    }
    bcrypt.hash(req.body.password, SALT_ROUNDS, function (err, hash) {
      req.body.password = hash
      userModel.resetPassword(req, res)
    });
  } catch (err) {
    next(err)
  }
})

Router.get('/autosuggest', (req, res) => {
  try {
    userModel.findUsersByName(req, res)
  } catch (err) {
    next(err)
  }
})

Router.get('/', (req, res) => {
  try {
    userModel.getUsers(req, res)
  } catch (err) {
    next(err)
  }
})

export default {
  Router,
  userModel
}