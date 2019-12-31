const pidusage = require('pidusage')
const os = require('os')

const name = 'medium-sample'
let interval =  5000
const run = async ({ samplerLog: log, config }) => {
  return new Promise(async (resolve, reject) => {
    try {
      log.info('Medium pace sample example')
      const stats = await pidusage(process.pid)
      const cores = os.cpus().length
      const cpu = stats.cpu / cores
      const dto = {
        name,
        interval,
        cpuLoad: cpu.toFixed(1),
        memoryLoad: (stats.memory / 1024 / 1024).toFixed(1),
      }
      resolve(dto)
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = {
  name,
  interval,
  run,
}
