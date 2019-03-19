'use strict'
import dotenv from 'dotenv'
dotenv.config()

// MongoDB Configuration to required establish connection
const MONGO_CONFIG = {
  DBNAME: process.env.NODE_ENV === 'config' ? 'followMyLeadsTest' : process.env.MONGO_DBNAME,
  HOST: process.env.MONGO_HOST,
  PORT: process.env.MONGO_PORT,
  USERNAME: process.env.MONGO_USERNAME,
  PASSWORD: process.env.MONGO_PASSWORD,
  OPTIONS: {
    useNewUrlParser: true,
    poolSize: 5
  }
}

MONGO_CONFIG.CONNECTION_URI = [
  'mongodb://',
  MONGO_CONFIG.USERNAME, ':', MONGO_CONFIG.PASSWORD,
  '@',
  MONGO_CONFIG.HOST, ':', MONGO_CONFIG.PORT,
  '/',
  MONGO_CONFIG.DBNAME
].join('')

// Terminate Server if any DB Configuration is missing
Object.keys(MONGO_CONFIG).forEach(function (key) {
  // if (!MONGO_CONFIG[key]) {
  //   console.error("[Error] Missing MongoDB Config:", key)
  //   return process.exit(1)
  // }
})

export {
  MONGO_CONFIG
}