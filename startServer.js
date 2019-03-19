"use strict";

import async from "async";
import MongoClient from "mongodb";
import {
  SERVER_CONFIG,
  MONGO_CONFIG
} from "./config";

const {
  PORT
} = SERVER_CONFIG;

const startServer = (app) => {
  async.series([
    // Connect DB
    async next => {
      console.log('[Info] Connecting to DB...')
      const {
        CONNECTION_URI,
        OPTIONS,
        DBNAME
      } = MONGO_CONFIG;
      if (!DBNAME) {
        return process.nextTick(next);
      }
      let client = await MongoClient.connect(CONNECTION_URI, OPTIONS);
      let db = client.db(DBNAME);
       if(db){
        console.log(
          "[Info] MongoDB Connection to Database '" +
          DBNAME +
          "' Successful!"
        );
        app.locals.db = db;
        next(null);
      }
      else {
        console.log(error)
        next("[Error] MongoDB Connection Error: ", error)
      }
    },
    next => {
      console.log('[Info] Starting Server...')
      app.listen(PORT, () => console.log('[Info] Server Started Successfully! Listening on Port:', PORT)).on('error', (err) => {
        if (err.errno === 'EADDRINUSE') {
          console.log(`----- Port ${PORT} is busy,`)
          next(null)
        } else {
          next(err)
        }
      });
    }
  ], error => {
    if (error) {
      console.error(error)
      return process.exit(-1)
    }
    console.log('Connection and server started successfully')
  })
}

export default startServer;