'use strict'
import * as Models from '../models'
import Express from 'express'
import verifyToken from '../../utils/verify-token';
import {
  body,
  validationResult
} from 'express-validator/check'
import Validators from '../../utils/validators';
import Moment from 'moment';

const eventModel = new Models.EventModel()
const Router = Express.Router()
Router.post('', verifyToken, [
  body('name').isLength({
    min: 1
  }).withMessage('Must be at least 1 character long'),
  body('description').isLength({
    min: 10
  }).withMessage('Must be at least 10 characters long'),
  body('startDate').not().isEmpty(),
  body('startDate').custom(startDate => {
    const date = Moment(startDate, 'YYYY-MM-DD', true);
    if (!date.isValid()) {
      throw new Error('Invalid start date');
    }
    return true;
  }),
  body('endDate').not().isEmpty(),
  body('endDate').custom(endDate => {
    const date = Moment(endDate, 'YYYY-MM-DD', true);
    if (!date.isValid()) {
      throw new Error('Invalid end date');
    }
    return true;
  }),
], async (req, res, next) => {
  try {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req).array({
      onlyFirstError: true
    });
    if (errors.length) {
      return res.status(422).json({
        errors: errors
      });
    } else {
      req.body.organizer = req.userId;
      eventModel.add(req, res);
    }
  } catch (err) {
    next(err)
  }
})

Router.get('/user/:userId', verifyToken, (req, res) => {
  try {
    eventModel.getEventsByUser(req, res);
  } catch (err) {
    next(err)
  }
})

export default {
  Router,
  eventModel
}