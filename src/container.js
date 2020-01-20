const { createContainer, asValue, asClass, asFunction } = require('awilix')
const { scopePerRequest } = require('awilix-express')
const { Config } = require('../config')
const { Logger } = require('./infrastructure/logger')
const { Server, Router } = require('./interfaces/http')
const { auth } = require('./interfaces/http/middleware')
const Application = require('./application')
const { FlashApi } = require('./interfaces/socket-io')
const { Mongo, UserModel, ProfileModel, FeedbackModel } = require('./infrastructure/db')
const { Feedback, User } = require('./application/use-cases')
const { Mailer } = require('./infrastructure/sendgrid')

const container = createContainer()

container.register({
  config: asValue(Config),
  mongo: asClass(Mongo).singleton(),
  application: asClass(Application).singleton(),
  httpServer: asClass(Server).singleton(),
  httpRouter: asFunction(Router).singleton(),
  flashApi: asFunction(FlashApi).singleton(),
  auth: asFunction(auth).singleton(),
  mailer: asClass(Mailer).singleton(),

  //models
  userModel: asFunction(UserModel).singleton(),
  profileModel: asFunction(ProfileModel).singleton(),
  feedbackModel: asFunction(FeedbackModel).singleton(),

  //use-cases
  feedback: asFunction(Feedback).singleton(),
  user: asFunction(User).singleton(),

  // container middleware for scoped route injection
  containerMiddleware: asValue(scopePerRequest(container)),
  // some separate logger instances
  appLog: asFunction(Logger, {
    injector: () => ({
      name: 'app',
    }),
  }).singleton(),

  samplerLog: asFunction(Logger, {
    injector: () => ({
      name: 'sampler',
    }),
  }).singleton(),

  httpLog: asFunction(Logger, {
    injector: () => ({
      name: 'http',
    }),
  }).singleton(),
})

module.exports = container
