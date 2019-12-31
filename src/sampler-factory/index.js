const { asFunction } = require('awilix')
const jobs = require('./jobs')

module.exports = container => {
  const log = container.resolve('samplerLog')

  Object.keys(jobs).forEach(key => {
    const job = jobs[key]

    log.info(`Running job "${job.name}" cyclically, interval is ${job.interval}`)
    //important heavy looped jobs need to be resolved before running in loop
    const jobResolver = asFunction(job.run).disposer(() => clearInterval(interval))
    const interval = setInterval(() => {
      container
        .build(jobResolver)
        .then(result => {
          log.info(result)
        })
        .catch(e => {
          log.error(`Job "${job.name}" failed. Retry in ${job.interval / 1000} sec.`, e)
        })
    }, job.interval)
  })
}
