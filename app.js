'use strict'

import Express from 'express'
import startServer from './startServer'
import cors from 'cors'
import bodyParser from 'body-parser'
import expressValidator from 'express-validator'
import {
  Routes
} from './api/routes'

const app = new Express()

// Middleware Initializations
app.use(cors())
app.use(bodyParser.json({
  limit: '50mb'
}))
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit: 50000
}))

// Initialize Routes
Routes.init(app)

// Start Server
startServer(app)

export default app;