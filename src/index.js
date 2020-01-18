require('dotenv').config()
const container = require('./container')
const app = container.resolve('application')

// sampler factory folder contains jobs that get initialized within dic
// intention: a generic solution for static polling of device data
// "pseudo-subscription" in case you have a non reactive backend (no streams available)
// COMMENTED OUT: for now just an example
//require('./infrastructure/sampler-factory')(container)

app.start().catch(error => {
  app.log.error(error)
  process.exit()
})
