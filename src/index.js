const container = require('./container')

const config = container.resolve('config')
const httpServer = container.resolve('httpServer')
const app = container.resolve('application')

// sampler factory folder contains jobs that get initialized within dic
// intention: a generic solution for static polling of device data
// "pseudo-subscription" in case you have a non reactive backend (no streams available)
// COMMENTED OUT: for now just an example
//require('./sampler-factory')(container)

// this wait is qnd solution to wait until di-container is initialized
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

// app modules entry point
wait(config.app.startupDelay)
  .then(() => httpServer.start())
  .then(() => app.start())
  .catch(error => {
    app.log.error(error)
    throw new Error(`Critical error ${error}`)
  })
