const { createContainer, asValue, asClass, asFunction } = require('awilix')

const { Config } = require('../config')
const { Logger } = require('./logger')
const { Server, Router } = require('./http')
const { Application } = require('./application')
const { FlashApi } = require('./socket-io')

const container = createContainer()

container.register({
  config: asValue(Config),
  application: asClass(Application).singleton(),
  httpServer: asClass(Server).singleton(),
  httpRouter: asFunction(Router).singleton(),
  flashApi: asFunction(FlashApi).singleton(),
})

// Register middleware
container.register({
  // container middleware for scoped route injection
  containerMiddleware: asValue(container),

  // some separate logger instances
  appLog: asFunction(Logger, {
    injector: () => ({
      name: 'app',
    }),
  }).singleton(),

  httpLog: asFunction(Logger, {
    injector: () => ({
      name: 'http',
    }),
  }).singleton(),

  samplerLog: asFunction(Logger, {
    injector: () => ({
      name: 'sampler',
    }),
  }).singleton(),
})

module.exports = container
