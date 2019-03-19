'use strict';

import UserRouter from './user';
import EventRouter from './event';

let Routes = [{
    path: '/user',
    router: UserRouter.Router
  },
  {
    path: '/event',
    router: EventRouter.Router
  }
]

Routes.init = (app) => {
  if (!app || !app.use) {
    console.error('[Error] Route Initialization Failed: app / app.use is undefined')
    return process.exit(1)
  }

  Routes.forEach(route => app.use(route.path, route.router))

  app.use('*', (request, response, next) => {
    const message = ['Cannot', request.method, request.originalUrl].join(' ')
    response.status(500).send(message);
    next()
  })

  app.use((error, request, response, next) => {
    if (!error) {
      return
    }
    return response.status(500).send(error)
  })
}

export {
  Routes
}