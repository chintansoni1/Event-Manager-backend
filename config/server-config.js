'use strict'

import path from 'path'

const ROOT_DIR = path.dirname(require.main.filename)
const {
  PORT = 4000
} = process.env
const SERVER_CONFIG = {
  PORT,
  ROOT_DIR
}

export {
  SERVER_CONFIG
}