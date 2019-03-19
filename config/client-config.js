'use strict'

import dotenv from 'dotenv'
dotenv.config()

const CLIENT_CONFIG = {
  BASE_URL: process.env.CLIENT_URL
};

export {
  CLIENT_CONFIG
}